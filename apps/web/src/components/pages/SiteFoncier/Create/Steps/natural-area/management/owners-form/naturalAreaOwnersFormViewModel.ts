import { Owner, OwnerType } from "@/components/pages/SiteFoncier/siteFoncier";
import { setOwners } from "@/store/features/naturalAreaCreation";
import { AppDispatch } from "@/store/store";

type FormData = Record<OwnerType, boolean> & {
  agriculturalCompanyName?: string;
  otherCompanyName?: string;
};

export const buildViewModel = (dispatch: AppDispatch) => {
  return {
    onSubmit: (formData: FormData) => {
      const owners: Owner[] = [];

      if (formData.AGRICULTURAL_COMPANY === true) {
        owners.push({
          type: OwnerType.AGRICULTURAL_COMPANY,
          name: formData.agriculturalCompanyName || "",
        });
      }
      if (formData.LOCAL_OR_REGIONAL_AUTHORITY === true) {
        owners.push({ type: OwnerType.LOCAL_OR_REGIONAL_AUTHORITY });
      }
      if (formData.OTHER) {
        owners.push({
          type: OwnerType.OTHER,
          name: formData.otherCompanyName || "",
        });
      }
      dispatch(setOwners(owners));
    },
  };
};
