namespace Ambev.DeveloperEvaluation.Shared.Consts;

public static class ApiRoutes
{
    public static class Authentication
    {
        public const string SignIn = "/auth/login";
        public const string Register = "/auth/register";
        public const string SignOut = "/auth/sign-out";
        public const string RefreshJwt = "/auth/refresh-jwt";
        public const string GetProfile = "/auth/get-profile";
    }

    public static class Carts
    {
        public const string GetPaginatedCarts = "/carts";
        public const string CreateCart = "/cart";
        public const string GetCartById = "/cart/{id}";
        public const string UpdateCart = "/cart/{id}";
        public const string DeleteCart = "/cart/{id}";
    }

    public static class Sales
    {
        public const string GetPaginatedSales = "/sales";
        public const string CreateSale = "/sale/{cartId}";
        public const string GetSaleById = "/sale/{id}";
        public const string UpdateSale = "/sale/{id}";
        public const string DeleteSale = "/sale/{id}";
    }

    public static class Products
    {
        public const string GetPaginatedProducts = "/products";
        public const string GetGroupedPaginatedProducts = "/products/categories";
        public const string CreateProduct = "/product";
        public const string GetProductById = "/product/{id}";
        public const string UpdateProduct = "/product/{id}";
        public const string DeleteProduct = "/product/{id}";
        
    }

    public static class Users
    {
        public const string GetPaginatedUsers = "/users";
        public const string GetUserById = "/user/{id}";
        public const string UpdateUser = "/user/{id}";
        public const string DeleteUser = "/user/{id}";
    }
}