import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { expressPhotovoltaicProjectSaved } from "@/features/create-project/core/renewable-energy/actions/expressProjectSaved.action";
import { customCreateModeSelected } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import CreateModeSelectionForm, {
  FormValues,
} from "../../common-views/create-mode-selection/CreateModeSelectionForm";

const options = [
  {
    value: "express" as const,
    title: "Mode express",
    description:
      "Un projet de centrale photovoltaïque sera créé automatiquement. Bénéfriches affectera des données par défaut sur la puissance et la surface de l'installation, les dépenses et recettes, les emplois mobilisés, etc.",
    badgeText: "Le plus rapide",
    imgSrc: "/img/pictograms/creation-mode/express-creation.svg",
  },
  {
    value: "custom" as const,
    title: "Mode personnalisé",
    description:
      "Renseignez les informations dont vous disposez : puissance ou surface de l'installation, dépenses et recettes, emplois mobilisés, etc. Si certaines infos vous manquent, Bénéfriches vous proposera des données automatiques.",
    badgeText: "Le plus précis",
    imgSrc: "/img/pictograms/creation-mode/custom-creation.svg",
  },
];

export default function CreateModeSelectionFormContainer() {
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormValues) => {
    if (data.createMode === "express") {
      void dispatch(expressPhotovoltaicProjectSaved());
    }
    if (data.createMode === "custom") {
      void dispatch(customCreateModeSelected());
    }
  };

  const onBack = () => {
    dispatch(stepRevertAttempted());
  };

  return <CreateModeSelectionForm onSubmit={onSubmit} onBack={onBack} options={options} />;
}
