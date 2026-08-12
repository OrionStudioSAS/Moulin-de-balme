import { test } from "@playwright/test";

const T15_REASON =
  "T15 — la section « Ces produits pourraient vous plaire » n'est pas encore présente sur cette branche.";

test.describe.skip(T15_REASON, () => {
  test("affiche la section dans un panier non vide", async () => {});
  test("limite les suggestions à trois produits", async () => {});
  test("exclut le produit déjà présent dans le panier", async () => {});
  test("ajoute une suggestion et met à jour le total", async () => {});
  test("maintient le tiroir ouvert après l'ajout", async () => {});
  test("permet la navigation et l'activation au clavier", async () => {});
  test("reste utilisable dans le viewport mobile", async () => {});
});
