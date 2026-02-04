import { useMemo } from "react";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { SidebarLayoutProps } from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import { routes, useRoute } from "@/shared/views/router";

type Props = {
  projectId?: string;
  siteId?: string;
  onSave: () => void;
  saveState: ProjectFormState["urbanProject"]["saveState"];
  isFormValid: boolean;
};
export const useSidebarActions = ({ projectId, siteId, onSave, saveState, isFormValid }: Props) => {
  const currentRoute = useRoute();

  const goBackProps = useMemo(() => {
    if (!projectId) {
      return {
        linkProps: routes.myEvaluations().link,
        text: "Retour à mes évaluations",
      };
    }
    if (currentRoute.name !== "updateProject" || !currentRoute.params.from) {
      return {
        linkProps: routes.projectImpacts({ projectId }).link,
        text: "Retourner aux impacts",
      };
    }

    if (currentRoute.params.from === "site" && siteId) {
      return {
        linkProps: routes.siteEvaluatedProjects({ siteId }).link,
        text: "Retour aux détails du site",
      };
    }

    if (currentRoute.params.from === "evaluations") {
      return {
        linkProps: routes.myEvaluations().link,
        text: "Retour à mes évaluations",
      };
    }
    return {
      linkProps: routes.projectImpacts({ projectId }).link,
      text: "Retourner aux impacts",
    };
  }, [currentRoute, siteId, projectId]);

  return useMemo((): SidebarLayoutProps["actions"] => {
    if (!projectId) {
      return undefined;
    }

    const actions: SidebarLayoutProps["actions"] = [
      {
        ...goBackProps,
        iconId: "ri-bar-chart-box-line",
        priority: "secondary",
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
  }, [isFormValid, onSave, projectId, saveState, goBackProps]);
};
