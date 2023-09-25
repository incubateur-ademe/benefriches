import { BadRequestException, NotFoundException } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { LocalDataInseeService } from "./LocalDataInseeService";

describe("LocalDataInseeService", () => {
  test("tests BadRequestException", async () => {
    const service = new LocalDataInseeService();
    await expect(() =>
      lastValueFrom(service.getTownAreaAndPopulation("")),
    ).rejects.toThrow(BadRequestException);
  });

  test("tests NotFoundException", async () => {
    const service = new LocalDataInseeService();
    await expect(() =>
      lastValueFrom(service.getTownAreaAndPopulation("False citycode")),
    ).rejects.toThrow(NotFoundException);
  });

  test("tests success response for Toulouse", async () => {
    const service = new LocalDataInseeService();
    const result = await lastValueFrom(
      service.getTownAreaAndPopulation("54321"),
    );
    expect(result).toBeDefined();
    expect(result.cityCode).toEqual("54321");
    expect(result.area).toBeDefined();
    expect(result.population).toBeDefined();
  });
});
