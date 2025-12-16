import { Text, View } from "@react-pdf/renderer";

import { SocialImpact } from "@/features/projects/domain/projectImpactsSocial";

import { getSocialImpactLabel } from "../../../impacts/getImpactLabel";
import ImpactItemDetails from "../../components/ImpactItemDetails";
import ImpactItemGroup from "../../components/ImpactItemGroup";
import ImpactsSection from "../../components/ImpactsSection";
import ListItem from "../../components/ListItem";
import PdfPage from "../../components/PdfPage";
import PdfPageSubtitle from "../../components/PdfPageSubtitle";
import { useSectionLabel } from "../../context";
import { pageIds } from "../../pageIds";
import { tw } from "../../styles";

const SOCIAL_SECTIONS = {
  jobs: ["full_time_jobs"],
  residents: ["avoided_vehicule_kilometers", "travel_time_saved", "avoided_traffic_accidents"],
  french_society: ["avoided_friche_accidents", "households_powered_by_renewable_energy"],
};

type Props = {
  impacts: SocialImpact[];
};

const SocialImpactsPage = ({ impacts }: Props) => {
  const sectionLabel = useSectionLabel("impacts-social");
  const jobsImpacts = impacts.filter(({ name }) => SOCIAL_SECTIONS.jobs.includes(name));
  const residentsImpacts = impacts.filter(({ name }) => SOCIAL_SECTIONS.residents.includes(name));
  const frenchSocietyImpacts = impacts.filter(({ name }) =>
    SOCIAL_SECTIONS.french_society.includes(name),
  );

  return (
    <PdfPage id={pageIds["impacts-social"]}>
      <PdfPageSubtitle>{sectionLabel}</PdfPageSubtitle>
      <View style={tw("mb-4")}>
        <Text>La catégorie des impacts sociaux regroupe les impacts :</Text>
        <View style={tw("py-2")}>
          <ListItem>sur l'emploi</ListItem>
          <ListItem>sur la population locale</ListItem>
          <ListItem>sur la société française</ListItem>
        </View>
      </View>
      {jobsImpacts.length > 0 && (
        <ImpactsSection title="Impacts sur l'emploi">
          {jobsImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name}>
              <ImpactItemDetails
                label={getSocialImpactLabel(name)}
                value={impact.difference}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getSocialImpactLabel(detailsName),
                        value: detailsImpact.difference,
                      }))
                    : undefined
                }
                type={type}
              />
            </ImpactItemGroup>
          ))}
        </ImpactsSection>
      )}

      {residentsImpacts.length > 0 && (
        <ImpactsSection title="Impacts sur la population locale">
          {residentsImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name}>
              <ImpactItemDetails
                label={getSocialImpactLabel(name)}
                value={impact.difference}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getSocialImpactLabel(detailsName),
                        value: detailsImpact.difference,
                      }))
                    : undefined
                }
                type={type}
              />
            </ImpactItemGroup>
          ))}
        </ImpactsSection>
      )}

      {frenchSocietyImpacts.length > 0 && (
        <ImpactsSection title="Impacts sur la société française">
          {frenchSocietyImpacts.map(({ name, impact, type }) => (
            <ImpactItemGroup key={name}>
              <ImpactItemDetails
                label={getSocialImpactLabel(name)}
                value={impact.difference}
                data={
                  impact.details
                    ? impact.details.map(({ name: detailsName, impact: detailsImpact }) => ({
                        label: getSocialImpactLabel(detailsName),
                        value: detailsImpact.difference,
                      }))
                    : undefined
                }
                type={type}
              />
            </ImpactItemGroup>
          ))}
        </ImpactsSection>
      )}
    </PdfPage>
  );
};

export default SocialImpactsPage;
