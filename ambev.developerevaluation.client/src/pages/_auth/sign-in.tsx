import { SignInForm } from "@/pages/_auth/-components/sign-in-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-in")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Entrar" }],
  }),
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SignInForm />
    </div>
  );
}
