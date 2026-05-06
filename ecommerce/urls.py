from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='ecommerce_index'),
]
