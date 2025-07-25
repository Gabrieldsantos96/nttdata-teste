import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { queryClient } from "./lib/tanstack-query";
import { DialogService } from "./services/dialog-service";
import { ToastService } from "./services/toast-service";

export function Providers(props: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      <DialogService />
      <ToastService />
    </QueryClientProvider>
  );
}
