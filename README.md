# QLKH - Hệ Thống Quản Lý Khách Hàng

Ứng dụng web quản lý khách hàng xây dựng bằng **Django 5.2** theo hướng **API-first** (DRF + JWT + OpenAPI) với dashboard AI.

## ✨ Tính năng

- **Dashboard AI**: biểu đồ ApexCharts, phân cụm K-means, dự báo doanh thu tuyến tính
- **Quản lý khách hàng**: Thêm, sửa, xóa, tìm kiếm nhanh + phản hồi khách hàng
- **Sentiment tiếng Việt**: tự động phân tích feedback bằng `underthesea` + fallback từ điển
- **Phân quyền RBAC**: Admin (toàn quyền) / Nhân viên (xem + thêm/sửa)
- **Xác thực**: Đăng nhập / đăng xuất bảo mật với Django auth
- **API v1**: CRUD chuẩn REST tại `/api/v1/customers/`, Swagger UI `/api/docs/`

## 🚀 Cài đặt và chạy

```bash
# 1. Cài dependencies
pip install -r requirements.txt

# 2. Tạo database
python manage.py migrate

# 3. Chạy server
python manage.py runserver
```

Truy cập:
- Web app: **http://127.0.0.1:8000**
- Swagger: **http://127.0.0.1:8000/api/docs/**

## 🗂️ Dữ liệu khi chạy local (không Docker)

- File dữ liệu SQLite nằm tại: `data/django_app.db`
- Miễn là không xóa file này, dữ liệu khách hàng/tài khoản vẫn được giữ nguyên qua các lần chạy.
- Khi đổi model, chạy:

```bash
python manage.py makemigrations
python manage.py migrate
```

- Khi chuyển máy, copy cả project (đặc biệt thư mục `data/`) để giữ dữ liệu.
- Nên dùng `venv` để tránh xung đột package giữa các project Python.

Tài khoản mặc định: `admin` / `admin123`

## 🛠️ Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Framework | Django 5.2 |
| API | Django REST Framework, drf-spectacular, SimpleJWT |
| Database | SQLite (dev) / PostgreSQL (prod qua `DATABASE_URL`) |
| Static | WhiteNoise |
| Frontend | HTML + CSS (Dark Theme) |
| Charts | ApexCharts |

## 📁 Cấu trúc

Xem chi tiết trong [ARCHITECTURE.md](ARCHITECTURE.md)
