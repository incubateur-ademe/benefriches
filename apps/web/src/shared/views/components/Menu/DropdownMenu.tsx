import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { Menu, MenuButton, MenuItems, MenuItemsProps } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";

import classNames, { ClassValue } from "../../clsx";
import MenuItemButton from "./MenuItemButton";
import { MENU_ITEMS_CLASSES } from "./classes";

type DropdownMenuProps = {
  classes?: Partial<Record<"root" | "menu" | "list", ClassValue>>;
  options: ButtonProps[];
  buttonProps: ButtonProps;
  anchor?: MenuItemsProps["anchor"];
  size?: "small" | "medium" | "large";
};

function DropdownMenu({
  classes,
  options,
  buttonProps,
  anchor = "bottom end",
  size = "medium",
}: DropdownMenuProps) {
  return (
    <Menu>
      <MenuButton as={Fragment}>
        <Button {...buttonProps} className={classNames(classes?.root)} />
      </MenuButton>
      <MenuItems
        anchor={anchor}
        transition
        className={classNames(
          "tw-z-40",
          size === "small" && "tw-w-44",
          size === "medium" && "tw-w-72",
          size === "large" && "tw-w-80",
          MENU_ITEMS_CLASSES,
          classes?.menu,
        )}
      >
        {options.map((option, index) => (
          <MenuItemButton key={`menu-btn-${index}`} {...option} />
        ))}
      </MenuItems>
    </Menu>
  );
}

export default DropdownMenu;
