"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { TableCell, TableRow } from "~/components/ui/table";

import { ChevronRight, Package, X, Loader2 } from "lucide-react";
import {
  type Sale,
  type SaleItem,
  ISaleStatus,
  ISaleItemStatus,
  SALE_ITEM_STATUS,
} from "~/interfaces/ISale";
import { cn } from "~/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { formatDateToShort, formatDateToTime } from "~/utils/date";
import { useCancelSaleItem } from "~/hooks/tanstack-hooks/use-sales";

interface SaleTableRowProps {
  sale: Sale;
}

const statusColors = {
  [ISaleStatus.Pending]: "bg-yellow-100 text-yellow-800 border-yellow-200",
  [ISaleStatus.Completed]: "bg-green-100 text-green-800 border-green-200",
  [ISaleStatus.Cancelled]: "bg-red-100 text-red-800 border-red-200",
};

const itemStatusColors = {
  [ISaleItemStatus.Active]: "bg-green-100 text-green-800 border-green-200",
  [ISaleItemStatus.Cancelled]: "bg-red-100 text-red-800 border-red-200",
};

export function SaleTableRow({ sale }: SaleTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutateAsync } = useCancelSaleItem();

  const activeItems = sale.items.filter(
    (item) => item.status === ISaleItemStatus.Active
  );
  const cancelledItems = sale.items.filter(
    (item) => item.status === ISaleItemStatus.Cancelled
  );

  async function handleCancelItem(itemId: string) {
    await mutateAsync({ saleId: sale.id, itemId: itemId });
  }

  return (
    <>
      <TableRow className="group">
        <TableCell className="font-medium">{sale.saleNumber}</TableCell>
        <TableCell>{sale.customerName}</TableCell>
        <TableCell>
          {formatDateToShort(sale.saleDate)} - {formatDateToTime(sale.saleDate)}
        </TableCell>
        <TableCell>
          <Badge className={statusColors[sale.status]}>
            {SALE_ITEM_STATUS[sale.status]}
          </Badge>
        </TableCell>
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 p-2 h-auto font-normal hover:bg-muted/50 transition-all duration-200"
          >
            <div
              className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : "rotate-0"}`}
            >
              <ChevronRight className="h-4 w-4" />
            </div>
            <span className="text-sm">
              {sale.items.length} {sale.items.length > 1 ? "itens" : "item"}
            </span>
            {cancelledItems.length > 0 && (
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {cancelledItems.length} cancelado
                {cancelledItems.length !== 1 ? "s" : ""}
              </span>
            )}
          </Button>
        </TableCell>
        <TableCell className="text-right font-medium">
          R${" "}
          {Number.parseFloat(sale.totalAmount).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow>
          <TableCell colSpan={7} className="p-0">
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                animation: isExpanded
                  ? "slideDown 0.3s ease-out"
                  : "slideUp 0.3s ease-out",
              }}
            >
              <div className="p-6 bg-muted/30 border-t">
                <div className="space-y-4">
                  {activeItems.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-green-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Itens Ativos ({activeItems.length})
                      </h5>
                      <div className="space-y-2">
                        {activeItems.map((s) => (
                          <RenderItem {...s} onCancelItem={handleCancelItem} />
                        ))}
                      </div>
                    </div>
                  )}

                  {cancelledItems.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-red-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Itens Cancelados ({cancelledItems.length})
                      </h5>
                      <div className="space-y-2">
                        {cancelledItems.map((s) => (
                          <RenderItem {...s} onCancelItem={handleCancelItem} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

type RenderItemProps = {
  isPending?: boolean;
  onCancelItem: (itemId: string) => Promise<void>;
} & SaleItem;

const RenderItem = (props: RenderItemProps) => {
  const { isPending, onCancelItem, ...item } = props;
  return (
    <div
      key={item.id}
      className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <Package className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h4
            className={cn(
              "font-medium transition-all duration-200",
              item.status === ISaleItemStatus.Cancelled
                ? "line-through text-muted-foreground"
                : ""
            )}
          >
            {item.productName}
          </h4>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span>Qtd: {item.quantity}</span>
            <span>
              Preço: R${" "}
              {Number.parseFloat(item.unitPrice).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
            {Number.parseFloat(item.discountPercentage) > 0 && (
              <span className="text-orange-600">
                Desc: {Number.parseFloat(item.discountPercentage).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p
            className={`font-semibold transition-all duration-200 ${
              item.status === ISaleItemStatus.Cancelled
                ? "line-through text-muted-foreground"
                : ""
            }`}
          >
            R${" "}
            {Number.parseFloat(item.totalPriceWithDiscount).toLocaleString(
              "pt-BR",
              { minimumFractionDigits: 2 }
            )}
          </p>
          <Badge
            className={`${itemStatusColors[item.status]} transition-all duration-200`}
          >
            {SALE_ITEM_STATUS[item.status]}
          </Badge>
        </div>

        {item.status === ISaleItemStatus.Active ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent transition-all duration-200 hover:scale-105"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancelar Item</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja cancelar o item "{item.productName}"?
                  Esta ação irá remover o valor do item do total da venda.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onCancelItem(item.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirmar Cancelamento
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
    </div>
  );
};
