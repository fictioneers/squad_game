const crypto = require('crypto');
const contentful = require("contentful");
import Fictioneers from "fictioneers-node-sdk";

const shuffle = (array) => {
  array.sort(() => Math.random() - 0.5);
}

const contentfulClient = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

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
  const response = await fictioneers.progressUserStoryStateEvents({maxSteps: 1});
  const { questionId, content } = response.meta.changed_timeline_events.map(e => {
    return { 'questionId': e.id, 'content': e.narrative_event_content };
  }).filter(e => e.content.length > 0)[0];
  // Get content
  const question = await contentfulClient.getEntry(content[0].content_id);
  const answers = question.fields.question.incorrect_answers;
  answers.push(question.fields.question.correct_answer);
  shuffle(answers);
  // Return question 1
  res.status(200).json({
    userId,
    questionId,
    question: {
      answers,
      image: question.fields.image.fields.file.url,
    },
  });
}
