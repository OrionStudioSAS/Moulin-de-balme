import { expect, test, type Page, type TestInfo } from "@playwright/test";

type BrowserIssues = {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
};

function observeBrowserIssues(page: Page): BrowserIssues {
  const issues: BrowserIssues = { consoleErrors: [], pageErrors: [], failedRequests: [] };

  page.on("console", (message) => {
    if (message.type() === "error") issues.consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => issues.pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    issues.failedRequests.push(
      `${request.method()} ${request.url()} — ${request.failure()?.errorText ?? "unknown error"}`,
    );
  });

  return issues;
}

async function attachIssues(testInfo: TestInfo, issues: BrowserIssues) {
  await testInfo.attach("browser-issues.json", {
    body: Buffer.from(JSON.stringify(issues, null, 2)),
    contentType: "application/json",
  });
}

test.describe("site public — parcours non destructifs", () => {
  test("charge l'accueil sans erreur JavaScript critique", async ({ page }, testInfo) => {
    const issues = observeBrowserIssues(page);
    const response = await page.goto("/");

    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle(/Moulin de Balme/i);
    await expect(page.getByRole("main")).toBeVisible();

    await attachIssues(testInfo, issues);
    expect(issues.pageErrors, "Erreurs JavaScript non interceptées").toEqual([]);
    expect(issues.consoleErrors, "Erreurs console critiques").toEqual([]);
  });

  test("navigue vers les produits", async ({ page }) => {
    await page.goto("/");
    if (test.info().project.name.startsWith("mobile")) {
      await page.getByRole("button", { name: "Menu" }).click();
    }
    await page.getByRole("link", { name: "Nos produits", exact: true }).click();

    await expect(page).toHaveURL(/\/produits(?:\?.*)?$/, { timeout: 30_000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("navigue vers les recettes", async ({ page }) => {
    await page.goto("/");
    if (test.info().project.name.startsWith("mobile")) {
      await page.getByRole("button", { name: "Menu" }).click();
    }
    await page.getByRole("link", { name: "Nos recettes", exact: true }).click();

    await expect(page).toHaveURL(/\/recettes$/, { timeout: 30_000 });
    await expect(page.getByRole("heading", { level: 1, name: /Recettes/i })).toBeVisible();
  });

  test("ouvre et ferme le panier vide", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Mon panier \(0\)/ }).click();

    await expect(page.getByText("Votre panier est vide")).toBeVisible();
    await page.getByRole("button", { name: "Fermer" }).click();
    await expect(page.getByText("Votre panier est vide")).not.toBeInViewport();
  });

  test("effectue une recherche en lecture seule", async ({ page }, testInfo) => {
    test.skip(test.info().project.name.startsWith("mobile"), "La recherche n'est pas exposée dans le menu mobile actuel.");
    const issues = observeBrowserIssues(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Recherche" }).click();
    const search = page.getByRole("textbox", { name: "Rechercher un produit..." });

    await expect(search).toBeFocused();
    await search.fill("pain");
    await expect(page.getByText(/Recherche\.\.\.|Aucun résultat|€/).first()).toBeVisible();
    await page.getByRole("button", { name: "Fermer", exact: true }).first().click();

    await attachIssues(testInfo, issues);
    expect(issues.pageErrors, "Erreurs JavaScript non interceptées").toEqual([]);
  });

  test("les liens internes principaux répondent", async ({ page, request }) => {
    await page.goto("/");
    const paths = ["/", "/produits", "/recettes", "/la-maison", "/la-semaine", "/stephane-reinat"];

    for (const path of paths) {
      const response = await request.get(path);
      expect(response.status(), `${path} doit répondre sans erreur HTTP`).toBeLessThan(400);
    }
  });

  test("le CTA Click & Collect est visible sans être déclenché", async ({ page }) => {
    await page.goto("/");
    if (test.info().project.name.startsWith("mobile")) {
      await page.getByRole("button", { name: "Menu" }).click();
    }

    const cta = page.getByRole("link", { name: /Click & Collect|En savoir plus/ }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/click-and-collect");
    await expect(page).toHaveURL(/\/$/);
  });

  test("les principaux contrôles ont un nom accessible et restent au viewport", async ({ page }) => {
    await page.goto("/");
    const cart = page.getByRole("button", { name: /Mon panier/ });
    const menuOrSearch = test.info().project.name.startsWith("mobile")
      ? page.getByRole("button", { name: "Menu" })
      : page.getByRole("button", { name: "Recherche" });

    await expect(cart).toBeVisible();
    await expect(menuOrSearch).toBeVisible();
    await expect(cart).toBeInViewport();
    await expect(menuOrSearch).toBeInViewport();
    await expect(page.locator("h1")).toHaveCount(1);
  });
});
