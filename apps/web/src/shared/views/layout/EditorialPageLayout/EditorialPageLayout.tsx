import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function EditorialPageLayout({ children }: Props) {
  return <section className="px-6 lg:max-w-3xl h-full flex flex-col">{children}</section>;
}
