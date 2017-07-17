const fields = {
  auth0Id: String,
  auth0: {
    email: String,
    name: String,
    clientID: String,
    updated_at: String,
    user_id: String,
    identities: [
      {
        provider: String,
        user_id: String,
        connection: String
      }
    ],
    created_at: Date,
    sub: String,
    accessToken: String
  }
}
module.exports = fields
