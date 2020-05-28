const processCricketLeg = require("./processCricket");
const process501Leg = require("./process501");

const processMatch = ({ players, legs }, match_id) => {
  const processedLegs = legs.map((l) => {
    if (l.game === "cricket") {
      return processCricketLeg(l, match_id);
    }

    return process501Leg(l, match_id);
  });

  return players.map((player, idx) => ({
    player,
    cricket: processedLegs.map((leg) => leg[idx]).filter((leg) => leg._game === "cricket"),
    501: processedLegs.map((leg) => leg[idx]).filter((leg) => leg._game === "501"),
  }));
};

module.exports = processMatch;
