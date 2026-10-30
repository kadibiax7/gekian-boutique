export type CartLine = { id: string; size: string; color: string; qty: number };
export class CheckoutError extends Error {}
export function parseCart(value: unknown): CartLine[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 20) throw new CheckoutError("Your bag must contain 1–20 items.");
  const lines = value.map((v): CartLine => {
    if (!v || typeof v !== "object" || typeof v.id !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(v.id) || !Number.isInteger(v.qty) || v.qty < 1 || v.qty > 10 || typeof v.size !== "string" || v.size.length > 120 || typeof v.color !== "string" || v.color.length > 120) throw new CheckoutError("An item in your bag is invalid. Remove it and add it again.");
    return {id:v.id, size:v.size, color:v.color, qty:v.qty};
  });
  const keys = lines.map(v => JSON.stringify([v.id,v.size,v.color]));
  if (new Set(keys).size !== keys.length) throw new CheckoutError("Duplicate bag items. Remove them and try again.");
  return lines;
}
/** Explicit merchant approval avoids treating supplier cost as a selling price. */
export function approvedItem(data: Record<string, any>, line: CartLine) {
  const config = data.checkout;
  if (data.status !== "staged" || config?.enabled !== true || config.currency !== "USD") throw new CheckoutError("An item is not ready for checkout yet.");
  const variants = Array.isArray(config.variants) ? config.variants : [];
  const item = variants.length ? variants.find((v: any) => v.color === line.color && v.size === line.size) : config;
  if (!item || (!variants.length && (line.color || line.size || (Array.isArray(data.variants) && data.variants.length)))) throw new CheckoutError("This product option is not ready for checkout.");
  if (!Number.isSafeInteger(item.unitAmount) || item.unitAmount < 50 || item.unitAmount > 50000) throw new CheckoutError("An item needs an approved selling price.");
  if (item.unitAmount !== config.unitAmount) throw new CheckoutError("This option needs a matching approved display price.");
  if (!Number.isSafeInteger(item.stock) || item.stock < line.qty) throw new CheckoutError("An item has insufficient confirmed stock.");
  if (typeof data.title !== "string" || !data.title.trim()) throw new CheckoutError("An item is missing its product name.");
  return {unitAmount: item.unitAmount as number, name: [data.title, line.color, line.size].filter(Boolean).join(" / ").slice(0,250)};
}
