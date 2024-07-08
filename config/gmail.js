const fs = require('fs');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// Load OAuth2 credentials
const credentials = JSON.parse(fs.readFileSync('credentials.json'));

// Create OAuth2 client
const oauth2Client = new OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

module.exports = oauth2Client;
