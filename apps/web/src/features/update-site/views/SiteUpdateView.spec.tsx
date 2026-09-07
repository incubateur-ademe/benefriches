import { act, render, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import type { GetSiteFeaturesResponseDto } from "shared";

import { RouteProvider, routes } from "@/app/router";
import { createStore } from "@/app/store/store";
import { CustomSiteFormProvider } from "@/features/create-site/views/site-form/CustomSiteFormProvider";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { siteUpdateInitiated, updateCustomFormActions } from "../core/updateSite.actions";
import SiteUpdateView from "./SiteUpdateView";

// A local-authority owner (`municipality`) is required for the ADDRESS handler's dependency
// rules to invalidate OWNER on a commune change — see address.handlers.ts's doc comment.
const FRICHE_FEATURES: GetSiteFeaturesResponseDto = {
  id: "site-1",
  name: "Friche Duchamp",
  description: "Une friche industrielle",
  nature: "FRICHE",
  isExpressSite: false,
  owner: { structureType: "municipality", name: "Mairie de Meylan" },
  soilsDistribution: { BUILDINGS: 4000, IMPERMEABLE_SOILS: 6000 },
  surfaceArea: 10000,
  address: {
    banId: "38229",
    city: "Meylan",
    cityCode: "38229",
    postCode: "38240",
    streetName: "Rue de Paris",
    streetNumber: "1",
    value: "1 Rue de Paris, 38240 Meylan",
    long: 5.7826,
    lat: 45.2116,
  },
  yearlyExpenses: [{ amount: 3000, purpose: "security", bearer: "tenant" }],
  yearlyIncomes: [],
  fricheActivity: "INDUSTRY",
  hasContaminatedSoils: false,
};

function renderWithProviders(ui: React.ReactElement) {
  const store = createStore(getTestAppDependencies());
  store.dispatch(
    siteUpdateInitiated.fulfilled(
      { features: FRICHE_FEATURES, isEditable: true, notEditableReason: null },
      "requestId",
      "site-1",
    ),
  );

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <RouteProvider>
        <CustomSiteFormProvider mode="update">{children}</CustomSiteFormProvider>
      </RouteProvider>
    </Provider>
  );

  routes.updateSite({ siteId: "site-1" }).push();
  render(ui, { wrapper: Wrapper });

  return { store };
}

describe("SiteUpdateView", () => {
  it("does not render the cascading-changes confirmation dialog before any change is made", () => {
    renderWithProviders(<SiteUpdateView siteId="site-1" />);

    expect(
      screen.queryByText(/La modification de cette étape entraîne d.autres modifications/),
    ).not.toBeInTheDocument();
  });

  it("renders the cascading-changes confirmation dialog when an address change invalidates the completed local-authority owner step", () => {
    const { store } = renderWithProviders(<SiteUpdateView siteId="site-1" />);

    act(() => {
      store.dispatch(
        updateCustomFormActions.stepCompletionRequested({
          stepId: "ADDRESS",
          answers: {
            address: {
              banId: "31038",
              city: "Blajan",
              cityCode: "31038",
              postCode: "31350",
              value: "Blajan",
              long: 0.8944,
              lat: 43.2769,
            },
          },
        }),
      );
    });

    expect(
      screen.getByText(/La modification de cette étape entraîne d.autres modifications/),
    ).toBeInTheDocument();
  });
});
