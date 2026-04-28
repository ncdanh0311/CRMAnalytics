from django.conf import settings
from django.db import models
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from api.permissions import IsAdminOrReadWrite
from api.serializers import CustomTokenObtainPairSerializer, CustomerSerializer
from customers.analytics import build_revenue_trend, run_customer_clustering
from customers.models import Customer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@extend_schema_view(
    list=extend_schema(summary="List customers"),
    retrieve=extend_schema(summary="Get customer details"),
    create=extend_schema(summary="Create customer"),
    update=extend_schema(summary="Update customer"),
    partial_update=extend_schema(summary="Partially update customer"),
    destroy=extend_schema(summary="Delete customer (admin only)"),
)
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by("-created_at")
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadWrite]
    filterset_fields = [
        "customer_type",
        "gender",
        "group_name",
        "sentiment_label",
        "satisfaction_label",
        "cluster_id",
    ]
    search_fields = [
        "customer_id",
        "name",
        "phone",
        "email",
        "address",
        "product",
        "feedback",
    ]
    ordering_fields = ["created_at", "total_amount", "name", "quantity", "unit_price"]

    @extend_schema(summary="Customer statistics")
    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        total = Customer.objects.count()
        vip = Customer.objects.filter(customer_type="VIP").count()
        total_revenue = (
            Customer.objects.aggregate(total_revenue_sum=models.Sum("total_amount"))[
                "total_revenue_sum"
            ]
            or 0
        )
        return Response(
            {
                "total": total,
                "vip": vip,
                "regular": total - vip,
                "total_revenue": total_revenue,
            }
        )

    @extend_schema(summary="Run K-means clustering")
    @action(detail=False, methods=["get", "post"], url_path="cluster")
    def cluster(self, request):
        max_k = getattr(settings, "MAX_CLUSTER_COUNT", 6)
        raw_k = request.query_params.get("k") or request.data.get("k") or 3
        try:
            n_clusters = int(raw_k)
        except (TypeError, ValueError):
            n_clusters = 3
        n_clusters = max(1, min(n_clusters, max_k))

        result = run_customer_clustering(n_clusters=n_clusters, persist=True)
        return Response(
            {
                "n_clusters": result.n_clusters,
                "points": result.points,
                "centers": result.centers,
            }
        )

    @extend_schema(summary="Revenue trend and linear-regression forecast")
    @action(detail=False, methods=["get"], url_path="forecast")
    def forecast(self, request):
        trend = build_revenue_trend(months_ahead=3)
        return Response(trend, status=status.HTTP_200_OK)
