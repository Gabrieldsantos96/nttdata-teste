"use client";

import { useMemo, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  Package,
  CreditCard,
  Loader,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { useTheme } from "~/contexts/theme-provider";
import { useCartsContext } from "~/contexts/cart-provider";
import { openDialog } from "~/utils/trigger-dialog";
import { DestructiveDialog } from "./destructive-dialog";
import { showToast } from "~/utils/trigger-toast";
import { MessageType } from "~/services/toast-service";
import { handleError } from "~/utils/handle-error";
import httpClient from "~/lib/http-client";
import { Routes } from "~/constants/consts";

export function CartDrawer() {
  const { cart, addCartItem, refetchCarts, confirmSale } = useCartsContext();
  const confirmSaleFn = confirmSale!;
  const refetch = refetchCarts!;
  const { hexColors } = useTheme();
  const add = addCartItem!;
  const [isUpdating, setIsUpdating] = useState(false);

  const totalItems = useMemo(
    () =>
      cart
        ? cart.products.reduce((total, product) => total + product.quantity, 0)
        : 0,
    [cart]
  );

  async function deleteCart() {
    try {
      const result = await openDialog(DestructiveDialog, {
        componentProps: {
          message: "Deseja confirmar a exclusão do carrinho de compras?",
          variant: "destructive",
        },
      });

      if (result) {
        setIsUpdating(true);
        await httpClient.delete(
          Routes.Carts.DeleteCart.replace("{id}", cart!.id)
        );

        showToast({ text: "Excluído com sucesso", type: MessageType.Success });

        refetch();

        setIsUpdating(false);
      }
    } catch (err) {
      setIsUpdating(false);
      handleError(err);
    }
  }

  if (!cart) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative bg-transparent"
          >
            <ShoppingCart className="h-4 w-4" color={hexColors.primary} />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:w-[540px] sm:max-w-[540px] lg:w-[900px] lg:max-w-[900px]">
          <SheetHeader>
            <SheetTitle>Carrinho de Compras</SheetTitle>
            <SheetDescription>
              Gerencie seu carrinho de compras
            </SheetDescription>
          </SheetHeader>
          <div className="text-center py-8 sm:py-12 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Nenhum carrinho encontrado
            </h3>
            <p className="text-sm">Adicione produtos para começar</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-transparent"
        >
          <ShoppingCart className="h-4 w-4" color={hexColors.primary} />
          {totalItems > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[540px] sm:max-w-[540px] lg:w-[900px] lg:max-w-[900px]">
        <SheetHeader>
          <SheetTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mr-5">
            <span>Carrinho de Compras</span>
            <div className="text-sm font-normal text-muted-foreground">
              {totalItems} ite{totalItems !== 1 ? "ns" : "m"}
            </div>
          </SheetTitle>
          <SheetDescription>Gerencie seu carrinho de compras</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)] mt-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="m-2 border rounded-lg p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent h-10"
                    onClick={deleteCart}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="ml-2 sm:hidden">Limpar Carrinho</span>
                  </Button>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-lg sm:text-xl font-bold text-primary">
                    {totalItems} ite{totalItems !== 1 ? "ns" : "m"}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {cart.products.length} produto
                    {cart.products.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {cart.products.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {cart.products.map((product) => (
                    <div
                      key={product.productId}
                      className="border rounded-lg p-3 sm:p-4 space-y-3"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 sm:p-3 rounded-lg bg-muted">
                          <Avatar className="size-6">
                            <AvatarImage
                              src={product?.image}
                              alt={cart.userName}
                            />
                            <AvatarFallback>
                              <Package className="size-4" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-lg truncate">
                            {product.productName}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            ID: {product.productId}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent shrink-0"
                          onClick={() =>
                            add({
                              productId: product.productId,
                              quantity: 0,
                            })
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() =>
                              add({
                                productId: product.productId,
                                quantity: product.quantity - 1,
                              })
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={product.quantity}
                            className="w-16 text-center"
                            min="1"
                            max="20"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            disabled={product.quantity >= 20}
                            onClick={() =>
                              add({
                                productId: product.productId,
                                quantity: product.quantity + 1,
                              })
                            }
                          >
                            <Plus className="h-4 w-4" />
                            ss
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-base sm:text-lg text-primary">
                            {product.quantity}x
                          </p>
                          <p className="text-xs text-muted-foreground">Qtd</p>
                        </div>
                      </div>
                      {product.quantity >= 20 && (
                        <div className="text-xs text-yellow-600 font-medium mt-1">
                          Limite máximo: 20 unidades por produto
                        </div>
                      )}
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2 p-3 sm:p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Total de Produtos:</span>
                      <span>{cart.products.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total de Itens:</span>
                      <span>{totalItems}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-base sm:text-lg">
                      <span>Resumo:</span>
                      <span className="text-primary">
                        {cart.products.length} produto
                        {cart.products.length !== 1 ? "s" : ""} • {totalItems}{" "}
                        ite{totalItems !== 1 ? "ns" : "m"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2  items-end justify-end">
                    <Button
                      size="icon"
                      className="sm:w-auto w-full h-10 px-8"
                      onClick={confirmSaleFn}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader className="size-4 animate-spin" />
                      ) : (
                        <CreditCard className="size-4" />
                      )}

                      <span className="ml-2">Confirmar compra</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">Carrinho vazio</p>
                  <p className="text-xs sm:text-sm mt-2">
                    Adicione produtos para começar
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
