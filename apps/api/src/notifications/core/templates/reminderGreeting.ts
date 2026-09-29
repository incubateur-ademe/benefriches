// Shared by the reminder templates (first site, first project).

// French typography: a non-breaking space before "!", "?", ":" and ";", so the sign never
// wraps alone onto the next line.
export const NBSP = "\u00a0";

export const buildGreeting = (firstName: string | null, lastName: string | null): string => {
  const name = [firstName, lastName]
    .map((part) => part?.trim() ?? "")
    .filter((part) => part !== "")
    .join(" ");
  return name === "" ? "Bonjour," : `Bonjour ${name},`;
};
