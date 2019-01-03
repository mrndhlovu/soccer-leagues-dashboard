function setUpApp() {
    //Log to console function
    function print(data) {
        console.log(data);
    }

    var apiRequestURL = "https://api.football-data.org/v2/competitions/PL/matches";
    var apiAuthorization = { 'X-Auth-Token': '5d791d1818c3415d9b1a4b323c899bf4' };

    $.ajax({
        headers: apiAuthorization,
        url: apiRequestURL,
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
        //Loop through object arrays and filter data using push to empty arrays
        Object.keys(match).forEach(function(key) {

            matchDay.push(match[key].matchday);
            homeTeam.push(match[key].homeTeam.name);
            awayTeam.push(match[key].awayTeam.name);
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

        //print(match); to see data on console
        for (var col = 0; col < matchDay.length; col++) {

            var tr = document.createElement('tr'),
                th, tr, td, result, state, hTeam, aTeam, score, spanWin, spanLoss;

            //create elements
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
            spanWin.className = "win glyphicon glyphicon-ok";
            spanLoss = document.createElement("span");
            spanLoss.className = "loss glyphicon glyphicon-remove";

            //append new elements and pust to document
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
                    showResult();
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }
                else {
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }

            }
            document.getElementById('tableStriped').appendChild(tr);

        }


        //apply css to winner colomn 

        function showWin() {
            aTeam.appendChild(spanLoss);
            hTeam.appendChild(spanWin);
            spanWin.style.color = "green";
            spanLoss.style.color = "red";
            
        }

        function showLosser() {
            aTeam.appendChild(spanWin);
            hTeam.appendChild(spanLoss);
            spanLoss.style.color = "red";
            spanWin.style.color = "green";
            
            
        }

        function showResult() {
            score.style.textAlign = "center";
            score.style.fontSize = "1.5em";
            state.style.textAlign = "center"
            th.style.textAlign = "center"
            
        }



    });

}

window.onload = function() {
    setUpApp();
}
