const { client } = require("../config/redis");

const DEFAULT_EXPIRATION = 3600; // 1 hour in seconds

exports.setCache = async (key, data, expiration = DEFAULT_EXPIRATION) => {
  await client.set(key, JSON.stringify(data), {
    EX: expiration,
  });
};

exports.getCache = async (key) => {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

exports.deleteCache = async (key) => {
  await client.del(key);
};

exports.getOrSetCache = async (
  key,
  callback,
  expiration = DEFAULT_EXPIRATION
) => {
  const cachedData = await exports.getCache(key);

  if (cachedData) {
    return cachedData;
  }

  const freshData = await callback();
  await exports.setCache(key, freshData, expiration);
  return freshData;
};

exports.deleteCacheByPattern = async (pattern) => {
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(keys);
  }
};
