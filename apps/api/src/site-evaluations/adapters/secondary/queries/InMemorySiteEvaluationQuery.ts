import {
  SiteEvaluationDataView,
  SiteEvaluationQuery,
} from "src/site-evaluations/core/gateways/SiteEvaluationQuery";

export class InMemorySiteEvaluationQuery implements SiteEvaluationQuery {
  constructor(private readonly siteEvaluations: SiteEvaluationDataView[] = []) {}

  getUserSiteEvaluations(): Promise<SiteEvaluationDataView[]> {
    return Promise.resolve(this.siteEvaluations);
  }
}
