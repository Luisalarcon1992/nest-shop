import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {
  @ApiProperty({
    description: "The title of the product",
    example: "Nike Air Max 90",
    nullable: false,
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: "The price of the product",
    example: 150,
    nullable: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: "The description of the product",
    example: "The Nike Air Max 90 is a retro running shoe",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "The slug of the product",
    example: "nike_air_max_90",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: "The stock of the product",
    example: 10,
    nullable: true,
  })
  @IsInt()
  @Min(0)
  @IsPositive()
  stock?: number;

  @ApiProperty({
    description: "The sizes available for the product",
    example: ["US 7", "US 8", "US 9"],
    nullable: true,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    description: "Gender of the product",
    enum: ["men", "womnen", "kids", "unisex"],
    required: true,
    example: ["kids", "unisex"],
  })
  @IsIn(["men", "womnen", "kids", "unisex"])
  gender: string;

  @ApiProperty({
    description: "The brand of the product",
    example: ["Nike", "Air Jordan", "White"],
    nullable: true,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: "The images of the product",
    example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    nullable: true,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
