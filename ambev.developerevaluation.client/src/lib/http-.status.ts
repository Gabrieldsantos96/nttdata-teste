export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 300;
}

export function isErrorStatus(status: number): boolean {
  return status >= 400;
}

export function isUnauthorized(status: number): boolean {
  return (
    status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN
  );
}
