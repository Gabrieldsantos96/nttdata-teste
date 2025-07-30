export function formatValue(price: number, currency: string = "BRL") {
  const numPrice = Number.parseFloat(price.toString());
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency,
  }).format(numPrice);
}
