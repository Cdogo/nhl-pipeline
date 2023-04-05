/**
 * The API endpoint to fetch data from.
 */
const { API_ENDPOINT } = process.env;

/**
 * Fetches data from the API endpoint.
 * @returns {Promise<Object>} The raw data retrieved from the API.
 */
async function fetchData() {
    const response = await fetch(`${API_ENDPOINT}/api/v1/schedule`);
    const data = await response.json();
    return data;
}

/**
 * Processes the raw data to extract relevant information for each game.
 * @param {Object} rawData - The raw data retrieved from the API.
 * @returns {Array<Object>} An array of game objects, each containing information like link, gamePk, gameDate, and status.
 */
function processRawData(rawData) {
    return rawData.dates[0].games.map((item) => ({
        link: item.link,
        gamePk: item.gamePk,
        gameDate: item.gameDate,
        status: item.status,
    }));
}

/**
 * Processes the raw game data to extract relevant information for each team's players.
 * @param {Object} rawData - The raw data retrieved from the API.
 * @returns {Object} An object containing information on the home and away teams, each containing an array of player objects with information like ID, name, age, number, position, and stats.
 */
function processRawGameData(rawData) {
    // Extract information for the away team.
    let awayTeam = {
        team: rawData.liveData.boxscore.teams.away.team,
        players: []
    }

    const awayPlayerKeys = Object.keys(rawData.liveData.boxscore.teams.away.players);

    const awayPlayers = awayPlayerKeys.map((key) => ({
        id: rawData.liveData.boxscore.teams.away.players[key].person.id,
        name: rawData.liveData.boxscore.teams.away.players[key].person.fullName,
        number: rawData.liveData.boxscore.teams.away.players[key].jerseyNumber,
        age: rawData.gameData.players[key].currentAge,
        position: rawData.liveData.boxscore.teams.away.players[key].position,
        stats: rawData.liveData.boxscore.teams.away.players[key].stats,
    }));
    awayTeam.players = awayPlayers

    // Extract information for the home team.
    let homeTeam = {
        team: rawData.liveData.boxscore.teams.home.team,
        players: []
    }
    const homePlayerKeys = Object.keys(rawData.liveData.boxscore.teams.home.players);

    const homePlayers = homePlayerKeys.map((key) => ({
        id: rawData.liveData.boxscore.teams.home.players[key].person.id,
        name: rawData.liveData.boxscore.teams.home.players[key].person.fullName,
        number: rawData.liveData.boxscore.teams.home.players[key].jerseyNumber,
        age: rawData.gameData.players[key].currentAge,
        position: rawData.liveData.boxscore.teams.home.players[key].position,
        stats: rawData.liveData.boxscore.teams.home.players[key].stats,
    }));
    homeTeam.players = homePlayers

    return {
        homeTeam,
        awayTeam,
    }
}

/**
 * Fetches game data for the given link and processes it to extract relevant information.
 * @param {string} link - The link to fetch game data from.
 * @returns {Promise<Object>} An object containing information on the home and away teams, each containing an array of player objects with information like ID, name, age, number, position, and stats.
 */
export async function getGameData(link) {
    const response = await fetch(`${API_ENDPOINT}${link}`)
    const data = await response.json();
    const processedData = processRawGameData(data);

    return processedData;
}

/**
 * Fetches data from the API endpoint and processes it to extract relevant information for each game.
 * @returns {Promise<Array<Object>>} An array of game objects, each containing information like link, gamePk, gameDate, and status.
 */
export async function getData(){
    const data = await fetchData();
    const processedData = processRawData(data)

    return processedData
}