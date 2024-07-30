import { InMemoryReconversionProjectsListRepository } from "src/reconversion-projects/adapters/secondary/reconversion-projects-list-repository/InMemoryReconversionProjectsListRepository";
import {
  GetUserReconversionProjectsBySiteUseCase,
  ReconversionProjectsGroupedBySite,
} from "./getUserReconversionProjectsBySite.usecase";

describe("GetUserReconversionProjectsBySite Use Case", () => {
  it("Fails when userId is not provided", async () => {
    const usecase = new GetUserReconversionProjectsBySiteUseCase(
      new InMemoryReconversionProjectsListRepository(),
    );

    // @ts-expect-error userId is required
    await expect(usecase.execute({ userId: undefined })).rejects.toThrow("userId is required");
  });

  it("gets list of reconversion projects grouped by site for a user", async () => {
    const reconversionProjects: ReconversionProjectsGroupedBySite = [
      {
        siteId: "a8fd7736-5836-4172-9811-ca71555dbbcc",
        siteName: "Site 1",
        isFriche: false,
        isExpressSite: false,
        reconversionProjects: [],
      },
      {
        siteId: "7915a3dc-6928-46c8-81f0-41c5c6dde8f3",
        siteName: "Site 2",
        isFriche: true,
        isExpressSite: false,
        fricheActivity: "INDUSTRY",
        reconversionProjects: [
          {
            id: "78330779-017d-49b3-bb3e-8b5724aaf56f",
            name: "ReconversionProject 1",
            type: "MIXED_USE_NEIGHBOURHOOD",
            isExpressProject: true,
          },
          {
            id: "b0f734d3-27f0-4876-a73a-637be27d12d2",
            name: "ReconversionProject 2",
            type: "PHOTOVOLTAIC_POWER_PLANT",
            isExpressProject: false,
          },
        ],
      },
    ];
    const userId = "0918223a-4d05-43a3-ad15-ccac704f7998";
    const repo = new InMemoryReconversionProjectsListRepository(reconversionProjects);
    jest.spyOn(repo, "getGroupedBySite");

    const usecase = new GetUserReconversionProjectsBySiteUseCase(repo);
    const result = await usecase.execute({ userId });
    expect(result).toEqual(reconversionProjects);
    /* eslint-disable-next-line @typescript-eslint/unbound-method */
    expect(repo.getGroupedBySite).toHaveBeenCalledWith({ userId });
  });
});
