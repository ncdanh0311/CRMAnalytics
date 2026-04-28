import logging

from celery import shared_task
from django.conf import settings
from django.core.cache import cache

from customers.analytics import run_customer_clustering
from customers.models import Customer
from sentiment.service import analyze_sentiment

logger = logging.getLogger(__name__)

CLUSTER_CACHE_KEY = "dashboard_cluster_result"
TREND_CACHE_KEY = "dashboard_trend_result"


def invalidate_dashboard_cache() -> None:
    cache.delete(CLUSTER_CACHE_KEY)
    cache.delete(TREND_CACHE_KEY)


@shared_task(name="customers.tasks.analyze_customer_sentiment")
def analyze_customer_sentiment(customer_id: int) -> dict:
    try:
        customer = Customer.objects.get(pk=customer_id)
    except Customer.DoesNotExist:
        logger.warning("Sentiment task skipped: customer %s not found", customer_id)
        return {"status": "missing", "customer_id": customer_id}

    feedback_text = (customer.feedback or "").strip()
    if not feedback_text:
        customer.sentiment_label = ""
        customer.sentiment_score = None
        customer.satisfaction_label = ""
        customer._skip_sentiment = True
        customer.save(update_fields=["sentiment_label", "sentiment_score", "satisfaction_label", "updated_at"])
        logger.info("Sentiment cleared for customer %s", customer.customer_id)
        return {"status": "cleared", "customer_id": customer_id}

    result = analyze_sentiment(feedback_text)
    customer.sentiment_label = result.get("label", "") or ""
    customer.sentiment_score = result.get("score")
    customer.satisfaction_label = {
        "positive": "satisfied",
        "neutral": "neutral",
        "negative": "dissatisfied",
    }.get(customer.sentiment_label, "")
    customer._skip_sentiment = True
    customer.save(update_fields=["sentiment_label", "sentiment_score", "satisfaction_label", "updated_at"])
    logger.info(
        "Sentiment analysed for customer %s with label=%s via %s",
        customer.customer_id,
        customer.sentiment_label,
        result.get("method", "unknown"),
    )
    return {
        "status": "processed",
        "customer_id": customer_id,
        "label": customer.sentiment_label,
        "score": customer.sentiment_score,
    }


@shared_task(name="customers.tasks.refresh_dashboard_analytics")
def refresh_dashboard_analytics(n_clusters: int | None = None) -> dict:
    invalidate_dashboard_cache()
    cluster_count = n_clusters or getattr(settings, "DASHBOARD_CLUSTER_COUNT", 3)
    cluster_result = run_customer_clustering(n_clusters=cluster_count, persist=True)
    logger.info(
        "Dashboard analytics refreshed with %s clusters and %s customers",
        cluster_result.n_clusters,
        len(cluster_result.points),
    )
    return {
        "status": "refreshed",
        "clusters": cluster_result.n_clusters,
        "customers": len(cluster_result.points),
    }


@shared_task(name="customers.tasks.process_customer_ai")
def process_customer_ai(customer_id: int, n_clusters: int | None = None) -> dict:
    sentiment_result = analyze_customer_sentiment(customer_id)
    analytics_result = refresh_dashboard_analytics(n_clusters=n_clusters)
    return {
        "status": "processed",
        "customer_id": customer_id,
        "sentiment": sentiment_result,
        "analytics": analytics_result,
    }


@shared_task(name="customers.tasks.backfill_missing_sentiment")
def backfill_missing_sentiment(limit: int = 250) -> dict:
    queryset = Customer.objects.filter(feedback__gt="", sentiment_label="").order_by("id")[:limit]
    processed = 0
    for customer_id in queryset.values_list("id", flat=True):
        analyze_customer_sentiment(customer_id)
        processed += 1

    logger.info("Backfill sentiment processed %s customers", processed)
    return {"status": "processed", "count": processed}
