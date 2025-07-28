"use client";

import type React from "react";

import { forwardRef } from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface CurrencyInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  currency?: string;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, currency = "BRL", value, onChange, ...props }, ref) => {
    const currencies = {
      USD: "$",
      BRL: "R$",
    };

    function formatInputCurrency(inputValue: string | number = ""): string {
      if (typeof inputValue === "number") {
        inputValue = String(inputValue);
      }
      const digits = inputValue.replace(/\D/g, "");
      return moneyFormatter.format(Number(digits) / 100);
    }

    const moneyFormatter = Intl.NumberFormat("pt-BR", {
      currency: "BRL",
      currencyDisplay: "symbol",
      currencySign: "standard",
      style: "currency",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    function cleanValue(inputValue: string): string {
      return inputValue.replace(/[^0-9]/g, "");
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const rawValue = cleanValue(e.target.value);
      const formattedValue = formatInputCurrency(e.target.value);

      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: rawValue,
        },
      };

      onChange?.(newEvent);
      e.target.value = formattedValue;
    }

    return (
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">
          {currencies[currency as keyof typeof currencies] || currency}
        </span>
        <Input
          {...props}
          className={cn("pl-10", className)}
          value={formatInputCurrency(value as string)}
          ref={ref}
          onChange={handleChange}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
