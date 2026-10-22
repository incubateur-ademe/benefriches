import { render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { RouteProvider } from "@/app/router";
import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { ABOUT_IMPACTS_DIALOG_ID } from "../header/headerItems";
import BenefrichesHeader from "./BenefrichesHeader";

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
  preloadedState?: Parameters<typeof createStore>[1];
}) {
  window.innerWidth = windowWidth;
  const store = createStore(getTestAppDependencies(), preloadedState);
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <RouteProvider>{children}</RouteProvider>
    </Provider>
  );
  return render(<BenefrichesHeader />, { wrapper: Wrapper });
}

describe("BenefrichesHeader", () => {
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

        // DSFR renders quick-access items both in the header tools and in its mobile menu modal
        const adminLinks = screen.getAllByRole("link", { name: "Administration" });
        expect(adminLinks.map((link) => link.getAttribute("href"))).toEqual(["/admin", "/admin"]);
      });

      it("does not show an Administration link when the user is not an admin", () => {
        renderHeader({
          windowWidth,
          preloadedState: buildAuthenticatedUserState({ isAdmin: false }),
        });

        expect(screen.getAllByRole("link", { name: "Mes évaluations" }).length).toBeGreaterThan(0);
        expect(screen.queryByRole("link", { name: "Administration" })).toBeNull();
      });

      it("shows a Questions fréquentes button opening the FAQ dialog when the user is logged in", () => {
        renderHeader({
          windowWidth,
          preloadedState: buildAuthenticatedUserState({ isAdmin: false }),
        });

        // DSFR renders quick-access items both in the header tools and in its mobile menu modal
        const faqButtons = screen.getAllByRole("button", { name: "Questions fréquentes" });
        expect(faqButtons.map((button) => button.getAttribute("aria-controls"))).toEqual([
          ABOUT_IMPACTS_DIALOG_ID,
          ABOUT_IMPACTS_DIALOG_ID,
        ]);
      });

      it("does not show an Administration link when the visitor is not logged in", () => {
        renderHeader({ windowWidth });

        expect(
          screen.getAllByRole("link", { name: "Accéder à Bénéfriches" }).length,
        ).toBeGreaterThan(0);
        expect(screen.queryByRole("link", { name: "Administration" })).toBeNull();
      });
    });
  }
});
