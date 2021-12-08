import { Test, TestingModule } from '@nestjs/testing'
import { CommonModule } from '../../common/common.module'
import { MarvelService } from './marvel.service'
jest.setTimeout(300000)
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mockCharacter = {
  id: 1010886,
  name: 'Piledriver',
  description: '',
  modified: '2020-12-31T19:00:00-0500',
}
describe('MarvelService', () => {
  let service: MarvelService
  let mock: MockAdapter

  beforeAll(() => {
    mock = new MockAdapter(axios)
  })

  afterAll(() => {
    mock.restore()
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      providers: [MarvelService],
    }).compile()

    service = module.get<MarvelService>(MarvelService)
  })
  afterEach(() => {
    mock.reset()
  })

  it('should be defined', async () => {
    expect(service).toBeDefined()
    expect(true).toBe(true)
  })

  describe('.getCharacters', () => {
    describe('when 0 results are present from marvel API', () => {
      beforeAll(() => {
        const data = { data: { total: 0, results: [] } }
        mock
          .onGet('https://gateway.marvel.com:443/v1/public/characters')
          .reply(200, data)
      })
      it('should return an empty array', async () => {
        const resp = await service.getCharacters(null)
        expect(resp).toHaveLength(0)
      })
    })

    describe('when invoked with modifiedSince', () => {
      beforeAll(() => {
        const data = { data: { total: 0, results: [] } }
        mock
          .onGet('https://gateway.marvel.com:443/v1/public/characters')
          .reply(200, data)
      })
      it('should pass the param to the server', async () => {
        const modifiedSince = '2021-08-27T17:52:34-0400'
        const resp = await service.getCharacters(modifiedSince)
        expect(resp).toHaveLength(0)
        expect(mock.history.get[0].params['modifiedSince']).toEqual(
          modifiedSince,
        )
      })
    })

    describe('when 2 pages are present marvel API', () => {
      beforeAll(() => {
        const data = {
          data: { total: 200, results: [mockCharacter, mockCharacter] },
        }

        mock.onAny().reply((config) => {
          if (config.method == 'get' && config.params['offset'] == 0) {
            return [200, data]
          } else if (config.method == 'get' && config.params['offset'] == 100) {
            return [200, data]
          } else {
            return [500, {}]
          }
        })
      })
      it('should invoke the API twice with right parameters', async () => {
        const resp = await service.getCharacters(null)
        const getHistory = mock.history.get
        expect(mock.history.get).toHaveLength(2)
        getHistory.map((c) => expect(c.params['limit']).toEqual(100))
        getHistory.map((c) => expect(c.params['apikey']).toBeDefined())
        getHistory.map((c) => expect(c.params['ts']).toBeDefined())
        expect(getHistory[0].params['offset']).toEqual(0)
        expect(getHistory[1].params['offset']).toEqual(100)

        expect(resp).toHaveLength(4)
      })
    })

    describe('when server returns 500', () => {
      beforeAll(() => {
        mock.onAny().reply(500, {})
      })
      it('should raise an exception', async () => {
        await expect(service.getCharacters(null)).rejects.toThrow()
      })
    })
  })
})
