type Props = {
  children: string;
  className?: string;
};

export default function SectionTitle({ children, className = "" }: Props) {
  return <h2 className={`tw-text-[40px] ${className}`}>{children}</h2>;
}
