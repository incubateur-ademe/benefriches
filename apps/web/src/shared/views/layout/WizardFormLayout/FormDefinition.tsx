import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  hideDivider?: boolean;
};

function FormDefinition({ children, hideDivider = false }: Props) {
  return (
    <>
      {!hideDivider && <hr className="pb-4 mt-4" />}
      <div className="*:text-sm text-text-light">{children}</div>
    </>
  );
}

export default FormDefinition;
