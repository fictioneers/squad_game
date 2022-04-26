import Fictioneers from "fictioneers-node-sdk";
import { progressToNextQuestionContent, questionContent, contentfulClient } from "../../helpers/helpers";

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
  const currentQuestion = ficResponse.data.filter(e => e.id == jsonBody.questionId)[0];
  const content = await contentfulClient.getEntry(currentQuestion.narrative_event_content[0].content_id);
  // If answer correct
  if (content.fields.question.correct_answer == jsonBody.answer) {
    // Mark question complete
    await fictioneers.updateUserTimelineEvent({ 
      timelineEventId: currentQuestion.id,
      state: 'COMPLETED',
    });
    // Mark answer complete
    const answerResponse = await fictioneers.updateUserTimelineEvent({ 
      timelineEventId: currentQuestion.related_timeline_event_ids[0],
      state: 'COMPLETED',
    });
    // Get answer content
    const answerContent = await contentfulClient.getEntry(answerResponse.meta.upserted_event_hooks[0].content_integrations[0].content_id);
    // Progress user
    const result = await progressToNextQuestionContent(fictioneers, res)
    if (!result) {
      return;
    }
    const [questionId, content] = result;
    // Get content
    const [answers, image] = await questionContent(content[0].content_id)
    // Return answer content & next question content
    res.status(200).json({
      result: 'correct',
      userId: jsonBody.userId,
      questionId,
      question: {
        answers,
        image,
      },
      answerImage: answerContent.fields.answer.fields.file.url,
    });
  } else {
    // Mark question complete
    await fictioneers.updateUserTimelineEvent({
      timelineEventId: currentQuestion.id,
      state: 'SKIPPED',
    });
    // Progress user
    const result = await progressToNextQuestionContent(fictioneers, res)
    if (!result) {
      return;
    }
    const [questionId, content] = result;
    // Get content
    const [answers, image] = await questionContent(content[0].content_id)
    // Return incorrect response
    res.status(200).json({
      result: 'incorrect',
      userId: jsonBody.userId,
      questionId,
      question: {
        answers,
        image,
      },
    });
  }
}
