import { fireEvent, render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { RouteProvider } from "@/app/router";
import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import AppHeader from "./AppHeader";

const DESKTOP_WIDTH = 1280;
const MOBILE_WIDTH = 375;

function buildAuthenticatedUserState({ isAdmin }: { isAdmin: boolean }) {
  return {
    currentUser: {
      currentUser: {
        id: "301d0f47-3775-4320-8e06-381047bebbed",
        email: "john.doe@mail.com",
        firstName: "John",
        lastName: "Doe",
        structureType: "company",
        structureActivity: "photovoltaic_plants_developer",
        isAdmin,
      },
      currentUserState: "authenticated",
      createUserState: "idle",
    },
  } as const;
}

function renderHeader({
  windowWidth,
  preloadedState,
}: {
  windowWidth: number;
  preloadedState: Parameters<typeof createStore>[1];
}) {
  window.innerWidth = windowWidth;
  const store = createStore(getTestAppDependencies(), preloadedState);
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <RouteProvider>{children}</RouteProvider>
    </Provider>
  );
  render(<AppHeader />, { wrapper: Wrapper });
  if (windowWidth < DESKTOP_WIDTH) {
    // On small screens, header items are only listed in the menu panel
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
  }
}

describe("AppHeader", () => {
  for (const { label, windowWidth } of [
    { label: "desktop", windowWidth: DESKTOP_WIDTH },
    { label: "mobile", windowWidth: MOBILE_WIDTH },
  ]) {
    describe(`on ${label}`, () => {
      it("shows an Administration link to the admin dashboard when the user is an admin", () => {
        renderHeader({
          windowWidth,
          preloadedState: buildAuthenticatedUserState({ isAdmin: true }),
        });

        expect(screen.getByRole("link", { name: "Administration" }).getAttribute("href")).toBe(
          "/admin",
        );
      });

      it("does not show an Administration link when the user is not an admin", () => {
        renderHeader({
          windowWidth,
          preloadedState: buildAuthenticatedUserState({ isAdmin: false }),
        });

        expect(screen.getByRole("link", { name: "Mes évaluations" })).toBeDefined();
        expect(screen.queryByRole("link", { name: "Administration" })).toBeNull();
      });
    });
  }
});
