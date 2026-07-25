import { GFError } from "@/utils/error/GFError";
import pageFetcher from "../page-fetcher/index";
import * as cheerio from "cheerio";

class MovieCrawler {
  crawlIndex(): Promise<Array<Record<string, any>>> {
    return new Promise<Array<Record<string, any>>>((resolve, reject) => {
      pageFetcher
        .fetchHtml("/")
        .then((content) => {
          const $ = cheerio.load(content);
          const list: Array<Record<string, any>> = [];
          $("main[id=index-main]")
            .find("div.module")
            .not(':contains("热门影视")')
            .map((_, gropElem) => {
              const groupInfo: Record<string, any> = {};
              const $gropElem = $(gropElem);
              const grouTitle = $gropElem.find("h2.module-title").text();
              groupInfo["title"] = grouTitle;
              const itemList: Array<Record<string, any>> = [];
              $gropElem.find("div.module-item").each((_, item) => {
                const $item = $(item);
                const tag = $item.find("div.module-item-text").text();
                const image = $item
                  .find("a.module-item-pic")
                  .find("img")
                  .attr("data-src");
                const title = $item
                  .find("div.module-item-titlebox")
                  .text()
                  .trim();
                const href = $item.find("a.module-item-pic").attr("href");
                itemList.push({
                  title: title,
                  cover: image,
                  tag: tag,
                  href: href,
                });
              });
              groupInfo["list"] = itemList;
              list.push(groupInfo);
            });
          resolve(list);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  crawlTypeList(url: string): Promise<Record<string, any>> {
    return new Promise<Record<string, any>>((resolve, reject) => {
      pageFetcher
        .fetchHtml(url)
        .then((content) => {
          const $ = cheerio.load(content);
          const $list = $("div.module")
            .find("div.module-list")
            .find("div.module-items");            
          const list = $list.find("div.module-item").map((_, item) => {
            const $item = $(item);
            const $title = $item.find("a.module-item-title");

                     console.log({
              title: $title.attr("title"),
              href: $title.attr("href"),
              image: $item.find("img.lazyload").attr("data-src"),
              tag: $item.find("div.module-item-text").text().trim(),
            });
            return {
              title: $title.attr("title"),
              href: $title.attr("href"),
              cover: $item.find("img.lazyload").attr("data-src"),
              tag: $item.find("div.module-item-text").text().trim(),
            };
   
            
          });
          resolve(list);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  crawlDetail(url: string): Promise<Record<string, any>> {
    return new Promise<Record<string, any>>((resolve, reject) => {
      pageFetcher
        .fetchHtml(url)
        .then((content) => {          
          const $ = cheerio.load(content);
          const info = $("div.video-info");
          info.find("span.slash").remove();

          const name = info.find("h1.page-title").text().trim();
          const tags = info.find(".tag-link").map((_, elem) => {
            return $(elem).text().trim();
          });
          const director = info
            .find("div.video-info-items:contains('导演')")
            .find(".video-info-item")
            .text()
            .trim(); // 导演
          const actor = info
            .find("div.video-info-items:contains('主演')")
            .find(".video-info-item")
            .text()
            .trim();
          const updateTime = info
            .find("div.video-info-items:contains('更新')")
            .find(".video-info-item")
            .text()
            .trim();
          const remark = info
            .find("div.video-info-items:contains('备注')")
            .find(".video-info-item")
            .text()
            .trim();
          const language = info
            .find("div.video-info-items:contains('语言')")
            .find(".video-info-item")
            .text()
            .trim();
          const plot = info
            .find("div.video-info-items:contains('剧情')")
            .find(".video-info-item")
            .text()
            .trim();

          // 获取目录列表
          const videos = $("div.module-blocklist")
            .first()
            .find("a")
            .map((_, elem) => {
              const $elem = $(elem);
              return { name: $elem.text().trim(), url: $elem.attr("href") };
            });

            const cover = $("div.video-cover").find("img").attr("data-src")

          resolve({
            name: name,
            tags: tags,
            director: director,
            actor: actor,
            updateTime: updateTime,
            remark: remark,
            language: language,
            plot: plot,
            videos: videos,
            cover: cover
          });
        })
        .catch((err) => {
          reject(err);
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
