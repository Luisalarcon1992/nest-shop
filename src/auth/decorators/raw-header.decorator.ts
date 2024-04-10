import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const RawHeader = createParamDecorator((data: string[], req: ExecutionContext) => {
  const request = req.switchToHttp().getRequest();

  const header = request.headers;

  return header;
});
