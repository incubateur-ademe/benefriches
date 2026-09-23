import { act, fireEvent, render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import type { GetSiteFeaturesResponseDto } from "shared";

import { RouteProvider, routes } from "@/app/router";
import { createStore } from "@/app/store/store";
import { CustomSiteFormProvider } from "@/features/create-site/views/site-form/CustomSiteFormProvider";
import { UrbanZoneSiteFormProvider } from "@/features/create-site/views/site-form/UrbanZoneSiteFormProvider";
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

const URBAN_ZONE_FEATURES: GetSiteFeaturesResponseDto = {
  id: "site-uz-1",
  name: "Zone Nord",
  nature: "URBAN_ZONE",
  isExpressSite: false,
  owner: { structureType: "company", name: "Owner Corp" },
  soilsDistribution: {},
  surfaceArea: 10000,
  address: FRICHE_FEATURES.address,
  yearlyExpenses: [],
  yearlyIncomes: [],
  urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
  landParcels: [
    {
      type: "COMMERCIAL_ACTIVITY_AREA",
      surfaceArea: 10000,
      soilsDistribution: { IMPERMEABLE_SOILS: 10000 },
    },
  ],
  manager: { structureType: "activity_park_manager", name: "" },
  vacantCommercialPremisesFootprint: 0,
  fullTimeJobsEquivalent: 5,
};

function renderWithProviders(
  ui: React.ReactElement,
  features: GetSiteFeaturesResponseDto = FRICHE_FEATURES,
) {
  const store = createStore(getTestAppDependencies());
  store.dispatch(
    siteUpdateInitiated.fulfilled(
      { features, isEditable: true, notEditableReason: null },
      "requestId",
      features.id,
    ),
  );

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <RouteProvider>
        <CustomSiteFormProvider mode="update">
          <UrbanZoneSiteFormProvider mode="update">{children}</UrbanZoneSiteFormProvider>
        </CustomSiteFormProvider>
      </RouteProvider>
    </Provider>
  );

  routes.updateSite({ siteId: features.id }).push();
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

  it("renders one continuous stepper spanning the custom and urban-zone step sequences for an urban-zone site", () => {
    renderWithProviders(<SiteUpdateView siteId="site-uz-1" />, URBAN_ZONE_FEATURES);

    expect(screen.getByRole("button", { name: "Adresse" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Surfaces foncières" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pollution" })).toBeInTheDocument();
  });

  it("clicking the Adresse group from an urban-zone step switches the wizard to the custom ADDRESS step", () => {
    renderWithProviders(<SiteUpdateView siteId="site-uz-1" />, URBAN_ZONE_FEATURES);

    fireEvent.click(screen.getByRole("button", { name: "Adresse" }));

    expect(screen.getByRole("heading", { name: "Où est situé le site ?" })).toBeInTheDocument();
  });

  it("clicking an urban-zone group after returning to a custom step switches back to that urban-zone step", () => {
    renderWithProviders(<SiteUpdateView siteId="site-uz-1" />, URBAN_ZONE_FEATURES);

    fireEvent.click(screen.getByRole("button", { name: "Adresse" }));
    fireEvent.click(screen.getByRole("button", { name: "Pollution" }));

    expect(
      screen.getByRole("heading", { name: "Les sols de la zone sont-ils pollués ?" }),
    ).toBeInTheDocument();
  });
});
