import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { siteNatureSchema } from "shared";

import type { LifecycleEmailSite } from "src/notifications/core/gateways/LifecycleEmailSiteQuery";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";

import { buildFirstProjectReminderEmail } from "./firstProjectReminderEmail";

const contact = {
  firstName: "Mathilde",
  lastName: "Lefèvre",
  role: "Chargée de déploiement",
  phone: "01 23 45 67 89",
  email: "mathilde.lefevre@example.com",
} satisfies LifecycleEmailContact;
const webappUrl = "http://localhost:3001";
const unsubscribeUrl = "http://localhost:3001/emails/desinscription?token=v1.x.y";
const friche = {
  id: "site-friche-1",
  name: "Ancienne carrière d’argile de Blajan",
  nature: "FRICHE",
} satisfies LifecycleEmailSite;
const farm = {
  id: "site-farm-1",
  name: "Exploitation des Quatre Chemins",
  nature: "AGRICULTURAL_OPERATION",
} satisfies LifecycleEmailSite;

describe("buildFirstProjectReminderEmail", () => {
  it("names the site in the subject", () => {
    const result = buildFirstProjectReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      site: friche,
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    // Non-breaking spaces before ":" and "?".
    assert.strictEqual(
      result.subject,
      "Ancienne carrière d’argile de Blajan : et si vous renseigniez votre projet d’aménagement ?",
    );
  });

  it("renders the full plain-text alternative for a friche", () => {
    const result = buildFirstProjectReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      site: friche,
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.strictEqual(
      result.text,
      [
        "Bonjour Grégoire Bailleux,",
        "",
        "Hier vous avez renseigné une friche sur Bénéfriches. Vous pouvez maintenant décrire un projet d’aménagement sur cette friche, pour ensuite découvrir ses impacts socio-économiques.",
        "",
        "Vous n’avez pas encore toutes les informations concernant ce projet ? Pas de panique, Bénéfriches vous propose un maximum de données pré-remplies, basées sur des valeurs représentatives observées sur d’autres projets.",
        "",
        "Renseigner mon projet : http://localhost:3001/creer-projet?siteId=site-friche-1",
        "",
        "Et si vous préférez être accompagné dans la prise en main de l’outil, n’hésitez pas à me contacter directement.",
        "",
        "Contacter Mathilde de Bénéfriches : mailto:mathilde.lefevre@example.com",
        "",
        "Mathilde Lefèvre",
        "Chargée de déploiement",
        "Bénéfriches (Externe)",
        "01 23 45 67 89",
        "mathilde.lefevre@example.com",
        "",
        "---",
        "Vous recevez cet e-mail car vous avez un compte Bénéfriches.",
        "Pour ne plus recevoir les e-mails d’accompagnement et de résultats d’impacts (votre compte reste actif) :",
        "http://localhost:3001/emails/desinscription?token=v1.x.y",
      ].join("\n"),
    );
  });

  it("renders the full plain-text alternative for a non-friche site", () => {
    const result = buildFirstProjectReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      site: farm,
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.strictEqual(
      result.text,
      [
        "Bonjour Grégoire Bailleux,",
        "",
        "Hier vous avez renseigné un site sur Bénéfriches. Vous pouvez maintenant décrire un projet d’aménagement sur ce site, pour ensuite découvrir ses impacts socio-économiques.",
        "",
        "Vous n’avez pas encore toutes les informations concernant ce projet ? Pas de panique, Bénéfriches vous propose un maximum de données pré-remplies, basées sur des valeurs représentatives observées sur d’autres projets.",
        "",
        "Renseigner mon projet : http://localhost:3001/creer-projet?siteId=site-farm-1",
        "",
        "Et si vous préférez être accompagné dans la prise en main de l’outil, n’hésitez pas à me contacter directement.",
        "",
        "Contacter Mathilde de Bénéfriches : mailto:mathilde.lefevre@example.com",
        "",
        "Mathilde Lefèvre",
        "Chargée de déploiement",
        "Bénéfriches (Externe)",
        "01 23 45 67 89",
        "mathilde.lefevre@example.com",
        "",
        "---",
        "Vous recevez cet e-mail car vous avez un compte Bénéfriches.",
        "Pour ne plus recevoir les e-mails d’accompagnement et de résultats d’impacts (votre compte reste actif) :",
        "http://localhost:3001/emails/desinscription?token=v1.x.y",
      ].join("\n"),
    );
  });

  describe("uses the non-friche wording for every non-friche nature", () => {
    for (const nature of siteNatureSchema.options.filter((n) => n !== "FRICHE")) {
      it(`says "un site" for a ${nature} site`, () => {
        const result = buildFirstProjectReminderEmail({
          firstName: "Grégoire",
          lastName: "Bailleux",
          site: { ...farm, nature },
          contact,
          webappUrl,
          unsubscribeUrl,
        });

        assert.ok(result.text.includes("Hier vous avez renseigné un site sur Bénéfriches."));
        // Not bare "friche": "Bénéfriches" contains it.
        assert.ok(!result.text.includes("une friche"));
        assert.ok(!result.text.includes("cette friche"));
      });
    }
  });

  it("links the primary call to action to project creation for that site", () => {
    const result = buildFirstProjectReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      site: friche,
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.match(
      result.html,
      /<a[^>]*href="http:\/\/localhost:3001\/creer-projet\?siteId=site-friche-1"[^>]*>\s*Renseigner mon projet\s*<\/a>/,
    );
  });

  it("offers no compatibility evaluation, even for a friche", () => {
    const result = buildFirstProjectReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      site: friche,
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.ok(!result.html.includes("compatibilit"));
    assert.ok(!result.html.includes("evaluer-compatibilite-friche"));
  });

  it("puts the site name on one line in the subject", () => {
    const result = buildFirstProjectReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      site: { ...friche, name: "  Friche\nde   Blajan  " },
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.strictEqual(
      result.subject,
      "Friche de Blajan : et si vous renseigniez votre projet d’aménagement ?",
    );
  });

  it("escapes the site name in the HTML title", () => {
    const result = buildFirstProjectReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      site: { ...friche, name: "<script>Blajan</script>" },
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.ok(result.html.includes("&lt;script&gt;Blajan&lt;/script&gt;"));
    assert.ok(!result.html.includes("<script>Blajan"));
  });

  it("contains no image", () => {
    const result = buildFirstProjectReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      site: friche,
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.ok(!result.html.includes("<img"));
  });
});
