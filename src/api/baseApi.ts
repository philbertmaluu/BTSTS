import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { baseUrl } from "./config";

const TOKEN_KEY = "btsts-token";

const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  // You might want to redirect to login page here
  window.location.href = "/login";
};

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  console.log("Token from localStorage:", token); // Debug log
  if (token && config.headers && typeof (config.headers as AxiosHeaders).set === "function") {
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    console.log("Authorization header set:", `Bearer ${token}`); // Debug log
  } else {
    console.log("No token found or headers not available"); // Debug log
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.log("API Error:", error.response?.status, error.response?.data); // Debug log
    if (error.response && error.response.status === 401) {
      console.log("401 Unauthorized - logging out"); // Debug log
      logout();
    }
    return Promise.reject(error);
  }
);

export async function get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.get(url, config);
  return response.data;
}

export async function post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  // If data is FormData, don't set Content-Type header to let browser set it with boundary
  if (data instanceof FormData) {
    const response: AxiosResponse<T> = await api.post(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        // Remove Content-Type to let browser set it automatically for FormData
        'Content-Type': undefined,
      },
    });
    return response.data;
  }
  
  // For regular JSON data, use default behavior
  const response: AxiosResponse<T> = await api.post(url, data, config);
  return response.data;
}

export async function put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  // If data is FormData, don't set Content-Type header to let browser set it with boundary
  if (data instanceof FormData) {
    const response: AxiosResponse<T> = await api.put(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        // Remove Content-Type to let browser set it automatically for FormData
        'Content-Type': undefined,
      },
    });
    return response.data;
  }
  
  // For regular JSON data, use default behavior
  const response: AxiosResponse<T> = await api.put(url, data, config);
  return response.data;
}

export async function patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  // If data is FormData, don't set Content-Type header to let browser set it with boundary
  if (data instanceof FormData) {
    const response: AxiosResponse<T> = await api.patch(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        // Remove Content-Type to let browser set it automatically for FormData
        'Content-Type': undefined,
      },
    });
    return response.data;
  }
  
  // For regular JSON data, use default behavior
  const response: AxiosResponse<T> = await api.patch(url, data, config);
  return response.data;
}

export async function del<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await api.delete(url, config);
  return response.data;
}

export default api;
