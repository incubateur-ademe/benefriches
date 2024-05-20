import { useForm } from "react-hook-form";

import { SoilsTransformationProject } from "@/features/create-project/domain/soilsTransformation";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  soilsTransformationProject: SoilsTransformationProject;
};

const requiredMessage = "Veuillez sélectionner un projet de transformation des sols.";

function SoilsTransformationProjectForm({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    shouldUnregister: true,
  });

  return (
    <WizardFormLayout
      title="Que souhaitez-vous faire des sols du site ?"
      instructions={
        <>
          <p>
            Les sols qui accueilleront les panneaux photovoltaïques peuvent être transformés avant
            l'installation.
          </p>
          <p>
            Par exemple, il peut être intéressant d'en profiter pour renaturer les sols au maximum,
            en désimperméabilisant puis en mettant en oeuvre une restauration écologique des sols.
          </p>
          <p>
            La restauration écologique des sols consiste donc à « réparer » ou recréer les processus
            écologiques préexistants en termes de composition spécifique ou de structures des
            communautés végétale et animale.
            <br />
          </p>
          <p> Concrètement, il s'agit d'appliquer des techniques soit de :</p>
          <ul>
            <li>
              génie écologique par décompaction du sol, puis léger apport en matière organique,
              inoculation en micro-organismes et semis ou plantations
            </li>
            <li>
              génie pédologique afin de créer des sols fertiles à l'aide de matériaux qui pour la
              plupart sont issus de déchets urbains (ex : compost)
            </li>
          </ul>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("soilsTransformationProject", {
            required: requiredMessage,
          })}
          error={formState.errors.soilsTransformationProject}
          options={[
            {
              label: "Renaturer les sols au maximum",
              value: "renaturation",
              hintText: (
                <p>
                  Les bâtiments seront démolis, les sols imperméables seront désimperméabilisés au
                  maximum et les sols minéraux enherbés au maximum.
                  <br />
                  S'il reste un espace enherbé en-dehors de la zone des panneaux, vous pourrez
                  choisir d'y planter des arbres.
                  <br />
                  🌱 <strong>Le plus écologique</strong>
                </p>
              ),
            },
            {
              label: "Conserver les sols en l'état",
              value: "keepCurrentSoils",
              hintText: (
                <p>
                  Les sols existants ne seront pas modifiés, sauf s'il manque de la surface minérale
                  ; un minimum sera alors ajouté (pour les fondations des panneaux et les pistes
                  d'accès) en remplacement des espaces de nature non-arborés existant.
                  <br />
                  Si des bâtiments existent sur le site, ceux-ci seront rémployés.
                  <br />
                  💰 <strong>Le plus économique</strong>
                </p>
              ),
            },
            {
              label: "Transformer les sols au cas par cas",
              value: "custom",
              hintText: (
                <p>
                  Sélectionnez les espaces à conserver ou à créer, et affectez-leur une superficie
                  précise.
                  <br />
                  Option à choisir si vous avez un projet d'aménagement spécifique pour les sols ou
                  les bâtiments.
                </p>
              ),
            },
          ]}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SoilsTransformationProjectForm;
