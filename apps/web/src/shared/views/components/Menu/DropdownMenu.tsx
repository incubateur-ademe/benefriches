import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { Menu, MenuButton, MenuItem, MenuItems, MenuItemsProps } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";

import classNames, { ClassValue } from "../../clsx";

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
          "tw-absolute",
          "tw-right-0",
          "tw-z-10",
          size === "small" && "tw-w-44",
          size === "medium" && "tw-w-72",
          size === "large" && "tw-w-80",
          "tw-mt-2",
          "tw-rounded-md",
          "tw-bg-white dark:!tw-bg-dsfr-contrastGrey",
          "tw-shadow-lg",
          "tw-ring-1 tw-ring-black/5",
          "tw-py-1",
          classes?.menu,
        )}
      >
        {options.map((option, index) => (
          <MenuItem key={`menu-btn-${index}`}>
            <Button
              size="small"
              className="tw-w-full tw-py-2"
              priority="tertiary no outline"
              {...option}
            />
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}

export default DropdownMenu;
