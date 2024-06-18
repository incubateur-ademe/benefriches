import { CSSProperties, ReactNode } from "react";

type Props = {
  colors: string[];
  children: ReactNode;
};

const HighchartsCustomColorsWrapper = ({ colors, children }: Props) => {
  const style = Object.fromEntries(
    colors.map((color, index) => (color ? [`--highcharts-color-${index}`, color] : [])),
  ) as CSSProperties;
  return <div style={style}>{children}</div>;
};

export default HighchartsCustomColorsWrapper;
