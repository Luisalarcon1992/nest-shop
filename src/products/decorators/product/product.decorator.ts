import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { Product } from "../../entities";

export function ProductResponsePost() {
  return applyDecorators(
    ApiResponse({ status: 200, description: "Ok" }),
    ApiResponse({ status: 201, description: "Created", type: Product }),
    ApiResponse({ status: 204, description: "No Content" }),
    ApiResponse({ status: 400, description: "Bad Request" }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({ status: 403, description: "Forbidden" }),
    ApiResponse({ status: 404, description: "Not Found" }),
    ApiResponse({ status: 500, description: "Internal Server Error" }),
  );
}

export function ProductResponseGet() {
  return applyDecorators(
    ApiResponse({ status: 200, description: "Ok", type: [Product] }),
    ApiResponse({ status: 204, description: "No Content" }),
    ApiResponse({ status: 400, description: "Bad Request" }),
    ApiResponse({ status: 404, description: "Not Found" }),
    ApiResponse({ status: 500, description: "Internal Server Error" }),
  );
}

export function ProductResponseDelete() {
  return applyDecorators(
    ApiResponse({ status: 200, description: "Ok" }),
    ApiResponse({ status: 204, description: "No Content" }),
    ApiResponse({ status: 400, description: "Bad Request" }),
    ApiResponse({ status: 401, description: "Unauthorized" }),
    ApiResponse({ status: 403, description: "Forbidden" }),
    ApiResponse({ status: 404, description: "Not Found" }),
    ApiResponse({ status: 500, description: "Internal Server Error" }),
  );
}
