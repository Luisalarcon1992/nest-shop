import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class UserRoleGuard implements CanActivate {
  private Roles = Reflector.createDecorator<string[]>();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(this.Roles, context.getHandler());

    //if (!roles) return true;

    const request = context.switchToHttp().getRequest();

    const user = request;
    console.log({ user });

    return true;
  }
}
