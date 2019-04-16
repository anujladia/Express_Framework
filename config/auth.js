module.exports = {
  storyxpress: {
    apiURL: process.env.SX_API_URL || 'https://api.storyxpress.co',
    clientID: process.env.CLIENT_ID,
    clientIDForGuest: process.env.CLIENT_ID_GUEST,
    clientSecret: process.env.CLIENT_SECRET,
    sxClientSecret: process.env.CLIENT_SECRET_GUEST,
    scope: 'account create myvideos password_reset payments share styles types uploads videos',
    testID: process.env.SX_TEST_LOGIN_ID,
    testPassword: process.env.SX_TEST_LOGIN_PASSWORD
  },
  database: {
    apiURL: process.env.API_URL || 'https://api.storyxpress.co',
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_Name
  },
  jwt: {
    key: process.env.API_JWT_SECRET,
    issuer: process.env.API_JWT_ISSUER,
  },
  facebook: {
    id: process.env.FB_APP_ID,
    secret: process.env.FB_APP_SECRET,
    token: process.env.FB_APP_ACCESS_TOKEN,
  }
};
