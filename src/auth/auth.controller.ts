import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto, CreateUserDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUserr } from "./decorators/get-user.decorators";
import { User } from "./entities/user.entity";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post("login")
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("private")
  @UseGuards(AuthGuard())
  testJwt(@GetUserr() user: User) {
    return {
      ok: true,
      message: "You are authenticated",
      user,
    };
  }
}
