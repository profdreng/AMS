const resolveBackendUrl = (url: string) => {
  // If we are accessing from another machine (not localhost), 
  // but the API is set to localhost, we swap it for the current machine's IP/hostname.
  if (url.includes("localhost") && typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return url.replace("localhost", window.location.hostname);
  }
  return url;
};

// Use environment variable or default to 192.168.0.71:8001
const DEFAULT_BACKEND = "http://192.168.0.71:8001";
const ENV_BACKEND = import.meta.env.VITE_BACKEND_API_URL;

console.log("[APIClient] VITE_BACKEND_API_URL:", ENV_BACKEND);
console.log("[APIClient] Using backend:", ENV_BACKEND || DEFAULT_BACKEND);

const BACKEND_URL = resolveBackendUrl(ENV_BACKEND || DEFAULT_BACKEND);

export class APIClient {
  /**
   * utility class to centralize all communication between the
   * Frontend (React) and the Backend (FastAPI).
   */

  static async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T | null> {
    try {
      const url = new URL(`${BACKEND_URL}/${endpoint.replace(/^\//, "")}`);
      if (params) {
        Object.keys(params).forEach((key) => url.searchParams.append(key, String(params[key])));
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error connecting to backend (${endpoint}):`, error);
      return null;
    }
  }

  static async post<T>(endpoint: string, data: any): Promise<T | null> {
    try {
      const response = await fetch(`${BACKEND_URL}/${endpoint.replace(/^\//, "")}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error sending data to backend (${endpoint}):`, error);
      return null;
    }
  }

  static async put<T>(endpoint: string, data: any): Promise<T | null> {
    try {
      console.log(`[PUT] ${BACKEND_URL}/${endpoint}`, data);
      
      const response = await fetch(`${BACKEND_URL}/${endpoint.replace(/^\//, "")}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log(`[PUT Response] Status: ${response.status}`, response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[PUT Error] ${response.status}: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const result = await response.json();
      console.log(`[PUT Success]`, result);
      return result;
    } catch (error) {
      console.error(`[PUT Failed] Error updating data on backend (${endpoint}):`, error);
      throw error; // Propaga o erro para o chamador
    }
  }
}

export const apiClient = APIClient;
