import { Text, View } from "@react-pdf/renderer";
import type { ComponentProps, ReactNode } from "react";
import { getLetterGradeFromLetterGradeWithModifiers, type LetterGradeWithModifier } from "shared";

import { parseLetterGradeCell, textOf } from "../../../shared/impacts/documentation/mdxHelpers";
import { getLetterGradeBadgeText } from "../../layout/gradeLabels";
import { extractGradeColor, renderChildren, type Style } from "./helpers";
import { exportModalPdfStyles } from "./styles";

const ModalPdfTdWrapper = ({
  children,
  backgroundColor,
  style,
}: {
  children?: ReactNode;
  backgroundColor?: string;
  style?: object;
}) => (
  <View
    style={{
      padding: 9,
      borderBottomWidth: 1,
      borderBottomColor: "#dddddd",
      backgroundColor,
      ...style,
    }}
  >
    {children}
  </View>
);

export const ModalPdfSimpleTd = ({ children, style = {}, ...props }: ComponentProps<"td">) => (
  <View style={{ ...exportModalPdfStyles.cell, ...(style as object) }}>
    {renderChildren(
      children,
      [exportModalPdfStyles.cellText, { textAlign: props.align !== "char" ? props.align : "left" }],
      true,
    )}
  </View>
);

const PdfGradeBadge = ({ letterGrade }: { letterGrade: LetterGradeWithModifier }) => {
  const key = getLetterGradeFromLetterGradeWithModifiers(letterGrade);

  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: extractGradeColor(key, "bgColor"),
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Text style={{ color: extractGradeColor(key, "textColor"), fontSize: 11, fontWeight: 700 }}>
        {letterGrade}
      </Text>
    </View>
  );
};

export const ModalPdfTd = ({ children, ...props }: ComponentProps<"td"> & { style: Style }) => {
  const parsed = parseLetterGradeCell(textOf(children).trim());

  if (!parsed) {
    return (
      <View style={exportModalPdfStyles.cell}>
        {renderChildren(
          children,
          [
            exportModalPdfStyles.cellText,
            { textAlign: props.align !== "char" ? props.align : "left" },
          ],
          true,
        )}
      </View>
    );
  }

  const { gradeWithModifier, labelKind } = parsed;
  const letterGrade = getLetterGradeFromLetterGradeWithModifiers(gradeWithModifier);

  return (
    <ModalPdfTdWrapper
      backgroundColor={extractGradeColor(letterGrade, "bgLightColor")}
      style={{
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <PdfGradeBadge letterGrade={gradeWithModifier} />
        {labelKind && (
          <Text style={{ fontWeight: 700, paddingLeft: 9, fontSize: 11 }}>
            {getLetterGradeBadgeText(labelKind, letterGrade)}
          </Text>
        )}
      </View>
    </ModalPdfTdWrapper>
  );
};
