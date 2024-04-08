import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { unique: true })
  email: string;

  @Column("text")
  password: string;

  @Column("text")
  fullName: string;

  @Column("bool", { default: true })
  isActive: boolean; // la idea es no eliminar usuarios, sino desactivarlos, así no perdemos la información de las relaciones

  @Column("text", {
    array: true,
    default: ["user"],
  })
  roles: string[]; // roles del usuario, por ejemplo: ['admin', 'customer']
}
