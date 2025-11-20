import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CRMGateway } from "src/marketing/core/CRMGateway";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";

import { ConnectCrm } from "../secondary/ConnectCrm";
import { LoginSucceededHandler } from "./loginSucceeded.handler";
import { UserAccountCreatedHandler } from "./userAccountCreated.handler";

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: UserAccountCreatedHandler,
      useFactory: (crm: CRMGateway) => new UserAccountCreatedHandler(crm),
      inject: [ConnectCrm],
    },
    {
      provide: LoginSucceededHandler,
      useFactory: (crm: CRMGateway, dateProvider: DateProvider) =>
        new LoginSucceededHandler(crm, dateProvider),
      inject: [ConnectCrm, RealDateProvider],
    },
    RealDateProvider,
    ConnectCrm,
  ],
})
export class MarketingModule {}
