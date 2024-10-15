const { isEqual } = require("lodash");

const isCacheStale = (cacheResources, dbResources) => {
  const stringifiedResources = dbResources.map((resource) =>
    JSON.stringify(resource),
  );
  if (cacheResources.length !== stringifiedResources.length) return true;

  return !isEqual(cacheResources, stringifiedResources);
};

module.exports = isCacheStale;
