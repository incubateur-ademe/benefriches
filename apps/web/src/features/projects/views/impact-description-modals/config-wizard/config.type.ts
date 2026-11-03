import type { MDXComponents } from "mdx/types";
import type { LazyExoticComponent } from "react";
import type { Link } from "type-route";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";

import type { ContentState } from "../ImpactModalDescriptionContext";
import type { ModalHeaderProps } from "../modal-layout/ModalHeader";

export type ContentComponentType = React.ComponentType<{
  components?: MDXComponents;
  withMonetarisation?: boolean;
  isUrban?: boolean;
  isPhotovoltaic?: boolean;
}>;

export type ModalImpactConfig =
  | {
      subtitle?: string;
      description?: string;
      type?: "co2" | "surface_area" | "etp";
      unit?: string;
      caption?: string;
      formatFn?: (val: number) => string;
      ContentComponent: LazyExoticComponent<ContentComponentType>;
      dataProps?: (
        p: ModalDataProps & {
          getDetailsLink: (args: ContentState) => Link | undefined;
        },
      ) => ModalHeaderProps["dataProps"];
    }
  | undefined;
