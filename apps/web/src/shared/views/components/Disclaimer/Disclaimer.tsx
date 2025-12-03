import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  onDismiss: () => void;
};

export default function Disclaimer({ title, children, onDismiss }: Props) {
  const [dismissable, setDismissable] = useState(false);

  return (
    <section className="bg-warning-ultralight dark:bg-warning-ultradark p-6 rounded-lg mb-4">
      <h3 className="text-xl mb-4">{title}</h3>
      <p className="mb-4">{children}</p>
      <Checkbox
        className="text-sm mb-6 w-fit"
        options={[
          {
            label: "J'ai compris",
            nativeInputProps: {
              checked: dismissable,
              value: "disclaimer-checkbox",
              onChange: (ev) => {
                setDismissable(ev.target.checked);
              },
            },
          },
        ]}
      />
      <Button priority="secondary" onClick={onDismiss} disabled={!dismissable}>
        Masquer ce message
      </Button>
    </section>
  );
}
