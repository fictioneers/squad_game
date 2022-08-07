const RedisTimeSeries = require('redistimeseries-js');

const key = 'teas_made';
const url = process.env.REDIS_URL;
const password = process.env.REDIS_PASSWORD;
const options = {
  url: `redis://default:${password}@${url}`,
}
const rtsClient = new RedisTimeSeries(options);

export default async function handler(req, res) {
  const period = parseInt(req.query.period, 10);
  if (!period || period < 1 || period > 300000) {
    res.status(400).json({'error': 'period must be integer between 1 & 300000'});
    return;
  }
  await rtsClient.connect();
  try {
    await rtsClient
      .create(key)
      .retention(300000)
      .duplicatePolicy(RedisTimeSeries.DuplicatePolicy.SUM)
      .send();
  } catch (err) {
    console.warn(`Error creating key: ${err}`);
  }
  const result = await rtsClient
    .range(key, Date.now() - period, Date.now())
    .aggregation(RedisTimeSeries.Aggregation.SUM, period)
    .send();
  let value = 0;
  if (result.length > 0) {
    value = result[0][1];
  }
  await rtsClient.getClient().quit();
  res.status(200).json({
    completed: parseInt(value, 10),
  });
}
