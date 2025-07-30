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
        public const string GetPaginatedCarts = "/features/carts";
        public const string CreateCart = "/features/cart";
        public const string GetCartById = "/features/features/cart/{id}";
        public const string UpdateCart = "/features/cart/{id}";
        public const string DeleteCart = "/features/cart/{id}";
    }

    public static class Sales
    {
        public const string GetPaginatedSales = "/features/sales";
        public const string CreateSale = "/features/sale/{cartId}";
        public const string GetSaleById = "/features/sale/{id}";
        public const string UpdateSale = "/features/sale/{id}";
        public const string DeleteSale = "/features/sale/{id}";
    }

    public static class Products
    {
        public const string GetPaginatedProducts = "/features/products";
        public const string GetGroupedPaginatedProducts = "/features/products/categories";
        public const string CreateProduct = "/features/product";
        public const string GetProductById = "/features/product/{id}";
        public const string UpdateProduct = "/features/product/{id}";
        public const string DeleteProduct = "/features/product/{id}";
        
    }

    public static class Users
    {
        public const string GetPaginatedUsers = "/features/users";
        public const string GetUserById = "/features/user/{id}";
        public const string UpdateUser = "/features/user/{id}";
        public const string DeleteUser = "/features/user/{id}";
    }
}