const { createClient } = require("redis");

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const connectToRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Redis Connected");
    }
  } catch (error) {
    console.log(`Error connecting to Redis: ${error}`);
  }
};

module.exports = { connectToRedis, redisClient };
