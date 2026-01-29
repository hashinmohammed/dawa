import { useStore } from "../../../shared/store/useStore";

export const attachRequestInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = useStore.getState().accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
};
