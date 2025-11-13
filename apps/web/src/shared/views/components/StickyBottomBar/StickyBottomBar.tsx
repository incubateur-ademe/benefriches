import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function StickyBottomBar({ children }: Props) {
  return (
    <section className="p-0 m-0 sticky bottom-0 right-0 bg-white border-t border-border-grey dark:bg-dsfr-grey py-4">
      {children}
    </section>
  );
}
