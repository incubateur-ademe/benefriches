import ComparisonCell from "./ComparisonCell";

type ScenarioHeaderProps = {
  pictoUrl: string;
  label: React.ReactNode;
  badge?: React.ReactNode;
};

export default function ScenarioHeader({ pictoUrl, label, badge }: ScenarioHeaderProps) {
  return (
    <ComparisonCell firstRow bold size="lg" className="flex items-center gap-2 h-28">
      <img className="w-14 h-14" src={pictoUrl} aria-hidden alt="" width="56" height="56" />
      <div className="flex flex-col gap-2">
        {badge}
        {label}
      </div>
    </ComparisonCell>
  );
}
