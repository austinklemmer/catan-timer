// establish page elements
const $timecard = $('#timecard');
const $nameplate = $('#nameplate');
const $timer = $('#timer');
const $pausebutton = $('#pausebutton');
const $resetbutton = $('#resetbutton');
const $bottomHalf = $("#bottomHalf");
const $diceholder = $("#diceholder");
const $diceA = $('#diceA');
const $diceB = $('#diceB');
const $roll = $('#roll');
const $playerSelect = $('#playerSelect');
const $menuToggle = $('.menuToggle');

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
//var playerSequence = [new player('Orange', "#f47442"), new player('Red', "#d33f3f"), new player('Blue', "#417cf4"), new player('Green', "#36ba34"),];
var turnLength = 60; //Should be set on one of the set-up pages. Dummy variable for now.

var playerSequence = [];
var tempPlayerSequence = [];

function newTurn() {
	
    isPaused = false;
   	clearAll();
   	nextPlayer();
   	rollDie();
 	startTimer(turnLength);
}

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
    $roll.css("backgroundColor", playerSequence[(currentPlayer+1) % playerSequence.length].color);

    //change the text inside the roll button
    $roll.empty();
    $roll.append(playerSequence[(currentPlayer + 1 ) % playerSequence.length].name + ' Roll');
    if (playerSequence[(currentPlayer + 1 ) % playerSequence.length].name === "White") {
    	$roll.css('color', 'rgba(47, 49, 53, 0.5)');
    } else {
    	$roll.css('color', 'white');
    }
    if (playerSequence[(currentPlayer + 1 ) % playerSequence.length].name === "White") {
    	$roll.css('backgroundColor', '#ede7e1');
    }
}

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
}

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


function toggleMenu () {
	
	if ($playerSelect.is(":visible") && tempPlayerSequence.length > 2) {

		playerSequence = tempPlayerSequence;
		currentPlayer = -1;
		$timecard.css("backgroundColor", playerSequence[(currentPlayer+1) % playerSequence.length].color);
		$nameplate.empty();
    	$nameplate.append("Roll to Begin");

   		$roll.css("backgroundColor", playerSequence[(currentPlayer+1) % playerSequence.length].color);
   		if (playerSequence[0].name === "White") {
   			$roll.css('color', 'rgba(47, 49, 53, 0.4)');
   		}
   		$roll.html("Roll");

   		displayClock(turnLength);
   		reset();
   		pause();

		$playerSelect.hide();
		$bottomHalf.show();
		$timecard.show();

	} else if (($playerSelect.is(":visible") && tempPlayerSequence.length <= 2)) {
		alert("Please select at least three players");
	} else {

		tempPlayerSequence = [];
		
		for(let i = 0; i < playerSequence.length; i++){
			$('#' + playerSequence[i].name +'Token').empty();
			$('#' + playerSequence[i].name +'Token').css('borderColor', 'rgba(255,255,255,0)');
			console.log(playerSequence[i].name);
		};

		$bottomHalf.hide();
		$timecard.hide();
		$playerSelect.show();

	};

}

function addPlayer (name, color, elementId) {
	
	console.log($(elementId).is(':empty'));

	if ($(elementId).is(':empty')) {
		tempPlayerSequence.push(new player(name, color));
		$(elementId).html(tempPlayerSequence.length);
		$(elementId).css('borderColor', 'rgba(255,255,255,1)');

		if (elementId === "#WhiteToken") { 
			$(elementId).css('backgroundColor', '#c1baae');
	};
	} else {
		removePlayer(name, color, ($(elementId).html()-1));
		if (elementId === "#WhiteToken") { 
			$(elementId).css('backgroundColor', '#ede7e1');
		};
	};

}

function removePlayer (name, color, order) {

	$('#' + name + 'Token').empty();
	$('#' + name + 'Token').css('borderColor', 'rgba(255,255,255,0)');
	tempPlayerSequence.splice(order, 1);

	for(let i = order; i < tempPlayerSequence.length; i++){
		$('#' + tempPlayerSequence[i].name +'Token').html(i+1);
		console.log(tempPlayerSequence[i].name);
	};

}

//updates the time reading on the clock in a traditional clock format.
function displayTurnLengthSelection () {

	inMinutes = Math.floor(turnLength / 60);
	inSeconds = Math.round(Math.abs(turnLength) % 60);

	if (inSeconds >= 10) {
		$('#turnLengthPreview').html(inMinutes + ":" + inSeconds);
	} else {
		$('#turnLengthPreview').html(inMinutes + ":0" + inSeconds);
	}
}

function adjustTime (adjustment) {

	var timeError;
	var flashCount = 0;
	
	function flash () {

		var flashColor = $('#turnLengthPreview').css('color');
		console.log(flashColor + ' is the FlashColor');
		console.log(flashCount + ' is the FlashCount');

		if(flashColor === 'rgb(255, 255, 255)') {
			$('#turnLengthPreview').css('color', 'rgb(211, 63, 63)');
		} else if (flashColor === 'rgb(211, 63, 63)' && flashCount < 4){
			$('#turnLengthPreview').css('color', 'rgb(255, 255, 255)');
		} else {
			clearInterval(timeError);
			$('#turnLengthPreview').css('color', 'white');
		}

		flashCount++;
		console.log(flashCount);
	};

	if(turnLength + adjustment >= 30 ) {
		turnLength += adjustment;
	} else {
		timeError = setInterval(flash, 250);
	}
}


// // // // // // /
// S C R I P T S //
// // // // // // /

$bottomHalf.hide();
$timecard.hide();
$playerSelect.hide();

$('#startButton').click(function() { $playerSelect.show(); $('main').hide();});

displayClock(turnLength); //start off showing the turn length in the timer section
displayTurnLengthSelection();
$roll.click(newTurn);
$pausebutton.click(pause);
$resetbutton.click(reset);

//PLAYER SELECT

$menuToggle.click(toggleMenu);

$('#BlueToken').click(function() { addPlayer("Blue", "#417cf4", "#BlueToken"); });
$('#OrangeToken').click(function() { addPlayer("Orange", "#f47442", "#OrangeToken"); });
$('#RedToken').click(function() { addPlayer("Red", "#d33f3f", "#RedToken"); });
$('#WhiteToken').click(function() { addPlayer("White", "#ede7e1", "#WhiteToken"); });
$('#GreenToken').click(function() { addPlayer("Green", "#36ba34", "#GreenToken"); });
$('#BrownToken').click(function() { addPlayer("Brown", "#755948", "#BrownToken"); });
$('#addTime').click(function () { adjustTime(5); displayTurnLengthSelection();});
$('#subtractTime').click( function () { adjustTime(-5); displayTurnLengthSelection();});




