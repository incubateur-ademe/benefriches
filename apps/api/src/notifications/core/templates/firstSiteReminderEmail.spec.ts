import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";

import { buildFirstSiteReminderEmail } from "./firstSiteReminderEmail";

const contact = {
  firstName: "Mathilde",
  lastName: "Lefèvre",
  role: "Chargée de déploiement",
  phone: "01 23 45 67 89",
  email: "mathilde.lefevre@example.com",
} satisfies LifecycleEmailContact;
const webappUrl = "http://localhost:3001";
const unsubscribeUrl = "http://localhost:3001/emails/desinscription?token=v1.x.y";

describe("buildFirstSiteReminderEmail", () => {
  it("has the subject from the mockup", () => {
    const result = buildFirstSiteReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    // Non-breaking space before "!".
    assert.strictEqual(result.subject, "Renseignez votre premier site sur Bénéfriches !");
  });

  it("previews that a few details are enough in the inbox", () => {
    const result = buildFirstSiteReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    const [, preheader] =
      /<div style="display:none;[^"]*">([^<]*?)(?:&zwnj;&nbsp;)*<\/div>/.exec(result.html) ?? [];
    // Non-breaking space before ":".
    assert.strictEqual(
      preheader,
      "Quelques informations suffisent : Bénéfriches complète les données manquantes.",
    );
  });

  it("renders the full plain-text alternative", () => {
    const result = buildFirstSiteReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.strictEqual(
      result.text,
      [
        "Bonjour Grégoire Bailleux,",
        "",
        "Vous avez récemment créé votre compte sur Bénéfriches. Vous pouvez maintenant renseigner un site (friche ou autre), pour ensuite y décrire votre projet d’aménagement avant de découvrir les impacts socio-économiques de ce projet sur votre site.",
        "",
        "Vous n’avez pas encore toutes les informations concernant ce site ? Pas de panique, Bénéfriches vous propose un maximum de données préremplies, basées sur des valeurs représentatives observées sur d’autres sites.",
        "",
        "Renseigner mon site : http://localhost:3001/creer-site-foncier",
        "",
        "Et si vous préférez un accompagnement pour prendre en main l’outil, n’hésitez pas à me contacter directement.",
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

  it("links the primary call to action to site creation on the configured web app", () => {
    const result = buildFirstSiteReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.match(
      result.html,
      /<a[^>]*href="http:\/\/localhost:3001\/creer-site-foncier"[^>]*>\s*Renseigner mon site\s*<\/a>/,
    );
  });

  it("links only the call to action, the contact and the unsubscribe page", () => {
    const result = buildFirstSiteReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.deepStrictEqual(
      [...result.html.matchAll(/href="([^"]*)"/g)].map((match) => match[1]),
      [
        "http://localhost:3001/creer-site-foncier",
        "mailto:mathilde.lefevre@example.com",
        "mailto:mathilde.lefevre@example.com",
        "http://localhost:3001/emails/desinscription?token=v1.x.y",
      ],
    );
  });

  it("opens a mail composer addressed to the configured contact", () => {
    const result = buildFirstSiteReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.match(
      result.html,
      /<a[^>]*href="mailto:mathilde\.lefevre@example\.com"[^>]*>\s*Contacter Mathilde de Bénéfriches\s*<\/a>/,
    );
    assert.strictEqual(
      result.html.split('href="mailto:mathilde.lefevre@example.com"').length - 1,
      2,
    );
  });

  it("contains no image", () => {
    const result = buildFirstSiteReminderEmail({
      firstName: "Grégoire",
      lastName: "Bailleux",
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.ok(!result.html.includes("<img"));
  });

  it("escapes the recipient's name in the HTML", () => {
    const result = buildFirstSiteReminderEmail({
      firstName: "Grégoire",
      lastName: "<script>",
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.ok(result.html.includes("Bonjour Grégoire &lt;script&gt;,"));
    assert.ok(!result.html.includes("<script>"));
  });

  it("greets without a name when the user has none", () => {
    const result = buildFirstSiteReminderEmail({
      firstName: null,
      lastName: null,
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.ok(result.text.startsWith("Bonjour,\n\n"));
  });

  it("greets with the first name alone when the last name is missing", () => {
    const result = buildFirstSiteReminderEmail({
      firstName: "Grégoire",
      lastName: null,
      contact,
      webappUrl,
      unsubscribeUrl,
    });

    assert.ok(result.text.startsWith("Bonjour Grégoire,\n\n"));
  });
});
