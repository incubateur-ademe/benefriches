import { Module } from "@nestjs/common";
import { HelloModule } from "./hello-world/hello.module";

@Module({
  imports: [HelloModule],
})
export class AppModule {}
