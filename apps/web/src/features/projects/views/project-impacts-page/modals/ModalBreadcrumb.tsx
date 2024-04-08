import { useId } from "react";
import { fr } from "@codegouvfr/react-dsfr";

export type ModalBreadcrumbSegments = {
  onClick?: () => void;
  label: string;
  isCurrent?: boolean;
}[];
type Props = {
  segments: ModalBreadcrumbSegments;
};

const ModalBreadcrumb = ({ segments }: Props) => {
  const id = useId();
  const breadcrumbId = `breadcrumb-${id}`;
  return (
    <nav
      role="navigation"
      className={"fr-breadcrumb tw-w-3/4"}
      style={{ position: "absolute", top: fr.spacing("1v"), left: fr.spacing("4w") }}
    >
      <button className="fr-breadcrumb__button" aria-expanded="false" aria-controls={breadcrumbId}>
        Voir le fil d’Ariane
      </button>
      <div className="fr-collapse" id={breadcrumbId}>
        <ol className="fr-breadcrumb__list">
          {segments.map(({ onClick, isCurrent, label }) => (
            <li key={label}>
              {onClick ? (
                <button
                  className="fr-breadcrumb__link"
                  onClick={onClick}
                  aria-current={isCurrent ? "page" : "false"}
                >
                  {label}
                </button>
              ) : (
                <span style={{ lineHeight: "1.25rem", verticalAlign: "top" }}>{label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default ModalBreadcrumb;
