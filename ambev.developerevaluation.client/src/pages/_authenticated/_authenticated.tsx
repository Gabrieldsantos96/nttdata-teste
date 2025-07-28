import { cn } from "~/lib/utils";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { BarChart3, Menu, Package, TrendingUp, Users, X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Header } from "~/components/header";
import { Authorize } from "~/guards/guards";
import { IUserRole } from "~/interfaces/IUserProfileDto";

export const Route = createFileRoute("/_authenticated/_authenticated")({
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

const navigationItems = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Produtos", href: "/products", icon: Package },
  { name: "Vendas", href: "/sales", icon: TrendingUp },
  { name: "Usuários", href: "/users", icon: Users },
];

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        <nav
          className={cn(
            "fixed left-0 top-0 z-40 h-full w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="flex items-center gap-2 p-6 border-b">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Sistema de Gestão</span>
          </div>

          <div className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link to="/">
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </>
      <div className="md:ml-64">
        <Header />
        <main className="p-6 bg-muted/50 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
