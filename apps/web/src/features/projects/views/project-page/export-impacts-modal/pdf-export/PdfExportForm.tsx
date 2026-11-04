import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { typedObjectKeys } from "shared";

import { type PdfExportSectionId, type PdfExportSectionSelection } from "./pdfExportSections";

const PDF_EXPORT_SECTION_OPTIONS: Record<
  PdfExportSectionId,
  { label: string; description: string; position: number }
> = {
  economicBalance: {
    label: "⚖️ Bilan de l'opération",
    description: "Recettes et dépenses du projet d'aménagement",
    position: 1,
  },
  socioEconomicImpacts: {
    label: "💰 Impacts socio-économiques",
    description:
      "Dépenses liées à la friche évités, recettes fiscales, valeur monétaire de la décarbonation...",
    position: 2,
  },
  socialImpacts: {
    label: "🧑 Impacts sociaux",
    description:
      "Emplois créés ou détruits, temps passé en moins dans les transports pour la population...",
    position: 3,
  },
  environmentalImpacts: {
    label: "🌳 Impacts environnementaux",
    description: "CO2 stocké ou évité, surfaces dépolluées ou désimperméabilisées...",
    position: 4,
  },
  siteFeatures: {
    label: "Caractéristiques du site",
    description: "Localisation, sols, pollution, gestion et sécursation de la friche...",
    position: 5,
  },
  projectFeatures: {
    label: "Caractéristiques du projet",
    description: "Aménagement des espaces, bâtiments, dépenses et recettes du projet...",
    position: 6,
  },
  aboutBenefriches: {
    label: "Notice explicative",
    description:
      "Questions fréquentes sur le fonctionnement de Bénéfriches et son calcul des impacts",
    position: 7,
  },
};

type Props = {
  selectedSections: PdfExportSectionSelection;
  onSectionChange: (key: PdfExportSectionId, checked: boolean) => void;
};

export default function PdfExportForm({ selectedSections, onSectionChange }: Props) {
  return (
    <Checkbox
      legend="Quelles informations souhaitez-vous inclure dans le PDF ?"
      options={typedObjectKeys(PDF_EXPORT_SECTION_OPTIONS)
        .toSorted(
          (a, b) => PDF_EXPORT_SECTION_OPTIONS[a].position - PDF_EXPORT_SECTION_OPTIONS[b].position,
        )
        .map((sectionKey) => ({
          label: PDF_EXPORT_SECTION_OPTIONS[sectionKey].label,
          hintText: PDF_EXPORT_SECTION_OPTIONS[sectionKey].description,
          nativeInputProps: {
            checked: selectedSections[sectionKey],
            onChange: (e) => {
              onSectionChange(sectionKey, e.target.checked);
            },
          },
        }))}
    />
  );
}
