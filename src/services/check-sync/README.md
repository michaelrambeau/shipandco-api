# `check-sync` feature

GOAL: provide an end-point to check periodically (every 20 minute for example) shop sync jobs.
For each shop type, it could return the number of minutes since the last sync, for the oldest job.

```json
{
  "check_date": "2017-03-14T01:03:05.244Z",
  "shopTypes": {    
    "amazon": 5,
    "base": 2,
    "ebay": 3,
    "magento1": 5,
    "magento2": 5,
    "nextengine": 2,
    "prestashop15": 2,
    "rakuten": 2
  }
}
```

Then a scheduled task will call the API `check-sync` end-point and notify Shipandco staff if any shop has not been synchronized since more than 10 minutes.
The notification could be a Slack message sent to a new channel.
