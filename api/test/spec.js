import { getFootballMatches } from '../src/controllers.js'

const RESULT = {
  WIN: "win",
  LOSE: "lose",
  DRAW: "draw",
};

describe('getFootballMatches function', () => {
  it('should calculate match results and counters correctly', () => {
    const mockMatches = [
      { home_team: 'Argentina', home_score: 2, away_team: 'Brazil', away_score: 1 },
      { home_team: 'Brazil', home_score: 1, away_team: 'Argentina', away_score: 2 },
      { home_team: 'Argentina', home_score: 0, away_team: 'Uruguay', away_score: 0 }
    ];

    const country = 'Argentina';

    const { lastMatchesWithResult, counters } = getFootballMatches(mockMatches, country);

    expect(lastMatchesWithResult.length).toBe(3)
    expect(counters[RESULT.WIN]).toBe(1)
    expect(counters[RESULT.LOSE]).toBe(1)
    expect(counters[RESULT.DRAW]).toBe(1)
  })

})