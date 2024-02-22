import { User } from "./user";

export const buildUser = (props?: Partial<User>): User => {
  return {
    firstName: "John",
    lastName: "Doe",
    id: "301d0f47-3775-4320-8e06-381047bebbed",
    ...props,
  };
};
