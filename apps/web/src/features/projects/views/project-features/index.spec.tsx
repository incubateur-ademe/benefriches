import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { MockProjectFeaturesService } from "../../infrastructure/project-features-service/MockProjectFeaturesService";
import ProjectFeaturesViewContainer from "./index";

describe("ProjectFeaturesViewContainer", () => {
  it("shows the latest saved features when the project was loaded before", async () => {
    const projectFeaturesService = new MockProjectFeaturesService();
    const projectFeatures = projectFeaturesService.projectFeatures;
    const store = createStore(getTestAppDependencies({ projectFeaturesService }), {
      projectFeatures: {
        dataLoadingState: "success",
        data: {
          ...projectFeatures,
          financialAssistanceRevenues: [{ amount: 400000, source: "other" }],
        },
      },
    });
    projectFeaturesService._setProjectFeatures({
      ...projectFeatures,
      financialAssistanceRevenues: [{ amount: 450000, source: "other" }],
    });

    render(
      <Provider store={store}>
        <ProjectFeaturesViewContainer projectId={projectFeatures.id} />
      </Provider>,
    );

    // shown both as the financial aid total and on the "Autres ressources" line
    expect(await screen.findAllByText("450 000 €")).toHaveLength(2);
    expect(screen.queryAllByText("400 000 €")).toEqual([]);
  });
});
