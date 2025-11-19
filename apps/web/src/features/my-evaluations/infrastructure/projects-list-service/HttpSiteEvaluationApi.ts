import { SiteEvaluationGateway } from "../../application/evaluationsList.actions";
import { UserSiteEvaluation } from "../../domain/types";

export class HttpSiteEvaluationApi implements SiteEvaluationGateway {
  async getUserList(): Promise<UserSiteEvaluation[]> {
    const response = await fetch(`/api/site-evaluations`);

    if (!response.ok) throw new Error(`Error while fetching site evaluation list`);

    const jsonResponse = (await response.json()) as UserSiteEvaluation[];
    return jsonResponse;
  }
}
