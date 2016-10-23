# Shipandco Dashboard API

The REST API that powers the Shipandco dashboard.
Made with [FeathersJS](http://feathersjs.com/)

Services:

* Authentication with Auth0
* Admin users storage in MongoDB (mlab)

## Configuration

Environment variables defined in `.env` file:

```
MONGO_URL=mongodb://***:***@ds*****.mlab.com:*****/*****
AUTH0_SECRET=****************************************************************
AUTH0_ID=********************************
TOKEN_SECRET=***
```

## Commands

### Development

Start the server:

```
npm start
```

### Deploy

#### Setup

Before the first deploy from your computer, you need to set up now `secrets` (credentials and secret keys that do not belong to the code source)

```
now secrets add shipandco_dev_mongo_url ***
```

```
now secrets add shipandco_auth0_secret ***
```

```
now secrets add shipandco_auth0_id ***
```

```
now secrets add shipandco_token_secret ***
```

#### Deploy to now.sh

```
npm run deploy
```
