var userInput = '';
var currentGoal;
var states = ['ready', 'playing'];
var state = 'ready';
var numCorrectChars = 0;
var timeStarted;

document.addEventListener('keydown', function(keyEvent) {
  if (keyEvent.key ==='Backspace') {
    userInput = userInput.slice(0, userInput.length - 1);
  }
  else if (keyEvent.key.length > 1) {
    // do nothing when people press special keys like 'Alt' and 'Tab'
  }
  else {
    if (!keyEvent.ctrlKey) {
      // Don't trigger any browser shortcuts (e.g. scrolling the page up or down,
      // opening find-in-page, going backwards in browser history, etc.) unless
      // the "Control" key is pressed.
      keyEvent.preventDefault();
    }

    // add the key to the list of user inputted characters
    userInput = userInput + keyEvent.key;
  }

  if (userInput === currentGoal) {
    // the input matches the goal text!
    numCorrectChars += currentGoal.length;

    // generate a new goal
    currentGoal = nextGoal();

    // fetch a new gif
    newRandomGif();

    // reset userInput
    userInput = '';
  }

  drawPage();
});

function drawPage() {
  if (state === 'ready') {
    document.querySelector('.ready-state-container').style.display = 'flex';
    document.querySelector('.playing-state-container').style.display = 'none';
  }
  else if (state === 'playing') {
    document.querySelector('.ready-state-container').style.display = 'none';
    document.querySelector('.playing-state-container').style.display = 'flex';
    drawTextInput();
    drawCurrentGoal();
  }
}

function drawTextInput() {
  document.querySelector('.typing-area').innerText = userInput;
}

function drawCurrentGoal() {
  document.querySelector('.current-goal').innerText = currentGoal;
}

function drawCharsPerMinute() {
  // convert milliseconds to minutes
  var elapsedMinutes = (Date.now() - timeStarted + 1) / 1000 / 60.0;
  document.querySelector('.chars-per-minute').innerText = 'CHARACTERS PER MINUTE: ' + Math.round(numCorrectChars / elapsedMinutes);
}

function nextGoal() {
  // Generate a random number between [0, vocabList.length]
  var randomIndex = Math.random() * vocabList.length;
  
  // Round it down to the nearest whole number
  randomIndex = Math.floor(randomIndex);

  // Return the element in vocabList at the position `randomIndex`
  return vocabList[randomIndex];
}

function startGame() {
  state = 'playing';
  startWPMClock();
  drawCharsPerMinute();
  drawPage();
}

function startWPMClock() {
  timeStarted = Date.now();
}

function newRandomGif() {
  // This uses the giphy API to fetch a random gid in the 'keyboard' category
  // See: https://developers.giphy.com/docs/
  var randomGifEl = document.getElementById('random-gif');
  var tag = 'keyboard';
  var giphyUrl = `http://api.giphy.com/v1/gifs/random?api_key=5b0nNuo3w2Q52LxayxK1BIZaf0NWyOL9&tag=${tag}`;
  fetch(giphyUrl).then(function(result) {
    result.json().then(function(resultJson) {
      randomGifEl.src = resultJson.data.image_url;
    });
  });
}

function setup() {
  // Blink the cursor every 500ms
  var cursor = document.querySelector('.cursor');
  var blinkCursor = function() {
    if (cursor.style.visibility === 'visible') {
      cursor.style.visibility = 'hidden';
    }
    else {
      cursor.style.visibility = 'visible';
    }
  };
  setInterval(blinkCursor, 500);

  // Update the wordsPerMinute readout every 500ms
  setInterval(drawCharsPerMinute, 500);

  // Start off by preloading a random gif
  newRandomGif();

  currentGoal = nextGoal();
  drawPage();
}

setup();
