import axios, { type AxiosInstance } from "axios";

export class Interceptors {
  axiosInstance: AxiosInstance;

  constructor() {
    let envMeta = import.meta.env;
    this.axiosInstance = axios.create({
      baseURL: envMeta.VITE_API_URL,
      timeout: 180000,
    });
    this.initInterceptors();
  }

  initInterceptors() {
    // 设置请求头
    this.axiosInstance.defaults.headers.post["Content-Type"] =
      "application/json";
    // 请求拦截器
    this.axiosInstance.interceptors.request.use((config: any) => {
      // config.headers

      return config;
    });
    // 响应拦截器
    this.axiosInstance.interceptors.response.use((response) => {
      return response;
    });
  }
}
