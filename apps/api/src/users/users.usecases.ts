
export function createUser(email: string, password: string) {
  if (!password) { throw new Error("Password is required")}

  return {
    "email": email,
    "password": password
  };
}
