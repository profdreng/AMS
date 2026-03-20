const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000";

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
}

export const apiClient = APIClient;
