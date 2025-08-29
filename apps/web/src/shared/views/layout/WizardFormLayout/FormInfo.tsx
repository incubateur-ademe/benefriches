import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function FormInfo({ children }: Props) {
  return (
    <>
      <div className="text-xl py-2">💡</div>
      <div className="*:text-sm *:mb-4">{children}</div>
    </>
  );
}

export default FormInfo;
