// The fields the project impacts summary needs besides the impacts: the names for the subject and
// the intro, the creation date for "Évaluation réalisée le …" (stored, so a retry renders the same
// date).
export type LifecycleEmailProject = {
  id: string;
  name: string;
  siteName: string;
  createdAt: Date;
};

// Used by the send use case, the retry sweeper (related_entity_id = project id) and the preview.
export interface LifecycleEmailProjectQuery {
  getById(projectId: string): Promise<LifecycleEmailProject | undefined>;
}
