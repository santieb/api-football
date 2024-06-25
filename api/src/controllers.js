const country = "Argentina"

const RESULT = {
  WIN: "win",
  LOSE: "lose",
  DRAW: "draw",
};

export const getFootballMatches = (matches, country) => {
  const counters = {
    [RESULT.WIN]: 0,
    [RESULT.LOSE]: 0,
    [RESULT.DRAW]: 0,
  };

  const matchesWithResult = matches.map((match) => {
    const { home_team, home_score, away_team, away_score } = match;
    let result

    if (home_team === country && home_score > away_score) {
      result = RESULT.WIN;
      counters[RESULT.WIN] += 1
    }

    if (away_team === country && home_score < away_score) {
      result = RESULT.LOSE;
      counters[RESULT.LOSE] += 1
    }

    if (home_score === away_score) {
      result = RESULT.DRAW;
      counters[RESULT.DRAW] += 1
    }

    return {
      ...match,
      result,
    };
  });

  const lastMatchesWithResult = matchesWithResult.slice(0, 14)

  return { lastMatchesWithResult, counters };
}

const controllers = {
  getFootballMatches: (req, res) => {
    const query = `select * from football_matches where away_team = "${country}" or home_team = "${country}" order by date desc`
    const connection = req.dbConnection

    connection.query(query, (err, matches) => {
      if (err) {
        console.error("Error executing query:", err)
        return res.status(500).send("Error executing query")
      }

      const { lastMatchesWithResult, counters } = getFootballMatches(matches, country)

      res.render("Home", { matches: lastMatchesWithResult, counters })
    });
  },
};

export default controllers
