import { useContext, useMemo } from "react";
import { AggregatedReconversionProjectOnSiteImpactItemView, sumListWithKey } from "shared";

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
import { filterByName } from "@/shared/core/filter-by-name/filterByName";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalTable from "../../shared/ModalTable";
import ModalColumnPointChart from "../../shared/modal-charts/ModalColumnPointChart";
import { mainBreadcrumbSection, humanityBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactsData: IndirectEconomicImpactsByBearerAndGroupCategory<AggregatedReconversionProjectOnSiteImpactItemView>["humanity"]["environmentalAction"];
};

type EcosystemServiceName =
  | "newStoredCo2Eq"
  | "natureRelatedWelnessAndLeisure"
  | "forestRelatedProduct"
  | "pollination"
  | "invasiveSpeciesRegulation"
  | "waterCycle"
  | "nitrogenCycle"
  | "soilErosion";

const getEcosystemServiceDetailsTitle = (impactName: EcosystemServiceName) => {
  switch (impactName) {
    case "newStoredCo2Eq":
      return "🍂️ Carbone stocké dans les sols";
    case "natureRelatedWelnessAndLeisure":
      return "🚵 Loisirs et bien-être liés à la nature";
    case "forestRelatedProduct":
      return "🪵 Produits issus de la forêt";
    case "invasiveSpeciesRegulation":
      return "🦔 Régulation des espèces invasives";
    case "nitrogenCycle":
      return "🍄 Cycle de l'azote";
    case "pollination":
      return "🐝 Pollinisation";
    case "soilErosion":
      return "🌾 Régulation de l'érosion des sols";
    case "waterCycle":
      return "💧 Cycle de l'eau";
  }
};

const getChartColor = (impactName: EcosystemServiceName) => {
  switch (impactName) {
    case "newStoredCo2Eq":
      return "#FF8910";
    case "soilErosion":
      return "#C3D869";
    case "forestRelatedProduct":
      return "#A27C61";
    case "natureRelatedWelnessAndLeisure":
      return "#75399D";
    case "pollination":
      return "#F6E900";
    case "invasiveSpeciesRegulation":
      return "#2D163C";
    case "nitrogenCycle":
      return "#F83A31";
    case "waterCycle":
      return "#1F60FB";
  }
};

const EcosystemServicesDescription = ({ impactsData }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const data = useMemo(
    () =>
      filterByName(
        impactsData,
        "newStoredCo2Eq",
        "natureRelatedWelnessAndLeisure",
        "forestRelatedProduct",
        "pollination",
        "invasiveSpeciesRegulation",
        "waterCycle",
        "nitrogenCycle",
        "soilErosion",
      ).map(({ total, name }) => ({
        label: getEcosystemServiceDetailsTitle(name),
        color: getChartColor(name),
        value: total,
        name: name,
      })),
    [impactsData],
  );

  const total = sumListWithKey(data, "value");

  return (
    <ModalBody size="large">
      <ModalHeader
        title="🌱 Valeur monétaire des services écosystémiques"
        value={
          data
            ? {
                state: total > 0 ? "success" : "error",
                text: formatMonetaryImpact(total),
                description: "pour l'humanité",
              }
            : undefined
        }
        breadcrumbSegments={[
          mainBreadcrumbSection,
          humanityBreadcrumbSection,
          {
            label: "Valeur monétaire des services écosystémiques",
          },
        ]}
      />
      <ModalGrid>
        <ModalData>
          <ModalColumnPointChart
            format="monetary"
            data={data}
            exportTitle="🌱 Valeur monétaire des services écosystémiques"
          />

          <ModalTable
            caption="Liste des valeurs monétaire des services écosystémiques"
            data={data.map(({ label, value, color, name }) => ({
              label,
              value,
              color,
              onClick: () => {
                updateModalContent({
                  sectionName: "socio_economic",
                  subSectionName: "humanity",
                  impactName: "ecosystemServices",
                  impactDetailsName: name,
                });
              },
            }))}
          />
        </ModalData>

        <ModalContent>
          <p>
            Les services écosystémiques sont définis comme des avantages socio-économiques, directs
            et indirects, retirés par l'homme du fonctionnement (notion de « fonction ») des
            écosystèmes. Chacune des fonctions écologiques peut ainsi être génératrice de services
            écosystémiques comme la lutte contre les îlots de chaleur urbains, la limitation des
            inondations, l'aménagement de jardins récréatifs/partagés.
          </p>
          <p>
            Certains services ont une dimension globale ou mondiale (ex : régulation du climat)
            tandis que d’autres ont plutôt une dimension locale (ex : valeur esthétique). Par
            convention, Bénéfriches considère comme bénéficiaire l’Humanité et non la Société
            française.
          </p>
          <div className="text-center">
            <img
              className="max-w-full"
              src="/img/modals/services-ecosystemiques.png"
              aria-hidden="true"
              alt=""
            />
          </div>
          <ModalTitleTwo>Le principe de monétarisation</ModalTitleTwo>
          <p>
            Lorsqu'on est en présence de biens marchands ou de services, les statistiques peuvent
            fournir un prix, celui qui est constaté sur le marché. Mais ce prix ne correspond pas
            forcément au coût réel du bien pour l'ensemble de la collectivité. Notamment, les
            investissements et/ou les utilisations des biens et services ont également des effets
            qui ne passent pas par le marché, par exemple les effets sur l'environnement, pour
            lesquels il n'existe pas de prix à on est alors obligé de calculer leur coût ou leur
            valeur.
          </p>
          <p>Différentes méthodes générales existent pour les évaluer&nbsp;:</p>
          <div className="text-center">
            <img
              className="max-w-full"
              src="/img/modals/valeurs-usage-services-ecosystemiques.png"
              alt="Valeurs d'usage direct, valeurs d'usage indirect, valeur d'option, valeur de legs, valeur d'existence"
            />
          </div>
          <p>
            La monétarisation constitue ainsi un moyen d'orienter l'ensemble des politiques
            publiques mais aussi les comportements des acteurs privés vers une meilleure prise en
            compte de l'environnement dans leurs choix économiques.
          </p>
          <ModalTitleThree>Comment sont choisies les valeurs monétaires&nbsp;?</ModalTitleThree>
          <p>
            Les sources de monétarisation étant diverses et les valeurs hétérogènes, la priorisation
            suivante est appliquée&nbsp;:
          </p>
          <ul>
            <li>
              Lorsqu'une valeur tutélaire est associée à un effet (par exemple, la baisse
              d'émissions de CO2), celle-ci est appliquée en priorité.
            </li>
            <li>
              En l'absence de valeurs tutélaires, les valeurs issues de rapports publics émanant des
              ministères (rapports France Stratégie, Centre d'analyse Stratégique, Commissariat
              Général au Développement Durable…) sont privilégiées.
            </li>
            <li>
              Si les deux premiers critères ne peuvent être satisfaits, sont privilégiées les
              valeurs issues de la littérature universitaire française.
            </li>
            <li>
              Enfin, en l'absence de sources issues des trois premiers critères retenus, les valeurs
              issues de la littérature internationale sont retenues.
            </li>
          </ul>
          <p>
            NB&nbsp;: une valeur tutélaire, généralement exprimé en €/quantité, est un “référentiel”
            économique, une valeur en comparaison de laquelle les investissements et les décisions
            publiques doivent être évaluées.
          </p>
          <p>
            Illustration&nbsp;: les réductions de gaz à effet de serre, qui coûtent moins cher que
            la valeur tutélaire du carbone, doivent être effectuées en priorité et rapidement afin
            de respecter les engagements climatiques français.
          </p>
          <p>
            <strong>Bénéficiaires</strong> : humanité
          </p>

          <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
          <ul>
            <li>
              <ExternalLink href="https://www.notre-environnement.gouv.fr/themes/evaluation/article/l-evaluation-francaise-des-ecosystemes-et-des-services-ecosystemiques-efese">
                L'évaluation française des écosystèmes et des services écosystémiques (Efese)
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://record-net.org/storage/etudes/17-1021-1A/rapport/Rapport_record17-1021_1A.pdf">
                Mesure de la biodiversité et évaluation des services écosystémiques des milieux
                restaurés
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.wwf.fr/sites/default/files/doc-2017-07/161027_rapport_planete_vivante.pdf">
                Rapport Planète Vivante 2016 - Risque et résilience dans l'Anthropocène
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.ecologie.gouv.fr/sites/default/files/Th%C3%A9ma%20-%20L'analyse%20du%20cycle%20de%20vie%20%20-%20Enjeux%20autour%20de%20la%20mon%C3%A9tarisation.pdf">
                L'analyse de cycle de vie : enjeux autour de sa monétarisation
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.strategie.gouv.fr/publications/guide-de-levaluation-socioeconomique-investissements-publics">
                Guide de l'évaluation socioéconomique des investissements publics
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://fresquedusol.com/">La fresque du sol</ExternalLink>
            </li>
          </ul>
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default EcosystemServicesDescription;
