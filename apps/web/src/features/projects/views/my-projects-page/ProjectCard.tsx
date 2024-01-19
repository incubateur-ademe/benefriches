import Button from "@codegouvfr/react-dsfr/Button";
import { Card } from "@codegouvfr/react-dsfr/Card";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  projectName: string;
  yearlyProfit: number;
  details?: string;
  impactLinkProps?: { href: string };
};

function ProjectCard({ projectName, yearlyProfit, details, impactLinkProps }: Props) {
  const linkProps = impactLinkProps ?? { href: "#" };
  const desc =
    yearlyProfit < 0 ? (
      <strong style={{ color: "var(--text-default-error)" }}>
        {formatNumberFr(yearlyProfit)} €/an de charges d'exploitation
      </strong>
    ) : (
      <strong style={{ color: "var(--text-default-success)" }}>
        {formatNumberFr(yearlyProfit)} €/an de bénéfices d'exploitation
      </strong>
    );
  const footer = impactLinkProps ? (
    <Button priority="secondary" linkProps={impactLinkProps}>
      Voir les impacts
    </Button>
  ) : null;

  return (
    <Card
      title={projectName}
      endDetail={details}
      linkProps={linkProps}
      footer={footer}
      desc={desc}
      border
    />
  );
}

export default ProjectCard;
