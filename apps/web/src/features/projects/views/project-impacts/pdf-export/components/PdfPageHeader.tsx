import { Image, Text, View } from "@react-pdf/renderer";
import { useContext } from "react";

import { ExportImpactsContext } from "../context";
import { tw } from "../styles";

export default function PdfPageHeader() {
  const { projectName } = useContext(ExportImpactsContext);

  return (
    <View
      style={tw(
        "flex flex-row items-center justify-between px-6 py-3 mb-6 border-b border-gray-200",
      )}
      fixed
    >
      <Image src="/img/logos/logo-benefriches.png" style={{ height: 16 }} />
      <Text style={tw("text-base text-gray-500")}>Projet « {projectName} »</Text>
      <Image src="/img/logos/logo-ademe.png" style={{ height: 28 }} />
    </View>
  );
}
