export class HttpArchiveSiteService {
  async archive(siteId: string): Promise<void> {
    const response = await fetch(`/api/sites/${siteId}/archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error while archiving site");
  }
}
