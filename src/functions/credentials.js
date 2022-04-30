require("dotenv").config();
module.exports = {
  type: process.env.GD_TYPE,
  project_id: process.env.GD_PROJECT_ID,
  private_key_id: process.env.GD_PRIVATE_KEY_ID,
  private_key: process.env.GD_PRIVATE_KEY,
  client_email: process.env.GD_CLIENT_EMAIL,
  client_id: process.env.GD_CLIENT_ID,
  auth_uri: process.env.GD_AUTH_URI,
  token_uri: process.env.GD_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GD_AUTH_PROVIDER_URL,
  client_x509_cert_url: process.env.GD_CLIENT_URL,
};
