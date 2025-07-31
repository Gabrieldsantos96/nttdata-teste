import { cn } from "~/lib/utils";
import {
  createFileRoute,
  Link,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { BarChart3, Package, TrendingUp, Users } from "lucide-react";
import { Header } from "~/components/header";
import { Authorize } from "~/guards/guards";
import { IUserRole } from "~/interfaces/IUserProfileDto";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { useSession } from "~/contexts/session-provider";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/_authenticated/_authenticated")({
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

function AppSidebar() {
  const firstRender = useRef(true);
  const { applicationUser } = useSession();
  useEffect(() => {
    if (applicationUser) {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      window.location.reload();
    }
  }, [applicationUser]);
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Sistema de Gestão</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <BarChart3 className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton asChild>
                  <Link
                    to="/products"
                    search={{ pageSize: 10, searchTerm: "", skip: 0 }}
                  >
                    <Package className="size-4" />
                    <span>Produtos</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton asChild>
                  <Link
                    to="/sales"
                    search={{ pageSize: 10, searchTerm: "", skip: 0 }}
                  >
                    <TrendingUp className="size-4" />
                    <span>Vendas</span>
                  </Link>
                </SidebarMenuButton>

                <SidebarMenuButton asChild>
                  <Link
                    to="/users"
                    search={{ pageSize: 10, searchTerm: "", skip: 0 }}
                  >
                    <Users className="size-4" />
                    <span>Usuários</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <section className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Header />
        </section>
        <main className="p-6 bg-muted/50 min-h-screen">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
