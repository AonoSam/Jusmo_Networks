import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/",
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

      const isSafeToReplay =
        (originalRequest.method || "get").toLowerCase() === "get";

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push(() => {
            if (isSafeToReplay) {
              apiClient(originalRequest).then(resolve).catch(reject);
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        await axios.post(
          "/api/auth/refresh/",
          {},
          { withCredentials: true }
        );

        refreshQueue.forEach((cb) => cb());
        refreshQueue = [];

        if (isSafeToReplay) {
          return apiClient(originalRequest);
        }

        return Promise.reject(error);
      } catch (refreshError) {
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