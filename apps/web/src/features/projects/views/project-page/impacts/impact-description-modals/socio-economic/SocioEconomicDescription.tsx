import { getDetailedSocioEconomicProjectImpacts } from "@/features/projects/domain/projectImpactsSocioEconomic";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import SocioEconomicImpactSection from "../../list-view/sections/SocioEconomicImpactSection";
import { ImpactsData } from "../ImpactModalDescriptionProvider";
import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";
import ModalTitleTwo from "../shared/ModalTitleTwo";

type Props = {
  impactsData: ImpactsData;
};

const SocioEconomicDescription = ({ impactsData }: Props) => {
  const { economicDirect, economicIndirect, environmentalMonetary, socialMonetary, total } =
    getDetailedSocioEconomicProjectImpacts(impactsData);

  return (
    <ModalBody>
      <ModalHeader
        title="🌍 Impacts socio-économiques"
        value={{
          state: total > 0 ? "success" : "error",
          text: formatMonetaryImpact(total),
          description: "répartis entre plusieurs bénéficiaires",
        }}
        breadcrumbSegments={[{ label: "Impacts socio-économiques" }]}
      />
      <ModalContent>
        <p>
          L'évaluation socio-économique a pour objet d'apprécier l'intérêt d'un projet ou d'un
          investissement pour la collectivité.
        </p>
        <p>
          Elle est réalisée en analysant les effets du projet (ses impacts) sur les différents types
          d'acteurs directement ou indirectement concernés, que ces impacts soient positifs ou
          négatifs. On parle alors d'impacts socio-économiques.
        </p>
        <p>
          S'agissant de projets de renouvellement urbain, les impacts sont nombreux et de
          différentes natures :
        </p>
        <ul>
          <li>
            environnementaux (ex : maintien de capacité de stockage de carbone dans les sols,
            création d'ilots de fraicheur),
          </li>
          <li>
            économiques (ex : réduction de dépenses futures en entretien de réseaux ou voiries),
          </li>
          <li>
            sociaux (ex : création d'aménités, amélioration de l'attractivité d'un quartier,
            réduction du besoin en en déplacements, etc.)
          </li>
        </ul>
        <p>
          Les différents indicateurs utilisés dans Bénéfriches sont présentés ci-dessous et leurs
          méthodes de calcul sont détaillées au niveau de chacun.
        </p>

        <div className="tw-flex tw-flex-col tw-gap-4">
          <SocioEconomicImpactSection
            sectionName="economic_direct"
            {...economicDirect}
            initialShowSectionContent={false}
            noMarginBottom
          />
          <SocioEconomicImpactSection
            sectionName="economic_indirect"
            {...economicIndirect}
            initialShowSectionContent={false}
            noMarginBottom
          />
          <SocioEconomicImpactSection
            sectionName="social_monetary"
            {...socialMonetary}
            initialShowSectionContent={false}
            noMarginBottom
          />
          <SocioEconomicImpactSection
            sectionName="environmental_monetary"
            {...environmentalMonetary}
            initialShowSectionContent={false}
            noMarginBottom
          />
        </div>

        <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
        <ul>
          <li>
            Évaluer les bénéfices socio-économiques de la reconversion de friches pour lutter contre
            l'artificialisation :{" "}
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
    </ModalBody>
  );
};

export default SocioEconomicDescription;
