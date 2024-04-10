import { UserRoleGuard } from "./../guards/user-role/user-role.guard";
import { UseGuards, applyDecorators } from "@nestjs/common";
import { ValidRoles } from "../interfaces/valid-roles";
import { RoleProtected } from "./index";
import { AuthGuard } from "@nestjs/passport";
import {} from "../guards/user-role/user-role.guard";

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),

    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
