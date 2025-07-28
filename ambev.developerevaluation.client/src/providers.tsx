import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { queryClient } from "./lib/tanstack-query";
import { DialogService } from "./services/dialog-service";
import { ToastService } from "./services/toast-service";
import { SessionProvider } from "./contexts/session-provider";
import { ThemeProvider } from "./contexts/theme-provider";

export function Providers(props: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider>
          {props.children}
          <DialogService />
          <ToastService />
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
