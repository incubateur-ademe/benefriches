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

/**
 * Connect CRM answers HTTP 200 even when it rejects the write, flagging it with
 * `success: false`. Without parsing the body a rejected create would look like a success.
 */
const createCrmContactResponseSchema = z.object({
  success: z.boolean(),
});

/**
 * Connect CRM silently drops a create/update whose `nom`/`prenom` contains a `+`: the request
 * still comes back `success: true` (queued), but the contact is never actually persisted with
 * that data. The interface contract doesn't document any character restriction, so this is a
 * denylist of what's been observed to break, not a documented allowlist. Extend/replace once
 * Connect confirms their actual accepted charset.
 */
const CONNECT_CRM_UNSUPPORTED_NAME_CHARACTERS = /\+/g;

const sanitizeNameForConnectCrm = (value: string): string =>
  value.replace(CONNECT_CRM_UNSUPPORTED_NAME_CHARACTERS, "");

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
  private readonly httpClient: HttpService;
  private readonly config: ConfigService;
  constructor(httpClient: HttpService, config: ConfigService) {
    this.httpClient = httpClient;
    this.config = config;
  }

  async createContact(props: NewContactProps): Promise<void> {
    const baseBody = {
      email: props.email,
      prenom: sanitizeNameForConnectCrm(props.firstName),
      nom: sanitizeNameForConnectCrm(props.lastName),
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

    const response = await lastValueFrom(
      this.httpClient.post<unknown>(`${this.getBaseUrl()}/personnes`, body, {
        headers: this.getAuthHeaders(),
      }),
    );

    const parsed = createCrmContactResponseSchema.safeParse(response.data);

    if (!parsed.success) {
      throw new Error(
        `CRM createContact response schema mismatch for ${props.email}: ${JSON.stringify(parsed.error.issues)}`,
        { cause: parsed.error },
      );
    }

    if (!parsed.data.success) {
      throw new Error(
        `CRM rejected createContact for ${props.email} (success=false): ${JSON.stringify(response.data)}`,
      );
    }
  }

  async findContactByEmail(email: string): Promise<CrmContact | null> {
    try {
      const response = await lastValueFrom(
        this.httpClient.get<unknown>(
          `${this.getBaseUrl()}/personnes/mail/${encodeURIComponent(email)}`,
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
        `${this.getBaseUrl()}/personnes/mail/${encodeURIComponent(email)}`,
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

  private getBaseUrl(): string {
    return this.config.getOrThrow<string>("CONNECT_CRM_BASE_URL");
  }
}
