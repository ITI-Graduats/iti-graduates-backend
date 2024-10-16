const { createClient } = require("redis");

let redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    reconnectStrategy: (retries) => {
      const MINUTES_UNTIL_RETRY = 60;
      console.log(`Attempt ${retries + 1} to reconnect...`);
      return MINUTES_UNTIL_RETRY * 60 * 1000;
    },
  },
});

const connectToRedis = async () => {
  try {
    redisClient.on("ready", async () => {
      console.log("Redis Connected");
      await redisClient.flushAll();
      console.log("cache flushed");
    });
    redisClient.on("error", (error) => {
      console.error("Redis connection error:", error.message || error);
    });

    redisClient.on("end", () => {
      console.log("Redis connection closed");
    });

    redisClient.on("reconnecting", () => {
      console.log("Attempting to reconnect to Redis...");
    });
    if (!redisClient.isOpen) await redisClient.connect();
  } catch (error) {
    console.log(`Error connecting to Redis: ${error.message || error}`);
  }
};

module.exports = { connectToRedis, redisClient };
