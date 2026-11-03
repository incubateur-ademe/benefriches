import { fr } from "@codegouvfr/react-dsfr";
import { useId } from "react";
import type { Link } from "type-route";

import classNames from "@/shared/views/clsx";

export type BreadcrumbSegment = {
  label: string;
  linkProps?: Link;
};
export type BreadcrumbProps = {
  segments: [BreadcrumbSegment, ...BreadcrumbSegment[]];
};

const ModalBreadcrumb = ({ segments }: BreadcrumbProps) => {
  const id = useId();
  const breadcrumbId = `breadcrumb-${id}`;
  const lastIndex = segments.length - 1;

  return (
    <nav role="navigation" className={classNames(fr.cx("fr-breadcrumb"), "m-0", "py-1")}>
      <button className="fr-breadcrumb__button" aria-expanded="false" aria-controls={breadcrumbId}>
        Voir le fil d'Ariane
      </button>
      <div className="fr-collapse" id={breadcrumbId}>
        <ol className="fr-breadcrumb__list">
          {segments.map(({ label, linkProps }, index) => {
            return (
              <li key={label}>
                {linkProps ? (
                  <a
                    className="fr-breadcrumb__link"
                    {...linkProps}
                    aria-current={lastIndex === index ? "page" : "false"}
                  >
                    {label}
                  </a>
                ) : (
                  <span className="leading-5 align-top">{label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default ModalBreadcrumb;
