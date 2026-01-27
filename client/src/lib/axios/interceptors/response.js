export const attachResponseInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle global errors here (e.g. logging, toast notifications)
      console.error("API Error:", error);
      return Promise.reject(error);
    },
  );
};
