var getData = "https://api.got.show/api/characters/";

function getDataFromAPI(callBack) {
    var getApiData = new XMLHttpRequest();

    getApiData.open("GET", getData);
    getApiData.send();

    getApiData.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callBack(JSON.parse(this.responseText));
        }
    };
}
//Log to console function
function print(data) {
    console.log(data);
}

//Api object variables
var characters = [];
var house = [];
var gender = [];
var book = [];
var clear = " ";


// Get data and push to empty arrays
function useApiData(data) {



    // Iterate though api array and fill empty arrays
    data.forEach(function(item, index, array) {

        characters.push(item.name);
        // document.getElementById("data").innerHTML = characters;

        house.push(item.house);
        //document.getElementById("data").innerHTML = house;

        var sex = item.male
        if (sex === true) {
            sex = "Male";
            gender.push(sex);
        }
        else if (sex === false) {
            sex = "Female";
            gender.push(sex);
        }
        else {
            sex = "Not Specified";
            gender.push(sex);
        }
        //document.getElementById("data").innerHTML = gender;

        book.push(item.books);
        //document.getElementById("data").innerHTML = book;


    });
}

// Write to document
function showNames() {
    //
    document.getElementById("infoBox").innerHTML = characters;
}

function showHouse() {
    //
    document.getElementById("data").innerHTML = house;
}

function showGender() {
    //
    document.getElementById("data").innerHTML = gender;
}

function showBook() {
    //
    document.getElementById("data").innerHTML = book;
}

function clearData() {
    document.getElementById("data", "infoBox").innerHTML = clear;
};

getDataFromAPI(function(data) {
    useApiData(data);
});
