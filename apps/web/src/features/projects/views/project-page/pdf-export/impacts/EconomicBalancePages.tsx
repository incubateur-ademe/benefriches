import { Link, Text, View } from "@react-pdf/renderer";

import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";

import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
} from "../../impacts/getImpactLabel";
import ImpactsGroupByActor from "../components/ImpactsGroupByActor";
import ImpactsSection from "../components/ImpactsSection";
import ListItem from "../components/ListItem";
import PdfPage from "../components/PdfPage";
import PdfPageSubtitle from "../components/PdfPageSubtitle";
import PdfPageTitle from "../components/PdfPageTitle";
import { useSectionLabel } from "../context";
import { pageIds } from "../pageIds";
import { tw } from "../styles";

type Props = {
  impact: EconomicBalance;
  evaluationPeriodInYears: number;
};

export default function EconomicBalanceSection({ impact, evaluationPeriodInYears }: Props) {
  const impactsSectionLabel = useSectionLabel("impacts");
  const economicBalanceSectionLabel = useSectionLabel("impacts-economic-balance");
  const { total, economicBalance, bearer } = impact;
  return (
    <PdfPage id={pageIds["impacts-economic-balance"]}>
      <PdfPageTitle>{impactsSectionLabel}</PdfPageTitle>
      <Text style={tw("text-lg text-[#000091] font-bold")}>Sur {evaluationPeriodInYears} ans</Text>
      <Text style={tw("text-sm mb-4")}>(durée à partir de la mise en service du projet)</Text>
      <PdfPageSubtitle>{economicBalanceSectionLabel}</PdfPageSubtitle>
      <View style={tw("mb-4")}>
        <Text>
          Le bilan d'opération regroupe l'ensemble des recettes et des dépenses d'une opération
          d'aménagement ou de construction. Son périmètre est donc circonscrit au porteur du projet.
        </Text>
        <Text style={tw("my-2")}>
          Bénéficiaires / déficitaires : exploitant, aménageur, futur propriétaire
        </Text>
        <Text style={tw("mb-1")}>Aller plus loin :</Text>
        <View>
          <ListItem>
            <Link
              style={tw("text-sm")}
              src="https://outil2amenagement.cerema.fr/outils/bilan-amenageur"
            >
              Outil aménagement CEREMA
            </Link>
          </ListItem>
          <ListItem>
            <Link
              style={tw("text-sm")}
              src="https://www.reseaunationalamenageurs.logement.gouv.fr/IMG/pdf/2016-02-22_-_ApprocheSCET-OptimisationEconomiqueOperationsAmenagement.pdf"
            >
              L'optimisation des dépenses des opérations d'aménagement
            </Link>
          </ListItem>
        </View>
      </View>
      <ImpactsSection title="Bilan de l'opération" total={total} valueType="monetary" isMain>
        {economicBalance.map(({ name, value, details = [] }) => (
          <ImpactsGroupByActor
            key={name}
            label={getEconomicBalanceImpactLabel(name)}
            actors={[
              {
                label: bearer ?? "Aménageur",
                value,
                details: details.map(({ name: detailsName, value: detailsValue }) => ({
                  label: getEconomicBalanceDetailsImpactLabel(name, detailsName),
                  value: detailsValue,
                })),
              },
            ]}
            type="monetary"
          />
        ))}
      </ImpactsSection>
    </PdfPage>
  );
}
