type Props = {
  children: React.ReactNode;
};

export default function EditorialPageText({ children }: Props) {
  return <p className="text-xl mb-10">{children}</p>;
}
