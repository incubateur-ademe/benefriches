import { IDateProvider } from "../../../adapters/IDateProvider";
import { typedObjectEntries } from "../../../object-entries";
import { computeProjectReinstatementExpenses, ReinstatementExpensePurpose } from "../reinstatement";
import { computeDefaultOperationsFirstYear } from "../schedule/operationFirstYear";
import {
  computeDefaultInstallationSchedule,
  computeDefaultReinstatementSchedule,
} from "../schedule/worksSchedule";
import { SiteData } from "./types";

export class DefaultProjectGenerator {
  constructor(
    readonly dateProvider: IDateProvider,
    readonly siteData: SiteData,
  ) {}

  get projectSoilsDistribution() {
    return {};
  }

  get developer() {
    return this.siteData.owner;
  }

  // FRICHE SPECIFIC
  get isFriche() {
    return this.siteData.nature === "FRICHE";
  }

  get reinstatementContractOwner() {
    if (this.isFriche) {
      return this.developer;
    }
    return undefined;
  }

  get decontaminatedSoilSurface() {
    if (this.isFriche) {
      return 0.75 * (this.siteData.contaminatedSoilSurface ?? 0);
    }
    return undefined;
  }

  get reinstatementCosts() {
    if (!this.isFriche) {
      return undefined;
    }
    return typedObjectEntries(
      computeProjectReinstatementExpenses(
        this.siteData.soilsDistribution,
        this.projectSoilsDistribution,
        this.decontaminatedSoilSurface ?? 0,
      ),
    )
      .filter(([, amount]) => amount && amount > 0)
      .map(([purpose, amount]) => {
        switch (purpose) {
          case "deimpermeabilization":
          case "remediation":
          case "demolition":
            return { amount, purpose };
          case "sustainableSoilsReinstatement":
            return { amount, purpose: "sustainable_soils_reinstatement" };
          case "asbestosRemoval":
            return { amount, purpose: "asbestos_removal" };
        }
      }) as { amount: number; purpose: ReinstatementExpensePurpose }[];
  }

  get reinstatementSchedule() {
    if (this.isFriche) {
      return computeDefaultReinstatementSchedule(this.dateProvider);
    }
    return undefined;
  }

  // CALENDAR
  get installationSchedule() {
    return computeDefaultInstallationSchedule(this.dateProvider)(
      this.reinstatementSchedule?.endDate,
    );
  }

  get operationsFirstYear() {
    return computeDefaultOperationsFirstYear(this.installationSchedule.endDate);
  }
}
