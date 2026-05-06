from .models import Product
import random

def get_recommendations(category):
    return list(Product.objects.filter(category=category).order_by('?')[:3])

def get_revenue_forecast():
    return {
        "forecasted_revenue": random.randint(10000, 50000),
        "confidence": 0.92
    }
