import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./route-tree.gen";
import { Providers } from "./providers";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
