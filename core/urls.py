from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('ecommerce/', include('ecommerce.urls')),
    
    path('', lambda request: redirect('ecommerce_index'), name='home'),
]
