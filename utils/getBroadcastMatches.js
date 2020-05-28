const fetch = require("node-fetch");
const playerLookup = require("./playerLookup");

const getBroadcastMatches = async (body) => {
  try {
    const response = await fetch("https://app.dartconnect.com/corsapi/getBroadcastMatches", {
      body,
      method: "post",
    });
    const data = await response.json();
    return data.payload.matches
      .map((m) => ({
        id: m.match_id,
        players: [playerLookup(m.opponent_0), playerLookup(m.opponent_1)],
      }))
      .filter((m) => m.id);
  } catch (e) {
    return [];
  }
};

module.exports = getBroadcastMatches;
