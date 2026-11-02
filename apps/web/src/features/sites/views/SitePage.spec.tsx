import { render, screen } from "@testing-library/react";

import SitePage from "./SitePage";

describe("SitePage", () => {
  it("shows the not found page when the site does not exist", () => {
    render(
      <SitePage
        onPageLoad={() => {}}
        onRemoveProjectFromList={() => {}}
        onSuccessArchiveSite={() => {}}
        viewModel={{ loadingState: "notFound", siteView: undefined }}
        selectedTab="features"
        fromCompatibilityEvaluation={false}
      />,
    );

    expect(screen.getByText("Page non trouvée")).toBeInTheDocument();
  });
});
