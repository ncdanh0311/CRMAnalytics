from django.contrib import admin
from customers.models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = [
        'customer_id', 'name', 'customer_type', 'phone', 'email',
        'satisfaction_label', 'cluster_id', 'total_amount', 'created_at',
    ]
    list_filter = ['customer_type', 'gender', 'group_name', 'satisfaction_label', 'cluster_id']
    search_fields = ['customer_id', 'name', 'phone', 'email', 'feedback']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
