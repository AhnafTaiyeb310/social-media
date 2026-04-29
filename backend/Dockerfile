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
# We provide a dummy SECRET_KEY so Django doesn't crash during build.
RUN SECRET_KEY=dummy_key_for_build uv run python manage.py collectstatic --noinput

# 8. Expose the port
EXPOSE 8000

# 9. BULLETPROOF STARTUP
# We add the virtualenv to the PATH so we can run gunicorn directly
ENV PATH="/app/.venv/bin:$PATH"

# Simplified CMD to ensure Gunicorn starts correctly
CMD ["sh", "-c", "python manage.py migrate --noinput && python create_admin.py && gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --timeout 120 --workers 2"]
