# Full-Stack Authentication System Documentation

This document describes the complete authentication flow and setup across both the Django backend and Next.js frontend. It acts as a reproducible guide for implementing this exact same robust authentication flow in any future project.

---

## 1. Required Third-Party Dependencies

### Backend (Django / Python)
You need to install these packages (typically in your `requirements.txt` or via `pip`):
- `django-cors-headers` - For handling Cross-Origin Resource Sharing (CORS).
- `django-allauth` - Robust foundational authentication library (handles social auth and email confirm logic).
- `dj-rest-auth` - Exposes RESTful endpoints for allauth functionality (login, signup, logout).
- `djangorestframework-simplejwt` - For generating and verifying JSON Web Tokens (JWT).

**Relevant Apps for `INSTALLED_APPS` (settings.py):**
```python
THIRD_PARTY_APPS = [
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "dj_rest_auth",
    "dj_rest_auth.registration",
]
```

### Frontend (Next.js / React)
You need to install these packages (via `npm` or `yarn`):
- `axios` - For making HTTP requests to the backend.
- `js-cookie` - For reading cookies on the client side (like CSRF token).
- `@react-oauth/google` - Provided by Google for an easy Google Sign-in button and token generation workflow.
- `zustand` - For managing the global authentication state (`useAuthStore`).
- `@tanstack/react-query` - (Optional but recommended) For handling server state and mutations like `useLogin()`.
- `sonner` / `react-toastify` - For toast notifications on success/error.

---

## 2. Backend Configuration (`settings.py`)

### JWT and REST Auth Setup
We use `dj-rest-auth` to manage the authentication logic, while `simplejwt` handles the token issuance. Instead of returning tokens in the JSON payload (which exposes them to XSS attacks), they are stored securely in `HttpOnly` cookies.

```python
REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_COOKIE": "access",          # Name of access token cookie
    "JWT_AUTH_REFRESH_COOKIE": "refresh", # Name of refresh token cookie
    "JWT_AUTH_HTTPONLY": True,            # JavaScript cannot read these cookies
    "JWT_AUTH_SECURE": False,             # Set to True in production (HTTPS)
    "JWT_AUTH_SAMESITE": "Lax",
    "JWT_AUTH_RETURN_EXPIRATION": True,
    "JWT_AUTH_COOKIE_USE_CSRF": True,     # Forces CSRF checks on auth methods
    "REGISTER_SERIALIZER": "yourapp.serializers.CustomRegisterSerializer",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
}
```

### CORS Configuration
Because the frontend and backend run on different ports (e.g., frontend 3000, backend 8000), Cross-Origin Resource Sharing must be properly configured. Crucially, `CORS_ALLOW_CREDENTIALS` must be `True` so the backend accepts cookies sent from the frontend.

```python
CORS_URLS_REGEX = r"^/api/.*$"
CORS_ALLOW_CREDENTIALS = True # Critical: allows cookies to be passed back and forth
# Include CORS_ALLOWED_ORIGINS in production pointing to your frontend URL
```

### CSRF Configuration
```python
CSRF_COOKIE_HTTPONLY = False          # Crucial: allows JS frontend to read 'csrftoken'
CSRF_HEADER_NAME = 'HTTP_X_CSRFTOKEN' # The header django expects
```

---

## 3. Frontend Global Setup and API Interceptors

The frontend uses `axios` intercepts to accomplish two major things seamlessly:
1. **CSRF Inclusion**: Attach the CSRF token on every mutating request (POST, PUT, DELETE).
2. **Silent Token Refresh**: If a request fails with a 401 Unauthorized, automatically ping the refresh token endpoint and retry the request silently.

### The Axios Configuration (`src/lib/api.js`)
```javascript
import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Critical: sends cookies with every request
});

// 1. CSRF Interceptor
api.interceptors.request.use((config) => {
  const csrfToken = Cookies.get("csrftoken"); // Read from frontend cookie
  if (csrfToken && config.method !== "get") {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

// 2. Token Refresh Interceptor
let isRefreshing = false;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Condition: 401, haven't retried yet, and isn't the refresh/login endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/api/auth/")) {
      originalRequest._retry = true;
      try {
        // Ping refresh endpoint. Backend reads 'refresh' cookie, issues new 'access' cookie.
        await axios.post(`${api.defaults.baseURL}/api/auth/token/refresh/`, {}, { withCredentials: true });
        return api(originalRequest); // Retry original
      } catch (refreshError) {
        return Promise.reject(refreshError); // Refresh failed (session died)
      }
    }
    return Promise.reject(error);
  }
);
```

### The Global Auth Store (`src/store/useAuthStore.js`)
A lightweight `zustand` store keeps track of the currently logged-in user in memory. Used by hooks and components across the entire app.

```javascript
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

---

## 4. Email Verification Flow

When a user signs up, the backend generates an `EmailConfirmationHMAC` tied to the user's email and sends them an email containing a special `key` in the URL (handled by Custom Allauth configurations).

**1. Verification URL:** The email template points to the Frontend route `http://localhost:3000/verify-email/[key]`.
**2. Frontend Action (`src/app/verify-email/[key]/page.js`):** 
On mount, the component extracts the `[key]`, runs a POST request to our custom Django API view `/api/auth/registration/verify-email/`, passing the `{ "key": key }`.
**3. Backend Action (`views.py`):**
```python
class VerifyEmailAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        key = request.data.get('key')
        confirmation = EmailConfirmationHMAC.from_key(key)
        if not confirmation:
            # Fallback to standard DB records
            confirmation = EmailConfirmation.objects.get(key=key) 
        
        confirmation.confirm(request) # Marks email as verified
        return Response({"message": "Successfully verified"})
```
**4. Frontend Resolution:** If successful, the user is fetched `getMe()` and auto-logged in, redirecting immediately to the home page or dashboard.

---

## 5. Google Sign-In Flow (OAuth2)

We use Google OAuth via the Implicit Flow. Both frontend and backend coordinate to log the user in.

**1. App Provider Wrapping:** By wrapping the app in `@react-oauth/google`'s `<GoogleOAuthProvider clientId="YOUR_ID_HERE">`, Google's SDK initiates.

**2. The Client-Side Button Component:** 
Using the `useGoogleLogin()` hook from `@react-oauth/google`.
- The user clicks the button.
- A popup appears logging them into their Google account.
- Google sends the frontend a short-lived `access_token` representing that the user successfully authenticated with Google.
- We **POST** this `access_token` to the Backend hook `/api/auth/google/`.
```javascript
const googleLogin = useGoogleLogin({
  onSuccess: async (codeResponse) => {
    // Send token to django
    const response = await api.post("/api/auth/google/", {
      access_token: codeResponse.access_token,
    });
    setUser(response.data.user);
  },
  flow: "implicit",
});
```

**3. Backend Action (`views.py`):**
Django verifies the sent `access_token` directly with Google servers using `allauth` adapters. If valid, it matches the Google Email to an internal User (creating one if it doesn't exist). Because `dj-rest-auth` is configured for JWT cookies, it responds by automatically setting our HttpOnly `access` and `refresh` cookies.

```python
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/" # Arbitrary, required by OAuth flow
    client_class = OAuth2Client
    permission_classes = [AllowAny]
```
Settings modifications:
```python
SOCIALACCOUNT_PROVIDERS = {
    "google": { "VERIFIED_EMAIL": True } # Mark Google accounts verified instantly
}
# Don't prompt the user to verify email, auto-create their account.
SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_EMAIL_VERIFICATION = "none" 
```

---

## 6. How CORS and CSRF work together

**CORS** enforces that only your specific frontend origin (e.g., `localhost:3000`) is allowed to converse with your API (e.g., `localhost:8000`). It's essential the backend sends down `Access-Control-Allow-Credentials: true` so the browser permits the saving of the cookies sent from the API on the client browser.

**CSRF (Cross-Site Request Forgery)** protects those very same cookies. Because HttpOnly cookies are automatically attached by the browser on every request (whether the user meant to or not), an attacker could trigger a malicious request to your backend from another website. 
In our flow:
1. `dj-rest-auth` is told to force `CSRF` validation (`"JWT_AUTH_COOKIE_USE_CSRF": True`).
2. We make `CSRF_COOKIE_HTTPONLY` = `False` in Django meaning JavaScript **can** physically access the `csrftoken` cookie.
3. Your Axios Interceptor manually reads `Cookies.get("csrftoken")` and attaches it as a specific header `X-CSRFToken`. 
4. The attacker's website *cannot* read the `csrftoken` cookie because it is tied to your frontend's domain, thus meaning they cannot append the header, and the backend Django server rejects their malicious mutating requests.

---

## Summary of Implementation Steps for New Project 

1. Install `dj-rest-auth`, `django-allauth`, `cors-headers`, `simplejwt` in the Backend.
2. Edit `settings.py` adding all configurations (JWT rules, CSRF exposure, CORS allowances, Social App configuration).
3. Create `GoogleLogin` and `VerifyEmailAPIView` in Backend `views.py`. Wire them up in `urls.py`. 
4. Install `@react-oauth/google`, `axios`, `js-cookie`, `zustand` in the Frontend.
5. Create the global `axios.create()` instance mapping your Refresh Interceptor and your CSRF Extractor map.
6. Build global `useAuthStore` with Zustand.
7. Wrap React Tree in `QueryClientProvider` and `GoogleOAuthProvider`.
8. Create frontend hooks `useLogin`, `useSignup`, `useLogout` abstracting the requests via your intercepting axios instance.
9. Construct Login UI mapping buttons dynamically to your GoogleLogin logic and Standard Logic.
10. Done. Your session is now entirely handled by invisible Secure HttpOnly Cookies with self-healing silent refreshes and Google interoperability.
