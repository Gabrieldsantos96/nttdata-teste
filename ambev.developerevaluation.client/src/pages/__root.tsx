import { Providers } from "~/providers";
import { HeadContent, Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Providers>
      <HeadContent />
      <Outlet />
    </Providers>
  );
}
