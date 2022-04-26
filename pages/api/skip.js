const contentful = require("contentful");
import Fictioneers from "fictioneers-node-sdk";

const shuffle = (array) => {
  array.sort(() => Math.random() - 0.5);
}

const contentfulClient = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

const end = async (res, fictioneers) => {
  const ficResponse = await fictioneers.getUserTimelineEvents();
  const answerEvents = ficResponse.data.filter(e => !e.thread_id);
  const correctAnswerEvents = answerEvents.filter(e =>  e.state == 'COMPLETED');
  const incorrectAnswerEvents = answerEvents.filter(e =>  e.state != 'COMPLETED');

  res.status(200).json({
    result: 'completed',
    correct: correctAnswerEvents.length,
    incorrect: incorrectAnswerEvents.length,
  });
};


export default async function handler(req, res) {
  const { body } = req;
  const jsonBody = JSON.parse(body);
  const fictioneers = new Fictioneers({
    apiSecretKey: process.env.SECRET_KEY,
    userId: jsonBody.userId,
  })
  // Get user state
  const ficResponse = await fictioneers.getUserTimelineEvents();
  const currentQuestion = ficResponse.data.filter(e => e.id == jsonBody.questionId)[0];
  const skippedQuestions = ficResponse.data.filter(e => e.thread_id != null && e.state == 'SKIPPED')
  // If skips < 3
  if (skippedQuestions.length < 3) {
    // Mark question skipped
    await fictioneers.updateUserTimelineEvent({
      timelineEventId: currentQuestion.id,
      state: 'SKIPPED',
    });
    // Progress user
    const response = await fictioneers.progressUserStoryStateEvents({maxSteps: 1});
    if (response.data.end_of_timeline_reached) {
      await end(res, fictioneers);
      return;
    }
    const { questionId, content } = response.meta.changed_timeline_events.map(e => {
      return { 'questionId': e.id, 'content': e.narrative_event_content };
    }).filter(e => e.content.length > 0)[0];
    // Get content
    const question = await contentfulClient.getEntry(content[0].content_id);
    const answers = question.fields.question.incorrect_answers;
    answers.push(question.fields.question.correct_answer);
    shuffle(answers);
    // Return skipped response
    res.status(200).json({
      result: 'skipped',
      userId: jsonBody.userId,
      questionId,
      question: {
        answers,
        image: question.fields.image.fields.file.url,
      },
    });
  } else {
    res.status(400).json({});
  }
}
