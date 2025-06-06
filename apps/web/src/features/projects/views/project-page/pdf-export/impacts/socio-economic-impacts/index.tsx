import { SocioEconomicDetailedImpact } from "@/features/projects/domain/projectImpactsSocioEconomic";

import PdfPage from "../../components/PdfPage";
import SocioEconomicImpactsIntroductionPage from "./Introduction";
import SocioEconomicImpactsSection from "./SocioEconomicImpactsSection";

type Props = {
  impacts: SocioEconomicDetailedImpact;
};

export default function SocioEconomicImpactsPages({ impacts }: Props) {
  const { economicDirect, economicIndirect, environmentalMonetary, socialMonetary } = impacts;

  return (
    <>
      <SocioEconomicImpactsIntroductionPage />
      <PdfPage>
        <SocioEconomicImpactsSection sectionName="economic_direct" {...economicDirect} />
        <SocioEconomicImpactsSection sectionName="economic_indirect" {...economicIndirect} />
      </PdfPage>
      <PdfPage>
        <SocioEconomicImpactsSection sectionName="social_monetary" {...socialMonetary} />
        <SocioEconomicImpactsSection
          sectionName="environmental_monetary"
          {...environmentalMonetary}
        />
      </PdfPage>
    </>
  );
}
