import { fr } from "@codegouvfr/react-dsfr";
import { useId } from "react";

import classNames from "@/shared/views/clsx";

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
      className={classNames(
        fr.cx("fr-breadcrumb"),
        "tw-w-3/4",
        "tw-absolute",
        "tw-top-1",
        "tw-left-8",
      )}
    >
      <button className="fr-breadcrumb__button" aria-expanded="false" aria-controls={breadcrumbId}>
        Voir le fil d'Ariane
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
                <span className="tw-leading-5 tw-align-top">{label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default ModalBreadcrumb;
