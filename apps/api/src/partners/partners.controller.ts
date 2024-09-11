import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller("partners")
export class PartnersController {
  constructor(private readonly configService: ConfigService) {}

  @Get(":partnerId/embed-urls/project-impacts/:projectId")
  getImpactsEmbedUrlsForProject() {
    const WEBAPP_URL = this.configService.getOrThrow<string>("WEBAPP_URL");
    const WEBAPP_MY_PROJECTS_PATH =
      this.configService.getOrThrow<string>("WEBAPP_MY_PROJECTS_PATH");
    const WEBAPP_EMBED_IMPACTS_VIEW_TEMPLATE_PATH = this.configService.getOrThrow<string>(
      "WEBAPP_EMBED_IMPACTS_VIEW_TEMPLATE_PATH",
    );
    const DEMO_EMBED_PROJECT_ID = this.configService.getOrThrow<string>("DEMO_EMBED_PROJECT_ID");

    return {
      url: `${WEBAPP_URL}${WEBAPP_MY_PROJECTS_PATH}`,
      iframe: `${WEBAPP_URL}${WEBAPP_EMBED_IMPACTS_VIEW_TEMPLATE_PATH.replace("${projectId}", DEMO_EMBED_PROJECT_ID)}`,
    };
  }
}
