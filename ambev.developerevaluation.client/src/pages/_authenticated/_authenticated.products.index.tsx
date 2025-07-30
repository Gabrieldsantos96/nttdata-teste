import {
  createFileRoute,
  getRouteApi,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { z } from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { IProduct } from "~/interfaces/IProduct";
import { TablePagination } from "~/components/table-pagination";
import { Authorize } from "~/guards/guards";
import { IUserRole } from "~/interfaces/IUserProfileDto";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Star,
  Search,
  ShoppingCart,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  useDeleteProduct,
  useProducts,
} from "~/hooks/tanstack-hooks/use-product";
import { formatValue } from "~/utils/format-value";
import { DestructiveDialog } from "~/components/destructive-dialog";
import { openDialog } from "~/utils/trigger-dialog";
import { showToast } from "~/utils/trigger-toast";
import { MessageType } from "~/services/toast-service";
import { handleError } from "~/utils/handle-error";
import { queryClient } from "~/lib/tanstack-query";
import { ProductImage } from "~/components/image";
import { useCartsContext } from "~/contexts/cart-provider";

const productSearchSchema = z.object({
  searchTerm: z.string().catch(""),
  skip: z.number().catch(0),
  pageSize: z.number().catch(10),
});

export const Route = createFileRoute(
  "/_authenticated/_authenticated/products/"
)({
  validateSearch: productSearchSchema,
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

const renderStars = (product: IProduct) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 cursor-pointer ${
        i < Math.floor(product.rating.rate)
          ? "fill-yellow-400 text-yellow-400"
          : "text-gray-300"
      }`}
    />
  ));
};

function RouteComponent() {
  const { searchTerm, skip, pageSize } = Route.useSearch();

  const navigate = useNavigate();

  const { data: result, isFetching } = useProducts(skip, pageSize);

  const { mutateAsync: deleteProductByIdAsync } = useDeleteProduct();

  const { isLoading: isLoadingCart, addCartItem } = useCartsContext();

  const add = addCartItem!;

  const products = result?.data || [];

  const handleDelete = async (data: IProduct) => {
    try {
      const result = await openDialog(DestructiveDialog, {
        componentProps: {
          title: `${data.title}`,
          message: "Deseja confirmar a exclusão do produto?",
          variant: "destructive",
        },
      });

      if (result) {
        await deleteProductByIdAsync(data.id);
        showToast({ text: "Excluído com sucesso", type: MessageType.Success });

        queryClient.invalidateQueries({
          queryKey: ["products", skip, pageSize],
        });
      }
    } catch (err) {
      handleError(err);
    }
  };

  const filteredProducts = products.filter(
    (product: IProduct) =>
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handlePageChange(page: number) {
    navigate({
      search: { skip: (page - 1) * pageSize, pageSize, searchTerm },
    } as never);
  }

  function handlePageSizeChange(newPageSize: number) {
    navigate({
      search: { pageSize: newPageSize, skip: 0, searchTerm },
    } as never);
  }

  function handleSearchTermChange(newSearchTerm: string) {
    navigate({
      search: { searchTerm: newSearchTerm, skip: 0, pageSize },
    } as never);
  }

  if (isFetching) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                Produtos
              </h1>
              <p className="text-muted-foreground">
                Gerencie seu catálogo de produtos
              </p>
            </div>
            <Link to="/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="w-full h-48 bg-gray-200 rounded-md"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Produtos
            </h1>
            <p className="text-muted-foreground">
              Gerencie seu catálogo de produtos
            </p>
          </div>
          <Link to="/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {!filteredProducts.length && !isFetching ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product: IProduct) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden"
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg p-2">
                      <ProductImage
                        src={product.image}
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <Button
                          onClick={() =>
                            add({
                              productId: product.id,
                              quantity: 1,
                            })
                          }
                          className="bg-white text-black hover:bg-gray-100 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
                          size="sm"
                        >
                          {isLoadingCart ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                          ) : (
                            <>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Adicionar
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                            >
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link
                              from="/products"
                              to={"/products/edit/$productId"}
                              params={{ productId: product.id }}
                            >
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              onClick={() => handleDelete(product)}
                              className="text-red-600 flex items-center"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2 leading-tight">
                          {product.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2 text-sm">
                        {product.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {renderStars(product)}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({product.rating.count})
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 pb-0">
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex flex-col">
                        <div className="text-2xl font-bold text-primary">
                          {formatValue(product.price.amount)}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="shrink-0 bg-primary hover:bg-primary/90"
                        onClick={() =>
                          add({
                            productId: product.id,
                            quantity: 1,
                          })
                        }
                      >
                        {isLoadingCart ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {result && (
              <TablePagination
                currentPage={result.currentPage}
                totalPages={result.totalPages}
                totalCount={result.totalItems}
                pageSize={result.data.length}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                isLoading={isFetching}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
