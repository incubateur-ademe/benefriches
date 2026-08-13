import { MDXComponents } from "mdx/types";

import { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";

import { LazyContentComponent } from "../lazy-component/LazyContentComponent";

export type ModalImpactConfig =
  | {
      title: string;
      subtitle?: string;
      description?: string;
      type?: "co2" | "surface_area" | "etp";
      unit?: string;
      formatFn?: (val: number) => string;
      ContentComponent: LazyContentComponent;
    }
  | {
      BodyComponent: () => Promise<{
        default: React.ComponentType<{
          components?: MDXComponents;
          impactsData: ModalDataProps["impactsData"];
          contextData: ModalDataProps["contextData"];
        }>;
      }>;
    }
  | undefined;
