import { v4 as uuid } from "uuid";

import { UserProps } from "../../../auth/core/createUser.usecase";
import { User } from "../../../auth/core/user";

export const buildMinimalUserProps = (): UserProps => {
  return {
    id: uuid(),
    email: "user@collectivite.fr",
    structureActivity: "urban_planner",
    structureType: "company",
    personalDataAnalyticsUseConsented: false,
    personalDataCommunicationUseConsented: false,
    personalDataStorageConsented: true,
    firstName: "John",
    lastName: "Doe",
  };
};

export const buildExhaustiveUserProps = (): Required<UserProps> => {
  return {
    id: uuid(),
    email: "user@collectivite.fr",
    firstName: "Jane",
    lastName: "Doe",
    structureType: "municipality",
    structureActivity: "local_authority",
    structureName: "Mairie de Blajan",
    personalDataAnalyticsUseConsented: false,
    personalDataCommunicationUseConsented: true,
    personalDataStorageConsented: true,
  };
};

const buildUser = (props?: Partial<User>): User => {
  return {
    ...buildMinimalUserProps(),
    createdAt: new Date(),
    personalDataStorageConsentedAt: new Date(),
    ...props,
  };
};

export class UserBuilder {
  private readonly props: UserProps;

  constructor() {
    this.props = buildMinimalUserProps();
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withEmail(email: string): this {
    this.props.email = email;
    return this;
  }

  withFirstName(firstName: string): this {
    this.props.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): this {
    this.props.lastName = lastName;
    return this;
  }

  asUrbanPlanner(): this {
    this.props.structureActivity = "urban_planner";
    this.props.structureType = "company";
    this.props.structureName = "UrbanPlanning Inc.";
    return this;
  }

  asLocalAuthority(): this {
    this.props.structureActivity = "local_authority";
    this.props.structureType = "municipality";
    this.props.structureName = "Mairie de Blajan";
    return this;
  }

  withStructure({
    structureName,
    structureType,
    structureActivity,
  }: {
    structureName: string;
    structureType: string;
    structureActivity: string;
  }): this {
    this.props.structureName = structureName;
    this.props.structureType = structureType;
    this.props.structureActivity = structureActivity;
    return this;
  }

  build(): User {
    return buildUser(this.props);
  }
}
