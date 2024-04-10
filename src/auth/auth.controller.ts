import { Body, Controller, Get, Post, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto, CreateUserDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorators/get-user.decorator";
import { User } from "./entities/user.entity";
import { RawHeader } from "./decorators/raw-header.decorator";
import { UserRoleGuard } from "./guards/user-role/user-role.guard";
import { RoleProtected } from "./decorators/role-protected.decorator";
import { ValidRoles } from "./interfaces/valid-roles";
import { Auth } from "./decorators";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
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

  @Get("check-auth-status")
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
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

  // @SetMetadata("roles", ["admin", "user"]) // This will protect the route
  @Get("private2")
  @RoleProtected(ValidRoles.admin) // This will protect the route
  @UseGuards(AuthGuard(), UserRoleGuard) // This will protect the route
  testJwt2(@GetUser() user: User) {
    return {
      ok: true,
      message: "You are authenticated",
      user,
    };
  }

  @Get("private3")
  @Auth(ValidRoles.admin)
  testJwt3(@GetUser() user: User) {
    return {
      ok: true,
      message: "You are authenticated",
      user,
    };
  }
}
