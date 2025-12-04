type Props = {
  children: React.ReactNode;
};

export default function EditorialPageText({ children }: Props) {
  return <p className="text-xl m-0">{children}</p>;
}
