import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { User } from "../auth/entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

interface ConectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessagesWebsocketsService {
  private conectedClients: ConectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerCliente(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error("User not found");
    if (!user.isActive) throw new Error("User is not active");

    this.checkIfUserIsConnected(user);

    this.conectedClients[client.id] = {
      socket: client,
      user,
    };
  }

  removeCliente(clientId: string) {
    delete this.conectedClients[clientId];
  }

  getClientsConnected(): string[] {
    return Object.keys(this.conectedClients);
  }

  getUserFullNameBySocketId(socketId: string): string {
    return this.conectedClients[socketId].user.fullName;
  }

  private checkIfUserIsConnected(user: User) {
    for (const clientId of Object.keys(this.getClientsConnected)) {
      const connectedUser = this.conectedClients[clientId];

      if (connectedUser.user.id === user.id) {
        connectedUser.socket.disconnect();

        break;
      }
    }
  }
}
