from django.contrib import messages
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from accounts.forms import LoginForm, RegisterForm
from accounts.models import User


def login_view(request):
    if request.user.is_authenticated:
        return redirect('customers:dashboard')

    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f'Chào mừng, {user.username}! Đăng nhập thành công.')
            next_url = request.GET.get('next', 'customers:dashboard')
            return redirect(next_url)
        else:
            messages.error(request, 'Tên đăng nhập hoặc mật khẩu không đúng.')
    else:
        form = LoginForm(request)

    return render(request, 'accounts/login.html', {'form': form})


def logout_view(request):
    if request.method == 'POST':
        logout(request)
        messages.info(request, 'Bạn đã đăng xuất thành công.')
    return redirect('accounts:login')


@login_required
def register_view(request):
    if not request.user.is_admin_user():
        messages.error(request, 'Chỉ quản trị viên mới có thể tạo tài khoản mới.')
        return redirect('customers:dashboard')

    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            target_role = form.cleaned_data.get('role')
            if target_role == 'admin' and not request.user.is_admin_user():
                messages.error(request, 'Chỉ admin mới được tạo tài khoản admin.')
                return render(request, 'accounts/register.html', {'form': form})
            user = form.save()
            messages.success(request, f'Tạo tài khoản "{user.username}" ({user.get_role_display()}) thành công!')
            return redirect('accounts:register')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'{error}')
    else:
        form = RegisterForm()

    users = User.objects.all().order_by('-date_joined')
    return render(request, 'accounts/register.html', {'form': form, 'users': users})
