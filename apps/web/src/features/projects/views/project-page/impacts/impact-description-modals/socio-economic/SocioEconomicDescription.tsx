import Button from "@codegouvfr/react-dsfr/Button";
import { useContext, useMemo } from "react";
import { sumListWithKey, typedObjectEntries } from "shared";

import { IndirectEconomicImpactsByBearerAndGroupCategory } from "@/features/projects/domain/groupIndirectImpactsByBearer";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import {
  HUMANITY_IMPACTS_CATEGORIES,
  LOCAL_AUTHORITY_IMPACTS_CATEGORIES,
  LOCAL_PEOPLE_OR_COMPANY_IMPACTS_CATEGORIES,
} from "@/features/projects/views/shared/impacts/impactGroupCategory";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalGroupTable from "../shared/ModalGroupTable";
import ModalColumnSeriesChart from "../shared/modal-charts/ModalColumnSeriesChart";

type Props = {
  impactsData: {
    byBearerAndCategory: IndirectEconomicImpactsByBearerAndGroupCategory;
    total: number;
  };
};

const getLabelForBearer = (name: "localAuthority" | "localPeopleOrCompany" | "humanity") => {
  switch (name) {
    case "localAuthority":
      return "Collectivité";
    case "localPeopleOrCompany":
      return "Riverains";
    case "humanity":
      return "Société française et mondiale";
  }
};

const SocioEconomicDescription = ({ impactsData }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const { total, localAuthority, localPeopleOrCompany, humanity } = impactsData.byBearerAndCategory;
  const { total: totalLocalAuthority, ...localAuthorityList } = localAuthority;
  const { total: totalLocalPeopleOrCompany, ...localPeopleOrCompanyList } = localPeopleOrCompany;
  const { total: totalHumanity, ...humanityList } = humanity;

  const impactList = useMemo(
    () =>
      [
        {
          label: getLabelForBearer("localAuthority"),
          total: totalLocalAuthority,

          onClick: () => {
            updateModalContent({
              sectionName: "socio_economic",
              subSectionName: "localAuthority",
            });
          },
          values: typedObjectEntries(localAuthorityList)
            .map(([category, items = []]) => ({
              value: sumListWithKey(items, "total"),
              label: LOCAL_AUTHORITY_IMPACTS_CATEGORIES[category].label,
              color: LOCAL_AUTHORITY_IMPACTS_CATEGORIES[category].color,
              name: category,
            }))
            .filter((item) => item.value !== 0),
        },
        {
          label: getLabelForBearer("localPeopleOrCompany"),
          total: totalLocalPeopleOrCompany,
          onClick: () => {
            updateModalContent({
              sectionName: "socio_economic",
              subSectionName: "localPeopleOrCompany",
            });
          },
          values: typedObjectEntries(localPeopleOrCompanyList)
            .map(([category, items = []]) => ({
              value: sumListWithKey(items, "total"),
              label: LOCAL_PEOPLE_OR_COMPANY_IMPACTS_CATEGORIES[category].label,
              color: LOCAL_PEOPLE_OR_COMPANY_IMPACTS_CATEGORIES[category].color,
              name: category,
            }))
            .filter((item) => item.value !== 0),
        },
        {
          label: getLabelForBearer("humanity"),
          total: totalHumanity,

          onClick: () => {
            updateModalContent({
              sectionName: "socio_economic",
              subSectionName: "humanity",
            });
          },
          values: typedObjectEntries(humanityList)
            .map(([category, items = []]) => ({
              category: category,
              value: sumListWithKey(items, "total"),
              label: HUMANITY_IMPACTS_CATEGORIES[category].label,
              color: HUMANITY_IMPACTS_CATEGORIES[category].color,
              name: category,
            }))
            .filter((item) => item.value !== 0),
        },
      ].filter((item) => item.values.length > 0),
    [
      localPeopleOrCompanyList,
      humanityList,
      localAuthorityList,
      totalLocalAuthority,
      totalLocalPeopleOrCompany,
      totalHumanity,
      updateModalContent,
    ],
  );

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
          <ModalColumnSeriesChart
            format="monetary"
            data={impactList}
            exportTitle="🌍 Impacts socio-économiques"
          />

          <ModalGroupTable caption="Liste des impacts socio-économiques" data={impactList} />
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
          Les impacts socio-économiques sont classés en 3 catégories :
          <ul>
            <li>
              <Button
                className="px-1"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "localAuthority",
                  });
                }}
              >
                🏛️ les impacts économiques pour la collectivité locale
              </Button>
            </li>
            <li>
              <Button
                className="px-1"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "localPeopleOrCompany",
                  });
                }}
              >
                🏘️ les impacts économiques pour les riverains
              </Button>
            </li>
            <li>
              <Button
                className="px-1"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "humanity",
                  });
                }}
              >
                🌍️ les impacts économiques pour la société française et mondiale
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
