import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import {
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  UrbanProjectDevelopmentExpense,
} from "shared";

import { ReconversionProject } from "@/features/create-project/core/actions/expressProjectSavedGateway";
import ProjectFeaturesView from "@/features/projects/views/project-page/features/ProjectFeaturesView";
import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import {
  EditorialPageIcon,
  EditorialPageLayout,
  EditorialPageTitle,
} from "@/shared/views/layout/EditorialPageLayout";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";
import { routes } from "@/shared/views/router";

type Props = {
  projectId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
  projectData?: ReconversionProject;
  onBack: () => void;
};

const sumIfNotNull = (a?: number, b?: number) => {
  return (a ?? 0) + (b ?? 0);
};

function ProjectExpressCreationResult({
  projectId,
  siteName,
  loadingState,
  onBack,
  projectData,
}: Props) {
  switch (loadingState) {
    case "idle":
      return null;
    case "loading":
      return <LoadingSpinner loadingText={`Création du projet, veuillez patienter...`} />;
    case "error":
      return (
        <WizardFormLayout title="Échec de la création du projet">
          <Alert
            description={`Une erreur est survenue lors de la création du projet, veuillez réessayer.`}
            severity="error"
            title="Le projet n'a pas pu être créé"
            className="my-7"
          />
          <Button onClick={onBack} priority="secondary">
            Précédent
          </Button>
        </WizardFormLayout>
      );
    case "success":
      return (
        <EditorialPageLayout>
          <EditorialPageIcon>✅</EditorialPageIcon>
          <EditorialPageTitle>Le projet "{projectData?.name}" est créé !</EditorialPageTitle>
          <p
            className={classNames(
              "border-borderGrey",
              "border-solid",
              "border",
              "shadow-md",
              "rounded-lg",
              "p-4",
            )}
          >
            💡 Bénéfriches a affecté des données par défaut pour créer le projet sur "{siteName}".
            <br />
            Ces données sont basées sur les moyennes observées pour ce type de site.
          </p>
          {projectData && (
            <ProjectFeaturesView
              projectData={{
                id: projectData.id,
                name: projectData.name,
                description: projectData.description,
                isExpress: true,
                soilsDistribution: projectData.soilsDistribution,
                futureOperator: projectData.futureOperator?.name,
                futureOwner: projectData.futureSiteOwner?.name,
                reinstatementContractOwner: projectData.reinstatementContractOwner?.name,

                financialAssistanceRevenues:
                  projectData.financialAssistanceRevenues as FinancialAssistanceRevenue[],
                reinstatementCosts: projectData.reinstatementCosts as ReinstatementExpense[],
                yearlyProjectedExpenses: projectData.yearlyProjectedCosts as RecurringExpense[],
                yearlyProjectedRevenues: projectData.yearlyProjectedRevenues as RecurringRevenue[],

                reinstatementSchedule: projectData.reinstatementSchedule,
                firstYearOfOperation: projectData.operationsFirstYear,
                sitePurchaseTotalAmount: sumIfNotNull(
                  projectData.sitePurchaseSellingPrice,
                  projectData.sitePurchasePropertyTransferDuties,
                ),
                siteResaleSellingPrice: sumIfNotNull(
                  projectData.siteResaleExpectedSellingPrice,
                  projectData.siteResaleExpectedPropertyTransferDuties,
                ),
                buildingsResaleSellingPrice: sumIfNotNull(
                  projectData.buildingsResaleExpectedSellingPrice,
                  projectData.buildingsResaleExpectedPropertyTransferDuties,
                ),
                decontaminatedSoilSurface: projectData.decontaminatedSoilSurface,

                developmentPlan:
                  projectData.developmentPlan.type === "URBAN_PROJECT"
                    ? {
                        ...projectData.developmentPlan,
                        developerName: projectData.developmentPlan.developer.name,
                        installationCosts: projectData.developmentPlan
                          .costs as UrbanProjectDevelopmentExpense[],
                        spaces: projectData.developmentPlan.features.spacesDistribution,
                        buildingsFloorArea:
                          projectData.developmentPlan.features.buildingsFloorAreaDistribution,
                      }
                    : {
                        ...projectData.developmentPlan,
                        developerName: projectData.developmentPlan.developer.name,
                        installationCosts: projectData.developmentPlan
                          .costs as PhotovoltaicInstallationExpense[],

                        ...projectData.developmentPlan.features,
                      },
              }}
            />
          )}
          <Button size="large" linkProps={routes.projectImpactsOnboarding({ projectId }).link}>
            Consulter les impacts
          </Button>
        </EditorialPageLayout>
      );
  }
}

export default ProjectExpressCreationResult;
