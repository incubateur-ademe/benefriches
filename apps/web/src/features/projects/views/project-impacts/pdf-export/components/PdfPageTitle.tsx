import { Text } from "@react-pdf/renderer";

import { tw } from "../styles";

export default function PdfPageTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={tw("text-2xl mb-4 font-bold")} fixed>
      {children}
    </Text>
  );
}
