import { createFileRoute } from "@tanstack/react-router";
import { Authorize } from "@/guards/guards";
import { IUserRole } from "@/interfaces/IUserProfileDto";

export const Route = createFileRoute("/")({
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.COSTUMER,
    IUserRole.MANAGER,
  ]),
});

function RouteComponent() {
  return <div>Hello "/_authenticated/"!</div>;
}
