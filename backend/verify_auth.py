import requests
import json

# --- CONFIGURATION ---
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/_allauth/browser/v1/auth/login"
CONFIG_URL = f"{BASE_URL}/_allauth/browser/v1/config"
PROFILE_URL = f"{BASE_URL}/users/profile/me/"

# Replace these with valid credentials from your database
TEST_EMAIL = "testuser@example.com"
TEST_PASSWORD = "password123"

def test_headless_auth():
    session = requests.Session()
    
    print("\n--- 1. Fetching Initial Config & CSRF ---")
    try:
        response = session.get(CONFIG_URL)
        response.raise_for_status()
        csrf_token = session.cookies.get("csrftoken")
        print(f"[SUCCESS] CSRF Token obtained: {csrf_token[:10]}...")
    except Exception as e:
        print(f"[ERROR] Could not connect to backend: {e}")
        return

    print("\n--- 2. Attempting Headless Login ---")
    login_data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    headers = {
        "X-CSRFToken": csrf_token,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    try:
        response = session.post(LOGIN_URL, json=login_data, headers=headers)
        if response.status_code == 200:
            print("[SUCCESS] Login successful!")
            data = response.json()
            # Verify your CustomHeadlessAdapter worked
            if "data" in data and "user" in data["data"]:
                print(f"Logged in as: {data['data']['user'].get('email')}")
            else:
                print("Note: Custom user data not found in response, check adapter.")
        else:
            print(f"[FAILED] Login returned {response.status_code}: {response.text}")
            return
    except Exception as e:
        print(f"[ERROR] Login request failed: {e}")
        return

    print("\n--- 3. Verifying Session Persistence (Accessing Profile) ---")
    try:
        # No 'Authorization' header needed! We are using cookies (BFF style)
        response = session.get(PROFILE_URL)
        if response.status_code == 200:
            print("[SUCCESS] Session is valid! Profile data retrieved.")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"[FAILED] Session rejected ({response.status_code}). check REST_FRAMEWORK settings.")
    except Exception as e:
        print(f"[ERROR] Profile request failed: {e}")

if __name__ == "__main__":
    print(f"Testing Allauth Headless at {BASE_URL}")
    test_headless_auth()
