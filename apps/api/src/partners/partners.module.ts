import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PartnersController } from "./partners.controller";

@Module({
  controllers: [PartnersController],
  providers: [ConfigService],
})
export class PartnersModule {}
