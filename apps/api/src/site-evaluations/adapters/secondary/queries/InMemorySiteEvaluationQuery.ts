import {
  SiteEvaluationDataView,
  SiteEvaluationQuery,
} from "src/site-evaluations/core/gateways/SiteEvaluationQuery";

export class InMemorySiteEvaluationQuery implements SiteEvaluationQuery {
  private readonly siteEvaluations: SiteEvaluationDataView[];
  constructor(siteEvaluations: SiteEvaluationDataView[] = []) {
    this.siteEvaluations = siteEvaluations;
  }

  getUserSiteEvaluations(): Promise<SiteEvaluationDataView[]> {
    return Promise.resolve(this.siteEvaluations);
  }
}
