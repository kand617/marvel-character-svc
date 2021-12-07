import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get marvelPrivateKey(): string {
    return this.configService.get('MARVEL_PRIVATE_KEY')
  }
  get marvelPublicKey(): string {
    return this.configService.get('MARVEL_PUBLIC_KEY')
  }
  get marvelBaseUrl(): string {
    return this.configService.get(
      'MARVEL_BASE_URL',
      'https://gateway.marvel.com:443',
    )
  }
}
