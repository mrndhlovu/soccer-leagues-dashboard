//Log to console function
function p(data) {
    console.log(data);
}

var season = 'https://api.football-data.org/v2/competitions/PL/matches';
var key = { 'X-Auth-Token': '5d791d1818c3415d9b1a4b323c899bf4' };



function start(season) {
    $.extend({
        getValues: function(url) {
            var result = null;
            $.ajax({
                headers: key,
                url: url,
                type: 'get',
                dataType: 'json',
                async: false,
                cache: false,
                success: function(data) {
                    result = data;
                }
            });
            return result.matches;
        }
    });
    var result = $.getValues(season);
    return result;
}

var data = start(season);


// empty stats arrays
var awayScore = [],
    homeScore = [],
    awayTeam = [],
    homeTeam = [],
    matchDay = [],
    state = [],
    toPlay = ' - ',
    teams = [];


//Loop through array and filter data using push to empty arrays
function filter() {
    Object.keys(data).forEach(function(key) {
        state.push(data[key].status);
        matchDay.push(data[key].matchday);
        homeTeam.push(data[key].homeTeam.name);
        teams.push(data[key].homeTeam.name);
        awayTeam.push(data[key].awayTeam.name);
        teams.push(data[key].awayTeam.name);

        //Populate home and away score arrays
        if (data[key].state !== 'SCHEDULED') {
            awayScore.push(data[key].score.fullTime.awayTeam);
            homeScore.push(data[key].score.fullTime.homeTeam);
        }
        else {}
        if (data[key].state == 'SCHEDULED') {
            homeScore.push(toPlay);
            awayScore.push(toPlay);
        }
        else {}

    });
}

filter();

// Filter teams array and remove dublicates
function removeDudataicates(teams) {
    var uniqueTeams = [];
    for (let i = 0; i < teams.length; i++) {
        if (uniqueTeams.indexOf(teams[i]) == -1) {
            uniqueTeams.push(teams[i]);
        }
    }
    return uniqueTeams;
}

teams = removeDudataicates(teams);
teams.sort();

// Fill option seletor with list of teams

function listTeams() {

    var select = document.createElement('select'),
        option;

    select.id = 'teamList';
    select.name = 'teams';

    for (var i = 0; i < teams.length; i++) {
        option = document.createElement('option');
        option.value = teams[i];
        option.id = 'team' + (i + 1);
        select.appendChild(option);
        option.innerHTML = teams[i];
        option.setAttribute('onclick', 'tableTeamOnClick(this.innerHTML)');
        select.appendChild(option);
        select.setAttribute('onchange', 'getSelectedTeam();')
    }
    document.getElementById('formSelect').appendChild(select);
}

listTeams();

document.getElementById('userInput').addEventListener('change', getSelectedDay);


function getSelectedTeam(choice) {
    var choice = document.getElementById('teamList').value;
    getStats(choice);
}


function getStats(getSelectedTeam) {

    //Stats variables
    var avg = 0,
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

    // get team wins, losses, draws - home and
    for (var i = 0; i < matchDay.length; i++) {
        var winH = (matchDay[i] && homeTeam[i] == getSelectedTeam) && homeScore[i] > awayScore[i],
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
            awayLoss++
            goalsConceded += homeScore[i];
        }
        else if (playedH && drawH) {
            homeDraw++;
            if (awayScore[i] > 0) {
                goalsConceded += awayScore[i];
            }
        }
        else if (playedA && drawA) {
            awayDraw++
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
    //Find average goals per game;
    avg = totalGoals / (homeGames + awayGames);

    // Write to html 
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

var query = document.getElementById('userInput').value;

function getNextMatchDay(query) {

    for (var q = 0; q < data.length; q++) {
        if (data[q].status == 'FINISHED') {
            query = matchDay[q] + 1;
        }
        else {

        }
    }
    return query;
}

query = getNextMatchDay();

function getSelectedDay() {
    var query = document.getElementById('userInput').value;
    var oldData = document.getElementById('tableStriped');
    while (oldData.firstChild) {
        oldData.removeChild(oldData.firstChild);
    }
    buildTable(query)
}



function buildTable(query) {

    for (var d = 0; d < matchDay.length; d++) {
        var gameDate = new Date(data[d].utcDate);

        var tr = document.createElement('tr'),
            th, state, hTeam, aTeam, score, flagWin, flagLoss, flagDraw, date;

        if (query == matchDay[d]) {

            //Create table rows and colums
            state = document.createElement('td');
            state.className = 'matchState';
            hTeam = document.createElement('td');
            hTeam.className = 'tableTeam';
            hTeam.setAttribute('onclick', 'tableTeamOnClick(this.innerHTML)');
            aTeam = document.createElement('td');
            aTeam.className = 'tableTeam';
            aTeam.setAttribute('onclick', 'tableTeamOnClick(this.innerHTML)');
            score = document.createElement('td');
            score.className = 'score';

            date = document.createElement('td');
            date.id = 'matchDate';


            tr.appendChild(hTeam);
            tr.appendChild(score);
            tr.appendChild(aTeam);
            tr.appendChild(state);
            tr.appendChild(date);

            // Use data to build table
            hTeam.innerHTML = homeTeam[d];
            state.innerHTML = data[d].status;
            aTeam.innerHTML = awayTeam[d];
            date.innerHTML = gameDate.toDateString();

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
            else if ((homeScore[d] == awayScore[d] && data[d].status == 'FINISHED') || (awayScore[d] == homeScore[d] && data[d].status == 'FINISHED')) {
                score.innerHTML = homeScore[d] + ' : ' + awayScore[d];
                /*showDraw();
                showResult();*/

            }
            else if (homeScore[d] == awayScore[d] && data[d].status == 'SCHEDULED') {
                score.innerHTML = '-' + ' : ' + '-';
                //showDraw();
            }
            else if (awayScore[d] == homeScore[d] && data[d].status == 'SCHEDULED') {
                score.innerHTML = score.innerHTML = '-' + ' : ' + '-';
            }
        }
        document.getElementById('tableStriped').appendChild(tr);
    }

    // Apply css to winner colomn 
    // Show green flag if win

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
buildTable(query);

var teamClick = teams[0];

function showTeamGames(teamClick) {
    var counter = 10;
    for (var i = data.length - 10; i--;) {
        var tr = document.createElement('tr'),
            hTeam, aTeam, score, date;
        var gameDate = new Date(data[i].utcDate);
        if (((teamClick == homeTeam[i] || teamClick == awayTeam[i]) && state[i] == 'FINISHED') && counter > 0) { //Create table rows and colums

            hTeam = document.createElement('td');
            hTeam.className = 'gameHome';
            aTeam = document.createElement('td');
            aTeam.className = 'gameAway';
            score = document.createElement('td');
            score.className = 'scores';
            date = document.createElement('td');
            date.id = 'gameDate';

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

showTeamGames(teamClick);

function loadDefaultStats() {;
    getStats(teamClick);
}



document.getElementById('userInput').addEventListener('onclick', tableTeamOnClick);

function tableTeamOnClick(team) {
    getTeamGames();
    getStats(teamClick);
    getStats(team)
    showTeamGames(team);

}

teamClick = tableTeamOnClick;

function getTeamGames() {
    var oldData = document.getElementById('gameStriped');
    while (oldData.firstChild) {
        oldData.removeChild(oldData.firstChild);
    }
    showTeamGames(teamClick);
}

window.onload = function() {
    loadDefaultStats();
}