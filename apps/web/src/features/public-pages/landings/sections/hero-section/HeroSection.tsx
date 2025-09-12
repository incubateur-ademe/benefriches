import { ReactNode } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

type Props = {
  title: string;
  children: ReactNode;
  imgSrc: string;
  className?: ClassValue;
};

export default function HeroSection({ title, children, imgSrc, className }: Props) {
  return (
    <section className={classNames("lg:h-[680px]", className)}>
      <div className="fr-container text-white h-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center h-full">
          <div className="flex flex-col justify-center py-10 lg:py-0">
            <h1 className="text-5xl leading-tight font-bold text-white mb-6">{title}</h1>
            {children}
          </div>

          <div className="lg:h-full text-center overflow-hidden">
            <img src={imgSrc} className="w-full lg:h-full" aria-hidden="true" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
