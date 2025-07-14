import NodeCache from "node-cache";
//create cache
export const cache = new NodeCache({
  stdTTL: 3600, //1 hour
  checkperiod: 620, //check for expired keys every 620 seconds
  useClones: false, //better performance
});

export const cacheMiddleware =
  (key, ttl = 600) =>
  async (req, res, next) => {
    //create a unique key based our api routes and query parameters
    const userId = req.user?.id || "anonymous";
    const cacheKey = `user_${userId}_${key}_${req.originalUrl}_${JSON.stringify(
      req.query
    )}`;
    try {
      const cachedData = cache.get(cacheKey); //retrive our key/saved data
      if (cachedData) {
        console.log(`Cache key for: ${cacheKey}`);
        return res.json(cachedData); //sending saved response back to the client
      }
      //try to save response
      const originalJSON = res.json;
      //overide res.json method to cache the response
      res.json = function (data) {
        cache.set(cacheKey, data, ttl);
        console.log(`Cache set for key: ${cacheKey}`);
        return originalJSON.call(this, data);
      };
      next();
    } catch (error) {
      console.error("Cache error", error);
      next();
    }
  };

export const clearCache =
  (pattern = null, clearAll = false) =>
  (req, res, next) => {
    const keys = cache.keys();
    if (clearAll) {
      keys.forEach((key) => cache.del(key));
      console.log(`Cleared all cache entries`);
      return next();
    }
    const userId = req.user?.id || "";
    const userPrefix = userId ? `user_${userId}_` : "";
    const matchingKeys = pattern
      ? keys.filter((key) => {
          // If we have a user ID, only clear keys that match both pattern AND user ID
          if (userId) {
            return key.includes(userPrefix) && key.includes(pattern);
          }
          // If no user ID, just match the pattern (backward compatible)
          return key.includes(pattern);
        })
      : keys;

    matchingKeys.forEach((key) => cache.del(key));
    console.log(
      `Cleared ${matchingKeys.length} cache entries for ${
        userId ? `user ${userId}` : "all users"
      }`
    );
    next();
  };
