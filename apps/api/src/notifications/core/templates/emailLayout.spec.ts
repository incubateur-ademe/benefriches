import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { renderEmail } from "./emailLayout";

describe("renderEmail", () => {
  it("returns the subject unchanged", () => {
    const result = renderEmail({
      subject: "Bienvenue chez Bénéfriches",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [{ type: "heading", text: "Bienvenue chez Bénéfriches." }],
    });

    assert.strictEqual(result.subject, "Bienvenue chez Bénéfriches");
  });

  it("renders a table-based, single-column layout with no flexbox or grid", () => {
    const result = renderEmail({
      subject: "Test",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        { type: "heading", text: "Titre" },
        { type: "paragraph", html: "Un <b>paragraphe</b>", text: "Un paragraphe" },
        { type: "featureBlock", title: "Bloc 1", body: "Description du bloc 1" },
        { type: "button", label: "Cliquez ici", url: "https://example.fr/action" },
      ],
    });

    assert.ok(result.html.includes("<table"));
    assert.ok(!result.html.includes("<img"));
    assert.ok(!/display\s*:\s*flex/i.test(result.html));
    assert.ok(!/display\s*:\s*grid/i.test(result.html));
    assert.ok(!/flex-[a-z]+\s*:/i.test(result.html));
  });

  it("renders every section type into the HTML output", () => {
    const result = renderEmail({
      subject: "Test",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        { type: "heading", text: "Mon titre" },
        { type: "paragraph", html: "Mon <em>paragraphe</em>", text: "Mon paragraphe" },
        { type: "featureBlock", title: "Mon bloc", body: "Corps du bloc" },
        { type: "button", label: "Mon bouton", url: "https://example.fr/cta" },
        {
          type: "button",
          variant: "secondary",
          label: "Mon bouton secondaire",
          url: "mailto:contact@example.fr",
        },
        {
          type: "contactSignature",
          name: "Mathilde Lefèvre",
          role: "Chargée de déploiement",
          organisation: "Bénéfriches (Externe)",
          phone: "01 23 45 67 89",
          email: "mathilde.lefevre@example.com",
        },
      ],
    });

    assert.ok(result.html.includes("Mon titre"));
    assert.ok(result.html.includes("Mon <em>paragraphe</em>"));
    assert.ok(result.html.includes("Mon bloc"));
    assert.ok(result.html.includes("Corps du bloc"));
    assert.ok(result.html.includes("Mon bouton"));
    assert.ok(result.html.includes('href="https://example.fr/cta"'));
    assert.ok(result.html.includes("Mon bouton secondaire"));
    assert.ok(result.html.includes('href="mailto:contact@example.fr"'));
    assert.ok(result.html.includes("Mathilde Lefèvre"));
    assert.ok(result.html.includes("01 23 45 67 89"));
  });

  it("renders a secondary button as a light grey bgcolor cell wrapping the link", () => {
    const result = renderEmail({
      subject: "Test",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        {
          type: "button",
          variant: "secondary",
          label: "Contacter Mathilde de Bénéfriches",
          url: "mailto:mathilde.lefevre@example.com",
        },
      ],
    });

    assert.ok(/<td[^>]*bgcolor="#dddddd"[^>]*>/.test(result.html));
    assert.ok(!result.html.includes('bgcolor="#161616"'));
    assert.ok(/<a[^>]*href="mailto:mathilde\.lefevre@example\.com"[^>]*>/.test(result.html));
  });

  it("renders the contact signature with no image and the email as its only link", () => {
    const result = renderEmail({
      subject: "Test",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        {
          type: "contactSignature",
          name: "Mathilde Lefèvre",
          role: "Chargée de déploiement",
          organisation: "Bénéfriches (Externe)",
          phone: "01 23 45 67 89",
          email: "mathilde.lefevre@example.com",
        },
      ],
    });

    assert.ok(!result.html.includes("<img"));
    assert.deepStrictEqual(
      [...result.html.matchAll(/href="([^"]*)"/g)].map((match) => match[1]),
      ["mailto:mathilde.lefevre@example.com", "https://example.fr/emails/desinscription?token=t"],
    );
    assert.ok(result.html.includes("Bénéfriches (Externe)<br>"));
    assert.ok(result.html.includes("Chargée de déploiement"));
    assert.ok(result.html.includes("01 23 45 67 89"));
  });

  it("renders the contact signature as five plain-text lines", () => {
    const result = renderEmail({
      subject: "Test",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        {
          type: "contactSignature",
          name: "Mathilde Lefèvre",
          role: "Chargée de déploiement",
          organisation: "Bénéfriches (Externe)",
          phone: "01 23 45 67 89",
          email: "mathilde.lefevre@example.com",
        },
      ],
    });

    assert.ok(
      result.text.startsWith(
        "Mathilde Lefèvre\nChargée de déploiement\nBénéfriches (Externe)\n01 23 45 67 89\nmathilde.lefevre@example.com\n\n",
      ),
    );
  });

  it("escapes every contact signature field in the HTML", () => {
    const result = renderEmail({
      subject: "Test",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        {
          type: "contactSignature",
          name: "<i>Mathilde</i>",
          role: "<b>Chef</b>",
          organisation: "<u>Bénéfriches</u> (Externe)",
          phone: "<em>01</em>",
          email: '"x"@example.com',
        },
      ],
    });

    assert.ok(result.html.includes("&lt;i&gt;Mathilde&lt;/i&gt;"));
    assert.ok(result.html.includes("&lt;b&gt;Chef&lt;/b&gt;"));
    assert.ok(!result.html.includes("<b>Chef</b>"));
    assert.ok(result.html.includes("&lt;u&gt;Bénéfriches&lt;/u&gt; (Externe)"));
    assert.ok(result.html.includes("&lt;em&gt;01&lt;/em&gt;"));
    assert.ok(result.html.includes('href="mailto:&quot;x&quot;@example.com"'));
  });

  it("renders the button as a bgcolor table cell wrapping the link, for Outlook compatibility", () => {
    const result = renderEmail({
      subject: "Test",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [{ type: "button", label: "Go", url: "https://example.fr" }],
    });

    assert.ok(/<td[^>]*bgcolor="#161616"[^>]*>/.test(result.html));
    assert.ok(/<a[^>]*href="https:\/\/example\.fr"[^>]*>/.test(result.html));
  });

  it("produces a plain-text alternative alongside the HTML", () => {
    const result = renderEmail({
      subject: "Test",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        { type: "heading", text: "Mon titre" },
        { type: "paragraph", html: "Mon <em>paragraphe</em>", text: "Mon paragraphe" },
        { type: "featureBlock", title: "Mon bloc", body: "Corps du bloc" },
        { type: "button", label: "Mon bouton", url: "https://example.fr/cta" },
      ],
    });

    assert.ok(result.text.includes("Mon titre"));
    assert.ok(result.text.includes("Mon paragraphe"));
    assert.ok(!result.text.includes("<em>"));
    assert.ok(result.text.includes("Mon bloc"));
    assert.ok(result.text.includes("Corps du bloc"));
    assert.ok(result.text.includes("Mon bouton"));
    assert.ok(result.text.includes("https://example.fr/cta"));
  });

  it("escapes HTML-special characters in a paragraph's text-only rendering path via escapeHtml", () => {
    const result = renderEmail({
      subject: "Test",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [{ type: "featureBlock", title: "<script>alert(1)</script>", body: "corps" }],
    });

    assert.ok(!result.html.includes("<script>alert(1)</script>"));
    assert.ok(result.html.includes("&lt;script&gt;"));
  });

  it("renders an unsubscribe link in the HTML footer of every email", () => {
    const result = renderEmail({
      subject: "Test",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=v1.a.b",
      sections: [{ type: "heading", text: "Mon titre" }],
    });

    assert.match(
      result.html,
      /<a[^>]*href="https:\/\/example\.fr\/emails\/desinscription\?token=v1\.a\.b"[^>]*>vous désinscrire<\/a>/,
    );
    const footerIndex = result.html.indexOf(
      "Vous recevez cet e-mail car vous avez un compte Bénéfriches.",
    );
    assert.ok(footerIndex > result.html.indexOf("Mon titre"));
    assert.ok(
      result.html.includes(
        "des e-mails d’accompagnement et de résultats d’impacts : votre compte reste actif.",
      ),
    );
  });

  it("puts the unsubscribe URL and wording in the plain-text alternative", () => {
    const result = renderEmail({
      subject: "Test",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=v1.a.b",
      sections: [{ type: "heading", text: "Mon titre" }],
    });

    assert.ok(
      result.text.endsWith(
        "---\n" +
          "Vous recevez cet e-mail car vous avez un compte Bénéfriches.\n" +
          "Pour ne plus recevoir les e-mails d’accompagnement et de résultats d’impacts (votre compte reste actif) :\n" +
          "https://example.fr/emails/desinscription?token=v1.a.b",
      ),
    );
  });

  it("escapes the unsubscribe URL in the href", () => {
    const result = renderEmail({
      subject: "Test",
      unsubscribeUrl: 'https://example.fr/?a=1&b="x"',
      sections: [{ type: "heading", text: "Mon titre" }],
    });

    assert.ok(result.html.includes('href="https://example.fr/?a=1&amp;b=&quot;x&quot;"'));
  });
});
