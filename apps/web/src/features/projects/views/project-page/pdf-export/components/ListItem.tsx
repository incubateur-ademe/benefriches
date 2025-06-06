import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: 12,
  },
  bullet: {
    height: "100%",
  },
});

type Props = {
  children: React.ReactNode;
};

export default function ListItem({ children }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.bullet}>
        <Text>{"\u2022" + " "}</Text>
      </View>
      <Text>{children}</Text>
    </View>
  );
}
