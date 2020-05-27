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
    lwat: leg.winner === idx && leg.firstThrow !== idx ? 1 : 0,
    llwt: leg.winner !== idx && leg.firstThrow === idx ? 1 : 0,
  }));
};

const checkoutTranche = (score) => {
  if (isBogon(score)) {
    return false;
  }

  if (score <= 40) {
    if (score % 4 === 0) {
      return "d2";
    }
    if (score % 2 === 0) {
      return "d1";
    }
    return "sd";
  }
  if (score <= 60) {
    return "sd";
  }
  if (score <= 80) {
    return "ssd";
  }
  if (score <= 90) {
    return "ssb";
  }
  if (score <= 120) {
    return "tsd";
  }
  if (score <= 130) {
    return "tsb";
  }
  if (score <= 160) {
    return "ttd";
  }
  if (score <= 170) {
    return "ttb";
  }
  return false;
};

const isBogon = (score) => {
  return [159, 162, 163, 165, 166, 168, 169].indexOf(score) > -1;
};

const process501Leg = (leg, match_id) => {
  const points = [501, 501];
  const darts = [0, 0];
  const visits = [0, 0];
  const turnScores = [{}, {}];
  const busts = [0, 0];
  const bogons = [0, 0];
  const checkoutTranches = [{}, {}];
  const checkouts = [{}, {}];

  leg.turns.forEach((turn, idx) => {
    const thrower = (leg.firstThrow + idx) % 2;
    darts[thrower] += 3;
    visits[thrower] += 1;

    const tranche = checkoutTranche(points[thrower]);
    if (tranche) {
      checkoutTranches[thrower][tranche] = (checkoutTranches[thrower][tranche] || 0) + 1;
    }

    if (turn === "X") {
      turnScores[thrower][0] = (turnScores[thrower][0] || 0) + 1;
      busts[thrower] += 1;
      return;
    }
    // empty set
    if (turn === "&#8709;") {
      turnScores[thrower][0] = (turnScores[thrower][0] || 0) + 1;
      return;
    }

    const score = Number(turn);
    turnScores[thrower][score] = (turnScores[thrower][score] || 0) + 1;

    points[thrower] -= score;
    if (isBogon(points[thrower])) {
      bogons[thrower] += 1;
    }

    if (points[thrower] === 0) {
      checkouts[thrower][score] = (checkouts[thrower][score] || 0) + 1;
    }
  });

  darts[leg.winner] = leg.darts;
  return points.map((_, idx) => ({
    match_id,
    _game: "501",
    darts: darts[idx],
    points: 501 - points[idx],
    visits: visits[idx],
    turnScores: turnScores[idx],
    busts: busts[idx],
    bogons: bogons[idx],
    checkoutTranches: checkoutTranches[idx],
    checkouts: checkouts[idx],
    firstThrow: leg.firstThrow === idx ? 1 : 0,
    winner: leg.winner === idx ? 1 : 0,
    lwat: leg.winner === idx && leg.firstThrow !== idx ? 1 : 0,
    llwt: leg.winner !== idx && leg.firstThrow === idx ? 1 : 0,
  }));
};

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
