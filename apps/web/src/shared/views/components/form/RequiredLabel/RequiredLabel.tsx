type Props = {
  label: string;
};

export default function RequiredLabel({ label }: Props) {
  return (
    <>
      {label}&nbsp;
      <span className={"text-dsfr-red"}>*</span>
    </>
  );
}
