import { Font, StyleSheet } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

Font.registerEmojiSource({
  format: "png",
  url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/",
});

Font.register({
  family: "Marianne",
  fonts: [
    { src: "/dsfr/fonts/Marianne-Regular.woff2" },
    { src: "/dsfr/fonts/Marianne-Medium.woff2", fontWeight: "medium" },
    { src: "/dsfr/fonts/Marianne-Bold.woff2", fontWeight: "bold" },
  ],
});

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Marianne",
  },
});

export const tw = createTw({
  colors: {
    /*
      ⚠️ use camelCase for properties as kebab case does not work
      See https://github.com/aanckar/react-pdf-tailwind/issues/24
    */
    ["borderGrey"]: "#DDDDDD",
    ["greyLight"]: "#F6F6F6",
  },
});

export const concatClassNames = (...classNames: string[]) => {
  let result = "";
  classNames.forEach((className) => {
    if (className) result = result.concat(` ${className}`);
  });
  return result.trim();
};
