import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CRMGateway } from "src/marketing/core/CRMGateway";

import { ConnectCrm } from "../secondary/ConnectCrm";
import { UserAccountCreatedHandler } from "./userAccountCreated.handler";

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: UserAccountCreatedHandler,
      useFactory: (crm: CRMGateway) => new UserAccountCreatedHandler(crm),
      inject: [ConnectCrm],
    },
    ConnectCrm,
  ],
})
export class MarketingModule {}
