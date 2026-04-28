from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient

from customers.analytics import run_customer_clustering
from customers.models import Customer
from customers.tasks import analyze_customer_sentiment, process_customer_ai


User = get_user_model()


class CustomerAnalyticsTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="staff", password="pass123", role="user")
        self.admin = User.objects.create_user(username="admin", password="pass123", role="admin")

        self.customer_positive = Customer.objects.create(
            customer_id="KH001",
            name="Nguyen Van A",
            group_name="Doanh nghiep SME",
            gender="Nam",
            customer_type="VIP",
            product="CRM nang cao",
            quantity=2,
            unit_price=5000000,
            feedback="Dich vu rat tot va nhan vien ho tro nhanh.",
        )
        self.customer_negative = Customer.objects.create(
            customer_id="KH002",
            name="Tran Thi B",
            group_name="Ban le",
            gender=Customer.GENDER_CHOICES[1][0],
            customer_type=Customer.CUSTOMER_TYPE_CHOICES[1][0],
            product="Goi CSKH",
            quantity=8,
            unit_price=1500000,
            feedback="He thong loi va xu ly cham, toi khong hai long.",
        )
        self.customer_low_value = Customer.objects.create(
            customer_id="KH003",
            name="Le Van C",
            group_name="Online",
            gender="Nam",
            customer_type=Customer.CUSTOMER_TYPE_CHOICES[1][0],
            product="SMS marketing",
            quantity=1,
            unit_price=700000,
            feedback="Tam on.",
        )

    def test_sentiment_is_computed_in_sync_mode(self):
        self.assertEqual(self.customer_positive.sentiment_label, "positive")
        self.assertEqual(self.customer_positive.satisfaction_label, "satisfied")
        self.assertEqual(self.customer_negative.sentiment_label, "negative")

    def test_clustering_returns_business_profiles(self):
        result = run_customer_clustering(n_clusters=3, persist=True)

        self.assertEqual(result.n_clusters, 3)
        self.assertEqual(len(result.summaries), 3)
        self.assertTrue(any(item["profile_key"] == "vip_high_value" for item in result.summaries))
        self.assertTrue(any(item["profile_key"] == "churn_risk" for item in result.summaries))
        self.customer_positive.refresh_from_db()
        self.assertIsNotNone(self.customer_positive.cluster_id)

    @override_settings(AI_ASYNC_ENABLED=True)
    def test_process_customer_ai_task_updates_fields(self):
        customer = Customer.objects.create(
            customer_id="KH004",
            name="Pham Thi D",
            group_name="Ban le",
            gender=Customer.GENDER_CHOICES[1][0],
            customer_type=Customer.CUSTOMER_TYPE_CHOICES[1][0],
            product="CRM co ban",
            quantity=3,
            unit_price=900000,
            feedback="San pham tot va rat de dung.",
        )

        self.assertEqual(customer.sentiment_label, "")
        result = process_customer_ai(customer.pk)
        customer.refresh_from_db()

        self.assertEqual(result["status"], "processed")
        self.assertEqual(customer.sentiment_label, "positive")
        self.assertIsNotNone(customer.cluster_id)


class CustomerWebAndApiTests(TestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(username="staff", password="pass123", role="user")
        self.admin = User.objects.create_user(username="admin", password="pass123", role="admin")
        self.customer = Customer.objects.create(
            customer_id="KH100",
            name="Vo Minh E",
            group_name="SME",
            gender="Nam",
            customer_type="VIP",
            product="CRM co ban",
            quantity=4,
            unit_price=1200000,
            feedback="Toi rat hai long voi chat luong ho tro.",
        )

    def test_dashboard_requires_login(self):
        response = self.client.get(reverse("customers:dashboard"))
        self.assertEqual(response.status_code, 302)

    def test_dashboard_renders_for_authenticated_user(self):
        self.client.login(username="staff", password="pass123")
        response = self.client.get(reverse("customers:dashboard"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.customer.name)

    def test_api_cluster_endpoint_returns_summaries(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get(reverse("api:customer-cluster"), {"k": 2})

        self.assertEqual(response.status_code, 200)
        self.assertIn("summaries", response.data)
        self.assertGreaterEqual(len(response.data["summaries"]), 1)

    def test_delete_requires_admin_role(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.delete(reverse("api:customer-detail", args=[self.customer.pk]))
        self.assertEqual(response.status_code, 403)

        admin_client = APIClient()
        admin_client.force_authenticate(user=self.admin)
        response = admin_client.delete(reverse("api:customer-detail", args=[self.customer.pk]))
        self.assertEqual(response.status_code, 204)


class CustomerTaskUnitTests(TestCase):
    @override_settings(AI_ASYNC_ENABLED=True)
    def test_analyze_customer_sentiment_task_clears_blank_feedback(self):
        customer = Customer.objects.create(
            customer_id="KH777",
            name="Blank Feedback",
            group_name="SME",
            gender="Nam",
            customer_type="VIP",
            product="CRM",
            quantity=1,
            unit_price=1000000,
            feedback="",
        )
        customer.sentiment_label = "positive"
        customer.satisfaction_label = "satisfied"
        customer._skip_sentiment = True
        customer.save(update_fields=["sentiment_label", "satisfaction_label"])

        result = analyze_customer_sentiment(customer.pk)
        customer.refresh_from_db()

        self.assertEqual(result["status"], "cleared")
        self.assertEqual(customer.sentiment_label, "")
        self.assertEqual(customer.satisfaction_label, "")
