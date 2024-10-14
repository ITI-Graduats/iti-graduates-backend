const cacheResource = async (redisClient, resourceName, resourceFetchFn) => {
  try {
    const resources = await resourceFetchFn();
    const stringifiedResources = resources.map((resource, index) => ({
      score: index,
      value: JSON.stringify(resource),
    }));
    await redisClient.zAdd(resourceName, stringifiedResources);

    return resources;
  } catch (error) {
    console.log(error);
  }
};

module.exports = cacheResource;
