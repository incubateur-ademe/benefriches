import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { Route } from "type-route";

import {
  isAnwersStep,
  isInformationalStep,
} from "@/features/create-project/core/urban-project-event-sourcing/urbanProjectSteps";
import { UrbanProjectCustomCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import classNames from "@/shared/views/clsx";
import MenuItemButton from "@/shared/views/components/Menu/MenuItemButton";
import { MENU_ITEMS_CLASSES } from "@/shared/views/components/Menu/classes";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import { routes } from "@/shared/views/router";

import UrbanProjectCustomSteps from "../stepper/Stepper";
import AnswerStepsWizard from "./AnswerStepWizard";
import InformationalStepWizard from "./InformationalStepWizard";

type Props = {
  currentStep: UrbanProjectCustomCreationStep;
  route: Route<typeof routes.createProject>;
};

const BetaBadgeMenu = ({ route }: { route: Props["route"] }) => {
  return (
    <Menu>
      <MenuButton as={Fragment}>
        <span
          role="button"
          className={classNames(
            "fr-badge fr-badge--new",
            "fr-badge--sm",
            "cursor-pointer",
            "hover:border-2 hover:border-[var(--text-action-high-yellow-moutarde)] hover:border-solid",
            "focus:border-2 focus:border-[var(--text-action-high-yellow-moutarde)] focus:border-solid",
            "mx-3",
            "text-bold",
          )}
        >
          Bêta
        </span>
      </MenuButton>
      <MenuItems
        anchor="bottom start"
        transition
        className={classNames("z-40", "w-36", MENU_ITEMS_CLASSES)}
      >
        <MenuItemButton
          iconId="fr-icon-close-line"
          linkProps={routes.createProject({
            ...route.params,
            beta: false,
          })}
        >
          Quitter le mode bêta
        </MenuItemButton>
      </MenuItems>
    </Menu>
  );
};
const UrbanProjectCustomCreationStepWizardBeta = ({ currentStep, route }: Props) => {
  return (
    <SidebarLayout
      title={
        <>
          Renseignement du projet
          <BetaBadgeMenu route={route} />
        </>
      }
      sidebarChildren={<UrbanProjectCustomSteps step={currentStep} />}
      mainChildren={(() => {
        if (isAnwersStep(currentStep)) {
          return <AnswerStepsWizard currentStep={currentStep} />;
        }

        if (isInformationalStep(currentStep)) {
          return <InformationalStepWizard currentStep={currentStep} />;
        }
      })()}
    />
  );
};

export default UrbanProjectCustomCreationStepWizardBeta;
