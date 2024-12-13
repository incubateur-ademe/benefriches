import { fr } from "@codegouvfr/react-dsfr";
import { type ComponentProps, type ReactNode, useId } from "react";

type Props = {
  id?: string;
  legend?: ReactNode;
  hintText?: ReactNode;
  label: ReactNode;
  disabled?: boolean;
  name?: string;
  key?: string;
  ref: React.Ref<HTMLDivElement>;
} & ComponentProps<"input">;

const RadioButton = (props: Props) => {
  const reactId = useId();
  const { id = reactId, name: nameProps, label, hintText, ref, ...rest } = props;
  const name = nameProps ?? `radio-name-${reactId}`;

  return (
    <div className={`fr-radio-group`} ref={ref}>
      <input type="radio" id={id} name={name} {...rest} />
      <label className={fr.cx("fr-label")} htmlFor={id}>
        {label}
        {hintText !== undefined && <span className={fr.cx("fr-hint-text")}>{hintText}</span>}
      </label>
    </div>
  );
};

RadioButton.displayName = "RadioButton";

export default RadioButton;
