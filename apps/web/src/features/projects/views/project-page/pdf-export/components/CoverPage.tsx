import { Image, Link, Text, View } from "@react-pdf/renderer";
import { useContext } from "react";

import { ExportImpactsContext, useTableOfContents } from "../context";
import { getPageLinkForId, pageIds } from "../pageIds";
import { tw } from "../styles";
import PdfPage from "./PdfPage";

const TableOfContentsItem = ({ label, link }: { label: string; link: string }) => (
  <Link src={link}>
    <Text style={tw("my-2")}>{label}</Text>
  </Link>
);

export default function ProjectPdfExportCoverPage() {
  const { projectName, siteName } = useContext(ExportImpactsContext);
  const tableOfContents = useTableOfContents();

  return (
    <PdfPage withHeader={false} withFooter={false}>
      <View style={tw("flex flex-col justify-center h-full")}>
        <View style={tw("flex flex-row gap-8 justify-center items-center")}>
          <Image src="/img/logos/logo-ademe.png" style={tw("h-20")} />
          <Image src="/img/logos/logo-benefriches.png" style={tw("h-8")} />
        </View>
        <Text style={tw("text-2xl leading-none font-bold text-center mt-8")}>
          Impacts du projet
        </Text>
        <Text style={tw("text-4xl leading-none font-bold text-center my-6")}>
          « {projectName} »
        </Text>
        <Text style={tw("text-xl text-center mt-2")}>{siteName}</Text>
        <Text style={tw("text-sm text-center mt-2 text-gray-500")}>
          Exporté le {new Date().toLocaleDateString()}
        </Text>
        <View style={tw("mt-16 ml-16 text-lg")}>
          {tableOfContents.map((entry) => (
            <View key={entry.pageId}>
              <TableOfContentsItem
                link={getPageLinkForId(pageIds[entry.pageId])}
                label={entry.label}
              />
              {entry.subsections && (
                <View style={tw("ml-6")}>
                  {entry.subsections.map((sub) => (
                    <TableOfContentsItem
                      key={sub.pageId}
                      link={getPageLinkForId(pageIds[sub.pageId])}
                      label={sub.label}
                    />
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </PdfPage>
  );
}
