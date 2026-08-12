import { expect, test, type Page } from "@playwright/test";

const sourceProduct = {
  id: "pain-source",
  name: "Pain de campagne",
  slug: "pain-source",
  description: null,
  subtitle: null,
  price: 5,
  image_url: null,
  category_id: "category-breads",
  available_days: [],
  is_available: true,
  is_featured: false,
  is_semaine: false,
  badge: null,
  variations: [],
  ingredients: null,
  conservation: null,
  savoir_faire: null,
  le_saviez_vous: null,
  subcategory_id: null,
  sort_order: 1,
  poids: "500",
  is_tranche: false,
  weight_prices: [],
  created_at: "2026-01-01T00:00:00Z",
};

async function openSeededCart(page: Page) {
  await page.addInitScript((product) => {
    localStorage.setItem("moulin-cart", JSON.stringify([{
      id: `${product.id}-0`,
      product,
      quantity: 1,
      variationIndex: 0,
      tranche: false,
      unitPrice: product.price,
    }]));
  }, sourceProduct);
  await page.goto("/");
  await page.getByRole("button", { name: /Mon panier \(1\)/ }).click();
  await expect(page.getByRole("dialog", { name: "Mon panier" })).toBeVisible();
}

test.describe("T15 — recommandations du panier", () => {
  test("propose trois produits disponibles lorsque le panier est vide", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Mon panier \(0\)/ }).click();
    const dialog = page.getByRole("dialog", { name: "Mon panier" });
    const section = dialog.getByRole("region", { name: "Ces produits pourraient vous plaire" });

    await expect(dialog.getByText("Votre panier est vide")).toBeVisible();
    await expect(section.getByRole("listitem")).toHaveCount(3);
    await expect(section.getByRole("button", { name: /^Ajouter / })).toHaveCount(3);
  });

  test("affiche au plus trois suggestions et exclut le produit présent", async ({ page }) => {
    await openSeededCart(page);
    const section = page.getByRole("region", { name: "Ces produits pourraient vous plaire" });

    await expect(section).toBeVisible();
    await expect(section.getByRole("listitem")).toHaveCount(3);
    await expect(section).not.toContainText(sourceProduct.name);
    await expect(section.getByText("Pain aux noix")).toBeVisible();
  });

  test("ajoute une suggestion, recalcule le total et garde le tiroir ouvert", async ({ page, request }) => {
    await openSeededCart(page);
    const dialog = page.getByRole("dialog", { name: "Mon panier" });
    const total = dialog.getByText("Total", { exact: true }).locator("..");
    await expect(total.getByText("5,00 €")).toBeVisible();

    await dialog.getByRole("button", { name: "Ajouter Pain aux noix au panier" }).click();

    await expect(page.getByRole("button", { name: /Mon panier \(2\)/ })).toBeVisible();
    await expect(dialog).toBeVisible();
    await expect(total.getByText("11,00 €")).toBeVisible();
    await expect(dialog.getByText("Pain aux noix a été ajouté au panier.")).toBeVisible();
    const recommendationItems = dialog
      .getByRole("region", { name: "Ces produits pourraient vous plaire" })
      .getByRole("listitem");
    await expect(recommendationItems).toHaveCount(3);
    await expect(recommendationItems.filter({ hasText: "Pain aux noix" })).toHaveCount(0);

    const audit = await request.get("http://127.0.0.1:54321/requests");
    expect(await audit.json()).toEqual({ writes: [] });
  });

  test("permet la navigation au clavier et conserve le focus dans le tiroir", async ({ page }) => {
    await openSeededCart(page);
    const dialog = page.getByRole("dialog", { name: "Mon panier" });
    const close = dialog.getByRole("button", { name: "Fermer le panier" });
    await expect(close).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("button", { name: "Continuer mes achats" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeInViewport();
    await expect(page.getByRole("button", { name: /Mon panier \(1\)/ })).toBeFocused();
  });

  test("reste utilisable sur mobile sans masquer le total ni le CTA", async ({ page }) => {
    test.skip(!test.info().project.name.startsWith("mobile"), "Scénario réservé au viewport mobile.");
    await openSeededCart(page);
    const dialog = page.getByRole("dialog", { name: "Mon panier" });

    await expect(dialog).toHaveCSS("width", "390px");
    await expect(dialog.getByText("Total", { exact: true })).toBeInViewport();
    await expect(dialog.getByRole("link", { name: /Commander — Click & Collect/ })).toBeInViewport();
    await dialog.getByRole("button", { name: "Ajouter Pain aux noix au panier" }).click();
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: /Mon panier \(2\)/ })).toBeVisible();
  });
});
