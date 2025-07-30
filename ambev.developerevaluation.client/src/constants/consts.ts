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

export const Routes = {
  Authentication: {
    SignIn: "/auth/login",
    Register: "/auth/register",
    SignOut: "/auth/sign-out",
    RefreshJwt: "/auth/refresh-jwt",
    GetProfile: "/auth/get-profile",
  },
  Carts: {
    GetPaginatedCarts: "features/carts",
    CreateCart: "features/cart",
    GetCartById: "features/cart/{id}",
    UpdateCart: "features/cart/{id}",
    DeleteCart: "features/cart/{id}",
  },
  Sales: {
    GetPaginatedSales: "features/sales",
    CreateSale: "features/sale/{cartId}",
    GetSaleById: "features/sale/{id}",
    UpdateSale: "features/sale/{id}",
    DeleteSale: "features/sale/{id}",
  },
  Products: {
    GetPaginatedProducts: "features/products",
    GetGroupedPaginatedProducts: "features/products/categories",
    CreateProduct: "features/product",
    GetProductById: "features/product/{id}",
    UpdateProduct: "features/product/{id}",
    DeleteProduct: "features/product/{id}",
  },
  Users: {
    GetPaginatedUsers: "features/users",
    GetUserById: "features/user/{id}",
    UpdateUser: "features/user/{id}",
    DeleteUser: "features/user/{id}",
  },
};
