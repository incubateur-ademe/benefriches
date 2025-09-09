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
    <section className="pb-20 bg-white dark:bg-blue-dark">
      <div className="fr-container">
        <p className="font-bold text-sm uppercase">
          Plus de 700 collectivités et entreprises l'ont déjà testé
        </p>
        <div className="grid grid-cols-7 mt-10 gap-2">
          {userLogoIndexes.map((index) => (
            <img
              key={index}
              src={`/img/logos/users/user-${index}.jpg`}
              alt=""
              className="object-contain h-12 w-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
