import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const looger = new Logger("bootstrap");

  app.setGlobalPrefix("api");

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }));
  await app.listen(process.env.PORT);
  looger.log(`Server running on port ${process.env.PORT}`);
}
bootstrap();
