# QLKH - Customer Management with AI Dashboard

Ung dung Django quan ly khach hang cho doi CSKH va marketing. He thong giup luu tru thong tin khach hang, phan tich feedback tieng Viet, phan nhom khach hang bang AI, va hien thi dashboard tong quan doanh thu.

## 1. Muc tieu nghiep vu

Du an tap trung vao 3 bai toan chinh:

1. Phat hien feedback tieu cuc de CSKH xu ly som.
2. Phan nhom khach hang de uu tien marketing va cham soc.
3. Theo doi doanh thu, top san pham, va xu huong ban hang.

## 2. Tinh nang chinh

1. CRUD khach hang.
2. Dashboard thong ke voi ApexCharts.
3. Sentiment analysis cho feedback tieng Viet.
4. Clustering khach hang bang K-means.
5. API-first voi DRF + JWT + Swagger.
6. RBAC voi 2 vai tro: admin va nhan vien.
7. Ho tro Celery cho xu ly nen.

## 3. Y nghia AI trong du an

Clustering khong chi tra ve `cluster_id`, ma con duoc dien giai thanh cac nhom nghiep vu de de su dung hon:

1. Khach hang gia tri cao.
2. Khach hang mua deu.
3. Khach hang co nguy co roi bo.
4. Khach hang tiem nang tang truong.

Dieu nay giup dashboard de doc hon va the hien ro gia tri kinh doanh cua AI.

## 4. Cai dat nhanh

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Truy cap:

1. Web: `http://127.0.0.1:8000/`
2. Swagger: `http://127.0.0.1:8000/api/docs/`

Tai khoan mac dinh: `admin / admin123`

## 5. Du lieu mau demo

Tao du lieu de dashboard day hon:

```bash
python manage.py seed_customers --count 1000
```

Neu muon reset truoc khi seed:

```bash
python manage.py seed_customers --count 1000 --reset
```

## 6. Async voi Celery

Neu muon chay sentiment va clustering o background, cau hinh:

```env
AI_ASYNC_ENABLED=True
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1
```

Sau do chay:

```bash
celery -A qlkh_project worker -l info
celery -A qlkh_project beat -l info
```

Neu khong bat Celery, he thong van chay o che do dong bo.

## 7. API chinh

1. `POST /api/auth/token/`: lay JWT.
2. `GET /api/v1/customers/`: lay danh sach khach hang.
3. `POST /api/v1/customers/`: tao khach hang.
4. `GET /api/v1/customers/stats/`: thong ke tong quan.
5. `GET /api/v1/customers/cluster/?k=3`: phan cum khach hang.
6. `GET /api/v1/customers/forecast/`: du bao doanh thu.

## 8. Logging va CI

1. Log ung dung: `logs/app.log`
2. CI workflow: `.github/workflows/ci.yml`

## 9. Tech Stack

1. Django 5.2
2. Django REST Framework
3. SimpleJWT
4. drf-spectacular
5. scikit-learn
6. underthesea
7. Celery + Redis

## 10. Cau truc thu muc

1. `customers/`: model, views, analytics, tasks.
2. `api/`: serializer, viewset, JWT, Swagger.
3. `sentiment/`: xu ly feedback.
4. `accounts/`: user va phan quyen.
5. `qlkh_project/`: settings, urls, celery.

Chi tiet hon xem trong [ARCHITECTURE.md](d:/Projects/CustomerApplication/ARCHITECTURE.md).
