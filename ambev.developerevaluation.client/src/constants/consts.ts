export const AUTH_STORAGE_KEY = "auth_issuer";

export const APP_THEME = "app_theme";

export const REFRESH_TOKEN_STORAGE_KEY = "issuer";

export const enum Plataforms {
  Android = "android",
  iOS = "ios",
  macOS = "macOS",
  Web = "web",
  Windows = "windows",
}

export class Routes {
  static Authentication = {
    SIGN_IN: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh-token",
    REGISTER: "/auth/register",
    SIGN_OUT: "/auth/sign-out",
    PROFILE: "/auth/get-profile",
  };

  static User = {
    UPDATE: "/user/${id}",
    DELETE: "/user/${id}",
    GET: "/user/${id}",
    CREATE: "/user",
    LIST: "/users",
  };

  static Sale = {
    CANCEL_ITEM: "/sale/{saleId}/items/{productId}/cancel",
    GET: "/sale/${id}",
    UPDATE: "/sale/${id}",
    DELETE: "/sale/${id}",
    CREATE: "/sale",
    LIST: "/sales",
  };

  static Product = {
    GET: "/product/${id}",
    UPDATE: "/product/${id}",
    DELETE: "/product/${id}",
    CREATE: "/product",
    LIST: "/products",
  };
}
