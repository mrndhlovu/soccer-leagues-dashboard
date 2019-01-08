/*global$*/


//Log to console function
function print(data) {
    console.log(data);
}

var apiUrl = ["https://api.football-data.org/v2/competitions/PL/matches?matchday=", "https://api.football-data.org/v2/competitions/PL/matches"];
var key = { 'X-Auth-Token': '5d791d1818c3415d9b1a4b323c899bf4' };


function getData(query) {
    $.extend({
        getValues: function(url) {
            var result = null;
            $.ajax({
                headers: key,
                url: apiUrl[0] + query,
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
    var result = $.getValues(apiUrl[0]);
    return result;
}

var data = getData("");
print(data);

// empty stats arrays
var awayScore = [],
    homeScore = [],
    awayTeam = [],
    homeTeam = [],
    matchDay = [],
    state = [],
    toPlay = " - ",
    teams = [];

function reseStats() {
    awayScore.length = 0;
    homeScore.length = 0;
}

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

print(data[0]);

// Fill option seletor with list of teams
var select = document.createElement("select"),
    option;

select.id = "teamList";
select.name = "teams";

function getSelectedTeam() {
    var choice = document.getElementById("teamList").value;
    getStats(choice);
}

function getStats(getSelectedTeam) {

    //Stats variables
    var avg = 0,
        totalGoals = 0,
        toPlayHome = 0,
        toPlayAway = 0,
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
    print(getSelectedTeam);

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
            print(homeScore[i] + "      " + awayScore[i]);
            homeWin++;
            if (awayScore[i] > 0) {
                goalsConceded += awayScore[i];
            }
        }
        else if (lossH) {
            homeLoss++;
            goalsConceded += awayScore[i];
            print("loss: " + homeScore[i] + "      " + awayScore[i]);
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
        else if (drawH) {
            homeDraw++;
            if (awayScore[i] > 0) {
                goalsConceded += awayScore[i];
            }
        }
        else if (drawA) {
            awayDraw++
            if (homeScore[i] > 0) {
                goalsConceded += homeScore[i];
            }
        }else{}
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
    document.getElementById("totalGoal").innerHTML = totalGoals;
    document.getElementById("goalPerMatch").innerHTML = avg.toFixed(0);
    document.getElementById("cleanSheets").innerHTML = cleanSheets;
    document.getElementById("goalsConc").innerHTML = goalsConceded;

    //print(teams[0]);

}

createUI();

function createUI() {
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

    //Create table tags
    for (var col = 0; col < matchDay.length; col++) {

        var tr = document.createElement('tr'),
            th, result, state, hTeam, aTeam, score, spanWin, spanLoss;

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
        spanLoss.className = "loss glyphicon glyphicon-flag";

        // Append new elements and pust to document
        for (result = 0; result < matchDay.length; result++) {
            tr.appendChild(th);
            tr.appendChild(hTeam);
            tr.appendChild(aTeam);
            tr.appendChild(state);
            tr.appendChild(score);


            th.innerHTML = matchDay[col];
            hTeam.innerHTML = homeTeam[col];
            aTeam.innerHTML = awayTeam[col];
            state.innerHTML = state[col];


            //show results
            if (homeScore[col] > awayScore[col]) {
                showWin();
                showResult();
                score.innerHTML = homeScore[col] + " : " + awayScore[col];
            }
            else if (homeScore[col] < awayScore[col]) {
                showLosser();
                showResult();
                score.innerHTML = homeScore[col] + " : " + awayScore[col];
            }
            else if (homeScore[col] == awayScore[col]) {
                showDraw();
                showResult();
                score.innerHTML = homeScore[col] + " : " + awayScore[col];
            }
            else {
                score.innerHTML = homeScore[col] + " : " + awayScore[col];
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
    }
}




// Get number of games played per team home and away
