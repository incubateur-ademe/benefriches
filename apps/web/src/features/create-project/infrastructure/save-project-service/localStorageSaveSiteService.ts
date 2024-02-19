import { SaveProjectGateway, SaveProjectPayload } from "../../application/createProject.actions";

import { PROJECTS_LIST_STORAGE_KEY } from "@/features/projects/infrastructure/projects-list-service/localStorageProjectsListApi";
import { delay } from "@/shared/services/delay/delay";

export class LocalStorageSaveProjectApi implements SaveProjectGateway {
  async save(newProject: SaveProjectPayload) {
    await delay(300);

    const fromLocalStorage = localStorage.getItem(PROJECTS_LIST_STORAGE_KEY);
    const projectsList = fromLocalStorage
      ? (JSON.parse(fromLocalStorage) as SaveProjectPayload[])
      : [];
    localStorage.setItem(PROJECTS_LIST_STORAGE_KEY, JSON.stringify([...projectsList, newProject]));
  }
}
