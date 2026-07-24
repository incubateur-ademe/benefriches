import { useContext, useMemo } from "react";
import {
  AggregatedReconversionProjectOnSiteImpactItemView,
  IndirectEconomicImpactName,
  sumListWithKey,
} from "shared";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/domain/groupIndirectImpactsByBearer";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";
import { filterByName } from "@/shared/core/filter-by-name/filterByName";
import { formatNumberFr, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { getSocioEconomicImpactLabel } from "../../../getImpactLabel";
import ModalTable from "../../shared/ModalTable";
import ModalColumnPointChart from "../../shared/modal-charts/ModalColumnPointChart";
import { mainBreadcrumbSection, localAuthorityBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  developmentPlan: ModalDataProps["contextData"]["projectDevelopmentPlan"];
  impactData: IndirectEconomicImpactsByBearerAndGroupCategory<AggregatedReconversionProjectOnSiteImpactItemView>["localAuthority"]["taxesIncome"];
};

const getChartColor = (
  impactName: Extract<
    IndirectEconomicImpactName,
    | "projectNewHousesTaxesIncome"
    | "projectNewCompanyTaxationIncome"
    | "projectPhotovoltaicTaxesIncome"
  >,
) => {
  switch (impactName) {
    case "projectNewCompanyTaxationIncome":
      return "#1D5DA2";
    case "projectNewHousesTaxesIncome":
      return "#C649CA";
    case "projectPhotovoltaicTaxesIncome":
      return "#FF9700";
  }
};

const TaxesIncomeDescription = ({ developmentPlan, impactData }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const data = useMemo(
    () =>
      filterByName(
        impactData,
        "projectNewHousesTaxesIncome",
        "projectNewCompanyTaxationIncome",
        "projectPhotovoltaicTaxesIncome",
      ).map(({ total, name }) => ({
        label: getSocioEconomicImpactLabel(name),
        color: getChartColor(name),
        value: total,
        name,
      })),
    [impactData],
  );

  const total = sumListWithKey(data, "value");

  return (
    <ModalBody size="large">
      <ModalHeader
        title="🏛️ Recettes fiscales"
        value={
          impactData
            ? {
                state: total > 0 ? "success" : "error",
                text: formatMonetaryImpact(total),
                description: "pour la collectivité",
              }
            : undefined
        }
        breadcrumbSegments={[
          mainBreadcrumbSection,
          localAuthorityBreadcrumbSection,
          { label: "Recettes fiscales" },
        ]}
      />
      <ModalGrid>
        <ModalData>
          <ModalColumnPointChart format="monetary" data={data} exportTitle="🏛️ Recettes fiscales" />

          <ModalTable
            caption="Liste des recettes fiscales"
            data={data.map(({ label, value, color, name }) => ({
              label,
              value,
              color,
              actor: getActorLabel("community"),
              onClick: () => {
                updateModalContent({
                  sectionName: "socio_economic",
                  impactName: "taxesIncome",
                  subSectionName: "localAuthority",
                  impactDetailsName: name,
                });
              },
            }))}
          />
        </ModalData>

        <ModalContent>
          <p>
            La concrétisation du projet va générer des recettes fiscales pour la collectivité,
            variables selon le type de projet et/ou la catégories d’utilisateurs :
          </p>
          <ul>
            <li>
              exemples de taxes locales pour les entreprises : cotisation foncière des entreprises
              (CFE), taxe foncière sur les propriétés bâties (TFPB), taxe foncière sur les
              propriétés non bâties (TFPNB) ou encore taxe sur les surfaces commerciales (TaSCom);
            </li>
            <li>
              pour les projets photovoltaïques : imposition forfaitaire des entreprises de réseaux
              (IFER);
            </li>
            <li>exemple de taxes locales pour les particuliers : taxe foncière</li>
          </ul>
          <p>
            <strong>Bénéficiaire</strong> : Collectivité
          </p>
          <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
          <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
          <ul>
            <li>Fiscalité locale moyenne du logement (exprimé en €/m²/an)</li>
            <li>Fiscalité locale moyenne des entreprises (exprimée en €/salarié/an)</li>
            <li>Fiscalité de la production d’énergie photovoltaïque (exprimée en €/kWc/an)</li>
            <li>
              Ratios d’occupation par salarié par type d’activités distinguant les activités
              tertiaires (bureaux, administration, enseignements) des autres activités (commerce,
              artisanat, industrie) (exprimés en m²SDP/salarié)
            </li>
          </ul>
          <ModalTitleThree> Données du projet</ModalTitleThree>
          <p>
            Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été
            suggérées par Bénéfriches sur la base d’une moyenne ou d’une hypothèse.
          </p>
          {developmentPlan.type === "URBAN_PROJECT" && (
            <ul>
              {developmentPlan.buildingsFloorAreaDistribution.RESIDENTIAL && (
                <li>
                  Surface de logements prévues (exprimée en m² SDP) :{" "}
                  {formatSurfaceArea(developmentPlan.buildingsFloorAreaDistribution.RESIDENTIAL)}
                </li>
              )}

              <li>
                Nombre d’emplois prévus ou superficie de bâtiments à usage économique distinguant
                les activités tertiaires (bureaux, administration, enseignements) des autres
                activités (commerce, artisanat, industrie)
              </li>
            </ul>
          )}
          {developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" && (
            <ul>
              {developmentPlan.installationElectricalPowerKWc && (
                <li>
                  Puissance photovoltaïque installée le cas échéant (exprimée en kWc) :{" "}
                  {formatNumberFr(developmentPlan.installationElectricalPowerKWc)} kWc
                </li>
              )}
            </ul>
          )}
          <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
          <p>
            Le total des recettes fiscales escomptées en une année est la somme des recettes
            attendues, selon l’usage futur prévu en projet, pour chacune des fonctions suivantes :
            logement, activités économiques, photovoltaïque.
          </p>

          <ul>
            <li>
              Pour le logement, les recettes fiscales sont le produit de la surface totale de
              logement prévus (exprimée en m² SDP) par le montant de la fiscalité locale moyenne du
              logement (exprimé en €/m²SDP/an)
            </li>

            <li>
              Pour les activités économiques (hors photovoltaïque) les recettes fiscales sont le
              produit du nombre d’emplois prévus *par le montant de la f*iscalité locale moyenne des
              entreprises (exprimée en €/salarié/an). Si le nombre d’emploi n’est pas connu,
              BENEFRICHES le calcule par application de ratio d’occupation par salarié par type
              d’activités distinguant les activités tertiaires (bureaux, administration,
              enseignements) des autres activités (commerce, artisanat, industrie) (exprimés en
              m²SDP/salarié) à la surface d’activités économiques prévue, ventilée par type
              d’activité (exprimée en m² SDP).
            </li>
            <li>
              Pour le photovoltaïque, les recettes fiscales sont le produit du montant de la
              fiscalité locale moyenne (exprimée en €/kWc/an) pour cette activité par la puissance
              installée (exprimée en kWc).
            </li>
          </ul>
          <ModalTitleTwo>Sources</ModalTitleTwo>
          <ul>
            <li>
              imposition forfaitaire des entreprises de réseaux (IFER) : <strong>3.394 €</strong>{" "}
              par kilowatt de puissance électrique installée au 1er janvier de l’année d’imposition
            </li>
            <li>
              <ExternalLink href="https://www.cre.fr/documents/Publications/Rapports-thematiques/Couts-et-rentabilites-du-grand-photovoltaique-en-metropole-continentale">
                Fiscalité des centrales photovoltaïques
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.vie-publique.fr/en-bref/289611-fiscalite-directe-locale-quelles-evolutions-deux-ans-apres-la-reforme">
                Fiscalité directe locale
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.insee.fr/fr/statistiques/7700305">
                37,8 millions de logements en France au 1er janvier 2023
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.statistiques.developpement-durable.gouv.fr/sites/default/files/2022-12/datalab_essentiel_296_conditions_logements_decembre2022_0.pdf">
                Les conditions de logement des ménages résidant en France en 2020
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://data.economie.gouv.fr/explore/dataset/fiscalite-locale-des-particuliers-geo/table/?disjunctive.insee_com">
                Fiscalité locale des particuliers
              </ExternalLink>
            </li>
          </ul>
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default TaxesIncomeDescription;
