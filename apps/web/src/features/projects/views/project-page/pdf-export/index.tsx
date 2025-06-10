import { Document } from "@react-pdf/renderer";

import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { EnvironmentalImpact } from "@/features/projects/domain/projectImpactsEnvironmental";
import { SocialImpact } from "@/features/projects/domain/projectImpactsSocial";
import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";
import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import { SiteFeatures } from "@/features/site-features/core/siteFeatures";

import ProjectPdfExportCoverPage from "./components/CoverPage";
import { ExportImpactsContext } from "./context";
import ProjectImpactsPdfPage from "./impacts/ProjectImpactsPdfPage";
import ProjectFeaturesPdfPage from "./project-features/ProjectFeaturesPdfPage";
import SiteFeaturesPdfPage from "./site-features/SiteFeaturesPdfPage";

type Props = {
  siteFeatures: SiteFeatures;
  projectFeatures: ProjectFeatures;
  evaluationPeriodInYears: number;
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
  impacts,
}: Props) {
  return (
    <ExportImpactsContext.Provider
      value={{ projectName: projectFeatures.name, siteName: siteFeatures.name }}
    >
      <Document
        author="Bénéfriches - ADEME"
        title={`Export Bénéfriches - Projet ${projectFeatures.name} - ${new Date().toLocaleDateString()}`}
        language="fr"
      >
        <ProjectPdfExportCoverPage />
        <ProjectImpactsPdfPage
          impacts={impacts}
          evaluationPeriodInYears={evaluationPeriodInYears}
        />
        <ProjectFeaturesPdfPage projectFeatures={projectFeatures} />
        <SiteFeaturesPdfPage siteFeatures={siteFeatures} />
      </Document>
    </ExportImpactsContext.Provider>
  );
}
