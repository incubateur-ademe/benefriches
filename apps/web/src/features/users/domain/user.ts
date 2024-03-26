export type User = {
  id: string;
  firstName: string;
  lastName: string;
  identitySaved: boolean;
  organization?: {
    id: string;
    name: string;
    type: "company";
  };
};
