import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto, CreateUserDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorators/get-user.decorators";
import { User } from "./entities/user.entity";
import { RawHeader } from "./decorators/raw-header.decorators";
import { UserRoleGuard } from "./guards/user-role/user-role.guard";

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
  @UseGuards(AuthGuard()) // This will protect the route
  testJwt(@GetUser() user: User, @GetUser("email") email: string, @RawHeader() heaader: string[]) {
    return {
      ok: true,
      message: "You are authenticated",
      user,
      email,
      heaader,
    };
  }

  @Get("private2")
  @UseGuards(AuthGuard(), UserRoleGuard) // This will protect the route
  testJwt2(@GetUser() user: User) {
    return {
      ok: true,
      message: "You are authenticated",
      user,
    };
  }
}
