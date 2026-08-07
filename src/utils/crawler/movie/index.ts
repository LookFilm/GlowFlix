import { GFError } from "@/utils/error/GFError";
import pageFetcher from "../page-fetcher/index";
import * as cheerio from "cheerio";
import { showToast } from "vant";

class MovieCrawler {
  crawlIndex(): Promise<Array<Record<string, any>>> {
    return new Promise<Array<Record<string, any>>>((resolve, reject) => {
      fetch(`/data-source/qgiga/index.json`).then((response) => {
        response
          .json()
          .then((info) => {
            resolve(info);
          })
          .catch((err) => {
            reject(new GFError(0, "获取数据失败"));
          });
      });
    });
  }

  crawlTypeList(): Promise<Array<Record<string, any>>> {
    return new Promise<Array<Record<string, any>>>((resolve, reject) => {
      fetch(`/data-source/qgiga/types/index.json`).then((response) => {
        response
          .json()
          .then((info) => {
            resolve(info);
          })
          .catch((err) => {
            reject(new GFError(0, "获取数据失败"));
          });
      });
    });
  }

  crawlListByType(type: number, page: number): Promise<Record<string, any>> {
        return new Promise<Array<Record<string, any>>>((resolve, reject) => {
      fetch(`/data-source/qgiga/types/${type}/${page}.json`).then((response) => {
        response
          .json()
          .then((info) => {
            resolve(info);
          })
          .catch((err) => {
            reject(new GFError(0, "获取数据失败"));
          });
      });
    });
  }

  crawlDetail(path: string): Promise<Record<string, any>> {
    return new Promise<Record<string, any>>((resolve, reject) => {
      fetch(`/data-source${path}`).then((response) => {
        response
          .json()
          .then((info) => {
            resolve(info);
          })
          .catch((err) => {
            reject(new GFError(0, "获取数据失败"));
          });
      });
    });
  }

  /**
   * 获取视频播放链接
   * @param url 页面地址 /play/62150-0-0.html
   * @returns
   */
  crawlVideoUrl(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      pageFetcher
        .fetchHtml(url)
        .then((content) => {
          console.log(content);
          const $ = cheerio.load(content);
          const match = $("div.wupanzhi")
            .find("script")
            .text()
            .match(/var now="([^"]+\.m3u8)"/);
          if (match && match[1]) {
            resolve(match[1]);
          } else {
            reject(new GFError(0, "获取视频链接失败"));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default new MovieCrawler();
