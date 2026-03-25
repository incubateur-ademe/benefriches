import { Image, Page, Text, View } from "@react-pdf/renderer";
import { useContext } from "react";

import { ExportImpactsContext } from "../context";
import { styles, tw } from "../styles";
import Header from "./PdfPageHeader";

const Footer = () => {
  return (
    <View fixed style={tw("absolute bottom-3 right-6 text-gray-500 ml-auto text-[12]")}>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
    </View>
  );
};

const generateWatermarkImage = (): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 595;
  canvas.height = 842;
  const ctx = canvas.getContext("2d")!;

  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "gray";
  ctx.font = "bold 70px Marianne";
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 4);
  ctx.textAlign = "center";
  ctx.fillText("Évaluation démo", 0, 0);

  return canvas.toDataURL("image/png");
};

type PdfPageProps = {
  children: React.ReactNode;
  id?: string;
  withHeader?: boolean;
  withFooter?: boolean;
};
export default function PdfPage({
  children,
  id,
  withHeader = true,
  withFooter = true,
}: PdfPageProps) {
  const { withDemoWatermark } = useContext(ExportImpactsContext);

  return (
    <Page style={styles.page}>
      {withHeader && <Header />}
      <View
        id={id}
        style={{
          paddingHorizontal: "25pt",
          fontSize: 12,
        }}
      >
        {children}
      </View>
      {withDemoWatermark && (
        <Image
          src={generateWatermarkImage()}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}
      {withFooter && <Footer />}
    </Page>
  );
}
