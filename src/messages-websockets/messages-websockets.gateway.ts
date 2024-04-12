import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { MessagesWebsocketsService } from "./messages-websockets.service";
import { Socket, Server } from "socket.io";
import { NewMessageDto } from "./dtos/message.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../auth/interfaces/jwt-payload.interface";

@WebSocketGateway({ cors: true })
export class MessagesWebsocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messagesWebsocketsService: MessagesWebsocketsService,
    private readonly JwtService: JwtService,
  ) {}

  @WebSocketServer() wss: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payLoad: JwtPayload;

    try {
      payLoad = this.JwtService.verify(token);
      await this.messagesWebsocketsService.registerCliente(client, payLoad.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log(`El cliente ${client.id} se ha conectado`);
    // console.log({ clientsConnected: this.messagesWebsocketsService.getClientsConnected() });

    this.wss.emit("clients-updated", this.messagesWebsocketsService.getClientsConnected());
  }

  handleDisconnect(client: Socket) {
    // console.log(`El cliente ${client.id} se ha desconectado`);
    this.messagesWebsocketsService.removeCliente(client.id);
    console.log({ clientsConnected: this.messagesWebsocketsService.getClientsConnected() });
    this.wss.emit("clients-updated", this.messagesWebsocketsService.getClientsConnected());
  }

  @SubscribeMessage("client-message")
  handleMessage(client: Socket, payload: NewMessageDto): void {
    // console.log(`Mensaje recibido de ${client.id}: ${payload}`);

    // Emite unicamente al cliente que envió el mensaje
    // client.emit("server-message", payload);

    // Emite a todos los clientes conectados, menos al cliente inicial
    // client.broadcast.emit("server-message", payload);

    // Emite a todos los clientes conectados, incluyendo al cliente inicial
    this.wss.emit("server-message", {
      fullName: this.messagesWebsocketsService.getUserFullNameBySocketId(client.id),
      message: payload.message || "No hay mensaje",
    });
  }
}
