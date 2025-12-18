import { render, screen } from "@testing-library/react";
import { expect, vi } from "vitest";

import ProjectCreationResult from "./ProjectCreationResult";

describe("ProjectCreationResult", () => {
  const defaultProps = {
    projectId: "project-123",
    projectName: "Mon projet",
    onBack: vi.fn(),
    shouldGoThroughOnboarding: true,
  };

  it("should render spinner when loading", () => {
    render(<ProjectCreationResult {...defaultProps} loadingState="loading" />);

    expect(
      screen.getByText("Création du projet « Mon projet », veuillez patienter..."),
    ).toBeInTheDocument();
  });

  it("should render error alert with back button when error", () => {
    render(<ProjectCreationResult {...defaultProps} loadingState="error" />);

    expect(screen.getByText("Le projet n'a pas pu être sauvegardé")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Précédent" })).toBeInTheDocument();
  });

  it("should render link to onboarding page when shouldGoThroughOnboarding is true", () => {
    render(<ProjectCreationResult {...defaultProps} loadingState="success" />);

    expect(screen.getByText("Le projet « Mon projet » est créé !")).toBeInTheDocument();
    expect(screen.getByText("Mais avant cela, 3 informations importantes.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voir les infos importantes" })).toHaveAttribute(
      "href",
      "/mes-projets/project-123/onboarding-impacts",
    );
  });

  it("should render link to impacts page when shouldGoThroughOnboarding is false", () => {
    render(
      <ProjectCreationResult
        {...defaultProps}
        loadingState="success"
        shouldGoThroughOnboarding={false}
      />,
    );

    expect(screen.getByText("Le projet « Mon projet » est créé !")).toBeInTheDocument();
    expect(
      screen.queryByText("Mais avant cela, 3 informations importantes."),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Consulter les impacts" })).toHaveAttribute(
      "href",
      "/mes-projets/project-123/impacts",
    );
  });
});
