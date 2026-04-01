import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";

function FutureSoilsSurfaceAreaInstructions() {
  return (
    <FormDefinition>
      Il n'est pas possible d'augmenter la surface des <strong>espaces naturels</strong> (forêts,
      prairies, zones humides). En effet, le sol est un milieu vivant, dont la création en
      conditions naturelles (pédogénèse) prend plusieurs centaines d'années. C'est pourquoi la
      création de surfaces naturelles est illusoire sur le temps de vie du projet. En revanche, vous
      pouvez augmenter la surfaces des sols végétalisés (enherbés, arbustifs ou arborés).
    </FormDefinition>
  );
}

export default FutureSoilsSurfaceAreaInstructions;
