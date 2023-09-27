/* eslint-disable no-case-declarations */
import {
  AgricultureCompany,
  Forest,
  NaturalArea,
  NaturalAreaSpaceType,
  Owner,
  OwnerType,
  TreeType,
} from "../../../siteFoncier";
import SiteCreationConfirmation from "../Confirmation";
import SiteNameAndDescriptionForm from "../Denomination";
import NaturalAreaJobsInvolvedForm from "./management/NaturalAreaJobsInvolvedForm";
import NaturalAreaOwnerForm from "./management/NaturalAreaOwnerForm";
import NaturalAreaProfitAndRentPaidForm from "./management/NaturalAreaRevenueAndExpensesForm";
import NaturalAreaRunningCompanyForm from "./management/NaturalAreaRunningCompanyForm";
import CarbonSummary from "./CarbonSummary";
import ForestTreesDistribution from "./ForestTreesDistribution";
import ForestTreesForm from "./ForestTreesForm";
import NaturalAreaSpacesForm from "./NaturalAreaSpaces";
import NaturalAreaSurfaceForm from "./NaturalAreaSurfaceForm";
import SoilSummary from "./SoilSummary";
import Stepper from "./Stepper";

import {
  goToNextStep,
  NaturalAreaCreationStep,
  setForestTrees,
  setForestTreesSurfaces,
  setFullTimeJobsInvolved,
  setNameAndDescription,
  setOwners,
  setProfitAndRentPaid,
  setRunningCompany,
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
        return (
          <NaturalAreaOwnerForm
            onBack={() => {}}
            onSubmit={(data) => {
              const owners: Owner[] = [];
              if (data.AGRICULTURAL_COMPANY === true) {
                owners.push({
                  type: OwnerType.AGRICULTURAL_COMPANY,
                  name: data.agriculturalCompanyName,
                });
              }
              if (data.LOCAL_OR_REGIONAL_AUTHORITY === true) {
                owners.push({ type: OwnerType.LOCAL_OR_REGIONAL_AUTHORITY });
              }
              if (data.OTHER) {
                owners.push({ type: OwnerType.OTHER });
              }
              dispatch(setOwners(owners));
            }}
          />
        );
      case NaturalAreaCreationStep.RUNNING_COMPANY_STEP:
         
        const agriculturalCompanyOwner =
          naturalSpaceCreationState.naturalAreaData.owners?.find(
            (owner) => owner.type === OwnerType.AGRICULTURAL_COMPANY,
          ) as AgricultureCompany | undefined;
         
        const runningCompanyName = agriculturalCompanyOwner?.name ?? "";
        return (
          <NaturalAreaRunningCompanyForm
            defaultCompanyName={runningCompanyName}
            onSubmit={(runningCompanyName) =>
              dispatch(setRunningCompany(runningCompanyName))
            }
            onBack={() => {}}
          />
        );
      case NaturalAreaCreationStep.FULL_TIME_JOBS_INVOLVED_STEP:
        return (
          <NaturalAreaJobsInvolvedForm
            onSubmit={(data) =>
              dispatch(setFullTimeJobsInvolved(data.jobsInvolved))
            }
            onBack={() => {}}
          />
        );
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
