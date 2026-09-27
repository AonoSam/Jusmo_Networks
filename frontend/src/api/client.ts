import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/" ,  //"http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("auth/login") &&
      !originalRequest.url?.includes("auth/refresh")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push(() => {
            apiClient(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      isRefreshing = true;

      try {
        await axios.post(
          "/api/auth/refresh/", //"http://127.0.0.1:8000/api/auth/refresh/",
          {},
          { withCredentials: true }
        );

        refreshQueue.forEach((cb) => cb());
        refreshQueue = [];

        return apiClient(originalRequest);
      } catch (refreshError) {
        // No valid session — just let the original error propagate.
        // Do NOT force-navigate here: an unauthenticated visitor on the
        // public site is a completely normal state, not an error to
        // redirect away from. Protected pages handle their own redirect
        // via ProtectedRoute once `useAuth`'s user state resolves to null.
        refreshQueue = [];
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;