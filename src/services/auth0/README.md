# Legacy endpoint

## Request

Endpoint: POST `/auth/token`

Payload:

```json
{
  "type":"token",
  "token":"eyJ***"
}
```

## Response

```json
{
  "token":"eyJ***",
  "auth0Id":"google-oauth2|100***",
  "auth0":{
    "email":"***@bentoandco.com",
    "name":"Michael Rambeau",
    "clientID":"3w7***",
    "updated_at":"2017-11-23T09:38:52.479Z",
    "user_id":"google-oauth2|100***",
    "identities":[{
      "_id":"5a1***",
      "connection":"google-oauth2",
      "user_id":"100***","provider":"google-oauth2"
    }],
    "created_at":"2016-10-22T01:24:36.617Z",
    "sub":"google-oauth2|100228331687057110910",
    "accessToken":"htCetj96_afL_ZjrRhsoKzfLahrqtxtK"},
    "__v":0
    }
}
```
