import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { SaleTableRow } from "./-components/sales-table-row";
import {
  Search,
  TrendingUp,
  ShoppingCart,
  Clock,
  DollarSign,
  Loader2,
} from "lucide-react";
import { useSales } from "~/hooks/tanstack-hooks/use-sales";
import { ISaleStatus, Sale } from "~/interfaces/ISale";
import { TablePagination } from "~/components/table-pagination";
import { Authorize } from "~/guards/guards";
import { IUserRole } from "~/interfaces/IUserProfileDto";

export const Route = createFileRoute("/_authenticated/_authenticated/sales/")({
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: result, isError, isFetching } = useSales(currentPage, pageSize);

  const sales = result?.items || [];
  const pagination = result?.pagination;

  const filteredSales = sales.filter(
    (sale: Sale) =>
      sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSales = Array.isArray(filteredSales) ? filteredSales.length : 0;

  const completedSales = Array.isArray(filteredSales)
    ? filteredSales.filter(
        (sale: Sale) => sale.status === ISaleStatus.Completed
      ).length
    : 0;

  const pendingSales = filteredSales.filter(
    (sale: Sale) => sale.status === ISaleStatus.Pending
  ).length;

  const totalValue = Array.isArray(filteredSales)
    ? filteredSales
        .filter((sale: Sale) => sale.status === ISaleStatus.Completed)
        .reduce(
          (sum: number, sale: Sale) =>
            sum + Number.parseFloat(sale.totalAmount),
          0
        )
    : 0;

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  function handlePageSizeChange(newPageSize: number) {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }

  const totalPages = pagination
    ? Math.ceil(pagination.totalCount / pagination.pageSize)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as vendas do sistema
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vendas
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pagination?.totalCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">vendas registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas Concluídas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedSales}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalSales > 0
                ? ((completedSales / totalSales) * 100).toFixed(1)
                : 0}
              % da página atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingSales}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalSales > 0
                ? ((pendingSales / totalSales) * 100).toFixed(1)
                : 0}
              % da página atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R${" "}
              {totalValue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">página atual</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendas</CardTitle>
          <CardDescription>
            {pagination ? (
              <>
                Mostrando {Math.min(pagination.pageSize, filteredSales.length)}{" "}
                de {pagination.totalCount} vendas
                {searchTerm && ` (filtradas por "${searchTerm}")`}
              </>
            ) : (
              "Carregando vendas..."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 pb-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número da venda ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {isFetching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando vendas...</span>
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm
                  ? "Nenhuma venda encontrada"
                  : "Nenhuma venda cadastrada"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando sua primeira venda"}
              </p>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-600">
                  Erro ao carregar vendas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tente novamente mais tarde
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border-x border-t mx-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="w-[180px]">Data</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[200px]">Itens</TableHead>
                      <TableHead className="text-right w-[120px]">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale) => (
                      <SaleTableRow key={sale.id} sale={sale} />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {pagination && (
                <TablePagination
                  currentPage={pagination.currentPage}
                  totalPages={totalPages}
                  totalCount={pagination.totalCount}
                  pageSize={pagination.pageSize}
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
