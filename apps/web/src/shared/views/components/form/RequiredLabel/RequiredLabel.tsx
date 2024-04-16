type Props = {
  label: string;
};

export default function RequiredLabel({ label }: Props) {
  return (
    <>
      {label}&nbsp;
      <span className={"tw-text-dsfr-red"}>*</span>
    </>
  );
}
