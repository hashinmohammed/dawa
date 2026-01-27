import { instance } from "./instance";
import { attachRequestInterceptors } from "./interceptors/request";
import { attachResponseInterceptors } from "./interceptors/response";

// Attach interceptors
attachRequestInterceptors(instance);
attachResponseInterceptors(instance);

// Export the configured client
export const client = instance;
