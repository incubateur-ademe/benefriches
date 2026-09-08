import TestimoniesCarousel from "@/shared/views/components/Testimonies/TestimoniesCarousel";

import OnboardingStepShell from "../step-shell/OnboardingStepShell";

const HEADING = "Ils ont testé et approuvé Bénéfriches";

export default function OnboardingTestimonialsPage() {
  return (
    <OnboardingStepShell
      step="testimonials"
      htmlTitle={`${HEADING} - Premiers pas`}
      belowBubbleContent={<TestimoniesCarousel />}
    >
      <h2 className="mb-4">{HEADING}</h2>
      {/* Copy transcribed from Figma screenshot, best-effort — needs design confirmation. */}
      <p className="mb-0">
        Voici quelques témoignages de techniciens qui se sont appuyés sur Bénéfriches pour faire
        avancer leur projet d'aménagement.
      </p>
    </OnboardingStepShell>
  );
}
