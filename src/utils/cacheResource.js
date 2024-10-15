const cacheResource = async (redisClient, resourceName, resourceFetchFn) => {
  try {
    const resources = await resourceFetchFn();

    if (redisClient.isReady) {
      const stringifiedResources = resources.map((resource, index) => ({
        score: index,
        value: JSON.stringify(resource),
      }));
      if (await redisClient.exists(resourceName))
        await redisClient.del(resourceName);
      await redisClient.zAdd(resourceName, stringifiedResources);
    }

    return resources;
  } catch (error) {
    console.log(error);
  }
};

module.exports = cacheResource;
