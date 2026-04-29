# 1. Use a lightweight Python image
FROM python:3.11-slim

# 2. Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 3. Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 4. Set the working directory
WORKDIR /app

# 5. Copy dependency files first
COPY pyproject.toml uv.lock ./

# 6. Install dependencies
RUN uv sync --frozen --no-cache

# 7. Copy the rest of your backend code
COPY . .

# --- NEW: OPTIMIZATIONS ---
# Run collectstatic during the BUILD phase so the app starts faster
RUN uv run python manage.py collectstatic --noinput

# 8. Expose the port
EXPOSE 8000

# 9. Optimized Start Command
# We run migrations and admin creation, then start gunicorn. 
# We use ';' instead of '&&' to ensure the server tries to start even if migrations are already done.
CMD ["sh", "-c", "uv run python manage.py migrate --noinput; uv run python create_admin.py; uv run gunicorn core.wsgi:application --bind 0.0.0.0:$PORT"]
