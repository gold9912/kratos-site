import "reflect-metadata";
import * as cookieParser from "cookie-parser";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.enableCors({
    origin: config.get("CLIENT_ORIGIN", "http://127.0.0.1:5173"),
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Kratos API")
    .setDescription("Client-server API for ООО Кратос.")
    .setVersion("1.0.0")
    .addCookieAuth("kratos-access-token")
    .build();

  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(config.get("PORT", 3000));
}

void bootstrap();
