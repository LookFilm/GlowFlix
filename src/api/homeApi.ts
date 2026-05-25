import type { PageEntity } from "@/utils/request/entity";
import request from "@/utils/request/request";

class HomeApi {
  /**
   * 获取系统配置
   * @returns
   */
  getConfig(): Promise<Record<string, any>> {
    return request.getObject<Record<string, any>>("/config/load", {}, false);
  }

  /**
   * 获取首页视频列表
   * @param pageNum
   * @param type
   * @param tag
   * @returns
   */
  getVideoList(
    pageNum: number,
    type: string,
    tag: string,
  ): Promise<PageEntity<Record<string, any>>> {
    return request.postPage<Record<string, any>>("/video/list", pageNum, {
      type: type,
      tag: tag,
    });
  }
}

export default new HomeApi();
