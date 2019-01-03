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
                th, tr, td, match, state, hTeam, aTeam, score;

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

            //append new elements and pust to document
            for (match = 0; match < matchDay.length; match++) {
                tr.appendChild(th);
                tr.appendChild(hTeam);
                tr.appendChild(aTeam);
                tr.appendChild(state);
                tr.appendChild(score);


                th.innerHTML = matchDay[col];

                hTeam.innerHTML = homeTeam[col];
                aTeam.innerHTML = awayTeam[col];
                state.innerHTML = status[col];
                if (homeScore[match] > awayScore[match]) {
                    homeWin();
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }
                else if (homeScore[col] < awayScore[col]) {
                    awayWin();
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }
                else if (homeScore[col] == awayScore[col]) {
                    draw();
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }
                else {
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }

            }
            document.getElementById('tableStriped').appendChild(tr);

        }


        //apply css to winner colomn 
        function homeWin() {
            score.style.color = "green";
            score.style.textAlign = "center";
            score.style.fontSize = "1.5em";
            hTeam.style.radius = "90deg";
            hTeam.style.textAlign = "center";
            hTeam.style.color = "green";
            aTeam.style.color = "red";
            aTeam.style.textAlign = "center";
            state.style.textAlign = "center";
            th.style.textAlign = "center";

        }

        function awayWin() {
            score.style.color = "red";
            score.style.textAlign = "center";
            score.style.fontSize = "1.5em";
            aTeam.style.color = "green";
            hTeam.style.color = "red";
            
        }

        function draw() {
            score.style.color = "blue";
            score.style.textAlign = "center";
            score.style.fontSize = "1.5em";
        }

    });

}

window.onload = function() {
    setUpApp();
}
