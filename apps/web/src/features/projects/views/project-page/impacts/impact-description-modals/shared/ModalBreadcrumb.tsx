import { fr } from "@codegouvfr/react-dsfr";
import { useContext, useId } from "react";

import classNames from "@/shared/views/clsx";

import { ImpactDescriptionModalCategory } from "../ImpactDescriptionModalWizard";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";

type ModalBreadcrumbSegments = {
  label: string;
  id?: ImpactDescriptionModalCategory;
}[];

type Props = {
  segments: ModalBreadcrumbSegments;
};

const ModalBreadcrumb = ({ segments }: Props) => {
  const id = useId();
  const breadcrumbId = `breadcrumb-${id}`;
  const lastIndex = segments.length - 1;

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <nav role="navigation" className={classNames(fr.cx("fr-breadcrumb"), "tw-m-0", "tw-py-1")}>
      <button className="fr-breadcrumb__button" aria-expanded="false" aria-controls={breadcrumbId}>
        Voir le fil d'Ariane
      </button>
      <div className="fr-collapse" id={breadcrumbId}>
        <ol className="fr-breadcrumb__list">
          {segments.map(({ label, id }, index) => (
            <li key={label}>
              {id ? (
                <button
                  className="fr-breadcrumb__link"
                  onClick={() => {
                    openImpactModalDescription(id);
                  }}
                  aria-current={lastIndex === index ? "page" : "false"}
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
