// Shared layout helper for lifecycle emails. The audience is collectivités and
// ADEME-adjacent structures, so Outlook is the constraint that matters:
// table-based single-column layout, inline styles only, no flexbox or grid.
// Every email produced here ships a plain-text alternative alongside the HTML —
// renderEmail always returns both, so it is structurally impossible to ship
// HTML without a text fallback.

export type EmailSection =
  | { type: "heading"; text: string }
  | { type: "paragraph"; html: string; text: string }
  | { type: "featureBlock"; title: string; body: string }
  | { type: "button"; label: string; url: string };

export type EmailContent = {
  subject: string;
  preheader?: string;
  sections: EmailSection[];
};

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

const FONT_STACK = "Arial, Helvetica, sans-serif";
// Brand colour for links, matching SmtpAuthLinkMailer. Not referenced by any section
// renderer below (the welcome email has no inline links), but exported so templates
// build their own `html` fragments (e.g. paragraph links) in a consistent colour.
export const LINK_COLOR = "#000091";
const TEXT_COLOR = "#161616";
const BUTTON_BG_COLOR = "#161616";

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
  const preheader = content.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(content.preheader)}</div>`
    : "";

  const rows = content.sections.map(renderSectionHtml).join("\n");

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
      return `          <tr>
            <td style="padding:16px 24px 0 24px;font-family:${FONT_STACK};font-size:16px;font-weight:bold;color:${TEXT_COLOR};">
              ${escapeHtml(section.title)}
            </td>
          </tr>
          <tr>
            <td style="padding:4px 24px 16px 24px;font-family:${FONT_STACK};font-size:14px;line-height:1.5;color:${TEXT_COLOR};">
              ${escapeHtml(section.body)}
            </td>
          </tr>`;
    case "button":
      return `          <tr>
            <td style="padding:24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="${BUTTON_BG_COLOR}" style="border-radius:4px;">
                    <a href="${escapeHtml(section.url)}" style="display:inline-block;padding:14px 24px;font-family:${FONT_STACK};font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;">
                      ${escapeHtml(section.label)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
  }
}

function renderText(content: EmailContent): string {
  return content.sections.map(renderSectionText).join("\n\n");
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
  }
}
