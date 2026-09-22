import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { renderEmail } from "./emailLayout";

describe("renderEmail", () => {
  it("returns the subject unchanged", () => {
    const result = renderEmail({
      subject: "Bienvenue chez Bénéfriches",
      sections: [{ type: "heading", text: "Bienvenue chez Bénéfriches." }],
    });

    assert.strictEqual(result.subject, "Bienvenue chez Bénéfriches");
  });

  it("renders a table-based, single-column layout with no flexbox or grid", () => {
    const result = renderEmail({
      subject: "Test",
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
      sections: [
        { type: "heading", text: "Mon titre" },
        { type: "paragraph", html: "Mon <em>paragraphe</em>", text: "Mon paragraphe" },
        { type: "featureBlock", title: "Mon bloc", body: "Corps du bloc" },
        { type: "button", label: "Mon bouton", url: "https://example.fr/cta" },
      ],
    });

    assert.ok(result.html.includes("Mon titre"));
    assert.ok(result.html.includes("Mon <em>paragraphe</em>"));
    assert.ok(result.html.includes("Mon bloc"));
    assert.ok(result.html.includes("Corps du bloc"));
    assert.ok(result.html.includes("Mon bouton"));
    assert.ok(result.html.includes('href="https://example.fr/cta"'));
  });

  it("renders the button as a bgcolor table cell wrapping the link, for Outlook compatibility", () => {
    const result = renderEmail({
      subject: "Test",
      sections: [{ type: "button", label: "Go", url: "https://example.fr" }],
    });

    assert.ok(/<td[^>]*bgcolor="#161616"[^>]*>/.test(result.html));
    assert.ok(/<a[^>]*href="https:\/\/example\.fr"[^>]*>/.test(result.html));
  });

  it("produces a plain-text alternative alongside the HTML", () => {
    const result = renderEmail({
      subject: "Test",
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
      sections: [{ type: "featureBlock", title: "<script>alert(1)</script>", body: "corps" }],
    });

    assert.ok(!result.html.includes("<script>alert(1)</script>"));
    assert.ok(result.html.includes("&lt;script&gt;"));
  });
});
