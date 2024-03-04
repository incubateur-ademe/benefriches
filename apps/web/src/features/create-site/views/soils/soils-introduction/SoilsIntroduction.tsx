import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";

type Props = {
  onNext: () => void;
  onBack: () => void;
  isFriche: boolean;
};

const SiteSoilsIntroduction = ({ isFriche, onNext, onBack }: Props) => {
  return (
    <>
      <p>
        Parlons d’abord des <strong>sols</strong> qui existent actuellement sur{" "}
        {isFriche ? "la friche" : "le site"} : leur typologie, leur occupation et les superficies
        correspondantes.
      </p>
      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default SiteSoilsIntroduction;
