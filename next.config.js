require("dotenv").config();

module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    DOMAIN_NAME: process.env.DOMAIN_NAME,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    DOMAIN_NAME: process.env.DOMAIN_NAME,
  },
};
