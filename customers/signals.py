import logging

from django.conf import settings
from django.db import transaction
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from customers.models import Customer
from customers.tasks import invalidate_dashboard_cache, process_customer_ai, refresh_dashboard_analytics

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Customer)
def customer_saved(sender, instance: Customer, created: bool, **kwargs):
    invalidate_dashboard_cache()

    if not getattr(settings, "AI_ASYNC_ENABLED", False):
        return

    def enqueue():
        try:
            process_customer_ai.delay(instance.pk)
        except Exception as exc:  # pragma: no cover
            logger.warning("Could not enqueue AI processing for customer %s: %s", instance.pk, exc)

    transaction.on_commit(enqueue)


@receiver(post_delete, sender=Customer)
def customer_deleted(sender, instance: Customer, **kwargs):
    invalidate_dashboard_cache()

    if not getattr(settings, "AI_ASYNC_ENABLED", False):
        return

    def enqueue():
        try:
            refresh_dashboard_analytics.delay()
        except Exception as exc:  # pragma: no cover
            logger.warning("Could not enqueue analytics refresh after delete: %s", exc)

    transaction.on_commit(enqueue)
