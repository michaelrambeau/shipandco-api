const got = require('got')
const debug = require('debug')('api')

async function handlePingRequest(req, res) {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_HYPERPING
    if (!webhookUrl) throw new Error('No Slack webhook defined in settings')
    const { body } = req
    debug('Ping request', { body })
    if (!body) throw new Error('No body request!')
    const { event, check, channel } = req.body
    if (!event) throw new Error('No `event` data in request body')
    const message = `"${event}" event from hyperping.io`
    const result = await sendSlackMessage({
      message,
      check,
      webhookUrl,
      channel
    })
    debug('Message sent to Slack', result)
    res.send({ status: 'OK' })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
    res.send({ status: 'Error', message: error.message })
  }
}

function sendSlackMessage({ message, check, webhookUrl, channel }) {
  const text = `${message}${formatStringData(JSON.stringify(check))}`
  debug('Message', text)
  const body = {
    text,
    mrkdwn: true,
    username: 'hyperping.io'
  }
  const headers = {
    'Content-type': 'application/json'
  }
  if (channel) {
    // Override the Slack integration default channel
    // only if a `channel` paramerer is provided (for tests only)
    body.channel = channel
  }
  return got(webhookUrl, {
    body: JSON.stringify(body),
    headers,
    method: 'POST'
  })
}

// Format a string removing extra spaces (useful for DHL error messages)
function formatStringData(strData) {
  if (!strData) return ''
  const separator = '```'
  return `\n${separator}${strData.replace(/\s\s+/g, ' ')}${separator}`
}

module.exports = handlePingRequest
