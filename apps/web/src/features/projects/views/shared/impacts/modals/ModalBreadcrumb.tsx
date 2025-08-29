import { fr } from "@codegouvfr/react-dsfr";
import { useContext, useId } from "react";

import classNames from "@/shared/views/clsx";

import { ImpactModalDescriptionContext, ContentState } from "./ImpactModalDescriptionContext";

export type BreadcrumbSegment = {
  label: string;
  contentState?: ContentState;
};
export type BreadcrumbProps = {
  segments: [BreadcrumbSegment, ...BreadcrumbSegment[]];
};

const ModalBreadcrumb = ({ segments }: BreadcrumbProps) => {
  const id = useId();
  const breadcrumbId = `breadcrumb-${id}`;
  const lastIndex = segments.length - 1;

  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  return (
    <nav role="navigation" className={classNames(fr.cx("fr-breadcrumb"), "m-0", "py-1")}>
      <button className="fr-breadcrumb__button" aria-expanded="false" aria-controls={breadcrumbId}>
        Voir le fil d'Ariane
      </button>
      <div className="fr-collapse" id={breadcrumbId}>
        <ol className="fr-breadcrumb__list">
          {segments.map(({ label, contentState }, index) => (
            <li key={label}>
              {contentState ? (
                <button
                  className="fr-breadcrumb__link"
                  onClick={() => {
                    updateModalContent(contentState);
                  }}
                  aria-current={lastIndex === index ? "page" : "false"}
                >
                  {label}
                </button>
              ) : (
                <span className="leading-5 align-top">{label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default ModalBreadcrumb;
