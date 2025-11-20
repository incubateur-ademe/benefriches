import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { format } from "date-fns";
import { lastValueFrom } from "rxjs";

import { CRMGateway, NewContactProps } from "src/marketing/core/CRMGateway";

const CONNECT_DATE_FORMAT = "yyyy-MM-dd";
const CONNECT_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
const CONNECT_SOURCE = "Bénéfriches";

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
