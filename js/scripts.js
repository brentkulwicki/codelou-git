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


