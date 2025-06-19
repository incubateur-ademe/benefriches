import ModalBody from "./ModalBody";
import { BreadcrumbProps, BreadcrumbSegment } from "./ModalBreadcrumb";
import ModalContent from "./ModalContent";
import ModalHeader from "./ModalHeader";

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
    <ModalBody size="small">
      <ModalHeader title={title} breadcrumbSegments={[section, ...segments, { label: title }]} />
      <ModalContent>
        <i>En cours de rédaction</i>
      </ModalContent>
    </ModalBody>
  );
};

export default ImpactInProgressDescriptionModal;
