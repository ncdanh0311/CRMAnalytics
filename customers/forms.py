import re
from django import forms
from customers.models import Customer

EMAIL_PATTERN = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
PHONE_PATTERN = re.compile(r'^\d{9,11}$')
CMND_PATTERN = re.compile(r'^\d{9,12}$')


class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = [
            'customer_id', 'name', 'gender', 'group_name', 'customer_type',
            'phone', 'email', 'cmnd', 'birth_date', 'address',
            'product', 'quantity', 'unit_price', 'total_amount',
            'feedback',
        ]
        widgets = {
            'customer_id': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'VD: KH001', 'id': 'id_customer_id'}),
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Họ và tên đầy đủ', 'id': 'id_name'}),
            'gender': forms.Select(attrs={'class': 'form-control', 'id': 'id_gender'}),
            'group_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'VD: Nhóm A', 'id': 'id_group_name'}),
            'customer_type': forms.Select(attrs={'class': 'form-control', 'id': 'id_customer_type'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '0xxxxxxxxx', 'id': 'id_phone'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'email@example.com', 'id': 'id_email'}),
            'cmnd': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Số CMND/CCCD', 'id': 'id_cmnd'}),
            'birth_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date', 'id': 'id_birth_date'}),
            'address': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Địa chỉ', 'id': 'id_address'}),
            'product': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Tên sản phẩm', 'id': 'id_product'}),
            'quantity': forms.NumberInput(attrs={'class': 'form-control', 'min': '1', 'id': 'id_quantity'}),
            'unit_price': forms.NumberInput(attrs={'class': 'form-control', 'min': '0', 'id': 'id_unit_price'}),
            'total_amount': forms.NumberInput(attrs={'class': 'form-control', 'min': '0', 'id': 'id_total_amount'}),
            'feedback': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Nhập nhận xét / phản hồi của khách hàng...'}),
        }
        labels = {
            'customer_id': 'Mã khách hàng',
            'name': 'Họ và tên',
            'gender': 'Giới tính',
            'group_name': 'Nhóm khách hàng',
            'customer_type': 'Loại khách hàng',
            'phone': 'Số điện thoại',
            'email': 'Email',
            'cmnd': 'CMND/CCCD',
            'birth_date': 'Ngày sinh',
            'address': 'Địa chỉ',
            'product': 'Sản phẩm',
            'quantity': 'Số lượng',
            'unit_price': 'Đơn giá (VNĐ)',
            'total_amount': 'Thành tiền (VNĐ)',
            'feedback': 'Phản hồi khách hàng',
        }

    def clean_phone(self):
        phone = self.cleaned_data.get('phone', '').strip()
        if phone and not PHONE_PATTERN.match(phone):
            raise forms.ValidationError('Số điện thoại không hợp lệ (9-11 chữ số).')
        return phone

    def clean_email(self):
        email = self.cleaned_data.get('email', '').strip()
        if email and not EMAIL_PATTERN.match(email):
            raise forms.ValidationError('Email không đúng định dạng.')
        return email

    def clean_cmnd(self):
        cmnd = self.cleaned_data.get('cmnd', '').strip()
        if cmnd and not CMND_PATTERN.match(cmnd):
            raise forms.ValidationError('CMND/CCCD không hợp lệ (9-12 chữ số).')
        return cmnd

    def clean(self):
        cleaned = super().clean()
        qty = cleaned.get('quantity', 1) or 1
        price = cleaned.get('unit_price', 0) or 0
        total = cleaned.get('total_amount', 0) or 0
        if total == 0 and qty and price:
            cleaned['total_amount'] = qty * price
        return cleaned
