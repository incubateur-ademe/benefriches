type Props = {
  reconversionProjectId: string;
  newProjectId: string;
};

export class HttpDuplicateProjectService {
  async duplicate({ reconversionProjectId, newProjectId }: Props): Promise<void> {
    const response = await fetch(`/api/reconversion-projects/${reconversionProjectId}/duplicate`, {
      method: "POST",
      body: JSON.stringify({ newProjectId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while duplicating new reconversion project");
  }
}
