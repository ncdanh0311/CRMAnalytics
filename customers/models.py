from django.db import models
from django.conf import settings
from django.utils import timezone


class Customer(models.Model):
    GENDER_CHOICES = [
        ('Nam', 'Nam'),
        ('Nữ', 'Nữ'),
        ('Khác', 'Khác'),
    ]
    CUSTOMER_TYPE_CHOICES = [
        ('VIP', 'VIP'),
        ('Thường', 'Thường'),
    ]
    SENTIMENT_CHOICES = [
        ('positive', '😊 Tích cực'),
        ('neutral',  '😐 Trung lập'),
        ('negative', '😞 Tiêu cực'),
        ('',         'Chưa phân tích'),
    ]
    SATISFACTION_CHOICES = [
        ('satisfied', 'Hài lòng'),
        ('neutral', 'Trung lập'),
        ('dissatisfied', 'Không hài lòng'),
        ('', 'Chưa đánh giá'),
    ]

    # ── Thông tin cơ bản ──────────────────────────────────────────────────────
    customer_id   = models.CharField(max_length=50, unique=True, verbose_name='Mã KH', db_index=True)
    name          = models.CharField(max_length=255, verbose_name='Họ và tên')
    group_name    = models.CharField(max_length=100, default='Mặc định', verbose_name='Nhóm KH')
    gender        = models.CharField(max_length=20, choices=GENDER_CHOICES, default='Nam', verbose_name='Giới tính')
    phone         = models.CharField(max_length=20, default='', blank=True, verbose_name='Điện thoại')
    email         = models.EmailField(max_length=255, default='', blank=True, verbose_name='Email')
    customer_type = models.CharField(max_length=50, choices=CUSTOMER_TYPE_CHOICES, default='Thường', verbose_name='Loại KH')
    cmnd          = models.CharField(max_length=30, default='', blank=True, verbose_name='CMND/CCCD')
    birth_date    = models.DateField(null=True, blank=True, verbose_name='Ngày sinh')
    address       = models.CharField(max_length=255, default='', blank=True, verbose_name='Địa chỉ')

    # ── Giao dịch ─────────────────────────────────────────────────────────────
    product      = models.CharField(max_length=255, default='', verbose_name='Sản phẩm')
    quantity     = models.IntegerField(default=1, verbose_name='Số lượng')
    unit_price   = models.BigIntegerField(default=0, verbose_name='Đơn giá')
    total_amount = models.BigIntegerField(default=0, verbose_name='Thành tiền')

    # ── Phản hồi & Cảm xúc (NEW) ──────────────────────────────────────────────
    feedback         = models.TextField(blank=True, default='', verbose_name='Phản hồi khách hàng')
    sentiment_label  = models.CharField(
        max_length=20, choices=SENTIMENT_CHOICES, default='', blank=True,
        verbose_name='Nhãn cảm xúc',
    )
    sentiment_score  = models.FloatField(null=True, blank=True, verbose_name='Điểm cảm xúc')
    satisfaction_label = models.CharField(
        max_length=20, choices=SATISFACTION_CHOICES, default='', blank=True,
        verbose_name='Mức độ hài lòng',
    )

    # ── Phân cụm (NEW) ────────────────────────────────────────────────────────
    cluster_id = models.IntegerField(null=True, blank=True, verbose_name='Nhóm phân cụm')

    # ── Timestamps ────────────────────────────────────────────────────────────
    created_at = models.DateTimeField(default=timezone.now, verbose_name='Ngày tạo')
    updated_at = models.DateTimeField(null=True, blank=True, verbose_name='Cập nhật lần cuối')

    class Meta:
        verbose_name        = 'Khách hàng'
        verbose_name_plural = 'Khách hàng'
        ordering            = ['-created_at']
        indexes             = [
            models.Index(fields=['customer_type', 'sentiment_label']),
            models.Index(fields=['satisfaction_label']),
            models.Index(fields=['cluster_id']),
        ]

    def save(self, *args, **kwargs):
        if self.pk:
            self.updated_at = timezone.now()
        # Luôn tính lại thành tiền từ SL × đơn giá
        if self.quantity and self.unit_price:
            self.total_amount = self.quantity * self.unit_price
        # Bỏ qua phân tích cảm xúc khi bulk_update (performance)
        if not getattr(self, '_skip_sentiment', False) and not getattr(settings, 'AI_ASYNC_ENABLED', False):
            self._sync_sentiment()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.customer_id}] {self.name}"

    def is_vip(self):
        return self.customer_type == 'VIP'

    @property
    def sentiment_emoji(self):
        return {'positive': '😊', 'negative': '😞', 'neutral': '😐'}.get(self.sentiment_label, '❓')

    def _sync_sentiment(self):
        feedback_text = (self.feedback or '').strip()
        if not feedback_text:
            self.sentiment_label = ''
            self.sentiment_score = None
            self.satisfaction_label = ''
            return

        from sentiment.service import analyze_sentiment

        result = analyze_sentiment(feedback_text)
        label = result.get('label', '') or ''
        self.sentiment_label = label
        self.sentiment_score = result.get('score')

        self.satisfaction_label = {
            'positive': 'satisfied',
            'neutral': 'neutral',
            'negative': 'dissatisfied',
        }.get(label, '')
