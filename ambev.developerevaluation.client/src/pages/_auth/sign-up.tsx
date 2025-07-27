import { SignUpFormSteps } from "~/pages/_auth/-components/sign-up-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-up")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Cadastrar" }],
  }),
});

function RouteComponent() {
  return <SignUpFormSteps />;
}
