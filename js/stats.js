//Log to console function
function p(data) {
    console.log(data);
}
var standingsURL = 'https://api.football-data.org/v2/competitions/2021/standings';
var scorersURL = 'https://api.football-data.org/v2/competitions/PL/scorers';

var season = 'https://api.football-data.org/v2/competitions/PL/matches';
var key = { 'X-Auth-Token': '5d791d1818c3415d9b1a4b323c899bf4' };

function ajaxGet(queryURL) {
    var data = $.ajax({
        headers: key,
        url: queryURL,
        dataType: 'json',
        type: 'GET',
        async: false,
    }).done(function(response) {

    }).responseJSON;
    return data;
}

var data = ajaxGet(season).matches;
var playerScorers = ajaxGet(scorersURL).scorers;
var stand = ajaxGet(standingsURL).standings[0].table;


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
    getTeamGames(choice);
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
            //tr.appendChild(date);

            // Use data to build table
            hTeam.innerHTML = homeTeam[d];
            state.innerHTML = data[d].status + "<br>" + gameDate.toDateString();
            aTeam.innerHTML = awayTeam[d];


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



function loadDefaultStats() {
    var statsDefault = teams[0];
    getStats(statsDefault);
}



document.getElementById('userInput').addEventListener('onclick', tableTeamOnClick);

function tableTeamOnClick(team) {
    getTeamGames();
    getStats(team)
    showTeamGames(team);

}

teamClick = tableTeamOnClick;

function getTeamGames(teamClick) {
    var oldData = document.getElementById('gameStriped');
    while (oldData.firstChild) {
        oldData.removeChild(oldData.firstChild);
    }
    showTeamGames(teamClick);
}

window.onload = function() {
    loadDefaultStats();
}

p(stand);

var w = 500;
var h = 200;
var mydata = [];
for (var i = 0; i < stand.length; i++) {

    //Create SVG element

    mydata.push(stand[i].points);

}

function graphTeamsPosVsLoss() {
    var ndx = crossfilter(stand);
    var name_dim = ndx.dimension(dc.pluck('position'));
    var total_spend_per_team = name_dim.group().reduceSum(dc.pluck('lost'));
    dc.barChart('#lostGamesChart')
        .width(350)
        .height(250)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(name_dim)
        .group(total_spend_per_team)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Position")
        .yAxisLabel("Games Lost")
        .yAxis().ticks(10);

    dc.renderAll();
}

graphTeamsPosVsLoss();

function graphTeamWin() {
    var ndx = crossfilter(stand);
    var position_dim = ndx.dimension(dc.pluck('position'));
    var loss_per_team = position_dim.group().reduceSum(dc.pluck('won'));
    dc.barChart('#wonGamesChart')
        .width(350)
        .height(250)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(position_dim)
        .group(loss_per_team)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Position")
        .yAxisLabel("Games Won")
        .yAxis().ticks(10);

    dc.renderAll();
}
graphTeamWin() ;

function graphGoalsScored() {
    var ndx = crossfilter(stand);
    var position_dim = ndx.dimension(dc.pluck('position'));
    var loss_per_team = position_dim.group().reduceSum(dc.pluck('goalsFor'));
    dc.barChart('#goalsScoredPie')
        .width(350)
        .height(250)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(position_dim)
        .group(loss_per_team)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Position")
        .yAxisLabel("Games Won")
        .yAxis().ticks(10);

    dc.renderAll();
}
graphGoalsScored() ;

function graphGoalsConced() {
    var ndx = crossfilter(stand);
    var position_dim = ndx.dimension(dc.pluck('position'));
    var loss_per_team = position_dim.group().reduceSum(dc.pluck('goalsAgainst'));
    dc.barChart('#goalsConcededPie')
        .width(350)
        .height(250)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(position_dim)
        .group(loss_per_team)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Position")
        .yAxisLabel("Games Won")
        .yAxis().ticks(10);

    dc.renderAll();
}
graphGoalsConced() ;

/*......................make pie charts...........................................*/
// margin
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    radius = width/2;

// color range
var color = d3.scaleOrdinal()
    .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"]);

// pie chart arc. Need to create arcs before generating pie
var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

// donut chart arc
var arc2 = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

// arc for the labels position
var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

// generate pie chart and donut chart
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.count; });

// define the svg for pie chart
var svg = d3.select("#goalsConcededPie").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// define the svg donut chart
var svg2 = d3.select("goalsConcededPie").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// import data 
d3.csv("data.csv", function(error, data) {
  if (error) throw error;
    
    // parse data
    data.forEach(function(d) {
        d.count = +d.count;
        d.fruit = d.fruit;
    })

  // "g element is a container used to group other SVG elements"
  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  // append path 
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.fruit); })
    // transition 
    .transition()
      .ease(d3.easeLinear)
      .duration(2000)
      .attrTween("d", tweenPie);
        
  // append text
  g.append("text")
    .transition()
      .ease(d3.easeLinear)
      .duration(2000)
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.fruit; });
    

    // "g element is a container used to group other SVG elements"
  var g2 = svg2.selectAll(".arc2")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc2");

   // append path 
  g2.append("path")
      .attr("d", arc2)
      .style("fill", function(d) { return color(d.data.fruit); })
    .transition()
      .ease(d3.easeLinear)
      .duration(2000)
      .attrTween("d", tweenDonut);
        
   // append text
  g2.append("text")
    .transition()
      .ease(d3.easeLinear)
      .duration(2000)
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.fruit; });
    
});

// Helper function for animation of pie chart and donut chart
function tweenPie(b) {
  b.innerRadius = 0;
  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
  return function(t) { return arc(i(t)); };
}

function tweenDonut(b) {
  b.innerRadius = 0;
  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
  return function(t) { return arc2(i(t)); };
}