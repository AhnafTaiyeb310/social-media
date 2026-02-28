# Django Secure-Auth Boilerplate (Headless + HttpOnly)

A production-ready Django & Django Rest Framework (DRF) boilerplate featuring a fully decoupled, secure authentication system. This template uses **Django Allauth Headless** with **HttpOnly Cookie-based sessions**, providing superior security against XSS and CSRF attacks for modern SPA/Mobile frontends.

## 🚀 Key Features

*   **Secure Headless Auth:** Integrated `django-allauth.headless` for a pure JSON API authentication flow.
*   **HttpOnly Cookie Sessions:** Automatic session management via secure cookies—no manual JWT storage in `localStorage` required.
*   **Custom User Model:** Email-based authentication out of the box (`apps.users.CustomUser`).
*   **API Documentation:** Auto-generated Swagger and Redoc via `drf-yasg`.
*   **Production Ready:** 
    *   Pre-configured **CORS** and **CSRF** settings.
    *   **WhiteNoise** for static file serving.
    *   **Sentry** integration for error tracking.
    *   **AWS S3** support for media and static files.
    *   **PostgreSQL** and **SQLite** support (via environment variables).
*   **Clean Architecture:** Separated `apps/` directory for better project organization.

---

## 🛠️ Tech Stack

- **Framework:** Django 5.x / Django Rest Framework
- **Auth:** Django-Allauth (Headless)
- **Database:** SQLite (Development) / PostgreSQL (Production)
- **Environment:** Python-Decouple (.env support)
- **API Docs:** Swagger (OpenAPI)

---

## 🏁 Getting Started

### 1. Prerequisites
- Python 3.10+
- `uv` (recommended) or `pip`

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt  # Or 'uv sync' if using uv
```

### 3. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
CSRF_TRUSTED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
```

### 4. Database & Admin
```bash
python manage.py makemigrations users
python manage.py migrate
python manage.py createsuperuser
```

### 5. Run Server
```bash
python manage.py runserver
```

---

## 🔐 Authentication Flow (Headless)

This boilerplate uses the `browser` client flow by default, which relies on HttpOnly cookies.

| Action | Method | Endpoint |
| :--- | :--- | :--- |
| **Discovery/Config** | `GET` | `/_allauth/browser/v1/config` |
| **Signup** | `POST` | `/_allauth/browser/v1/auth/signup` |
| **Login** | `POST` | `/_allauth/browser/v1/auth/login` |
| **Check Session** | `GET` | `/_allauth/browser/v1/auth/session` |
| **Logout** | `DELETE` | `/_allauth/browser/v1/auth/session` |

### Security Implementation Details:
1.  **HttpOnly Cookies:** The `sessionid` is never accessible via JavaScript, mitigating XSS.
2.  **CSRF Protection:** For `POST/PUT/DELETE` requests, you must include the `X-CSRFToken` header (retrieved from the `csrftoken` cookie).
3.  **Cross-Origin:** Pre-configured for separate frontend/backend domains via `django-cors-headers`.

---

## 📖 API Documentation

Once the server is running, visit:
- **Swagger UI:** `http://localhost:8000/api/docs/`
- **OpenAPI JSON:** `http://localhost:8000/_allauth/openapi.json`

---

## 🧪 Postman Testing Tips

1.  **Enable Cookies:** Postman handles cookies automatically. Ensure the "Cookie Jar" is active for `localhost`.
2.  **Handling CSRF:** 
    - Perform a `GET` to the `/config` endpoint first to receive the `csrftoken` cookie.
    - Copy the `csrftoken` value into the `X-CSRFToken` header for subsequent `POST` requests.
3.  **Headers:** Always include `Accept: application/json` and `Content-Type: application/json`.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
