import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { SocioEconomicSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import { formatNumberFr, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import {
  localAuthorityBreadcrumbSection,
  localPeopleOrCompanyBreadcrumbSection,
  mainBreadcrumbSection,
} from "../breadcrumbSections";

type Props = {
  developmentPlan: ModalDataProps["contextData"]["projectDevelopmentPlan"];
  impactData?: number;
  bearer: SocioEconomicSubSectionName;
};

const RentalIncomeDescription = ({ developmentPlan, impactData, bearer }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🔑 Revenu locatif"
        value={
          impactData
            ? {
                state: impactData > 0 ? "success" : "error",
                text: formatMonetaryImpact(impactData),
                description: "répartis entre l'actuel propriétaire et le futur propriétaire",
              }
            : undefined
        }
        breadcrumbSegments={[
          mainBreadcrumbSection,
          bearer === "localAuthority"
            ? localAuthorityBreadcrumbSection
            : localPeopleOrCompanyBreadcrumbSection,
          { label: "Revenu locatif" },
        ]}
      />
      <ModalContent fullWidth>
        <p>
          Dans certains projets (ex : centrale photovoltaïque au sol), le foncier aménagé ne fait
          pas l’objet de cession mais d’une location. Les revenus issus de cette éventuelle location
          sont repris ici.
        </p>
        <p>
          La valeur est saisie par l’utilisateur. A défaut, Bénéfriches calcule un revenu locatif
          moyen.
        </p>
        <p>
          <strong>Bénéficiaire</strong> : actuel propriétaire, futur propriétaire (si acquisition du
          foncier)
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>
            Ratio « Dépenses de location de terrain par unité de puissance installée » : 4 €/kWc
          </li>
        </ul>
        <ModalTitleThree> Données du projet</ModalTitleThree>
        <p>
          Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été
          suggérées par Bénéfriches sur la base d’une moyenne ou d’une hypothèse.
        </p>
        {developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" && (
          <ul>
            {developmentPlan.installationSurfaceArea && (
              <li>
                Surface au sol occupée par les panneaux :{" "}
                {formatSurfaceArea(developmentPlan.installationSurfaceArea)}
              </li>
            )}

            {developmentPlan.installationElectricalPowerKWc && (
              <li>
                Puissance installée exprimée en kWc :{" "}
                {formatNumberFr(developmentPlan.installationElectricalPowerKWc)} KWc
              </li>
            )}
          </ul>
        )}

        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          Le revenu locatif est calculé en multipliant le ratio “Dépenses de location de terrain par
          unité de puissance installée” par la puissance installée.
        </p>
        <ModalTitleTwo>Sources</ModalTitleTwo>
        <ExternalLink href="https://www.cre.fr/documents/Publications/Rapports-thematiques/Couts-et-rentabilites-du-grand-photovoltaique-en-metropole-continentale">
          CRE : Coûts et rentabilités du grand photovoltaïque en métropole continentale
        </ExternalLink>
      </ModalContent>
    </ModalBody>
  );
};

export default RentalIncomeDescription;
