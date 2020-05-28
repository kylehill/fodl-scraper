const parseMatch = (root, players) => {
  const table = root.querySelector(".gameDetailTable");
  const rows = [...table.querySelectorAll(".gameDetailSetAlt")];

  // [ { game: "cricket" | "501", winner: 0 | 1, firstThrow: 0 | 1, turns: [], darts: Number }... ]
  const games = [];
  let currentGame = null;
  let skipHeader = false;
  rows.forEach((row) => {
    if (row.classNames.includes("gameDetailRow")) {
      currentGame && games.push({ ...currentGame });
      currentGame = {
        game: row.querySelector("td").rawText.endsWith("Cricket") ? "cricket" : "501",
        winner: null,
        turns: [],
      };
      skipHeader = true;
      return;
    }

    if (skipHeader) {
      skipHeader = false;
      return;
    }

    if (currentGame.winner !== null) {
      const [_1, p0Darts, _2, _3, p1Darts, _4] = [...row.querySelectorAll("td")];
      if (currentGame.winner === 0) {
        currentGame.darts = Number(p0Darts.rawText.split(": ")[1]);
      }
      if (currentGame.winner === 1) {
        currentGame.darts = Number(p1Darts.rawText.split(": ")[1]);
      }
      return;
    }

    const [_1, _2, p0Turn, p0Score, _3, p1Score, p1Turn, _4, _5] = [...row.querySelectorAll("td")];
    if (
      p0Score.classNames.includes("startColor_corked") ||
      p0Score.classNames.includes("startColor_wentFirst")
    ) {
      currentGame.firstThrow = 0;
    }
    if (
      p1Score.classNames.includes("startColor_corked") ||
      p1Score.classNames.includes("startColor_wentFirst")
    ) {
      currentGame.firstThrow = 1;
    }

    if (p0Score.classNames.includes("finishColor_win")) {
      currentGame.winner = 0;
    }
    if (p1Score.classNames.includes("finishColor_win")) {
      currentGame.winner = 1;
    }

    currentGame.turns = currentGame.turns
      .concat(
        currentGame.firstThrow ? [p1Turn.rawText, p0Turn.rawText] : [p0Turn.rawText, p1Turn.rawText]
      )
      .filter((a) => a);
  });

  return { players, legs: [...games, { ...currentGame }] };
};

module.exports = parseMatch;
