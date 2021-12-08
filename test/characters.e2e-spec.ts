import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { CharactersService } from '../src/characters/characters.service'
import { SchedulerRegistry } from '@nestjs/schedule'

jest.setTimeout(60000)
describe('Character Controller (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    const svc = app.get<CharactersService>(CharactersService)
    const cron = app.get<SchedulerRegistry>(SchedulerRegistry)
    cron.deleteInterval('CharacterRefresh')
    await svc.init()
  })

  it('/ (GET) should return a set of ids', (done) => {
    request(app.getHttpServer())
      .get('/characters')
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBeGreaterThan(1)
        done()
      })
  })

  it('/:id (GET) should return a single character ', (done) => {
    request(app.getHttpServer())
      .get('/characters/1010699')
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(1010699)
        done()
      })
  })

  it('/:id (GET) invalid character id ', () => {
    return request(app.getHttpServer()).get('/characters/999999').expect(404)
  })
})
