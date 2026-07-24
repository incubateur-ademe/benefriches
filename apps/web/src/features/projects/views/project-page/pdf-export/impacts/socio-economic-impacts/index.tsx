import { SocioEconomicImpactsByBearerListView } from "@/features/projects/core/projectImpactsSocioEconomic";

import PdfPage from "../../components/PdfPage";
import SocioEconomicImpactsIntroductionPage from "./Introduction";
import SocioEconomicImpactsSection from "./SocioEconomicImpactsSection";

type Props = {
  impacts: SocioEconomicImpactsByBearerListView;
};

export default function SocioEconomicImpactsPages({ impacts }: Props) {
  return (
    <>
      <SocioEconomicImpactsIntroductionPage />
      <PdfPage>
        <SocioEconomicImpactsSection sectionName="localAuthority" impacts={impacts} />
        <SocioEconomicImpactsSection sectionName="localPeopleOrCompany" impacts={impacts} />
      </PdfPage>
      <PdfPage>
        <SocioEconomicImpactsSection sectionName="humanity" impacts={impacts} />
      </PdfPage>
    </>
  );
}
