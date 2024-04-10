import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

export function AuthResponse() {
  return applyDecorators(
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({ status: 403, description: "Forbidden" }),
    ApiResponse({ status: 200, description: "Ok" }),
  );
}
