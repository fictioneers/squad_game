const crypto = require('crypto');
import Fictioneers from "fictioneers-node-sdk";
import { progressToNextQuestionContent, questionContent } from "../../helpers/helpers";

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
  const result = await progressToNextQuestionContent(fictioneers, res)
  if (!result) {
    return;
  }
  console.log(`Result: ${result}`);
  const [questionId, content] = result;
  // Get content
  const [answers, image] = await questionContent(content[0].content_id)
  // Return question 1
  res.status(200).json({
    userId,
    questionId,
    question: {
      answers,
      image,
    },
  });
}
