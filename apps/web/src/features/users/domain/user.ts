export type User = {
  id: string;
  firstName: string;
  lastName: string;
  organization?: {
    id: string;
    name: string;
    type: string;
  };
};
