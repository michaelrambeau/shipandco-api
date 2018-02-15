# Ping service

We use https://hyperping.io/ to check periodically whether the Shipandco web application is up and running.

If the application is down, Hyperping will send a webhook to Shipandco API, using `/ping` route.
Then Shipandco API will send a message to Slack `#monitoring` channel.

## Events

There are 2 kinds of event:

* `check.up`
* `check.down`

JSON payload sent by Hyperping:

```json
{
	"event": "check.up",
	"check": {
    "url": "https://httpstat.us/200", 
    "status": 200,
    "down": false,
    "date": 1517983605581,
    "downtime": 2
	}
}
```

```json
{
	"event": "check.down",
	"check": {
    "url": "https://httpstat.us/404", 
    "status": 404,
    "down": true,
    "date": 1517983605581,
    "downtime": 1
  },
  "pings": [
    {
      "status": 404,
      "location": "nyc",
      "original": true
    }
  ]
}
```

## Settings

Add `SLACK_WEBHOOK_HYPERPING` variable to `env` file

```
SLACK_WEBHOOK_HYPERPING=https://hooks.slack.com/services/***/***/***
```

## How to test it?

* Send a POST request to `/ping`, with JSON data (see above)
* Check the message sent to Slack `#monitoring` channel

For tests, you can override the Slack default channel by adding a `channel` parameter to the JSON body.

E.g.

```json
{
  "channel": "#test_mike",
	"event": "check.up",
	"check": {
    "url": "https://httpstat.us/200", 
    "status": 200,
    "down": false,
    "date": 1517983605581,
    "downtime": 2
	}
}
```