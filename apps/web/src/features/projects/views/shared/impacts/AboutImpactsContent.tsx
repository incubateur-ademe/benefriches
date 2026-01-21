import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import {
  ABOUT_SECTIONS,
  COMPARISON_SECTION,
  LEARN_MORE_SECTION,
  type AboutSection,
  type ListItem,
  type TextSegment,
} from "./aboutBenefrichesContent";

const SectionTitle = ({ children }: { children: string }) => {
  return <h3 className="text-base mb-3">{children}</h3>;
};

const renderTextSegment = (segment: TextSegment, index: number) => {
  if (typeof segment === "string") {
    return <span key={index}>{segment}</span>;
  }
  return (
    <ExternalLink key={index} href={segment.link.url}>
      {segment.text}
    </ExternalLink>
  );
};

const renderListItem = (item: ListItem, index: number) => {
  return <li key={index}>{item.segments.map(renderTextSegment)}</li>;
};

export const SectionContent = ({ section }: { section: AboutSection }) => {
  return (
    <>
      {section.content.map((block, blockIndex) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={`${section.id}-p-${blockIndex.toString()}`} className={"mb-4"}>
                {block.texts.map(renderTextSegment)}
              </p>
            );
          case "list":
            if (block.listType === "ul") {
              return (
                <ul key={`${section.id}-list-${blockIndex.toString()}`} className="mb-4">
                  {block.items.map(renderListItem)}
                </ul>
              );
            } else {
              return (
                <ol key={`${section.id}-list-${blockIndex.toString()}`} className="mb-4">
                  {block.items.map(renderListItem)}
                </ol>
              );
            }
        }
      })}
    </>
  );
};

const renderSection = (section: AboutSection) => {
  return (
    <section key={section.id} className="mb-6">
      <SectionTitle>{section.title}</SectionTitle>
      <SectionContent section={section} />
    </section>
  );
};

function AboutImpactsContent() {
  return (
    <>
      {ABOUT_SECTIONS.map(renderSection)}
      {renderSection(COMPARISON_SECTION)}
      {renderSection(LEARN_MORE_SECTION)}
    </>
  );
}

export default AboutImpactsContent;
