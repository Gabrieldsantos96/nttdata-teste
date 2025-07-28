import { createFileRoute } from "@tanstack/react-router";
import { Authorize } from "~/guards/guards";
import { IUserRole } from "~/interfaces/IUserProfileDto";

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
  return <div>Hello "/_authenticated/_authenticated/users/edit/$userId"!</div>;
}
