export default function ComparisonGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-3  border-border-grey">{children}</div>;
}
