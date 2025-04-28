import {
  FricheActivity,
  SiteNature,
  SiteYearlyExpense,
  SiteYearlyIncome,
  SoilsDistribution,
} from "shared";

import SiteFeaturesList from "@/features/site-features/views/SiteFeaturesList";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  siteData: {
    id: string;
    address: string;
    ownerName: string;
    tenantName?: string;
    accidents: {
      minorInjuries?: number;
      severyInjuries?: number;
      accidentsDeaths?: number;
    } | null;
    expenses: SiteYearlyExpense[];
    incomes: SiteYearlyIncome[];
    totalSurfaceArea: number;
    soilsDistribution: SoilsDistribution;
    contaminatedSurfaceArea?: number;
    fricheActivity?: FricheActivity;
    name: string;
    description?: string;
    nature: SiteNature;
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
        nature={siteData.nature}
        isExpressSite={false}
        address={siteData.address}
        ownerName={siteData.ownerName}
        tenantName={siteData.tenantName}
        accidents={siteData.accidents ?? {}}
        expenses={siteData.expenses}
        incomes={siteData.incomes}
        surfaceArea={siteData.totalSurfaceArea}
        soilsDistribution={siteData.soilsDistribution}
        contaminatedSurfaceArea={siteData.contaminatedSurfaceArea}
        fricheActivity={siteData.fricheActivity}
        name={siteData.name}
        description={siteData.description}
      />
      <div className="tw-mt-8">
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </div>
    </WizardFormLayout>
  );
}

export default SiteDataSummary;
