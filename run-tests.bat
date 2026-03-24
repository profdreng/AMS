@echo off
REM Run all connection tests for APMS
REM This script runs database, API, and frontend connectivity tests

setlocal enabledelayedexpansion

echo.
echo ========================================
echo APMS CONNECTION TEST SUITE
echo ========================================
echo.

set TESTS_PASSED=0
set TESTS_FAILED=0

REM Test 1: Database Setup Test
echo [1/4] Running Database Setup Test...
cd "%~dp0APMS\backend"
python test_db_setup.py
if %errorlevel% equ 0 (
    set /a TESTS_PASSED+=1
    echo ✓ Database test passed
) else (
    set /a TESTS_FAILED+=1
    echo ✗ Database test failed
)
echo.

REM Test 2: Direct PostgreSQL Connection
echo [2/4] Running Direct PostgreSQL Connection Test...
python test_pg_conn.py
if %errorlevel% equ 0 (
    set /a TESTS_PASSED+=1
    echo ✓ PostgreSQL test passed
) else (
    set /a TESTS_FAILED+=1
    echo ✗ PostgreSQL test failed
)
echo.

REM Test 3: API Connection Test
echo [3/4] Running API Connection Test...
python test_api_connection.py
if %errorlevel% equ 0 (
    set /a TESTS_PASSED+=1
    echo ✓ API test passed
) else (
    set /a TESTS_FAILED+=1
    echo ✗ API test failed - Make sure backend is running
)
echo.

REM Test 4: Frontend API Connection (if Node.js is available)
echo [4/4] Running Frontend API Connection Test...
cd "%~dp0APMS\frontend"
if exist node_modules (
    node test-api-connection.mjs
    if %errorlevel% equ 0 (
        set /a TESTS_PASSED+=1
        echo ✓ Frontend test passed
    ) else (
        set /a TESTS_FAILED+=1
        echo ✗ Frontend test failed
    )
) else (
    echo ⚠ Node modules not installed - skipping frontend test
    echo   Run: npm install
)
echo.

REM Print Summary
echo ========================================
echo TEST SUMMARY
echo ========================================
echo Passed: !TESTS_PASSED!
echo Failed: !TESTS_FAILED!
echo.

if !TESTS_FAILED! equ 0 (
    echo ✓ ALL TESTS PASSED!
    exit /b 0
) else (
    echo ✗ Some tests failed
    exit /b 1
)
