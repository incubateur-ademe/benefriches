import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import CreateModeSelectionForm from "../../common-views/create-mode-selection/CreateModeSelectionForm";

const options = [
  {
    value: "express" as const,
    title: "Mode express",
    description:
      "Un projet d'aménagement urbain sera créé automatiquement. Bénéfriches affectera des données par défaut sur l'aménagement des espaces, les bâtiments, les dépenses et recettes, les emplois mobilisés, etc.",
    badgeText: "Le plus rapide",
    imgSrc: "/img/pictograms/creation-mode/express-creation.svg",
  },
  {
    value: "custom" as const,
    title: "Mode personnalisé",
    description:
      "Renseignez les informations dont vous disposez : aménagement des espaces, bâtiments, dépenses et recettes, emplois mobilisés, etc. Si certaines infos vous manquent, Bénéfriches vous proposera des données automatiques.",
    badgeText: "Le plus précis",
    imgSrc: "/img/pictograms/creation-mode/custom-creation.svg",
  },
];

export default function CreateModeSelectionFormContainer() {
  const dispatch = useAppDispatch();

  const { selectStepAnswers, onRequestStepCompletion } = useProjectForm();

  const createMode = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_CREATE_MODE_SELECTION"),
  )?.createMode;

  return (
    <CreateModeSelectionForm
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_CREATE_MODE_SELECTION",
          answers: { createMode: formData.createMode },
        });
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
      initialValues={createMode ? { createMode } : undefined}
      options={options}
    />
  );
}
