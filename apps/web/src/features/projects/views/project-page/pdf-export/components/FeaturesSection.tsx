import { Text, View } from "@react-pdf/renderer";

import { tw } from "../styles";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function FeaturesSection({ title, children }: Props) {
  return (
    <View style={tw("mb-8")} wrap={false}>
      <Text style={tw("text-lg mb-2 font-bold")}>{title}</Text>
      {children}
    </View>
  );
}
