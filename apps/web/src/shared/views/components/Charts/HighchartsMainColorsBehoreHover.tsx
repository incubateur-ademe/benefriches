import { CSSProperties, HTMLAttributes, ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
  colors: number[];
} & HTMLAttributes<HTMLDivElement>;

const HighchartsMainColorsBehoreHover = ({ children, colors = [], ...props }: Props) => {
  const [onHovered, setOnHovered] = useState(false);

  const style = Object.fromEntries(
    colors.map((colorIndex, index) =>
      colorIndex !== index
        ? [`--highcharts-color-${index}`, `var(--highcharts-color-${colorIndex})`]
        : [],
    ),
  ) as CSSProperties;

  return (
    <div
      style={!onHovered ? style : {}}
      className="highcharts-same-color-before-hover"
      onMouseEnter={() => {
        setOnHovered(true);
      }}
      onMouseLeave={() => {
        setOnHovered(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default HighchartsMainColorsBehoreHover;
