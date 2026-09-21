import Button from "@codegouvfr/react-dsfr/Button";

import Badge from "@/shared/views/components/Badge/Badge";

import type { Testimony } from "./testimonies";

type TestimonyCardProps = {
  testimony: Testimony;
  className?: string;
};

export default function TestimonyCard({ testimony, className }: TestimonyCardProps) {
  return (
    <div
      className={`bg-white dark:bg-grey-dark rounded-2xl p-8 md:flex gap-8 min-w-175 h-auto ${className || ""}`}
    >
      <div className="shrink-0 my-auto w-32">
        <img src={testimony.imgSrc} alt="" className="max-w-full object-contain" />
      </div>

      <div className="hidden md:block w-px bg-blue-ultradark shrink-0" />

      <div className="flex flex-col flex-1 min-h-50">
        <div className="mb-6">
          <Badge style="blue">{testimony.projectType}</Badge>
        </div>

        <blockquote className="mb-6 m-0 font-medium text-lg">"{testimony.testimony}"</blockquote>

        <div className="text-sm">{testimony.author}</div>
        {testimony.fileUrl && (
          <Button
            className="mt-6"
            priority="secondary"
            linkProps={{
              href: testimony.fileUrl,
              rel: "noopener noreferrer",
              target: "_blank",
              title: `Télécharger le cas d'étude du projet à ${testimony.projectLocation}`,
              "aria-label": `Télécharger le cas d'étude du projet à ${testimony.projectLocation}`,
            }}
          >
            Télécharger le cas d'étude
          </Button>
        )}
      </div>
    </div>
  );
}
