export const AUTH_STORAGE_KEY = "auth_issuer";

export const APP_THEME = "app_theme";

export const REFRESH_TOKEN_STORAGE_KEY = "issuer";

export const enum Cache {
  ProfileKey = "profile",
  CodeKey = "code",
}

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
    UPDATE: "/users/create",
    DELETE: "/users/delete",
  };
}
