# Connection Tests

This directory contains comprehensive connection tests for the APMS system.

## Test Files

### Backend Tests (Python)

1. **test_db_setup.py** - Database Connection Test
   - Tests connection to PostgreSQL database
   - Verifies .env configuration
   - Runs a simple SELECT 1 query

2. **test_pg_conn.py** - Direct PostgreSQL Connection
   - Direct psycopg2 connection test
   - Low-level database verification

3. **test_api_connection.py** - Backend API & Endpoints Test
   - Tests if FastAPI backend is running
   - Validates all API endpoints (tools, projects, interventions, tool-types)
   - Checks CORS headers configuration
   - Comprehensive error reporting

### Frontend Tests (JavaScript/Node.js)

1. **test-api-connection.mjs** - Frontend-to-Backend Connection
   - Tests frontend's ability to reach backend API
   - Validates CORS configuration
   - Tests all key endpoints from frontend perspective

## Running the Tests

### Run All Tests (Recommended)

```bash
# From project root
./run-tests.sh  # Linux/Mac
run-tests.bat   # Windows
```

### Run Backend Tests

```bash
# Test database connection
cd APMS/backend
python test_db_setup.py

# Test PostgreSQL directly
python test_pg_conn.py

# Test API endpoints (requires backend running)
python test_api_connection.py
```

### Run Frontend Tests

```bash
# Test frontend-backend connectivity
cd APMS/frontend
node test-api-connection.mjs
```

## Requirements

### Backend Tests
- Python 3.8+
- SQLAlchemy
- psycopg2
- python-dotenv
- requests

Install with:
```bash
pip install sqlalchemy psycopg2-binary python-dotenv requests
```

### Frontend Tests
- Node.js 14+
- No additional dependencies (uses native fetch API)

## Test Results

Each test will output:
- ✓ PASS (green) for successful tests
- ✗ FAIL (red) for failed tests
- Detailed error messages for troubleshooting
- Summary of all results

## Common Issues & Solutions

### Database Connection Failed
- Check PostgreSQL is running on `192.168.0.71:5433`
- Verify `.env` file has correct `DATABASE_URL`
- Ensure credentials (postgres:postgrespassword) are correct

### Backend API Not Responding
- Make sure FastAPI backend is running:
  ```bash
  cd APMS
  python -m uvicorn backend.main:app --reload
  ```
- Check if port 8001 is available
- Verify firewall settings

### Frontend Cannot Connect
- Ensure backend is running first
- Check `VITE_BACKEND_API_URL` environment variable
- Verify CORS is configured in backend
- Check browser console for network errors

### CORS Errors
- Backend has CORS enabled by default
- Check `backend/main.py` for CORSMiddleware configuration
- In production, restrict `allow_origins` to specific domain

## Continuous Integration

To run tests automatically:

```bash
# Set up git hook (optional)
echo './run-tests.sh' > .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

## Environment Variables

Set these before running tests:

```bash
# PostgreSQL Connection
DATABASE_URL=postgresql://postgres:postgrespassword@192.168.0.71:5433/apms

# Backend API URL (for frontend tests)
VITE_BACKEND_API_URL=http://192.168.0.71:8001
```
