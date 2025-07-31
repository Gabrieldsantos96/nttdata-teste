import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Shield, LogIn, Building2, Users, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { SignInForm } from "~/pages/_auth/-components/sign-in-form";
import { useSession } from "~/contexts/session-provider";
import { useRouter } from "@tanstack/react-router";

interface UnauthorizedComponentProps {
  title?: string;
  message?: string;
}

export function UnauthorizedComponent({
  title = "Acesso Restrito",
  message = "Esta funcionalidade requer permissões específicas. Faça login com uma conta autorizada ou contate o administrador do sistema.",
}: UnauthorizedComponentProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { applicationUser } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (applicationUser) {
      router.navigate({ to: "/" });
    }
  }, [applicationUser]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <Card className="shadow-lg border border-slate-200 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mb-6"
              >
                <div className="relative inline-block">
                  <motion.div
                    animate={{ rotate: [0, 1, -1, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg"
                  >
                    <Shield className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 1,
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <Lock className="w-2.5 h-2.5 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mb-4"
              >
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-2">
                  <Building2 className="w-4 h-4" />
                  <span>Sistema de Gestão</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-2xl font-semibold text-slate-900 mb-3"
              >
                {title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-slate-600 mb-8 leading-relaxed text-sm"
              >
                {message}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-6 p-3 bg-slate-50 rounded-lg border"
              >
                <Users className="w-4 h-4" />
                <span>Nível de acesso insuficiente</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="space-y-3"
              >
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  size="lg"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Fazer Login
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="mt-6 pt-4 border-t border-slate-200"
              >
                <p className="text-xs text-slate-500">
                  Precisa de ajuda? Entre em contato com o{" "}
                  <a
                    href="mailto:suporte@empresa.com"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    suporte técnico
                  </a>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <SignInForm />
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
