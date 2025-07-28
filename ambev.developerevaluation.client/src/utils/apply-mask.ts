export function applyMask(inputValue: string, mask: string): string {
  if (!inputValue) return "";

  const digits = inputValue.replace(/\D/g, "");
  let formattedValue = "";
  let digitIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (digitIndex >= digits.length) break;
    if (mask[i] === "9") {
      formattedValue += digits[digitIndex];
      digitIndex++;
    } else {
      formattedValue += mask[i];
    }
  }

  return formattedValue;
}

export const enum MASKS {
  CPF = "999.999.999-99",
  CNPJ = "99.999.999/9999-99",
  PHONE = "(99) 99999-9999",
  CEP = "99999-999",
  DATE = "99/99/9999",
  CREDIT_CARD = "9999 9999 9999 9999",
}
