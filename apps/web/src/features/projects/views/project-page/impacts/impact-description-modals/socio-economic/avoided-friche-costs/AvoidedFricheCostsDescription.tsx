import { useContext } from "react";
import { AvoidedFricheCostsImpact, sumListWithKey } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

import { getSocioEconomicImpactLabel } from "../../../getImpactLabel";
import ImpactActorsItem from "../../../list-view/ImpactActorsItem";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalBarColoredChart from "../../shared/ModalBarColoredChart";
import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalData from "../../shared/ModalData";
import ModalGrid from "../../shared/ModalGrid";
import ModalHeader from "../../shared/ModalHeader";
import { mainBreadcrumbSection, economicDirectBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactData?: AvoidedFricheCostsImpact[];
};

const getChartColor = (impactName: AvoidedFricheCostsImpact["details"][number]["impact"]) => {
  switch (impactName) {
    case "avoided_accidents_costs":
      return "#9542F0";
    case "avoided_illegal_dumping_costs":
      return "#F042D6";
    case "avoided_maintenance_costs":
      return "#5C42F0";
    case "avoided_other_securing_costs":
      return "#F0427F";
    case "avoided_security_costs":
      return "#D042F0";
  }
};

const AvoidedFricheExpensesDescription = ({ impactData = [] }: Props) => {
  const total = sumListWithKey(impactData, "amount");

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🏚 Dépenses de gestion et de sécurisation de la friche évitées"
        subtitle="Grâce à la reconversion de la friche"
        value={{
          text: formatMonetaryImpact(total),
          state: total > 0 ? "success" : "error",
          description: `répartis entre l'actuel locataire et le propriétaire`,
        }}
        breadcrumbSegments={[
          mainBreadcrumbSection,
          economicDirectBreadcrumbSection,
          { label: "Dépenses friche évitées" },
        ]}
      />
      <ModalGrid>
        <ModalData>
          <ModalBarColoredChart
            data={impactData
              .map(({ details }) => details)
              .flat()
              .map(({ impact, amount }) => ({
                label: getSocioEconomicImpactLabel(impact),
                color: getChartColor(impact),
                value: amount,
              }))}
          />
          {impactData.map(({ actor, details }) =>
            details.map(({ amount, impact }) => (
              <ImpactActorsItem
                key={impact}
                label={getSocioEconomicImpactLabel(impact)}
                actors={[
                  {
                    label: getActorLabel(actor),
                    value: amount,
                  },
                ]}
                labelProps={{
                  onClick: (e) => {
                    e.stopPropagation();
                    openImpactModalDescription({
                      sectionName: "socio_economic",
                      subSectionName: "economic_direct",
                      impactName: "avoided_friche_costs",
                      impactDetailsName: impact,
                    });
                  },
                }}
                type="monetary"
              />
            )),
          )}
        </ModalData>

        <ModalContent>
          <p>
            Un site qui reste en l'état, sans intervention, induit des coûts importants, à la charge
            de l'ancien locataire ou du propriétaire du terrain :
          </p>
          <ul>
            <li>De manière directe, via la fiscalité locale (taxe foncière)</li>
            <li>
              De manière indirecte car lorsqu'aucun moyen de préservation n'est mis en œuvre sur un
              site (clôture, gardiennage, taille, etc.), celui-ci se dégrade de manière naturelle ou
              par l'intermédiaire de dégradation volontaire ou de vandalisme (vol de métaux, casse
              de vitres, incendie, dépôts sauvages) ou de squats, engendrant une perte financière
              (valeur du bien) voire une augmentation des dépenses de réhabilitation
            </li>
          </ul>
          <p>
            Sauf en cas de défaillance du locataire (faillite, liquidation judiciaire, etc.) les
            dépenses de gardiennage, d'entretien, d'enlèvement de déchets sont à la charge de ce
            dernier.
          </p>
          <p>
            <strong>Bénéficiaire</strong> : actuel locataire ou propriétaire
          </p>
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default AvoidedFricheExpensesDescription;
