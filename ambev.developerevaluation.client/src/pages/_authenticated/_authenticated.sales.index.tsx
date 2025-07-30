import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import {
  ISaleItemStatus,
  ISaleStatus,
  Sale,
  SALE_STATUS,
} from "~/interfaces/ISale";
import { TablePagination } from "~/components/table-pagination";
import { Authorize } from "~/guards/guards";
import { IUserRole } from "~/interfaces/IUserProfileDto";
import { z } from "zod";
import { handleError } from "~/utils/handle-error";
import { showToast } from "~/utils/trigger-toast";
import { MessageType } from "~/services/toast-service";
import httpClient from "~/lib/http-client";
import { Routes } from "~/constants/consts";
import { IPaginationResponse } from "~/interfaces/IPagination";

const salesSearchSchema = z.object({
  searchTerm: z.string().catch(""),
  skip: z.number().catch(0),
  pageSize: z.number().catch(10),
});

export const Route = createFileRoute("/_authenticated/_authenticated/sales/")({
  validateSearch: salesSearchSchema,
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

function RouteComponent() {
  const { searchTerm, skip, pageSize } = Route.useSearch();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: result, isError, isFetching } = useSales(skip, pageSize);

  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const sales = Array.isArray(result?.data) ? result.data : [];

  const filteredSales = sales
    .filter((sale: Sale) => Array.isArray(sale.items))
    .filter((sale: Sale) => {
      const saleNumber = sale.saleNumber ?? "";
      const customerName = sale.customerName ?? "";
      return (
        saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

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

  function toggleRowExpansion(saleId: string) {
    setExpandedRows((prev) =>
      prev.includes(saleId)
        ? prev.filter((id) => id !== saleId)
        : [...prev, saleId]
    );
  }

  async function onCancelSale(saleId: string) {
    try {
      setIsUpdating(true);

      const sale = sales.find((s) => s.id === saleId);

      if (sale) {
        await httpClient.delete(
          Routes.Sales.DeleteSale.replace("{id}", saleId)
        );
      }

      queryClient.setQueryData(
        ["sales", skip, pageSize],
        (currentData: IPaginationResponse<Sale>) => {
          if (!currentData) {
            return currentData;
          }

          const nextData = {
            data: currentData.data.map((s) =>
              s.id === saleId
                ? {
                    ...s,
                    status: ISaleStatus.Cancelled,
                    items: s.items.map((s) => ({
                      ...s,
                      status: ISaleItemStatus.Cancelled,
                    })),
                  }
                : s
            ),
            currentPage: currentData.currentPage,
            totalItems: currentData.totalItems,
            totalPages: currentData.totalPages,
          } as IPaginationResponse<Sale>;

          return nextData;
        }
      );

      setIsUpdating(false);
    } catch (err) {
      setIsUpdating(false);
      handleError(err);
    }
  }

  async function onClickSaleItem(saleId: string, itemId: string) {
    try {
      setIsUpdating(true);

      const sale = sales.find((s) => s.id === saleId);

      if (sale) {
        const products = (Array.isArray(sale.items) ? sale.items : [])
          .filter((s) => s.productId !== itemId)
          .filter((s) => s.status === ISaleItemStatus.Active);

        const { data: updatedSale } = await httpClient.put(
          Routes.Sales.UpdateSale.replace("{id}", saleId),
          {
            saleId: saleId,
            items: products,
          }
        );

        queryClient.setQueryData(
          ["sales", skip, pageSize],
          (currentData: IPaginationResponse<Sale>) => {
            if (!currentData) {
              return currentData;
            }

            const nextData = {
              data: currentData.data.map((s) =>
                s.id === updatedSale?.data.id
                  ? { ...s, ...updatedSale?.data }
                  : s
              ),
              currentPage: currentData.currentPage,
              totalItems: currentData.totalItems,
              totalPages: currentData.totalPages,
            } as IPaginationResponse<Sale>;

            return nextData;
          }
        );

        showToast({ text: "Venda atualizada", type: MessageType.Success });
      } else {
        showToast({ text: "Venda não encontrada", type: MessageType.Warning });
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  }

  async function onUpdateQuantity(
    saleId: string,
    itemId: string,
    newQuantity: number
  ) {
    try {
      setIsUpdating(true);

      const sale = sales.find((s) => s.id === saleId);

      if (sale) {
        const updatedItems = (Array.isArray(sale.items) ? sale.items : [])
          .map((item) =>
            item.productId === itemId
              ? { ...item, quantity: newQuantity }
              : item
          )
          .filter((item) => item.status === ISaleItemStatus.Active);

        const { data: updatedSale } = await httpClient.put(
          Routes.Sales.UpdateSale.replace("{id}", saleId),
          {
            saleId: saleId,
            items: updatedItems,
          }
        );

        queryClient.setQueryData(
          ["sales", skip, pageSize],
          (currentData: IPaginationResponse<Sale>) => {
            if (!currentData) {
              return currentData;
            }

            const nextData = {
              data: currentData.data.map((s) =>
                s.id === updatedSale?.data.id
                  ? { ...s, ...updatedSale?.data }
                  : s
              ),
              currentPage: currentData.currentPage,
              totalItems: currentData.totalItems,
              totalPages: currentData.totalPages,
            } as IPaginationResponse<Sale>;

            return nextData;
          }
        );

        showToast({
          text: "Quantidade atualizada com sucesso",
          type: MessageType.Success,
        });
      } else {
        showToast({
          text: "Venda não encontrada",
          type: MessageType.Warning,
        });
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  }

  function handleSearchTermChange(newSearchTerm: string) {
    navigate({
      search: { searchTerm: newSearchTerm, skip: 0, pageSize },
    } as never);
  }

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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 pb-4">
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
              <div className="rounded-md border mx-6 mb-4">
                <Table className="mb-4">
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
                      <SaleTableRow
                        isUpdating={isUpdating}
                        key={sale.id}
                        sale={sale}
                        onCancelSale={onCancelSale}
                        onCancelItem={onClickSaleItem}
                        onUpdateQuantity={onUpdateQuantity}
                        isExpanded={expandedRows.includes(sale.id)}
                        toggleExpansion={() => toggleRowExpansion(sale.id)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {result && (
                <TablePagination
                  currentPage={result.currentPage}
                  totalPages={result.totalPages}
                  totalCount={result.totalItems}
                  pageSize={result.data?.length ?? 0}
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
