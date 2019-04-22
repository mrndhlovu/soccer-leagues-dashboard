// Initialise Global Variables

const REQUEST_URL = 'https://api.football-data.org/v2/competitions/',
    key = { 'X-Auth-Token': '5d791d1818c3415d9b1a4b323c899bf4' },
    leagues = ['PL', 'ELC', 'SA', 'CL', 'BL1', 'PPL', 'PD'],
    id = [2021, 2016],
    matches = '/matches/',
    scorers = '/scorers',
    standings = '/standings';

let defaultLeague;


const awayScore = [],
    homeScore = [],
    awayTeam = [],
    homeTeam = [],
    matchDay = [],
    state = [],
    toPlay = ' - ',
    teams = [],
    teamBadges = [];

let games,
    topGoalScorers,
    leagueStandings;


//Fetch data when window loads.
const fetchData = (leaguesEndPoint, scorerEP, standingsEP) => {

    console.log('Fetch data for..', leaguesEndPoint)
    //Endpoint Data Request
    const requestData = (url) => {
        const data = $.ajax({
            headers: key,
            url: url,
            dataType: 'json',
            type: 'GET',
            async: false,
        }).done(response => {
            console.log('Data received', response)

        }).responseJSON;
        return data;
    };

    games = requestData(leaguesEndPoint).matches;
    topGoalScorers = requestData(scorerEP).scorers;
    leagueStandings = requestData(standingsEP).standings[0].table;

    console.log('Starting App have the data for..', leaguesEndPoint)

    startApp();
}


const leagueOptions = () => {

    const choice = document.getElementById('leagueSelect').value;

    console.log('The default', choice)

    // Fill option seletor with list of leagues

    const select = document.createElement('select');

    const option = document.createElement('option');
    option.innerHTML = 'Choose League';
    option.selected = 'selectedLeague(this.options[this.selectedIndex].value);';
    select.appendChild(option);
    for (let i = 0; i < leagues.length; i++) {
        const option = document.createElement('option');
        select.appendChild(option);
        select.id = 'leagueList';
        select.name = 'leagues';
        select.appendChild(option);
        option.value = leagues[i];
        select.setAttribute('onchange', 'selectedLeague(this.options[this.selectedIndex].value);');
        option.id = 'league' + (i + 1);
        option.innerHTML = leagues[i];
        console.log('select.value is', option.selected);
        if (option.selected || select.value == leagues[i]) {

            return defaultLeague == leagues[i];
        }
        else if (select.value == leagues[i]) {
            leagues.map(lg => {
                if (select.value == lg[i]) {
                    return defaultLeague == lg[i];
                }
            })
        }
    }
    document.getElementById('leagueSelect').appendChild(select);
    selectedLeague(defaultLeague);

    const clear = () => {

        console.log('click')
        window.location.reload();
    }


};

const selectedLeague = leagueOption => {
    console.log('This the select option', leagueOption)


    for (let i = 0; i < leagues.length; i++) {
        if (leagueOption == leagues[i]) {
            defaultLeague = leagues[i];

            const league = REQUEST_URL + defaultLeague + matches,
                score = REQUEST_URL + defaultLeague + scorers,
                stand = REQUEST_URL + defaultLeague + standings;

            return fetchData(league, score, stand);
        }
    }

};

//Filter through response data and push to empty arrays
const filterData = () => {

    console.log('Load data for ', defaultLeague);
    Object.keys(games).forEach(key => {

        matchDay.push(games[key].matchday);
        homeTeam.push(games[key].homeTeam.name);
        awayTeam.push(games[key].awayTeam.name);
        state.push(games[key].status);

        //Populate home and away score arrays
        if (games[key].status !== 'SCHEDULED') {
            awayScore.push(games[key].score.fullTime.awayTeam);
            homeScore.push(games[key].score.fullTime.homeTeam);
        }
        if (games[key].status == 'SCHEDULED') {
            homeScore.push(toPlay);
            awayScore.push(toPlay);
        }
    });
}


// Get team badges and names and push to empty arrays
const getTeamsAndBadges = () => {
    Object.keys(leagueStandings).forEach((key) => {
        teamBadges.push(leagueStandings[key].team.crestUrl);
        teams.push(leagueStandings[key].team.name);
    });
};


// On team option click show team badge
const showTeamBadge = showBadge => {
    const badgeImage = document.getElementById('teamBadge');
    for (let i = 0; i < teams.length; i++) {
        if (showBadge == teams[i]) {
            const badgeUrlString = 'url(' + teamBadges[i] + ')';
            badgeImage.style.backgroundImage = badgeUrlString;
        }
    }
};


// Fill option seletor with list of teams
const listTeamsOptions = () => {
    const select = document.createElement('select');

    for (let i = 0; i < teams.length; i++) {
        const option = document.createElement('option');
        select.appendChild(option);
        select.setAttribute('onchange', 'getSelectedTeam();');
        select.id = 'teamList';
        select.name = 'teams';
        select.appendChild(option);
        option.value = teams[i];
        option.id = 'team' + (i + 1);
        option.innerHTML = teams[i];

    }
    document.getElementById('formSelect').appendChild(select);
};

// When team leagueed from dropdown  get team name
const getSelectedTeam = choice => {
    choice = document.getElementById('teamList').value;
    showStats(choice);
    getTeamGames(choice);
    showTeamBadge(choice);
}


//Find average goals per game;
const findAverage = (a, b, c) => {
    return a / (b + c);
}

//Team stats logic
const showStats = team => {

    //Stats variables
    let avg = 0,
        totalGoals = 0,
        cleanSheets = 0,
        toPlayHome = 0,
        toPlayAway = 0,
        homeGames = 0,
        awayGames = 0,
        goalsConceded = 0,
        homeWin = 0,
        homeLoss = 0,
        awayWin = 0,
        awayLoss = 0,
        homeDraw = 0,
        awayDraw = 0;

    // Get team wins, losses, draws
    for (let i = 0; i < matchDay.length; i++) {
        let winH = (matchDay[i] && homeTeam[i] == team) && homeScore[i] > awayScore[i],
            lossH = (matchDay[i] && homeTeam[i] == team) && homeScore[i] < awayScore[i],
            winA = (matchDay[i] && awayTeam[i] == team) && awayScore[i] > homeScore[i],
            lossA = (matchDay[i] && awayTeam[i] == team) && awayScore[i] < homeScore[i],
            drawH = (matchDay[i] && homeTeam[i] == team) && homeScore[i] == awayScore[i],
            drawA = (matchDay[i] && awayTeam[i] == team) && awayScore[i] == homeScore[i],
            playedH = state[i] == 'FINISHED' && homeTeam[i].includes(team),
            notPlayedH = state[i] == 'SCHEDULED' && homeTeam[i].includes(team),
            playedA = state[i] == 'FINISHED' && awayTeam[i].includes(team),
            notPlayedA = state[i] == 'SCHEDULED' && awayTeam[i].includes(team);

        //If team selected was playing  show get stats
        if (winH) {
            homeWin++;
            if (awayScore[i] > 0) {
                goalsConceded += awayScore[i];
            }
        }
        else if (lossH) {
            homeLoss++;
            goalsConceded += awayScore[i];

        }
        else if (winA) {
            awayWin++;
            if (homeScore[i] > 0) {
                goalsConceded += homeScore[i];
            }
        }
        else if (lossA) {
            awayLoss++;
            goalsConceded += homeScore[i];
        }
        else if (playedH && drawH) {
            homeDraw++;
            if (awayScore[i] > 0) {
                goalsConceded += awayScore[i];
            }
        }
        else if (playedA && drawA) {
            awayDraw++;
            if (homeScore[i] > 0) {
                goalsConceded += homeScore[i];
            }
        }

        // Check if team played then calculate stats
        if (playedH) {
            homeGames++;
            totalGoals += homeScore[i];
            if (homeScore[i] > 0) {
                totalGoals += homeScore[i];
            }
            if (awayScore[i] == 0) {
                cleanSheets++;
            }
            if (playedA && awayTeam[i] == 0) {
                cleanSheets++;
            }
        }
        else if (notPlayedH) {
            toPlayHome++;
        }
        else if (playedA) {
            awayGames++;
            if (awayScore[i] > 0) {
                totalGoals += awayScore[i];
            }
            if (playedA && homeScore[i] == 0) {
                cleanSheets++;
            }
        }
        else if (notPlayedA) {
            toPlayAway++;
        }
    }

    //Get team avegare goals per match
    avg = findAverage(totalGoals, homeGames, awayGames);

    // Write to html cards
    document.getElementById('played').innerHTML = homeGames + awayGames;
    document.getElementById('wins').innerHTML = homeWin + awayWin;
    document.getElementById('toPlay').innerHTML = toPlayHome + toPlayAway;
    document.getElementById('loss').innerHTML = homeLoss + awayLoss;
    document.getElementById('draw').innerHTML = homeDraw + awayDraw;
    document.getElementById('totalGoal').innerHTML = totalGoals;
    document.getElementById('goalPerMatch').innerHTML = avg.toFixed(0);
    document.getElementById('cleanSheets').innerHTML = cleanSheets;
    document.getElementById('goalsConc').innerHTML = goalsConceded;

};


// Set default match day for fixtures on pageload
const setDefaultMatchDay = () => {

    let defaultMatch;
    for (let day = 0; day < games.length; day++) {

        if (games[day].status === 'FINISHED') {
            defaultMatch = matchDay[day] + 1;
        }
    }
    return defaultMatch;
};

// Flag result for every match and color flags
const flagResults = (result, team1, team2) => {

    if (result === true) {
        team1.style.color = 'green';
        team1.style.fontSize = '15px';
        team2.style.color = 'red';
        team2.style.fontSize = '8px';
    }
    else if (result === false) {
        team1.style.color = 'red';
        team1.style.fontSize = '8px';
        team2.style.color = 'green';
        team2.style.fontSize = '15px';
    }
    else if (result == 'draw') {
        team1.style.color = 'blue';
        team2.style.color = 'blue';
        team2.style.fontSize = '7px';
        team1.style.fontSize = '7px';
    }
}


// Build fixtures table with match day query
const buildTable = day => {

    for (let d = 0; d < matchDay.length; d++) {
        const homeWinner = true;
        const awayWinner = false;
        const draw = 'draw';
        const gameDate = new Date(games[d].utcDate),
            tr = document.createElement('tr'),
            state = document.createElement('td'),
            hTeam = document.createElement('td'),
            aTeam = document.createElement('td'),
            score = document.createElement('td'),
            date = document.createElement('td'),
            flagTeamOne = document.createElement('span'),
            flagTeamTwo = document.createElement('span');
        //Create table rows and colums

        state.className = 'matchState';
        hTeam.className = 'tableTeam';
        hTeam.innerHTML = homeTeam[d];
        aTeam.className = 'tableTeam';
        score.className = 'score';
        date.id = 'matchDate';
        state.innerHTML = games[d].status + '<br>' + gameDate.toDateString();
        aTeam.innerHTML = awayTeam[d];
        flagTeamTwo.className = 'glyphicon glyphicon-flag';
        flagTeamOne.className = 'glyphicon glyphicon-flag';


        // Use data to build table
        if (day == matchDay[d]) {

            tr.appendChild(hTeam);
            tr.appendChild(score);
            tr.appendChild(aTeam);
            tr.appendChild(state);

            //show results
            if (homeScore[d] > awayScore[d]) {
                score.innerHTML = homeScore[d] + ' : ' + awayScore[d];
                hTeam.append(flagTeamOne);
                aTeam.append(flagTeamTwo);
                flagResults(homeWinner, flagTeamOne, flagTeamTwo);
            }
            else if (homeScore[d] < awayScore[d]) {
                score.innerHTML = homeScore[d] + ' : ' + awayScore[d];
                hTeam.append(flagTeamOne);
                aTeam.append(flagTeamTwo);
                flagResults(awayWinner, flagTeamOne, flagTeamTwo);
            }
            else if ((homeScore[d] == awayScore[d] && games[d].status == 'FINISHED') || (awayScore[d] == homeScore[d] && games[d].status == 'FINISHED')) {
                score.innerHTML = homeScore[d] + ' : ' + awayScore[d];
                hTeam.append(flagTeamOne);
                aTeam.append(flagTeamTwo);
                flagResults(draw, flagTeamOne, flagTeamTwo);
            }
            else if (homeScore[d] == awayScore[d] && games[d].status == 'SCHEDULED') {
                score.innerHTML = '-' + ' : ' + '-';
            }
            else if (awayScore[d] == homeScore[d] && games[d].status == 'SCHEDULED') {
                score.innerHTML = score.innerHTML = '-' + ' : ' + '-';
            }
        }
        document.getElementById('tableStriped').appendChild(tr);
    }

}

// show top goal scorers
const showTopGoalScorers = () => {

}


// Show team past ten games 
const showPassTenGames = team => {
    let pastTenGames = 10;

    //loop through the data file backwards and find past played games then build table
    for (let i = games.length - 10; i--;) {

        let tr = document.createElement('tr'),
            hTeam = document.createElement('td'),
            gameDate = new Date(games[i].utcDate),
            aTeam = document.createElement('td'),
            score = document.createElement('td'),
            date = document.createElement('td');

        hTeam.className = 'gameHome';
        aTeam.className = 'gameAway';
        score.className = 'scores';
        date.id = 'gameDate';

        // if the team clicked is found in past games played list the last 10  
        if (((team == homeTeam[i] || team == awayTeam[i]) && state[i] == 'FINISHED') && pastTenGames > 0) {


            //Create table rows and colums
            tr.appendChild(hTeam);
            tr.appendChild(score);
            tr.appendChild(aTeam);
            tr.appendChild(date);

            // Use data to build table
            hTeam.innerHTML = homeTeam[i];

            aTeam.innerHTML = awayTeam[i];
            date.innerHTML = gameDate.toDateString();

            //show results
            if ((team == homeTeam[i] || team == awayTeam[i]) && state[i] == 'FINISHED') {
                score.innerHTML = homeScore[i] + ' : ' + awayScore[i];
            }
            else if ((team == homeTeam[i] || team == awayTeam[i]) && state[i] == 'SCHEDULED') {
                score.innerHTML = homeScore[i] + ' : ' + awayScore[i];
            }
            pastTenGames--;
            document.getElementById('gameStriped').appendChild(tr);
        }
    }

};

const rangeMaxMatchDay = () => {
    console.log(matchDay.length)
    return matchDay.length
}

// Onclick get user match day query, remove old table and build a new one with match day chosen.
const leagueMatchDay = () => {
    const userQuery = document.getElementById('userInput').value;
    const oldDataTable = document.getElementById('tableStriped');
    while (oldDataTable.firstChild) {
        oldDataTable.removeChild(oldDataTable.firstChild);
    }
    buildTable(userQuery);
};

// Get remove old data and build new table on click
const getTeamGames = team => {
    const oldData = document.getElementById('gameStriped');
    while (oldData.firstChild) {
        oldData.removeChild(oldData.firstChild);
    }
    showPassTenGames(team);
};


/*......................D3 functions...........................*/

/*...Credit to AccioCode Youtube Channel for d3 code below.....*/

//Graph margin and scaling
const margin = { top: 20, right: 35, bottom: 100, left: 20 },
    width = 350 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    x = d3.scale.ordinal().rangeRoundBands([0, width], 0.5),
    y = d3.scale.linear().range([height, 0]);

//show games won graph for each team
const graphTeamWins = () => {

    // Point where to draw graph
    const svg = d3.select('#wonGamesChart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    const yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(10)
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(1);

    // X axis text strings
    x.domain(teams.map(function(d) {
        return d.substring(0, 6) + ' FC';
    }));

    // Y axis value 
    y.domain([0, d3.max(leagueStandings, function(d) {
        return d.won;
    })]);
    // Create  axis
    const xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');


    // Group and append text strings
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-0.5em')
        .attr('dy', '-2em')
        .attr('y', 30)
        .attr('transform', 'rotate(-90)');

    // Group and append graph heading values
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('x', 100)
        .attr('y', 1)
        .attr('text-anchor', 'end')
        .attr('class', 'graphHeading')
        .text('Team Wins');


    // Give bar values
    svg.selectAll('bar')
        .data(leagueStandings)
        .enter()
        .append('rect')
        .style('fill', '#af4032')
        .attr('x', function(d) {
            return x(d.team.name.substring(0, 6) + ' FC');
        })
        .attr('width', x.rangeBand())
        .attr('y', function(d) {
            return y(d.won);
        })
        .attr('height', function(d) {
            return height - y(d.won);
        })
        // Mouse over bar effect
        .on('mouseover', function(d) {
            barPoint.style('display', null);
        })
        .on('mouseout', function() {
            barPoint.style('display', 'none');
        })
        .on('mousemove', function(d) {
            const xPos = d3.mouse(this)[1] - 2;
            const yPos = d3.mouse(this)[1] - 50;
            barPoint.attr('transform', 'translate(' + xPos + ',' + yPos + ')');
            barPoint.select('text').text(d.team.name + '\n' + ': Wins: ' + d.won);
        })
    const barPoint = svg.append('g')
        .attr('class', 'chartPointTool1')
        .style('display', 'none');

    barPoint.append('text')
        .attr('x', 12)
        .attr('dy', '1.2em')
        .style('text-anchor', 'middle')
        .attr('font-size', '1.5rem')

}

//show games lost graph for each team
const graphTeamLosses = () => {

    // Point where to draw graph
    const svg = d3.select('#lostGamesChart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Create  axis
    const xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')

    const yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(10)
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(1);

    // X axis text strings
    x.domain(teams.map(function(d) {
        return d.substring(0, 6) + ' FC';
    }));

    // Y axis value 
    y.domain([0, d3.max(leagueStandings, function(d) {
        return d.lost;
    })]);

    // Group and append text strings
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-0.5em')
        .attr('dy', '-2em')
        .attr('y', 30)
        .attr('transform', 'rotate(-90)');

    // Group and append graph heading values
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('x', 100)
        .attr('y', 1)
        .attr('text-anchor', 'end')
        .attr('class', 'graphHeading')
        .text('Team Losses');


    // Give bar values
    svg.selectAll('bar')
        .data(leagueStandings)
        .enter()
        .append('rect')
        .style('fill', '#477fb9')
        .attr('x', function(d) {
            return x(d.team.name.substring(0, 6) + ' FC');
        })
        .attr('width', x.rangeBand())
        .attr('y', function(d) {
            return y(d.lost);
        })
        .attr('height', function(d) {
            return height - y(d.lost);
        })
        // Mouse over bar effect
        .on('mouseover', function(d) {
            barPoint.style('display', null);
        })
        .on('mouseout', function(d) {
            barPoint.style('display', 'none');
        })
        .on('mousemove', function(d) {
            const xPos = d3.mouse(this)[1] - 5;
            const yPos = d3.mouse(this)[1] - 50;
            barPoint.attr('transform', 'translate(' + xPos + ',' + yPos + ')');
            barPoint.select('text').text(d.team.name + '\n' + ' : Losses: ' + d.lost);
        });

    const barPoint = svg.append('g')
        .attr('class', 'chartPointTool2')
        .style('display', 'none');

    barPoint.append('text')
        .attr('x', 12)
        .attr('dy', '1.2em')
        .style('text-anchor', 'middle')
        .attr('font-size', '1.5rem')
}

//Create donuts
// Donut color ranges and radius
const radius = 155;
const color = d3.scale.ordinal()
    .range(['#1abc9c', '#2ecc71', '#3ae374', '#3498db', '#9b59b6', '#f19066', '#18dcff', '#27ae60', '#2980b9', '#8e44ad',
        '#f1c40f', '#e67e22', ' #e74c3c', ' #ecf0f1', '#95a5a6 ', '#7f8c8d ', '#bdc3c7 ', '#c0392b ', '#d35400', '#f39c12'
    ]);

const donutChart = stand => {

    const canvas = d3.select('#goalsScoredDonut')
        .append('svg')
        .attr('width', 400)
        .attr('height', 400);

    const group = canvas.append('g')
        .attr('transform', 'translate(170,160)');

    const arc = d3.svg.arc()
        .innerRadius(100)
        .outerRadius(radius);

    const pie = d3.layout.pie()
        .value(function(d) {
            return d.goalsFor;
        });

    const chartArc = group.selectAll('.arc')
        .data(pie(leagueStandings))
        .enter()
        .append('g')
        .attr('class', 'arc');

    chartArc.append('path')
        .attr('d', arc)
        .attr('fill', function(d) {
            return color(d.data.goalsFor);
        });

    chartArc.append('text')
        .attr('transform', function(d) {
            return 'translate(' + arc.centroid(d) + ')';
        })
        .attr('dy', '0.25em')
        .text(function(d) {
            return d.data.goalsFor;
        })
        // Mouse over bar effect
        .on('mouseover', function(d) {
            barPoint.style('display', null);
        })
        .on('mouseout', function(d) {
            barPoint.style('display', 'none');
        })
        .on('mousemove', function(d) {
            const xPos = d3.mouse(this)[0] + 1;
            const yPos = d3.mouse(this)[1] + 5;
            barPoint.attr('transform', 'translate(' + xPos + ',' + yPos + ')');
            barPoint.select('text').text('Team: ' + d.data.team.name + ' :  CurrentRank: ' + d.data.position);
        });

    const barPoint = chartArc.append('g')
        .attr('class', 'donutTool1')
        .style('display', 'none');

    barPoint.append('text')
        .attr('x', 2)
        .attr('dy', '1.2em')
        .style('text-anchor', 'middle');

    chartArc.append('g')
        .attr('class', 'y axis')
        .append('text')
        .attr('x', 2)
        .attr('y', 1)
        .attr('text-anchor', 'end')
        .attr('class', 'graphHeading')
        .text('Goals Scored');

}

//Make donut showing goals conceded per team
const pieChart = stand => {

    const canvas = d3.select('#goalsConcededDonut')
        .append('svg')
        .attr('width', 400)
        .attr('height', 400);

    const group = canvas.append('g')
        .attr('transform', 'translate(170,160)');

    const arc = d3.svg.arc()
        .innerRadius(100)
        .outerRadius(radius);

    const pie = d3.layout.pie()
        .value(function(d) {
            return d.goalsAgainst;
        });

    const chartArc = group.selectAll('.arc')
        .data(pie(leagueStandings))
        .enter()
        .append('g')
        .attr('class', 'arc');

    chartArc.append('path')
        .attr('d', arc)
        .attr('fill', function(d) {
            return color(d.data.goalsAgainst);
        });

    chartArc.append('text')
        .attr('transform', function(d) {
            const _d = arc.centroid(d);
            _d[0] *= 1.05;
            _d[1] *= 1.05;
            return 'translate(' + _d + ')';
        })
        .attr('dy', '0.011em')

        .text(function(d) {
            return d.data.goalsAgainst;
        })

        // Mouse over bar effect
        .on('mouseover', function(d) {
            barPoint.style('display', null);
        })
        .on('mouseout', function(d) {
            barPoint.style('display', 'none');
        })
        .on('mousemove', function(d) {
            const xPos = d3.mouse(this)[0] + 1;
            const yPos = d3.mouse(this)[1] + 5;
            barPoint.attr('transform', 'translate(' + xPos + ',' + yPos + ')');
            barPoint.select('text').text(d.data.team.name);
        });

    // bar pointer class and css
    const barPoint = chartArc.append('g')
        .attr('class', 'donutTool2')
        .style('display', 'none');

    barPoint.append('text')
        .attr('x', 2)
        .attr('dy', '1.2em')
        .style('text-anchor', 'middle')
        .attr('color', '#16a085');
    chartArc.append('g')
        .attr('class', 'y axis')
        .append('text')
        .attr('x', 2)
        .attr('y', 1)
        .attr('text-anchor', 'end')
        .attr('class', 'graphHeading')
        .text('Goals Conceded');
};


// Call all functions



const startApp = () => {

    filterData();
    getTeamsAndBadges();
    listTeamsOptions();

    const defaultTeam = teams[0];

    buildTable(setDefaultMatchDay());
    showPassTenGames(defaultTeam);
    showStats(defaultTeam);
    showTeamBadge(defaultTeam);
    showTopGoalScorers()
    graphTeamWins();
    graphTeamLosses();
    donutChart(leagueStandings);
    pieChart(leagueStandings);
};



// Load data on window load
window.onload = () => {
    leagueOptions();
    document.getElementById("reset").onclick = function() {
        window.location.reload()
    };

};


/*...............END........................*/
