from django import forms
from django.contrib.auth.forms import AuthenticationForm
from accounts.models import User


class LoginForm(AuthenticationForm):
    username = forms.CharField(
        label='Tên đăng nhập',
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Nhập tên đăng nhập...',
            'id': 'id_username',
            'autocomplete': 'username',
        })
    )
    password = forms.CharField(
        label='Mật khẩu',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Nhập mật khẩu...',
            'id': 'id_password',
            'autocomplete': 'current-password',
        })
    )


class RegisterForm(forms.ModelForm):
    ROLE_CHOICES = [
        ('user', 'Nhân viên'),
        ('admin', 'Quản trị viên'),
    ]
    password = forms.CharField(
        label='Mật khẩu',
        min_length=3,
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Nhập mật khẩu...',
            'id': 'id_reg_password',
        })
    )
    password2 = forms.CharField(
        label='Xác nhận mật khẩu',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Nhập lại mật khẩu...',
            'id': 'id_reg_password2',
        })
    )
    role = forms.ChoiceField(
        label='Vai trò',
        choices=ROLE_CHOICES,
        widget=forms.Select(attrs={'class': 'form-control', 'id': 'id_reg_role'})
    )

    class Meta:
        model = User
        fields = ['username', 'role']
        widgets = {
            'username': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Nhập tên đăng nhập...',
                'id': 'id_reg_username',
            }),
        }
        labels = {
            'username': 'Tên đăng nhập',
        }

    def clean_password2(self):
        p1 = self.cleaned_data.get('password')
        p2 = self.cleaned_data.get('password2')
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError('Mật khẩu xác nhận không khớp.')
        return p2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        user.role = self.cleaned_data['role']
        if commit:
            user.save()
        return user
