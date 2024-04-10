import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductImages, Product } from "./entities";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product, ProductImages]), AuthModule],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
