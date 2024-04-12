import { Module } from "@nestjs/common";
import { MessagesWebsocketsService } from "./messages-websockets.service";
import { MessagesWebsocketsGateway } from "./messages-websockets.gateway";
import { AuthModule } from "../auth/auth.module";

@Module({
  providers: [MessagesWebsocketsGateway, MessagesWebsocketsService],
  imports: [AuthModule],
})
export class MessagesWebsocketsModule {}
