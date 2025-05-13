import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { MenuItem } from "@headlessui/react";

import classNames from "../../clsx";

function MenuItemButton(buttonProps: ButtonProps) {
  return (
    <MenuItem>
      {({ focus }) => (
        <Button
          size="small"
          className={classNames(
            "tw-w-full",
            "tw-font-normal",
            "tw-py-2",
            focus && "tw-bg-[var(--hover-tint)]",
          )}
          priority="tertiary no outline"
          {...buttonProps}
        />
      )}
    </MenuItem>
  );
}

export default MenuItemButton;
