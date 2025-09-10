import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

export class RenaturationProjectGenerator extends UrbanProjectGenerator {
  override name = "Renaturation";

  override get spacesDistribution() {
    return {
      PUBLIC_GREEN_SPACES: this.siteData.surfaceArea,
    };
  }
}
