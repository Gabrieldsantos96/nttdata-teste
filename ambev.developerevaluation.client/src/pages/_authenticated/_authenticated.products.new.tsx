import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "./-components/product-form";
import { useCreateProduct } from "~/hooks/tanstack-hooks/use-product";
import { Authorize } from "~/guards/guards";
import { IUserRole } from "~/interfaces/IUserProfileDto";

export const Route = createFileRoute(
  "/_authenticated/_authenticated/products/new"
)({
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

function RouteComponent() {
  const { mutateAsync, isPending } = useCreateProduct();
  return <ProductForm onSubmitFn={mutateAsync} isPending={isPending} />;
}
