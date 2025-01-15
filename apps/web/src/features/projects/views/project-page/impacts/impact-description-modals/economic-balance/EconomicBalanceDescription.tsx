import { useContext } from "react";

import { getEconomicBalanceProjectImpacts } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
} from "../../getImpactLabel";
import ImpactActorsItem from "../../list-view/ImpactActorsItem";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import { ImpactsData, ProjectData } from "../ImpactModalDescriptionProvider";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";
import ModalTitleTwo from "../shared/ModalTitleTwo";

type Props = {
  impactsData: ImpactsData;
  projectData: ProjectData;
};

const EconomicBalanceDescription = ({ impactsData, projectData }: Props) => {
  const economicBalance = getEconomicBalanceProjectImpacts(
    projectData.developmentPlan.type,
    impactsData,
  );
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <>
      <ModalHeader
        title="📉 Bilan de l'opération"
        value={{
          state: economicBalance.total > 0 ? "success" : "error",
          text: formatMonetaryImpact(economicBalance.total),
          description: `pour ${economicBalance.bearer}`,
        }}
        breadcrumbSegments={[
          {
            label: "Bilan de l'opération",
          },
        ]}
      />
      <ModalContent>
        <p>
          Le bilan d'opération regroupe l'ensemble des recettes et des dépenses d'une opération
          d'aménagement ou de construction. Son périmètre est donc circonscrit au porteur du projet.
        </p>
        <p>
          <strong>Bénéficiaires / déficitaires</strong> : exploitant, aménageur, futur propriétaire
        </p>

        {economicBalance.economicBalance.map(({ name, value, details = [] }) => (
          <ImpactActorsItem
            key={name}
            label={getEconomicBalanceImpactLabel(name)}
            onClick={() => {
              openImpactModalDescription({ sectionName: "economic_balance", impactName: name });
            }}
            actors={[
              {
                label: "",
                value,
                details: details.map(({ name: detailsName, value: detailsValue }) => ({
                  label: getEconomicBalanceDetailsImpactLabel(name, detailsName),
                  value: detailsValue,
                  onClick: () => {
                    openImpactModalDescription({
                      sectionName: "economic_balance",
                      impactName: name,
                      impactDetailsName: detailsName,
                    });
                  },
                })),
              },
            ]}
            type="monetary"
          />
        ))}

        <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
        <ul>
          <li>
            <ExternalLink href="https://outil2amenagement.cerema.fr/outils/bilan-amenageur">
              Outil aménagement CEREMA
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.reseaunationalamenageurs.logement.gouv.fr/IMG/pdf/2016-02-22_-_ApprocheSCET-OptimisationEconomiqueOperationsAmenagement.pdf">
              L'optimisation des dépenses des opérations d'aménagement
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </>
  );
};

export default EconomicBalanceDescription;
