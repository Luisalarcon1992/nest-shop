import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { Auth, GetUser } from "../auth/decorators";
import { ValidRoles } from "../auth/interfaces/valid-roles";
import { User } from "../auth/entities/user.entity";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductResponseDelete, ProductResponseGet, ProductResponsePost } from "./decorators/product/product.decorator";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ProductResponsePost()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ProductResponseGet()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(":id")
  @ProductResponseGet()
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  @Auth(ValidRoles.user, ValidRoles.admin)
  @ProductResponsePost()
  update(@Param("id", ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto, @GetUser() user: User) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(":id")
  @Auth(ValidRoles.user, ValidRoles.admin)
  @ProductResponseDelete()
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
