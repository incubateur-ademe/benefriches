import { BreadcrumbProps, BreadcrumbSegment } from "./shared/ModalBreadcrumb";
import ModalContent from "./shared/ModalContent";
import ModalHeader from "./shared/ModalHeader";

type Props = {
  title: string;
  breadcrumbProps: {
    section: BreadcrumbProps["segments"][number];
    segments?: BreadcrumbSegment[];
  };
};

const ImpactInProgressDescriptionModal = ({ title, breadcrumbProps }: Props) => {
  const { section, segments = [] } = breadcrumbProps;
  return (
    <>
      <ModalHeader title={title} breadcrumbSegments={[section, ...segments, { label: title }]} />
      <ModalContent>
        <i>En cours de rédaction</i>
      </ModalContent>
    </>
  );
};

export default ImpactInProgressDescriptionModal;
