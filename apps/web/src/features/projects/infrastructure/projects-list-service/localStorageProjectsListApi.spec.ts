import { groupProjectsBySiteId, Project } from "./localStorageProjectsListApi";

describe("LocalStorageProjectsListApi", () => {
  describe("groupProjectsBySiteId", () => {
    it("returns empty object for empty array", () => {
      const input = [] as Project[];
      expect(groupProjectsBySiteId(input)).toEqual({});
    });

    it("returns grouped projects for one siteId", () => {
      const input = [
        {
          id: "b4264ad2-3f52-4b49-8257-34cd8ed038a4",
          name: "Project 1",
          siteId: "7d347b99-6b1f-43b7-920d-308f0f099f4d",
        },
        {
          id: "e5fdadd7-bed9-4ff8-9d7f-e5a307ca2d37",
          name: "Project 2",
          siteId: "7d347b99-6b1f-43b7-920d-308f0f099f4d",
        },
      ];
      expect(groupProjectsBySiteId(input)).toEqual({
        "7d347b99-6b1f-43b7-920d-308f0f099f4d": [
          {
            id: "b4264ad2-3f52-4b49-8257-34cd8ed038a4",
            name: "Project 1",
            siteId: "7d347b99-6b1f-43b7-920d-308f0f099f4d",
          },
          {
            id: "e5fdadd7-bed9-4ff8-9d7f-e5a307ca2d37",
            name: "Project 2",
            siteId: "7d347b99-6b1f-43b7-920d-308f0f099f4d",
          },
        ],
      });
    });

    it("returns grouped projects for multiple siteId", () => {
      const input = [
        {
          id: "b4264ad2-3f52-4b49-8257-34cd8ed038a4",
          name: "Project 1",
          siteId: "7d347b99-6b1f-43b7-920d-308f0f099f4d",
        },
        {
          id: "e5fdadd7-bed9-4ff8-9d7f-e5a307ca2d37",
          name: "Project 2",
          siteId: "7d347b99-6b1f-43b7-920d-308f0f099f4d",
        },
        {
          id: "311f29d5-0ba7-4834-9046-7f8bb0baaba1",
          name: "Project 3",
          siteId: "a411b4eb-1ca6-4905-835c-48b533f296b1",
        },
      ];
      expect(groupProjectsBySiteId(input)).toEqual({
        "7d347b99-6b1f-43b7-920d-308f0f099f4d": [
          {
            id: "b4264ad2-3f52-4b49-8257-34cd8ed038a4",
            name: "Project 1",
            siteId: "7d347b99-6b1f-43b7-920d-308f0f099f4d",
          },
          {
            id: "e5fdadd7-bed9-4ff8-9d7f-e5a307ca2d37",
            name: "Project 2",
            siteId: "7d347b99-6b1f-43b7-920d-308f0f099f4d",
          },
        ],
        "a411b4eb-1ca6-4905-835c-48b533f296b1": [
          {
            id: "311f29d5-0ba7-4834-9046-7f8bb0baaba1",
            name: "Project 3",
            siteId: "a411b4eb-1ca6-4905-835c-48b533f296b1",
          },
        ],
      });
    });
  });
});
