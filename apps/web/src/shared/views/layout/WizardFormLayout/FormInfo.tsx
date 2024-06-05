import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function FormInfo({ children }: Props) {
  return (
    <>
      <div className="!tw-text-xl tw-py-2">💡</div>
      <div>{children}</div>
    </>
  );
}

export default FormInfo;
