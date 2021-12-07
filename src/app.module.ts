import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CharactersModule } from './characters/characters.module'
import { CommonModule } from './common/common.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    CharactersModule,
    ConfigModule.forRoot(),
    CommonModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
