import { Link, Text, View } from "@react-pdf/renderer";

import {
  ABOUT_SECTIONS,
  LEARN_MORE_SECTION,
  type AboutSection,
  type ListItem,
  type TextSegment,
} from "@/features/projects/views/shared/impacts/aboutBenefrichesContent";

import ListItemComponent from "../components/ListItem";
import PdfPage from "../components/PdfPage";
import PdfPageTitle from "../components/PdfPageTitle";
import { pageIds } from "../pageIds";
import { tw } from "../styles";

const SectionTitle = ({ children }: { children: string }) => {
  return <Text style={tw("text-lg mb-2 font-bold")}>{children}</Text>;
};

const renderTextSegment = (segment: TextSegment, index: number): React.ReactNode => {
  if (typeof segment === "string") {
    return segment;
  }
  return (
    <Link key={index} src={segment.link.url}>
      <Text style={tw("text-blue-600")}>{segment.text}</Text>
    </Link>
  );
};

const renderListItem = (item: ListItem, index: number) => {
  return <ListItemComponent key={index}>{item.segments.map(renderTextSegment)}</ListItemComponent>;
};

const renderSectionContent = (section: AboutSection) => {
  return section.content.map((block, blockIndex) => {
    const key = `${section.id}-block-${blockIndex.toString()}`;
    switch (block.type) {
      case "paragraph":
        return (
          <Text key={key} style={tw("mb-2")}>
            {block.texts.map(renderTextSegment)}
          </Text>
        );
      case "list":
        return (
          <View key={key} style={tw("mb-2")}>
            {block.items.map(renderListItem)}
          </View>
        );
    }
  });
};

export default function AboutBenefrichesPdfPage() {
  return (
    <PdfPage id={pageIds["about-benefriches"]}>
      <PdfPageTitle>4. À propos de Bénéfriches</PdfPageTitle>

      {[...ABOUT_SECTIONS, LEARN_MORE_SECTION].map((section) => (
        <View key={section.id} style={tw("mb-6")} wrap={false}>
          <SectionTitle>{section.title}</SectionTitle>
          {renderSectionContent(section)}
        </View>
      ))}
    </PdfPage>
  );
}
