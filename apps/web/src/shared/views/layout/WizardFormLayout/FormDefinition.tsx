import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function FormDefinition({ children }: Props) {
  return (
    <>
      <div className="!tw-text-xl tw-py-2">💡</div>
      <div className={"*:tw-text-xs"}>{children}</div>
    </>
  );
}

export default FormDefinition;
