export interface IPaginationResponse<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}
