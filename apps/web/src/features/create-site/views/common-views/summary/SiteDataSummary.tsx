import type {
  AgriculturalOperationActivity,
  FricheActivity,
  NaturalAreaType,
  SiteNature,
  SiteYearlyExpense,
  SiteYearlyIncome,
  SoilsDistribution,
} from "shared";

import type { SiteFeatures } from "@/features/sites/core/site.types";
import SiteFeaturesList from "@/features/sites/views/features/SiteFeaturesList";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type SiteData = {
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
  agriculturalOperationActivity?: AgriculturalOperationActivity;
  naturalAreaType?: NaturalAreaType;
};

const toSiteFeatures = (siteData: SiteData): SiteFeatures => {
  const base = {
    id: siteData.id,
    isExpressSite: false as const,
    address: siteData.address,
    ownerName: siteData.ownerName,
    tenantName: siteData.tenantName,
    expenses: siteData.expenses,
    incomes: siteData.incomes,
    surfaceArea: siteData.totalSurfaceArea,
    soilsDistribution: siteData.soilsDistribution,
    name: siteData.name,
    description: siteData.description,
  };

  switch (siteData.nature) {
    case "FRICHE":
      return {
        ...base,
        nature: "FRICHE",
        contaminatedSurfaceArea: siteData.contaminatedSurfaceArea,
        accidents: siteData.accidents ?? {},
        fricheActivity: siteData.fricheActivity,
      };
    case "AGRICULTURAL_OPERATION":
      return {
        ...base,
        nature: "AGRICULTURAL_OPERATION",
        agriculturalOperationActivity: siteData.agriculturalOperationActivity!,
      };
    case "NATURAL_AREA":
      return {
        ...base,
        nature: "NATURAL_AREA",
        naturalAreaType: siteData.naturalAreaType!,
      };
    case "URBAN_ZONE":
      return {
        ...base,
        nature: "URBAN_ZONE",
        contaminatedSurfaceArea: siteData.contaminatedSurfaceArea,
      };
  }
};

type Props = {
  siteData: SiteData;
  onNext: () => void;
  onBack: () => void;
};

function SiteDataSummary({ siteData, onNext, onBack }: Props) {
  return (
    <WizardFormLayout title="Récapitulatif du site">
      <SiteFeaturesList siteFeatures={toSiteFeatures(siteData)} />
      <div className="mt-8">
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </div>
    </WizardFormLayout>
  );
}

export default SiteDataSummary;
