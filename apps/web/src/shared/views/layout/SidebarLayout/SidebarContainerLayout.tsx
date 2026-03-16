import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";

type FormLayoutProps = {
  children: ReactNode;
};

function SidebarContainerLayout({ children }: FormLayoutProps) {
  return (
    <section className={classNames("flex", "h-full", "items-center", "justify-center", "w-full")}>
      {children}
    </section>
  );
}

export default SidebarContainerLayout;
