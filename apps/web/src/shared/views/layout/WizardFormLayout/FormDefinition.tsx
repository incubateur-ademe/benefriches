import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  hideDivider?: boolean;
};

function FormDefinition({ children, hideDivider = false }: Props) {
  return (
    <>
      {!hideDivider && <hr className="tw-pb-4 tw-mt-4" />}
      <div className="*:tw-text-sm tw-text-text-light">{children}</div>
    </>
  );
}

export default FormDefinition;
