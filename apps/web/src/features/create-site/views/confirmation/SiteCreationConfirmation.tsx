type Props = {
  siteName: string;
};

function SiteCreationConfirmation({ siteName }: Props) {
  return (
    <>
      <h2>✅ Le site "{siteName}" est créé !</h2>
      <p>
        Vous pouvez maintenant découvrir ses caractéristiques géographiques,
        créer un projet sur ce site ou bien renseigner un nouveau site
        retournant à votre tableau de bord.
      </p>
    </>
  );
}

export default SiteCreationConfirmation;
