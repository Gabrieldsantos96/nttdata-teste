import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { ProductForm } from "./-components/product-form";
import { useUpdateProduct } from "~/hooks/tanstack-hooks/use-product";
import { IUserRole } from "~/interfaces/IUserProfileDto";
import { Authorize } from "~/guards/guards";

export const Route = createFileRoute(
  "/_authenticated/_authenticated/products/edit/$productId"
)({
  params: {
    parse: (params) => ({
      productId: z.string().nonempty().parse(params.productId),
    }),
    stringify: ({ productId }) => ({ productId: `${productId}` }),
  },
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

function RouteComponent() {
  const { productId } = Route.useParams();

  const { mutateAsync, isPending } = useUpdateProduct();

  return (
    <ProductForm
      onSubmitFn={mutateAsync}
      isPending={isPending}
      productId={productId}
    />
  );
}
