import type { MDXComponents } from "mdx/types";
import type { LazyExoticComponent } from "react";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";

export type ContentComponentType = React.ComponentType<{
  components?: MDXComponents;
  withMonetarisation?: boolean;
  isUrban?: boolean;
  isPhotovoltaic?: boolean;
}>;

export type BodyComponentType = React.ComponentType<{
  components?: MDXComponents;
  impactsData: ModalDataProps["impactsData"];
  contextData: ModalDataProps["contextData"];
}>;
export type ModalImpactConfig =
  | {
      title: string;
      subtitle?: string;
      description?: string;
      type?: "co2" | "surface_area" | "etp";
      unit?: string;
      formatFn?: (val: number) => string;
      ContentComponent: LazyExoticComponent<ContentComponentType>;
    }
  | {
      BodyComponent: LazyExoticComponent<BodyComponentType>;
    }
  | undefined;
