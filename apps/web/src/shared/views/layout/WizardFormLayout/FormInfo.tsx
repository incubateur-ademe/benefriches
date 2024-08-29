import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function FormInfo({ children }: Props) {
  return (
    <>
      <div className="tw-text-xl tw-py-2">💡</div>
      <div className="*:tw-text-sm *:tw-mb-4">{children}</div>
    </>
  );
}

export default FormInfo;
