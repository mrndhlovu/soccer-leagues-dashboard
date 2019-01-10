//Log to console function
function p(data) {
    console.log(data);
}

var season = "https://api.football-data.org/v2/competitions/PL/matches";
var key = { 'X-Auth-Token': '5d791d1818c3415d9b1a4b323c899bf4' };

start(season);

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
//print(data);

// empty stats arrays
var awayScore = [],
    homeScore = [],
    awayTeam = [],
    homeTeam = [],
    matchDay = [],
    state = [],
    toPlay = " - ",
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
        if (data[key].state !== "SCHEDULED") {
            awayScore.push(data[key].score.fullTime.awayTeam);
            homeScore.push(data[key].score.fullTime.homeTeam);
        }
        else {}
        if (data[key].state == "SCHEDULED") {
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

listTeams();

function listTeams() {

    var select = document.createElement("select"),
        option;

    select.id = "teamList";
    select.name = "teams";

    for (var i = 0; i < teams.length; i++) {
        option = document.createElement("option");
        option.value = teams[i];
        option.id = "team" + (i + 1);
        select.appendChild(option);
        option.innerHTML = teams[i];
        select.appendChild(option);
        select.setAttribute("onchange", "getSelectedTeam();")

    }
    document.getElementById("formSelect").appendChild(select);
}

document.getElementById("userInput").addEventListener("change", getSelectedDay);


function getSelectedTeam() {
    var choice = document.getElementById("teamList").value;
    getStats(choice);
}


var toPlayHome = 0,
    toPlayAway = 0;

function getStats(getSelectedTeam) {

    //Stats variables
    var avg = 0,
        totalGoals = 0,
        cleanSheets = 0,
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
            playedH = state[i] == "FINISHED" && homeTeam[i].includes(getSelectedTeam),
            notPlayedH = state[i] == "SCHEDULED" && homeTeam[i].includes(getSelectedTeam),
            playedA = state[i] == "FINISHED" && awayTeam[i].includes(getSelectedTeam),
            notPlayedA = state[i] == "SCHEDULED" && awayTeam[i].includes(getSelectedTeam);

        //If Team selected was playing  show get stats
        if ((matchDay[i] && homeTeam[i] == getSelectedTeam) && homeScore[i] > awayScore[i]) {

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
        else {}
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
        else {}
    }
    //Find average goals per game;
    avg = totalGoals / (homeGames + awayGames);

    // Write to html 
    document.getElementById("played").innerHTML = "Homes : " + homeGames + " -  Away: " + awayGames;
    document.getElementById("wins").innerHTML = "Home : " + homeWin + " -  Away: " + awayWin;
    document.getElementById("toPlay").innerHTML = "Home : " + toPlayHome + " -  Away: " + toPlayAway;
    document.getElementById("loss").innerHTML = "Home : " + homeLoss + " -  Away: " + awayLoss;
    document.getElementById("draw").innerHTML = "Home : " + homeDraw + " -  Away : " + awayDraw;
    document.getElementById("totalGoal").innerHTML = avg;
    document.getElementById("goalPerMatch").innerHTML = avg.toFixed(0);
    document.getElementById("cleanSheets").innerHTML = cleanSheets;
    document.getElementById("goalsConc").innerHTML = goalsConceded;

}
var query = document.getElementById("userInput").value;

function getNextMatchDay(query) {
    p(query);
    for (var q = 0; q < data.length; q++) {
        if (data[q].status == "FINISHED") {
            query = matchDay[q] + 1;
        }
        else {

        }
    }
    return query;
}

query = getNextMatchDay();

function getSelectedDay() {
    var query = document.getElementById("userInput").value;
    var oldData = document.getElementById("tableStriped");
    while (oldData.firstChild) {
        oldData.removeChild(oldData.firstChild);
    }
    buildTable(query)
}

buildTable(query);

function buildTable(query) {

    for (var d = 0; d < matchDay.length; d++) {

        var tr = document.createElement('tr'),
            th, state, hTeam, aTeam, score, spanWin, spanLoss, date;

        if (query == matchDay[d]) { //Create table rows and colums
            th = document.createElement('th');
            th.scope = "row";
            th.className = "matchDay";
            state = document.createElement('td');
            state.className = "matchState";
            hTeam = document.createElement('td');
            hTeam.className = "homeTeam";
            aTeam = document.createElement('td');
            aTeam.className = "awayTeam";
            score = document.createElement('td');
            score.className = "score";
            spanWin = document.createElement("span");
            spanWin.className = "win glyphicon glyphicon-flag";
            spanLoss = document.createElement("span");
            date = document.createElement('td');
            date.id = "matchDate";

            tr.appendChild(th);
            tr.appendChild(hTeam);
            tr.appendChild(aTeam);
            tr.appendChild(state);
            tr.appendChild(score);
            tr.appendChild(date);

            // Use data to build table
            th.innerHTML = matchDay[d];
            hTeam.innerHTML = homeTeam[d];
            state.innerHTML = data[d].status;
            aTeam.innerHTML = awayTeam[d];
            date.innerHTML = data[d].utcDate;


            //show results
            if (homeScore[d] > awayScore[d]) {
                showWin();
                showResult();
                score.innerHTML = homeScore[d] + " : " + awayScore[d];
            }
            else if (homeScore[d] < awayScore[d]) {
                showLosser();
                showResult();
                score.innerHTML = homeScore[d] + " : " + awayScore[d];
            }
            else if (homeScore[d] == awayScore[d]) {
                showDraw();
                showResult();
                score.innerHTML = homeScore[d] + " : " + awayScore[d];
            }
            else {
                score.innerHTML = homeScore[d] + " : " + awayScore[d];
            }
        }
        document.getElementById('tableStriped').appendChild(tr);
    }
    //Apdatay css to winner colomn 
    // show green flag if win
    function showWin() {
        aTeam.appendChild(spanLoss);
        hTeam.appendChild(spanWin);
        spanWin.style.color = "green";
        spanLoss.style.color = "red";
        spanLoss.style.fontSize = "8px";
        spanWin.style.fontSize = "15px";

    }

    // show red flag loss
    function showLosser() {
        aTeam.appendChild(spanWin);
        hTeam.appendChild(spanLoss);
        spanLoss.style.color = "red";
        spanWin.style.color = "green";
        spanLoss.style.fontSize = "8px";
        spanWin.style.fontSize = "15px";


    }

    function showDraw() {
        aTeam.appendChild(spanWin);
        hTeam.appendChild(spanLoss);
        spanLoss.style.color = "blue";
        spanWin.style.color = "blue";
        spanLoss.style.fontSize = "8px";
        spanWin.style.fontSize = "8px";


    }

    function showResult() {
        score.style.textAlign = "center";
        score.style.fontSize = "1.5em";
        state.style.textAlign = "center";
        th.style.textAlign = "center";
        hTeam.style.textAlign = "center";
        aTeam.style.textAlign = "center";
        date.style.textAlign = "center";
    }
}
