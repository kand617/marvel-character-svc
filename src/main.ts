import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { CharactersService } from './characters/characters.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const svc = app.get<CharactersService>(CharactersService)
  await svc.init()
  await app.listen(8080)
}
bootstrap()
