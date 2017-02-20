module.exports = {
  db: {
    name: 'db',
    connector: 'mongodb',
    url: process.env.MONGODB_URI
  },
  storage: {
    name: 'storage',
    connector: 'loopback-component-storage',
    provider: 'amazon',
    key: process.env.AMAZON_KEY,
    keyId: process.env.AMAZON_ID
  },
  raygun: {
    token: process.env.RAYGUN_APIKEY,
    name: 'raygun',
    connector: 'memory'
  }
};