type Props = {
  children: string;
  className?: string;
};

export default function SectionTitle({ children, className = "" }: Props) {
  return <h2 className={`text-[40px] ${className}`}>{children}</h2>;
}
