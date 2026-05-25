import request from "@/utils/request/request";

class MovieApi {
  /**
   * 获取去影片信息
   * @param id
   * @returns
   */
  getMovieInfo(id: string) {
    return request.postObject<Record<string, any>>(
      "/video/play-info",
      { id: id },
      false,
    );
  }

  /**
   * 获取去影片章节播放信息
   * @param movieId 影片 ID
   * @param set 章节 ID
   * @returns
   */
  getChapterPlayInfo(movieId: string, set: string) {
    return request.postObject<Record<string, any>>(
      "/video/set-info",
      { id: movieId, set: set },
      false,
    );
  }
}

export default new MovieApi();
