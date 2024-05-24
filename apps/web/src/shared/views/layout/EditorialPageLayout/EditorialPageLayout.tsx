import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function EditorialPageLayout({ children }: Props) {
  return <section className="tw-py-7 lg:tw-px-[200px]">{children}</section>;
}
