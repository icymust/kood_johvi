import axios from "axios";

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

const apiCall = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiCall.interceptors.request.use((config) => {
  console.log("REQ", config.method, config.url);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiCall.interceptors.response.use(
  (response) => {
    console.log("RES", response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("401");
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes.data.accessToken;
        setAccessToken(newToken);
        console.log("REFRESHED");

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiCall(originalRequest);
      } catch (refreshError) {
        console.log("FAIL REFRESH");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiCall;
