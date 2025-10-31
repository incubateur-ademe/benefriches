import classNames from "@/shared/views/clsx";

type Props = {
  emoji: string;
  stepNumber: number;
  title: string;
  description: string;
  colorClass: string;
};

export default function Step({ emoji, stepNumber, title, description, colorClass }: Props) {
  return (
    <div className="flex items-center animate-fade-in-up mb-6 gap-6">
      <div
        className="bg-grey-light rounded-full flex items-center justify-center"
        style={{ width: "88px", height: "88px" }}
      >
        <span className="text-4xl" role="img" aria-hidden="true">
          {emoji}
        </span>
      </div>

      <div>
        <h3 className="text-xl m-0 mb-2">
          <span
            className={classNames(
              "rounded-full inline-flex flex-none items-center justify-center mr-2 text-white font-bold shrink-0 grow-0",
              colorClass,
            )}
            style={{ width: "24px", height: "24px" }}
            aria-hidden="true"
          >
            <span className="text-sm">{stepNumber}</span>
          </span>
          {title}
        </h3>
        <p className="text-sm m-0">{description}</p>
      </div>
    </div>
  );
}
