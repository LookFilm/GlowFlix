import { GFError } from "@/utils/error/GFError";
import axios from "axios";
import { showToast } from "vant";

class PageFetcher {
  fetchHtml(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      axios.get(`/qgiga${url}`, {}).then((response) => {
        if (response.status == 200) {
          resolve(response.data);
        } else {
          showToast("获取数据失败");
          reject(new GFError(0, "获取数据失败"));
        }
      });
    });
  }
}

export default new PageFetcher();
