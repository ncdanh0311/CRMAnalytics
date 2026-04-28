# Load Celery app when celery is installed; skip in lightweight local setups.
try:
    from .celery import app as celery_app
except ModuleNotFoundError:  # pragma: no cover - optional dependency during local dev
    celery_app = None

__all__ = ("celery_app",)
