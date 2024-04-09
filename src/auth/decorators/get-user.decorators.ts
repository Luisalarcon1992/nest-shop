import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { User } from "../entities/user.entity";

export const GetUser = createParamDecorator((data: string, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();

  const user = req.user;

  if (!user) throw new InternalServerErrorException("User not found");

  return data ? user?.[data] : user;
});
