import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Permite cualquier origen
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS', // Permite todos los métodos
    allowedHeaders: 'Content-Type, Authorization', // Permite cualquier encabezado
    credentials: true 
  });

  await app.listen(3001);
}
void bootstrap();
