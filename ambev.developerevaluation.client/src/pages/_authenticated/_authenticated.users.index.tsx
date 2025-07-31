import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  IUserProfileDto,
  IUserRole,
  IUserStatus,
  USER_ROLE,
  USER_STATUS,
} from "~/interfaces/IUserProfileDto";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import {
  ArrowUpDown,
  Badge,
  Edit,
  Loader2,
  MapPin,
  MoreHorizontal,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { DataTable } from "~/components/data-table";
import { cn } from "~/lib/utils";
import { TablePagination } from "~/components/table-pagination";
import { useDeleteUser, useUsers } from "~/hooks/tanstack-hooks/use-user";
import { Input } from "~/components/ui/input";
import { Authorize } from "~/guards/guards";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DestructiveDialog } from "~/components/destructive-dialog";
import { openDialog } from "~/utils/trigger-dialog";
import { MessageType } from "~/services/toast-service";
import { showToast } from "~/utils/trigger-toast";
import { handleError } from "~/utils/handle-error";

const userSearchSchema = z.object({
  searchTerm: z.string().catch(""),
  skip: z.number().catch(0),
  pageSize: z.number().catch(10),
});

export const Route = createFileRoute("/_authenticated/_authenticated/users/")({
  validateSearch: userSearchSchema,
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

function RouteComponent() {
  const { searchTerm, skip, pageSize } = Route.useSearch();

  const navigate = useNavigate();

  const { data: result, isFetching, isError } = useUsers(skip, pageSize);

  const { mutateAsync } = useDeleteUser();

  const users = result?.data || [];

  const filteredUsers = users.filter(
    (user: IUserProfileDto) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const result = await openDialog(DestructiveDialog, {
        componentProps: {
          message: "Deseja confirmar do usuário?",
          variant: "destructive",
        },
      });

      if (result) {
        await mutateAsync(id);
        showToast({
          text: "Usuário excluído com sucesso",
          type: MessageType.Success,
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

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

  const columns: ColumnDef<IUserProfileDto>[] = [
    {
      accessorKey: "name",
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
      cell: ({ row }) => {
        const name = row.original.name;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`/placeholder.svg?height=40&width=40&text=${name.firstName.charAt(0)}`}
              />
              <AvatarFallback>
                {name.firstName.charAt(0)}
                {name.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{`${name.firstName} ${name.lastName}`}</div>
              <div className="text-sm text-muted-foreground">
                {row.original.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "userName",
      header: "Username",
      cell: ({ row }) => (
        <div className="font-mono">{row.getValue("userName")}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Telefone",
    },
    {
      accessorKey: "address",
      header: "Endereço",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{}</div>
              <div className="text-sm text-muted-foreground">
                {row.original.address.street},{row.original.address.number}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Função",
      cell: ({ row }) => {
        return <span>{USER_ROLE[row.original.role]}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <span>{USER_STATUS[row.original.status]}</span>;
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
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(row.original.refId!)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={"/users/edit/$userId"}
                  params={{ userId: row.original.refId! }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
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
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 pb-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => handleSearchTermChange(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {isFetching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando usuários...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm
                  ? "Nenhum usuário encontrado"
                  : "Nenhum usuário cadastrado"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando seu primeiro usuário"}
              </p>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-600">
                  Erro ao carregar usuários
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tente novamente mais tarde
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border mx-6 mb-4">
                <DataTable columns={columns} data={filteredUsers} />
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
        </CardContent>
      </Card>
    </div>
  );
}
