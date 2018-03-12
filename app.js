// establish page elements
const $timecard = $('#timecard');
const $nameplate = $('#nameplate');
const $timer = $('#timer');
const $pausebutton = $('#pausebutton');
const $resetbutton = $('#resetbutton');
const $diceholder = $("#diceholder");
const $diceA = $('#diceA');
const $diceB = $('#diceB');
const $roll = $('#roll');

//establishing global variables and default states
var ongoingTimer = false; // will hold an interval function. in the meantime, set to false to show that the game hasn't started
var overtime = false; // same as above
var timeLeft;
var isPaused;
var currentPlayer = 0;

//class to hold player information
class player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
}

//players will be stored in an array to easily loop through the turn cycle. The order and colors should be set in one of the set-up pages. Dummy variable for now.
const playerSequence = [new player('Orange', "#f47442"), new player('Yellow', "#f4c141"), new player('Blue', "#417cf4"), new player('Green', "#36ba34"),];
const turnLength = 90; //Should be set on one of the set-up pages. Dummy variable for now.

function newTurn() {
	
    isPaused = false;
   	clearAll();
   	nextPlayer();
   	rollDie();
 	startTimer(turnLength);
};

//changes the current player and updates page styles accordingly
function nextPlayer () {
	
	//simple if statement to keep us within the bounds of the existing playerSequence array
	if (currentPlayer + 1 === playerSequence.length) {
    	currentPlayer = 0;
    } else {
    	currentPlayer++;
    };

    //update the name plate above the timer
    $nameplate.empty();
    $nameplate.append(playerSequence[currentPlayer].name +"'s Turn");

    //update the background color of the timer area and the next roll button
    $timecard.css("backgroundColor", playerSequence[currentPlayer].color);
    $roll.css("backgroundColor", playerSequence[(currentPlayer+1) % 4].color);

    //change the text inside the roll button
    $roll.empty();
    $roll.append(playerSequence[(currentPlayer + 1 ) % 4].name + ' Roll');
};

//the main function for starting the timer
function startTimer(duration) {
	var start = Math.round(Date.now() / 1000);
	var OTColor;
	var flashDelay = 1;

   	$pausebutton.html('<i class="material-icons">pause</i>');
   	isPaused = false;

	//flash() causes the timer to flash red when the player is out of time
	//the flashDelay variable is added to give the flash in irregular rhythm 
	function flash () {
		
		if (flashDelay > 8) {
			flashDelay = 1;
		}

		if(OTColor === 'red') {
			$timer.css('color', 'white');
			OTColor = 'white';
		} else if (flashDelay < 5){
			$timer.css('color', 'red');
			OTColor = 'red';
		}

		flashDelay++;
	};

	//simple count-down that will be called through a setInterval() function later.
	function counter() {
		timeLeft = start - (Date.now() / 1000) + duration;
		console.log(timeLeft);
		displayClock(timeLeft);

		if (timeLeft <= 0 && !overtime) {

			overtime = setInterval(flash, 125);

		} 
	};

	counter();
	ongoingTimer = setInterval(counter, 1000);
};

//rollDie generates a new roll and updates the display with light animation
function rollDie () {
	
	//generate each die's value
	var dA = Math.floor(Math.random()*6) + 1;
	var dB = Math.floor(Math.random()*6) + 1;

	//fade out the die, update values	
	$diceholder.fadeOut(300, function(){

		$diceA.empty(); 
		$diceB.empty();

		$diceA.append('<img src="https://raw.githubusercontent.com/austinklemmer/catan-timer/master/dice-0' + dA + '.png"/>');
		$diceB.append('<img src="https://raw.githubusercontent.com/austinklemmer/catan-timer/master/dice-0' + dB + '.png"/>');

	});

	//timeout added to make sure the die have updated before they reappear
	setTimeout(function(){

		$diceholder.fadeIn();

	}, 250);

}

//the play/pause function for the timer
function pause () {
	if (!isPaused && ongoingTimer) {
		clearInterval(ongoingTimer);
   		clearInterval(overtime);
   		overtime = false;
   		isPaused = true;
   		$pausebutton.html('<i class="material-icons">play_arrow</i>');

   } else if (ongoingTimer){
   		startTimer(timeLeft); //to restart, simply call the start time with timeLeft instead of turn length
   		isPaused = false;
   		$pausebutton.html('<i class="material-icons">pause</i>');
   }
}

//reset the timer midturn to the full turn length
function reset () {
	if (ongoingTimer) {
		clearAll();
		startTimer(turnLength);
	}
}

//resets several key variables to avoid issues with pausing, resetting, and starting new timers.
function clearAll() {
	clearInterval(ongoingTimer);
   	clearInterval(overtime);
   	$timer.css('color', '#2f3135');
   	overtime = false;
   	ongoingTimer = false;
}

//updates the time reading on the clock in a traditional clock format.
function displayClock (timeNow) {

	timeNow = Math.abs(timeNow);
	minutes = Math.floor(timeNow / 60);
	seconds = Math.round(timeNow % 60);

	if (seconds >= 10) {
		$timer.empty();
		$timer.append(minutes + ":" + seconds);
	} else {
		$timer.empty();
		$timer.append(minutes + ":0" + seconds);
	}
}

displayClock(turnLength); //start off showing the turn length in the timer section
$roll.click(newTurn);
$pausebutton.click(pause);
$resetbutton.click(reset);
