type Props = {
  siteName: string;
  projectName: string;
};

function ProjectCreationConfirmation({ projectName, siteName }: Props) {
  return (
    <>
      <h2>✅ Le projet "{projectName}" est créé !</h2>
      <p>
        Vous pouvez maintenant découvrir ses impacts, comparer votre projet avec
        un statut quo ou bien renseigner un nouveau projet sur le site «{" "}
        {siteName} » en retournant sur la liste des projets.
      </p>
    </>
  );
}

export default ProjectCreationConfirmation;
