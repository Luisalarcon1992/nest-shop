import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

export function SeedResponse() {
  return applyDecorators(ApiResponse({ status: 200, description: "Ok" }));
}
