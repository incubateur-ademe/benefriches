import { SiteEvaluationGateway } from "../../application/evaluationsList.actions";
import { UserSiteEvaluation } from "../../domain/types";

export class InMemorySiteEvaluationService implements SiteEvaluationGateway {
  constructor(
    private readonly siteEvaluations: UserSiteEvaluation[],
    private readonly shouldFail = false,
  ) {}

  getUserList(): Promise<UserSiteEvaluation[]> {
    if (this.shouldFail) throw new Error("Intended error");

    return Promise.resolve(this.siteEvaluations);
  }
}
