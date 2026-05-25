/**
 * 接口响应
 */
export class ResponseEntity<T> {
  /**
   * 描述信息
   */
  msg!: string;

  /**
   * 状态码
   */
  code!: number;

  /**
   * 数据内容
   */
  data?: T;
}

/**
 * 分页数据
 */
export class PageEntity<T> {
  /**
   * 是否还有更多
   */
  hasMore!: boolean;

  /**
   * 每页条数
   */
  pageSize!: number;

  /**
   * 总数据条数
   */
  total!: number;

  /**
   * 当前页内容
   */
  list!: Array<T>;
}
