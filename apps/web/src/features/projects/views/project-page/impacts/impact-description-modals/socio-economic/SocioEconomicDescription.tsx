import Button from "@codegouvfr/react-dsfr/Button";
import { useContext } from "react";

import { getSocioEconomicProjectImpactsByActor } from "@/features/projects/domain/projectImpactsSocioEconomic";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { getSocioEconomicImpactColor } from "../../getImpactColor";
import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import { ModalDataProps } from "../ImpactModalDescription";
import ModalTable from "../shared/ModalTable";
import ModalColumnSeriesChart from "../shared/modal-charts/ModalColumnSeriesChart";

type Props = {
  impactsData: ModalDataProps["impactsData"];
};

const SocioEconomicDescription = ({ impactsData }: Props) => {
  const impactsByActor = getSocioEconomicProjectImpactsByActor(impactsData.socioeconomic.impacts);
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const impactList = impactsByActor.map(({ name, impacts }) => ({
    label: getActorLabel(name),
    values: impacts.map(({ value, name }) => ({
      value,
      label: getSocioEconomicImpactLabel(name),
      color: getSocioEconomicImpactColor(name),
      name,
    })),
  }));

  return (
    <ModalBody size="large">
      <ModalHeader
        title="🌍 Impacts socio-économiques"
        value={{
          state: impactsData.socioeconomic.total > 0 ? "success" : "error",
          text: formatMonetaryImpact(impactsData.socioeconomic.total),
          description: "répartis entre plusieurs bénéficiaires",
        }}
        breadcrumbSegments={[{ label: "Impacts socio-économiques" }]}
      />
      <ModalGrid>
        <ModalData>
          <ModalColumnSeriesChart
            format="monetary"
            data={impactList}
            exportTitle="🌍 Impacts socio-économiques"
          />

          <ModalTable
            caption="Liste des impacts socio-économiques"
            data={impactList
              .map(({ label: actor, values }) =>
                values.map(({ value, label, name, color }) => ({
                  label,
                  color,
                  value,
                  actor,
                  onClick: () => {
                    updateModalContent({
                      sectionName: "socio_economic",
                      impactName: name,
                    });
                  },
                })),
              )
              .flat()}
          />
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
            <li>
              <Button
                className="tw-px-1"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "economic_direct",
                  });
                }}
              >
                💰 les impacts économiques directs
              </Button>
            </li>
            <li>
              <Button
                className="tw-px-1"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "economic_indirect",
                  });
                }}
              >
                🪙 les impacts économiques indirects
              </Button>
            </li>
            <li>
              <Button
                className="tw-px-1"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "social_monetary",
                  });
                }}
              >
                🚶 les impacts sociaux monétarisés
              </Button>
            </li>
            <li>
              <Button
                className="tw-px-1"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "environmental_monetary",
                  });
                }}
              >
                🌳 les impacts environnementaux monétarisés
              </Button>
            </li>
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
