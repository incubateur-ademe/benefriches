import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { format } from "date-fns";
import { lastValueFrom } from "rxjs";

import { CRMGateway, NewContactProps } from "src/marketing/core/CRMGateway";

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
      source: "Bénéfriches",
      acceptationRGPD: true,
    };

    const body = props.subscribedToNewsletter
      ? {
          ...baseBody,
          abonnementNewsletter: true,
          dateNewsletter: format(new Date(), "yyyy-MM-dd"),
        }
      : baseBody;

    await lastValueFrom(
      this.httpClient.post(`${this.config.get("CONNECT_CRM_HOST")}/api/v1/personnes`, body, {
        headers: {
          client_id: this.config.getOrThrow<string>("CONNECT_CRM_CLIENT_ID"),
          client_secret: this.config.getOrThrow<string>("CONNECT_CRM_CLIENT_SECRET"),
        },
      }),
    );
  }
}
