import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

export function FileResponsePost() {
  return applyDecorators(
    ApiResponse({ status: 200, description: "Ok" }),
    ApiResponse({ status: 201, description: "Created", type: File }),
    ApiResponse({ status: 204, description: "No Content" }),
    ApiResponse({ status: 400, description: "Bad Request" }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({ status: 403, description: "Forbidden" }),
    ApiResponse({ status: 404, description: "Not Found" }),
    ApiResponse({ status: 500, description: "Internal Server Error" }),
  );
}

export function FileResponseGet() {
  return applyDecorators(
    ApiResponse({ status: 200, description: "Ok", type: [File] }),
    ApiResponse({ status: 204, description: "No Content" }),
    ApiResponse({ status: 400, description: "Bad Request" }),
    ApiResponse({ status: 404, description: "Not Found" }),
    ApiResponse({ status: 500, description: "Internal Server Error" }),
  );
}
