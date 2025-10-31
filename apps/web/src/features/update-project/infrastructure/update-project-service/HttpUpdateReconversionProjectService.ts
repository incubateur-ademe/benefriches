import {
  reconversionProjectSchemaUpdateView,
  UpdateProjectSavePayload,
  UpdateProjectServiceGateway,
} from "../../core/updateProject.types";

export class HttpUpdateReconversionProjectService implements UpdateProjectServiceGateway {
  async getById(projectId: string) {
    const response = await fetch(`/api/reconversion-projects/${projectId}`);

    if (!response.ok)
      throw new Error(
        `HttpUpdateReconversionProjectService: Error while fetching project data with id ${projectId}`,
      );

    return reconversionProjectSchemaUpdateView.parse(await response.json());
  }

  async save(projectId: string, updatedProject: UpdateProjectSavePayload) {
    const response = await fetch(`/api/reconversion-projects/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(updatedProject),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok)
      throw new Error(
        "HttpUpdateReconversionProjectService: Error while updating reconversion project",
      );
  }
}
