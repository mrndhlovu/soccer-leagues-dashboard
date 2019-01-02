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
    var awayTeam = [];
    var homeTeam = [];
    var matchDay = [];
    var awayScore = [];
    var homeScore = [];
    var status = [];



    print(match[0].status);
    //Loop through object arrays and filter data using push to empty arrays
    Object.keys(match).forEach(function(key) {

        matchDay.push(match[key].matchday);

        awayTeam.push(match[key].awayTeam.name);
        status.push(match[key].status);


        //Populate home and away score arrays
        if (match[key].score) {
            awayScore.push(match[key].score.fullTime.awayTeam);
        }
        else {
            homeScore.push(match[key].score.fullTime.homeTeam);
        }



    });

    for (var i = 0 ; i < matchDay.length; i++) {

        var x = document.createElement("tr");
        var y = document.createElement("th");
        var z = document.createElement("div");
        x.appendChild(y);
        
        
        document.getElementsByClassName('table-striped').appendChild(x).appendChild(y).innerHTML = i
        print(matchDay[i]);
    }




















});
