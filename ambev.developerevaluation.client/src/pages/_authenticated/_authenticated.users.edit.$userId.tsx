import { createFileRoute } from "@tanstack/react-router";
import { Authorize } from "~/guards/guards";
import { IUserRole } from "~/interfaces/IUserProfileDto";
import { UserForm } from "./-components/user-form";
import { useUpdateUser, useUser } from "~/hooks/tanstack-hooks/use-user";
import httpClient from "~/lib/http-client";
import { Routes } from "~/constants/consts";
import { useProduct } from "~/hooks/tanstack-hooks/use-product";

export const Route = createFileRoute(
  "/_authenticated/_authenticated/users/edit/$userId"
)({
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

function RouteComponent() {
  const { userId } = Route.useParams();

  const { data } = useUser(userId);
  const { mutateAsync, isPending } = useUpdateUser();
  return (
    <UserForm
      initialData={data}
      isPending={isPending}
      onSubmitFn={mutateAsync}
      userId={data?.refId}
    />
  );
}
