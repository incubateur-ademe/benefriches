import { ReactNode } from "react";
import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
};

const activeButtonProps = {
  priority: "primary",
  iconId: "fr-icon-checkbox-circle-line",
  iconPosition: "right",
} as const;

const baseButtonProps = {
  priority: "secondary",
} as const;

function FilterButton({ children, isActive, onClick }: Props) {
  return (
    <Button {...(isActive ? activeButtonProps : baseButtonProps)} onClick={onClick}>
      {children}
    </Button>
  );
}

export default FilterButton;
