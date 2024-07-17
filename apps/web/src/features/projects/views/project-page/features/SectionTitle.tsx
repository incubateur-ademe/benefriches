import { ReactNode } from "react";

export default function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="tw-text-lg tw-mb-2">{children}</h3>;
}
