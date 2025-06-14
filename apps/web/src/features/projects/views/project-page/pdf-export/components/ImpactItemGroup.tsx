import { View } from "@react-pdf/renderer";
import { ReactNode } from "react";

import { tw } from "../styles";

type Props = {
  children: ReactNode;
};
export default function ImpactItemGroup({ children }: Props) {
  return (
    <View
      style={tw("bg-white border border-solid border-borderGrey py-2 px-4 rounded")}
      wrap={false}
    >
      {children}
    </View>
  );
}
