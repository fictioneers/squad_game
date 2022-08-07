const RedisTimeSeries = require('redistimeseries-js');

const key = 'teas_made';
const url = process.env.REDIS_URL;
const password = process.env.REDIS_PASSWORD;
const options = {
  url: `redis://default:${password}@${url}`,
}
const rtsClient = new RedisTimeSeries(options);

export default async function handler(req, res) {
  const body = req.body;
  console.info(`Request body: ${JSON.stringify(body)}`)
  if (body.event_type !== 'state.changed' ||
      body.event_object.user_timeline_event_state !== 'COMPLETED' ||
      body.event_object.user_timeline_event_id !== 'OEbC8M1FJ9FcTiVQFqqa') {
    console.info('Not handling event');
    res.status(200).json({});
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
  await rtsClient.add(key, Date.now(), 1).send();
  await rtsClient.getClient().quit();
  res.status(200).json({});
}
