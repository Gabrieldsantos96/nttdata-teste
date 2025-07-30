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
import { Loader2, ArrowLeft, Upload, X } from "lucide-react";
import { IProduct } from "~/interfaces/IProduct";
import {
  createProductSchema,
  ProductFormData,
} from "~/validations/create-product-schema";
import { useProduct } from "~/hooks/tanstack-hooks/use-product";
import { handleError } from "~/utils/handle-error";
import { showToast } from "~/utils/trigger-toast";
import { MessageType } from "~/services/toast-service";
import { CurrencyInput } from "~/components/currency-input";
import { Link, useRouter } from "@tanstack/react-router";

interface ProductFormProps {
  productId?: string;
  onSubmitFn: (data: unknown) => Promise<IProduct>;
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
  const router = useRouter();
  const isEditing = !!productId;
  const { data: product, isFetching: isLoading } = useProduct(productId);
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      image: "",
    },
  });

  useEffect(() => {
    if (product && isEditing) {
      form.reset({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price.amount,
        category: product.category,
        image: product.image,
      });

      if (product.image) {
        setImagePreview(product.image);
      }
    }
  }, [product]);

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
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("price", data.price.toString());
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("image", data.image!);

      if (isEditing) {
        formData.append("id", data.id!);
      }

      await onSubmitFn(formData);

      showToast({
        text: "Produto salvo com sucesso",
        type: MessageType.Success,
      });

      setTimeout(() => {
        router.navigate({
          to: "/products",
          search: { pageSize: 10, searchTerm: "", skip: 0 },
        });
      }, 100);
    } catch (error) {
      handleError(error);
    }
  };

  if (isLoading && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link
            to={"/products"}
            search={{ pageSize: 10, searchTerm: "", skip: 0 }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
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
                        <CurrencyInput
                          value={field.value}
                          onChange={field.onChange}
                        />
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
                    <FormItem className="md:col-span-2">
                      <FormLabel>Categoria *</FormLabel>
                      <FormControl>
                        <FormControl>
                          <Input
                            placeholder="categoria do produto"
                            {...field}
                          />
                        </FormControl>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                      Imagem do Produto
                    </label>

                    {!!imagePreview && (
                      <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                        <img
                          src={
                            imagePreview ||
                            "/placeholder.svg?height=128&width=128"
                          }
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "/placeholder.svg?height=128&width=128&text=Erro+ao+carregar";
                          }}
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
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
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
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" asChild>
                  <Link
                    to={"/products"}
                    search={{ pageSize: 10, searchTerm: "", skip: 0 }}
                  >
                    Cancelar
                  </Link>
                </Button>
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
