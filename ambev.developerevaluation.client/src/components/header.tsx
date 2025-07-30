"use client";

import { User } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { CartDrawer } from "./cart-drawer";
import { Navigation } from "./navigation";
import { useTheme } from "~/contexts/theme-provider";
import { useSession } from "~/contexts/session-provider";

export function Header() {
  const { toggleTheme, hexColors } = useTheme();
  const { signOut } = useSession();
  return (
    <main className="flex-1 flex items-center justify-start">
      <Navigation />
      <header className="flex h-16 items-center justify-end border-b bg-background px-6">
        <div className="flex items-center gap-4">
          <CartDrawer />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" color={hexColors.primary} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleTheme()}>
                Trocar tema
              </DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </main>
  );
}
