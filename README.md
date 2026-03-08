# 🌐 Social Media Backend API

An industry-standard, scalable Social Media REST API built with **Django 6.0** and **Django REST Framework**. This backend provides a robust foundation for building modern social platforms with features like blog posts, nested comments, profile management, and a followers system.

---

## 🚀 Key Features

- **🔐 Advanced Authentication:** JWT-based authentication with `django-allauth` (Headless) and `SimpleJWT`.
- **📝 Blog System:** Automatic slug generation, categorization, and multiple image uploads.
- **💬 Engagement:** Nested comments (replies), post liking, and comment liking.
- **👤 User Profiles:** Detailed profiles with bio, profile pictures, and social links.
- **🤝 Social Graph:** Robust Follow/Unfollow system with follower/following list endpoints.
- **📂 Media Management:** Support for local storage (Dev) and AWS S3 (Prod).
- **📊 Optimized Queries:** Extensive use of `select_related`, `prefetch_related`, and `annotate` for high performance.
- **📖 API Documentation:** Auto-generated Swagger/OpenAPI documentation.

---

## 🛠 Tech Stack

- **Framework:** [Django 6.0](https://www.djangoproject.com/)
- **API:** [Django REST Framework](https://www.django-rest-framework.org/)
- **Auth:** `django-allauth`, `djangorestframework-simplejwt`
- **Database:** PostgreSQL (Production), SQLite (Development)
- **Monitoring:** Sentry Integration
- **Utilities:** `django-filter`, `drf-yasg`, `whitenoise`

---

## 📦 Getting Started

### Prerequisites
- Python 3.13+
- `uv` (recommended) or `pip`

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd backend
   ```

2. **Set up Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key
   ALLOWED_HOSTS=localhost,127.0.0.1
   DATABASE_URL=postgres://user:password@localhost:5432/db_name
   ```

3. **Install Dependencies:**
   ```bash
   uv sync
   # or
   pip install -r requirements.txt
   ```

4. **Run Migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start Development Server:**
   ```bash
   python manage.py runserver
   ```

---

## 📖 API Documentation (Frontend Guide)

The API is fully documented using Swagger. Once the server is running, visit:
🔗 **[http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)**

### 🔑 Authentication Flow
1. **Login:** POST to `/_allauth/browser/v1/auth/login` with `email` and `password`.
2. **Token:** The system uses JWT. Include the access token in the header for protected routes:
   `Authorization: Bearer <your_access_token>`

### 📂 Major Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/posts/` | GET / POST | List/Create blog posts |
| `/posts/{id}/like/` | POST | Toggle like on a post |
| `/posts/{id}/comments/` | GET / POST | Manage post comments |
| `/users/profiles/me/` | GET / PUT | Manage own profile |
| `/users/profiles/{id}/follow/` | POST | Follow/Unfollow a user |
| `/api/docs/` | GET | Full Swagger UI |

---

## 🏗 Project Structure

```text
backend/
├── apps/
│   ├── blog/       # Post, Category, and Tagging logic
│   ├── comments/   # Nested comments & comment likes
│   ├── likes/      # Generic Post likes
│   ├── users/      # Custom User & Profile management
│   └── tags/       # Generic tagging system (Content-Type)
├── core/           # Project settings & URL configuration
└── manage.py
```

---

## 🛡 Industry Standards Applied
- **Clean Code:** Adheres to PEP8 and DRF best practices.
- **Surgical Logic:** Atomic transactions for data integrity.
- **Security:** CSRF/CORS protection and production-ready security settings.
- **Scalability:** Optimized for high-volume reads using Django's ORM optimization techniques.

---

## 🤝 Contributing
Feel free to fork this project and submit PRs for any improvements!

---
**Maintained by:** Ahnaf  
**Status:** Production Ready
