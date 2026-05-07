import classNames from "@/shared/views/clsx";

type MetricCardProps = {
  emoji: string;
  title: string;
  isPositive: boolean;
  badge?: string;
  description: React.ReactNode;
};
function MetricCard({ emoji, title, isPositive, badge, description }: MetricCardProps) {
  return (
    <div
      className={classNames(
        "p-6 border border-border-grey rounded-2xl min-h-40",
        isPositive ? "bg-[#03814114]" : "bg-[#E63E111A]",
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-xl mb-0">
          {emoji} {title}
        </h5>
        <span
          className={classNames(
            "font-bold text-white rounded-md text-sm py-0.5 px-1.5",
            isPositive ? "bg-[#038141]" : "bg-[#E63E11]",
          )}
        >
          {badge ?? (isPositive ? "Amélioré" : "Dégradé")}
        </span>
      </div>
      <span>{description}</span>
    </div>
  );
}

export default MetricCard;
