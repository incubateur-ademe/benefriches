import { capitalize } from "../services";
import { startsByVowel } from "../services/strings/startsByVowel";

export const formatCityWithPlacePreposition = (name: string): string => {
  const nameLowerCase = name.toLocaleLowerCase();
  if (nameLowerCase.startsWith("les ")) {
    return `des ${capitalize(name.substring(4))}`;
  }
  if (nameLowerCase.startsWith("le ")) {
    return `du ${capitalize(name.substring(3))}`;
  }
  if (startsByVowel(name) || nameLowerCase.startsWith("h")) {
    return `d'${capitalize(name)}`;
  }
  return `de ${capitalize(name)}`;
};
