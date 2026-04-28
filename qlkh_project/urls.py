from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('customers/', include('customers.urls')),
    path('api/', include(('api.urls', 'api'), namespace='api')),
    path('', lambda request: redirect('customers:dashboard'), name='home'),
]
