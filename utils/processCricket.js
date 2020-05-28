const getMultiple = (character) => {
  if (character === "S") {
    return 1;
  }
  if (character === "D") {
    return 2;
  }

  return 3;
};

const getSector = (sector) => {
  return ["20", "19", "18", "17", "16", "15", "B"].indexOf(sector);
};

const transformDart = (dart) => {
  return { multiple: getMultiple(dart[0]), sector: getSector(dart.substr(1)) };
};

const transformTurn = (turnText) => {
  const beds = turnText.split(", ");
  return beds.reduce((mem, bed) => {
    if (bed.includes("x")) {
      for (let i = 0; i < Number(bed.split("x")[1]); i++) {
        mem = mem.concat(transformDart(bed.split("x")[0]));
      }
      return mem;
    }

    mem = mem.concat(transformDart(bed));
    return mem;
  }, []);
};

const processCricketLeg = (leg, match_id) => {
  const marks = [Array.from(Array(7), (_) => 0), Array.from(Array(7), (_) => 0)];
  const turnMarks = [Array.from(Array(10), (_) => 0), Array.from(Array(10), (_) => 0)];
  const hits = [0, 0];
  const darts = [0, 0];

  leg.turns.forEach((turn, idx) => {
    const thrower = (leg.firstThrow + idx) % 2;
    const opponent = (leg.firstThrow + idx + 1) % 2;
    darts[thrower] += 3;

    // empty set character
    if (turn === "&#8709;") {
      turnMarks[thrower][0] += 1;
      return;
    }

    const turnDarts = transformTurn(turn);
    let turnEffectiveMarks = 0;
    turnDarts.forEach(({ sector, multiple }) => {
      if (marks[opponent][sector] < 3) {
        marks[thrower][sector] += multiple;
        turnEffectiveMarks += multiple;
        hits[thrower] += 1;
        return;
      }

      const effectiveMarks = Math.min(3 - marks[thrower][sector], multiple);
      marks[thrower][sector] += effectiveMarks;
      turnEffectiveMarks += effectiveMarks;
      hits[thrower] += effectiveMarks > 0 ? 1 : 0;
    });

    turnMarks[thrower][turnEffectiveMarks] += 1;
  });

  darts[leg.winner] = leg.darts;
  return marks.map((_, idx) => ({
    match_id,
    _game: "cricket",
    darts: darts[idx],
    turnMarks: turnMarks[idx],
    hits: hits[idx],
    marks: marks[idx].reduce((mem, count) => mem + count, 0),
    firstThrow: leg.firstThrow === idx ? 1 : 0,
    winner: leg.winner === idx ? 1 : 0,
    legs: 1,
    lwat: leg.winner === idx && leg.firstThrow !== idx ? 1 : 0,
    llwt: leg.winner !== idx && leg.firstThrow === idx ? 1 : 0,
  }));
};

module.exports = processCricketLeg;
