import {
  AgriculturalCompany,
  NaturalArea,
  OperationStatus,
  OwnerType,
} from "@/components/pages/SiteFoncier/naturalArea";
import { setOperationData } from "@/store/features/naturalAreaCreation";
import { AppDispatch } from "@/store/store";

type FormData = {
  operationStatus: OperationStatus;
  otherCompanyName?: string;
};

export const buildViewModel = (
  dispatch: AppDispatch,
  owners: NaturalArea["owners"],
) => {
  const agriculturalCompanyOwner = owners.find(
    (owner) => owner.type === OwnerType.AGRICULTURAL_COMPANY,
  ) as AgriculturalCompany | undefined;

  return {
    ownerName: agriculturalCompanyOwner?.name,
    onSubmit: (formData: FormData) => {
      switch (formData.operationStatus) {
        case OperationStatus.NOT_OPERATED:
        case OperationStatus.UNKNOWN:
          dispatch(
            setOperationData({ operationStatus: formData.operationStatus }),
          );
          break;
        case OperationStatus.OPERATED_BY_OTHER_COMPANY:
          dispatch(
            setOperationData({
              operationStatus: formData.operationStatus,
              operatingCompanyName: formData.otherCompanyName,
            }),
          );
          break;
        case OperationStatus.OPERATED_BY_OWNER:
          dispatch(
            setOperationData({
              operationStatus: formData.operationStatus,
              operatingCompanyName: agriculturalCompanyOwner?.name,
            }),
          );
          break;
      }
    },
  };
};
