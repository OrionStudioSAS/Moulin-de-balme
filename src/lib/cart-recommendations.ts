import type { CartItem } from "@/lib/cart-context";
import type { Product } from "@/types";

export const MAX_CART_RECOMMENDATIONS = 3;

export function selectRandomAvailableProducts(
  products: Product[],
  limit = MAX_CART_RECOMMENDATIONS,
  random = Math.random,
) {
  if (limit <= 0) return [];

  const available = products.filter((product) => product.is_available);
  for (let index = available.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [available[index], available[randomIndex]] = [available[randomIndex], available[index]];
  }

  return available.slice(0, limit);
}

function compareProducts(a: Product, b: Product) {
  return (
    a.sort_order - b.sort_order ||
    a.name.localeCompare(b.name, "fr") ||
    a.id.localeCompare(b.id)
  );
}

/**
 * Returns a stable selection: products from a category already in the cart
 * first, then the remaining catalogue in its editorial order.
 */
export function selectCartRecommendations(
  products: Product[],
  items: Pick<CartItem, "product">[],
  limit = MAX_CART_RECOMMENDATIONS,
) {
  if (limit <= 0) return [];

  const productIdsInCart = new Set(items.map(({ product }) => product.id));
  const categoryIdsInCart = new Set(
    items
      .map(({ product }) => product.category_id)
      .filter((categoryId): categoryId is string => Boolean(categoryId)),
  );

  const candidates = products
    .filter((product) => product.is_available && !productIdsInCart.has(product.id))
    .sort(compareProducts);

  const sameCategory = candidates.filter(
    (product) => product.category_id && categoryIdsInCart.has(product.category_id),
  );
  const fallback = candidates.filter(
    (product) => !product.category_id || !categoryIdsInCart.has(product.category_id),
  );

  return [...sameCategory, ...fallback].slice(0, limit);
}

export function requiresProductSelection(product: Product) {
  return (
    (Array.isArray(product.variations) && product.variations.length > 0) ||
    (Array.isArray(product.weight_prices) && product.weight_prices.length > 0)
  );
}
