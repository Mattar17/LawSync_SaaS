import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authStorage } from "./authStorage";
import { useUserStore } from "../zustandStore/userStore";

const BASE_URL = (import.meta.env.VITE_BASE_URL ?? "http://localhost:8000").replace(/\/+$/, "");
const API_KEY = import.meta.env.VITE_API_KEY ?? "00043cfe7d9b38d97ce32f7bfa80ebdcdaa969ad848d1dc74224dd3abe7aea50";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
});

// 1. Request interceptor: Attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = authStorage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Refresh queue management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 3. Response interceptor: Intercept 401 and auto-refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Do not attempt refresh on auth endpoints (login, register, refresh)
    const isAuthRoute =
      originalRequest.url?.includes("/api/login") ||
      originalRequest.url?.includes("/api/register") ||
      originalRequest.url?.includes("/api/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = authStorage.getRefreshToken();

        // Meezan-api /api/auth/refresh accepts both cookie and body: { refreshToken }
        const refreshResponse = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          storedRefreshToken ? { refreshToken: storedRefreshToken } : {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
            },
          },
        );

        const responseData = refreshResponse.data?.data || refreshResponse.data;
        const newAccessToken: string | undefined = responseData?.accessToken;
        const newRefreshToken: string | undefined =
          responseData?.newRefreshToken || responseData?.refreshToken;

        if (!newAccessToken) {
          throw new Error("No access token returned from refresh endpoint");
        }

        // Save rotated tokens
        authStorage.saveTokens(newAccessToken, newRefreshToken || storedRefreshToken);

        // Update default header and original request header
        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        authStorage.clearTokens();
        useUserStore.getState().clearUser();

        // Redirect to login if in browser
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/**
 * Convenience helper to replace raw fetch calls while keeping the same response shape:
 * { success: boolean, data?: T, message?: string }
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    data?: any;
    params?: any;
    headers?: Record<string, string>;
  } = {},
): Promise<{ success: boolean; data?: T; message?: string; status?: number }> {
  try {
    const res = await apiClient({
      url: endpoint,
      method: options.method || "GET",
      data: options.data,
      params: options.params,
      headers: options.headers,
    });

    const body = res.data;
    return {
      success: true,
      data: (body?.data !== undefined ? body.data : body) as T,
      message: body?.message,
      status: res.status,
    };
  } catch (err: any) {
    const res = err.response;
    return {
      success: false,
      data: res?.data?.data,
      message: res?.data?.message || err.message || "Request failed",
      status: res?.status || 500,
    };
  }
}

