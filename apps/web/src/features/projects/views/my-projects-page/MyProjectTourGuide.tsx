import { useEffect } from "react";
import { useTour } from "@reactour/tour";
import { ReconversionProjectsGroupedBySite } from "../../domain/projects.types";

import { selectCurrentUserFirstname } from "@/features/users/application/user.reducer";
import { DEFAULT_APP_SETTINGS } from "@/shared/app-settings/domain/appSettings";
import { LocalStorageAppSettings } from "@/shared/app-settings/infrastructure/LocalStorageUISettings";
import TourGuideProvider from "@/shared/views/components/TourGuideProvider/TourGuideProvider";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  projectsList: ReconversionProjectsGroupedBySite;
};

const MyProjectsTourGuideLauncher = () => {
  const { setIsOpen } = useTour();

  useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return null;
};

function MyProjectsTourGuide({ projectsList }: Props) {
  const localStorageAppSettings = new LocalStorageAppSettings();

  const userFirstname = useAppSelector(selectCurrentUserFirstname);

  const shouldDisplayMyProjectTourGuide =
    localStorageAppSettings.getAll().shouldDisplayMyProjectTourGuide ??
    DEFAULT_APP_SETTINGS.shouldDisplayMyProjectTourGuide;

  const onCloseTutorial = () => {
    localStorageAppSettings.setShouldDisplayMyProjectTourGuide(false);
  };

  const [firstProjectGroup] = projectsList;

  const hasReconversionProjects = firstProjectGroup?.reconversionProjects.length;

  const displayTour = firstProjectGroup && shouldDisplayMyProjectTourGuide;

  const steps: {
    selector?: string | Element;
    title: string;
    description?: string;
  }[] = [
    {
      title: userFirstname ? `Bonjour ${userFirstname} !` : "Bonjour !",
      description: "Bienvenue dans votre espace Bénéfriches. On vous fait la visite en 1 minute ?",
    },
    {
      title: "Site que vous avez créé",
      description: "Vous permet d’accéder aux caractéristiques du site et de la zone.",
      selector: ".tour-guide-step-created-site",
    },
  ];

  if (hasReconversionProjects) {
    steps.push({
      title: "Projet que vous avez créé ",
      description: "Vous amène vers les impacts socio-économiques de ce projet sur le site.",
      selector: ".tour-guide-step-created-project",
    });
  }

  steps.push(
    {
      title:
        "Pour renseigner un nouveau projet, en mode express ou custom, cliquez sur “Nouveau scénario”",
      selector: ".tour-guide-step-create-new-project",
    },
    {
      title:
        "Pour renseigner un nouveau site, en mode express ou custom, cliquez sur “Nouveau site”",
      selector: ".tour-guide-step-create-new-site",
    },
  );

  if (displayTour) {
    return (
      <TourGuideProvider steps={steps} onCloseTutorial={onCloseTutorial}>
        <MyProjectsTourGuideLauncher />
      </TourGuideProvider>
    );
  }
  return null;
}

export default MyProjectsTourGuide;
