const country = "Argentina";

const RESULT = {
  WIN: "win",
  LOSE: "lose",
  DRAW: "draw",
};

const controllers = {
  getFootballMatches: (req, res) => {
    const query = `select * from football_matches where away_team = "${country}" or home_team = "${country}" order by date desc`;
    const connection = req.dbConnection;

    connection.query(query, (err, matches) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Error executing query");
      }

      const counters = {
        WIN: 0,
        LOSE: 0,
        DRAW: 0,
      };

      const matchesWithResult = matches.map((match) => {
        const { home_team, home_score, away_team, away_score } = match;
        let result;

        if (home_team === country && home_score > away_score) {
          result = RESULT.WIN;
          counters.WIN += 1;
        }

        if (away_team === country && home_score < away_score) {
          result = RESULT.LOSE;
          counters.LOSE += 1;
        }

        if (home_score === away_score) {
          result = RESULT.DRAW;
          counters.DRAW += 1;
        }

        match.result = result;
        return match;
      });

      const lastMatchesWithResult = matches.slice(0, 14);

      res.render("Home", { matches: lastMatchesWithResult, counters });
    });
  },
};

export default controllers;
