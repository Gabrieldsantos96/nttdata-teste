import * as React from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { applyMask } from "~/utils/apply-mask";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, value, onChange, ...inputProps }, ref) => {
    function cleanValue(inputValue: string): string {
      return inputValue.replace(/[^0-9]/g, "");
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const rawValue = cleanValue(e.target.value);
      const formattedValue = applyMask(rawValue, mask);

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
      <Input
        {...inputProps}
        ref={ref}
        className={cn(className)}
        value={applyMask((value as string) || "", mask)}
        onChange={handleChange}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
