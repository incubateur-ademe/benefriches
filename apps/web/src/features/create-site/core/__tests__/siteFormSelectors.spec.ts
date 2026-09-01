import { createStore, RootState } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState, SiteCreationState } from "../createSite.reducer";
import {
  createSiteFormRootSelectors,
  selectDerivedSiteData,
} from "../selectors/createSite.selectors";
import type { SiteFormLens } from "../siteForm.lens";
import { createAddressSelectors } from "../steps/address/address.selectors";

describe("createSiteFormRootSelectors (lens-injection regression guard)", () => {
  it("reads the flow state through the injected lens, not a hard-coded slice key", () => {
    // Arrange: two distinct SiteCreationState instances with different addresses, held under two
    // different root-state keys — proving each selector instance reads only through its own lens.
    const defaultRootState = createStore(getTestAppDependencies()).getState();

    const siteCreationState: SiteCreationState = {
      ...getInitialState(),
      initialSiteData: {
        ...getInitialState().initialSiteData,
        address: { ...ADDRESS_A },
      },
    };
    const otherFlowState: SiteCreationState = {
      ...getInitialState(),
      initialSiteData: {
        ...getInitialState().initialSiteData,
        address: { ...ADDRESS_B },
      },
    };

    const rootState = {
      ...defaultRootState,
      siteCreation: siteCreationState,
      otherFlow: otherFlowState,
    } as RootState & { otherFlow: SiteCreationState };

    const siteCreationLens: SiteFormLens = { selectSiteForm: (state) => state.siteCreation };
    const otherFlowLens: SiteFormLens = {
      selectSiteForm: (state) => (state as typeof rootState).otherFlow,
    };

    // Act
    const siteCreationRootSelectors = createSiteFormRootSelectors(siteCreationLens);
    const otherFlowRootSelectors = createSiteFormRootSelectors(otherFlowLens);

    // Assert: each instance resolves its own state's address, not the other instance's.
    expect(siteCreationRootSelectors.selectSiteAddress(rootState)).toEqual(ADDRESS_A);
    expect(otherFlowRootSelectors.selectSiteAddress(rootState)).toEqual(ADDRESS_B);
  });

  it("a leaf ViewData selector factory (address) resolves each lens instance's own flow data (ticket 10)", () => {
    // Arrange: same two-flow-states setup as above, proving the step-2/3 conversion carried the
    // seam all the way down to a leaf ViewData selector, not just the root bundle.
    const defaultRootState = createStore(getTestAppDependencies()).getState();

    const siteCreationState: SiteCreationState = {
      ...getInitialState(),
      initialSiteData: { ...getInitialState().initialSiteData, address: { ...ADDRESS_A } },
    };
    const otherFlowState: SiteCreationState = {
      ...getInitialState(),
      initialSiteData: { ...getInitialState().initialSiteData, address: { ...ADDRESS_B } },
    };
    const rootState = {
      ...defaultRootState,
      siteCreation: siteCreationState,
      otherFlow: otherFlowState,
    } as RootState & { otherFlow: SiteCreationState };

    const siteCreationLens: SiteFormLens = { selectSiteForm: (state) => state.siteCreation };
    const otherFlowLens: SiteFormLens = {
      selectSiteForm: (state) => (state as typeof rootState).otherFlow,
    };

    // Act
    const { selectAddressFormViewData: selectForCreation } = createAddressSelectors(
      createSiteFormRootSelectors(siteCreationLens),
    );
    const { selectAddressFormViewData: selectForOtherFlow } = createAddressSelectors(
      createSiteFormRootSelectors(otherFlowLens),
    );

    // Assert
    expect(selectForCreation(rootState).address).toEqual(ADDRESS_A);
    expect(selectForOtherFlow(rootState).address).toEqual(ADDRESS_B);
  });

  it("the creation-bound singleton re-export still resolves to state.siteCreation", () => {
    // Arrange
    const defaultRootState = createStore(getTestAppDependencies()).getState();
    const siteCreationState: SiteCreationState = {
      ...getInitialState(),
      initialSiteData: {
        ...getInitialState().initialSiteData,
        address: { ...ADDRESS_A },
      },
    };
    const rootState: RootState = { ...defaultRootState, siteCreation: siteCreationState };

    // Act
    const siteData = selectDerivedSiteData(rootState);

    // Assert
    expect(siteData.address).toEqual(ADDRESS_A);
  });
});

const ADDRESS_A = {
  lat: 5.7243,
  long: 45.182081,
  city: "Grenoble",
  banId: "38185",
  cityCode: "38185",
  postCode: "38100",
  value: "Grenoble",
};

const ADDRESS_B = {
  lat: 4.835659,
  long: 45.764043,
  city: "Lyon",
  banId: "69123",
  cityCode: "69123",
  postCode: "69001",
  value: "Lyon",
};
