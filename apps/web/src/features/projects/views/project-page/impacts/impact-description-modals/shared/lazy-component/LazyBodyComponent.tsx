import type { MDXComponents } from "mdx/types";
import { lazy, useMemo } from "react";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";

export type LazyBodyComponent = () => Promise<{
  default: React.ComponentType<{
    components?: MDXComponents;
    impactsData: ModalDataProps["impactsData"];
    contextData: ModalDataProps["contextData"];
  }>;
}>;

type Props = {
  contextData: ModalDataProps["contextData"];
  impactsData: ModalDataProps["impactsData"];
  Component: LazyBodyComponent;
};

export function LazyBodyComponent({ Component, ...props }: Props) {
  const LazyComponent = useMemo(
    () =>
      lazy<
        React.ComponentType<{
          components?: MDXComponents;
          impactsData: ModalDataProps["impactsData"];
          contextData: ModalDataProps["contextData"];
        }>
      >(Component),
    [Component],
  );

  return <LazyComponent {...props} />;
}
