import { createClient } from 'redis';

const Redis = createClient({
  url: 'redis://redis-14848.c281.us-east-1-2.ec2.cloud.redislabs.com:14848',
  password: 't2FbrT2YHeXhiRIwaH1YtMyCDfSRvBGQ'
});

(async () => {
  await Redis.connect();
})();

Redis.on('connect', () => console.log('Redis is connected')).on('error', err =>
  console.log(err)
);

export async function setRedis(key, data) {
  if (typeof data === 'object') data = JSON.stringify(data);
  if (typeof key === 'object') key = key.toString();
  const keyName = `${key}_${process.env.NODE_ENV}`
  return await Redis.set(keyName, data);
}

export async function getRedis(key, parse = false) {
  try {
    if (!key) throw new Error('Cache key not found');
    const keyName = `${key}_${process.env.NODE_ENV}`
    const data = await Redis.get(keyName);
    return parse ? JSON.parse(data) : data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function delRedis(key) {
  try {
    if (!key) return false;
    const keyName = `${key}_${process.env.NODE_ENV}`
    return await Redis.del(keyName);
  } catch (error) {
    throw new Error(error);
  }
}

export async function setRedisEx(key, data, timer: number) {
  if (typeof data === 'object') data = JSON.stringify(data);
  if (typeof key === 'object') key = key.toString();
  const keyName = `${key}_${process.env.NODE_ENV}`
  return await Redis.setEx(keyName, timer, data);
}

export const updateRedis = async (key: string, newValue) => {
  try {
    const redisValues = await getRedis(key, true);
    if (redisValues === null) {
      let newValues = [];
      newValues.push(newValue);
      await setRedisEx(key, newValues, parseInt(process.env.REDIS_TIMEOUT_SECONDS));
      return;
    }

    const foundItemIndex = redisValues.findIndex((value, index: number) => {
      return value._id.toString() === newValue._id.toString();
    })
    if (foundItemIndex === -1)
      redisValues.push(newValue)
    else
      redisValues[foundItemIndex] = newValue;

    await setRedisEx(key, redisValues, parseInt(process.env.REDIS_TIMEOUT_SECONDS));

  } catch (error) {
    throw error;
  }
}

export const deleteRedis = async (key: string, id: string) => {
  try {
    const redisValues = await getRedis(key, true);
    if (redisValues) {
      const foundItemIndex = redisValues.findIndex((value, index: number) => {
        return value._id.toString() === id;
      })
      if (foundItemIndex)
        redisValues.splice(foundItemIndex, 1)
      await setRedisEx(key, redisValues, parseInt(process.env.REDIS_TIMEOUT_SECONDS));
    }
  } catch (error) {

  }
}
export default Redis;
