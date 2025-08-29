import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function EditorialPageIcon({ children }: Props) {
  return <div className="text-[80px] mb-10 leading-none">{children}</div>;
}
