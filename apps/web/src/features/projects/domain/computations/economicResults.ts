import { Project, ProjectSite, ProjectStakeholder } from "../projects.types";

export const getIsOperatorOwnerOfReinstatementCost = (
  futureOperator: ProjectStakeholder,
  reinstatementCostOwner?: ProjectStakeholder,
) => {
  if (!reinstatementCostOwner) {
    // s’il n’y a pas de reinstatementContractOwner, les frais de réabilitation sont à la charge de l’opérateur
    // TODO: Vérifier ce postulat
    return true;
  }
  // TODO: Réfacto du formulaire pour avoir une comparaison plus fiable. Créer des id pour les stakeholder ? un modèle commun avec les parties prenantes du site ?
  // A combiner avec le changement UX sur le champ collectivités dans le form projet partie "futureOperator"
  return (
    futureOperator.name === reinstatementCostOwner.name &&
    reinstatementCostOwner.structureType === futureOperator.structureType
  );
};

export const getEconomicResultsOfProjectInstallation = (projectData: Project) => {
  const {
    reinstatementFinancialAssistanceAmount,
    reinstatementCost,
    photovoltaicPanelsInstallationCost,
    futureOperator,
    reinstatementContractOwner: reinstatementCostOwner,
  } = projectData;

  const isOperatorOwnerOfReinstatementCost = getIsOperatorOwnerOfReinstatementCost(
    futureOperator,
    reinstatementCostOwner,
  );

  const costs = isOperatorOwnerOfReinstatementCost
    ? photovoltaicPanelsInstallationCost + (reinstatementCost ?? 0)
    : photovoltaicPanelsInstallationCost;

  const benefits = isOperatorOwnerOfReinstatementCost ? reinstatementFinancialAssistanceAmount : 0;

  return benefits - costs;
};

export const getEconomicResultsOfProjectExploitationPerYear = (projectData: Project) => {
  const { yearlyProjectedRevenues, yearlyProjectedCosts } = projectData;

  const costs = yearlyProjectedCosts.reduce((total, expense) => expense.amount + total, 0);
  const benefits = yearlyProjectedRevenues.reduce((total, expense) => expense.amount + total, 0);

  return benefits - costs;
};

export const getEconomicResultsOfProjectForDuration = (
  projectData: Project,
  durationInYear: number,
) => {
  return Math.round(
    getEconomicResultsOfProjectInstallation(projectData) +
      getEconomicResultsOfProjectExploitationPerYear(projectData) * durationInYear,
  );
};

export const getEconomicResultsOfSitePerYear = (siteData: ProjectSite) => {
  const { yearlyExpenses, yearlyIncomes } = siteData;

  const incomes = yearlyIncomes.reduce((total, expense) => expense.amount + total, 0);
  const expenses = yearlyExpenses
    .filter(({ bearer }) => bearer === "owner")
    .reduce((total, expense) => expense.amount + total, 0);

  return incomes - expenses;
};

export const getEconomicResultsOfSiteForDuration = (
  siteData: ProjectSite,
  durationInYear: number,
) => {
  return Math.round(getEconomicResultsOfSitePerYear(siteData) * durationInYear);
};
