import { createFileRoute, Link } from "@tanstack/react-router";
import { DataTable } from "~/components/data-table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Star,
  Search,
} from "lucide-react";
import { useState } from "react";
import type { IProduct } from "~/interfaces/IProduct";
import { TablePagination } from "~/components/table-pagination";
import { Input } from "~/components/ui/input";
import {
  useDeleteProduct,
  useProducts,
} from "~/hooks/tanstack-hooks/use-product";
import { Authorize } from "~/guards/guards";
import { IUserRole } from "~/interfaces/IUserProfileDto";

export const Route = createFileRoute(
  "/_authenticated/_authenticated/products/"
)({
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: productsResponse, isLoading } = useProducts(
    currentPage,
    pageSize
  );
  const deleteProductMutation = useDeleteProduct();

  const products = productsResponse?.items || [];
  const pagination = productsResponse?.pagination;

  const filteredProducts = products.filter(
    (product: IProduct) =>
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteProductMutation.mutateAsync(id);
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "image",
      header: "Imagem",
      cell: ({ row }) => (
        <Avatar className="h-12 w-12">
          <AvatarImage src={row.original.image} alt={row.original.title} />
          <AvatarFallback>{row.original.title.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{row.original.title}</div>
          <div className="text-sm text-muted-foreground truncate">
            {row.original.title}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Categoria",
      cell: ({ row }) => {
        return <Badge variant="outline">{row.original.category}</Badge>;
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Preço
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = Number.parseFloat(row.original.price);
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div>{date.toLocaleDateString("pt-BR")}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  to={"/products/edit/$productId"}
                  params={{ productId: row.original.id }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(product.id)}
                className="text-red-600"
                disabled={deleteProductMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie seu catálogo de produtos
          </p>
        </div>
        <Button asChild>
          <Link to={"/products/new"}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <DataTable columns={columns} data={filteredProducts} />

        {pagination && (
          <TablePagination
            currentPage={pagination.currentPage}
            totalPages={Math.ceil(pagination.totalCount / pagination.pageSize)}
            totalCount={pagination.totalCount}
            pageSize={pagination.pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize);
              setCurrentPage(1);
            }}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
