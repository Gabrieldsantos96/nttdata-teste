import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Authorize } from "~/guards/guards";
import { IUserRole } from "~/interfaces/IUserProfileDto";
import { Link, Package, TrendingUp, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useSession } from "~/contexts/session-provider";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/_authenticated/")({
  component: Authorize(RouteComponent, [
    IUserRole.ADMIN,
    IUserRole.CLIENT,
    IUserRole.MANAGER,
  ]),
});

const dashboardCards = [
  {
    title: "Usuários",
    description: "Gerenciar usuários do sistema",
    icon: Users,
    href: "/users",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Produtos",
    description: "Gerenciar catálogo de produtos",
    icon: Package,
    href: "/products",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Vendas",
    description: "Acompanhar vendas e relatórios",
    icon: TrendingUp,
    href: "/sales",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

function RouteComponent() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao sistema de gestão</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card) => (
          <Card
            className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
            onClick={() => router.navigate({ to: card.href })}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs text-muted-foreground">
                {card.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
