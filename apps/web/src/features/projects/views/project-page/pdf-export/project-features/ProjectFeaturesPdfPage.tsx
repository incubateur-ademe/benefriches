import {
  getLabelForDevelopmentPlanCategory,
  getLabelForRenewableEnergyProductionType,
} from "@/features/create-project/views/projectTypeLabelMapping";
import { ProjectFeatures } from "@/features/projects/domain/projects.types";

import DataLine from "../components/DataLine";
import FeaturesSection from "../components/FeaturesSection";
import PdfPage from "../components/PdfPage";
import PdfPageTitle from "../components/PdfPageTitle";
import { useSectionLabel } from "../context";
import { pageIds } from "../pageIds";
import DevelopmentPlanFeatures from "./development-plan/DevelopmentPlanFeaturesPdf";
import ProjectExpensesAndIncomesPdf from "./expenses-and-incomes/ProjectExpensesAndIncomesPdf";
import ProjectSchedulePdf from "./schedule/ProjectSchedulePdf";
import ProjectStakeholdersPdf from "./stakeholders/ProjectStakeholdersPdf";

type Props = {
  projectFeatures: ProjectFeatures;
};

export default function ProjectFeaturesPdfPage({ projectFeatures }: Props) {
  const sectionLabel = useSectionLabel("project-features");

  return (
    <>
      <PdfPage id={pageIds["project-features"]}>
        <PdfPageTitle>{sectionLabel}</PdfPageTitle>
        <FeaturesSection title="🏗️️ Type de projet">
          <DataLine
            label="Type d'aménagement"
            labelClassName="font-bold"
            value={
              projectFeatures.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
                ? getLabelForDevelopmentPlanCategory("RENEWABLE_ENERGY")
                : getLabelForDevelopmentPlanCategory(projectFeatures.developmentPlan.type)
            }
          />
          {projectFeatures.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" && (
            <DataLine
              label="Type d'énergies renouvelables"
              labelClassName="font-bold"
              value={getLabelForRenewableEnergyProductionType("PHOTOVOLTAIC_POWER_PLANT")}
            />
          )}
        </FeaturesSection>
        <DevelopmentPlanFeatures {...projectFeatures} />
        <ProjectStakeholdersPdf
          developerName={projectFeatures.developmentPlan.developerName}
          futureOperator={projectFeatures.futureOperator}
          futureOwner={projectFeatures.futureOwner}
          reinstatementContractOwner={projectFeatures.reinstatementContractOwner}
        />
        <ProjectExpensesAndIncomesPdf
          developmentPlanType={projectFeatures.developmentPlan.type}
          developmentPlanInstallationExpenses={projectFeatures.developmentPlan.installationCosts}
          financialAssistanceRevenues={projectFeatures.financialAssistanceRevenues}
          yearlyProjectedExpenses={projectFeatures.yearlyProjectedExpenses}
          yearlyProjectedRevenues={projectFeatures.yearlyProjectedRevenues}
          buildingsResaleSellingPrice={projectFeatures.buildingsResaleSellingPrice}
          reinstatementCosts={projectFeatures.reinstatementCosts}
          sitePurchaseTotalAmount={projectFeatures.sitePurchaseTotalAmount}
          siteResaleSellingPrice={projectFeatures.siteResaleSellingPrice}
        />
      </PdfPage>
      <PdfPage>
        <ProjectSchedulePdf
          reinstatementSchedule={projectFeatures.reinstatementSchedule}
          installationSchedule={projectFeatures.developmentPlan.installationSchedule}
          firstYearOfOperation={projectFeatures.firstYearOfOperation}
        />
        <FeaturesSection title="✍️ Dénomination">
          <DataLine label="Nom du projet" value={projectFeatures.name} labelClassName="font-bold" />
          {projectFeatures.description && (
            <DataLine
              label="Description"
              value={projectFeatures.description}
              labelClassName="font-bold"
            />
          )}
        </FeaturesSection>
      </PdfPage>
    </>
  );
}
