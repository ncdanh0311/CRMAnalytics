# Kiến Trúc Dự Án - QLKH Django

## 1) Tổng quan

Hệ thống gồm 2 lớp chính:

- **Web UI** (Django templates) cho nghiệp vụ vận hành nội bộ.
- **API-first backend** (Django REST Framework) cho tích hợp mobile/frontend ngoài.

## 2) API-first (DRF)

- REST endpoint chuẩn: `/api/v1/customers/`
- JWT auth:
  - `POST /api/auth/token/`
  - `POST /api/auth/token/refresh/`
  - `POST /api/auth/token/verify/`
- OpenAPI + Swagger:
  - Schema: `/api/schema/`
  - UI: `/api/docs/`

`CustomerViewSet` cung cấp:

- CRUD tiêu chuẩn.
- `GET /api/v1/customers/stats/`
- `GET|POST /api/v1/customers/cluster/?k=3`
- `GET /api/v1/customers/forecast/`

## 3) Sentiment Service

App `sentiment/` xử lý NLP tiếng Việt bằng `underthesea` và fallback từ điển keyword.

Khi tạo/sửa Customer:

- Tự động phân tích `feedback`.
- Gán `sentiment_label`, `sentiment_score`, `satisfaction_label`.

## 4) AI Clustering + Forecast

- K-means (`scikit-learn`) trên 3 feature:
  - `quantity`, `unit_price`, `total_amount`
- Kết quả lưu `cluster_id` về `Customer`.
- Dashboard hiển thị scatter 2D tương tác bằng **ApexCharts**.
- Dự báo xu hướng doanh thu dùng **Linear Regression** theo tháng.

## 5) Database strategy

- Dev local: SQLite (`data/django_app.db`)
- Docker/production: PostgreSQL qua `DATABASE_URL`
- Parse URL DB bằng `dj-database-url`

## 6) Cấu trúc chính

```
QLKH_Python/
├── api/                    # DRF app: serializers, viewsets, auth, urls
├── accounts/               # User + RBAC
├── customers/              # Model, web views, analytics (cluster/forecast)
├── sentiment/              # Sentiment service
├── qlkh_project/           # settings, urls, wsgi, celery
├── templates/              # Django templates
└── static/                 # CSS/JS
```
