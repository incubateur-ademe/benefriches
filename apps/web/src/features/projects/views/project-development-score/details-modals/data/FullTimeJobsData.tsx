import type { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";

import { serializeContentState } from "../../../impact-description-modals/ImpactModalDescriptionContext";
import { getSocialImpactColor } from "../../../impact-description-modals/colors";
import { getImpactModalData } from "../../../impact-description-modals/getImpactData";
import ModalAreaChart from "../../../impact-description-modals/modal-charts/ModalAreaChart";
import ModalData from "../../../impact-description-modals/modal-layout/ModalData";
import ModalTable from "../../../impact-description-modals/modal-table/ModalTable";
import { formatETPImpact } from "../../../shared/formatImpactValue";
import { getSocialImpactLabel } from "../../../shared/getImpactLabel";
import type { DataProps } from "../developmentScoreModalsConfig";

export default function FullTimeJobsData({ modalsData, getUpdateDetailsLink }: DataProps) {
  const data = getImpactModalData<SocialImpactMetricKeyName>(
    modalsData.socialMetricsByCategory.jobs,
    "fullTimeJobs",
    {
      getLabel: getSocialImpactLabel,
      getColor: getSocialImpactColor,
      getLinkProps: (key) =>
        getUpdateDetailsLink(
          serializeContentState({ sectionName: "social.jobs", impactDetailsName: key }),
        ),
    },
  );
  if (!data?.breakdown || !data.details) {
    return null;
  }
  return (
    <ModalData noPadding>
      <ModalAreaChart
        type="etp"
        base={data.breakdown?.base}
        forecast={data.breakdown.forecast}
        difference={data.total}
        title={getSocialImpactLabel("fullTimeJobs")}
        color={data.color}
        details={data?.details.map((item) => ({
          ...item,
          base: item.breakdown?.base ?? 0,
          forecast: item.breakdown?.forecast ?? item.value,
          difference: item.value,
        }))}
      />

      <ModalTable
        formatFn={formatETPImpact}
        caption="Détails des emplois temps plein créés, supprimés ou préservés"
        data={data?.details}
      />
    </ModalData>
  );
}
