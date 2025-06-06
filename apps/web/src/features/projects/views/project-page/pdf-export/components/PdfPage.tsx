import { Page, Text, View } from "@react-pdf/renderer";

import { styles, tw } from "../styles";
import Header from "./PdfPageHeader";

const Footer = () => {
  return (
    <View fixed style={tw("absolute bottom-3 right-6 text-gray-500 ml-auto text-[12]")}>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
    </View>
  );
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
      {withFooter && <Footer />}
    </Page>
  );
}
