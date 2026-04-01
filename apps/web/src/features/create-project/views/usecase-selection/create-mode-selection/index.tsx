import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  createModeCompleted,
  stepReverted,
} from "@/features/create-project/core/usecase-selection/useCaseSelection.actions";
import { selectUseCaseCreateModeViewData } from "@/features/create-project/core/usecase-selection/useCaseSelection.selectors";

import CreateModeSelectionForm from "./CreateModeSelectionForm";

const options = [
  {
    value: "express" as const,
    title: "Mode démo",
    description:
      "Un projet d'aménagement sera créé automatiquement à partir d'une catégorie de projet. Bénéfriches affectera des données par défaut sur l'aménagement des espaces, les bâtiments, les dépenses et recettes, les emplois mobilisés, etc.",
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
  const { creationMode } = useAppSelector(selectUseCaseCreateModeViewData);

  return (
    <CreateModeSelectionForm
      onSubmit={(formData) => {
        dispatch(createModeCompleted(formData.createMode));
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
      initialValues={creationMode ? { createMode: creationMode } : undefined}
      options={options}
    />
  );
}
