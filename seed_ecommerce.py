import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from ecommerce.models import Product, Order
from django.contrib.auth import get_user_model

User = get_user_model()

def seed():
    # Categories
    categories = ['Laptop', 'Audio', 'Smart Home']
    
    # Create 20 products
    products_data = []
    for i in range(20):
        cat = random.choice(categories)
        products_data.append(Product(
            name=f"Tech Item {i+1} ({cat})",
            price=random.uniform(50.0, 2000.0),
            stock=random.randint(10, 100),
            category=cat
        ))
    
    if Product.objects.count() < 20:
        Product.objects.bulk_create(products_data)
        print("Created 20 products.")
    else:
        print("Products already exist.")
        
    products = list(Product.objects.all())
    
    # Create a user if none exists
    user, created = User.objects.get_or_create(username="seeduser", email="seed@example.com")
    if created:
        user.set_password("password123")
        user.save()
        
    from ecommerce.models import Profile
    profile, p_created = Profile.objects.get_or_create(user=user)
    if p_created:
        profile.points = 2450
        profile.save()
        
    # Create 50 fake orders
    if Order.objects.count() < 50:
        orders_data = []
        for _ in range(50):
            orders_data.append(Order(
                user=user,
                product=random.choice(products)
            ))
        Order.objects.bulk_create(orders_data)
        print("Created 50 orders.")
    else:
        print("Orders already exist.")

if __name__ == '__main__':
    seed()
