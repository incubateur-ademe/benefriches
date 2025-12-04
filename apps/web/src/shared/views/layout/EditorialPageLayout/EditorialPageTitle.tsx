import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function EditorialPageTitle({ children }: Props) {
  return <h2 className="mb-8">{children}</h2>;
}
