import { Controller, useForm } from "react-hook-form";
import Badge from "@codegouvfr/react-dsfr/Badge";
import SoilsTransformationProjectRadioInput from "./SoilsTransformationProjectOption";

import { SoilsTransformationProject } from "@/features/create-project/domain/soilsTransformation";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  soilsTransformationProject: SoilsTransformationProject;
};

const requiredMessage = "Veuillez sélectionner un projet de transformation des sols.";

const options = [
  {
    value: "renaturation",
    title: "Renaturer les sols au maximum",
    description: (
      <>
        Les bâtiments seront démolis, les sols imperméables seront désimperméabilisés au maximum et
        les sols minéraux enherbés au maximum. S'il reste un espace enherbé en-dehors de la zone des
        panneaux, vous pourrez choisir d'y planter des arbres.
        <br />
        <Badge
          as="span"
          className="tw-text-xs tw-rounded-3xl fr-mt-1w tw-normal-case tw-font-normal tw-text-[#297254] tw-bg-[#E3FDEB]"
        >
          🌱 Le plus écologique
        </Badge>
      </>
    ),
    imgSrc: "/img/pictograms/soils-transformation/renaturation.svg",
  },
  {
    value: "keepCurrentSoils",
    title: "Conserver les sols en l'état",
    description: (
      <>
        Les sols existants ne seront pas modifiés, sauf s'il manque de la surface minérale ; un
        minimum sera alors ajouté (pour les fondations des panneaux et les pistes d'accès) en
        remplacement des espaces de nature non-arborés existant. Si des bâtiments existent sur le
        site, ceux-ci seront rémployés.
        <br />
        <Badge
          as="span"
          className="tw-text-xs tw-rounded-3xl fr-mt-1w tw-normal-case tw-font-normal tw-text-[#66673D] tw-bg-[#FEF7DA]"
        >
          💰 Le plus économique
        </Badge>
      </>
    ),
    imgSrc: "/img/pictograms/soils-transformation/soils-conservation.svg",
  },
  {
    value: "custom",
    title: "Transformer les sols au cas par cas",
    description:
      "Sélectionnez les espaces à conserver ou à créer, et affectez-leur une superficie précise. Option à choisir si vous avez un projet d'aménagement spécifique pour les sols ou les bâtiments.",
    imgSrc: "/img/pictograms/soils-transformation/custom-distribution.svg",
    badge: null,
  },
] as const;

function SoilsTransformationProjectForm({ onSubmit, onBack }: Props) {
  const { handleSubmit, formState, control } = useForm<FormValues>({
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
        <Fieldset
          state={formState.errors.soilsTransformationProject ? "error" : "default"}
          stateRelatedMessage={formState.errors.soilsTransformationProject && requiredMessage}
        >
          {options.map((option) => {
            return (
              <Controller
                key={option.value}
                control={control}
                name="soilsTransformationProject"
                rules={{ required: true }}
                render={({ field }) => {
                  return (
                    <SoilsTransformationProjectRadioInput
                      onChange={() => {
                        field.onChange(option.value);
                      }}
                      checked={field.value === option.value}
                      title={option.title}
                      description={option.description}
                      imgSrc={option.imgSrc}
                      className="tw-mb-4"
                    />
                  );
                }}
              />
            );
          })}
        </Fieldset>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SoilsTransformationProjectForm;
