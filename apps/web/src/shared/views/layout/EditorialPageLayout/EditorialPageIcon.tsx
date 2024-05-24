import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function EditorialPageIcon({ children }: Props) {
  return <div className="tw-text-[80px] tw-mb-10 tw-leading-none">{children}</div>;
}
