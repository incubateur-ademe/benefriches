import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemoryUserFeatureAlertsRepository } from "src/users/adapters/secondary/user-feature-alert-repository/InMemoryUserFeatureAlertRepository";

import { CreateUserFeatureAlertUseCase, UserFeatureAlert } from "./createUserFeatureAlert.usecase";

describe("CreateUserFeatureAlert Use Case", () => {
  let dateProvider: DateProvider;
  let repository: InMemoryUserFeatureAlertsRepository;
  const fakeNow = new Date("2024-01-05T13:00:00");

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    repository = new InMemoryUserFeatureAlertsRepository();
  });

  it("create a feature alert for 'compare_impacts' type with right options", async () => {
    const usecase = new CreateUserFeatureAlertUseCase(repository, dateProvider);
    await usecase.execute({
      id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
      userId: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
      email: "user@ademe.fr",
      feature: {
        type: "compare_impacts",
        options: ["same_project_on_prairie", "same_project_on_agricultural_operation"],
      },
    });

    const savedAlerts = repository._getUsersFeatureAlerts();

    expect(savedAlerts).toEqual<UserFeatureAlert[]>([
      {
        id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
        userId: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
        email: "user@ademe.fr",
        createdAt: fakeNow,
        featureType: "compare_impacts",
        featureOptions: {
          same_project_on_prairie: true,
          same_project_on_agricultural_operation: true,
          statu_quo_scenario: false,
        },
      },
    ]);
  });
  it("create a feature alert for 'export_impacts' type with right options", async () => {
    const usecase = new CreateUserFeatureAlertUseCase(repository, dateProvider);
    await usecase.execute({
      id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
      userId: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
      email: "user@ademe.fr",
      feature: {
        type: "export_impacts",
        options: ["pdf", "excel", "sharing_link"],
      },
    });

    const savedAlerts = repository._getUsersFeatureAlerts();

    expect(savedAlerts).toEqual<UserFeatureAlert[]>([
      {
        id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
        userId: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
        email: "user@ademe.fr",
        createdAt: fakeNow,
        featureType: "export_impacts",
        featureOptions: {
          pdf: true,
          excel: true,
          sharing_link: true,
        },
      },
    ]);
  });

  it("create a feature alert for 'export_impacts' type with no options", async () => {
    const usecase = new CreateUserFeatureAlertUseCase(repository, dateProvider);
    await usecase.execute({
      id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
      userId: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
      email: "user@ademe.fr",
      feature: {
        type: "export_impacts",
      },
    });

    const savedAlerts = repository._getUsersFeatureAlerts();

    expect(savedAlerts).toEqual<UserFeatureAlert[]>([
      {
        id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
        userId: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
        email: "user@ademe.fr",
        createdAt: fakeNow,
        featureType: "export_impacts",
        featureOptions: {
          pdf: false,
          excel: false,
          sharing_link: false,
        },
      },
    ]);
  });

  it("create a feature alert for 'duplicate_project' type with no options", async () => {
    const usecase = new CreateUserFeatureAlertUseCase(repository, dateProvider);
    await usecase.execute({
      id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
      userId: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
      email: "user@ademe.fr",
      feature: {
        type: "duplicate_project",
      },
    });

    const savedAlerts = repository._getUsersFeatureAlerts();

    expect(savedAlerts).toEqual<UserFeatureAlert[]>([
      {
        id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
        userId: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
        email: "user@ademe.fr",
        createdAt: fakeNow,
        featureType: "duplicate_project",
      },
    ]);
  });

  it("creates a feature alert for 'mutafriches_availability' without user id", async () => {
    const usecase = new CreateUserFeatureAlertUseCase(repository, dateProvider);
    await usecase.execute({
      id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
      email: "user@ademe.fr",
      feature: {
        type: "mutafriches_availability",
      },
    });

    const savedAlerts = repository._getUsersFeatureAlerts();

    expect(savedAlerts).toEqual<UserFeatureAlert[]>([
      {
        id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
        userId: undefined,
        email: "user@ademe.fr",
        createdAt: fakeNow,
        featureType: "mutafriches_availability",
      },
    ]);
  });
});
