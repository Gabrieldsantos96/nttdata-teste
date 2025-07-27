import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import {
  type SignInFormData,
  signinSchema,
} from "~/validations/sign-in-schema";
import { showToast } from "~/utils/trigger-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Mail, LockIcon, Loader2Icon } from "lucide-react";
import TextInput from "~/components/text-input";
import Logo from "~/assets/react.svg?react";
import { useSession } from "~/contexts/session-provider";

type SignInFormProps = {
  logo?: boolean;
};

export function SignInForm({ logo = true }: SignInFormProps) {
  const { signIn, isFetchingSignin } = useSession();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signinSchema),
  });

  async function onSubmit(data: SignInFormData) {
    try {
      signIn(data.email, data.password);
    } catch (error) {
      console.log(error);
      showToast(error?.message);
    }
  }

  return (
    <Card className="shadow-xl space-y-4 border-0 bg-card backdrop-blur-sm w-full max-w-[30rem]">
      <CardHeader>
        <div className="text-center">
          <Link to="/" className="inline-block">
            {logo ? (
              <div className="flex items-center justify-center gap-3 mb-4">
                <Logo
                  width={100}
                  height={100}
                  className="animate-[spin_4s_linear_infinite]"
                />
              </div>
            ) : null}
          </Link>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Entre na sua conta
          </h3>
          <p className="text-gray-500">
            Bem-vindo de volta! Faça login para continuar.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <TextInput
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="E-mail"
                      startIcon={
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      }
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <TextInput
                      placeholder="Senha"
                      id="password"
                      name="password"
                      type="password"
                      required
                      startIcon={
                        <LockIcon className="h-4 w-4 cursor-pointer" />
                      }
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end text-sm pb-4">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isFetchingSignin}
                className="w-full mx-auto px-8 bg-primary hover:bg-primary active:bg-primary focus:ring-primary focus:ring-offset-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-md hover:shadow-lg active:shadow-sm transition-all duration-150"
              >
                {isFetchingSignin && <Loader2Icon className="animate-spin" />}
                Entrar
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{" "}
            <Link
              to="/sign-up"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
