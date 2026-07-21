import { useContext, useMemo } from "react";
import { AvoidedFricheCostsIndirectEconomicImpactItemView, sumListWithKey } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import {
  ImpactModalDescriptionContext,
  SocioEconomicSubSectionName,
} from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import { getSocioEconomicImpactLabel } from "../../../getImpactLabel";
import ModalTable from "../../shared/ModalTable";
import ModalColumnPointChart from "../../shared/modal-charts/ModalColumnPointChart";
import {
  localAuthorityBreadcrumbSection,
  localPeopleOrCompanyBreadcrumbSection,
  mainBreadcrumbSection,
} from "../breadcrumbSections";

type Props = {
  impactData?: AvoidedFricheCostsIndirectEconomicImpactItemView[];
  bearerName: string;
  sectionName: SocioEconomicSubSectionName;
  impactName: AvoidedFricheCostsIndirectEconomicImpactItemView["name"];
};

const getChartColor = (impactName: AvoidedFricheCostsIndirectEconomicImpactItemView["details"]) => {
  switch (impactName) {
    case "accidentsCost":
      return "#E73518";
    case "illegalDumpingCost":
      return "#AD6524";
    case "maintenance":
      return "#9E89CC";
    case "otherSecuringCosts":
      return "#C4C5C6";
    case "security":
      return "#AFF6FF";
  }
};

const AvoidedFricheExpensesDescription = ({
  impactData = [],
  bearerName,
  sectionName,
  impactName,
}: Props) => {
  const total = sumListWithKey(impactData, "total");

  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const data = useMemo(
    () =>
      impactData.map(({ details, total }) => ({
        label: getSocioEconomicImpactLabel(`${impactName}.${details}`),
        color: getChartColor(details),
        value: total,
        name: details,
      })),
    [impactData, impactName],
  );

  return (
    <ModalBody size="large">
      <ModalHeader
        title="🏚️ Dépenses de gestion et de sécurisation de la friche évitées"
        subtitle="Grâce à la reconversion de la friche"
        value={{
          text: formatMonetaryImpact(total),
          state: total > 0 ? "success" : "error",
          description: `pour ${bearerName}`,
        }}
        breadcrumbSegments={[
          mainBreadcrumbSection,
          sectionName === "localAuthority"
            ? localAuthorityBreadcrumbSection
            : localPeopleOrCompanyBreadcrumbSection,
          { label: "Dépenses friche évitées" },
        ]}
      />
      <ModalGrid>
        <ModalData>
          <ModalColumnPointChart
            format="monetary"
            data={data}
            exportTitle="🏚️ Dépenses de gestion et de sécurisation de la friche évitées"
            exportSubtitle="Grâce à la reconversion de la friche"
          />
          <ModalTable
            caption="Liste des dépenses de gestion et de sécurisation de la friche évitées"
            data={data.map(({ label, value, color, name }) => ({
              label,
              value,
              color,
              onClick: () => {
                updateModalContent({
                  sectionName: "socio_economic",
                  subSectionName: sectionName,
                  impactName: impactName,
                  impactDetailsName: `${impactName}.${name}`,
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
            <strong>Bénéficiaire</strong> :{" "}
            {impactName === "avoidedFricheMaintenanceAndSecuringCostsForOwner"
              ? "actuel propriétaire"
              : "actuel locataire"}
          </p>
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default AvoidedFricheExpensesDescription;
