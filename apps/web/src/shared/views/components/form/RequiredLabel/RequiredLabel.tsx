type Props = {
  label: string;
};

export default function RequiredLabel({ label }: Props) {
  return (
    <>
      {label}&nbsp;
      <span className="" style={{ color: "var(--text-label-red-marianne)" }}>
        *
      </span>
    </>
  );
}
