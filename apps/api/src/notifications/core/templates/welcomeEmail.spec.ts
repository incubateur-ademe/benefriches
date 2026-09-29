import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildWelcomeEmail } from "./welcomeEmail";

describe("buildWelcomeEmail", () => {
  it("has the exact subject transcribed from the mockup", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.strictEqual(result.subject, "Bienvenue chez Bénéfriches");
  });

  it("contains the heading and intro paragraphs verbatim", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.ok(result.html.includes("Bienvenue chez Bénéfriches."));
    assert.ok(
      result.html.includes(
        "Avec Bénéfriches, réalisez l’évaluation socio-économiques de votre projet d’aménagement.",
      ),
    );
    assert.ok(result.html.includes("Renseignez votre site puis votre projet, et découvrez :"));
  });

  it("contains all three feature block titles and bodies verbatim", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.ok(result.html.includes("Votre évaluation des impacts"));
    assert.ok(
      result.html.includes(
        "Sur plusieurs indicateur clé : recettes fiscales, cadre de vie des riverains, emploi, émissions de CO2, perméabilité des sols…",
      ),
    );
    assert.ok(result.html.includes("Votre analyse coût-bénéfice"));
    assert.ok(
      result.html.includes(
        "Pour voir si les impacts socio-économiques compenseront le coût de l’opération et, si oui, en quelle année.",
      ),
    );
    assert.ok(result.html.includes("Votre analyse des coûts évités"));
    assert.ok(
      result.html.includes(
        "Pour comprendre ce que coûte la friche tant qu’elle n’est pas reconvertie, ou ce que coûterait le projet s’il se faisait en extension urbaine.",
      ),
    );
  });

  it("contains the recipient's own email address as their login identifier", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.ok(result.html.includes("Votre identifiant de connexion est"));
    assert.ok(result.html.includes("nomprenom@mail.fr"));
  });

  it("does not render the login identifier as a mailto link", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.ok(!result.html.includes("mailto:nomprenom@mail.fr"));
  });

  it("builds the call-to-action URL from the configured webapp URL, not a hardcoded domain", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.ok(result.html.includes('href="http://localhost:3001/creer-site-foncier"'));
    assert.ok(!result.html.includes("benefriches.fr"));
    assert.ok(!result.html.includes("benefriches.ademe"));
  });

  it("has a call-to-action button with the exact label", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.ok(result.html.includes("Commencer l’évaluation socio-économique"));
  });

  it("is text-only for the three feature blocks — no images", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.ok(!result.html.includes("<img"));
  });

  it("has no flexbox or grid layout, staying Outlook-safe", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.ok(!/display\s*:\s*flex/i.test(result.html));
    assert.ok(!/display\s*:\s*grid/i.test(result.html));
    assert.ok(!/flex-[a-z]+\s*:/i.test(result.html));
    assert.ok(result.html.includes("<table"));
  });

  it("produces a non-empty plain-text alternative containing the heading, identifier, block titles and CTA URL", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.ok(result.text.length > 0);
    assert.ok(result.text.includes("Bienvenue chez Bénéfriches."));
    assert.ok(result.text.includes("nomprenom@mail.fr"));
    assert.ok(result.text.includes("Votre évaluation des impacts"));
    assert.ok(result.text.includes("Votre analyse coût-bénéfice"));
    assert.ok(result.text.includes("Votre analyse des coûts évités"));
    assert.ok(result.text.includes("http://localhost:3001/creer-site-foncier"));
  });

  it("escapes an email address containing HTML-special characters in the HTML output", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "a<b>@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.ok(!result.html.includes("a<b>@mail.fr"));
    assert.ok(result.html.includes("a&lt;b&gt;@mail.fr"));
  });

  it("carries the unsubscribe link it was given", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.ok(
      result.html.includes('href="http://localhost:3001/emails/desinscription?token=v1.x.y"'),
    );
    assert.ok(result.text.includes("http://localhost:3001/emails/desinscription?token=v1.x.y"));
  });
});
