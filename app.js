// establish page elements

const $timecard = $('#timecard');
const $nameplate = $('#nameplate');
const $timer = $('#timer');
const $diceA = $('#diceA');
const $diceB = $('#diceB');
const $roll = $('#roll');
var ongoingTimer; /* will hold an interval function that needs to be cleared */
var overtime; /* same as above */

console.log("script active");

class player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
}

const playerSequence = [new player('Austin', "#f47442"), new player('David', "#f4c141"), new player('Huyen', "#417cf4"), new player('Madison', "#36ba34"),];
var currentPlayer = 0;
console.log(playerSequence[currentPlayer].name);

const turnLength = 7;

function newTurn() {
	
	// $diceA.fadeOut();
   //  $diceB.fadeOut();
   	clearInterval(ongoingTimer);
   	clearInterval(overtime);
   	$timer.css('color', 'black');
   	overtime = false;

    nextPlayer();
 	resetTimer(turnLength);
 	rollDie();

 	// $diceA.fadeIn();
    // $diceB.fadeIn();
   
};

function nextPlayer () {
	
	if (currentPlayer + 1 === playerSequence.length) {
    	currentPlayer = 0;
    } else {
    	currentPlayer++;
    };

    console.log("The current player is " + playerSequence[currentPlayer].name + " " + currentPlayer + " of " + playerSequence.length);
    console.log(Date.now() / 1000);

    $nameplate.empty();
    $nameplate.append(playerSequence[currentPlayer].name);
    $timecard.css("backgroundColor", playerSequence[currentPlayer].color);
    $roll.css("backgroundColor", playerSequence[(currentPlayer+1) % 4].color);
    $roll.empty();
    $roll.append(playerSequence[(currentPlayer + 1 ) % 4].name + ' Roll');
};

function resetTimer(duration) {
	var start = Math.floor(Date.now() / 1000);
	var bank = duration;
	var difference;
	var OTColor;
	var flashDelay = 1;

	function flash () {
		
		if (flashDelay > 8) {
			flashDelay=1;
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

	function counter() {
		difference = Math.floor(start - (Date.now() / 1000) + bank);
		$timer.empty();
		$timer.append(difference);

		if (difference <= 0 && !overtime) {

			overtime = setInterval(flash, 125);

		} 
	};

	counter();
	ongoingTimer = setInterval(counter, 1000);
};

function rollDie () {
	
	var dA = Math.floor(Math.random()*6) + 1;
	var dB = Math.floor(Math.random()*6) + 1;
	
	console.log("function called");
	
	$diceA.fadeOut(300);
	$diceB.fadeOut(300, function(){

		$diceA.empty(); 
		$diceB.empty();

		$diceA.append('<img src="/dice-0' + dA + '.png"/>');
		$diceB.append('<img src="/dice-0' + dB + '.png"/>');

	});

	setTimeout(function(){

		$diceA.fadeIn();
		$diceB.fadeIn();

	}, 250);
	

	//$diceB.animate({ opacity: '1'});
}

$roll.click(newTurn);
