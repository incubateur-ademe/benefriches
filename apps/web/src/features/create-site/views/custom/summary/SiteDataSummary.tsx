import { FricheActivity, SoilsDistribution } from "shared";

import SiteFeaturesList from "@/features/site-features/views/SiteFeaturesList";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import { Expense } from "../../../domain/siteFoncier.types";

type Props = {
  siteData: {
    id: string;
    address: string;
    ownerName: string;
    tenantName?: string;
    fullTimeJobsInvolved: number;
    accidents: {
      minorInjuries?: number;
      severyInjuries?: number;
      accidentsDeaths?: number;
    } | null;
    expenses: Expense[];
    totalSurfaceArea: number;
    soilsDistribution: SoilsDistribution;
    contaminatedSurfaceArea?: number;
    fricheActivity?: FricheActivity;
    name: string;
    description?: string;
    isFriche: boolean;
  };
  onNext: () => void;
  onBack: () => void;
};

function SiteDataSummary({ siteData, onNext, onBack }: Props) {
  return (
    <WizardFormLayout
      title="Récapitulatif du site"
      instructions="Si des données sont erronées, vous pouvez revenir en arrière pour les modifier."
    >
      <SiteFeaturesList
        id={siteData.id}
        isExpressSite={false}
        address={siteData.address}
        ownerName={siteData.ownerName}
        tenantName={siteData.tenantName}
        fullTimeJobsInvolved={siteData.fullTimeJobsInvolved}
        accidents={siteData.accidents ?? {}}
        expenses={siteData.expenses}
        surfaceArea={siteData.totalSurfaceArea}
        soilsDistribution={siteData.soilsDistribution}
        contaminatedSurfaceArea={siteData.contaminatedSurfaceArea}
        fricheActivity={siteData.fricheActivity}
        name={siteData.name}
        description={siteData.description}
        isFriche={siteData.isFriche}
      />
      <div className="fr-mt-4w">
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </div>
    </WizardFormLayout>
  );
}

export default SiteDataSummary;
