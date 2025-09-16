import { isObjectsEqual } from "./isObjectsEqual";

describe("Function isObjectsEqual", () => {
  it.each([
    {
      object1: { BUILDINGS: 1000 },
      object2: { BUILDINGS: 1000 },
    },
    {
      object1: { BUILDINGS: 1000, GRAVEL_ALLEY: 5000 },
      object2: { GRAVEL_ALLEY: 5000, BUILDINGS: 1000 },
    },
  ])("should return true", ({ object1, object2 }) => {
    expect(isObjectsEqual(object1, object2)).toEqual(true);
  });
  it.each([
    {
      object1: { BUILDINGS: 1000 },
      object2: { GRAVEL_ALLEY: 1000 },
    },
    {
      object1: { BUILDINGS: 1000, GRAVEL_ALLEY: 5000 },
      object2: { GRAVEL_ALLEY: 6000, BUILDINGS: 1000 },
    },
    {
      object1: { BUILDINGS: 800 },
      object2: { BUILDINGS: 1000 },
    },
    {
      object1: { BUILDINGS: 1000, GRAVEL_ALLEY: 5000 },
      object2: { GRAVEL_ALLEY: 5000, BUILDINGS: 1000, GREEN_SPACES: 852 },
    },
  ])("should return false", ({ object1, object2 }) => {
    expect(isObjectsEqual(object1, object2)).toEqual(false);
  });
});
