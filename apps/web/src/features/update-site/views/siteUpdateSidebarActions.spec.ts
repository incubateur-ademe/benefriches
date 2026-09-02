import { describe, expect, it, vi } from "vitest";

import { routes } from "@/app/router";

import { buildSiteUpdateSidebarActions } from "./siteUpdateSidebarActions";

const goBackProps = {
  linkProps: routes.myEvaluations().link,
  text: "Retour à mes évaluations",
};

describe("buildSiteUpdateSidebarActions", () => {
  it("shows an enabled primary 'Sauvegarder les modifications' button when saveState is idle (deliberate divergence from update-project: visible from the moment the wizard opens)", () => {
    const onSave = vi.fn();

    const actions = buildSiteUpdateSidebarActions({
      saveState: "idle",
      isFormValid: true,
      onSave,
      goBackProps,
    });

    const [primary] = actions ?? [];
    expect(primary?.priority).toBe("primary");
    expect(primary?.text).toBe("Sauvegarder les modifications");
    expect(primary?.disabled).toBeFalsy();
  });

  it("shows a disabled 'Sauvegarde en cours...' button when saveState is loading", () => {
    const actions = buildSiteUpdateSidebarActions({
      saveState: "loading",
      isFormValid: true,
      onSave: vi.fn(),
      goBackProps,
    });

    const [primary] = actions ?? [];
    expect(primary?.priority).toBe("primary");
    expect(primary?.text).toBe("Sauvegarde en cours...");
    expect(primary?.disabled).toBe(true);
  });

  it("shows a disabled 'Modifications sauvegardées' button when saveState is success", () => {
    const actions = buildSiteUpdateSidebarActions({
      saveState: "success",
      isFormValid: true,
      onSave: vi.fn(),
      goBackProps,
    });

    const [primary] = actions ?? [];
    expect(primary?.priority).toBe("primary");
    expect(primary?.text).toBe("Modifications sauvegardées");
    expect(primary?.disabled).toBe(true);
  });

  it("goes back to an enabled 'Sauvegarder les modifications' button when saveState is error, so the user can retry", () => {
    const actions = buildSiteUpdateSidebarActions({
      saveState: "error",
      isFormValid: true,
      onSave: vi.fn(),
      goBackProps,
    });

    const [primary] = actions ?? [];
    expect(primary?.priority).toBe("primary");
    expect(primary?.text).toBe("Sauvegarder les modifications");
    expect(primary?.disabled).toBeFalsy();
  });

  it("disables the primary button and sets the incomplete-form title when isFormValid is false", () => {
    const actions = buildSiteUpdateSidebarActions({
      saveState: "idle",
      isFormValid: false,
      onSave: vi.fn(),
      goBackProps,
    });

    const [primary] = actions ?? [];
    expect(primary?.disabled).toBe(true);
    expect(primary?.title).toBe(
      "Le formulaire est incomplet. Terminez l'édition avant de sauvegarder.",
    );
  });

  it("clicking the primary button calls onSave", () => {
    const onSave = vi.fn();

    const actions = buildSiteUpdateSidebarActions({
      saveState: "idle",
      isFormValid: true,
      onSave,
      goBackProps,
    });

    const [primary] = actions ?? [];
    const primaryWithOnClick = primary as { onClick?: () => void };
    primaryWithOnClick.onClick?.();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it.each(["idle", "dirty", "loading", "success", "error"] as const)(
    "always includes the secondary back-button from goBackProps when saveState is %s",
    (saveState) => {
      const actions = buildSiteUpdateSidebarActions({
        saveState,
        isFormValid: true,
        onSave: vi.fn(),
        goBackProps,
      });

      const backAction = actions?.find((action) => action.priority === "secondary");
      expect(backAction?.text).toBe(goBackProps.text);
      expect(backAction?.linkProps).toBe(goBackProps.linkProps);
    },
  );
});
