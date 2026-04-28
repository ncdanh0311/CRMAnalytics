import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from customers.analytics import run_customer_clustering
from customers.models import Customer
from sentiment.service import analyze_sentiment


FIRST_NAMES = [
    "An", "Binh", "Chi", "Dung", "Giang", "Hanh", "Khanh", "Linh", "Minh", "Nam",
    "Ngoc", "Phuong", "Quan", "Trang", "Tuan", "Vy", "Yen", "Bao", "Hieu", "Lan",
]
LAST_NAMES = [
    "Nguyen", "Tran", "Le", "Pham", "Hoang", "Huynh", "Phan", "Vu", "Dang", "Bui",
]
PRODUCTS = [
    ("Goi bao tri premium", 5500000),
    ("Phan mem CRM co ban", 2900000),
    ("Phan mem CRM nang cao", 7900000),
    ("Dich vu tu van van hanh", 4200000),
    ("Goi SMS marketing", 1800000),
    ("Goi CSKH da kenh", 3600000),
]
POSITIVE_FEEDBACKS = [
    "Dich vu rat tot, nhan vien ho tro nhanh va chu dao.",
    "Toi hai long voi toc do xu ly va chat luong san pham.",
    "He thong de dung, bao cao ro rang va giup tiet kiem thoi gian.",
    "Cham soc khach hang rat chuyen nghiep, se tiep tuc ung ho.",
]
NEUTRAL_FEEDBACKS = [
    "San pham tam on, can them vai tinh nang bao cao.",
    "Dang su dung on dinh, chua co van de gi lon.",
    "Gia hop ly, giao dien co the cai thien them.",
    "Dich vu dap ung dung nhu cau co ban cua doanh nghiep.",
]
NEGATIVE_FEEDBACKS = [
    "Phan hoi cham, toi khong hai long voi cach xu ly van de.",
    "He thong co loi va lam mat thoi gian cua nhan vien.",
    "Don hang bi tre, trai nghiem khong tot nhu ky vong.",
    "Gia cao nhung hieu qua chua ro rang, can duoc ho tro gap.",
]
GROUPS = ["Ban le", "Dai ly", "Doanh nghiep SME", "Khach hang online"]
ADDRESSES = ["Ha Noi", "TP HCM", "Da Nang", "Can Tho", "Hai Phong", "Binh Duong"]


class Command(BaseCommand):
    help = "Seed mau 1000 khach hang ao de demo dashboard, sentiment va clustering."

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=1000)
        parser.add_argument("--prefix", type=str, default="DEMO")
        parser.add_argument("--reset", action="store_true")

    def handle(self, *args, **options):
        count = max(1, options["count"])
        prefix = options["prefix"].strip().upper() or "DEMO"

        if options["reset"]:
            deleted, _ = Customer.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Da xoa {deleted} ban ghi cu."))

        existing_ids = set(
            Customer.objects.filter(customer_id__startswith=prefix).values_list("customer_id", flat=True)
        )
        customers = []
        now = timezone.now()

        for index in range(1, count + 1):
            customer_id = f"{prefix}{index:05d}"
            if customer_id in existing_ids:
                continue

            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            full_name = f"{last_name} {first_name}"
            product_name, base_price = random.choice(PRODUCTS)
            quantity = random.randint(1, 12)
            unit_price = max(500000, int(base_price * random.uniform(0.85, 1.25)))
            customer_type = "VIP" if random.random() < 0.22 else Customer.CUSTOMER_TYPE_CHOICES[1][0]

            sentiment_bucket = random.choices(
                ["positive", "neutral", "negative"],
                weights=[0.45, 0.30, 0.25],
                k=1,
            )[0]
            if sentiment_bucket == "positive":
                feedback = random.choice(POSITIVE_FEEDBACKS)
            elif sentiment_bucket == "negative":
                feedback = random.choice(NEGATIVE_FEEDBACKS)
            else:
                feedback = random.choice(NEUTRAL_FEEDBACKS)

            sentiment = analyze_sentiment(feedback)
            created_at = now - timedelta(days=random.randint(0, 365))

            customer = Customer(
                customer_id=customer_id,
                name=full_name,
                group_name=random.choice(GROUPS),
                gender=random.choice([choice[0] for choice in Customer.GENDER_CHOICES]),
                phone=f"0{random.randint(100000000, 999999999)}",
                email=f"{first_name.lower()}.{index}@example.com",
                customer_type=customer_type,
                cmnd=str(random.randint(100000000, 999999999999)),
                birth_date=(now - timedelta(days=random.randint(7000, 20000))).date(),
                address=random.choice(ADDRESSES),
                product=product_name,
                quantity=quantity,
                unit_price=unit_price,
                total_amount=quantity * unit_price,
                feedback=feedback,
                sentiment_label=sentiment["label"],
                sentiment_score=sentiment["score"],
                satisfaction_label={
                    "positive": "satisfied",
                    "neutral": "neutral",
                    "negative": "dissatisfied",
                }.get(sentiment["label"], ""),
                created_at=created_at,
            )
            customer._skip_sentiment = True
            customers.append(customer)

        Customer.objects.bulk_create(customers, batch_size=500)
        cluster_result = run_customer_clustering(n_clusters=3, persist=True)

        self.stdout.write(
            self.style.SUCCESS(
                f"Da tao {len(customers)} khach hang mau. Clustering cap nhat {cluster_result.n_clusters} nhom."
            )
        )
