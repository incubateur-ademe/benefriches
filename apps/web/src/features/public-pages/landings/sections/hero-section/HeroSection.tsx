import type { ReactNode } from "react";

import type { ClassValue } from "@/shared/views/clsx";
import classNames from "@/shared/views/clsx";

type Props = {
  title: string;
  children: ReactNode;
  className?: ClassValue;
};

export default function HeroSection({ title, children, className }: Props) {
  return (
    <section className={classNames(className)}>
      <div className="flex lg:items-center min-h-[70vh] max-h-screen fr-container h-full bg-[url('/img/homepage-hero.webp')] bg-size-[50%] lg:bg-size-[602px] bg-no-repeat bg-bottom-right">
        <div className="flex flex-col md:w-1/2 mr-auto ml-0 text-white py-10">
          <h1 className="text-[40px] md:text-5xl leading-tight font-bold text-white mb-6">
            {title}
          </h1>
          {children}
        </div>
      </div>
    </section>
  );
}
