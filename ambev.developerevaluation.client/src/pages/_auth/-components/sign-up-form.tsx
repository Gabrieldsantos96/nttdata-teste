"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import type React from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Settings,
  Mail,
  LockIcon,
  Navigation,
  Loader,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "~/components/text-input";
import LocationPicker from "~/components/location-picker";
import type { LocationData } from "~/components/location-picker";
import {
  IUserStatus,
  USER_ROLE,
  USER_STATUS,
} from "~/interfaces/IUserProfileDto";
import { SignupFormData, signupSchema } from "~/validations/sign-up-schema";
import { useMutation } from "@tanstack/react-query";
import httpClient from "~/lib/http-client";
import { Routes } from "~/constants/consts";
import { showToast } from "~/utils/trigger-toast";
import { MessageType } from "~/services/toast-service";
import { handleError } from "~/utils/handle-error";
import { MaskedInput } from "~/components/masked-input";

const rolesOptions = Object.entries(USER_ROLE).map(([key, value]) => ({
  value: key,
  label: value,
}));

const statusOptions = Object.entries(USER_STATUS).map(([key, value]) => ({
  value: key,
  label: value,
}));

console.log(statusOptions, rolesOptions);

const steps = [
  {
    id: 1,
    title: "Dados Pessoais",
    icon: User,
    fields: [
      "email",
      "userName",
      "name.firstName",
      "name.lastName",
      "password",
      "confirmPassword",
    ],
  },
  {
    id: 2,
    title: "Endereço & Localização",
    icon: MapPin,
    fields: [
      "address.street",
      "address.city",
      "address.zipCode",
      "address.country",
      "address.latitude",
      "address.longitude",
    ],
  },
  {
    id: 3,
    title: "Contato & Configurações",
    icon: Settings,
    fields: ["phone", "role", "status"],
  },
];

async function signUpRequest(data: unknown) {
  return httpClient.post(Routes.Authentication.Register, data);
}

export function SignUpFormSteps() {
  const { isPending, mutateAsync } = useMutation({ mutationFn: signUpRequest });
  const [currentStep, setCurrentStep] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined
  );

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      name: {
        firstName: "",
        lastName: "",
      },
      address: {
        street: "",
        city: "",
        zipcode: "",
        country: "Brasil",
        latitude: 0,
        longitude: 0,
        number: "",
      },
      phone: "",
      status: IUserStatus.ACTIVE,
      role: "",
    },
  });

  useEffect(() => {
    const measureHeight = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        setContentHeight(height);
      }
    };
    const timeoutId = setTimeout(measureHeight, 50);
    return () => clearTimeout(timeoutId);
  }, [currentStep]);

  useEffect(() => {
    if (!contentRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.target.scrollHeight;
        setContentHeight(height);
      }
    });
    resizeObserver.observe(contentRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const currentStepData = steps.find((step) => step.id === currentStep)!;
  const progress = (currentStep / steps.length) * 100;

  async function validateCurrentStep() {
    const fields = currentStepData.fields;
    const isValid = await form.trigger(fields as never);
    return isValid;
  }

  const remeasureHeight = () => {
    setTimeout(() => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        setContentHeight(height);
      }
    }, 100);
  };

  async function nextStep() {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      remeasureHeight();
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      remeasureHeight();
    }
  }

  async function onSubmit(data: SignupFormData) {
    try {
      const {
        address: { longitude, latitude, ...partialAddress },
        ...partialData
      } = data;
      const formData = {
        ...partialData,
        ...partialAddress,
        geo: `LONG-${longitude},LAT-${latitude}`,
      };

      await mutateAsync(formData);

      showToast({
        type: MessageType.Success,
        text: "Conta criada com sucesso",
      });
    } catch (error) {
      handleError(error);
    }
  }

  const Steps = useMemo<Record<string, React.FC<StepProps>>>(
    () => ({
      "1": FirstStep,
      "2": SecondStep,
      "3": FinalStep,
    }),
    []
  );

  const CurrentStepComponent = Steps[currentStep.toString()];

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-[45rem] md:mt-24 md:w-2/3">
        <Card className="shadow-xl border-0 bg-card backdrop-blur-sm w-full overflow-hidden">
          <CardHeader>
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Cadastre sua conta
              </h3>
              <p className="text-gray-500 mb-4">
                Bem-vindo! Faça o cadastro para continuar.
              </p>
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Etapa {currentStep} de {steps.length}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between mb-6">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div
                      className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                    ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-muted-foreground/30 text-muted-foreground"
                    }
                  `}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-xs font-medium transition-colors duration-300 ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{currentStepData.title}</Badge>
              </div>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <motion.div
                  initial={false}
                  animate={{
                    height: contentHeight || "auto",
                    minHeight: contentHeight || 300,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="overflow-hidden"
                  onAnimationComplete={() => {
                    if (contentRef.current) {
                      const height = contentRef.current.scrollHeight;
                      setContentHeight(height);
                    }
                  }}
                >
                  <div ref={contentRef}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CurrentStepComponent form={form} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>
                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      Próximo
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex items-center gap-2"
                      disabled={isPending}
                    >
                      {isPending ? <Loader className="animate-spin" /> : null}
                      Finalizar Cadastro
                    </Button>
                  )}
                </div>
              </form>
            </Form>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{" "}
                <a
                  href="/sign-in"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Faça login
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type StepProps = {
  form: UseFormReturn<SignupFormData>;
};

function FirstStep({ form }: StepProps) {
  return (
    <div className="space-y-4">
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
                startIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
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
        name="userName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome de usuário</FormLabel>
            <FormControl>
              <TextInput
                id="userName"
                name="userName"
                required
                placeholder="Nome de usuário"
                onChange={field.onChange}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name.firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primeiro nome</FormLabel>
              <FormControl>
                <TextInput
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="Primeiro nome"
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
          name="name.lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobrenome</FormLabel>
              <FormControl>
                <TextInput
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="Sobrenome"
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Senha"
                  startIcon={<LockIcon className="h-4 w-4 cursor-pointer" />}
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <TextInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirmar senha"
                  startIcon={<LockIcon className="h-4 w-4 cursor-pointer" />}
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function SecondStep({ form }: StepProps) {
  const handleLocationChange = (locationData: LocationData): void => {
    form.setValue("address.latitude", locationData.lat);
    form.setValue("address.longitude", locationData.lng);

    if (locationData.address) {
      if (locationData.address.street) {
        form.setValue("address.street", locationData.address.street);
      }
      if (locationData.address.houseNumber) {
        form.setValue("address.number", locationData.address.houseNumber);
      }

      if (locationData.address.city) {
        form.setValue("address.city", locationData.address.city);
      }

      if (locationData.address.zipCode) {
        form.setValue("address.zipcode", locationData.address.zipCode);
      }
      if (locationData.address.country) {
        form.setValue("address.country", locationData.address.country);
      }
    }
  };

  console.log(form.getValues());

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <FormField
          control={form.control}
          name="address.street"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-9">
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <TextInput
                  id="street"
                  name="street"
                  required
                  placeholder="Rua, número, complemento"
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
          name="address.number"
          render={({ field }) => (
            <FormItem className="col-span-12 md:col-span-3">
              <FormLabel>Número</FormLabel>
              <FormControl>
                <TextInput
                  id="number"
                  name="number"
                  required
                  placeholder="Número"
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <TextInput
                  id="city"
                  name="city"
                  required
                  placeholder="Cidade"
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address.zipcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <TextInput
                  id="zipCode"
                  name="zipCode"
                  required
                  placeholder="00000-000"
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
          name="address.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>País</FormLabel>
              <FormControl>
                <TextInput
                  id="country"
                  name="country"
                  required
                  placeholder="País"
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Seção do Mapa com Geocoding Reverso */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-medium">Localização no Mapa</h4>
        </div>
        <p className="text-xs text-muted-foreground">
          Clique no mapa para definir sua localização e preencher
          automaticamente os campos de endereço.
        </p>

        <LocationPicker
          onLocationChange={handleLocationChange}
          initialValueLat={form.watch("address.latitude")}
          initialValueLng={form.watch("address.longitude")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address.latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <TextInput
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    placeholder="Ex: -23.5505"
                    onChange={(e) =>
                      field.onChange(
                        Number.parseFloat(e.target.value) || undefined
                      )
                    }
                    value={field.value?.toString() || ""}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <TextInput
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    placeholder="Ex: -46.6333"
                    onChange={(e) =>
                      field.onChange(
                        Number.parseFloat(e.target.value) || undefined
                      )
                    }
                    value={field.value?.toString() || ""}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function FinalStep({ form }: StepProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <MaskedInput
                id="phone"
                name="phone"
                type="tel"
                required
                mask="(99) 99999-99999"
                placeholder="(00) 00000-0000"
                onChange={field.onChange}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rolesOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                disabled
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
