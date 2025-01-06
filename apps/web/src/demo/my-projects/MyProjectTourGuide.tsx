import { useTour } from "@reactour/tour";
import { ReactNode, useEffect } from "react";

import { appSettingUpdated, selectAppSettings } from "@/shared/app-settings/core/appSettings";
import TourGuideProvider from "@/shared/views/components/TourGuideProvider/TourGuideProvider";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { selectCurrentUserFirstname } from "@/users/application/user.reducer";

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
  const userFirstname = useAppSelector(selectCurrentUserFirstname);
  const dispatch = useAppDispatch();
  const shouldDisplayDemoMyProjectTourGuide =
    useAppSelector(selectAppSettings).shouldDisplayDemoMyProjectTourGuide;

  const onCloseTutorial = () => {
    dispatch(appSettingUpdated({ field: "shouldDisplayDemoMyProjectTourGuide", value: false }));
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
      {shouldDisplayDemoMyProjectTourGuide && <MyProjectsTourGuideLauncher />}
      {children}
    </TourGuideProvider>
  );
}

export default MyProjectsTourGuide;
