import { Authorize } from "@/guards/guards";
import { IUserRole } from "@/interfaces/IUserProfileDto";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/products/")({
  component: () =>
    Authorize(RouteComponent, [
      IUserRole.ADMIN,
      IUserRole.MANAGER,
      IUserRole.CLIENT,
    ]),
});

function RouteComponent() {
  return <div>Hello "/_authenticated/products/"!</div>;
}
