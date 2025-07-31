import { createFileRoute } from "@tanstack/react-router";
import { Authorize } from "~/guards/guards";
import { IUserRole } from "~/interfaces/IUserProfileDto";
import { UserForm } from "./-components/user-form";
import { useUpdateUser, useUser } from "~/hooks/tanstack-hooks/use-user";

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
