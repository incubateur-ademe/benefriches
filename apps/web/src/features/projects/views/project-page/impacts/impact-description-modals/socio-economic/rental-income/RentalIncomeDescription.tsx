import { formatNumberFr, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { ProjectData } from "../../ImpactModalDescriptionProvider";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";
import { breadcrumbSection } from "../breadcrumbSection";

type Props = {
  developmentPlan: ProjectData["developmentPlan"];
};

const RentalIncomeDescription = ({ developmentPlan }: Props) => {
  const { surfaceArea, electricalPowerKWc } =
    developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
      ? {
          surfaceArea: developmentPlan.surfaceArea,
          electricalPowerKWc: developmentPlan.electricalPowerKWc,
        }
      : { surfaceArea: undefined, electricalPowerKWc: undefined };

  return (
    <>
      <ModalHeader
        title="🔑 Revenu locatif"
        breadcrumbSegments={[
          breadcrumbSection,
          {
            label: "Impacts économiques directs",
          },
          { label: "Dépenses friche évitées" },
        ]}
      />
      <ModalContent>
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
        {(surfaceArea || electricalPowerKWc) && (
          <ul>
            {surfaceArea && (
              <li>Surface au sol occupée par les panneaux : {formatSurfaceArea(surfaceArea)}</li>
            )}

            {electricalPowerKWc && (
              <li>
                Puissance installée exprimée en kWc : {formatNumberFr(electricalPowerKWc)} KWc
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
    </>
  );
};

export default RentalIncomeDescription;
