import { Injectable, Logger } from '@nestjs/common'
import { AppConfigService } from '../../common/app-config/app-config.service'
import * as crypto from 'crypto-js'
import {
  CharacterDTO,
  CharacterResponseDataDTO,
} from './character-response.dto'
import axios from 'axios'
import * as moment from 'moment'
import { Retryable } from 'typescript-retry-decorator'

@Injectable()
export class MarvelService {
  private readonly logger = new Logger(MarvelService.name)

  baseURL: string
  publicKey: string
  privateKey: string

  constructor(configService: AppConfigService) {
    this.privateKey = configService.marvelPrivateKey
    this.publicKey = configService.marvelPublicKey
    this.baseURL = configService.marvelBaseUrl
  }

  private calculateHash(ts: number) {
    return crypto.MD5(ts + this.privateKey + this.publicKey).toString()
  }

  @Retryable({ maxAttempts: 3 }) // Retry added as the server randomly gives 500.
  private async getCharactersWithOffset(
    offset: number,
    limit: number,
    modifiedSince: string,
  ): Promise<CharacterResponseDataDTO> {
    const ts = Date.now()
    try {
      this.logger.log(`Fetching with offset: ${offset}`)
      const params = {
        apikey: this.publicKey,
        ts: ts,
        limit: limit,
        hash: this.calculateHash(ts),
        offset: offset,
      }
      if (modifiedSince) {
        params['modifiedSince'] = modifiedSince
      }
      const res = await axios.request({
        url: `${this.baseURL}/v1/public/characters`,
        params: params,
      })
      return res.data.data
    } catch (e) {
      this.logger.error('Failed to fetch characters', {
        offset,
        limit,
        modifiedSince,
        err: e.toString(),
      })
      throw e
    }
  }

  public async getCharacters(modifiedSince: string): Promise<CharacterDTO[]> {
    this.logger.log(`Fetching characters list since ${modifiedSince}`)
    try {
      const start = moment()
      const agg = []
      let offset = 0
      const limit = 100
      const data = await this.getCharactersWithOffset(
        offset,
        limit,
        modifiedSince,
      )
      if (!data) {
        return []
      }
      agg.push(data.results)
      const requests = []
      while (true) {
        offset = offset + 100
        if (data.total > offset) {
          // TODO: Optimise with a fan out method to better control network call rate
          requests.push(
            this.getCharactersWithOffset(offset, limit, modifiedSince),
          )
        } else {
          break
        }
      }
      const responses = await Promise.all(requests)
      responses.forEach((r) => {
        agg.push(r.results)
      })
      this.logger.log('Fetching characters list completed', {
        ts: moment().diff(start),
      })

      return agg.flat()
    } catch (error) {
      this.logger.error(`Fetching characters list failed`, error)
      throw error
    }
  }
}
