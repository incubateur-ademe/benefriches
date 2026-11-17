import Button from "@codegouvfr/react-dsfr/Button";
import ToggleSwitch from "@codegouvfr/react-dsfr/ToggleSwitch";
import { type ReactNode } from "react";

import DsfrA11yDialog from "../../Dialog/DsfrA11yDialog";

type Props = {
  defaultChecked: boolean;
  onChange: (value: boolean) => void;
  badge: ReactNode;
  ModalContent?: ReactNode;
};

const DIALOG_ID = "impact-modal-description";

export default ({ defaultChecked, onChange, badge, ModalContent }: Props) => {
  return (
    <>
      <ToggleSwitch
        classes={{ root: "my-8", label: "after:top-[unset] items-center" }}
        defaultChecked={defaultChecked}
        showCheckedHint={false}
        inputTitle={`Utiliser la valeur par défaut`}
        label={
          <div className="flex flex-col">
            Appliquer la valeur par défaut{" "}
            <div className="md:inline-flex justify-center items-center">
              {badge && <span className="fr-badge fr-badge--sm my-0">{badge}</span>}
              {ModalContent && (
                <Button
                  size="small"
                  priority="tertiary no outline"
                  nativeButtonProps={{
                    "aria-controls": DIALOG_ID,
                    "data-fr-opened": false,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  Comment est-elle calculée ?
                </Button>
              )}
            </div>
          </div>
        }
        labelPosition="right"
        onChange={onChange}
      />
      {ModalContent && (
        <DsfrA11yDialog dialogId={DIALOG_ID} title="🪄 Comment est calculée la valeur par défaut ?">
          {ModalContent}
        </DsfrA11yDialog>
      )}
    </>
  );
};
