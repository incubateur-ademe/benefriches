export const pageIds = {
  impacts: "impacts",
  "impacts-economic-balance": "impacts-economic-balance",
  "impacts-socio-economic": "impacts-socio-economic",
  "impacts-social": "impacts-social",
  "impacts-environment": "impacts-environment",
  "project-features": "project-features",
  "site-features": "site-features",
  "explanatory-note": "explanatory-note",
} as const;

export const getPageLinkForId = (id: keyof typeof pageIds) => {
  return `#${pageIds[id]}`;
};
