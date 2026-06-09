import ComparisonCell from "./ComparisonCell";

export default function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <ComparisonCell firstCol colSpan={3} header bold size="lg">
      {children}
    </ComparisonCell>
  );
}
