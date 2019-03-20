// this group of variables/functions displays the corresponding column on mobile displays when selected in the "Select Team To Display" dropdown 
let columns = document.getElementsByClassName('column');
let selectDisplayTeam = document.getElementsByTagName('select');
selectDisplayTeam = selectDisplayTeam[2];
selectDisplayTeam.addEventListener('change', displayTeamDraft);

//this function assigns classes to all the table columns to display only one on the screen based on the selected team
function hideUnhide(number) {
    for (let i = 0; i < 11; i++) {
        columns[i].setAttribute('class', 'column hiddenColumn');
    };
    columns[number].setAttribute('class', 'column');
};

function displayTeamDraft() {
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
////////////////// buttons[0].addEventListener('click', whenClicked); commenting these few lines out because I don't think they're necessary
// function whenClicked () {
//     console.log(lastName.value);
// };
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

//this is listening for which li is clicked on to select the player in that li
playerParent.addEventListener('click', function(event) {
    playerId = event.target.id;
    let playerPosition = event.target.className;
    let playerInformation = event.target.innerHTML;
    displayPlayerInfo(playerInformation);
    getPlayerStats(playerId, playerPosition);
});

function getPlayerStats (id, position) {
    if (position === 'P') {
        getPitchingStats(id);
    } else {
        getHittingStats(id);
    };
};
//These two function pull the hitting and pitching data from MLB's website
function getHittingStats(id) {
    jsonHittingStats = [];
    let idNumber = id;
    getData.open('GET', `https://lookup-service-prod.mlb.com/json/named.sport_hitting_tm.bam?league_list_id='mlb'&game_type='R'&season='2018'&player_id='${idNumber}'`, true)
    getData.onload = function() {
        if (this.status === 200) {
            jsonHittingStats.push(JSON.parse(this.responseText));
            //can console.log the jsonHittingStats here if I need to see the json response again
            displayHittingStats();
        };
    };
    getData.send();
};
function getPitchingStats(id) {
    jsonPitchingStats = [];
    let idNumber = id;
    getData.open('GET', `http://lookup-service-prod.mlb.com/json/named.sport_pitching_tm.bam?league_list_id='mlb'&game_type='R'&season='2018'&player_id='${idNumber}'`, true)
    getData.onload = function() {
        if (this.status === 200) {
            jsonPitchingStats.push(JSON.parse(this.responseText));
            //can console.log the jsonPitchingStats here if I need to see the json response again
            displayPitcherStats();
        };
    };
    getData.send();
};
// this function grabs the player data being displayed in the playersearch section and puts it at the tope of the page
function displayPlayerInfo (playerTeamPosition) {
    let draftPlayerName = document.getElementById('displayName');
    draftPlayerName.innerHTML = playerTeamPosition;
};

//This is the group of variables needed to keep the stats info
let jsonHittingStats = []; //this is used to store the json for hitters
let jsonPitchingStats = [];//this is used to store the json for pitchers
let gs = document.getElementById('gs');
let runs = document.getElementById('runs');
let hr = document.getElementById('hr');
let rbi = document.getElementById('rbi');
let sb = document.getElementById('sb');
let obp = document.getElementById('obp');
let slg = document.getElementById('slg');
let innings = document.getElementById('innings');
let qs = document.getElementById('qs');
let sv = document.getElementById('sv');
let era = document.getElementById('era');
let whip = document.getElementById('whip');
let kbb = document.getElementById('kbb');
let displayName = document.getElementById('displayName');
let displayTeam = document.getElementById('displayTeam');
let draftButton = document.getElementById('draftButton');
let draftedPlayers = [];//this keeps the players that have already been drafted in an array so 
//they can't be drafted a 2nd time
let playerId;
let draftedPlayerCells = document.getElementsByTagName('td');//this is the node list of all the draft cells to loop through

//this function checks the draftedPlayers array to see if a player is on that list and disables the draft button if they are
function checkDraftedPlayers() {
    if (draftedPlayers.length < 1) {
        draftButton.setAttribute('class', 'active');
        buttons[2].setAttribute('class', 'active');
    } else {
        for (let i = 0; i < draftedPlayers.length; i++) {
            if (playerId === draftedPlayers[i]) {
                draftButton.setAttribute('class', 'disabled');
                buttons[2].setAttribute('class', 'disabled');
                break;
            } else {
                draftButton.setAttribute('class', 'active');
                buttons[2].setAttribute('class', 'active');
            };
        };
    };
};

//this group is what actually grabs the stats info and displays it on the page
function displayHittingStats() {
    checkDraftedPlayers();
    let obpCalc;
    let slgCalc;
    if (jsonHittingStats[0].sport_hitting_tm.queryResults.row.length > 1) {
        let length = jsonHittingStats[0].sport_hitting_tm.queryResults.row.length;
        let games = 0;
        let runsScored = 0;
        let homeruns = 0;
        let runsBattedIn = 0;
        let stolenBases = 0;
        let onBasePerc = 0;
        let sluggingPerc = 0;
        for (let i = 0; i < length; i++) {
            let gamesPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].g;
            let runsPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].r;
            let homerunsPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].hr;
            let rbiPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].rbi;
            let sbPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].sb;
            let obpPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].obp;
            let slgPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].slg;
            gamesPlaceholder = parseInt(gamesPlaceholder);
            runsPlaceholder = parseInt(runsPlaceholder);
            homerunsPlaceholder = parseInt(homerunsPlaceholder);
            rbiPlaceholder = parseInt(rbiPlaceholder);
            sbPlaceholder = parseInt(sbPlaceholder);
            obpPlaceholder = parseFloat(obpPlaceholder);
            obpPlaceholder = obpPlaceholder * gamesPlaceholder;
            slgPlaceholder = parseFloat(slgPlaceholder);
            slgPlaceholder = slgPlaceholder * gamesPlaceholder;
            games = games + gamesPlaceholder;
            runsScored = runsScored + rbiPlaceholder;
            homeruns = homeruns + homerunsPlaceholder;
            runsBattedIn = runsBattedIn + rbiPlaceholder;
            stolenBases = stolenBases + sbPlaceholder;
            onBasePerc = onBasePerc + obpPlaceholder;
            sluggingPerc = sluggingPerc + slgPlaceholder;
        }
        innings.innerHTML = '-';
        qs.innerHTML = '-';
        sv.innerHTML = '-';
        era.innerHTML = '-';
        whip.innerHTML = '-';
        kbb.innerHTML = '-';
        gs.innerHTML = games;
        runs.innerHTML = runsScored;
        hr.innerHTML = homeruns;
        rbi.innerHTML = runsBattedIn;
        sb.innerHTML = stolenBases;
        obpCalc = (onBasePerc/games)
        obp.innerHTML = obpCalc.toFixed(3);
        slgCalc = (sluggingPerc/games);
        slg.innerHTML = slgCalc.toFixed(3);
        let displayBatter = document.getElementById('batter-stats');
        displayBatter.removeAttribute('class', 'hidden');
        let hidePlaceholder = document.getElementById('placeholder');
        hidePlaceholder.setAttribute('class', 'statBox hidden');
        let hidePitcher = document.getElementById('pitcher-stats');
        hidePitcher.setAttribute('class', 'statBox hidden');
    } else {
        innings.innerHTML = '-';
        qs.innerHTML = '-';
        sv.innerHTML = '-';
        era.innerHTML = '-';
        whip.innerHTML = '-';
        kbb.innerHTML = '-';
        gs.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.g;
        runs.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.r;
        hr.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.hr;
        rbi.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.rbi;
        sb.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.sb;
        obp.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.obp;
        slg.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.slg;
        let displayBatter = document.getElementById('batter-stats');
        displayBatter.removeAttribute('class', 'hidden');
        let hidePlaceholder = document.getElementById('placeholder');
        hidePlaceholder.setAttribute('class', 'statBox hidden');
        let hidePitcher = document.getElementById('pitcher-stats');
        hidePitcher.setAttribute('class', 'statBox hidden');
    };
};
function displayPitcherStats() {
    checkDraftedPlayers();
    if (jsonPitchingStats[0].sport_pitching_tm.queryResults.row.length > 1) {
        let length = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.length;
        let games = 0;
        let inningsPitched = 0;
        let qualityStart = 0;
        let saves = 0;
        let earnedRunAvg = 0;
        let walksHitsIP = 0;
        let kbbTotal = 0;
        let eraCalc = 0;
        let whipCalc = 0;
        for (let i = 0; i < length; i++) {
            let gamesPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].g;
            let ipPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].ip;
            let qsPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].qs;
            let savesPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].sv;
            let eraPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].era;
            let whipPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].whip;
            let kbbPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].kbb;
            gamesPlaceholder = parseInt(gamesPlaceholder);
            ipPlaceholder = parseFloat(ipPlaceholder);
            qsPlaceholder = parseInt(qsPlaceholder);
            savesPlaceholder = parseInt(savesPlaceholder);
            eraPlaceholder = parseFloat(eraPlaceholder);
            eraPlaceholder = eraPlaceholder * ipPlaceholder;
            whipPlaceholder = parseFloat(whipPlaceholder);
            whipPlaceholder = whipPlaceholder * ipPlaceholder;
            kbbPlaceholder = parseFloat(kbbPlaceholder);
            kbbPlaceholder = kbbPlaceholder * ipPlaceholder;
            games = games + gamesPlaceholder;
            inningsPitched = inningsPitched + ipPlaceholder;
            qualityStart = qualityStart + qsPlaceholder;
            saves = saves + savesPlaceholder;
            earnedRunAvg = earnedRunAvg + eraPlaceholder;
            walksHitsIP = walksHitsIP + whipPlaceholder;
            kbbTotal = kbbTotal + kbbPlaceholder;
        }
        runs.innerHTML = '-';
        hr.innerHTML = '-';
        rbi.innerHTML = '-';
        sb.innerHTML = '-';
        obp.innerHTML = '-';
        slg.innerHTML = '-';
        gs.innerHTML = games;
        let inningsRemainder = calcInnings(inningsPitched);
        innings.innerHTML = Math.floor(inningsPitched) + inningsRemainder;
        qs.innerHTML = qualityStart;
        sv.innerHTML = saves;
        eraCalc = (earnedRunAvg/(Math.floor(inningsPitched) + inningsRemainder));
        eraCalc = eraCalc.toFixed(2);
        era.innerHTML = eraCalc;
        whipCalc = (walksHitsIP/(Math.floor(inningsPitched) + inningsRemainder));
        whipCalc = whipCalc.toFixed(2);
        whip.innerHTML = whipCalc;
        kbbTotal = (kbbTotal/(Math.floor(inningsPitched) + inningsRemainder));
        kbbTotal = kbbTotal.toFixed(2);
        kbb.innerHTML = kbbTotal;
        let displayHitter = document.getElementById('pitcher-stats');
        displayHitter.removeAttribute('class', 'hidden');
        let hidePlaceholder = document.getElementById('placeholder');
        hidePlaceholder.setAttribute('class', 'statBox hidden');
        let hideHitter = document.getElementById('batter-stats');
        hideHitter.setAttribute('class', 'statBox hidden');
    } else {
        runs.innerHTML = '-';
        hr.innerHTML = '-';
        rbi.innerHTML = '-';
        sb.innerHTML = '-';
        obp.innerHTML = '-';
        slg.innerHTML = '-';
        gs.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.g;
        innings.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.ip;
        qs.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.qs;
        sv.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.sv;
        era.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.era;
        whip.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.whip;
        kbb.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.kbb;
        let displayHitter = document.getElementById('pitcher-stats');
        displayHitter.removeAttribute('class', 'hidden');
        let hidePlaceholder = document.getElementById('placeholder');
        hidePlaceholder.setAttribute('class', 'statBox hidden');
        let hideHitter = document.getElementById('batter-stats');
        hideHitter.setAttribute('class', 'statBox hidden');
    };
};
function calcInnings(innings) {
    let ipRemainder = innings % 1;
    //for .9 innings
    if (ipRemainder > 0.81) {
        return 3.0;
    // for .8 innings
    } else if (ipRemainder > 0.7) {
        return 2.2;
    // for .7 innings
    } else if (ipRemainder > 0.61) {
        return 2.1;
    // for .6 innings
    } else if (ipRemainder > 0.5) {
        return 2.0;
    // for .5 innings
    } else if (ipRemainder > 0.4) {
        return 1.2;
    // for .4 innings
    } else if (ipRemainder > 0.31) {
        return 1.1;
    // for .3 innings
    } else if (ipRemainder > 0.2) {
        return 1.0; 
    // for .2 innings
    } else if (ipRemainder > 0.11) {
        return 0.2;
    // for .1 innings
    } else if (ipRemainder > 0) {
        return 0.1;
    } else {
        return 0.0;
    };
};

//this section is for drafting the players and inserting them into the dom
let roundCounter = 1;

function draftPlayer () {
    let keepersHidden = document.querySelector('#enterKeepers');
    let selectedPlayer = document.getElementById('displayName').innerHTML;
    let teams = document.querySelectorAll('tbody.team');
    let teamArray = Array.from(teams);
    let isActive = draftButton.className;
    if (isActive === 'active') {
        for (let i = 0; i < teamArray.length; i++) {
            let children = teamArray[i].children;
            children = Array.from(children);
            if (i === 9) {
                if (children[roundCounter].innerText < 3) {
                    children[roundCounter].innerHTML = `<td>${selectedPlayer}</td>`;
                    roundCounter = roundCounter + 1;
                    children[roundCounter].setAttribute('title', selectedPlayer);
                    draftedPlayers.push(playerId);
                    draftButton.setAttribute('class', 'disabled');
                    buttons[2].setAttribute('class', 'disabled');
                    break;
                };
            } else {
                if (children[roundCounter].innerText < 3) {
                    children[roundCounter].innerHTML = `<td>${selectedPlayer}</td>`;
                    children[roundCounter].setAttribute('title', selectedPlayer);
                    draftedPlayers.push(playerId);
                    draftButton.setAttribute('class', 'disabled');
                    if (keepersHidden.className !== 'hidden') {
                        hideKeeperOptions();
                    };
                    break;
            };
        };
    };
    let buttonArray = document.getElementsByTagName('button');
    buttonArray[2].setAttribute('disabled', true);
    } else {
    };
};

draftButton.addEventListener('click', draftPlayer);

// this code is for inputting keepers to a particular team
function inputKeepers() {
    let teamColumns = document.querySelectorAll('tbody.team');
    teamColumns = Array.from(teamColumns);
    let selectRound = document.querySelector('#keeperRoundSelect');
    let roundSelected = selectRound.value;
    roundSelected = parseInt(roundSelected);
    let selectTeam = document.querySelector('#teamColumn');
    switch (selectTeam.value) {
        case 'tm-1':
			findKeeperRound(0, roundSelected, teamColumns);
			break;
		case 'tm-2':
            findKeeperRound(1, roundSelected, teamColumns);
			break;
		case 'tm-3':
            findKeeperRound(2, roundSelected, teamColumns);;
			break;
		case 'tm-4':
            findKeeperRound(3, roundSelected, teamColumns);
            break;
        case 'tm-5':
            findKeeperRound(4, roundSelected, teamColumns);
            break;
        case 'tm-6':
            findKeeperRound(5, roundSelected, teamColumns);
            break;
        case 'tm-7':
            findKeeperRound(6, roundSelected, teamColumns);
            break;
        case 'tm-8':
            findKeeperRound(7, roundSelected, teamColumns);
            break;
        case 'tm-9':
            findKeeperRound(8, roundSelected, teamColumns);
            break;
        case 'tm-10':
            findKeeperRound(9, roundSelected, teamColumns);
            break;
	};
};

//function for inputting the team number and keeper round into the above function for selecting the keeper
function findKeeperRound(team, round, columnsOfTeams) {
    let selectedPlayer = document.getElementById('displayName').innerHTML;
    let teamPicksArray = columnsOfTeams[team].children;
    teamPicksArray = Array.from(teamPicksArray);
    let isActive = draftButton.className;
    if (teamPicksArray[round].innerText.length < 3 && isActive === 'active') {
        teamPicksArray[round].innerHTML = `<td>${selectedPlayer}</td>`;
        teamPicksArray[round].setAttribute('title', selectedPlayer);
        draftButton.setAttribute('class', 'disabled');
        buttons[2].setAttribute('class', 'disabled');
        draftedPlayers.push(playerId);
    } else {
        alert('Player already selected OR team/round selected has already been filled');
    }
};

let keeperButton = document.getElementById('keepPlayers');
keeperButton.addEventListener('click', inputKeepers);

//this function will hide the keeper options once players are starting to be drafted
function hideKeeperOptions() {
    let makeHidden = document.querySelector('#enterKeepers');
    makeHidden.setAttribute('class', 'hidden');
};

