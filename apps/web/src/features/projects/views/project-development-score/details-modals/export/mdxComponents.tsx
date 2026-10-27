import { Text, View, Link as PdfLink, Image as PdfImage } from "@react-pdf/renderer";
import type { ComponentProps, ReactNode } from "react";

import { ModalPdfTd } from "./ModalPdfTd";
import { type Style, renderChildren } from "./helpers";
import { exportModalPdfStyles as s } from "./styles";

export const pdfHeading =
  <T extends "h1" | "h2" | "h3" | "h4" | "h5" | "h6">(tag: T) =>
  ({ children }: ComponentProps<T>) => (
    <View minPresenceAhead={60}>{renderChildren(children, s[tag], true)}</View>
  );

const container =
  (style?: Style, extra?: ComponentProps<typeof View>) =>
  ({ children }: { children?: ReactNode }) => (
    <View style={style} {...extra}>
      {renderChildren(children)}
    </View>
  );

export const pdfComponents = {
  h1: pdfHeading("h1"),
  h2: pdfHeading("h2"),
  h3: pdfHeading("h3"),
  h4: pdfHeading("h4"),
  h5: pdfHeading("h5"),
  h6: pdfHeading("h6"),
  p: ({ children }: ComponentProps<"p">) => renderChildren(children, s.p, true),

  strong: ({ children }: ComponentProps<"strong">) =>
    renderChildren(children, { fontWeight: 700 }, true),
  em: ({ children }: ComponentProps<"em">) =>
    renderChildren(children, { fontStyle: "italic" }, true),
  inlineCode: ({ children }: ComponentProps<"code">) => renderChildren(children, s.code, true),
  code: ({ children }: ComponentProps<"code">) => renderChildren(children, s.code, true),
  pre: ({ children }: ComponentProps<"pre">) => (
    <View wrap={false}>{renderChildren(children, s.pre)}</View>
  ),
  a: ({ href, children }: ComponentProps<"a">) => (
    <PdfLink src={href}>{renderChildren(children, s.link, true)}</PdfLink>
  ),

  li: ({ children }: ComponentProps<"li">) => (
    <View style={s.li} wrap={false}>
      <Text style={s.bullet}>•</Text>
      <View style={{ flex: 1 }}>{renderChildren(children, {}, true)}</View>
    </View>
  ),

  img: ({ src }: ComponentProps<"img">) => (
    <View wrap={false}>
      <PdfImage src={src} style={{ marginVertical: 8 }} />
    </View>
  ),
  th: (p: ComponentProps<"th">) => (
    <View style={{ ...s.cell, ...s.headRow }}>
      {renderChildren(
        p.children,
        [s.cellText, s.headText, { textAlign: p.align !== "char" ? p.align : "left" }],
        true,
      )}
    </View>
  ),
  td: ModalPdfTd,
  wrapper: container(),
  section: container(),
  blockquote: container(s.blockquote, { wrap: false }),
  ul: container({ marginBottom: 8 }),
  ol: container({ marginBottom: 8 }),
  table: container(s.table, { wrap: false }),
  thead: container(),
  tbody: container(),
  tr: container(s.row, { wrap: false }),
};
