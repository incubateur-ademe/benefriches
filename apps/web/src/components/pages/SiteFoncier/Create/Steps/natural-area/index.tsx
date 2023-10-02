/* eslint-disable no-case-declarations */
import {
  Forest,
  NaturalArea,
  NaturalAreaSpaceType,
  Prairie,
  TreeType,
  VegetationType,
} from "../../../siteFoncier";
import SiteCreationConfirmation from "../Confirmation";
import SiteNameAndDescriptionForm from "../Denomination";
import ForestTreesDistribution from "./forest/ForestTreesDistribution";
import ForestTreesForm from "./forest/ForestTreesForm";
import NaturalAreaFullTimeJobsInvolvedForm from "./management/full-time-jobs-form";
import NaturalAreaProfitAndRentPaidForm from "./management/NaturalAreaRevenueAndExpensesForm";
import NaturalAreaOperatingCompanyForm from "./management/operating-company-form";
import NaturalAreaOwnersForm from "./management/owners-form";
import PrairieVegetationDistributionForm from "./prairie/PrairieVegetationDistributionForm";
import PrairieVegetationForm from "./prairie/PrairieVegetationForm";
import CarbonSummary from "./CarbonSummary";
import NaturalAreaSpacesForm from "./NaturalAreaSpaces";
import NaturalAreaSurfaceForm from "./NaturalAreaSurfaceForm";
import SoilSummary from "./SoilSummary";
import Stepper from "./Stepper";

import {
  goToNextStep,
  NaturalAreaCreationStep,
  setForestTrees,
  setForestTreesSurfaces,
  setNameAndDescription,
  setPrairieVegetation,
  setPrairieVegetationSurfaces,
  setProfitAndRentPaid,
  setSpacesSurfaceArea,
  setSpacesTypes,
} from "@/store/features/naturalAreaCreation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function NaturalAreaCreationWizard() {
  const naturalSpaceCreationState = useAppSelector(
    (state) => state.naturalAreaCreation,
  );
  const dispatch = useAppDispatch();

  const spaces = naturalSpaceCreationState.naturalAreaData
    .spaces as NaturalArea["spaces"];

  const getStepComponent = () => {
    switch (naturalSpaceCreationState.step) {
      case NaturalAreaCreationStep.SPACES_STEP:
        return (
          <NaturalAreaSpacesForm
            onSubmit={(data) => {
              dispatch(setSpacesTypes(data.spaces));
            }}
          />
        );
      case NaturalAreaCreationStep.SPACES_SURFACE_AREA_STEP:
        return (
          <NaturalAreaSurfaceForm
            spaces={
              spaces?.map(({ type }) => type as NaturalAreaSpaceType) ?? []
            }
            onSubmit={(data) => {
              dispatch(setSpacesSurfaceArea(data));
            }}
          />
        );
      case NaturalAreaCreationStep.FOREST_TREES_STEP:
        return (
          <ForestTreesForm
            onSubmit={(data) => {
              const trees = Object.entries(data)
                .filter(([, value]) => value === true)
                .map(([type]) => type as TreeType);
              dispatch(setForestTrees(trees));
            }}
          />
        );
      case NaturalAreaCreationStep.FOREST_TREES_DISTRIBUTION:
        const forest = spaces.find(
          (space) => space.type === NaturalAreaSpaceType.FOREST,
        ) as Forest;
        return (
          <ForestTreesDistribution
            onSubmit={(data) => dispatch(setForestTreesSurfaces(data))}
            trees={forest.trees.map(({ type }) => type)}
          />
        );
      case NaturalAreaCreationStep.PRAIRIE_VEGETATION_STEP:
        return (
          <PrairieVegetationForm
            onSubmit={(data) => {
              const vegetation = Object.entries(data)
                .filter(([, value]) => value === true)
                .map(([type]) => type as VegetationType);
              dispatch(setPrairieVegetation(vegetation));
            }}
          />
        );
      case NaturalAreaCreationStep.PRAIRIE_VEGETATION_DISTRIBUTION_STEP:
        const prairie = spaces.find(
          (space) => space.type === NaturalAreaSpaceType.PRAIRIE,
        ) as Prairie;
        return (
          <PrairieVegetationDistributionForm
            onSubmit={(data) => dispatch(setPrairieVegetationSurfaces(data))}
            vegetation={prairie.vegetation.map(({ type }) => type)}
          />
        );
      case NaturalAreaCreationStep.SOIL_SUMMARY_STEP:
        return (
          <SoilSummary
            onNextClick={() => dispatch(goToNextStep())}
            surface={10000}
          />
        );
      case NaturalAreaCreationStep.CARBON_SUMMARY_STEP:
        return <CarbonSummary onNextClick={() => dispatch(goToNextStep())} />;
      case NaturalAreaCreationStep.OWNER_STEP:
        return <NaturalAreaOwnersForm />;
      case NaturalAreaCreationStep.OPERATION_STEP:
        return <NaturalAreaOperatingCompanyForm />;
      case NaturalAreaCreationStep.FULL_TIME_JOBS_INVOLVED_STEP:
        return <NaturalAreaFullTimeJobsInvolvedForm />;
      case NaturalAreaCreationStep.PROFIT_AND_RENT_PAID_STEP:
        return (
          <NaturalAreaProfitAndRentPaidForm
            onSubmit={(data) => dispatch(setProfitAndRentPaid(data))}
            onBack={() => {}}
          />
        );
      case NaturalAreaCreationStep.NAMING_STEP:
        return (
          <SiteNameAndDescriptionForm
            onSubmit={(data) => dispatch(setNameAndDescription(data))}
            onBack={() => {}}
          />
        );
      case NaturalAreaCreationStep.CONFIRMATION_STEP:
        return (
          <SiteCreationConfirmation
            site={naturalSpaceCreationState.naturalAreaData}
          />
        );
      default:
        return <span>TODO!</span>;
    }
  };

  return (
    <>
      <Stepper step={naturalSpaceCreationState.step} />
      {getStepComponent()}
    </>
  );
}

export default NaturalAreaCreationWizard;
