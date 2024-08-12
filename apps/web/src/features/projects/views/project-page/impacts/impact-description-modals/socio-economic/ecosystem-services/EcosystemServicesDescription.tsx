import Button from "@codegouvfr/react-dsfr/Button";
import { ImpactsData } from "../../ImpactDescriptionModalWizard";
import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";
import { getSocioEconomicSectionModalTitle } from "../getTitle";
import { SocioEconomicImpactDescriptionModalId } from "../types";

import { EcosystemServicesImpact } from "@/features/projects/domain/impacts.types";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

type Props = {
  onChangeModalCategoryOpened: (modalCategory: SocioEconomicImpactDescriptionModalId) => void;
  impactsData: ImpactsData;
};

const getDescriptionModalKey = (
  impactName: EcosystemServicesImpact["details"][number]["impact"],
) => {
  switch (impactName) {
    case "nature_related_wellness_and_leisure":
      return "socio-economic.ecosystem-services.nature-related-wellness-and-leisure";
    case "carbon_storage":
      return "socio-economic.ecosystem-services.carbon-storage";
    case "forest_related_product":
      return "socio-economic.ecosystem-services.forest-related-product";
    case "invasive_species_regulation":
      return "socio-economic.ecosystem-services.invasive-species-regulation";
    case "nitrogen_cycle":
      return "socio-economic.ecosystem-services.nitrogen-cycle";
    case "pollination":
      return "socio-economic.ecosystem-services.pollinisation";
    case "soil_erosion":
      return "socio-economic.ecosystem-services.soil-erosion";
    case "water_cycle":
      return "socio-economic.ecosystem-services.water-cycle";
  }
};

const EcosystemServicesDescription = ({ onChangeModalCategoryOpened, impactsData }: Props) => {
  const ecosystemServicesImpact = impactsData.socioeconomic.impacts.find(
    (impact): impact is EcosystemServicesImpact => impact.impact === "ecosystem_services",
  );

  const ecosystemServicesDetailsKeys = (ecosystemServicesImpact?.details ?? []).map(({ impact }) =>
    getDescriptionModalKey(impact),
  );

  return (
    <>
      <p>
        Les services écosystémiques sont définis comme des avantages socio-économiques, directs et
        indirects, retirés par l'homme du fonctionnement (notion de « fonction ») des écosystèmes.
        Chacune des fonctions écologiques peut ainsi être génératrice de services écosystémiques
        comme la lutte contre les îlots de chaleur urbains, la limitation des inondations,
        l'aménagement de jardins récréatifs/partagés.
      </p>
      <div className="tw-text-center">
        <img
          src="/img/modals/services-ecosystemiques.png"
          alt="Schéma illustratif des services écosystémiques"
        />
      </div>
      <ModalTitleTwo>Le principe de monétarisation</ModalTitleTwo>
      <p>
        Lorsqu'on est en présence de biens marchands ou de services, les statistiques peuvent
        fournir un prix, celui qui est constaté sur le marché. Mais ce prix ne correspond pas
        forcément au coût réel du bien pour l'ensemble de la collectivité. Notamment, les
        investissements et/ou les utilisations des biens et services ont également des effets qui ne
        passent pas par le marché, par exemple les effets sur l'environnement, pour lesquels il
        n'existe pas de prix à on est alors obligé de calculer leur coût ou leur valeur.
      </p>
      <p>Différentes méthodes générales existent pour les évaluer&nbsp;:</p>
      <div className="tw-text-center">
        <img
          src="/img/modals/valeurs-usage-services-ecosystemiques.png"
          alt="Valeurs d'usage direct, valeurs d'usage indirect, valeur d'option, valeur de legs, valeur d'existence"
        />
      </div>
      <p>
        La monétarisation constitue ainsi un moyen d'orienter l'ensemble des politiques publiques
        mais aussi les comportements des acteurs privés vers une meilleure prise en compte de
        l'environnement dans leurs choix économiques.
      </p>
      <ModalTitleThree>Comment sont choisies les valeurs monétaires&nbsp;?</ModalTitleThree>
      <p>
        Les sources de monétarisation étant diverses et les valeurs hétérogènes, la priorisation
        suivante est appliquée&nbsp;:
      </p>
      <ul>
        <li>
          Lorsqu'une valeur tutélaire est associée à un effet (par exemple, la baisse d'émissions de
          CO2), celle-ci est appliquée en priorité.
        </li>
        <li>
          En l'absence de valeurs tutélaires, les valeurs issues de rapports publics émanant des
          ministères (rapports France Stratégie, Centre d'analyse Stratégique, Commissariat Général
          au Développement Durable…) sont privilégiées.
        </li>
        <li>
          Si les deux premiers critères ne peuvent être satisfaits, sont privilégiées les valeurs
          issues de la littérature universitaire française.
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
        Illustration&nbsp;: les réductions de gaz à effet de serre, qui coûtent moins cher que la
        valeur tutélaire du carbone, doivent être effectuées en priorité et rapidement afin de
        respecter les engagements climatiques français.
      </p>
      <p>
        <strong>Bénéficiaires</strong> : société humaine
      </p>

      <div className="tw-flex tw-flex-col">
        {ecosystemServicesDetailsKeys.map((key) => (
          <Button
            key={key}
            onClick={() => {
              onChangeModalCategoryOpened(key);
            }}
            priority="tertiary no outline"
          >
            {getSocioEconomicSectionModalTitle(key)}
          </Button>
        ))}
      </div>

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
    </>
  );
};

export default EcosystemServicesDescription;
