"use client";

import type React from "react";

import { cn } from "~/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { forwardRef } from "react";

type TextInputComponentProps = {
  containerClassName?: string;
  inputClassName?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">;

const TextInput = forwardRef<HTMLInputElement, TextInputComponentProps>(
  (
    {
      startIcon,
      endIcon,
      containerClassName = "",
      inputClassName = "",
      ...inputProps
    },
    ref
  ) => {
    const controls = useAnimation();

    const handleFocus = () => {
      controls.start({ width: "100%" });
    };

    const handleBlur = () => {
      controls.start({ width: "0%" });
    };

    return (
      <div
        className={cn("relative flex items-center w-full", containerClassName)}
      >
        {startIcon && (
          <div className="absolute left-3 z-10 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}

        <div className="relative flex-1">
          <input
            ref={ref}
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-sm bg-transparent px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
              startIcon && "pl-10",
              endIcon && "pr-10",
              inputClassName
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...inputProps}
          />

          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={controls}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>

        {endIcon && (
          <div className="absolute right-3 z-10 flex items-center pointer-events-none">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
