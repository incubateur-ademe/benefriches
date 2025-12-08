import { useMemo } from "react";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { SidebarLayoutProps } from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import { routes } from "@/shared/views/router";

type Props = {
  projectId?: string;
  onSave: () => void;
  saveState: ProjectFormState["urbanProject"]["saveState"];
  isFormValid: boolean;
};
export const useSidebarActions = ({ projectId, onSave, saveState, isFormValid }: Props) => {
  return useMemo((): SidebarLayoutProps["actions"] => {
    if (!projectId) {
      return undefined;
    }

    const actions: SidebarLayoutProps["actions"] = [
      {
        linkProps: routes.projectImpacts({ projectId }).link,
        iconId: "ri-bar-chart-box-line",
        priority: "secondary",
        text: "Retourner aux impacts",
      },
    ];

    if (saveState === "idle") {
      return actions;
    }

    if (saveState === "loading") {
      return [
        {
          onClick: onSave,
          iconId: "ri-loader-2-line",
          priority: "primary",
          text: "Sauvegarde en cours...",
          disabled: true,
        },
        ...actions,
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
        ...actions,
      ];
    }

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
      ...actions,
    ];
  }, [isFormValid, onSave, projectId, saveState]);
};
