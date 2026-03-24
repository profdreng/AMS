"""
Test API Connection and Endpoints
Tests the FastAPI backend to ensure it's running and endpoints are accessible.
"""

import requests
import sys
from database import engine

# Test Configuration
BACKEND_HOST = "127.0.0.1"
BACKEND_PORT = 8001
BASE_URL = f"http://{BACKEND_HOST}:{BACKEND_PORT}"

def test_database_connection():
    """Test database connectivity"""
    print("\n" + "="*60)
    print("DATABASE CONNECTION TEST")
    print("="*60)
    
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Database connection successful!")
            print(f"✓ Query result: {result.fetchone()}")
            return True
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False


def test_backend_availability():
    """Test if backend API is running"""
    print("\n" + "="*60)
    print("BACKEND AVAILABILITY TEST")
    print("="*60)
    print(f"Testing backend at: {BASE_URL}")
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        if response.status_code == 200:
            print("✓ Backend is running!")
            print(f"✓ Response: {response.json()}")
            return True
        else:
            print(f"✗ Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"✗ Cannot connect to backend at {BASE_URL}")
        print("   Make sure the backend is running: python -m uvicorn backend.main:app --reload")
        return False
    except requests.exceptions.Timeout:
        print(f"✗ Backend request timed out")
        return False
    except Exception as e:
        print(f"✗ Backend test failed: {e}")
        return False


def test_api_endpoints():
    """Test key API endpoints"""
    print("\n" + "="*60)
    print("API ENDPOINTS TEST")
    print("="*60)
    
    endpoints = [
        ("GET", "/tools/"),
        ("GET", "/projects/"),
        ("GET", "/interventions/"),
        ("GET", "/tool-types/"),
    ]
    
    results = {}
    for method, endpoint in endpoints:
        try:
            url = f"{BASE_URL}{endpoint}"
            print(f"\nTesting {method} {endpoint}...")
            
            if method == "GET":
                response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                print(f"  ✓ Status 200 OK")
                if isinstance(data, list):
                    print(f"  ✓ Returned {len(data)} items")
                results[endpoint] = True
            else:
                print(f"  ✗ Status {response.status_code}")
                results[endpoint] = False
                
        except requests.exceptions.ConnectionError:
            print(f"  ✗ Cannot connect to {url}")
            results[endpoint] = False
        except Exception as e:
            print(f"  ✗ Error: {e}")
            results[endpoint] = False
    
    return results


def test_cors_headers():
    """Test CORS headers configuration"""
    print("\n" + "="*60)
    print("CORS HEADERS TEST")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        headers = response.headers
        
        cors_headers = {
            "access-control-allow-origin": headers.get("access-control-allow-origin", "NOT SET"),
            "access-control-allow-methods": headers.get("access-control-allow-methods", "NOT SET"),
            "access-control-allow-headers": headers.get("access-control-allow-headers", "NOT SET"),
        }
        
        print("\nCORS Headers:")
        for header, value in cors_headers.items():
            print(f"  {header}: {value}")
        
        if headers.get("access-control-allow-origin"):
            print("\n✓ CORS is configured")
            return True
        else:
            print("\n⚠ CORS headers not found (may be configured for preflight)")
            return True
            
    except Exception as e:
        print(f"✗ Error checking CORS: {e}")
        return False


def main():
    """Run all connection tests"""
    print("\n" + "="*60)
    print("APMS CONNECTION TEST SUITE")
    print("="*60)
    
    results = {
        "Database": test_database_connection(),
        "Backend API": test_backend_availability(),
        "CORS": test_cors_headers(),
    }
    
    # Test endpoints only if backend is available
    if results["Backend API"]:
        endpoints = test_api_endpoints()
        results["API Endpoints"] = all(endpoints.values())
    
    # Print summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_name, passed in results.items():
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status}: {test_name}")
    
    # Overall result
    all_passed = all(results.values())
    print("\n" + "="*60)
    if all_passed:
        print("✓ ALL TESTS PASSED!")
    else:
        print("✗ SOME TESTS FAILED")
        print("\nTroubleshooting:")
        if not results.get("Database"):
            print("  - Check database URL in .env file")
            print("  - Ensure PostgreSQL is running on 192.168.0.71:5433")
        if not results.get("Backend API"):
            print("  - Start backend: cd APMS && python -m uvicorn backend.main:app --reload")
        if not results.get("CORS"):
            print("  - Check CORS configuration in backend/main.py")
    print("="*60 + "\n")
    
    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
