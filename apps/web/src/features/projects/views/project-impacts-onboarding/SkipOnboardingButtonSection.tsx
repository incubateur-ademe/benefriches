import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  onClick: () => void;
};

export default function SkipOnboardingButtonSection({ onClick }: Props) {
  return (
    <div className="text-right">
      <Button className="p-0" size="small" priority="tertiary no outline" onClick={onClick}>
        Passer l'introduction
      </Button>
    </div>
  );
}
