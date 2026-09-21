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
    <div className="flex items-center mb-8 gap-6">
      <div
        className={classNames(
          "rounded-full flex items-center justify-center text-white",
          colorClass,
        )}
        style={{ width: "56px", height: "56px" }}
      >
        <span className="text-2xl font-bold" role="img" aria-hidden="true">
          {stepNumber}
        </span>
      </div>

      <div>
        <h3 className="text-lg m-0 mb-1">
          {title} {emoji}
        </h3>
        <p className="text-sm m-0">{description}</p>
      </div>
    </div>
  );
}
