import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { LoginUserDto, CreateUserDto } from "./dto";
import * as bcrypt from "bcrypt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

      return {
        email: newUser.email,
        token: this.getJwtToken({ id: newUser.id }),
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { password: true, email: true, id: true },
    });

    console.log({ user });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return {
      email: user.email,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  private handleErrors(error: any): never {
    if (error.code === "23505") {
      throw new BadRequestException("User already exists");
    }
    console.log(error);
    throw new InternalServerErrorException("Internal server error, check the logs for more information");
  }
}
