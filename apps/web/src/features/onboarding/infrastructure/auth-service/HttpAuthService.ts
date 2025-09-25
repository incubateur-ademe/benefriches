import { AuthenticationGateway } from "../../core/AuthenticationGateway";

export class HttpAuthService implements AuthenticationGateway {
  async requestLink(email: string, postLoginRedirectTo: string | undefined): Promise<void> {
    const response = await fetch("/api/auth/send-auth-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, postLoginRedirectTo }),
    });

    if (!response.ok) {
      const resp = (await response.json()) as { code?: string; message: string };
      const errorMessage =
        resp.code === "TOO_MANY_REQUESTS"
          ? "Veuillez patienter 2 minutes avant de demander un nouveau lien."
          : "Une erreur est survenue, veuillez réessayer plus tard.";
      throw new Error(errorMessage);
    }
  }

  async authenticateWithToken(token: string): Promise<void> {
    const response = await fetch(`/api/auth/login/token?token=${token}`, {
      method: "GET",
    });

    if (!response.ok) {
      const resp = (await response.json()) as { code?: string; message: string };
      const errorMessage =
        resp.code === "TOKEN_EXPIRED"
          ? "Le lien d'authentification a expiré, veuillez en demander un nouveau."
          : "Une erreur est survenue, veuillez réessayer plus tard.";
      throw new Error(errorMessage);
    }
  }
}
