import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup, { ButtonsGroupProps } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useContext } from "react";

import classNames from "../../clsx";
import { DsfrDialogContext } from "./DsfrDialogContext";

type FooterButtonProps = ButtonProps & { closeModal?: boolean };
type Props = {
  buttons: [FooterButtonProps, ...FooterButtonProps[]];
};
const DsfrDialogFooter = ({ buttons }: Props) => {
  const { dialogId } = useContext(DsfrDialogContext);

  return (
    <div className={classNames("fr-modal__footer", "px-10 pb-10")}>
      <ButtonsGroup
        inlineLayoutWhen="always"
        alignment="between"
        buttons={
          buttons.map(({ closeModal, ...props }) => ({
            ...props,
            nativeButtonProps: closeModal ? { "aria-controls": dialogId } : undefined,
          })) as ButtonsGroupProps["buttons"]
        }
      />
    </div>
  );
};

export default DsfrDialogFooter;
