export interface CharacterDTO {
  id: number
  name: string
  description: string
  modified: string
}

export interface CharacterResponseDataDTO {
  total: number
  results: CharacterDTO[]
}

export interface CharacterResponseDTO {
  code: number
  data: CharacterResponseDataDTO
}
