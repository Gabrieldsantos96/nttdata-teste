import { createFileRoute } from "@tanstack/react-router";
import { Authorize } from "~/guards/guards";
import { IUserRole } from "~/interfaces/IUserProfileDto";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/_authenticated/")({
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

function RouteComponent() {
  return (
    <>
      <Button>jskasopdkoasjdaiojdoa</Button>
    </>
  );
}
