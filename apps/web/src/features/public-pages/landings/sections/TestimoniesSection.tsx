import TestimoniesCarousel from "@/shared/views/components/Testimonies/TestimoniesCarousel";

import SectionTitle from "./SectionTitle";

export default function TestimoniesSection() {
  return (
    <section className="bg-blue-light dark:bg-blue-ultradark py-20">
      <TestimoniesCarousel
        fullBleed
        title={<SectionTitle className="m-0">Ils sont convaincus par Bénéfriches</SectionTitle>}
      />
    </section>
  );
}
