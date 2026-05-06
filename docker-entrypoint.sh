#!/bin/sh
set -e

echo "🐳 Waiting for PostgreSQL..."
while ! curl -sf "http://${POSTGRES_HOST:-db}:5432" > /dev/null 2>&1; do
  # Use a TCP check via python instead
  python -c "import socket; s=socket.socket(); s.settimeout(1); s.connect(('${POSTGRES_HOST:-db}', 5432)); s.close()" 2>/dev/null && break
  echo "  → Postgres not ready yet, retrying in 2s..."
  sleep 2
done
echo "✅ PostgreSQL is ready."

echo "📦 Running makemigrations & migrations..."
python manage.py makemigrations ecommerce --noinput
python manage.py migrate --noinput

echo "🌱 Seeding data..."
python seed_ecommerce.py

echo "🗂  Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "🚀 Starting application: $APP_ROLE"
case "$APP_ROLE" in
  celery)
    exec celery -A qlkh_project worker --loglevel=info --concurrency=2
    ;;
  beat)
    exec celery -A qlkh_project beat --loglevel=info --scheduler django_celery_beat.schedulers:DatabaseScheduler
    ;;
  *)
    exec gunicorn qlkh_project.wsgi:application \
      --bind 0.0.0.0:8000 \
      --workers 2 \
      --timeout 120 \
      --access-logfile - \
      --error-logfile -
    ;;
esac
