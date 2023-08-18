import { Module } from "@nestjs/common";
import { HelloModule } from "./hello-world/adapters/primary/hello.module";

@Module({
  imports: [HelloModule],
})
export class AppModule {}
