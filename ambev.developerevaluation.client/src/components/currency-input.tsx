"use client";

import type React from "react";
import { forwardRef, useCallback, useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import TextInput from "./text-input";

interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  currency?: "USD" | "BRL";
  containerClassName?: string;
  inputClassName?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  value: number | string;
  onChange?: (value: number) => void;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      currency = "BRL",
      value,
      onChange,
      containerClassName,
      inputClassName,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState("");

    const currencies = {
      USD: "$",
      BRL: "R$",
    };

    const currencySymbol =
      currencies[currency as keyof typeof currencies] || currency;

    const moneyFormatter = Intl.NumberFormat("pt-BR", {
      currency: "BRL",
      currencyDisplay: "symbol",
      currencySign: "standard",
      style: "currency",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formatDecimalToDisplay = useCallback(
      (decimalValue: number | string | undefined): string => {
        if (
          decimalValue === undefined ||
          decimalValue === null ||
          decimalValue === ""
        ) {
          return moneyFormatter.format(0);
        }
        const numericValue =
          typeof decimalValue === "string"
            ? parseFloat(decimalValue)
            : decimalValue;
        if (isNaN(numericValue)) return moneyFormatter.format(0);
        return moneyFormatter.format(numericValue);
      },
      [moneyFormatter]
    );

    const cleanInputToRawNumberString = useCallback(
      (inputStr: string): string => {
        const cleaned = inputStr
          .replace(currencySymbol, "")
          .replace(/\./g, "")
          .replace(",", "");
        return cleaned.replace(/[^0-9]/g, "");
      },
      [currencySymbol]
    );

    useEffect(() => {
      setDisplayValue(formatDecimalToDisplay(value));
    }, [value, formatDecimalToDisplay]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newRawString = cleanInputToRawNumberString(e.target.value);

      let tempDisplay = newRawString;
      if (newRawString.length < 3) {
        tempDisplay = newRawString.padStart(3, "0");
      }

      const formattedForDisplay = formatDecimalToDisplay(
        Number(tempDisplay) / 100
      );
      setDisplayValue(formattedForDisplay);

      const decimalValueToSend = Number(newRawString) / 100;
      onChange?.(decimalValueToSend);
    };

    return (
      <TextInput
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        containerClassName={containerClassName}
        inputClassName={cn("pr-3", inputClassName)}
        endIcon={endIcon}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
