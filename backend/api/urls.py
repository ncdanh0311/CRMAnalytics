from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserViewSet, ProductViewSet, ReviewViewSet, 
    OrderViewSet, WalletViewSet, TransactionViewSet, AdminStatsView,
    ImageUploadView, MultiImageUploadView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'products', ProductViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'wallets', WalletViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('admin/upload-image/', ImageUploadView.as_view(), name='upload_image'),
    path('admin/upload-images/', MultiImageUploadView.as_view(), name='upload_images'),
    path('', include(router.urls)),
]
