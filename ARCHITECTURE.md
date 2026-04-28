# Kien Truc Du An - QLKH Django

## 1. Tong quan

He thong gom 2 lop chinh:

- Web UI bang Django templates cho doi van hanh noi bo.
- API-first backend bang Django REST Framework de tich hop mobile/frontend khac.

Muc tieu nghiep vu:

- phat hien som feedback tieu cuc de CSKH xu ly
- phan nhom khach hang de marketing toi uu chien dich
- tong hop doanh thu va top san pham de quan ly ra quyet dinh

## 2. API-first

Endpoint chinh:

- REST CRUD: `/api/v1/customers/`
- JWT:
  - `POST /api/auth/token/`
  - `POST /api/auth/token/refresh/`
  - `POST /api/auth/token/verify/`
- OpenAPI + Swagger:
  - `/api/schema/`
  - `/api/docs/`

`CustomerViewSet` cung cap:

- CRUD tieu chuan
- `GET /api/v1/customers/stats/`
- `GET|POST /api/v1/customers/cluster/?k=3`
- `GET /api/v1/customers/forecast/`

## 3. Luong xu ly sentiment

App `sentiment/` xu ly NLP tieng Viet bang `underthesea` va fallback keyword lexicon.

Che do dong bo:

- khi tao/sua customer, model tinh sentiment ngay trong request

Che do bat dong bo:

- Django save customer nhanh
- `post_save` enqueue `customers.tasks.process_customer_ai`
- Celery worker phan tich sentiment va refresh clustering sau commit

Task dinh ky:

- `customers.tasks.refresh_dashboard_analytics`
- `customers.tasks.backfill_missing_sentiment`

## 4. Clustering + business profile

K-means dung 3 feature:

- `quantity`
- `unit_price`
- `total_amount`

Ket qua khong chi tra ve `cluster_id`, ma con gan business persona cho moi cluster:

- `vip_high_value`
- `loyal_bulk`
- `churn_risk`
- `growth_segment`

Muc dich la de dashboard/API dien giai AI theo ngon ngu kinh doanh thay vi ngon ngu mo hinh.

## 5. Dashboard va cache

Dashboard lay du lieu tu:

- tong so khach hang
- doanh thu
- sentiment stats
- top products
- clustering scatter
- linear regression forecast

Hai thanh phan nang duoc cache:

- `dashboard_cluster_result`
- `dashboard_trend_result`

Khi customer thay doi, cache bi xoa de dashboard cap nhat.

## 6. Logging va monitoring

Settings da cau hinh `LOGGING` de ghi ra:

- console
- `logs/app.log`

Logger uu tien:

- `customers`
- `sentiment`
- `django.request`

## 7. Database strategy

- Dev local: SQLite (`data/django_app.db`)
- Production: PostgreSQL qua `DATABASE_URL`
- Redis/Celery: `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`

## 8. Seed data

Command:

```bash
python manage.py seed_customers --count 1000 --reset
```

Command nay tao du lieu tieng Viet co sentiment va gia tri giao dich phong phu, phu hop de demo dashboard va Swagger.

## 9. Cau truc chinh

```text
CustomerApplication/
|-- accounts/               # User + RBAC
|-- api/                    # DRF serializers, viewsets, JWT, Swagger
|-- customers/              # Model, web views, analytics, tasks, seed data
|-- sentiment/              # Sentiment service
|-- qlkh_project/           # settings, urls, wsgi, celery
|-- templates/              # Django templates
|-- static/                 # CSS/JS/assets
|-- logs/                   # app.log va runtime logs
|-- data/                   # SQLite local
`-- .github/workflows/      # CI
```
