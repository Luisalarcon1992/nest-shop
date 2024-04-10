import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { META_ROLES } from "src/auth/decorators/role-protected.decorator";
import { User } from "src/auth/entities/user.entity";

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    if (!roles || roles.length === 0) return true; // If the route is not protected, allow access (no roles required)

    const request = context.switchToHttp().getRequest();

    const user = request.user as User;

    if (!user) throw new BadRequestException("User not found");

    for (const role of user.roles) {
      if (roles.includes(role)) return true;
    }

    throw new ForbiddenException("You are not allowed to access this route");
  }
}
