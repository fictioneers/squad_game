const crypto = require('crypto');
import Fictioneers from "fictioneers-node-sdk";

export default async function handler(req, res) {
  // Generate user ID
  const userId = crypto.randomUUID();
  // Get token
  const fictioneers = new Fictioneers({
    apiSecretKey: process.env.SECRET_KEY,
    userId: userId
  });
  // Create fictioneers user
  await fictioneers.createUser({timelineId: process.env.TIMELINE_ID});
  // Progress user
  const response = await fictioneers.progressUserStoryStateEvents({maxSteps: null});
  const startingEvent = response.meta.changed_timeline_events[0];
  const ingredients = startingEvent.narrative_event_custom_data.ingredients.split(', ');
  const message = startingEvent.narrative_event_description;
  const goal = startingEvent.narrative_event_custom_data["cups goal"];
  const timeWindow = startingEvent.narrative_event_custom_data["goal time window"];
  const questionId = response.meta.changed_timeline_events.filter(e => e.narrative_event_type === 'ACTIVITY')[0].id
  // Return question 1 & global values
  res.status(200).json({
    userId,
    questionId,
    ingredients,
    message,
    goal,
    timeWindow,
  });
}
