import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IUserProfileDto,
  IUserRole,
  IUserStatus,
  USER_ROLE,
  USER_STATUS,
} from "~/interfaces/IUserProfileDto";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import {
  ArrowUpDown,
  Badge,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { DataTable } from "~/components/data-table";
import { cn } from "~/lib/utils";
import { TablePagination } from "~/components/table-pagination";
import { useDeleteUser, useUsers } from "~/hooks/tanstack-hooks/use-user";
import { Input } from "~/components/ui/input";
import { Authorize } from "~/guards/guards";

export const Route = createFileRoute("/_authenticated/_authenticated/users/")({
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

const users: IUserProfileDto[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "joao.silva@email.com",
    userName: "joao.silva",
    name: { firstName: "João", lastName: "Silva Santos" },
    address: {
      street: "Rua das Flores, 123",
      zipcode: "01234-567",
      city: "São Paulo",
      geo: "-23.5505,-46.6333",
      number: "123",
    },
    phone: "11999999999",
    status: IUserStatus.ACTIVE,
    role: IUserRole.CLIENT,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "maria.santos@email.com",
    userName: "maria.santos",
    name: { firstName: "Maria", lastName: "Santos Costa" },
    address: {
      street: "Av. Paulista, 456",
      zipcode: "01310-100",
      city: "São Paulo",
      geo: "-23.5618,-46.6565",
      number: "456",
    },
    phone: "11999999999",
    status: IUserStatus.ACTIVE,
    role: IUserRole.MANAGER,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    email: "pedro.costa@email.com",
    userName: "pedro.costa",
    name: { firstName: "Pedro", lastName: "Costa Lima" },
    address: {
      street: "Rua Augusta, 789",
      zipcode: "01305-000",
      city: "São Paulo",
      geo: "-23.5489,-46.6388",
      number: "789",
    },
    phone: "11999999999",
    status: IUserStatus.INACTIVE,
    role: IUserRole.ADMIN,
    createdAt: "2024-01-05T14:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
];

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: usersResponse, isLoading } = useUsers(currentPage, pageSize);

  const { mutateAsync } = useDeleteUser();

  const users = usersResponse?.data || [];

  const filteredUsers = users.filter(
    (user: IUserProfileDto) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await mutateAsync(id);
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

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
        const maps = {
          [IUserRole.ADMIN]: "bg-destructive-500 text-white",
          [IUserRole.CLIENT]: "bg-yellow-500 text-white",
          [IUserRole.MANAGER]: "bg-blue-500 text-white",
        };

        return (
          <Badge className={cn(maps[row.original.role])}>
            {USER_ROLE[row.original.role]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const maps = {
          [IUserStatus.ACTIVE]: "bg-green-500 text-white",
          [IUserStatus.INACTIVE]: "bg-muted-500 text-white",
          [IUserStatus.SUSPENDED]: "bg-destructive-500 text-white",
        };
        return (
          <Badge className={cn(maps[row.original.status])}>
            {USER_STATUS[row.original.status]}
          </Badge>
        );
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
                onClick={() => handleDelete(row.original.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={"/users/edit/$userId"}
                  params={{ userId: row.original.id }}
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema
          </p>
        </div>
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
        <DataTable columns={columns} data={filteredUsers} />

        {usersResponse && (
          <TablePagination
            currentPage={currentPage}
            totalPages={Math.ceil(usersResponse.totalCount / pageSize)}
            totalCount={usersResponse.totalCount}
            pageSize={pageSize}
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
