import { fireEvent, render, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { UserSiteEvaluation } from "../../core/types";
import MyEvaluationItem from "./MyEvaluationItem";

function renderWithProviders(ui: React.ReactElement) {
  const store = createStore(getTestAppDependencies());
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );
  return render(ui, { wrapper: Wrapper });
}

const evaluation: UserSiteEvaluation = {
  siteId: "site-1",
  siteName: "Mon site",
  siteNature: "FRICHE",
  isExpressSite: true,
  isEditable: false,
  notEditableReason: "NOT_CUSTOM",
  reconversionProjects: { total: 0, lastProjects: [] },
  compatibilityEvaluation: { top3Usages: [] },
};

describe("MyEvaluationItem", () => {
  it("offers the Modifier action on an evaluation row", () => {
    renderWithProviders(
      <MyEvaluationItem
        evaluation={evaluation}
        onRemoveProjectFromList={() => {}}
        onRemoveSiteFromList={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Voir plus de fonctionnalités" }));

    const updateMenuItem = screen.getByRole("menuitem", { name: /Modifier le site/ });
    expect(updateMenuItem).toBeInTheDocument();
    expect(updateMenuItem).toHaveAttribute("aria-disabled", "true");
    expect(
      screen.getByText("Ce site n'a pas été créé manuellement et ne peut pas être modifié ici."),
    ).toBeInTheDocument();
  });
});
