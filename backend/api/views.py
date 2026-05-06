from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User, Product, Category, Review, Order, Wallet, Transaction
from .serializers import (
    UserSerializer, ProductSerializer, ReviewSerializer, 
    OrderSerializer, WalletSerializer, TransactionSerializer
)
from .permissions import IsAdminRole, IsAdminOrReadOnly
from services.ai_service import analyze_sentiment
from services.analytics_service import segment_customers, forecast_revenue

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.is_superuser:
            return User.objects.all()
        return User.objects.filter(id=user.id)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        text = serializer.validated_data.get('text', '')
        sentiment = analyze_sentiment(text)
        serializer.save(user=self.request.user, sentiment=sentiment)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.is_superuser:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.is_superuser:
            return Wallet.objects.all()
        return Wallet.objects.filter(user=user)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.is_superuser:
            return Transaction.objects.all()
        return Transaction.objects.filter(wallet__user=user)

class AdminStatsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        orders = list(Order.objects.all().values('id', 'user_id', 'total_amount', 'created_at'))
        users = list(User.objects.all().values('id', 'email', 'created_at'))
        
        # 1. Customer Segmentation
        segments = segment_customers(users, orders)
        
        # Format segments for ApexCharts (Donut chart example)
        segment_counts = {}
        for s in segments:
            seg_name = s.get('segment', 'Unknown')
            segment_counts[seg_name] = segment_counts.get(seg_name, 0) + 1
            
        segment_series = list(segment_counts.values())
        segment_labels = list(segment_counts.keys())

        # 2. Revenue Forecasting
        revenue_data = forecast_revenue(orders)
        
        # Format revenue history for ApexCharts (Line/Area chart)
        revenue_history = revenue_data.get('history', [])
        history_series = [{
            "name": "Revenue",
            "data": [item['revenue'] for item in revenue_history]
        }]
        history_labels = [item['month'] for item in revenue_history]

        response_data = {
            "customer_segmentation": {
                "series": segment_series,
                "labels": segment_labels
            },
            "revenue_forecast": {
                "predicted_next_month": revenue_data.get('predicted_next_month'),
                "chart": {
                    "series": history_series,
                    "labels": history_labels
                }
            },
            "summary": {
                "total_users": len(users),
                "total_orders": len(orders),
                "total_revenue": sum(o['total_amount'] for o in orders)
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
