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
        public const string GetAllCarts = "/carts";
        public const string CreateCart = "/carts";
        public const string GetCartById = "/carts/{id}";
        public const string UpdateCart = "/carts/{id}";
        public const string DeleteCart = "/carts/{id}";
    }

    public static class Products
    {
        public const string GetAllProducts = "/products";
        public const string CreateProduct = "/products";
        public const string GetProductById = "/products/{id}";
        public const string UpdateProduct = "/products/{id}";
        public const string DeleteProduct = "/products/{id}";
        public const string GetAllCategories = "/products/categories";
        public const string GetProductsByCategory = "/products/category/{category}";
    }

    public static class Users
    {
        public const string GetAllUsers = "/users";
        public const string CreateUser = "/users";
        public const string GetUserById = "/users/{id}";
        public const string UpdateUser = "/users/{id}";
        public const string DeleteUser = "/users/{id}";
    }
}