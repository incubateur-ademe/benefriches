import { Document } from "@react-pdf/renderer";

import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { EnvironmentalImpact } from "@/features/projects/domain/projectImpactsEnvironmental";
import { SocialImpact } from "@/features/projects/domain/projectImpactsSocial";
import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";
import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import { SiteFeatures } from "@/features/sites/core/site.types";

import type { PdfExportSectionSelection } from "../export-impacts/pdf-export/pdfExportSections";
import AboutBenefrichesPdfPage from "./about-benefriches/AboutBenefrichesPdfPage";
import ProjectPdfExportCoverPage from "./components/CoverPage";
import { ExportImpactsContext } from "./context";
import ProjectImpactsPdfPage from "./impacts/ProjectImpactsPdfPage";
import ProjectFeaturesPdfPage from "./project-features/ProjectFeaturesPdfPage";
import SiteFeaturesPdfPage from "./site-features/SiteFeaturesPdfPage";

export type Props = {
  siteFeatures: SiteFeatures;
  projectFeatures: ProjectFeatures;
  evaluationPeriodInYears: number;
  selectedSections: PdfExportSectionSelection;
  impacts: {
    economicBalance: EconomicBalance;
    environment: EnvironmentalImpact[];
    socioEconomic: SocioEconomicDetailedImpact;
    social: SocialImpact[];
  };
};

export default function ProjectPdfExport({
  siteFeatures,
  projectFeatures,
  evaluationPeriodInYears,
  selectedSections,
  impacts,
}: Props) {
  return (
    <ExportImpactsContext
      value={{
        projectName: projectFeatures.name,
        siteName: siteFeatures.name,
        selectedSections,
      }}
    >
      <Document
        author="Bénéfriches - ADEME"
        title={`Export Bénéfriches - Projet ${projectFeatures.name} - ${new Date().toLocaleDateString()}`}
        language="fr"
      >
        <ProjectPdfExportCoverPage />
        {selectedSections.siteFeatures && <SiteFeaturesPdfPage siteFeatures={siteFeatures} />}
        {selectedSections.projectFeatures && (
          <ProjectFeaturesPdfPage projectFeatures={projectFeatures} />
        )}
        <ProjectImpactsPdfPage
          impacts={impacts}
          evaluationPeriodInYears={evaluationPeriodInYears}
          showEconomicBalance={selectedSections.economicBalance}
          showSocioEconomicImpacts={selectedSections.socioEconomicImpacts}
          showSocialImpacts={selectedSections.socialImpacts}
          showEnvironmentalImpacts={selectedSections.environmentalImpacts}
        />
        {selectedSections.aboutBenefriches && <AboutBenefrichesPdfPage />}
      </Document>
    </ExportImpactsContext>
  );
}
