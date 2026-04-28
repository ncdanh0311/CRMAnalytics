from django.urls import path
from customers import views

app_name = 'customers'

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),
    path('list/', views.customer_list_view, name='list'),
    path('add/', views.customer_add_view, name='add'),
    path('<int:pk>/', views.customer_detail_view, name='detail'),
    path('<int:pk>/edit/', views.customer_edit_view, name='edit'),
    path('<int:pk>/delete/', views.customer_delete_view, name='delete'),
]
