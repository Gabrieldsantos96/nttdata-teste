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
  const data = import.meta.env.VITE_BACKEND_URL;
  console.log(data);
  return <div>Hello "/_authenticated/"!111</div>;
}
