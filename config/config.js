module.exports = {
  db: {
    servername: process.env.NODE_ENV === 'production' ? 'mongo' : 'localhost',
    port: '27017',
    DATABASE: 'vuechat'
  },
  redis: {
    host: process.env.NODE_ENV === 'production' ? 'redis' : 'localhost',
    port: 6379
  }
}