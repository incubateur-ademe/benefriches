// Shared layout helper for lifecycle emails. The audience is collectivités and
// ADEME-adjacent structures, so Outlook is the constraint that matters:
// table-based single-column layout, inline styles only, no flexbox or grid.
// No images, with a single exception: the optional decorative icon of a featureBlock
// (iconUrl), an absolute PNG URL with explicit size and empty alt, so the email reads fine
// with images blocked.
// Sections: heading, paragraph, featureBlock, button, contactSignature, and card (a bordered
// block with a headline, an optional title, a body and a text link: the project impacts
// summary's headline findings).
// Every email opens with a hidden, padded preheader: the inbox preview text after the subject.
// Every email produced here ships a plain-text alternative alongside the HTML —
// renderEmail always returns both, so it is structurally impossible to ship
// HTML without a text fallback.

export type EmailSection =
  | { type: "heading"; text: string }
  | { type: "paragraph"; html: string; text: string }
  | {
      type: "featureBlock";
      title: string;
      body: string;
      // Decorative 24×24 PNG (48×48 source) at an absolute URL built from webappUrl. No SVG
      // or data URI, and the block must read fine with images blocked. HTML only: the
      // plain-text path ignores it.
      iconUrl?: string;
    }
  // variant absent = primary (dark). Secondary: light grey cell, dark text.
  | { type: "button"; variant?: "primary" | "secondary"; label: string; url: string }
  // A bordered card (the impacts summary's headline findings): a large headline, an optional
  // bold title, a body and a text link. No image. Outlook ignores the border radius.
  | {
      type: "card";
      headline: string;
      title?: string;
      body: string;
      link: { label: string; url: string };
    }
  // A plain-text signature: no image, ever (Outlook blocks remote images by default and
  // shows a broken-image icon instead).
  | {
      type: "contactSignature";
      name: string;
      role: string;
      organisation: string;
      phone: string;
      email: string;
    };

export type EmailContent = {
  subject: string;
  // Required, so a template that forgets it does not compile: without a preheader, inboxes
  // show the first line of the body as the preview (the login identifier, « Bonjour Prénom
  // Nom, Hier vous avez… »). HTML only: the plain-text alternative does not carry it.
  preheader: string;
  sections: EmailSection[];
  // Required, so a template that forgets the unsubscribe link does not compile: every
  // lifecycle email carries the footer rendered below. Build it with buildUnsubscribeUrl.
  unsubscribeUrl: string;
};

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

const FONT_STACK = "Arial, Helvetica, sans-serif";
// Brand colour for links, matching SmtpAuthLinkMailer. Used by the unsubscribe footer, and
// exported so templates build their own `html` fragments (e.g. paragraph links) in a
// consistent colour.
export const LINK_COLOR = "#000091";
const TEXT_COLOR = "#161616";
const BUTTON_BG_COLOR = "#161616";
const SECONDARY_BUTTON_BG_COLOR = "#dddddd";
const MUTED_TEXT_COLOR = "#666666";
const CARD_BORDER_COLOR = "#dddddd";
const FEATURE_TITLE_STYLE = `font-family:${FONT_STACK};font-size:16px;font-weight:bold;color:${TEXT_COLOR};`;
// Invisible characters appended to the preheader, so clients don't fill the rest of the
// preview with the start of the body. Markup, not text: appended after escaping.
const PREHEADER_PADDING = "&zwnj;&nbsp;".repeat(100);

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderEmail(content: EmailContent): RenderedEmail {
  return {
    subject: content.subject,
    html: renderHtml(content),
    text: renderText(content),
  };
}

function renderHtml(content: EmailContent): string {
  // mso-hide:all hides it in Outlook for Windows, which doesn't reliably honour display:none;
  // max-height:0 and overflow:hidden still clip it (and its padding) if hiding fails.
  const preheader = `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(content.preheader)}${PREHEADER_PADDING}</div>`;

  const rows = [...content.sections.map(renderSectionHtml), renderFooterHtml(content)].join("\n");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(content.subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f6f6;font-family:${FONT_STACK};">
  ${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width:600px;width:100%;background-color:#ffffff;">
${rows}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderSectionHtml(section: EmailSection): string {
  switch (section.type) {
    case "heading":
      return `          <tr>
            <td style="padding:16px 24px;font-family:${FONT_STACK};font-size:24px;font-weight:bold;color:${TEXT_COLOR};">
              ${escapeHtml(section.text)}
            </td>
          </tr>`;
    case "paragraph":
      return `          <tr>
            <td style="padding:8px 24px;font-family:${FONT_STACK};font-size:16px;line-height:1.5;color:${TEXT_COLOR};">
              ${section.html}
            </td>
          </tr>`;
    case "featureBlock":
      if (section.iconUrl) {
        return `          <tr>
            <td style="padding:16px 24px 0 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="24" valign="middle" style="width:24px;padding:0 8px 0 0;vertical-align:middle;">
                    <img src="${escapeHtml(section.iconUrl)}" width="24" height="24" alt="" border="0" style="display:block;width:24px;height:24px;border:0;outline:none;text-decoration:none;">
                  </td>
                  <td valign="middle" style="vertical-align:middle;${FEATURE_TITLE_STYLE}">
                    ${escapeHtml(section.title)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
${renderFeatureBodyRow(section.body)}`;
      }
      return `          <tr>
            <td style="padding:16px 24px 0 24px;${FEATURE_TITLE_STYLE}">
              ${escapeHtml(section.title)}
            </td>
          </tr>
${renderFeatureBodyRow(section.body)}`;
    case "button": {
      const isSecondary = section.variant === "secondary";
      const backgroundColor = isSecondary ? SECONDARY_BUTTON_BG_COLOR : BUTTON_BG_COLOR;
      const labelColor = isSecondary ? TEXT_COLOR : "#ffffff";
      return `          <tr>
            <td align="center" style="padding:24px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  <td bgcolor="${backgroundColor}" style="border-radius:4px;">
                    <a href="${escapeHtml(section.url)}" style="display:inline-block;padding:14px 24px;font-family:${FONT_STACK};font-size:16px;font-weight:bold;color:${labelColor};text-decoration:none;">
                      ${escapeHtml(section.label)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
    }
    case "card":
      return renderCardHtml(section);
    case "contactSignature":
      return `          <tr>
            <td style="padding:8px 24px 24px 24px;font-family:${FONT_STACK};font-size:14px;line-height:1.5;color:${TEXT_COLOR};">
              ${escapeHtml(section.name)}<br>
              ${escapeHtml(section.role)}<br>
              ${escapeHtml(section.organisation)}<br>
              ${escapeHtml(section.phone)}<br>
              <a href="mailto:${escapeHtml(section.email)}" style="color:${TEXT_COLOR};text-decoration:underline;">${escapeHtml(section.email)}</a>
            </td>
          </tr>`;
  }
}

function renderCardHtml(card: Extract<EmailSection, { type: "card" }>): string {
  const titleRow = card.title
    ? `
                <tr>
                  <td style="padding:4px 16px 0 16px;font-family:${FONT_STACK};font-size:16px;font-weight:bold;line-height:1.5;color:${TEXT_COLOR};">
                    ${escapeHtml(card.title)}
                  </td>
                </tr>`
    : "";
  return `          <tr>
            <td style="padding:8px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${CARD_BORDER_COLOR};border-radius:8px;">
                <tr>
                  <td style="padding:16px 16px 4px 16px;font-family:${FONT_STACK};font-size:24px;font-weight:bold;line-height:1.25;color:${TEXT_COLOR};">
                    ${escapeHtml(card.headline)}
                  </td>
                </tr>${titleRow}
                <tr>
                  <td style="padding:4px 16px 0 16px;font-family:${FONT_STACK};font-size:14px;line-height:1.5;color:${TEXT_COLOR};">
                    ${escapeHtml(card.body)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px 16px 16px;font-family:${FONT_STACK};font-size:14px;line-height:1.5;">
                    <a href="${escapeHtml(card.link.url)}" style="color:${LINK_COLOR};text-decoration:underline;">${escapeHtml(card.link.label)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}

function renderFeatureBodyRow(body: string): string {
  return `          <tr>
            <td style="padding:4px 24px 16px 24px;font-family:${FONT_STACK};font-size:14px;line-height:1.5;color:${TEXT_COLOR};">
              ${escapeHtml(body)}
            </td>
          </tr>`;
}

// TODO(product): confirm the footer wording (draft, not in the mockups).
function renderFooterHtml(content: EmailContent): string {
  return `          <tr>
            <td style="padding:24px 24px 16px 24px;border-top:1px solid #dddddd;font-family:${FONT_STACK};font-size:12px;line-height:1.5;color:${MUTED_TEXT_COLOR};">
              Vous recevez cet e-mail car vous avez un compte Bénéfriches.
              Vous pouvez <a href="${escapeHtml(content.unsubscribeUrl)}" style="color:${LINK_COLOR};text-decoration:underline;">vous désinscrire</a> des e-mails d’accompagnement et de résultats d’impacts : votre compte reste actif.
            </td>
          </tr>`;
}

function renderText(content: EmailContent): string {
  return [...content.sections.map(renderSectionText), renderFooterText(content)].join("\n\n");
}

// TODO(product): confirm the footer wording (draft, not in the mockups).
function renderFooterText(content: EmailContent): string {
  return [
    "---",
    "Vous recevez cet e-mail car vous avez un compte Bénéfriches.",
    "Pour ne plus recevoir les e-mails d’accompagnement et de résultats d’impacts (votre compte reste actif) :",
    content.unsubscribeUrl,
  ].join("\n");
}

function renderSectionText(section: EmailSection): string {
  switch (section.type) {
    case "heading":
      return section.text;
    case "paragraph":
      return section.text;
    case "featureBlock":
      return `${section.title}\n${section.body}`;
    case "button":
      return `${section.label} : ${section.url}`;
    case "card":
      return [
        section.headline,
        ...(section.title ? [section.title] : []),
        section.body,
        `${section.link.label} : ${section.link.url}`,
      ].join("\n");
    case "contactSignature":
      return [section.name, section.role, section.organisation, section.phone, section.email].join(
        "\n",
      );
  }
}
