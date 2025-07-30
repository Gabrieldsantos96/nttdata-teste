import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { useCarts } from "~/hooks/tanstack-hooks/use-carts";
import { Cart, CartItem } from "~/interfaces/ICart";
import { Routes } from "~/constants/consts";
import httpClient from "~/lib/http-client";
import { MutationResult } from "~/interfaces/IMutationResult";
import { showToast } from "~/utils/trigger-toast";
import { MessageType } from "~/services/toast-service";
import { handleError } from "~/utils/handle-error";

type AuthState = {
  isLoading: boolean;
  isError: boolean;
  hasCart: boolean;
  isUpdating: boolean;
  cart: Cart | null;
  addCartItem?: (cartItem: CartItem) => Promise<void>;
  refetchCarts?: () => unknown;
};

export const AuthContext = createContext<AuthState>({
  isLoading: false,
  isError: false,
  hasCart: false,
  cart: null,
  isUpdating: false,
});

export function CartsProvider({ children }: PropsWithChildren) {
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    data: result,
    isFetching: isLoading,
    isError,
    refetch: refetchCarts,
  } = useCarts();

  const cart =
    Array.isArray(result?.data) && result.data.length > 0
      ? result.data[0]
      : null;

  const hasCart = !!cart;

  async function addCartItem(cartItem: CartItem) {
    setIsUpdating(true);

    try {
      if (!cart) {
        if (cartItem.quantity === 0) {
          setIsUpdating(false);
          return;
        }

        const form = {
          items: [
            {
              productId: cartItem.productId,
              quantity: cartItem.quantity,
            },
          ],
        };
        await httpClient.post(Routes.Carts.CreateCart, form);
      } else {
        const existingItem = cart.products.find(
          (item) => item.productId === cartItem.productId
        );

        if (cartItem.quantity === 0) {
          const data = {
            ...cart,
            items: cart.products.filter(
              (item) => item.productId !== cartItem.productId
            ),
          };
          await httpClient.put<MutationResult<Cart>>(
            Routes.Carts.UpdateCart.replace("{id}", cart.id),
            data
          );
        } else if (existingItem) {
          const data = {
            ...cart,
            items: cart.products.map((item) =>
              item.productId === cartItem.productId
                ? { ...item, quantity: cartItem.quantity }
                : item
            ),
          };
          await httpClient.put<MutationResult<Cart>>(
            Routes.Carts.UpdateCart.replace("{id}", cart.id),
            data
          );
        } else {
          const data = {
            ...cart,
            items: [
              ...cart.products,
              {
                productId: cartItem.productId,
                quantity: cartItem.quantity,
              },
            ],
          };
          await httpClient.put<MutationResult<Cart>>(
            Routes.Carts.UpdateCart.replace("{id}", cart.id),
            data
          );
        }
      }

      await refetchCarts();
      setIsUpdating(false);
      showToast({
        type: MessageType.Success,
        text: "Carrinho salvo com sucesso",
      });
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        refetchCarts,
        isLoading,
        isError,
        hasCart,
        isUpdating,
        cart,
        addCartItem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useCartsContext() {
  return useContext(AuthContext);
}
