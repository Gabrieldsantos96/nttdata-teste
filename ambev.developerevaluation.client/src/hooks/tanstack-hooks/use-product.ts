"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Routes } from "~/constants/consts";
import { MutationResult } from "~/interfaces/IMutationResult";
import { IPaginationResponse } from "~/interfaces/IPagination";
import { IProduct } from "~/interfaces/IProduct";
import httpClient from "~/lib/http-client";
import { queryClient } from "~/lib/tanstack-query";
import { ProductFormData } from "~/validations/create-product-schema";

export function useProducts(skip: number = 0, pageSize: number = 10) {
  return useQuery({
    queryKey: ["products", skip, pageSize],
    queryFn: async () => {
      const { data } = await httpClient.get<IPaginationResponse<IProduct>>(
        `${Routes.Products.GetPaginatedProducts}?skip=${skip}&take=${pageSize}`
      );
      return data;
    },
  });
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await httpClient.get<IProduct>(
        `${Routes.Products.GetProductById.replace("{id}", id!)}`
      );
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      const result = await httpClient.post<IProduct>(
        Routes.Products.CreateProduct,
        data,
        {
          headers: {
            Accept: "multipart/form-data",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return result?.data;
    },
  });
}

export function useUpdateProductRating() {
  return useMutation({
    mutationFn: async (data: Record<string, unknown> & { id: string }) => {
      const result = await httpClient.put<IProduct>(
        `${Routes.Products.UpdateProduct.replace("{id}", data.id!)}`,
        data
      );
      return result?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.cancelQueries({ queryKey: ["product", variables.id] });
    },
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      const f = data as any;
      const result = await httpClient.put<MutationResult<IProduct>>(
        `${Routes.Products.UpdateProduct.replace("{id}", f.get("id"))}`,
        data,
        {
          headers: {
            Accept: "multipart/form-data",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return result?.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      queryClient.setQueryData<IProduct>(["product", response.data.id], () => {
        const data = response.data;
        return {
          ...data,
        } as IProduct;
      });
    },
  });
}
export function useDeleteProduct() {
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await httpClient.delete<string>(
        `${Routes.Products.DeleteProduct.replace("{id}", id)}`
      );
      return result?.data;
    },
  });
}
