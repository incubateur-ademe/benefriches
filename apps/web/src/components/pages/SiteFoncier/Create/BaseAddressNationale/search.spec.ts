import banSearch from "./search";

describe("Query Base Adresse Nationale API", () => {
  it("should not throw error when query is too short and return empty array", async () => {
    jest.spyOn(console, "error").mockImplementation(() => jest.fn());
    const result = await banSearch("");
    expect(console.error).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should return result with geometry coordinates and properties", async () => {
    const result = await banSearch("200 chemin");
    expect(result).toBeDefined();
    expect(result[0].geometry.coordinates).toBeDefined();
    expect(result[0].properties.label).toBeDefined();
  });
});
