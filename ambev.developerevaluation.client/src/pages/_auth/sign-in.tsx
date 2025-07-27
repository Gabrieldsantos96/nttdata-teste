import { useSession } from "~/contexts/session-provider";
import { SignInForm } from "~/pages/_auth/-components/sign-in-form";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_auth/sign-in")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Entrar" }],
  }),
});

function RouteComponent() {
  const router = useRouter();
  const { applicationUser } = useSession();

  useEffect(() => {
    console.log(applicationUser);
    if (applicationUser) {
      router.navigate({ to: "/" });
    }
  }, [applicationUser]);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SignInForm />
    </div>
  );
}
