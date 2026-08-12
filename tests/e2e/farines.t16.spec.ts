import { expect, test, type Page } from "@playwright/test";

const flourPath = "/produits?categorie=farines";

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function expectColumnCount(page: Page, expected: number) {
  const columns = await page.getByTestId("farines-product-grid").evaluate((grid) =>
    window.getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length,
  );

  expect(columns).toBe(expected);
}

test.describe("T16 — variante Farines isolée", () => {
  test.skip(
    ({ isMobile }) => isMobile,
    "La matrice T16 fixe elle-même les quatre viewports depuis Chromium desktop.",
  );

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(() => window.localStorage.clear());
  });

  test("active Piste A uniquement pour categorie=farines", async ({ page }) => {
    await page.goto(flourPath);

    await expect(page.locator('[data-products-variant="farines"]')).toBeVisible();
    await expect(page.getByTestId("farines-hero")).toBeVisible();
    await expect(page.locator('[data-product-card-variant="farines"]')).toHaveCount(8);
    await expect(page.getByRole("link", { name: "Farines", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await page.goto("/produits?categorie=pains");
    await expect(page.locator('[data-products-variant="default"]')).toBeVisible();
    await expect(page.getByTestId("farines-hero")).toHaveCount(0);
    await expect(page.locator('[data-product-card-variant="default"]')).toHaveCount(1);

    await page.goto("/produits");
    await expect(page.locator('[data-products-variant="default"]')).toBeVisible();
    await expect(page.getByTestId("farines-product-grid")).toHaveCount(0);
    await expect(page.locator('[data-product-card-variant="farines"]')).toHaveCount(0);
  });

  test("rend le hero, la navigation, la grille et les cartes approuvés au desktop", async ({
    page,
  }) => {
    await page.goto(flourPath);

    const hero = page.getByTestId("farines-hero");
    const heroBox = await hero.boundingBox();
    const navBox = await page.getByTestId("farines-category-nav").boundingBox();
    const firstCardBox = await page
      .locator('[data-product-card-variant="farines"]')
      .first()
      .boundingBox();

    expect(heroBox?.height).toBe(465);
    expect(navBox?.height).toBeGreaterThanOrEqual(76);
    expect(navBox?.height).toBeLessThanOrEqual(78);
    expect(firstCardBox?.width).toBeGreaterThanOrEqual(323);
    expect(firstCardBox?.width).toBeLessThanOrEqual(331);
    await expectColumnCount(page, 4);
    await expect(page.getByRole("heading", { level: 1, name: "Nos farines" })).toBeVisible();
    await expect(page.getByText(/À partir de 3,20€/).first()).toBeVisible();
    await expect(page.getByText("Recette du moment", { exact: true })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("conserve les liens produit et ouvre le panier avec le produit réel du mock", async ({
    page,
  }) => {
    await page.goto(flourPath);

    const productLink = page.getByRole("link", { name: /Farines fixture 1/i }).first();
    await expect(productLink).toHaveAttribute("href", "/produits/farines-fixture-1");

    await page.getByRole("button", { name: "Ajouter Farines fixture 1 au panier" }).click();
    await expect(page.getByText("1 article", { exact: true })).toBeVisible();
    await expect(page.locator("[class*='translate-x-0']").getByText("Farines fixture 1")).toBeVisible();
    await expect(page.getByRole("button", { name: /Mon panier \(1\)/ })).toBeVisible();

    await page.getByRole("button", { name: "Fermer" }).click();
    await productLink.click();
    await expect(page).toHaveURL(/\/produits\/farines-fixture-1$/);
    await expect(page.getByRole("heading", { level: 1, name: "Farines fixture 1" })).toBeVisible();
  });

  for (const target of [
    { name: "desktop", width: 1440, height: 900, heroHeight: 465, columns: 4 },
    { name: "tablette", width: 768, height: 1024, heroHeight: 420, columns: 2 },
    { name: "mobile", width: 390, height: 844, heroHeight: 390, columns: 2 },
    { name: "mobile étroit", width: 359, height: 844, heroHeight: 390, columns: 1 },
  ]) {
    test(`respecte le reflow ${target.name} sans débordement horizontal`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: target.width, height: target.height });
      await page.goto(flourPath);

      const heroBox = await page.getByTestId("farines-hero").boundingBox();
      expect(heroBox?.height).toBe(target.heroHeight);
      await expectColumnCount(page, target.columns);
      await expectNoHorizontalOverflow(page);

      const addButton = page
        .getByRole("button", { name: "Ajouter Farines fixture 1 au panier" })
        .first();
      const buttonBox = await addButton.boundingBox();
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44);

      await testInfo.attach(`farines-${target.width}x${target.height}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
    });
  }

  test("expose un focus visible et neutralise le mouvement non essentiel", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(flourPath);

    const activeCategory = page.getByRole("link", { name: "Farines", exact: true });
    await activeCategory.focus();
    const focusStyle = await activeCategory.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
    });
    expect(focusStyle.outlineStyle).not.toBe("none");
    expect(focusStyle.outlineWidth).toBe("2px");

    const productImage = page.getByRole("img", { name: "Farines fixture 1" });
    await expect(productImage).toHaveCSS("transition-property", "none");
  });

  test("préserve la baseline non-Farines", async ({ page }) => {
    await page.goto("/produits?categorie=pains");

    const hero = page.locator('[data-products-variant="default"] > div').first();
    const defaultCard = page.locator('[data-product-card-variant="default"]');
    const heroBox = await hero.boundingBox();

    expect(heroBox?.height).toBe(465);
    await expect(defaultCard).toHaveClass("group");
    await expect(defaultCard.getByRole("button", { name: "Ajouter au panier" })).toBeVisible();
    await expect(page.getByTestId("farines-category-nav")).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  });
});
