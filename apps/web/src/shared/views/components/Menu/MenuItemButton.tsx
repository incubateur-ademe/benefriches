import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { MenuItem } from "@headlessui/react";

import classNames from "../../clsx";

function MenuItemButton({ className, ...buttonProps }: ButtonProps) {
  return (
    <MenuItem>
      {({ focus }) => (
        <Button
          size="small"
          className={classNames(
            "w-full",
            "font-normal",
            "py-2",
            focus && "bg-(--hover-tint)",
            className,
          )}
          priority="tertiary no outline"
          {...buttonProps}
        />
      )}
    </MenuItem>
  );
}

export default MenuItemButton;
