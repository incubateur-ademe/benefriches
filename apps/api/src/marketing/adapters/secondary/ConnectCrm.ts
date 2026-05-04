import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { isAxiosError } from "axios";
import { format } from "date-fns";
import { lastValueFrom } from "rxjs";
import { z, ZodError } from "zod";

import { CRMGateway, CrmContact, NewContactProps } from "src/marketing/core/CRMGateway";

const CONNECT_DATE_FORMAT = "yyyy-MM-dd";
const CONNECT_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
const CONNECT_SOURCE = "Bénéfriches";
const BENEFRICHES_NEWSLETTER_NAME = "Bénéfriches";

const getCrmContactResponseSchema = z.object({
  success: z.boolean(),
  contact: z
    .object({
      listeAbonnementNewsletter: z.array(z.string()).nullish(),
    })
    .optional(),
});

@Injectable()
export class ConnectCrm implements CRMGateway {
  constructor(
    private readonly httpClient: HttpService,
    private readonly config: ConfigService,
  ) {}

  async createContact(props: NewContactProps): Promise<void> {
    const baseBody = {
      email: props.email,
      prenom: props.firstName,
      nom: props.lastName,
      source: CONNECT_SOURCE,
      acceptationRGPD: true,
    };

    const body = props.subscribedToNewsletter
      ? {
          ...baseBody,
          abonnementNewsletter: true,
          dateNewsletter: format(new Date(), CONNECT_DATE_FORMAT),
        }
      : baseBody;

    await lastValueFrom(
      this.httpClient.post(`${this.config.get("CONNECT_CRM_HOST")}/api/v1/personnes`, body, {
        headers: this.getAuthHeaders(),
      }),
    );
  }

  async findContactByEmail(email: string): Promise<CrmContact | null> {
    try {
      const response = await lastValueFrom(
        this.httpClient.get<unknown>(
          `${this.config.get("CONNECT_CRM_HOST")}/api/v1/personnes/mail/${encodeURIComponent(email)}`,
          { headers: this.getAuthHeaders() },
        ),
      );
      const body = getCrmContactResponseSchema.parse(response.data);
      if (!body.success || !body.contact) {
        return null;
      }
      return {
        subscribedToNewsletter:
          body.contact.listeAbonnementNewsletter?.includes(BENEFRICHES_NEWSLETTER_NAME) ?? false,
      };
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      if (error instanceof ZodError) {
        throw new Error(
          `CRM response schema mismatch for ${email}: ${JSON.stringify(error.issues)}`,
          { cause: error },
        );
      }
      throw error;
    }
  }

  async updateContactLastLoginDate(email: string, loginDate: Date): Promise<void> {
    const loginDateFormatted = format(loginDate, CONNECT_DATE_TIME_FORMAT);
    const body = {
      source: CONNECT_SOURCE,
      dateConnexion: loginDateFormatted,
      email,
    };

    await lastValueFrom(
      this.httpClient.put(
        `${this.config.get("CONNECT_CRM_HOST")}/api/v1/personnes/mail/${email}`,
        body,
        { headers: this.getAuthHeaders() },
      ),
    );
  }

  private getAuthHeaders() {
    return {
      client_id: this.config.getOrThrow<string>("CONNECT_CRM_CLIENT_ID"),
      client_secret: this.config.getOrThrow<string>("CONNECT_CRM_CLIENT_SECRET"),
    };
  }
}
