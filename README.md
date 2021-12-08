# Marvel Characters API 

The repository serves as a caching layer to make better use of free API limits. 
It currently stores retrieved characters in memory for simplicity. 

## Installation

```bash
$ npm install
```

## Environment configuration
You will need to edit the `.env` file located at the root of the directory. 
You will need to place the Marvel API Key and API Secret here. 

```
MARVEL_PRIVATE_KEY=FILL_ME
MARVEL_PUBLIC_KEY=FILL_ME
```


## API Documentation
API Documentation can be found in OpenAPI spec located in the root
`oas.yml`


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
