import z from "zod";

export function createUser(email: string, password: string) {
  if (!email) throw new Error("Email is required");

  const validEmail = z
    .string()
    .email({ message: "Email is invalid" })
    .parse(email);
  if (!password) throw new Error("Password is required");
  const validPassword = z
    .string()
    .min(12, "Password should be 12 or more characters")
    .parse(password);

  return {
    email: email,
    password: password,
  };
}
