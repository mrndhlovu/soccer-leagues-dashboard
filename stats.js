/*global$*/
function setUpApp() {

    //Log to console function
    function print(data) {
        console.log(data);
    }

    var apiLinks = ["https://api.football-data.org/v2/competitions/PL/matches?matchday=", "https://api.football-data.org/v2/competitions/PL/matches"];

    var apiAuthorization = { 'X-Auth-Token': '5d791d1818c3415d9b1a4b323c899bf4' };
    var dayInput = 1;


    $.ajax({
        headers: apiAuthorization,
        url: apiLinks[1],
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {

        // do something with the response, e.g. isolate the id of a linked resource   
        var data = response.matches;

        // empty arrays
        var awayScore = [];
        var homeScore = [];
        var awayTeam = [];
        var homeTeam = [];
        var matchDay = [];
        var status = [];
        var toPlay = " - ";
        var teams = [];
        
        
        // Filter teams array and remove dublicates
        



        //Loop through object arrays and filter data using push to empty arrays
        Object.keys(data).forEach(function(key) {

            matchDay.push(data[key].matchday);

            homeTeam.push(data[key].homeTeam.name);
            teams.push(data[key].homeTeam.name);

            awayTeam.push(data[key].awayTeam.name);
            teams.push(data[key].awayTeam.name);

            status.push(data[key].status);


            //Populate home and away score arrays
            if (data[key].status !== "SCHEDULED") {
                awayScore.push(data[key].score.fullTime.awayTeam);
                homeScore.push(data[key].score.fullTime.homeTeam);
            }
            else {}
            if (data[key].status == "SCHEDULED") {
                homeScore.push(toPlay);
                awayScore.push(toPlay);
            }
            else {}

        });

        
        function removeDuplicates(teams) {
            var uniqueTeams = [];
            for (let i = 0; i < teams.length; i++) {
                if (uniqueTeams.indexOf(teams[i]) == -1) {
                    uniqueTeams.push(teams[i])
                }
            }
            return uniqueTeams;
        }

       teams = removeDuplicates(teams);

        print(teams);


        print(data[0]);

        // Fill option seletor with teams
        var select = document.createElement("select"),
            option, day, dayOption;

        select.id = "teamList";
        select.name = "teams";

        day = document.createElement("select");
        day.id = "dayOfMatch";
        day.name = "day";

        for (var i = 0; i < teams.length; i++) {

            option = document.createElement("option");
            option.value = "Select Team";
            option.id = "team" + (i + 1);

            dayOption = document.createElement("option");
            dayOption.id = "day" + (i + 1);
            dayOption.value = "day" + (i + 1);


            teams.sort();
            //matchDay.sort();

            select.appendChild(option);
            day.appendChild(dayOption);

            option.innerHTML = teams[i];
            dayOption.innerHTML = dayInput.value;

            select.appendChild(option);
            day.appendChild(dayOption);
        }
        document.getElementById("formSelect").appendChild(select);

        //Create table tags
        for (var col = 0; col < matchDay.length; col++) {

            var tr = document.createElement('tr'),
                th, tr, td, result, state, hTeam, aTeam, score, spanWin, spanLoss;

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
                state.innerHTML = status[col];


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


        //Apply css to winner colomn 
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
            state.style.textAlign = "center"
            th.style.textAlign = "center"
            hTeam.style.textAlign = "center";
            aTeam.style.textAlign = "center";
        }

        


        // Get number of games played per team
        function playedGames() {
            Object.keys(teams).forEach(function(key) {



            })
        };

    });

}



window.onload = function() {
    setUpApp();
}
