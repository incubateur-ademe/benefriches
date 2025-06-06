import { Text } from "@react-pdf/renderer";

import { tw } from "../styles";

export default function PdfPageSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={tw("text-xl mb-2 font-bold")} fixed>
      {children}
    </Text>
  );
}
