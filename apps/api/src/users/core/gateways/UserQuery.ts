type UserViewModel = {
  id: string;
  structure: { activity?: string; name?: string; type?: string };
};

export interface UserQuery {
  getById(userId: UserViewModel["id"]): Promise<UserViewModel | undefined>;
}
