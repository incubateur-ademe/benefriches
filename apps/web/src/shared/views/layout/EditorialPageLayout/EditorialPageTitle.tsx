import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function EditorialPageTitle({ children }: Props) {
  return <h2 className="tw-mb-10">{children}</h2>;
}
