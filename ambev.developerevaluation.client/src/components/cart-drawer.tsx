"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, X, Package } from "lucide-react";
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

interface CartProduct {
  id: string;
  productName: string;
  quantity: number;
}

interface Cart {
  id: string;
  userId: string;
  userName: string;
  createdBy: string;
  updatedBy: string;
  products: CartProduct[];
}

const mockCarts: Cart[] = [
  {
    id: "cart-1",
    userId: "user-1",
    userName: "João Silva",
    createdBy: "system",
    updatedBy: "user-1",
    products: [
      {
        id: "item-1",
        productName: "iPhone 15 Pro",
        quantity: 1,
      },
      {
        id: "item-2",
        productName: "AirPods Pro",
        quantity: 2,
      },
      {
        id: "item-3",
        productName: "Capinha iPhone",
        quantity: 1,
      },
    ],
  },
  {
    id: "cart-2",
    userId: "user-2",
    userName: "Maria Santos",
    createdBy: "system",
    updatedBy: "user-2",
    products: [
      {
        id: "item-4",
        productName: "MacBook Air M3",
        quantity: 1,
      },
      {
        id: "item-5",
        productName: "Magic Mouse",
        quantity: 1,
      },
      {
        id: "item-6",
        productName: "Teclado Magic Keyboard",
        quantity: 1,
      },
      {
        id: "item-7",
        productName: "Monitor LG 27''",
        quantity: 2,
      },
    ],
  },
  {
    id: "cart-3",
    userId: "user-3",
    userName: "Pedro Costa",
    createdBy: "system",
    updatedBy: "user-3",
    products: [
      {
        id: "item-8",
        productName: "Samsung Galaxy S24",
        quantity: 1,
      },
      {
        id: "item-9",
        productName: "Carregador Wireless",
        quantity: 3,
      },
    ],
  },
];

export function CartDrawer() {
  const [carts, setCarts] = useState<Cart[]>(mockCarts);

  const updateItemQuantity = (
    cartId: string,
    itemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1 || newQuantity > 20) return;

    setCarts((prevCarts) =>
      prevCarts.map((cart) =>
        cart.id === cartId
          ? {
              ...cart,
              products: cart.products.map((product) =>
                product.id === itemId
                  ? { ...product, quantity: newQuantity }
                  : product
              ),
              updatedBy: cart.userId,
            }
          : cart
      )
    );
  };

  const removeItem = (cartId: string, itemId: string) => {
    setCarts((prevCarts) =>
      prevCarts.map((cart) =>
        cart.id === cartId
          ? {
              ...cart,
              products: cart.products.filter(
                (product) => product.id !== itemId
              ),
              updatedBy: cart.userId,
            }
          : cart
      )
    );
  };

  const clearCart = (cartId: string) => {
    setCarts((prevCarts) =>
      prevCarts.map((cart) =>
        cart.id === cartId
          ? {
              ...cart,
              products: [],
              updatedBy: cart.userId,
            }
          : cart
      )
    );
  };

  const getTotalItems = (cart: Cart) => {
    return cart.products.reduce(
      (total, product) => total + product.quantity,
      0
    );
  };

  const totalCarts = carts.length;
  const totalItemsAllCarts = carts.reduce(
    (total, cart) => total + getTotalItems(cart),
    0
  );
  const { hexColors } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-transparent"
        >
          <ShoppingCart className="h-4 w-4" color={hexColors.primary} />
          {totalItemsAllCarts > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">
              {totalItemsAllCarts}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[540px] sm:max-w-[540px] lg:w-[900px] lg:max-w-[900px]">
        <SheetHeader>
          <SheetTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mr-5">
            <span>Carrinhos de Compras</span>
            <div className="text-sm font-normal text-muted-foreground">
              {totalCarts} carrinho{totalCarts !== 1 ? "s" : ""} •{" "}
              {totalItemsAllCarts} ite
              {totalItemsAllCarts !== 1 ? "ns" : "m"}
            </div>
          </SheetTitle>
          <SheetDescription>
            Gerencie os carrinhos de compras dos clientes
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)] mt-6">
          <div className="space-y-4 sm:space-y-6">
            {carts.map((cart) => {
              const totalItems = getTotalItems(cart);
              return (
                <div
                  key={cart.id}
                  className="border rounded-lg p-4 sm:p-6 space-y-4"
                >
                  {/* Header do carrinho */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt={cart.userName}
                        />
                        <AvatarFallback>
                          {cart.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">
                          {cart.userName}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          ID: {cart.userId}
                        </p>
                        {cart.createdBy && (
                          <p className="text-xs text-muted-foreground">
                            Criado por: {cart.createdBy}
                          </p>
                        )}
                      </div>
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
                          key={product.id}
                          className="border rounded-lg p-3 sm:p-4 space-y-3"
                        >
                          {/* Produto info */}
                          <div className="flex items-start space-x-3">
                            <div className="p-2 sm:p-3 rounded-lg bg-muted">
                              <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm sm:text-lg truncate">
                                {product.productName}
                              </h4>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                ID: {product.id}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent shrink-0"
                              onClick={() => removeItem(cart.id, product.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Controles de quantidade */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() =>
                                  updateItemQuantity(
                                    cart.id,
                                    product.id,
                                    product.quantity - 1
                                  )
                                }
                                disabled={product.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => {
                                  const newQuantity =
                                    Number.parseInt(e.target.value) || 1;
                                  updateItemQuantity(
                                    cart.id,
                                    product.id,
                                    newQuantity
                                  );
                                }}
                                className="w-16 text-center"
                                min="1"
                                max="20"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() =>
                                  updateItemQuantity(
                                    cart.id,
                                    product.id,
                                    product.quantity + 1
                                  )
                                }
                                disabled={product.quantity >= 20}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-base sm:text-lg text-primary">
                                {product.quantity}x
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Qtd
                              </p>
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

                      {/* Resumo */}
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
                            {cart.products.length !== 1 ? "s" : ""} •{" "}
                            {totalItems} ite
                            {totalItems !== 1 ? "ns" : "m"}
                          </span>
                        </div>
                      </div>

                      {/* Botões de ação */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button className="flex-1 text-sm">
                          Converter em Venda
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-transparent text-sm"
                        >
                          Salvar Carrinho
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent sm:w-auto w-full h-10"
                          onClick={() => clearCart(cart.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-2 sm:hidden">
                            Limpar Carrinho
                          </span>
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
              );
            })}

            {carts.length === 0 && (
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Nenhum carrinho encontrado
                </h3>
                <p className="text-sm">
                  Os carrinhos dos clientes aparecerão aqui
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
