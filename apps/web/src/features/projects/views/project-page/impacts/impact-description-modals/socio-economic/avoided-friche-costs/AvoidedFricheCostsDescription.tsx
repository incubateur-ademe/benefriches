import { useContext } from "react";
import { AvoidedFricheCostsImpact, sumListWithKey } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import { getSocioEconomicImpactLabel } from "../../../getImpactLabel";
import ModalTable from "../../shared/ModalTable";
import ModalColumnPointChart from "../../shared/modal-charts/ModalColumnPointChart";
import { mainBreadcrumbSection, economicDirectBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactData?: AvoidedFricheCostsImpact[];
};

const getChartColor = (impactName: AvoidedFricheCostsImpact["details"][number]["impact"]) => {
  switch (impactName) {
    case "avoided_accidents_costs":
      return "#E73518";
    case "avoided_illegal_dumping_costs":
      return "#AD6524";
    case "avoided_maintenance_costs":
      return "#9E89CC";
    case "avoided_other_securing_costs":
      return "#C4C5C6";
    case "avoided_security_costs":
      return "#AFF6FF";
  }
};

const AvoidedFricheExpensesDescription = ({ impactData = [] }: Props) => {
  const total = sumListWithKey(impactData, "amount");

  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const data = impactData
    .map(({ details, actor }) =>
      details.map(({ impact, amount }) => ({
        label: getSocioEconomicImpactLabel(impact),
        color: getChartColor(impact),
        value: amount,
        name: impact,
        actor,
      })),
    )
    .flat();

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
          <ModalColumnPointChart
            format="monetary"
            data={data}
            exportTitle="🏚 Dépenses de gestion et de sécurisation de la friche évitées"
            exportSubtitle="Grâce à la reconversion de la friche"
          />
          <ModalTable
            caption="Liste des dépenses de gestion et de sécurisation de la friche évitées"
            data={data.map(({ label, value, color, name, actor }) => ({
              label,
              value,
              color,
              actor,
              onClick: () => {
                updateModalContent({
                  sectionName: "socio_economic",
                  subSectionName: "economic_direct",
                  impactName: "avoided_friche_costs",
                  impactDetailsName: name,
                });
              },
            }))}
          />
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
