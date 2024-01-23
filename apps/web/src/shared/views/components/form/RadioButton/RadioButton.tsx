import { type ComponentProps, forwardRef, type ReactNode, useId } from "react";
import { fr } from "@codegouvfr/react-dsfr";

export type Props = {
  id?: string;
  legend?: ReactNode;
  hintText?: ReactNode;
  label: ReactNode;
  disabled?: boolean;
  name?: string;
  key?: string;
} & ComponentProps<"input">;

const RadioButton = forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
  const reactId = useId();
  const { id = reactId, name: nameProps, label, hintText, key, ...rest } = props;
  const name = nameProps ?? `radio-name-${reactId}`;

  return (
    <div className={`fr-radio-group`} ref={ref} key={key}>
      <input type="radio" id={id} name={name} {...rest} />
      <label className={fr.cx("fr-label")} htmlFor={id}>
        {label}
        {hintText !== undefined && <span className={fr.cx("fr-hint-text")}>{hintText}</span>}
      </label>
    </div>
  );
});

RadioButton.displayName = "RadioButton";

export default RadioButton;
