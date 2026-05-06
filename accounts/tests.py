"""
accounts/tests.py — Unit tests cho authentication và authorization logic.

Test Coverage:
- User model: role methods, str representation
- Login view: valid credentials, invalid credentials, redirect
- Logout view: POST required, session cleared
- Register view: admin-only access, user creation, password validation
- Authentication forms: LoginForm, RegisterForm
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

User = get_user_model()


# ─── Helpers ─────────────────────────────────────────────────────────────────
def make_admin(username="admin_test"):
    return User.objects.create_user(
        username=username, password="adminpass123", role="admin"
    )


def make_staff(username="staff_test"):
    return User.objects.create_user(
        username=username, password="staffpass123", role="user"
    )


# ─────────────────────────────────────────────────────────────────────────────
# 1. User Model Tests
# ─────────────────────────────────────────────────────────────────────────────
class UserModelTests(TestCase):

    def test_is_admin_user_returns_true_for_admin_role(self):
        admin = make_admin()
        self.assertTrue(admin.is_admin_user())

    def test_is_admin_user_returns_false_for_user_role(self):
        staff = make_staff()
        self.assertFalse(staff.is_admin_user())

    def test_str_includes_username_and_role(self):
        admin = make_admin(username="boss")
        self.assertIn("boss", str(admin))
        self.assertIn("Quản trị viên", str(admin))

    def test_default_role_is_user(self):
        user = User.objects.create_user(username="newbie", password="pass123")
        self.assertEqual(user.role, "user")
        self.assertFalse(user.is_admin_user())

    def test_get_role_display_admin(self):
        admin = make_admin()
        self.assertEqual(admin.get_role_display(), "Quản trị viên")

    def test_get_role_display_user(self):
        staff = make_staff()
        self.assertEqual(staff.get_role_display(), "Nhân viên")


# ─────────────────────────────────────────────────────────────────────────────
# 2. Login View Tests
# ─────────────────────────────────────────────────────────────────────────────
class LoginViewTests(TestCase):

    def setUp(self):
        self.admin = make_admin()
        self.staff = make_staff()
        self.login_url = reverse("accounts:login")

    def test_login_page_loads(self):
        resp = self.client.get(self.login_url)
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "Đăng nhập")

    def test_authenticated_user_redirected_from_login(self):
        self.client.login(username="admin_test", password="adminpass123")
        resp = self.client.get(self.login_url)
        self.assertEqual(resp.status_code, 302)

    def test_valid_login_redirects_to_dashboard(self):
        resp = self.client.post(self.login_url, {
            "username": "admin_test",
            "password": "adminpass123",
        })
        self.assertEqual(resp.status_code, 302)
        self.assertIn("/customers/", resp["Location"])

    def test_invalid_password_returns_error(self):
        resp = self.client.post(self.login_url, {
            "username": "admin_test",
            "password": "wrongpassword",
        })
        self.assertEqual(resp.status_code, 200)
        # Check for error message
        messages = list(resp.wsgi_request._messages)
        self.assertTrue(
            any("không đúng" in str(m) or "error" in str(m.tags) for m in messages)
        )

    def test_nonexistent_user_returns_error(self):
        resp = self.client.post(self.login_url, {
            "username": "ghost_user",
            "password": "whatever",
        })
        self.assertEqual(resp.status_code, 200)

    def test_staff_can_also_login(self):
        resp = self.client.post(self.login_url, {
            "username": "staff_test",
            "password": "staffpass123",
        })
        self.assertEqual(resp.status_code, 302)


# ─────────────────────────────────────────────────────────────────────────────
# 3. Logout View Tests
# ─────────────────────────────────────────────────────────────────────────────
class LogoutViewTests(TestCase):

    def setUp(self):
        self.admin = make_admin()
        self.logout_url = reverse("accounts:logout")

    def test_logout_via_post_redirects_to_login(self):
        self.client.login(username="admin_test", password="adminpass123")
        resp = self.client.post(self.logout_url)
        self.assertEqual(resp.status_code, 302)
        self.assertIn("/accounts/login/", resp["Location"])

    def test_after_logout_user_not_authenticated(self):
        self.client.login(username="admin_test", password="adminpass123")
        self.client.post(self.logout_url)
        # Try accessing protected page
        resp = self.client.get(reverse("customers:dashboard"))
        self.assertEqual(resp.status_code, 302)
        self.assertIn("/accounts/login/", resp["Location"])


# ─────────────────────────────────────────────────────────────────────────────
# 4. Register View Tests
# ─────────────────────────────────────────────────────────────────────────────
class RegisterViewTests(TestCase):

    def setUp(self):
        self.admin = make_admin()
        self.staff = make_staff()
        self.register_url = reverse("accounts:register")

    def test_register_view_requires_login(self):
        resp = self.client.get(self.register_url)
        self.assertEqual(resp.status_code, 302)
        self.assertIn("/accounts/login/", resp["Location"])

    def test_staff_cannot_access_register(self):
        self.client.login(username="staff_test", password="staffpass123")
        resp = self.client.get(self.register_url)
        # Should redirect with error
        self.assertEqual(resp.status_code, 302)

    def test_admin_can_access_register(self):
        self.client.login(username="admin_test", password="adminpass123")
        resp = self.client.get(self.register_url)
        self.assertEqual(resp.status_code, 200)

    def test_admin_can_create_new_user(self):
        self.client.login(username="admin_test", password="adminpass123")
        resp = self.client.post(self.register_url, {
            "username": "new_employee",
            "password": "emp123",
            "password2": "emp123",
            "role": "user",
        })
        self.assertEqual(resp.status_code, 302)
        self.assertTrue(User.objects.filter(username="new_employee").exists())

    def test_mismatched_passwords_rejected(self):
        self.client.login(username="admin_test", password="adminpass123")
        resp = self.client.post(self.register_url, {
            "username": "mismatch_user",
            "password": "abc123",
            "password2": "xyz999",
            "role": "user",
        })
        self.assertEqual(resp.status_code, 200)
        self.assertFalse(User.objects.filter(username="mismatch_user").exists())

    def test_duplicate_username_rejected(self):
        self.client.login(username="admin_test", password="adminpass123")
        resp = self.client.post(self.register_url, {
            "username": "admin_test",   # already exists
            "password": "abc123",
            "password2": "abc123",
            "role": "user",
        })
        self.assertEqual(resp.status_code, 200)
        # Only one user with this username should exist
        self.assertEqual(User.objects.filter(username="admin_test").count(), 1)

    def test_register_page_lists_existing_users(self):
        self.client.login(username="admin_test", password="adminpass123")
        resp = self.client.get(self.register_url)
        self.assertContains(resp, "admin_test")
        self.assertContains(resp, "staff_test")


# ─────────────────────────────────────────────────────────────────────────────
# 5. Form Validation Tests
# ─────────────────────────────────────────────────────────────────────────────
class AccountsFormTests(TestCase):

    def test_login_form_valid_with_correct_credentials(self):
        from accounts.forms import LoginForm
        from django.test import RequestFactory

        User.objects.create_user(username="form_user", password="formpass123")
        factory = RequestFactory()
        request = factory.post("/login/")
        # AuthenticationForm needs a request; mock it
        form = LoginForm(request, data={
            "username": "form_user",
            "password": "formpass123",
        })
        self.assertTrue(form.is_valid())

    def test_register_form_password_mismatch(self):
        from accounts.forms import RegisterForm

        form = RegisterForm(data={
            "username": "newuser",
            "password": "abc123",
            "password2": "xyz999",
            "role": "user",
        })
        self.assertFalse(form.is_valid())
        self.assertIn("password2", form.errors)

    def test_register_form_valid(self):
        from accounts.forms import RegisterForm

        form = RegisterForm(data={
            "username": "validnewuser",
            "password": "abc123",
            "password2": "abc123",
            "role": "user",
        })
        self.assertTrue(form.is_valid())
