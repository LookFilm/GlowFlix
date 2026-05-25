import { Interceptors } from "./interceptors";
import { PageEntity, ResponseEntity } from "./entity";
import type { AxiosInstance } from "axios";
import { showToast } from "vant";
// import store from "@/store/index";
// import { showLoginView } from "../login";
// import { apiErrorHandler } from "../errorHandler";

export class Request {
  axiosInstance: AxiosInstance;

  notShowToastState = [-4, -6009, -103];

  constructor() {
    this.axiosInstance = new Interceptors().axiosInstance;
  }

  /**
   * 获取对象
   * @param url 请求地址
   * @param params 参数
   * @param isShowLoadingView 是否显示 View.
   * @returns
   */
  getObject<T>(
    url: string,
    params: object = {},
    isShowLoadingView: boolean = true,
  ) {
    return new Promise<T>((resolve, reject) => {
      // if (isShowLoadingView) store.commit("updateIsShowLoadingView", true);
      this.axiosInstance
        .get<ResponseEntity<T>>(url, { params: params })
        .then((res) => {
          this.parserResponse(res.data, resolve, reject);
        })
        .catch((err) => {
          reject(err.message);
        })
        .finally(() => {
          // if (isShowLoadingView) store.commit("updateIsShowLoadingView", false);
        });
    });
  }

  /**
   * 获取列表数据
   * @param url 地址
   * @param params 参数
   * @returns
   */
  getList<T>(
    url: string,
    params: Record<string, any> = {},
    isShowLoadingView: boolean = true,
  ) {
    return this.getObject<Array<T>>(url, params, isShowLoadingView);
  }

  /**
   * 获取分页数据
   * @param url 地址
   * @param params 参数
   * @returns
   */
  getPage<T>(
    url: string,
    pageNum: number,
    params: Record<string, any> = {},
    pageSize: number = 15,
  ) {
    params["pageNum"] = pageNum;
    params["pageSize"] = pageSize;
    return this.getObject<PageEntity<T>>(url, params, false);
  }

  postObject<T>(url: string, params = {}, isShowLoadingView: boolean = true) {
    return new Promise<T>((resolve, reject) => {
      // if (isShowLoadingView) store.commit("updateIsShowLoadingView", true);
      this.axiosInstance
        .post<ResponseEntity<T>>(url, params, {})
        .then((res) => {
          this.parserResponse(res.data, resolve, reject);
        })
        .catch((err) => {
          reject(err.message);
        })
        .finally(() => {
          // if (isShowLoadingView) store.commit("updateIsShowLoadingView", false);
        });
    });
  }

  postPage<T>(
    url: string,
    pageNum: number,
    params: Record<string, any> = {},
    pageSize: number = 15,
  ) {
    params["pageNum"] = pageNum;
    params["pageSize"] = pageSize;
    return this.postObject<PageEntity<T>>(url, params, false);
  }

  putObject<T>(url: string, params = {}) {
    return new Promise<T>((resolve, reject) => {
      this.axiosInstance
        .put<ResponseEntity<T>>(url, params, {})
        .then((res) => {
          this.parserResponse(res.data, resolve, reject);
        })
        .catch((err) => {
          reject(err.message);
        });
    });
  }

  private parserResponse<T>(
    response: ResponseEntity<T>,
    resolve: any,
    reject: any,
  ) {
    if (response.code === 10000) {
      resolve(response.data);
    } else if (response.code == -1) {
      // showLoginView();
    } else if (this.notShowToastState.includes(response.code)) {
      // 将异常重新发射出去.
      reject(response.msg);
    } else {
      if (
        response.msg !== null &&
        response.msg !== undefined &&
        response.msg != ""
      ) {
        // 提示消息.
        showToast(response.msg);
        // 将异常重新发射出去.
        reject(response.msg);
      }
    }
  }
}

export default new Request();
