// this group of variables/functions displays the corresponding column on mobile displays when selected in the "Select Team To Display" dropdown 
let columns = document.getElementsByClassName('column');
let selectDisplayTeam = document.getElementsByTagName('select');
selectDisplayTeam = selectDisplayTeam[2];
selectDisplayTeam.addEventListener('change', displayTeam);

//this function assigns classes to all the table columns to display only one on the screen based on the selected team
function hideUnhide(number) {
    for (let i = 0; i < 11; i++) {
        columns[i].setAttribute('class', 'column hiddenColumn');
    };
    columns[number].setAttribute('class', 'column');
};

function displayTeam() {
    switch (selectDisplayTeam.value) {
        case 'team-1':
            hideUnhide(1);
            break;
        case 'team-2':
            hideUnhide(2);
            break;
        case 'team-3':
            hideUnhide(3);
            break;
        case 'team-4':
            hideUnhide(4);
            break;
        case 'team-5':
            hideUnhide(5);
            break;
        case 'team-6':
            hideUnhide(6);
            break;
        case 'team-7':
            hideUnhide(7);
            break;
        case 'team-8':
            hideUnhide(8);
            break;
        case 'team-9':
            hideUnhide(9);
            break;
        case 'team-10':
            hideUnhide(10);
            break;
    };
};
// this ends the function group for displaying a single column in mobile layouts

// this section is used for getting player stats from the API and display them in the ul
let lastName = document.getElementById('lastName');
let playerArray = []; // this is used to store the json data we get from a player search

// in the below node list, the search button is 0, the enter keeper button is 1 and the draft player button is 2
let buttons = document.querySelectorAll('button');
buttons[0].addEventListener('click', whenClicked);
function whenClicked () {
    console.log(lastName.value);
};
//next section is for the player search section - this sends a request to MLB.com and returns basic info about all
//the players that have the last name searched for and stores them as an array
let last = '';
let getData = new XMLHttpRequest;
let jsonData = [];

function getPlayer () {
    removePlayerList();
    last = lastName.value;
    getData.open('GET', `https://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'&active_sw='Y'&name_part='${last}%25'`, true)
    getData.onload = function() {
        if (this.status === 200) {
            jsonData.push(JSON.parse(this.responseText));
            displayPlayers();
        };
    };
    getData.send();
};

//this function displays the player names when players are searched for
function displayPlayers() {
    let name;
    let team;
    let position;
    let playerId;
    let arrayLength;
    let createEl;
    let createText;
    if (jsonData[0].search_player_all.queryResults.totalSize === '1') {
        name = jsonData[0].search_player_all.queryResults.row.name_display_first_last;
        position = jsonData[0].search_player_all.queryResults.row.position;
        team = jsonData[0].search_player_all.queryResults.row.team_abbrev;
        playerId = jsonData[0].search_player_all.queryResults.row.player_id;
        createEl = document.createElement('li');
        createEl.setAttribute('id', playerId);
        createEl.setAttribute('class', position);
        createText = document.createTextNode(`${name} - ${position} - ${team}`);
        createEl.appendChild(createText);
        playerParent.appendChild(createEl);
        jsonData = [];
    } else {
        arrayLength = jsonData[0].search_player_all.queryResults.totalSize;
        arrayLength = parseInt(arrayLength);
        for (let i = 0; i < arrayLength; i++) {
            name = jsonData[0].search_player_all.queryResults.row[i].name_display_first_last;
            position = jsonData[0].search_player_all.queryResults.row[i].position;
            team = jsonData[0].search_player_all.queryResults.row[i].team_abbrev;
            playerId = jsonData[0].search_player_all.queryResults.row[i].player_id;
            createEl = document.createElement('li');
            createEl.setAttribute('id', playerId);
            createEl.setAttribute('class', position);
            createText = document.createTextNode(`${name} - ${position} - ${team}`);
            createEl.appendChild(createText);
            playerParent.appendChild(createEl);
        };  jsonData = [];
    };
};

let button = document.getElementById('playerSearch');
button.addEventListener('click', getPlayer);

//this function removes all the li's displaying players if a new last name is searched for
let playerParent = document.getElementById('playerList');

function removePlayerList () {
    while (playerParent.firstChild) {
        playerParent.removeChild(playerParent.firstChild);
    };
};




