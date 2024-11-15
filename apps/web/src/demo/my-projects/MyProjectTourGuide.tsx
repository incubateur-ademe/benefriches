import { useTour } from "@reactour/tour";
import { ReactNode, useEffect } from "react";

import { selectCurrentUserFirstname } from "@/features/users/application/user.reducer";
import { DEFAULT_APP_SETTINGS } from "@/shared/app-settings/domain/appSettings";
import { LocalStorageAppSettings } from "@/shared/app-settings/infrastructure/LocalStorageUISettings";
import TourGuideProvider from "@/shared/views/components/TourGuideProvider/TourGuideProvider";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  children: ReactNode;
};

const MyProjectsTourGuideLauncher = () => {
  const { setIsOpen } = useTour();

  useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return null;
};

function MyProjectsTourGuide({ children }: Props) {
  const localStorageAppSettings = new LocalStorageAppSettings();

  const userFirstname = useAppSelector(selectCurrentUserFirstname);

  const shouldDisplayMyProjectTourGuide =
    localStorageAppSettings.getAll().shouldDisplayDemoMyProjectTourGuide ??
    DEFAULT_APP_SETTINGS.shouldDisplayDemoMyProjectTourGuide;

  const onCloseTutorial = () => {
    localStorageAppSettings.setShouldDisplayDemoMyProjectTourGuide(false);
  };

  const steps: {
    selector?: string;
    title: string;
    description?: string;
  }[] = [
    {
      title: userFirstname ? `Bonjour ${userFirstname} !` : "Bonjour !",
      description:
        "Bienvenue dans l'espace de démo Bénéfriches. On vous fait la visite en 1 minute\u00a0?",
    },
    {
      title: "Site démo créé par Bénéfriches",
      description: "Vous permet d’accéder aux caractéristiques du site.",
      selector: ".tour-guide-step-created-site",
    },
    {
      title: "Projet démo créé par Bénéfriches",
      description: "Vous amène vers les impacts socio-économiques de ce projet sur le site.",
      selector: ".tour-guide-step-created-project",
    },
  ];

  return (
    <TourGuideProvider steps={steps} onCloseTutorial={onCloseTutorial} disableCloseBeforeEnd>
      {shouldDisplayMyProjectTourGuide && <MyProjectsTourGuideLauncher />}
      {children}
    </TourGuideProvider>
  );
}

export default MyProjectsTourGuide;
