/**
 * Frontend API Connection Test
 * Tests connectivity from frontend to backend API
 * Run with: node test-api-connection.mjs
 */

const BACKEND_URL = process.env.VITE_BACKEND_API_URL || "http://192.168.0.71:8001";

console.log("\n" + "=".repeat(60));
console.log("FRONTEND-BACKEND CONNECTION TEST");
console.log("=".repeat(60));
console.log(`Backend URL: ${BACKEND_URL}\n`);

async function testEndpoint(method, endpoint) {
  try {
    const url = new URL(`${BACKEND_URL}/${endpoint.replace(/^\//, "")}`);
    console.log(`Testing ${method} ${endpoint}...`);

    const response = await fetch(url.toString(), {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(`  ✗ Status ${response.status}`);
      return false;
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      console.log(`  ✓ Status 200 OK (returned ${data.length} items)`);
    } else {
      console.log(`  ✓ Status 200 OK`);
      console.log(`  Response:`, data);
    }
    return true;
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
    return false;
  }
}

async function testBackendAvailability() {
  console.log("\n" + "=".repeat(60));
  console.log("BACKEND AVAILABILITY TEST");
  console.log("=".repeat(60));

  try {
    console.log(`Connecting to ${BACKEND_URL}...`);
    const response = await fetch(`${BACKEND_URL}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✓ Backend is running!");
      console.log(`✓ Response: `, data);
      return true;
    } else {
      console.log(`✗ Backend returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`✗ Cannot connect to backend at ${BACKEND_URL}`);
    console.log(`   Error: ${error.message}`);
    console.log("   Make sure the backend is running:");
    console.log("   cd APMS && python -m uvicorn backend.main:app --reload");
    return false;
  }
}

async function testCORSHeaders() {
  console.log("\n" + "=".repeat(60));
  console.log("CORS HEADERS TEST");
  console.log("=".repeat(60));

  try {
    const response = await fetch(`${BACKEND_URL}/`, {
      method: "GET",
    });

    const corsHeaders = {
      "access-control-allow-origin": response.headers.get("access-control-allow-origin") || "NOT SET",
      "access-control-allow-methods": response.headers.get("access-control-allow-methods") || "NOT SET",
      "access-control-allow-headers": response.headers.get("access-control-allow-headers") || "NOT SET",
    };

    console.log("\nCORS Headers:");
    for (const [header, value] of Object.entries(corsHeaders)) {
      console.log(`  ${header}: ${value}`);
    }

    if (corsHeaders["access-control-allow-origin"] !== "NOT SET") {
      console.log("\n✓ CORS is configured");
      return true;
    } else {
      console.log("\n⚠ CORS headers not found (may be configured for preflight only)");
      return true;
    }
  } catch (error) {
    console.log(`✗ Error checking CORS: ${error.message}`);
    return false;
  }
}

async function testAPIEndpoints(backendAvailable) {
  if (!backendAvailable) {
    console.log("\n(Skipping endpoint tests - backend not available)");
    return {};
  }

  console.log("\n" + "=".repeat(60));
  console.log("API ENDPOINTS TEST");
  console.log("=".repeat(60) + "\n");

  const endpoints = [
    { method: "GET", path: "/tools/" },
    { method: "GET", path: "/projects/" },
    { method: "GET", path: "/interventions/" },
    { method: "GET", path: "/tool-types/" },
  ];

  const results = {};
  for (const { method, path } of endpoints) {
    results[path] = await testEndpoint(method, path);
  }

  return results;
}

async function main() {
  const backendAvailable = await testBackendAvailability();
  await testCORSHeaders();
  const endpointResults = await testAPIEndpoints(backendAvailable);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("TEST SUMMARY");
  console.log("=".repeat(60));

  const results = {
    "Backend Running": backendAvailable,
    "Endpoints Accessible": Object.values(endpointResults).every(v => v === true),
  };

  for (const [test, passed] of Object.entries(results)) {
    const status = passed ? "✓ PASS" : "✗ FAIL";
    console.log(`${status}: ${test}`);
  }

  const allPassed = Object.values(results).every(v => v === true);

  console.log("\n" + "=".repeat(60));
  if (allPassed) {
    console.log("✓ ALL TESTS PASSED!");
    console.log("Frontend can connect to backend successfully!");
  } else {
    console.log("✗ SOME TESTS FAILED");
    console.log("\nTroubleshooting:");
    if (!backendAvailable) {
      console.log("  - Start the backend server:");
      console.log("    cd APMS && python -m uvicorn backend.main:app --reload");
      console.log("  - Or set VITE_BACKEND_API_URL environment variable");
    }
    if (!Object.values(endpointResults).every(v => v === true)) {
      console.log("  - Check backend API endpoints in backend/main.py");
    }
  }
  console.log("=".repeat(60) + "\n");

  process.exit(allPassed ? 0 : 1);
}

main();
