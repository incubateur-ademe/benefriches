import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function FormWarning({ children }: Props) {
  return (
    <>
      <div className="!tw-text-xl tw-py-2">⚠️</div>
      <div className="tw-text-warning">{children}</div>
    </>
  );
}

export default FormWarning;
