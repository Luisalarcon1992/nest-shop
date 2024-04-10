import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const looger = new Logger("bootstrap");

  app.setGlobalPrefix("api");

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }));

  const swaggerConfig = new DocumentBuilder().setTitle("NestShopApi").setDescription("The NestShop API description").setVersion("1.0").build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("api", app, document);
  await app.listen(process.env.PORT);
  looger.log(`Server running on port ${process.env.PORT}`);
}
bootstrap();
