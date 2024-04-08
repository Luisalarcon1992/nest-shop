import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...restData } = createUserDto;

      const newUser = this.userRepository.create({
        ...restData,
        password: await bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(newUser);

      delete newUser.password;

      return newUser;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  private handleErrors(error: any): never {
    if (error.code === "23505") {
      throw new BadRequestException("User already exists");
    }
    console.log(error);
    throw new InternalServerErrorException("Internal server error, check the logs for more information");
  }
}
