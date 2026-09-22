import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transporter, createTransport } from "nodemailer";

import type { LifecycleEmailMessage, Mailer } from "src/notifications/core/gateways/Mailer";

@Injectable()
export class SmtpMailer implements Mailer {
  private readonly transporter: Transporter;
  private readonly configService: ConfigService;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    this.configService = configService;
    this.transporter = createTransport({
      host: this.configService.getOrThrow<string>("SMTP_HOST"),
      port: this.configService.getOrThrow<number>("SMTP_PORT"),
      auth: {
        user: this.configService.getOrThrow<string>("SMTP_USER"),
        pass: this.configService.getOrThrow<string>("SMTP_PASSWORD"),
      },
      // Explicit, short timeouts: this transport is used inside the HTTP request that
      // creates the account (the welcome email listener runs synchronously within
      // registration). Nodemailer's defaults (120s/30s/600s) would stall a signup.
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
    });
  }

  async send(message: LifecycleEmailMessage): Promise<void> {
    await this.transporter.sendMail({
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      from: {
        name: "Bénéfriches",
        address: this.configService.getOrThrow<string>("SMTP_FROM_ADDRESS"),
      },
    });
  }
}
