import { useMemo } from "react";

const LOGOS_COUNT = 28;

const getRandomNumbers = (count: number, max: number): number[] => {
  const indexes = new Set<number>();

  while (indexes.size < count) {
    const randomIndex = Math.floor(Math.random() * max) + 1;
    indexes.add(randomIndex);
  }

  return Array.from(indexes);
};

export default function UserLogosSection() {
  const userLogoIndexes = useMemo(() => getRandomNumbers(7, LOGOS_COUNT), []);

  return (
    <section className="fr-container tw-pb-20">
      <p className="tw-font-bold tw-text-sm tw-uppercase">
        Plus de 700 collectivités et entreprises l'ont déjà testé
      </p>
      <div className="tw-grid tw-grid-cols-7 tw-mt-10 tw-gap-2">
        {userLogoIndexes.map((index) => (
          <img
            key={index}
            src={`/img/logos/users/user-${index}.jpg`}
            alt=""
            className="tw-object-contain tw-h-12 tw-w-full"
          />
        ))}
      </div>
    </section>
  );
}
