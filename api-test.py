import httpx
import asyncio
import sys

# Modern API Testing Script using httpx

BASE_URL = "http://127.0.0.1:8000/api"

async def test_api():
    print(f"--- Starting API Tests on {BASE_URL} ---")
    
    async with httpx.AsyncClient() as client:
        # 1. Test Root/Docs
        try:
            response = await client.get(f"{BASE_URL}/docs/")
            print(f"GET /docs/: {response.status_code}")
        except httpx.ConnectError:
            print("ERROR: Could not connect to the server. Is it running?")
            return

        # 2. Test Posts List (Public)
        response = await client.get(f"{BASE_URL}/posts/")
        print(f"GET /posts/: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Found {data.get('count', 0)} posts")

        # 3. Test Unauthorized Access
        response = await client.post(f"{BASE_URL}/posts/", json={"title": "Unauthorized"})
        print(f"POST /posts/ (unauthorized): {response.status_code}")
        assert response.status_code == 401

    print("--- API Tests Finished ---")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "run":
        asyncio.run(test_api())
    else:
        print("Usage: python api-test.py run")
        print("Note: Ensure the backend server is running on http://127.0.0.1:8000")
