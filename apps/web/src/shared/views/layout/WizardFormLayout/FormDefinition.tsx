import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  hideDivider?: boolean;
};

function FormDefinition({ children, hideDivider = false }: Props) {
  return (
    <>
      {!hideDivider && <hr />}
      <div className={"*:tw-text-xs"}>{children}</div>
    </>
  );
}

export default FormDefinition;
