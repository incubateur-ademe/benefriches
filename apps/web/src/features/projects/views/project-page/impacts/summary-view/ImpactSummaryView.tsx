import React, { useContext } from "react";

import {
  KeyImpactIndicatorData,
  PRIORITY_ORDER,
} from "@/features/projects/core/projectKeyImpactIndicators";

import { ImpactModalDescriptionContext } from "../../../impact-description-modals/ImpactModalDescriptionContext";
import { getSummaryIndicatorTitle } from "../../../shared/impacts/summary";
import KeyImpactIndicatorCard from "./KeyImpactIndicatorCard";

type Props = {
  keyImpactIndicatorsList: KeyImpactIndicatorData[];
};

const ImpactSummaryView = ({ keyImpactIndicatorsList }: Props) => {
  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);
  return (
    <section className="mt-10 grid grid-rows-1 lg:grid-cols-3 gap-6">
      {keyImpactIndicatorsList
        .toSorted(
          ({ name: aName }, { name: bName }) =>
            PRIORITY_ORDER.indexOf(aName) - PRIORITY_ORDER.indexOf(bName),
        )
        .map(({ name, isSuccess }) => (
          <React.Fragment key={name}>
            <KeyImpactIndicatorCard
              title={getSummaryIndicatorTitle({ name, isSuccess })}
              type={isSuccess ? "success" : "error"}
              linkProps={getDetailsLink({ sectionName: "summary", impactDetailsName: name })!}
            />
          </React.Fragment>
        ))}
    </section>
  );
};

export default ImpactSummaryView;
