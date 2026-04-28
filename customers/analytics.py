from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler

from customers.models import Customer


@dataclass
class ClusterResult:
    n_clusters: int
    points: list[dict]
    centers: list[dict]
    summaries: list[dict]


def _cluster_profile_templates() -> dict[str, dict[str, str]]:
    return {
        "vip_high_value": {
            "title": "Khach hang gia tri cao",
            "description": "Nhom co doanh thu va gia tri don hang cao, phu hop upsell/goi chuyen sau.",
            "recommended_action": "Uu tien CSKH, chuong trinh VIP va cross-sell.",
        },
        "loyal_bulk": {
            "title": "Khach hang mua deu so luong lon",
            "description": "Tan suat mua on dinh, so luong cao, nhay voi uu dai theo lo.",
            "recommended_action": "Day combo, chiet khau theo san luong va nhac mua lai.",
        },
        "churn_risk": {
            "title": "Khach hang nguy co roi bo",
            "description": "Gia tri giao dich thap va de kem feedback tieu cuc, can can thiep som.",
            "recommended_action": "Canh bao CSKH, goi cham soc va uu dai giu chan.",
        },
        "growth_segment": {
            "title": "Khach hang tiem nang tang truong",
            "description": "Nhom trung gian, co dau hieu mo rong neu duoc cham dung nhu cau.",
            "recommended_action": "Remarketing, kich ban nurturing va goi san pham lien quan.",
        },
    }


def _build_cluster_profiles(centers: list[dict]) -> list[dict]:
    if not centers:
        return []

    templates = _cluster_profile_templates()
    by_revenue = sorted(centers, key=lambda item: item["total_amount"], reverse=True)
    by_quantity = sorted(centers, key=lambda item: item["quantity"], reverse=True)
    by_low_value = sorted(centers, key=lambda item: item["total_amount"])

    profile_map: dict[int, str] = {}
    profile_map[by_revenue[0]["cluster_id"]] = "vip_high_value"
    profile_map.setdefault(by_quantity[0]["cluster_id"], "loyal_bulk")
    profile_map[by_low_value[0]["cluster_id"]] = "churn_risk"

    for center in centers:
        profile_key = profile_map.get(center["cluster_id"], "growth_segment")
        center["profile_key"] = profile_key
        center["profile_title"] = templates[profile_key]["title"]
        center["profile_description"] = templates[profile_key]["description"]
        center["recommended_action"] = templates[profile_key]["recommended_action"]

    return centers


def run_customer_clustering(n_clusters: int = 3, persist: bool = True) -> ClusterResult:
    rows = list(
        Customer.objects.values(
            "id", "customer_id", "name", "quantity", "unit_price", "total_amount"
        )
    )
    if not rows:
        return ClusterResult(n_clusters=0, points=[], centers=[], summaries=[])

    max_clusters = min(max(1, n_clusters), len(rows))
    if len(rows) == 1:
        labels = np.array([0])
        centers_raw = np.array(
            [[rows[0]["quantity"], rows[0]["unit_price"], rows[0]["total_amount"]]]
        )
        max_clusters = 1
    else:
        x = np.array(
            [[r["quantity"], r["unit_price"], r["total_amount"]] for r in rows], dtype=float
        )
        scaler = StandardScaler()
        x_scaled = scaler.fit_transform(x)
        model = KMeans(n_clusters=max_clusters, random_state=42, n_init=10)
        labels = model.fit_predict(x_scaled)
        centers_raw = scaler.inverse_transform(model.cluster_centers_)

    points = []
    id_to_cluster = {}
    for row, cluster_id in zip(rows, labels.tolist()):
        id_to_cluster[row["id"]] = cluster_id
        points.append(
            {
                "id": row["id"],
                "customer_id": row["customer_id"],
                "name": row["name"],
                "quantity": row["quantity"],
                "unit_price": row["unit_price"],
                "total_amount": row["total_amount"],
                "cluster_id": cluster_id,
                # 2D plot axes
                "x": row["quantity"],
                "y": row["total_amount"],
            }
        )

    centers = []
    for idx, center in enumerate(centers_raw.tolist()):
        centers.append(
            {
                "cluster_id": idx,
                "quantity": round(center[0], 2),
                "unit_price": round(center[1], 2),
                "total_amount": round(center[2], 2),
            }
        )
    centers = _build_cluster_profiles(centers)

    cluster_counts: dict[int, int] = {}
    for point in points:
        cluster_counts[point["cluster_id"]] = cluster_counts.get(point["cluster_id"], 0) + 1

    summaries = []
    for center in centers:
        summaries.append(
            {
                "cluster_id": center["cluster_id"],
                "customer_count": cluster_counts.get(center["cluster_id"], 0),
                "profile_key": center["profile_key"],
                "profile_title": center["profile_title"],
                "profile_description": center["profile_description"],
                "recommended_action": center["recommended_action"],
            }
        )

    if persist:
        customers = list(Customer.objects.filter(id__in=id_to_cluster.keys()))
        for customer in customers:
            customer.cluster_id = id_to_cluster.get(customer.id)
            customer._skip_sentiment = True  # Tránh gọi sentiment khi bulk_update
        Customer.objects.bulk_update(customers, ["cluster_id"])

    return ClusterResult(
        n_clusters=max_clusters,
        points=points,
        centers=centers,
        summaries=summaries,
    )


def build_revenue_trend(months_ahead: int = 3) -> dict:
    monthly_data = list(
        Customer.objects.annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(revenue=Sum("total_amount"))
        .order_by("month")
    )

    labels = [item["month"].strftime("%m/%Y") for item in monthly_data if item["month"]]
    revenues = [float(item["revenue"] or 0) for item in monthly_data if item["month"]]

    if not revenues:
        return {
            "labels": [],
            "actual": [],
            "trend": [],
            "forecast_labels": [],
            "forecast": [],
        }

    x = np.arange(len(revenues)).reshape(-1, 1)
    y = np.array(revenues)
    model = LinearRegression()
    model.fit(x, y)
    trend = model.predict(x).tolist()

    future_x = np.arange(len(revenues), len(revenues) + months_ahead).reshape(-1, 1)
    future_y = model.predict(future_x).tolist()

    if monthly_data and monthly_data[-1]["month"]:
        last_month = monthly_data[-1]["month"]
    else:
        # fallback label logic
        from django.utils import timezone

        last_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    forecast_labels = []
    current = last_month
    for _ in range(months_ahead):
        year = current.year + (1 if current.month == 12 else 0)
        month = 1 if current.month == 12 else current.month + 1
        current = current.replace(year=year, month=month)
        forecast_labels.append(current.strftime("%m/%Y"))

    return {
        "labels": labels,
        "actual": [round(v, 2) for v in revenues],
        "trend": [round(v, 2) for v in trend],
        "forecast_labels": forecast_labels,
        "forecast": [round(max(0.0, v), 2) for v in future_y],
    }
