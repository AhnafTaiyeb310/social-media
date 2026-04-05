# 1. Use a lightweight Python image
FROM python:3.11-slim

# 2. Install system dependencies for Postgres & building packages
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

# 8. Expose the port
EXPOSE 8000

# 9. Default start command (Gunicorn for production)
# CMD ["sh", "-c", "uv run python manage.py migrate --noinput && uv run python create_admin.py && uv run python manage.py collectstatic --noinput && uv run gunicorn core.wsgi:application --bind 0.0.0.0:8000"]
CMD ["sh", "-c", "uv run python manage.py migrate --noinput && uv run python create_admin.py && uv run python manage.py collectstatic --noinput && uv run gunicorn core.wsgi:application --bind 0.0.0.0:$PORT"]