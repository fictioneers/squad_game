export const shuffle = (array) => {
  array.sort(() => Math.random() - 0.5);
}

export const end = async (res, fictioneers) => {
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

const contentful = require("contentful");
export const contentfulClient = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export const progressToNextQuestionContent = async (fictioneers, res) => {
  const response = await fictioneers.progressUserStoryStateEvents({maxSteps: 1});
  if (response.data.end_of_timeline_reached) {
    await end(res, fictioneers);
    return;
  }
  const { questionId, content } = response.meta.changed_timeline_events.map(e => {
    return { 'questionId': e.id, 'content': e.narrative_event_content };
  }).filter(e => e.content.length > 0)[0];
  return [questionId, content];
}

export const questionContent = async (content_id) => {
  const question = await contentfulClient.getEntry(content_id);
  const answers = question.fields.question.incorrect_answers;
  answers.push(question.fields.question.correct_answer);
  shuffle(answers);
  return [answers, question.fields.image.fields.file.url]
}

const crypto = require('crypto');
export const generateHash = (timestamp) => {
  const plainText = timestamp + process.env.HASH_SALT
  return crypto.createHash('sha256').update(plainText, 'utf8').digest('hex');
}
