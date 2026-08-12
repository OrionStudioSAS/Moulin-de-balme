import { expect, test, type Locator, type Page } from "@playwright/test";

const flourPath = "/produits?categorie=farines";

const expectedCards = [
  {
    type: "55",
    designation: "Farine blanche",
    ashRate: "De 0,50 % à 0,60 % de matière sèche",
    usage: "Pain, biscottes et viennoiseries",
    products: [
      ["Farine T55", "/produits/farine-t55"],
      ["Farine de gruau T55", "/produits/farine-gruau-t55"],
    ],
  },
  {
    type: "65",
    designation: "Farine blanche",
    ashRate: "De 0,62 % à 0,75 % de matière sèche",
    usage: "Pain de tradition française et biscuiterie",
    products: [
      ["Farine de blé T65", "/produits/farine-ble-t65"],
      ["Farine T65 Bio", "/produits/farine-t65-bio"],
      ["Farine de blé T65 Label Rouge", "/produits/farine-ble-t65-label-rouge"],
    ],
  },
  {
    type: "80",
    designation: "Farine bise",
    ashRate: "De 0,75 % à 0,90 % de matière sèche",
    usage: "Pain bis et autres applications spéciales",
    products: [
      ["Farine de blé T80", "/produits/farine-ble-t80"],
      ["Farine de blé T80 Label Rouge", "/produits/farine-ble-t80-label-rouge"],
      ["Farine de blé bio T80", "/produits/farine-ble-bio-t80"],
      [
        "Farine de blé T80 Label Rouge classique",
        "/produits/farine-ble-t80-label-rouge-classique",
      ],
    ],
  },
  {
    type: "150",
    designation: "Farine complète",
    ashRate: "Au-dessus de 1,40 % de matière sèche",
    usage: "Pains complets, spéciaux et autres",
    products: [
      ["Farine T150 complète", "/produits/farine-t150-complete"],
      ["Farine de blé bio T150", "/produits/farine-ble-bio-t150"],
    ],
  },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function expectColumnCount(grid: Locator, expected: number) {
  const columns = await grid.evaluate((element) =>
    window.getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length,
  );

  expect(columns).toBe(expected);
}

test.describe("T17 — guide prudent de classification des farines", () => {
  test.skip(
    ({ isMobile }) => isMobile,
    "La matrice T17 pilote explicitement les viewports depuis Chromium desktop.",
  );

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(flourPath);
  });

  test("rend la copie Pauline exacte et la note de portée", async ({ page }) => {
    const guide = page.getByTestId("flour-classification-guide");

    await expect(guide).toHaveAttribute("data-content-version", "pauline-814330a-v1");
    await expect(
      guide.getByRole("heading", { level: 2, name: "Comprendre les types de farine" }),
    ).toBeVisible();
    await expect(guide).toContainText(
      "Le « T » se lit « type ». Pour les farines de blé, chaque type correspond à une plage de taux de cendres, exprimée en pourcentage de matière sèche. Ce taux est déterminé par incinération et il est corrélé à la quantité de matières minérales de la farine. Dans cette classification, un type plus élevé correspond à un taux de cendres plus élevé.",
    );
    await expect(guide).toContainText("Repères pour nos farines de blé");
    await expect(guide).toContainText(
      "Ces repères concernent ici les farines de blé. Les types indiqués sur nos farines de seigle et d'épeautre ne sont pas comparés dans ce guide tant que leurs données de référence ne sont pas confirmées.",
    );

    for (const expected of expectedCards) {
      const card = guide.locator(`[data-flour-type="${expected.type}"]`);
      await expect(
        card.getByRole("heading", { level: 3, name: `Type ${expected.type}`, exact: true }),
      ).toBeVisible();
      await expect(card).toContainText(expected.designation);
      await expect(card).toContainText(expected.ashRate);
      await expect(card).toContainText("Idées d'usage");
      await expect(card).toContainText(expected.usage);
      await expect(card).toContainText("Produits associés");
    }
  });

  test("limite le guide aux quatre types de blé autorisés sans allégation interdite", async ({
    page,
  }) => {
    const guide = page.getByTestId("flour-classification-guide");
    const cards = guide.locator("[data-flour-type]");
    const guideText = (await guide.textContent()) ?? "";

    await expect(cards).toHaveCount(4);
    expect(await cards.evaluateAll((elements) => elements.map((element) => element.getAttribute("data-flour-type")))).toEqual([
      "55",
      "65",
      "80",
      "150",
    ]);

    for (const excludedType of ["T45", "T90", "T100", "T110", "T130"]) {
      expect(guideText).not.toContain(excludedType);
    }

    for (const prohibitedClaim of [
      "meilleur pour la santé",
      "bon pour la santé",
      "très digeste",
      "riche en protéines",
      "plus nutritive",
      "fibres",
      "vitamines",
      "glycémie",
      "digestion",
      "satiété",
      "Idéal pour",
      "Parfait pour",
    ]) {
      expect(guideText.toLocaleLowerCase("fr")).not.toContain(
        prohibitedClaim.toLocaleLowerCase("fr"),
      );
    }
  });

  test("utilise les onze noms et slugs produit explicites du contrat", async ({ page }) => {
    const guide = page.getByTestId("flour-classification-guide");
    const productLinks = guide.locator('a[href^="/produits/"]');

    await expect(productLinks).toHaveCount(11);

    for (const expected of expectedCards) {
      const card = guide.locator(`[data-flour-type="${expected.type}"]`);
      for (const [name, href] of expected.products) {
        await expect(card.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
      }
    }

    const firstProductLink = productLinks.first();
    await firstProductLink.focus();
    const focus = await firstProductLink.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
    });
    expect(focus.outlineStyle).not.toBe("none");
    expect(focus.outlineWidth).toBe("2px");
  });

  for (const target of [
    { name: "desktop", width: 1440, height: 900, columns: 4 },
    { name: "tablette", width: 768, height: 1024, columns: 2 },
    { name: "mobile", width: 390, height: 844, columns: 1 },
  ]) {
    test(`respecte la hiérarchie ${target.name} sans débordement`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: target.width, height: target.height });
      await page.goto(flourPath);

      const guide = page.getByTestId("flour-classification-guide");
      await expect(guide).toBeVisible();
      await expectColumnCount(page.getByTestId("flour-classification-grid"), target.columns);
      await expectNoHorizontalOverflow(page);

      await testInfo.attach(`classification-${target.width}x${target.height}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
    });
  }

  test("reste absent de la page générale et des catégories non-Farines", async ({ page }) => {
    await page.goto("/produits");
    await expect(page.getByTestId("flour-classification-guide")).toHaveCount(0);

    await page.goto("/produits?categorie=pains");
    await expect(page.getByTestId("flour-classification-guide")).toHaveCount(0);
    await expect(page.locator('[data-products-variant="default"]')).toBeVisible();
  });
});
