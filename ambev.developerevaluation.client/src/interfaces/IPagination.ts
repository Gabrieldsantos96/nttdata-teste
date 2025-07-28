export interface Pagination {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
}

export interface IPaginationResponse<T> {
  items: T[];
  pagination: Pagination;
}
