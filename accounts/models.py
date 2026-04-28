from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Quản trị viên'),
        ('user', 'Nhân viên'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user', verbose_name='Vai trò')

    class Meta:
        verbose_name = 'Người dùng'
        verbose_name_plural = 'Người dùng'

    def is_admin_user(self):
        return self.role == 'admin'

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
