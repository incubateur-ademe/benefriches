import { SiteEvaluationGateway } from "../../application/evaluationsList.actions";
import { UserSiteEvaluation } from "../../core/types";

export class InMemorySiteEvaluationService implements SiteEvaluationGateway {
  private readonly siteEvaluations: UserSiteEvaluation[];
  private readonly shouldFail: boolean;

  constructor(siteEvaluations: UserSiteEvaluation[], shouldFail = false) {
    this.siteEvaluations = siteEvaluations;
    this.shouldFail = shouldFail;
  }

  getUserList(): Promise<UserSiteEvaluation[]> {
    if (this.shouldFail) throw new Error("Intended error");

    return Promise.resolve(this.siteEvaluations);
  }
}
