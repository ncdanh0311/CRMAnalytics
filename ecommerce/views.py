from django.shortcuts import render
from .models import Product, Order
from .ai import get_recommendations, get_revenue_forecast

def index(request):
    products = Product.objects.all()
    orders = Order.objects.all().order_by('-date')[:5]
    
    categories = list(Product.objects.values_list('category', flat=True).distinct())
    
    insights = []
    if categories:
        cat = categories[0]
        insights.append({
            'category': cat,
            'recommendations': get_recommendations(cat),
            'forecast': get_revenue_forecast()
        })
            
    return render(request, 'ecommerce/index.html', {
        'products': products,
        'orders': orders,
        'insights': insights
    })
