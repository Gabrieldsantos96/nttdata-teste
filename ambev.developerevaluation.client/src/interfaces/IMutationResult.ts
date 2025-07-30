export type MutationResult<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};
