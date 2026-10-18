import { collection, doc, getDoc, getDocs, query, where, type DocumentData } from "firebase/firestore";
import { getClientDb } from "./firebase";

export type StoreProduct = {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  price: number | null;
  currency: string;
  rating: number | null;
  reviewCount: number | null;
  variants: unknown[];
  raw: DocumentData;
};
const str = (v: unknown): string => typeof v === "string" ? v : "";
const num = (v: unknown): number | null => typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)) ? Number(v) : null;
const asObject = (v: unknown): Record<string, unknown> => v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};
const first = (...values: unknown[]) => values.find(v => v !== null && v !== undefined && v !== "") ?? null;
function imageUrls(value: unknown): string[] {
  const candidates = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return candidates.map(v => typeof v === "string" ? v : str(asObject(v).url) || str(asObject(v).src)).filter(url => /^https?:\/\//.test(url));
}
export function normalizeProduct(id: string, data: DocumentData): StoreProduct {
  const pricing = asObject(data.pricing);
  const reviews = asObject(data.reviews);
  const candidates = [data.images, data.image_urls, data.imageUrls, data.product_images, data.gallery].flatMap(imageUrls);
  const mainImage = first(data.image, data.image_url, data.thumbnail, data.main_image);
  if (typeof mainImage === "string" && /^https?:\/\//.test(mainImage)) candidates.unshift(mainImage);
  // A supplier cost is never a customer-facing price. Prefer the configured retail/list price.
  const price = num(first(pricing.list_price, pricing.listPrice, pricing.retail_price, data.list_price, data.retail_price, data.sale_price, data.price, pricing.price_floor, data.price_floor));
  return {
    id,
    title: str(first(data.title, data.display_title, data.name, data.product_title)) || "Untitled product",
    description: str(first(data.description, data.product_description, data.summary)),
    category: str(first(data.category_name, data.category, data.categoryName)) || "Collection",
    images: [...new Set(candidates)],
    price: price !== null && price >= 0 ? price : null,
    currency: str(first(data.currency, pricing.currency)) || "USD",
    rating: num(first(data.rating, data.average_rating, reviews.rating)),
    reviewCount: num(first(data.review_count, data.reviewCount, reviews.count)),
    variants: Array.isArray(data.variants) ? data.variants : [],
    raw: data
  };
}
export async function getStagedProducts(): Promise<StoreProduct[]> {
  const snapshot = await getDocs(query(collection(getClientDb(), "products"), where("status", "==", "staged")));
  return snapshot.docs.map(record => normalizeProduct(record.id, record.data())).sort((a,b) => a.title.localeCompare(b.title));
}
export async function getProduct(id: string): Promise<StoreProduct | null> {
  const snapshot = await getDoc(doc(getClientDb(), "products", id));
  if (!snapshot.exists() || snapshot.data().status !== "staged") return null;
  return normalizeProduct(snapshot.id, snapshot.data());
}
export function displayPrice(product: StoreProduct): string {
  return product.price === null ? "Price unavailable" : new Intl.NumberFormat("en-US", {style:"currency",currency:product.currency}).format(product.price);
}
