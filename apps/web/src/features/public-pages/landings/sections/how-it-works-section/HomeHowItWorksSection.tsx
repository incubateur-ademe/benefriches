import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { useState } from "react";

import SectionTitle from "../SectionTitle";
import HasOnlySiteSteps from "./HasOnlySiteSteps";
import HasSiteAndProjectSteps from "./HasSiteAndProjectSteps";
import HowItWorksSectionWrapper from "./HowItWorksSectionWrapper";

type UserSituation = "has-site-and-project" | "has-only-site";

export default function HowItWorksSection() {
  const [userSituation, setUserSituation] = useState<UserSituation>("has-site-and-project");

  return (
    <HowItWorksSectionWrapper>
      <SectionTitle>Bénéfriches, comment ça marche ?</SectionTitle>
      <SegmentedControl
        legend="Connaissance du projet d'aménagement"
        hideLegend
        className="mb-10 mt-5"
        segments={[
          {
            label: "J'ai un site et un projet",
            nativeInputProps: {
              checked: userSituation === "has-site-and-project",
              onChange: () => {
                setUserSituation("has-site-and-project");
              },
            },
          },
          {
            label: "J'ai juste une friche",
            nativeInputProps: {
              checked: userSituation === "has-only-site",
              onChange: () => {
                setUserSituation("has-only-site");
              },
            },
          },
        ]}
      />
      {userSituation === "has-site-and-project" ? <HasSiteAndProjectSteps /> : <HasOnlySiteSteps />}
    </HowItWorksSectionWrapper>
  );
}
