import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import httpClient from "~/lib/http-client";
import { Routes } from "~/constants/consts";
import type { Cart } from "~/interfaces/ICart";
import { MutationResult } from "~/interfaces/IMutationResult";
import { CreateCartFormData } from "~/validations/create-cart-schema";
import { IPaginationResponse } from "~/interfaces/IPagination";

export function useCarts() {
  return useQuery({
    queryKey: ["carts"],
    queryFn: async () => {
      const { data } = await httpClient.get<IPaginationResponse<Cart>>(
        `${Routes.Carts.GetPaginatedCarts}`
      );
      return data;
    },
  });
}

export function useCreateCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCartFormData) => {
      const result = await httpClient.post<MutationResult<Cart>>(
        Routes.Carts.CreateCart,
        data
      );
      return result?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["carts"],
      });
    },
  });
}

export function useUpdateCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      cartId: string;
      itemId: string;
      quantity: number;
    }) => {
      const result = await httpClient.put<MutationResult<Cart>>(
        `${Routes.Carts.UpdateCart.replace("{cartId}", data.cartId).replace("{itemId}", data.itemId)}`,
        { quantity: data.quantity }
      );
      return result?.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["cart", response.data.id],
      });
    },
  });
}

export function useRemoveCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { cartId: string; itemId: string }) => {
      const result = await httpClient.delete<string>(
        `${Routes.Carts.UpdateCart.replace("{cartId}", data.cartId).replace("{itemId}", data.itemId)}`
      );
      return result?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cart", variables.cartId],
      });
    },
  });
}
