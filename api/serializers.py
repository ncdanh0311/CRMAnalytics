from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from customers.models import Customer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["role"] = getattr(user, "role", "user")
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "role": getattr(self.user, "role", "user"),
        }
        return data


class CustomerSerializer(serializers.ModelSerializer):
    sentiment = serializers.CharField(source="sentiment_label", read_only=True)
    sentiment_emoji = serializers.CharField(read_only=True)

    class Meta:
        model = Customer
        fields = [
            "id",
            "customer_id",
            "name",
            "group_name",
            "gender",
            "phone",
            "email",
            "customer_type",
            "cmnd",
            "birth_date",
            "address",
            "product",
            "quantity",
            "unit_price",
            "total_amount",
            "feedback",
            "sentiment",
            "sentiment_label",
            "sentiment_score",
            "satisfaction_label",
            "cluster_id",
            "created_at",
            "updated_at",
            "sentiment_emoji",
        ]
        read_only_fields = [
            "total_amount",
            "sentiment",
            "sentiment_label",
            "sentiment_score",
            "satisfaction_label",
            "cluster_id",
            "created_at",
            "updated_at",
            "sentiment_emoji",
        ]
