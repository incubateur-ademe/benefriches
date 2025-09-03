import Button from "@codegouvfr/react-dsfr/Button";

import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import { featureAlertSubscribed } from "@/features/user-feature-alerts/core/createFeatureAlert.action";
import { selectUserFeaturesAlerts } from "@/features/user-feature-alerts/core/userFeatureAlert.reducer";
import { mutafrichesHomepageModalOpened, trackEvent } from "@/shared/views/analytics";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import SectionTitle from "../SectionTitle";
import MutafrichesAvailabilityModal from "./MutafrichesAvailabilityModal";
import { mutafrichesAvailabilityModal } from "./mutafrichesModal";

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="font-medium relative pl-6 before:content-['✔️'] before:absolute before:left-0">
    {children}
  </li>
);

export default function SituationSection() {
  const dispatch = useAppDispatch();
  const userEmail = useAppSelector(selectCurrentUserEmail);
  const { createUserFeatureAlertState } = useAppSelector(selectUserFeaturesAlerts);
  const mutafrichesAvailabilityAlertSubscribed = (email: string) => {
    void dispatch(
      featureAlertSubscribed({
        feature: { type: "mutafriches_availability" },
        email,
      }),
    );
  };

  return (
    <section className="bg-white dark:bg-blue-dark py-20" id="votre-projet-d-amenagement">
      <div className="fr-container">
        <SectionTitle>Où en êtes-vous de votre projet d'aménagement ?</SectionTitle>
        <div className="md:grid md:grid-cols-2 gap-6 mt-[60px]">
          <article className="bg-[#EEE9F4] dark:bg-blue-ultradark p-10 rounded-xl">
            <img className="mb-6 h-[100px]" src="/img/pictograms/site-nature/friche.svg" alt="" />
            <h3 className="text-2xl">
              J'ai une friche et je souhaite trouver l'usage le plus adapté.
            </h3>
            <Button
              onClick={() => {
                trackEvent(mutafrichesHomepageModalOpened());
                mutafrichesAvailabilityModal.open();
              }}
            >
              Analyser la compatibilité de ma friche
            </Button>
            <p className="mt-6 mb-2 font-bold">POINTS FORTS :</p>
            <ul className="list-none p-0">
              <ListItem>7 usages potentiels analysés</ListItem>
              <ListItem>Score de compatibilité entre votre friche et les usages</ListItem>
              <ListItem>
                Possibilité de consulter les impacts socio-économiques de certains usages
              </ListItem>
            </ul>
          </article>
          <article className="bg-[#E2EEF3] dark:bg-blue-ultradark p-10 rounded-xl">
            <img className="mb-6 h-[100px]" src="/img/pictograms/all-projects.svg" alt="" />
            <h3 className="text-2xl">
              J'ai un projet sur un site et je souhaite savoir quelles seraient ses retombées.
            </h3>
            <Button linkProps={{ ...routes.onBoardingIntroductionWhy().link }}>
              Évaluer les impacts de mon projet
            </Button>
            <p className="mt-6 mb-2 font-bold">POINTS FORTS :</p>
            <ul className="list-none p-0">
              <ListItem>Jusqu'à 90 indicateurs calculés</ListItem>
              <ListItem>Sur une durée de 1 à 50 ans</ListItem>
              <ListItem>
                Possibilité de comparer les impacts du projet avec ceux d'autres projets
              </ListItem>
            </ul>
          </article>
        </div>
      </div>
      <MutafrichesAvailabilityModal
        onSubmit={mutafrichesAvailabilityAlertSubscribed}
        onSaveLoadingState={createUserFeatureAlertState.mutafrichesAvailability}
        userEmail={userEmail}
      />
    </section>
  );
}
