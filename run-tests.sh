#!/bin/bash

# Run all connection tests for APMS
# This script runs database, API, and frontend connectivity tests

echo ""
echo "========================================"
echo "APMS CONNECTION TEST SUITE"
echo "========================================"
echo ""

TESTS_PASSED=0
TESTS_FAILED=0

# Test 1: Database Setup Test
echo "[1/4] Running Database Setup Test..."
cd "$(dirname "$0")/APMS/backend"
python test_db_setup.py
if [ $? -eq 0 ]; then
    ((TESTS_PASSED++))
    echo "✓ Database test passed"
else
    ((TESTS_FAILED++))
    echo "✗ Database test failed"
fi
echo ""

# Test 2: Direct PostgreSQL Connection
echo "[2/4] Running Direct PostgreSQL Connection Test..."
python test_pg_conn.py
if [ $? -eq 0 ]; then
    ((TESTS_PASSED++))
    echo "✓ PostgreSQL test passed"
else
    ((TESTS_FAILED++))
    echo "✗ PostgreSQL test failed"
fi
echo ""

# Test 3: API Connection Test
echo "[3/4] Running API Connection Test..."
python test_api_connection.py
if [ $? -eq 0 ]; then
    ((TESTS_PASSED++))
    echo "✓ API test passed"
else
    ((TESTS_FAILED++))
    echo "✗ API test failed - Make sure backend is running"
fi
echo ""

# Test 4: Frontend API Connection (if Node.js is available)
echo "[4/4] Running Frontend API Connection Test..."
cd "$(dirname "$0")/APMS/frontend"
if [ -d "node_modules" ]; then
    node test-api-connection.mjs
    if [ $? -eq 0 ]; then
        ((TESTS_PASSED++))
        echo "✓ Frontend test passed"
    else
        ((TESTS_FAILED++))
        echo "✗ Frontend test failed"
    fi
else
    echo "⚠ Node modules not installed - skipping frontend test"
    echo "  Run: npm install"
fi
echo ""

# Print Summary
echo "========================================"
echo "TEST SUMMARY"
echo "========================================"
echo "Passed: $TESTS_PASSED"
echo "Failed: $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo "✓ ALL TESTS PASSED!"
    exit 0
else
    echo "✗ Some tests failed"
    exit 1
fi
