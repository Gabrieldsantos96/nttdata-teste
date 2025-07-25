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
