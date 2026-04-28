# QLKH - Customer Management with AI Dashboard

Ung dung Django quan ly khach hang cho doi CSKH va marketing. He thong giup luu tru thong tin khach hang, phan tich feedback tieng Viet, phan nhom khach hang bang AI, va hien thi dashboard tong quan doanh thu.

## Muc tieu nghiep vu

Du an tap trung vao 3 bai toan chinh:

- phat hien feedback tieu cuc de CSKH xu ly som
- phan nhom khach hang de uu tien marketing va cham soc
- theo doi doanh thu, top san pham, va xu huong ban hang

## Tinh nang chinh

- CRUD khach hang
- Dashboard voi ApexCharts
- Sentiment analysis cho feedback tieng Viet
- Clustering khach hang bang K-means
- API-first voi DRF + JWT + Swagger
- RBAC: admin va nhan vien
- Ho tro Celery cho xu ly nen

## Y nghia AI trong du an

Clustering khong chi tra ve `cluster_id`, ma con duoc dien giai thanh cac nhom nghiep vu nhu:

- khach hang gia tri cao
- khach hang mua deu
- khach hang co nguy co roi bo
- khach hang tiem nang tang truong

Dieu nay giup dashboard de doc hon va co gia tri kinh doanh ro hon.

## Cai dat nhanh

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Truy cap:

- Web: `http://127.0.0.1:8000/`
- Swagger: `http://127.0.0.1:8000/api/docs/`

Tai khoan mac dinh: `admin / admin123`

## Du lieu mau demo

Tao du lieu de dashboard dep hon:

```bash
python manage.py seed_customers --count 1000
```

Neu muon reset truoc khi seed:

```bash
python manage.py seed_customers --count 1000 --reset
```

## Async voi Celery

Neu muon chay sentiment/clustering o background:

```env
AI_ASYNC_ENABLED=True
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1
```

```bash
celery -A qlkh_project worker -l info
celery -A qlkh_project beat -l info
```

Neu khong bat Celery, he thong van chay o che do dong bo.

## API chinh

- `POST /api/auth/token/` lay JWT
- `GET /api/v1/customers/` danh sach khach hang
- `POST /api/v1/customers/` tao khach hang
- `GET /api/v1/customers/stats/` thong ke tong quan
- `GET /api/v1/customers/cluster/?k=3` phan cum khach hang
- `GET /api/v1/customers/forecast/` du bao doanh thu

## Logging va CI

- Log ung dung: `logs/app.log`
- CI workflow: `.github/workflows/ci.yml`

## Tech Stack

- Django 5.2
- Django REST Framework
- SimpleJWT
- drf-spectacular
- scikit-learn
- underthesea
- Celery + Redis

## Cau truc

- `customers/`: model, views, analytics, tasks
- `api/`: serializer, viewset, JWT, Swagger
- `sentiment/`: xu ly feedback
- `accounts/`: user va phan quyen
- `qlkh_project/`: settings, urls, celery

Chi tiet hon xem trong [ARCHITECTURE.md](ARCHITECTURE.md).
