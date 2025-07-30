export interface IPaginationResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}
