import ModalHeader from "../shared/ModalHeader";

const SocialMainDescription = () => {
  return (
    <>
      <ModalHeader title="Impacts sociaux" breadcrumbSegments={[{ label: "Impacts sociaux" }]} />
      <p>La catégorie des impacts sociaux regroupe les impacts :</p>
      <ul>
        <li>sur l'emploi</li>
        <li>sur les riverains</li>
        <li>sur la société française</li>
      </ul>
    </>
  );
};

export default SocialMainDescription;
