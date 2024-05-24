type Props = {
  children: React.ReactNode;
};

export default function EditorialPageText({ children }: Props) {
  return <p className="tw-text-xl tw-mb-10">{children}</p>;
}
