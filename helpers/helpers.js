export const end = async (fictioneers) => {
  const ficResponse = await fictioneers.getUserTimelineEvents();
  ficResponse.data.sort((a, b) => {
    return b.available_step_index - a.available_step_index
  });
  const finalEvent = ficResponse.data[0];

  return finalEvent.narrative_event_description;
};

export const progressUserReachesEnd = async (fictioneers) => {
  const response = await fictioneers.progressUserStoryStateEvents({maxSteps: null});
  if (response.data.end_of_timeline_reached) {
    return await end(fictioneers);
  }
  return null;
}
