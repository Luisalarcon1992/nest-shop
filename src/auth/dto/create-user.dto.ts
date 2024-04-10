import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "The email of the user",
    example: "example@mail.com",
    nullable: false,
    minLength: 6,
    maxLength: 50,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password of the user",
    example: "Password123",
    nullable: false,
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "The password must have a Uppercase, lowercase letter and a number",
  })
  password: string;

  @ApiProperty({
    description: "The full name of the user",
    example: "John Doe",
    nullable: false,
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  fullName: string;
}
