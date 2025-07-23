import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transporter, createTransport } from "nodemailer";

import { AuthLinkMailer } from "src/auth/core/sendAuthLink.usecase";

@Injectable()
export class SmtpAuthLinkMailer implements AuthLinkMailer {
  private readonly transporter: Transporter;

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.getOrThrow<string>("SMTP_HOST"),
      port: this.configService.getOrThrow<number>("SMTP_PORT"),
      auth: {
        user: this.configService.getOrThrow<string>("SMTP_USER"),
        pass: this.configService.getOrThrow<string>("SMTP_PASSWORD"),
      },
    });
  }

  async sendAuthLink(email: string, authLinkUrl: string): Promise<void> {
    try {
      const mailOptions = {
        to: email,
        subject: "Connexion à Bénéfriches",
        html: this.buildAuthLinkEmailTemplate(authLinkUrl),
        text: this.buildAuthLinkEmailTextTemplate(authLinkUrl), // Fallback for text-only clients
        from: {
          name: "Bénéfriches",
          address: this.configService.getOrThrow<string>("SMTP_FROM_ADDRESS"),
        },
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Failed to send auth link: ${error instanceof Error ? error.message : "unknown error"}`,
      );
    }
  }

  private buildAuthLinkEmailTemplate(authLinkUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Connexion à Bénéfriches</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; border: 1px solid #e9ecef;">
          <h1 style="color: #000091; margin-bottom: 20px; font-size: 24px;">Connexion à Bénéfriches</h1>

          <p style="margin-bottom: 20px;">Bonjour,</p>
          
          <p style="margin-bottom: 30px;">
            Vous avez demandé à vous connecter à votre compte Bénéfriches. Cliquez sur le bouton ci-dessous pour vous connecter instantanément.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${authLinkUrl}" 
               style="background-color: #000091; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
              Se connecter à Bénéfriches
            </a>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 30px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>⚠️ Important :</strong> Ce lien de connexion expire dans <strong>15 minutes</strong> pour des raisons de sécurité.
            </p>
          </div>
          
          <p style="color: #6c757d; font-size: 14px; margin-bottom: 20px;">
            Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :
          </p>
          
          <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #495057;">
            ${authLinkUrl}
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="color: #6c757d; font-size: 14px; margin-bottom: 10px;">
            <strong>Vous n'avez pas demandé cette connexion ?</strong>
          </p>
          
          <p style="color: #6c757d; font-size: 14px;">
            Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité. 
            Votre compte reste protégé.
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="color: #adb5bd; font-size: 12px; text-align: center; margin: 0;">
            Cet email a été envoyé par Bénéfriches
          </p>
        </div>
      </body>
      </html>
    `;
  }

  private buildAuthLinkEmailTextTemplate(authLinkUrl: string): string {
    return `
        Connexion à Bénéfriches

        Bonjour,

        Vous avez demandé à vous connecter à votre compte Bénéfriches.
        Cliquez sur le lien ci-dessous pour vous connecter instantanément :

        ${authLinkUrl}

        ⚠️ Important : Ce lien de connexion expire dans 15 minutes pour des raisons de sécurité.

        Si vous n'avez pas demandé cette connexion, vous pouvez ignorer cet email en toute sécurité.

        ---
        Cet email a été envoyé par Bénéfriches
    `;
  }
}
