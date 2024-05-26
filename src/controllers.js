const controllers = {
  getFootballMatches: (req, res) => {
    const query = 'select * from football_matches limit 10'
    const connection = req.dbConnection

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error executing query');
      } else {
        res.json(results);
      }
    });
  }
}

export default controllers