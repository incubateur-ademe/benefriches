import { useCallback, useState } from "react";
import { v4 as uuid } from "uuid";

import { routes } from "@/shared/views/router";

import { HttpDuplicateProjectService } from "../../infrastructure/duplicate-project-service/HttpDuplicateProjectService";

const useDuplicateProject = (projectId: string, from: "evaluations" | "impacts" | "site") => {
  const [duplicationState, setIsDuplicationState] = useState<"idle" | "error" | "loading">("idle");

  const onDuplicateProject = useCallback(async () => {
    setIsDuplicationState("loading");
    try {
      const duplicateService = new HttpDuplicateProjectService();
      const newProjectId = uuid();
      await duplicateService.duplicate({ newProjectId, reconversionProjectId: projectId });
      routes.updateProject({ projectId: newProjectId, from }).push();
    } catch (err) {
      console.error("Impossible de dupliquer le projet", err);
      setIsDuplicationState("error");
    }
  }, [projectId, from]);

  return { onDuplicateProject, duplicationState };
};

export default useDuplicateProject;
