import { StyleSheet } from "@react-pdf/renderer";

const HEADER_HEIGHT = 40;

export const exportModalPdfStyles = StyleSheet.create({
  page: {
    fontFamily: "Marianne",
    paddingHorizontal: 32,
    paddingTop: 32 + HEADER_HEIGHT,
    paddingBottom: 56,
    fontSize: 12,
  },
  h1: { fontSize: 18, fontWeight: 700, marginBottom: 12 },
  h2: { fontSize: 16, fontWeight: 700, marginTop: 14, marginBottom: 8 },
  h3: { fontSize: 14, fontWeight: 700, marginTop: 14, marginBottom: 8 },
  h4: { fontSize: 13, fontWeight: 700, marginTop: 14, marginBottom: 8 },
  h5: { fontSize: 12, fontWeight: 700, marginTop: 14, marginBottom: 8 },
  h6: { fontSize: 12, fontWeight: 700, marginTop: 14, marginBottom: 8 },
  p: { fontSize: 11, lineHeight: 1.5, marginBottom: 8 },
  li: { flexDirection: "row", marginBottom: 3 },
  bullet: { width: 12, fontSize: 11 },
  code: { fontFamily: "Courier", backgroundColor: "#eee" },
  pre: {
    fontFamily: "Courier",
    fontSize: 9,
    backgroundColor: "#f4f4f4",
    padding: 8,
    marginBottom: 8,
  },
  link: { color: "#2563eb", textDecoration: "underline" },
  table: { marginVertical: 8, borderWidth: 1, borderColor: "#d4d4d4" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e5e5e5" },
  headRow: { backgroundColor: "#f4f4f4", textTransform: "uppercase" },
  cell: { flex: 1, padding: 8 },
  cellText: { fontSize: 10, lineHeight: 1.4 },
  headText: { fontWeight: 700 },
  blockquote: {},

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    gap: 8,
  },
  headerText: { fontSize: 9, color: "#666666" },
});
