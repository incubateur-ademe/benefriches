import Button from "@codegouvfr/react-dsfr/Button";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";

import { routes } from "@/app/router";
import classNames from "@/shared/views/clsx";
import MenuItemButton from "@/shared/views/components/Menu/MenuItemButton";
import { MENU_ITEMS_CLASSES } from "@/shared/views/components/Menu/classes";
import { useIsSmallScreen } from "@/shared/views/hooks/useIsSmallScreen";

type Props = { displayActions?: boolean };
function MyEvaluationsPageHeader({ displayActions }: Props) {
  const isSmScreen = useIsSmallScreen();

  return (
    <div className={classNames("flex", "justify-between", "items-center")}>
      <h2>Mes évaluations</h2>
      {displayActions && (
        <div className={classNames("flex", "gap-2", "mb-6")}>
          <Button
            size={isSmScreen ? "small" : "medium"}
            priority="primary"
            linkProps={routes.createSite({ creationMode: "custom" }).link}
            iconId="fr-icon-add-line"
          >
            Évaluer un nouveau site
          </Button>

          <Menu>
            <MenuButton as={Fragment}>
              <Button priority="tertiary" iconId="fr-icon-more-fill" title="Voir plus d'options" />
            </MenuButton>
            <MenuItems
              anchor="bottom end"
              transition
              className={classNames("z-40", MENU_ITEMS_CLASSES)}
            >
              <MenuItemButton
                iconId="fr-icon-add-line"
                linkProps={routes.createSite({ creationMode: "demo" }).link}
              >
                Évaluer un site démo
              </MenuItemButton>
            </MenuItems>
          </Menu>
        </div>
      )}
    </div>
  );
}

export default MyEvaluationsPageHeader;
