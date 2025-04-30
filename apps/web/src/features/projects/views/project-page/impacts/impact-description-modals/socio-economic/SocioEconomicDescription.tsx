import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import SocioEconomicImpactSection from "../../list-view/sections/SocioEconomicImpactSection";
import ModalBarColoredChart from "../shared/ModalBarColoredChart";
import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalData from "../shared/ModalData";
import ModalGrid from "../shared/ModalGrid";
import ModalHeader from "../shared/ModalHeader";
import ModalTitleTwo from "../shared/ModalTitleTwo";

type Props = {
  impactsData: SocioEconomicDetailedImpact;
};

const SocioEconomicDescription = ({ impactsData }: Props) => {
  const { economicDirect, economicIndirect, environmentalMonetary, socialMonetary, total } =
    impactsData;
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🌍 Impacts socio-économiques"
        value={{
          state: total > 0 ? "success" : "error",
          text: formatMonetaryImpact(total),
          description: "répartis entre plusieurs bénéficiaires",
        }}
        breadcrumbSegments={[{ label: "Impacts socio-économiques" }]}
      />
      <ModalGrid>
        <ModalData>
          <ModalBarColoredChart
            data={[
              {
                label: "💰 Economiques directs",
                color: "#7A13EB",
                value: economicDirect.total,
              },
              {
                label: "🪙 Economiques indirects",
                color: "#1243EB",
                value: economicIndirect.total,
              },
              {
                label: "🚶‍♀️ Impacts sociaux monétarisés",
                color: "#13BAEC",
                value: socialMonetary.total,
              },
              {
                label: "🌳 Environnementaux monétarisés",
                color: "#14EA81",
                value: environmentalMonetary.total,
              },
            ]}
          />
          <div className="tw-flex tw-flex-col tw-gap-4">
            <SocioEconomicImpactSection
              sectionName="economic_direct"
              {...economicDirect}
              initialShowSectionContent={false}
              noMarginBottom
              inDialog
            />
            <SocioEconomicImpactSection
              sectionName="economic_indirect"
              {...economicIndirect}
              initialShowSectionContent={false}
              noMarginBottom
              inDialog
            />
            <SocioEconomicImpactSection
              sectionName="social_monetary"
              {...socialMonetary}
              initialShowSectionContent={false}
              noMarginBottom
              inDialog
            />
            <SocioEconomicImpactSection
              sectionName="environmental_monetary"
              {...environmentalMonetary}
              initialShowSectionContent={false}
              noMarginBottom
              inDialog
            />
          </div>
        </ModalData>
        <ModalContent>
          <p>
            L'évaluation socio-économique a pour objet d'apprécier l'intérêt d'un projet ou d'un
            investissement pour la collectivité.
          </p>
          <p>
            Elle est réalisée en analysant les effets du projet (ses impacts) sur les différents
            types d'acteurs directement ou indirectement concernés, que ces impacts soient positifs
            ou négatifs. On parle alors d'impacts socio-économiques.
          </p>
          <p>
            S’agissant de projets de renouvellement urbain, les impacts sont nombreux et de
            différentes natures : environnementaux (ex : maintien de capacité de stockage de carbone
            dans les sols, création d’ilots de fraicheur), économiques (ex : réduction de dépenses
            futures en entretien de réseaux ou voiries), sociaux (ex : création d’aménités,
            amélioration de l’attractivité d’un quartier, réduction du besoin en en déplacements,
            etc.).
          </p>
          <p>
            Afin de pouvoir comparer les valeurs de ces indicateurs au bilan de l’opération (qui est
            exprimé en €), il est nécessaire de convertir celles qui ne sont naturellement pas
            exprimées en € (ex : tonnes de CO2 évitées, surfaces désimperméabilisées) en valeurs
            monétaires. On parle alors de ”monétarisation”.
          </p>
          <p>
            Les différents indicateurs utilisés dans Bénéfriches sont présentés ci-contre et leurs
            méthodes de calcul sont détaillées au niveau de chacun.
          </p>
          Les impacts socio-économiques sont classés en 4 catégories :
          <ul>
            <li>les impacts économiques directs</li>
            <li>les impacts économiques indirects</li>
            <li>les impacts sociaux monétarisés</li>
            <li>les impacts environnementaux monétarisés</li>
          </ul>
          <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
          <ul>
            <li>
              Évaluer les bénéfices socio-économiques de la reconversion de friches pour lutter
              contre l'artificialisation :{" "}
              <ExternalLink href="https://librairie.ademe.fr/changement-climatique-et-energie/3772-evaluer-les-benefices-socio-economiques-de-la-reconversion-de-friches-pour-lutter-contre-l-artificialisation-outil-benefriches.html">
                Outil Bénéfriches.
              </ExternalLink>
            </li>
            <li>
              Évaluation socioéconomique des opérations d'aménagement urbain :{" "}
              <ExternalLink href="https://www.strategie.gouv.fr/publications/referentiel-methodologique-de-levaluation-socioeconomique-operations-damenagement">
                Référentiel&nbsp;méthodologique
              </ExternalLink>
            </li>
          </ul>
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default SocioEconomicDescription;
