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

        //Loop through object arrays and filter data using push to empty arrays
        Object.keys(match).forEach(function(key) {

            matchDay.push(match[key].matchday);
            homeTeam.push(match[key].homeTeam.name);
            awayTeam.push(match[key].awayTeam.name);
            status.push(match[key].status);


            //Populate home and away score arrays
            if (match[key].score.fullTime.awayTeam) {
                awayScore.push(match[key].score.fullTime.awayTeam);
            }
            else if (match[key].score.fullTime.homeTeam) {
                homeScore.push(match[key].score.fullTime.homeTeam);
            }
            else {
                return "error";
            }
        
        });
        //display winner : green if win, red if loss  and blue if draw
        function showWinner() {

        }

        for (var col = 0; col < matchDay.length; col++) {

            var tr = document.createElement('tr'),
                th, tr, td, match, s, hTeam, aTeam, score;

            //create elements
            th = document.createElement('th');
            th.scope = "row";
            s = document.createElement('td');
            hTeam = document.createElement('td');
            aTeam = document.createElement('td');
            score = document.createElement('td');
            score.className = "score";

            //append new elements and pust to document
            for (match = 0; match < matchDay.length; match++) {
                tr.appendChild(th);
                tr.appendChild(s);
                tr.appendChild(hTeam);
                tr.appendChild(aTeam);
                tr.appendChild(score);


                th.innerHTML = matchDay[col];
                s.innerHTML = status[col];
                hTeam.innerHTML = homeTeam[col];
                aTeam.innerHTML = awayTeam[col];
                score.innerHTML = status[col];
                if (homeScore[match] > awayScore[match]) {
                    winner();
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }
                else if (homeScore[col] < awayScore[col]) {
                    loss();
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }
                else {
                    score.innerHTML = homeScore[col] + " : " + awayScore[col];
                }

            }
            document.getElementById('tableStriped').appendChild(tr);
            
        }


        //display winner : green if home win, red if away win
        function winner() {
            score.style.color = "green";
        }

        function loss() {
            score.style.color = "red";
        }
    
    });
    
}

window.onload = function() {
    setUpApp();
}
