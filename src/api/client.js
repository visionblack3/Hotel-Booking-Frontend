import axios from "axios";

// Fall back to "/api" so Vercel's rewrite proxy can intercept requests
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const client = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor: Attach JWT Token safely
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (config.headers.set) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Response Interceptor: Handle 401 Unauthorized & Redirect
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Avoid infinite redirect loops if already on login page
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

/**
 * Extracts human-readable backend validation messages or default error text.
 */
export function extractErrorMessage(err) {
  if (err.response?.data) {
    const data = err.response.data;
    if (typeof data === "string") return data;
    if (data.message && typeof data.message === "string") return data.message;
    if (data.error && typeof data.error === "string") return data.error;
    if (typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      if (firstKey && typeof data[firstKey] === "string") return data[firstKey];
    }
  }
  
  if (err.request && !err.response) {
    return "Unable to connect to the server. Please check your network connection.";
  }

  return err.message || "Something went wrong. Please try again.";
}

export default client;
