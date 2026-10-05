import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { renderEmail } from "./emailLayout";

describe("renderEmail", () => {
  it("returns the subject unchanged", () => {
    const result = renderEmail({
      subject: "Bienvenue chez Bénéfriches",
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [{ type: "heading", text: "Bienvenue chez Bénéfriches." }],
    });

    assert.strictEqual(result.subject, "Bienvenue chez Bénéfriches");
  });

  it("renders the padded preheader in a hidden div between the opening body tag and the content table", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Votre compte est créé.",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [{ type: "heading", text: "Mon titre" }],
    });

    const expected = `<body style="margin:0;padding:0;background-color:#f6f6f6;font-family:Arial, Helvetica, sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Votre compte est créé.${"&zwnj;&nbsp;".repeat(100)}</div>
  <table role="presentation"`;
    assert.ok(result.html.includes(expected));
  });

  it("escapes the preheader but not its padding", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: '<b>Aperçu</b> & "co"',
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [{ type: "heading", text: "Mon titre" }],
    });

    assert.ok(
      result.html.includes(
        `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">&lt;b&gt;Aperçu&lt;/b&gt; &amp; &quot;co&quot;${"&zwnj;&nbsp;".repeat(100)}</div>`,
      ),
    );
    assert.ok(!result.html.includes("<b>Aperçu</b>"));
  });

  it("keeps the preheader out of the plain-text alternative", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [{ type: "heading", text: "Mon titre" }],
    });

    assert.strictEqual(
      result.text,
      "Mon titre\n\n---\nVous recevez cet e-mail car vous avez un compte Bénéfriches.\nPour ne plus recevoir les e-mails d’accompagnement et de résultats d’impacts (votre compte reste actif) :\nhttps://example.fr/emails/desinscription?token=t",
    );
  });

  it("renders a table-based, single-column layout with no flexbox or grid", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        { type: "heading", text: "Titre" },
        { type: "paragraph", html: "Un <b>paragraphe</b>", text: "Un paragraphe" },
        { type: "featureBlock", title: "Bloc 1", body: "Description du bloc 1" },
        { type: "button", label: "Cliquez ici", url: "https://example.fr/action" },
        {
          type: "card",
          headline: "En 26 ans",
          title: "Coût de l’opération compensé",
          body: "Corps de la carte",
          link: { label: "Voir l’analyse", url: "https://example.fr/analyse" },
        },
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
      preheader: "Texte d’aperçu",
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
        {
          type: "card",
          headline: "Ma carte",
          title: "Titre de la carte",
          body: "Corps de la carte",
          link: { label: "Lien de la carte", url: "https://example.fr/carte" },
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
    assert.ok(result.html.includes("Ma carte"));
    assert.ok(result.html.includes("Titre de la carte"));
    assert.ok(result.html.includes("Corps de la carte"));
    assert.ok(result.html.includes('href="https://example.fr/carte"'));
    assert.ok(result.html.includes("Lien de la carte"));
  });

  it("renders a secondary button as a light grey bgcolor cell wrapping the link", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
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
      preheader: "Texte d’aperçu",
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
      preheader: "Texte d’aperçu",
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
      preheader: "Texte d’aperçu",
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
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [{ type: "button", label: "Go", url: "https://example.fr" }],
    });

    assert.ok(/<td[^>]*bgcolor="#161616"[^>]*>/.test(result.html));
    assert.ok(/<a[^>]*href="https:\/\/example\.fr"[^>]*>/.test(result.html));
  });

  it("centres the button horizontally with align attributes, which Outlook honours", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [{ type: "button", label: "Go", url: "https://example.fr" }],
    });

    assert.ok(
      /<td align="center"[^>]*>\s*<table[^>]*align="center"[^>]*>\s*<tr>\s*<td[^>]*bgcolor="#161616"/.test(
        result.html,
      ),
    );
  });

  it("produces a plain-text alternative alongside the HTML", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
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
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [{ type: "featureBlock", title: "<script>alert(1)</script>", body: "corps" }],
    });

    assert.ok(!result.html.includes("<script>alert(1)</script>"));
    assert.ok(result.html.includes("&lt;script&gt;"));
  });

  it("renders an unsubscribe link in the HTML footer of every email", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
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
      preheader: "Texte d’aperçu",
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
      preheader: "Texte d’aperçu",
      unsubscribeUrl: 'https://example.fr/?a=1&b="x"',
      sections: [{ type: "heading", text: "Mon titre" }],
    });

    assert.ok(result.html.includes('href="https://example.fr/?a=1&amp;b=&quot;x&quot;"'));
  });

  it("renders a feature block without an icon as a title row and a body row, with no image", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [{ type: "featureBlock", title: "Mon bloc", body: "Corps du bloc" }],
    });

    const expected = `          <tr>
            <td style="padding:16px 24px 0 24px;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:bold;color:#161616;">
              Mon bloc
            </td>
          </tr>
          <tr>
            <td style="padding:4px 24px 16px 24px;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:1.5;color:#161616;">
              Corps du bloc
            </td>
          </tr>`;
    assert.ok(result.html.includes(expected));
    assert.ok(!result.html.includes("<img"));
  });

  it("renders a feature block with an icon as an icon cell and a title cell, then the body row", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        {
          type: "featureBlock",
          title: "Mon bloc",
          body: "Corps du bloc",
          iconUrl: "https://example.fr/img/emails/impacts-evaluation.png",
        },
      ],
    });

    const expected = `          <tr>
            <td style="padding:16px 24px 0 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="24" valign="middle" style="width:24px;padding:0 8px 0 0;vertical-align:middle;">
                    <img src="https://example.fr/img/emails/impacts-evaluation.png" width="24" height="24" alt="" border="0" style="display:block;width:24px;height:24px;border:0;outline:none;text-decoration:none;">
                  </td>
                  <td valign="middle" style="vertical-align:middle;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:bold;color:#161616;">
                    Mon bloc
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:4px 24px 16px 24px;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:1.5;color:#161616;">
              Corps du bloc
            </td>
          </tr>`;
    assert.ok(result.html.includes(expected));
    assert.deepStrictEqual(
      [...result.html.matchAll(/<img[^>]*>/g)].map(([tag]) => tag),
      [
        '<img src="https://example.fr/img/emails/impacts-evaluation.png" width="24" height="24" alt="" border="0" style="display:block;width:24px;height:24px;border:0;outline:none;text-decoration:none;">',
      ],
    );
  });

  it("leaves the plain-text feature block unchanged when an icon is given", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        {
          type: "featureBlock",
          title: "Mon bloc",
          body: "Corps du bloc",
          iconUrl: "https://example.fr/img/emails/impacts-evaluation.png",
        },
      ],
    });

    assert.strictEqual(
      result.text,
      [
        "Mon bloc\nCorps du bloc",
        "---\nVous recevez cet e-mail car vous avez un compte Bénéfriches.\nPour ne plus recevoir les e-mails d’accompagnement et de résultats d’impacts (votre compte reste actif) :\nhttps://example.fr/emails/desinscription?token=t",
      ].join("\n\n"),
    );
  });

  it("escapes the icon URL in the src attribute", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        {
          type: "featureBlock",
          title: "Mon bloc",
          body: "Corps du bloc",
          iconUrl: 'https://example.fr/a.png?x=1&y="z"',
        },
      ],
    });

    assert.ok(result.html.includes('src="https://example.fr/a.png?x=1&amp;y=&quot;z&quot;"'));
  });

  it("renders a card as a bordered table with its headline, title, body and link rows", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        {
          type: "card",
          headline: "En 26 ans",
          title: "Coût de l’opération compensé",
          body: "Les impacts socio-économiques compenseront le coût de l’opération en 2058.",
          link: {
            label: "Voir l’analyse coût-bénéfice",
            url: "https://app.example/mes-projets/p-1/analyse-cout-benefice",
          },
        },
      ],
    });

    const expected = `          <tr>
            <td style="padding:8px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dddddd;border-radius:8px;">
                <tr>
                  <td style="padding:16px 16px 4px 16px;font-family:Arial, Helvetica, sans-serif;font-size:24px;font-weight:bold;line-height:1.25;color:#161616;">
                    En 26 ans
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 16px 0 16px;font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:bold;line-height:1.5;color:#161616;">
                    Coût de l’opération compensé
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 16px 0 16px;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:1.5;color:#161616;">
                    Les impacts socio-économiques compenseront le coût de l’opération en 2058.
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px 16px 16px;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:1.5;">
                    <a href="https://app.example/mes-projets/p-1/analyse-cout-benefice" style="color:#000091;text-decoration:underline;">Voir l’analyse coût-bénéfice</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
    assert.ok(result.html.includes(expected));
  });

  it("renders a card without a title as headline, body and link rows only", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        {
          type: "card",
          headline: "Projet favorable au ZAN",
          body: "Le projet reconvertit un site en friche.",
          link: {
            label: "Voir le détail des impacts",
            url: "https://app.example/mes-projets/p-1/impacts",
          },
        },
      ],
    });

    const expected = `          <tr>
            <td style="padding:8px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dddddd;border-radius:8px;">
                <tr>
                  <td style="padding:16px 16px 4px 16px;font-family:Arial, Helvetica, sans-serif;font-size:24px;font-weight:bold;line-height:1.25;color:#161616;">
                    Projet favorable au ZAN
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 16px 0 16px;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:1.5;color:#161616;">
                    Le projet reconvertit un site en friche.
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px 16px 16px;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:1.5;">
                    <a href="https://app.example/mes-projets/p-1/impacts" style="color:#000091;text-decoration:underline;">Voir le détail des impacts</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
    assert.ok(result.html.includes(expected));
  });

  it("renders a card as plain-text lines ending with its link", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        {
          type: "card",
          headline: "En 26 ans",
          title: "Coût de l’opération compensé",
          body: "Les impacts socio-économiques compenseront le coût de l’opération en 2058.",
          link: {
            label: "Voir l’analyse coût-bénéfice",
            url: "https://app.example/mes-projets/p-1/analyse-cout-benefice",
          },
        },
      ],
    });

    assert.deepStrictEqual(
      result.text.split("\n\n")[0],
      "En 26 ans\nCoût de l’opération compensé\nLes impacts socio-économiques compenseront le coût de l’opération en 2058.\nVoir l’analyse coût-bénéfice : https://app.example/mes-projets/p-1/analyse-cout-benefice",
    );
  });

  it("escapes every card field and the link URL in the HTML", () => {
    const result = renderEmail({
      subject: "Test",
      preheader: "Texte d’aperçu",
      unsubscribeUrl: "https://example.fr/emails/desinscription?token=t",
      sections: [
        {
          type: "card",
          headline: "<b>Titre</b>",
          title: "A & B",
          body: `"Corps" 'cité'`,
          link: { label: "<i>Lien</i>", url: 'https://example.fr/?a=1&b="x"' },
        },
      ],
    });

    assert.ok(result.html.includes("&lt;b&gt;Titre&lt;/b&gt;"));
    assert.ok(!result.html.includes("<b>"));
    assert.ok(result.html.includes("A &amp; B"));
    assert.ok(result.html.includes("&quot;Corps&quot; &#39;cité&#39;"));
    assert.ok(result.html.includes("&lt;i&gt;Lien&lt;/i&gt;"));
    assert.ok(result.html.includes('href="https://example.fr/?a=1&amp;b=&quot;x&quot;"'));
  });
});
