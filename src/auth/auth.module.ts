import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { Type } from "class-transformer";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: "jwt" }),

    // Esta forma es síncrona y no se recomienda para producción ya que el secret se expone en el código fuente
    // Además, no se puede acceder a las variables de entorno en tiempo de compilación
    // Por otro lado, al ser síncrono, puede que no encuentre la variable en el momento que monta la aplicación y provoque un error
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: "1d" },
    // })

    JwtModule.registerAsync({
      // No es necesario importar ConfigModule, pero si se importa, se puede inyectar ConfigService
      // Con esto, se puede acceder a las variables de entorno en tiempo de ejecución
      // Al ser asíncrono, no se montará la aplicación hasta que se resuelva la promesa, por lo que no habrá problemas con las variables de entorno
      // Al hacerlo de esta manera, aplicamos el principio de inyección de dependencias y desacoplamos el módulo de la configuración

      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: { expiresIn: configService.get("JWT_EXPIRES_IN") },
        };
      },
    }),
  ],
  exports: [AuthService, TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
