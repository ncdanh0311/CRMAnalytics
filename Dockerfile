# ──────────────────────────────────────────────────────────────────────────────
# Stage 1: Builder — install Python dependencies
# ──────────────────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# System dependencies needed to compile psycopg2-binary, scipy, etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages into a prefix we'll copy to final image
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --prefix=/install --no-cache-dir -r requirements.txt

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2: Runtime — lean production image
# ──────────────────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

WORKDIR /app

# Runtime system libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy compiled Python packages from builder
COPY --from=builder /install /usr/local

# Copy project source
COPY . .
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
# Create non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser \
    && mkdir -p /app/logs /app/staticfiles \
    && chown -R appuser:appgroup /app

USER appuser

# Expose Django's default port
EXPOSE 8000

# Entrypoint: collect static, migrate, then start Gunicorn


ENTRYPOINT ["/docker-entrypoint.sh"]
