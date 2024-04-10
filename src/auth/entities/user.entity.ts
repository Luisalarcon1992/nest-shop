import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../../products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @ApiProperty({
    example: "1f4d1c1c-7d0c-4f4e-a6b3-8a8b8e3f4b1d",
    description: "Identificador único del usuario",
    type: "UUID V4",
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: "example@mail.com",
    description: "Correo electrónico del usuario",
    type: "string",
    uniqueItems: true,
  })
  @Column("text", { unique: true })
  email: string;

  @ApiProperty({
    example: "Password123",
    description: "Contraseña del usuario",
    type: "string",
  })
  @Column(
    "text",
    { select: false }, // no queremos que se seleccione por defecto en las consultas
  )
  password: string;

  @ApiProperty({
    example: "John Doe",
    description: "Nombre completo del usuario",
    type: "string",
  })
  @Column("text")
  fullName: string;

  @ApiProperty({
    example: "true",
    description: "Indica si el usuario está activo o no",
    type: "boolean",
    default: true,
  })
  @Column("bool", { default: true })
  isActive: boolean; // la idea es no eliminar usuarios, sino desactivarlos, así no perdemos la información de las relaciones

  @ApiProperty({
    example: "['user']",
    description: "Roles del usuario",
    type: "array",
    items: {
      type: "string",
    },
    default: ["user"],
  })
  @Column("text", {
    array: true,
    default: ["user"],
  })
  roles: string[]; // roles del usuario, por ejemplo: ['admin', 'customer']

  @OneToMany(() => Product, product => product.user)
  product: Product;

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
