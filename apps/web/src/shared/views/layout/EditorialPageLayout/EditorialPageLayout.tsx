import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function EditorialPageLayout({ children }: Props) {
  return <section className="py-3 lg:px-[200px]">{children}</section>;
}
