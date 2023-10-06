import { SiteFoncierType } from "../domain/siteFoncier.types";
import FricheCreationWizard from "./create-friche/FricheCreationWizard";
import FricheCreationStepper from "./create-friche/Stepper";
import SiteAddressForm from "./Address";
import NaturalAreaCreationWizard from "./create-natural-area";
import SiteTypeForm from "./Type";

import {
  CreationStep,
  setAddress,
  setSiteType,
} from "@/features/create-site/application/createSite.reducers";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function CreateSiteFoncierPage() {
  const dispatch = useAppDispatch();
  const siteCreationState = useAppSelector((state) => state.siteCreation);

  const getStepComponent = () => {
    switch (siteCreationState.step) {
      case CreationStep.TYPE_STEP:
        return (
          <SiteTypeForm
            onSubmit={(data) => {
              dispatch(setSiteType(data.type));
            }}
          />
        );
      case CreationStep.ADDRESS_STEP:
        return (
          <SiteAddressForm
            siteType={siteCreationState.siteData.type as SiteFoncierType}
            onSubmit={(data) => dispatch(setAddress(data.location.address))}
            onBack={() => {}}
          />
        );
      case CreationStep.FRICHE_CREATION:
        return <FricheCreationWizard />;
      case CreationStep.NATURAL_SPACE_CREATION:
        return <NaturalAreaCreationWizard />;
    }
  };

  return (
    <>
      <FricheCreationStepper step={siteCreationState.step} />
      {getStepComponent()}
    </>
  );
}

export default CreateSiteFoncierPage;
