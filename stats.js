function setUpApp() {

    //Log to console function
    function print(data) {
        console.log(data);
    }

    var apiRequestURL = "https://api.football-data.org/v2/competitions/PL/matches?matchday=";
    var day = 22;
    var apiAuthorization = { 'X-Auth-Token': '5d791d1818c3415d9b1a4b323c899bf4' };

    $.ajax({
        headers: apiAuthorization,
        url: apiRequestURL + day,
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {

        // do something with the response, e.g. isolate the id of a linked resource   
        var data = response;
        var match = data.matches;


        // empty arrays
        var awayScore = [];
        var homeScore = [];
        var awayTeam = [];
        var homeTeam = [];
        var matchDay = [];
        var status = [];
        var toPlay = " - ";
        const teams = [];

        //Loop through object arrays and filter data using push to empty arrays
        Object.keys(match).forEach(function(key) {

            matchDay.push(match[key].matchday);

            homeTeam.push(match[key].homeTeam.name);
            teams.push(match[key].homeTeam.name);

            awayTeam.push(match[key].awayTeam.name);
            teams.push(match[key].awayTeam.name);

            status.push(match[key].status);


            //Populate home and away score arrays
            if (match[key].status !== "SCHEDULED") {
                awayScore.push(match[key].score.fullTime.awayTeam);
                homeScore.push(match[key].score.fullTime.homeTeam);
            }
            else {}
            if (match[key].status == "SCHEDULED") {
                homeScore.push(toPlay);
                awayScore.push(toPlay);
            }
            else {}

        });

        // Fill option seletor with teams
        var select = document.createElement("select"),
            option, br, input;

        select.id = "teamList";
        select.name = "teams";
        br = document.createElement("br");
        input = document.createElement("input");
        input.type = "submit";

        for (var i = 0; i < teams.length; i++) {

            option = document.createElement("option");
            option.id = "team" + i;
            option.value = teams[i];
            option.id = "team" + ( i + 1);
            teams.sort();
            select.appendChild(option);
            option.innerHTML = teams[i];
            select.appendChild(option);
        }
        document.getElementById("formSelect").appendChild(select);
        document.getElementById("formSelect").appendChild(br);
        document.getElementById("formSelect").appendChild(input);
        
         

        //Create elements
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



    });

}

window.onload = function() {
    setUpApp();
}
