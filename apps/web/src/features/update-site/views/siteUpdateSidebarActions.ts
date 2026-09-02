import { ButtonProps } from "@codegouvfr/react-dsfr/Button";

import { SidebarLayoutProps } from "@/shared/views/layout/SidebarLayout/SidebarLayout";

type GoBackProps = {
  linkProps: ButtonProps.AsAnchor["linkProps"];
  text: string;
};

type Props = {
  saveState: "idle" | "dirty" | "loading" | "success" | "error";
  isFormValid: boolean;
  onSave: () => void;
  goBackProps: GoBackProps;
};

/**
 * Pure builder for the update-site wizard's sidebar actions (ticket 16): a primary save button
 * reflecting `saveState`, followed by the secondary "go back" button. Mirrors update-project's
 * own `useSidebarActions` label/icon/disabled table (update-project/views/useSidebarActions.ts)
 * with one deliberate divergence — see the `idle` branch below.
 */
export const buildSiteUpdateSidebarActions = ({
  saveState,
  isFormValid,
  onSave,
  goBackProps,
}: Props): SidebarLayoutProps["actions"] => {
  const goBackAction: NonNullable<SidebarLayoutProps["actions"]>[number] = {
    ...goBackProps,
    iconId: "ri-arrow-left-line",
    priority: "secondary",
  };

  if (saveState === "loading") {
    return [
      {
        onClick: onSave,
        iconId: "ri-loader-2-line",
        priority: "primary",
        text: "Sauvegarde en cours...",
        disabled: true,
      },
      goBackAction,
    ];
  }

  if (saveState === "success") {
    return [
      {
        onClick: onSave,
        iconId: "fr-icon-check-line",
        priority: "primary",
        text: "Modifications sauvegardées",
        className: "before:text-success-dark",
        disabled: true,
      },
      goBackAction,
    ];
  }

  // Covers "idle", "dirty" and "error". DELIBERATE DIVERGENCE from update-project's
  // `useSidebarActions`, which hides the primary button entirely while `saveState === "idle"`:
  // ticket 16's acceptance criterion 1 requires the save button visible on every step from the
  // moment the wizard opens, and a freshly hydrated (unedited) update-site wizard is idle. Do
  // not "fix" this back to project parity.
  return [
    {
      onClick: onSave,
      iconId: "fr-icon-save-line",
      priority: "primary",
      text: "Sauvegarder les modifications",
      disabled: !isFormValid,
      title: !isFormValid
        ? "Le formulaire est incomplet. Terminez l'édition avant de sauvegarder."
        : undefined,
    },
    goBackAction,
  ];
};
