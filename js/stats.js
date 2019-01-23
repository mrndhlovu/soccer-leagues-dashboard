// API URLS
const standingsURL = 'https://api.football-data.org/v2/competitions/2021/standings',
    scorersURL = 'https://api.football-data.org/v2/competitions/PL/scorers',
    season = 'https://api.football-data.org/v2/competitions/PL/matches',
    key = { 'X-Auth-Token': '5d791d1818c3415d9b1a4b323c899bf4' };


// Get API Data with queryURL to call different API server
function ajaxGetData(queryURL) {
    const data = $.ajax({
        headers: key,
        url: queryURL,
        dataType: 'json',
        type: 'GET',
        async: false,
    }).done(function(response) {

    }).responseJSON;
    return data;
}


const apiCall = {
    data: ajaxGetData(season).matches,
    playerScorers: ajaxGetData(scorersURL).scorers,
    stand: ajaxGetData(standingsURL).standings[0].table
};


// empty stats arrays
const awayScore = [],
    homeScore = [],
    awayTeam = [],
    homeTeam = [],
    matchDay = [],
    state = [],
    toPlay = ' - ',
    teams = [],
    teamBadges = [];


//Loop through raw data array and filter wanted data and push to empty arrays
function pullData() {
    Object.keys(apiCall.data).forEach((key) => {
        state.push(apiCall.data[key].status);
        matchDay.push(apiCall.data[key].matchday);
        homeTeam.push(apiCall.data[key].homeTeam.name);
        awayTeam.push(apiCall.data[key].awayTeam.name);


        //Populate home and away score arrays
        if (apiCall.data[key].state !== 'SCHEDULED') {
            awayScore.push(apiCall.data[key].score.fullTime.awayTeam);
            homeScore.push(apiCall.data[key].score.fullTime.homeTeam);
        }
        if (apiCall.data[key].state == 'SCHEDULED') {
            homeScore.push(toPlay);
            awayScore.push(toPlay);
        }
    });
}


function getTeamsAndBadges() {
    Object.keys(apiCall.stand).forEach((key) => {
        teamBadges.push(apiCall.stand[key].team.crestUrl);
        teams.push(apiCall.stand[key].team.name);
    });
}


// On team option click show team badge
function showTeamBadge(showBadge) {
    const badgeImage = document.getElementById('teamBadge');
    for (let i = 0; i < teams.length; i++) {
        if (showBadge == teams[i]) {
            const badgeUrlString = 'url(' + teamBadges[i] + ')';
            badgeImage.style.backgroundImage = badgeUrlString;
        }
    }
}


// Fill option seletor with list of teams
function listTeamsOptions() {

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
        option.setAttribute('onclick', 'tableTeamOnClick(this.innerHTML)');
    }
    document.getElementById('formSelect').appendChild(select);
}


function getSelectedTeam(choice) {
    choice = document.getElementById('teamList').value;
    getStats(choice);
    getTeamGames(choice);
    showTeamBadge(choice);
}


//Find average goals per game;
function findAverage(a, b, c) {
    return a / (b + c);
}


//Team stats logic
function getStats(getSelectedTeam) {

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


    // Get team wins, losses, draws - home
    for (let i = 0; i < matchDay.length; i++) {
        let winH = (matchDay[i] && homeTeam[i] == getSelectedTeam) && homeScore[i] > awayScore[i],
            lossH = (matchDay[i] && homeTeam[i] == getSelectedTeam) && homeScore[i] < awayScore[i],
            winA = (matchDay[i] && awayTeam[i] == getSelectedTeam) && awayScore[i] > homeScore[i],
            lossA = (matchDay[i] && awayTeam[i] == getSelectedTeam) && awayScore[i] < homeScore[i],
            drawH = (matchDay[i] && homeTeam[i] == getSelectedTeam) && homeScore[i] == awayScore[i],
            drawA = (matchDay[i] && awayTeam[i] == getSelectedTeam) && awayScore[i] == homeScore[i],
            playedH = state[i] == 'FINISHED' && homeTeam[i].includes(getSelectedTeam),
            notPlayedH = state[i] == 'SCHEDULED' && homeTeam[i].includes(getSelectedTeam),
            playedA = state[i] == 'FINISHED' && awayTeam[i].includes(getSelectedTeam),
            notPlayedA = state[i] == 'SCHEDULED' && awayTeam[i].includes(getSelectedTeam);

        //If Team selected was playing  show get stats
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

        // Check if team played and get home or away stats
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

}


// Set default match day for fixtures on pageload
function setDefaultMatchDay() {
    let day;
    for (let q = 0; q < apiCall.data.length; q++) {
        if (apiCall.data[q].status == 'FINISHED') {
            day = matchDay[q] + 1;
        }
    }
    return day;
}


// Build fixtures table with match day query
function buildTable(query) {

    for (let d = 0; d < matchDay.length; d++) {

        const gameDate = new Date(apiCall.data[d].utcDate);
        const tr = document.createElement('tr');
        const state = document.createElement('td');
        const hTeam = document.createElement('td');
        const aTeam = document.createElement('td');
        const score = document.createElement('td');
        const date = document.createElement('td');
        //Create table rows and colums

        state.className = 'matchState';
        hTeam.className = 'tableTeam';
        hTeam.setAttribute('onclick', 'tableTeamOnClick(this.innerHTML)');
        hTeam.innerHTML = homeTeam[d];
        aTeam.className = 'tableTeam';
        aTeam.setAttribute('onclick', 'tableTeamOnClick(this.innerHTML)');
        score.className = 'score';
        date.id = 'matchDate';

        state.innerHTML = apiCall.data[d].status + '<br>' + gameDate.toDateString();
        aTeam.innerHTML = awayTeam[d];


        // Use data to build table
        if (query == matchDay[d]) {

            tr.appendChild(hTeam);
            tr.appendChild(score);
            tr.appendChild(aTeam);
            tr.appendChild(state);

            //show results
            if (homeScore[d] > awayScore[d]) {
                score.innerHTML = homeScore[d] + ' : ' + awayScore[d];
                /*showWin();
                showResult();*/

            }
            else if (homeScore[d] < awayScore[d]) {
                score.innerHTML = homeScore[d] + ' : ' + awayScore[d];
                /*  showLoss();
                  showResult();
                  */
            }
            else if ((homeScore[d] == awayScore[d] && apiCall.data[d].status == 'FINISHED') || (awayScore[d] == homeScore[d] && apiCall.data[d].status == 'FINISHED')) {
                score.innerHTML = homeScore[d] + ' : ' + awayScore[d];
                /*showDraw();
                showResult();*/

            }
            else if (homeScore[d] == awayScore[d] && apiCall.data[d].status == 'SCHEDULED') {
                score.innerHTML = '-' + ' : ' + '-';
                //showDraw();
            }
            else if (awayScore[d] == homeScore[d] && apiCall.data[d].status == 'SCHEDULED') {
                score.innerHTML = score.innerHTML = '-' + ' : ' + '-';
            }
        }
        document.getElementById('tableStriped').appendChild(tr);
    }


    // Apply css to winner colomn  || Show green flag if win
    function showWin() {
        homeTeam.style.color = 'green';
        awayTeam.style.color = 'red';
        flagLoss.style.fontSize = '8px';
        flagWin.style.fontSize = '15px';
    }

    // show red flag loss
    function showLoss() {
        homeTeam.style.color = 'red';
        awayTeam.style.color = 'green';
    }

    function showDraw() {
        awayScore.style.color = 'blue';
        homeScore.style.color = 'blue';
        flagLoss.style.fontSize = '8px';
        flagWin.style.fontSize = '8px';
    }

    function showResult() {
        score.style.textAlign = 'center';
        state.style.textAlign = 'center';
        hTeam.style.textAlign = 'center';
        aTeam.style.textAlign = 'center';
        date.style.textAlign = 'center';
    }
}


// Show the past ten games of a particular 
function showPassTenGames(teamClick) {
    let counter = 10;
    for (let i = apiCall.data.length - 10; i--;) {
        let tr = document.createElement('tr'),
            hTeam = document.createElement('td'),
            gameDate = new Date(apiCall.data[i].utcDate),
            aTeam = document.createElement('td'),
            score = document.createElement('td'),
            date = document.createElement('td');

        hTeam.className = 'gameHome';
        aTeam.className = 'gameAway';
        score.className = 'scores';
        date.id = 'gameDate';

        if (((teamClick == homeTeam[i] || teamClick == awayTeam[i]) && state[i] == 'FINISHED') && counter > 0) { //Create table rows and colums


            tr.appendChild(hTeam);
            tr.appendChild(score);
            tr.appendChild(aTeam);
            tr.appendChild(date);

            // Use data to build table
            hTeam.innerHTML = homeTeam[i];

            aTeam.innerHTML = awayTeam[i];
            date.innerHTML = gameDate.toDateString();

            //show results
            if ((teamClick == homeTeam[i] || teamClick == awayTeam[i]) && state[i] == 'FINISHED') {
                score.innerHTML = homeScore[i] + ' : ' + awayScore[i];
            }
            else if ((teamClick == homeTeam[i] || teamClick == awayTeam[i]) && state[i] == 'SCHEDULED') {
                score.innerHTML = homeScore[i] + ' : ' + awayScore[i];
            }
            counter--;
            document.getElementById('gameStriped').appendChild(tr);
        }
    }

}


// Onclick get user match day query, remove old table and build a new one with match day chosen.
function getSelectedDay() {
    const userQuery = document.getElementById('userInput').value;
    const oldDataTable = document.getElementById('tableStriped');
    while (oldDataTable.firstChild) {
        oldDataTable.removeChild(oldDataTable.firstChild);
    }
    buildTable(userQuery);
}


function tableTeamOnClick(team) {
    getTeamGames();
    getStats(team);
    showPassTenGames(team);
    showTeamBadge(team);
}


// Get remove old data and build new table on click
function getTeamGames(tableTeamOnClick) {
    const oldData = document.getElementById('gameStriped');
    while (oldData.firstChild) {
        oldData.removeChild(oldData.firstChild);
    }
    showPassTenGames(tableTeamOnClick);
}


/*......................D3 functions...........................*/


//Graph margin and scaling
const margin = { top: 20, right: 35, bottom: 100, left: 20 },
    width = 350 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    x = d3.scale.ordinal().rangeRoundBands([0, width], 0.5),
    y = d3.scale.linear().range([height, 0]);


function graphTeamWins() {
    
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
    y.domain([0, d3.max(apiCall.stand, function(d) {
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
        .data(apiCall.stand)
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

function graphTeamLosses() {

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
    y.domain([0, d3.max(apiCall.stand, function(d) {
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
        .data(apiCall.stand)
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


const radius = 155;
const color = d3.scale.ordinal()
    .range(['#1abc9c', '#2ecc71', '#3ae374', '#3498db', '#9b59b6', '#f19066', '#18dcff', '#27ae60', '#2980b9', '#8e44ad',
        '#f1c40f', '#e67e22', ' #e74c3c', ' #ecf0f1', '#95a5a6 ', '#7f8c8d ', '#bdc3c7 ', '#c0392b ', '#d35400', '#f39c12'
    ]);

function donutChart(stand) {

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
        .data(pie(apiCall.stand))
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


function pieChart(stand) {

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
        .data(pie(apiCall.stand))
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
}

pullData();
getTeamsAndBadges();
listTeamsOptions();
// Load data on window load
function loadDefaultStats() {
    const statsDefault = teams[0];
    buildTable(setDefaultMatchDay());
    showPassTenGames(statsDefault);
    getStats(statsDefault);
    showTeamBadge(statsDefault);
}

window.onload = () => {
    loadDefaultStats();
};

graphTeamWins();
graphTeamLosses();
donutChart(apiCall.stand);
pieChart(apiCall.stand);
