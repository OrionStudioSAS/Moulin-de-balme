import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_CART_RECOMMENDATIONS,
  requiresProductSelection,
  selectCartRecommendations,
} from "./cart-recommendations.ts";

function product(id, categoryId, sortOrder, overrides = {}) {
  return {
    id,
    name: id,
    slug: id,
    category_id: categoryId,
    sort_order: sortOrder,
    is_available: true,
    variations: [],
    weight_prices: [],
    ...overrides,
  };
}

test("limits recommendations to three and excludes cart and unavailable products", () => {
  const inCart = product("cart", "bread", 0);
  const catalogue = [
    inCart,
    product("unavailable", "bread", 1, { is_available: false }),
    product("a", "bread", 2),
    product("b", "bread", 3),
    product("c", "bread", 4),
    product("d", "bread", 5),
  ];

  const result = selectCartRecommendations(catalogue, [{ product: inCart }]);

  assert.equal(result.length, MAX_CART_RECOMMENDATIONS);
  assert.deepEqual(result.map(({ id }) => id), ["a", "b", "c"]);
});

test("prioritises matching categories, then applies a stable editorial fallback", () => {
  const inCart = product("cart", "bread", 0);
  const catalogue = [
    product("fallback-second", "pastry", 20),
    product("same-second", "bread", 15),
    product("fallback-first", "pastry", 10),
    product("same-first", "bread", 5),
  ];

  const select = () => selectCartRecommendations(catalogue, [{ product: inCart }]);

  assert.deepEqual(select().map(({ id }) => id), [
    "same-first",
    "same-second",
    "fallback-first",
  ]);
  assert.deepEqual(select().map(({ id }) => id), select().map(({ id }) => id));
});

test("returns fewer than three products, including none, without placeholders", () => {
  const inCart = product("cart", "bread", 0);
  assert.deepEqual(selectCartRecommendations([], [{ product: inCart }]), []);
  assert.deepEqual(
    selectCartRecommendations([product("only", "pastry", 1)], [{ product: inCart }])
      .map(({ id }) => id),
    ["only"],
  );
});
test("recalculates after an added recommendation enters the cart", () => {
  const first = product("first", "bread", 1);
  const second = product("second", "bread", 2);
  const third = product("third", "bread", 3);
  const fourth = product("fourth", "bread", 4);
  const initialCart = product("cart", "bread", 0);
  const catalogue = [first, second, third, fourth];

  const before = selectCartRecommendations(catalogue, [{ product: initialCart }]);
  const after = selectCartRecommendations(catalogue, [
    { product: initialCart },
    { product: first },
  ]);

  assert.deepEqual(before.map(({ id }) => id), ["first", "second", "third"]);
  assert.deepEqual(after.map(({ id }) => id), ["second", "third", "fourth"]);
});

test("requires the product page for mandatory variant or weight selection", () => {
  assert.equal(requiresProductSelection(product("plain", null, 1)), false);
  assert.equal(
    requiresProductSelection(product("variant", null, 1, {
      variations: [{ label: "Grande", price_modifier: 2 }],
    })),
    true,
  );
  assert.equal(
    requiresProductSelection(product("weight", null, 1, {
      weight_prices: [{ weight: "500 g", price: 5 }],
    })),
    true,
  );
});
