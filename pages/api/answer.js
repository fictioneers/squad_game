import Fictioneers from "fictioneers-node-sdk";
import { progressUserReachesEnd } from "../../helpers/helpers";

export default async function handler(req, res) {
  // Get token
  const { body } = req;
  const jsonBody = JSON.parse(body);
  const fictioneers = new Fictioneers({
    apiSecretKey: process.env.SECRET_KEY,
    userId: jsonBody.userId,
  })
  // Get user state
  const ficResponse = await fictioneers.getUserTimelineEvents();
  const currentQuestion = ficResponse.data.filter(e => e.id === jsonBody.questionId)[0];
  const correct_answer = currentQuestion.narrative_event_title
  // If answer correct
  if (correct_answer == jsonBody.answer) {
    // Mark question complete
    const response = await fictioneers.updateUserTimelineEvent({ 
      timelineEventId: currentQuestion.id,
      state: 'COMPLETED',
    });
    const nextQuestionId = response.meta.changed_timeline_event_states.filter(e => e.state === 'AVAILABLE')[0]?.timeline_event_id
    // Handle having reached the final activity in time
    if (!nextQuestionId) {
      res.status(200).json({
        result: 'completed',
        message: ficResponse.data.filter(e => e.id === currentQuestion.related_timeline_event_ids[0])[0].narrative_event_description
      });
      return;
    }
    // Progress user
    const result = await progressUserReachesEnd(fictioneers)
    if (result) {
      res.status(200).json({
        result: 'completed',
        message: result,
      });
      return;
    }
    // Return next question ID
    res.status(200).json({
      result: 'correct',
      userId: jsonBody.userId,
      questionId: nextQuestionId,
    });
    return;
  }
  // Mark question complete
  await fictioneers.updateUserTimelineEvent({
    timelineEventId: currentQuestion.id,
    state: 'SKIPPED',
  });
  // Return incorrect response
  res.status(200).json({
    result: 'completed',
    message: ficResponse.data.filter(e => e.id === currentQuestion.related_timeline_event_ids[0])[0].narrative_event_description
  });
}
