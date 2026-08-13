import { expect, test, type Locator, type Page } from "@playwright/test";

const flourPath = "/produits?categorie=farines";
const expectedBody =
  "À Chirac, en Lozère, l’Inventaire général du patrimoine culturel documente un moulin royal dès le XIIIe siècle. Détruit pendant les guerres de Religion, il a été reconstruit aux XVIIe ou XVIIIe siècles, puis transformé en minoterie au XIXe siècle. Le Moulin de Colagne indique exploiter aujourd’hui onze meules et quatre systèmes SODER, aux côtés d’équipements contemporains de suivi de production.";

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function expectSquare(locator: Locator, expectedSize: number, tolerance: number) {
  const box = await locator.boundingBox();

  expect(box).not.toBeNull();
  expect(Math.abs((box?.width ?? 0) - expectedSize)).toBeLessThanOrEqual(tolerance);
  expect(Math.abs((box?.height ?? 0) - expectedSize)).toBeLessThanOrEqual(tolerance);
  expect(Math.abs((box?.width ?? 0) - (box?.height ?? 0))).toBeLessThanOrEqual(1);
}

test.describe("T18 — section éditoriale Moulin de Colagne", () => {
  test.skip(
    ({ isMobile }) => isMobile,
    "La matrice T18 pilote explicitement les trois viewports depuis Chromium desktop.",
  );

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(flourPath);
  });

  test("rend uniquement la copie candidate Pauline exacte, sans CTA ni promesse ajoutée", async ({
    page,
  }) => {
    const section = page.getByTestId("moulin-de-colagne-section");

    await expect(section).toHaveAttribute("data-content-version", "pauline-d0d6179-v1");
    await expect(
      section.getByRole("heading", { level: 2, name: "Moulin de Colagne", exact: true }),
    ).toHaveText("Moulin de Colagne");
    await expect(
      section.getByText("Des traces documentaires dès le XIIIe siècle", { exact: true }),
    ).toHaveText("Des traces documentaires dès le XIIIe siècle");
    await expect(page.getByTestId("moulin-de-colagne-body")).toHaveText(expectedBody);

    await expect(section.locator("a, button, [disabled], [aria-disabled='true']")).toHaveCount(0);
    await expect(section.getByText(/en savoir plus/i)).toHaveCount(0);

    const renderedText = ((await section.textContent()) ?? "").toLocaleLowerCase("fr");
    for (const prohibitedClaim of [
      "8 siècles",
      "santé",
      "partenaire",
      "fournisseur",
      "origine de nos farines",
      "nos farines du moulin",
      "authentique",
      "naturel",
      "d’exception",
      "de génération en génération",
    ]) {
      expect(renderedText).not.toContain(prohibitedClaim.toLocaleLowerCase("fr"));
    }
  });

  test("utilise le média Figma composé local avec l’alternative éditoriale prudente", async ({
    page,
  }) => {
    const section = page.getByTestId("moulin-de-colagne-section");
    const image = section.getByRole("img", {
      name: "Une personne devant des équipements de mouture.",
      exact: true,
    });

    await expect(image).toHaveCount(1);
    await expect(image).toHaveAttribute("loading", "lazy");

    const imageState = await image.evaluate((element: HTMLImageElement) => {
      const style = window.getComputedStyle(element);
      return {
        complete: element.complete,
        naturalWidth: element.naturalWidth,
        objectFit: style.objectFit,
        objectPosition: style.objectPosition,
        src: element.currentSrc,
      };
    });

    expect(imageState.complete).toBe(true);
    expect(imageState.naturalWidth).toBeGreaterThan(0);
    expect(imageState.objectFit).toBe("cover");
    expect(imageState.objectPosition).toBe("50% 50%");
    expect(imageState.src).toContain("moulin-de-colagne.png");
    expect(imageState.src).not.toContain("figma.com");
    expect(imageState.src).not.toContain("/api/mcp/asset/");
  });

  test("suit l’ordre grille, T17, T18 puis footer avec une structure sémantique autonome", async ({
    page,
  }) => {
    const order = await page.evaluate(() => {
      const grid = document.querySelector('[data-testid="farines-product-grid"]');
      const guide = document.querySelector('[data-testid="flour-classification-guide"]');
      const section = document.querySelector('[data-testid="moulin-de-colagne-section"]');
      const footer = document.querySelector("footer");
      const follows = (before: Element | null, after: Element | null) =>
        Boolean(
          before &&
            after &&
            before.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING,
        );

      return {
        gridBeforeGuide: follows(grid, guide),
        guideBeforeSection: follows(guide, section),
        sectionBeforeFooter: follows(section, footer),
      };
    });

    expect(order).toEqual({
      gridBeforeGuide: true,
      guideBeforeSection: true,
      sectionBeforeFooter: true,
    });

    const section = page.getByTestId("moulin-de-colagne-section");
    await expect(section).toHaveAttribute("aria-labelledby", "moulin-de-colagne-heading");
    await expect(section.locator("#moulin-de-colagne-heading")).toHaveCount(1);
  });

  for (const target of [
    {
      name: "desktop",
      width: 1440,
      height: 900,
      gutter: 34,
      outerGap: 56,
      mediaSize: 674,
      columns: 2,
      columnWidth: "674px",
      columnGap: "24px",
      titleSize: "80px",
      titleLineHeight: "81px",
    },
    {
      name: "tablette",
      width: 768,
      height: 1024,
      gutter: 24,
      outerGap: 48,
      mediaSize: 720,
      columns: 1,
      columnWidth: "720px",
      columnGap: "normal",
      titleSize: "56px",
      titleLineHeight: "57px",
    },
    {
      name: "mobile",
      width: 390,
      height: 844,
      gutter: 16,
      outerGap: 40,
      mediaSize: 358,
      columns: 1,
      columnWidth: "358px",
      columnGap: "normal",
      titleSize: "44px",
      titleLineHeight: "44px",
    },
  ]) {
    test(`respecte la géométrie ${target.name} sans débordement`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: target.width, height: target.height });
      await page.goto(flourPath);

      const layout = page.getByTestId("moulin-de-colagne-layout");
      const media = page.getByTestId("moulin-de-colagne-media");
      const guideBox = await page.getByTestId("flour-classification-guide").boundingBox();
      const layoutBox = await layout.boundingBox();
      const mediaBox = await media.boundingBox();
      const footerBox = await page.locator("footer").boundingBox();
      const heading = page.getByRole("heading", { level: 2, name: "Moulin de Colagne" });
      const headingBox = await heading.boundingBox();
      const bodyBox = await page.getByTestId("moulin-de-colagne-body").boundingBox();
      const headingStyle = await heading.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          textTransform: style.textTransform,
        };
      });
      const gridStyle = await layout.evaluate((element) => {
        const style = window.getComputedStyle(element);
        const columns = style.gridTemplateColumns.split(" ").filter(Boolean);
        return {
          columnCount: columns.length,
          columnGap: style.columnGap,
          columns,
          paddingLeft: style.paddingLeft,
          paddingRight: style.paddingRight,
        };
      });

      expect(layoutBox).not.toBeNull();
      expect(mediaBox).not.toBeNull();
      if (target.columns === 1) {
        expect(Math.abs((mediaBox?.x ?? 0) - target.gutter)).toBeLessThanOrEqual(2);
      } else {
        expect(Math.abs((mediaBox?.x ?? 0) - 732)).toBeLessThanOrEqual(3);
      }
      expect(gridStyle.columnCount).toBe(target.columns);
      expect(gridStyle.columns).toEqual(Array(target.columns).fill(target.columnWidth));
      expect(gridStyle.columnGap).toBe(target.columnGap);
      expect(gridStyle.paddingLeft).toBe(`${target.gutter}px`);
      expect(gridStyle.paddingRight).toBe(`${target.gutter}px`);
      await expectSquare(media, target.mediaSize, 4);
      expect(
        Math.abs(
          (layoutBox?.y ?? 0) -
            ((guideBox?.y ?? 0) + (guideBox?.height ?? 0)) -
            target.outerGap,
        ),
      ).toBeLessThanOrEqual(4);
      expect(
        Math.abs(
          (footerBox?.y ?? 0) -
            ((mediaBox?.y ?? 0) + (mediaBox?.height ?? 0)) -
            target.outerGap,
        ),
      ).toBeLessThanOrEqual(4);
      expect(headingStyle).toEqual({
        fontSize: target.titleSize,
        fontWeight: "400",
        lineHeight: target.titleLineHeight,
        textTransform: "uppercase",
      });
      if (target.columns === 2) {
        expect(Math.abs((headingBox?.y ?? 0) - (mediaBox?.y ?? 0))).toBeLessThanOrEqual(3);
        expect(bodyBox?.width).toBeLessThanOrEqual(506);
        expect(
          Math.abs(
            ((bodyBox?.y ?? 0) + (bodyBox?.height ?? 0)) -
              ((mediaBox?.y ?? 0) + (mediaBox?.height ?? 0)),
          ),
        ).toBeLessThanOrEqual(3);
      } else {
        expect(bodyBox?.width).toBeLessThanOrEqual(560);
      }
      await expectNoHorizontalOverflow(page);

      await testInfo.attach(`moulin-colagne-${target.width}x${target.height}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
    });
  }

  test("n’ajoute aucune étape clavier et ne dépend d’aucun mouvement", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(flourPath);

    const section = page.getByTestId("moulin-de-colagne-section");
    const lastGuideLink = page
      .getByTestId("flour-classification-guide")
      .getByRole("link")
      .last();
    await lastGuideLink.focus();
    await page.keyboard.press("Tab");
    await expect(page.locator('footer input[type="email"]')).toBeFocused();

    const motion = await section.evaluate((element) => {
      const sectionStyle = window.getComputedStyle(element);
      const imageStyle = window.getComputedStyle(element.querySelector("img")!);
      return {
        imageAnimation: imageStyle.animationName,
        imageTransition: imageStyle.transitionDuration,
        sectionAnimation: sectionStyle.animationName,
        sectionTransition: sectionStyle.transitionDuration,
      };
    });
    expect(motion).toEqual({
      imageAnimation: "none",
      imageTransition: "0s",
      sectionAnimation: "none",
      sectionTransition: "0s",
    });
  });

  test("reste absent de /produits et de toute catégorie autre que le slug farines exact", async ({
    page,
  }) => {
    for (const path of ["/produits", "/produits?categorie=pains", "/produits?categorie=Farines"]) {
      await page.goto(path);
      await expect(page.getByTestId("moulin-de-colagne-section")).toHaveCount(0);
    }
  });
});
