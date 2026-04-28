import json
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.cache import cache
from django.core.paginator import Paginator
from django.db.models import Q, Sum, Count
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone

from customers.forms import CustomerForm
from customers.analytics import run_customer_clustering, build_revenue_trend
from customers.models import Customer


def admin_required(view_func):
    """Decorator: chỉ admin mới truy cập được."""
    @login_required
    def wrapper(request, *args, **kwargs):
        if not request.user.is_admin_user():
            messages.error(request, 'Bạn không có quyền thực hiện thao tác này. Chỉ quản trị viên được phép.')
            return redirect('customers:list')
        return view_func(request, *args, **kwargs)
    return wrapper


@login_required
def dashboard_view(request):
    """Trang tổng quan / dashboard."""
    total = Customer.objects.count()
    vip_count = Customer.objects.filter(customer_type='VIP').count()
    regular_count = total - vip_count
    total_revenue = Customer.objects.aggregate(total=Sum('total_amount'))['total'] or 0
    sentiment_stats = Customer.objects.values('satisfaction_label').annotate(total=Count('id'))
    sentiment_map = {'satisfied': 0, 'neutral': 0, 'dissatisfied': 0}
    for item in sentiment_stats:
        key = item['satisfaction_label']
        if key in sentiment_map:
            sentiment_map[key] = item['total']

    # Cache clustering 10 phút – tránh tính lại mỗi lần load trang
    CLUSTER_CACHE_KEY = 'dashboard_cluster_result'
    cluster_result = cache.get(CLUSTER_CACHE_KEY)
    if cluster_result is None:
        cluster_result = run_customer_clustering(n_clusters=3, persist=True)
        cache.set(CLUSTER_CACHE_KEY, cluster_result, timeout=600)

    # Cache revenue trend 10 phút
    TREND_CACHE_KEY = 'dashboard_trend_result'
    trend_result = cache.get(TREND_CACHE_KEY)
    if trend_result is None:
        trend_result = build_revenue_trend(months_ahead=3)
        cache.set(TREND_CACHE_KEY, trend_result, timeout=600)

    # Sản phẩm bán chạy nhất
    top_products = (
        Customer.objects
        .values('product')
        .annotate(total_qty=Sum('quantity'), total_rev=Sum('total_amount'))
        .order_by('-total_qty')
    )[:5]

    recent_customers = Customer.objects.order_by('-created_at')[:8]

    context = {
        'total': total,
        'vip_count': vip_count,
        'regular_count': regular_count,
        'total_revenue': total_revenue,
        'sentiment_counts': json.dumps(sentiment_map),
        'cluster_points': json.dumps(cluster_result.points),
        'cluster_centers': json.dumps(cluster_result.centers),
        'trend_data': json.dumps(trend_result),
        'top_products': top_products,
        'recent_customers': recent_customers,
    }
    return render(request, 'customers/dashboard.html', context)


@login_required
def customer_list_view(request):
    """Danh sách khách hàng với tìm kiếm và phân trang."""
    search = request.GET.get('q', '').strip()
    filter_type = request.GET.get('type', '').strip()
    page_num = request.GET.get('page', 1)
    page_size = 20

    qs = Customer.objects.all()
    if search:
        qs = qs.filter(
            Q(name__icontains=search) |
            Q(customer_id__icontains=search) |
            Q(phone__icontains=search) |
            Q(email__icontains=search) |
            Q(address__icontains=search) |
            Q(product__icontains=search)
        )
    if filter_type in ('VIP', 'Thường'):
        qs = qs.filter(customer_type=filter_type)

    qs = qs.order_by('-created_at')
    total_count = qs.count()

    paginator = Paginator(qs, page_size)
    page_obj = paginator.get_page(page_num)

    context = {
        'customers': page_obj,
        'page_obj': page_obj,
        'search': search,
        'filter_type': filter_type,
        'total_count': total_count,
    }
    return render(request, 'customers/list.html', context)


@login_required
def customer_detail_view(request, pk):
    """Chi tiết một khách hàng."""
    customer = get_object_or_404(Customer, pk=pk)
    return render(request, 'customers/detail.html', {'customer': customer})


@login_required
def customer_add_view(request):
    """Thêm khách hàng mới – xóa cache clustering sau khi lưu."""
    if request.method == 'POST':
        form = CustomerForm(request.POST)
        if form.is_valid():
            form.save()
            # Xóa cache để dashboard refresh dữ liệu mới
            cache.delete('dashboard_cluster_result')
            cache.delete('dashboard_trend_result')
            messages.success(request, f'Thêm khách hàng "{form.cleaned_data["name"]}" thành công!')
            return redirect('customers:list')
        else:
            for field, errors in form.errors.items():
                label = form.fields[field].label if field in form.fields else field
                for error in errors:
                    messages.error(request, f'{label}: {error}')
    else:
        form = CustomerForm()
    return render(request, 'customers/form.html', {'form': form, 'action': 'Thêm mới', 'is_add': True})


@login_required
def customer_edit_view(request, pk):
    """Chỉnh sửa thông tin khách hàng."""
    customer = get_object_or_404(Customer, pk=pk)
    if request.method == 'POST':
        form = CustomerForm(request.POST, instance=customer)
        if form.is_valid():
            form.save()
            # Xóa cache để dashboard cập nhật dữ liệu mới
            cache.delete('dashboard_cluster_result')
            cache.delete('dashboard_trend_result')
            messages.success(request, f'Cập nhật khách hàng "{customer.name}" thành công!')
            return redirect('customers:detail', pk=pk)
        else:
            for field, errors in form.errors.items():
                label = form.fields[field].label if field in form.fields else field
                for error in errors:
                    messages.error(request, f'{label}: {error}')
    else:
        form = CustomerForm(instance=customer)
    return render(request, 'customers/form.html', {
        'form': form,
        'customer': customer,
        'action': 'Chỉnh sửa',
        'is_add': False,
    })


@admin_required
def customer_delete_view(request, pk):
    """Xóa khách hàng (chỉ admin)."""
    customer = get_object_or_404(Customer, pk=pk)
    if request.method == 'POST':
        name = customer.name
        customer.delete()
        # Xóa cache để dashboard cập nhật dữ liệu mới
        cache.delete('dashboard_cluster_result')
        cache.delete('dashboard_trend_result')
        messages.success(request, f'Đã xóa khách hàng "{name}" thành công.')
        return redirect('customers:list')
    return render(request, 'customers/confirm_delete.html', {'customer': customer})

