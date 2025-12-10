import { test, expect } from "@playwright/test";

import { USER_COLLECTIVITE_FILE } from "./storage";

test.use({ storageState: USER_COLLECTIVITE_FILE });

test.describe("Friche", () => {
  test.describe("Site creation", () => {
    test("Can create friche with express mode", async ({ page }) => {
      await page.goto("/mes-projets");

      await page.getByRole("heading", { name: "Mes projets" }).isVisible();
      await page.getByRole("link", { name: "Nouveau site" }).click();

      await expect(page.getByRole("heading", { name: "Tout commence sur un site." })).toBeVisible();
      await page.getByRole("button", { name: "Commencer" }).click();
      await page.getByText("Express").first().click();
      await page.getByRole("button", { name: "Valider" }).click();
      await page.getByText("Oui").click();
      await page.getByRole("button", { name: "Valider" }).click();
      await page.getByLabel("Commune ou code postal *").fill("blajan");
      await page.getByText("Blajan (31350)").click();
      await page.getByRole("button", { name: "Valider" }).click();
      await page.getByLabel("Superficie totale").fill("30000");
      await page.getByLabel("Superficie totale").blur();
      await expect(page.getByText("Soit 3 ha.")).toBeVisible();
      await page.getByRole("button", { name: "Suivant" }).click();
      await expect(
        page.getByRole("heading", {
          name: "Le site « Friche de Blajan » est créé !",
        }),
      ).toBeVisible();
      await page.getByRole("link", { name: "Renseigner mon projet sur ce site" }).click();
    });

    test("Can create friche with custom mode", async ({ page }) => {
      test.slow();
      await page.goto("/mes-projets");
      await page.getByRole("link", { name: "Nouveau site" }).click();
      await page.getByRole("button", { name: "Commencer" }).click();
      // Mode de cration
      await page.getByText("Mode personnalisé").click();
      await page.getByRole("button", { name: "Valider" }).click();
      // Friche ?
      await page.getByText("Oui").click();
      await page.getByRole("button", { name: "Valider" }).click();
      // Type de friche
      await page.getByText("Friche industrielle").click();
      await page.getByRole("button", { name: "Valider" }).click();
      // Adresse
      await page.getByLabel("Adresse du site").fill("Montlucon");
      await page.getByText("Montluçon", { exact: true }).click();
      await page.getByRole("button", { name: "Valider" }).click();
      // Sols
      await page.getByRole("button", { name: "Suivant" }).click();
      // Superficie
      await page.getByLabel("Superficie totale").fill("36000");
      await expect(page.getByText("💡 Soit 3,6 ha.")).toBeVisible();
      await page.getByRole("button", { name: "Valider" }).click();
      // Sélection des sols
      await page.getByRole("checkbox", { name: "Bâtiments" }).first().click();
      await page.getByRole("checkbox", { name: "Sols imperméabilisés" }).first().click();
      await page.getByRole("checkbox", { name: "Sols perméables minéraux" }).first().click();
      await page.getByRole("checkbox", { name: "Sols enherbés et arbustifs" }).first().click();
      await page.getByRole("checkbox", { name: "Prairie herbacée" }).first().click();
      await page.getByRole("checkbox", { name: "Plan d'eau" }).first().click();
      await page.getByRole("button", { name: "Valider" }).click();
      // Précision superficies
      await page.getByText("Oui, je connais précisément les superficies").click();
      await page.getByRole("button", { name: "Valider" }).click();
      // Superficie des sols
      await page.getByLabel("Bâtiments").fill("3600");
      await page.getByLabel("Sols imperméabilisés").fill("5400");
      await page.getByLabel("Sols perméables minéraux").fill("6000");
      await page.getByLabel("Sols enherbés et arbustifs").fill("10000");
      await page.getByLabel("Prairie herbacée").fill("9000");
      await page.getByLabel("Plan d'eau").fill("2000");
      await page.getByRole("button", { name: "Valider" }).click();

      // Récapitulatif sols
      await expect(page.getByText("Récapitulatif de la répartition des sols")).toBeVisible();
      await expect(
        page.getByText("Superficie totale du site : 36 000 ㎡, soit 3,6 ha"),
      ).toBeVisible();
      await page.getByRole("button", { name: "Suivant" }).click();
      // Stockage carbone par les sols
      await expect(page.getByText("Ce site stocke environ 183 t")).toBeVisible();
      await expect(
        page.getByText("C'est l'équivalent de ce qu'émettent 73 français en 1 an"),
      ).toBeVisible();
      await page.getByRole("button", { name: "Suivant" }).click();

      // pollution
      await page.getByRole("button", { name: "Suivant" }).click();
      await page.getByText("Oui").click();
      await page.getByLabel("Superficie polluée").fill("20000");
      await page.getByRole("button", { name: "Valider" }).click();
      // accidents
      await page.getByRole("button", { name: "Suivant" }).click();
      await page.getByText("Non / Ne sait pas").click();
      await page.getByRole("button", { name: "Valider" }).click();
      // acteurs
      await page.getByRole("button", { name: "Suivant" }).click();
      // propriétaire
      await page.getByText("Une autre collectivité").click();
      await page.getByLabel("Type de collectivité").selectOption("municipality");
      await page.getByRole("button", { name: "Valider" }).click();
      // locataire
      await page.getByText("Non / Ne sait pas").click();
      await page.getByRole("button", { name: "Valider" }).click();
      // dépenses
      await page.getByRole("button", { name: "Valider" }).click();
      await expect(page.getByRole("heading", { name: "Récapitulatif des dépenses" })).toBeVisible();
      await page.getByRole("button", { name: "Suivant" }).click();
      // identité du site
      await page.getByRole("button", { name: "Suivant" }).click();
      await expect(page.getByRole("heading", { name: "Dénomination du site" })).toBeVisible();
      await page.getByRole("button", { name: "Valider" }).click();
      // récapitulatif
      await expect(page.getByRole("heading", { name: "Récapitulatif du site" })).toBeVisible();
      await page.getByRole("button", { name: "Suivant" }).click();
      await expect(
        page.getByRole("heading", {
          name: "Le site « Friche industrielle de Montluçon » est créé",
        }),
      ).toBeVisible();
      await page.getByRole("link", { name: "Renseigner mon projet sur ce site" }).click();
      await expect(
        page.getByRole("heading", {
          name: "Vous avez un projet d'aménagement",
        }),
      ).toBeVisible();
    });
  });

  test.describe("Urban project creation", () => {
    test("Can create urban project 'Centralité urbaine' with express mode", async ({ page }) => {
      await page.goto("/mes-projets");

      const touristGuide = await page.getByRole("button", {
        name: "Quitter le tutoriel",
      });
      const isTouristGuideOpen = await touristGuide.isVisible();
      if (isTouristGuideOpen) {
        touristGuide.click();
      }
      await page.getByRole("link", { name: "Nouveau scénario" }).click();

      // parcours création express
      await expect(
        page.getByRole("heading", {
          name: "Vous avez un projet d'aménagement",
        }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Commencer" }).click();
      await page.getByText("Projet urbain").click();
      await page.getByRole("button", { name: "Valider" }).click();
      await page.getByText("Express").click();
      await page.getByRole("button", { name: "Valider" }).click();
      await page.getByText("Centralité urbaine").click();
      await page.getByRole("button", { name: "Valider" }).click();
      await expect(
        page.getByRole("heading", {
          name: 'Le projet "Centralité urbaine" est créé !',
        }),
      ).toBeVisible();
      await page.getByRole("link", { name: "Consulter les impacts" }).click();
      await expect(page.getByRole("heading", { name: "Félicitations ! 🎉 Votre" })).toBeVisible();
      await page.getByRole("button", { name: "Suivant (1/3)" }).click();
      await page.getByRole("button", { name: "Suivant (2/3)" }).click();
      await page.getByRole("button", { name: "Consulter les impacts" }).click();

      // page impacts
      await page.getByText("Graphique").click();
      await expect(page.getByRole("heading", { name: "Analyse coûts/bénéfices" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Bilan de l'opération" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Impacts socio-économiques" })).toBeVisible();
    });
  });
});
