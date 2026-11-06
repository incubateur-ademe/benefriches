import { describe, expect, it } from "vitest";

import type {
  SaveProjectPayload,
  SaveReconversionProjectGateway,
} from "../../actions/saveReconversionProject.action";
import { projectPhaseCompleted } from "../../usecase-selection/useCaseSelection.actions";
import { customUrbanProjectSaved } from "../urbanProjectCustomSaved.action";
import { StoreBuilder } from "./_testStoreHelpers";

// A save whose HTTP request never answers, so the first save stays in flight.
class InFlightSaveReconversionProjectService implements SaveReconversionProjectGateway {
  readonly receivedProjects: SaveProjectPayload[] = [];

  save(project: SaveProjectPayload): Promise<void> {
    this.receivedProjects.push(project);
    return new Promise(() => {});
  }
}

describe("customUrbanProjectSaved", () => {
  it("sends the project once when the user submits again while the first save is in flight", () => {
    const saveReconversionProjectService = new InFlightSaveReconversionProjectService();
    const store = new StoreBuilder()
      .withAppDependencies({ saveReconversionProjectService })
      .withCurrentStep("URBAN_PROJECT_FINAL_SUMMARY")
      .withSteps({
        URBAN_PROJECT_NAMING: { completed: true, payload: { name: "Projet urbain test Lyon" } },
        URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
          completed: true,
          payload: { projectDeveloper: { structureType: "company", name: "Aménageur" } },
        },
      })
      .build();
    store.dispatch(projectPhaseCompleted("planning"));

    void store.dispatch(customUrbanProjectSaved());
    void store.dispatch(customUrbanProjectSaved());

    expect(saveReconversionProjectService.receivedProjects.map(({ id }) => id)).toEqual([
      store.getState().projectCreation.projectId,
    ]);
  });
});
