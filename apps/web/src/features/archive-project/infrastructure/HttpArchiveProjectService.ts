export class HttpArchiveProjectService {
  async archive(projectId: string): Promise<void> {
    const response = await fetch(`/api/reconversion-projects/${projectId}/archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while archiving reconversion project");
  }
}
