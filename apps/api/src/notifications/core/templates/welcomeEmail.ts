import {
  escapeHtml,
  renderEmail,
  type RenderedEmail,
} from "src/notifications/core/templates/emailLayout";

export type BuildWelcomeEmailInput = {
  recipientEmail: string;
  webappUrl: string;
  unsubscribeUrl: string;
};

export function buildWelcomeEmail(input: BuildWelcomeEmailInput): RenderedEmail {
  // Never a hardcoded domain: always built from the injected webapp URL.
  const ctaUrl = new URL("/creer-site-foncier", input.webappUrl).toString();
  const iconUrl = (fileName: string) =>
    new URL(`/img/emails/${fileName}`, input.webappUrl).toString();
  const escapedEmail = escapeHtml(input.recipientEmail);

  return renderEmail({
    subject: "Bienvenue chez Bénéfriches",
    preheader: "Votre compte est créé. Voici comment réaliser votre première évaluation.",
    unsubscribeUrl: input.unsubscribeUrl,
    sections: [
      { type: "heading", text: "Bienvenue chez Bénéfriches." },
      {
        type: "paragraph",
        html: `Votre identifiant de connexion est <span style="text-decoration:underline;">${escapedEmail}</span>`,
        text: `Votre identifiant de connexion est ${input.recipientEmail}`,
      },
      {
        type: "paragraph",
        html: "Avec Bénéfriches, réalisez l’évaluation socio-économique de votre projet d’aménagement.",
        text: "Avec Bénéfriches, réalisez l’évaluation socio-économique de votre projet d’aménagement.",
      },
      {
        type: "paragraph",
        html: "Renseignez votre site puis votre projet, et découvrez :",
        text: "Renseignez votre site puis votre projet, et découvrez :",
      },
      {
        type: "featureBlock",
        title: "Votre évaluation des impacts",
        iconUrl: iconUrl("impacts-evaluation.png"),
        body: "Sur plusieurs indicateurs clés : recettes fiscales, cadre de vie des riverains, emploi, émissions de CO2, perméabilité des sols…",
      },
      {
        type: "featureBlock",
        title: "Votre analyse coût-bénéfice",
        iconUrl: iconUrl("cost-benefit-analysis.png"),
        body: "Pour voir si les impacts socio-économiques compenseront le coût de l’opération et, si oui, en quelle année.",
      },
      {
        type: "featureBlock",
        title: "Votre analyse des coûts évités",
        iconUrl: iconUrl("avoided-costs-analysis.png"),
        body: "Pour comprendre ce que coûte la friche tant qu’elle n’est pas reconvertie, ou ce que coûterait le projet s’il se faisait en extension urbaine.",
      },
      {
        type: "button",
        label: "Commencer l’évaluation socio-économique",
        url: ctaUrl,
      },
    ],
  });
}
