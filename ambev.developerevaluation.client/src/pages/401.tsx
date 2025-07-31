import { createFileRoute } from "@tanstack/react-router";
import { UnauthorizedComponent } from "~/guards/unauthorized-access";

export const Route = createFileRoute("/401")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UnauthorizedComponent />;
}
