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

  it("previews the account creation and the first evaluation in the inbox", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    const [, preheader] =
      /<div style="display:none;[^"]*">([^<]*?)(?:&zwnj;&nbsp;)*<\/div>/.exec(result.html) ?? [];
    assert.strictEqual(
      preheader,
      "Votre compte est créé. Voici comment réaliser votre première évaluation.",
    );
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
        "Avec Bénéfriches, réalisez l’évaluation socio-économique de votre projet d’aménagement.",
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
        "Sur plusieurs indicateurs clés : recettes fiscales, cadre de vie des riverains, emploi, émissions de CO2, perméabilité des sols…",
      ),
    );
    assert.ok(result.html.includes("Votre analyse coût-bénéfices"));
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

  it("shows the three feature block icons, in order, from the configured webapp URL", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    const srcs = [...result.html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map(([, src]) => src);
    assert.deepStrictEqual(srcs, [
      "http://localhost:3001/img/emails/impacts-evaluation.png",
      "http://localhost:3001/img/emails/cost-benefit-analysis.png",
      "http://localhost:3001/img/emails/avoided-costs-analysis.png",
    ]);
  });

  it("builds the icon URLs without a double slash when the webapp URL ends with a slash", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "https://staging.example.fr/",
      unsubscribeUrl: "https://staging.example.fr/emails/desinscription?token=v1.x.y",
    });

    const srcs = [...result.html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map(([, src]) => src);
    assert.deepStrictEqual(srcs, [
      "https://staging.example.fr/img/emails/impacts-evaluation.png",
      "https://staging.example.fr/img/emails/cost-benefit-analysis.png",
      "https://staging.example.fr/img/emails/avoided-costs-analysis.png",
    ]);
  });

  it("produces the full plain-text alternative, without the icons", () => {
    const result = buildWelcomeEmail({
      recipientEmail: "nomprenom@mail.fr",
      webappUrl: "http://localhost:3001",
      unsubscribeUrl: "http://localhost:3001/emails/desinscription?token=v1.x.y",
    });

    assert.strictEqual(
      result.text,
      [
        "Bienvenue chez Bénéfriches.",
        "Votre identifiant de connexion est nomprenom@mail.fr",
        "Avec Bénéfriches, réalisez l’évaluation socio-économique de votre projet d’aménagement.",
        "Renseignez votre site puis votre projet, et découvrez :",
        "Votre évaluation des impacts\nSur plusieurs indicateurs clés : recettes fiscales, cadre de vie des riverains, emploi, émissions de CO2, perméabilité des sols…",
        "Votre analyse coût-bénéfices\nPour voir si les impacts socio-économiques compenseront le coût de l’opération et, si oui, en quelle année.",
        "Votre analyse des coûts évités\nPour comprendre ce que coûte la friche tant qu’elle n’est pas reconvertie, ou ce que coûterait le projet s’il se faisait en extension urbaine.",
        "Commencer l’évaluation socio-économique : http://localhost:3001/creer-site-foncier",
        "---\nVous recevez cet e-mail car vous avez un compte Bénéfriches.\nPour ne plus recevoir les e-mails d’accompagnement et de résultats d’impacts (votre compte reste actif) :\nhttp://localhost:3001/emails/desinscription?token=v1.x.y",
      ].join("\n\n"),
    );
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
