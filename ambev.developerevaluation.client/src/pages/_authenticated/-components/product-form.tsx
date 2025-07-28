"use client";

import type React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useProduct } from "~/hooks/tanstack-hooks/use-product";
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import {
  createProductSchema,
  type ProductFormData,
} from "~/validations/create-product-schema";
import { handleError } from "~/utils/handle-error";
import { Link } from "@tanstack/react-router";
import { IProduct } from "~/interfaces/IProduct";

interface ProductFormProps {
  productId?: string;
  onSubmitFn: (data: ProductFormData) => Promise<IProduct>;
  isPending?: boolean;
}

const categories = [
  "Eletrônicos",
  "Informática",
  "Casa e Jardim",
  "Moda",
  "Esportes",
  "Livros",
  "Beleza",
  "Automotivo",
];

export function ProductForm({
  productId,
  onSubmitFn,
  isPending,
}: ProductFormProps) {
  const isEditing = !!productId;
  const [imagePreview, setImagePreview] = useState<string>("");

  const { data: product, isLoading: isLoadingProduct } = useProduct(productId);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      image: "",
    },
  });

  useEffect(() => {
    if (!!product && isEditing) {
      form.reset({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
      });

      if (product.image) {
        setImagePreview(
          product.image.startsWith("data:")
            ? product.image
            : `data:image/jpeg;base64,${product.image}`
        );
      }
    }
  }, [product, isEditing, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const base64String = base64.split(",")[1];
        form.setValue("image", base64String);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setImagePreview("");
    form.setValue("image", "");
    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      await onSubmitFn(data);
    } catch (error) {
      handleError(error);
    }
  };

  if (isLoadingProduct && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/products">
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Link>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Editar Produto" : "Novo Produto"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input placeholder="Título do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço *</FormLabel>
                      <FormControl>
                        <Input placeholder="R$ 0,00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição detalhada do produto"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 space-y-4">
                  <FormLabel>Imagem do Produto</FormLabel>

                  {(imagePreview || form.watch("image")) && (
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                      <img
                        src={
                          imagePreview ||
                          (form.watch("image")
                            ? `data:image/jpeg;base64,${form.watch("image")}`
                            : "/placeholder.svg")
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Upload de Arquivo
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer text-sm"
                        >
                          <Upload className="h-4 w-4" />
                          Escolher arquivo
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Link to="/products">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {isEditing ? "Atualizar" : "Criar"} Produto
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
