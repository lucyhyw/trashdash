//-----------------------------------Global Variable Definition--------------------------------------\\


//** canvas variables **
//canvas variable will be set equal to the canvas element created in html when the window loads
let canvas;
//canvasContext variable will be set equal to the canvasContext once window loads
let canvasContext;

/*screenWidth and screenHeight are global variables used to resize the canvas size depending on window size
They are modified in the function resizeScreen()  */
let screenWidth;
let screenHeight;

/*resizeScreen() adjusts screenWidth and screenHeight based on window dimensions.
Calling it now sets the screenWidth and screenHeight to the starting window dimensions*/
resizeScreen();

//Creates javascript variable for the audio player element
const musicPlayer = document.getElementById('player');
//Sets music volume to 50%
musicPlayer.volume = 0.5;


//**** In-game variables ****

// ** Game Mode variables **

//Determines the difficulty modes. Default is "abc". Could also be "snc" or "audit"
let mode = "snc";
//Determines how many lives the player starts with. Determined by difficulty mode
let startLives = 3;
//Determines starting difficulty of a round. Determined by difficulty mode
let startDifficulty = 1.7;
//Game mode without bosses or time countdown
let openCurriculumMode = false;
/*open curriculum mode is unlocked when all 3 levels are beaten.
When true open curriculum button appears and the mode becomes playable */
let openCurriculumUnlocked = true;
// initials identifier used in the leaderboards for open curriculum mode
let initials = "";
let winner = false;
let scores = []


// ** Interval Promises **
//Recurring Timeout Promise to add waste objects
let wasteRepeat;
//Recurring Timeout Promise to count down game time
let progress; 
//Recurring Timeout Promise to count down time of iClicker Power
let clickerTime;
//Recurring Timeout Promise to count down time of Morning Mail Power
let mailTime;


// ** Special Items and events **
/*startClick is the number of active iClicker power-ups.
When startClick > 0, the power-up is active.
Whenever, an iClicker time runs out, startClick decreases by 1.
At 0, the power-up will no longer be active. Variable modified in clickerPower() function */
let startClick = 0;
//Similar to startClick but for Morning Mail. Modified by mailPower() function
let startMail = 0;
//Frequency of special items/power-ups between 0 (no special items) and 10 (only special items)
const specialFreq = 2;
//true indicates that lastCall event is in effect for Joe's level
let speedUp = false;


// ** Boss variables **
//true indicates a boss fight - includes the message and the gameplay
let boss = false;
//true indicates boss gameplay
let bossBegin = false; 
//Boss health. Boss defeated when bossLife <= 0
let bossLife = 100;
//An array containing all fake tree objects for the Ratty Boss
let fakeTrees = [];


// ** screen change variables **
//Determines which game screen to show when drawing
let screen;
let endScreen = 'initials';
//Which level the player is on. Set in newGame() function
let level;
//Indicates whether or not the round has been won (and boss defeated)
let roundWon = false;

// ** Easter Eggs **
//BiG Easter Egg: true indicates BiG logo has been clicked
// let bigClicked = false;
//Ratty Easter Egg: Determines what shows up in the Ratty sign (0 for Sharpe, 1 for Ratty, 2 for Rodent)
let rattyVersion = 0;
//Counts how many times "more" button has been clicked to determine if plmeMode should become true
let plmeCount = 0;
//plme Easter Egg: changes title and locks difficulty on s/nc
let plmeMode = false;
//William Easter Egg: adds picture of William if left gate lamp clicked on win screen
let williamWasHere = false;
//Ripta Title Easter Egg: Changes title to "Caution Bus is Turning if arrow key pressed during Ripta boss
let riptaTitle = false;

// ** Basic Game Play functionality variables **
//Stores which buttons are being pressed
let keyList = [];
//Stores all waste objects on screen
let wasteList = [];
//true inidicates that addWaste() has started creating waste objects
let firstWaste = true;
//How many lives the player has. Initial value determined by difficulty mode
let lives;
//The speed of waste objects. Set equal to startDifficulty in newGame() function
let difficulty;
/*gameTime is a string representing time left in the level.
It is initialized in each level in function timer() and modified in the function clockTime() */
let gameTime; 
//Keeps track of frames for sprite updates
let frameTick = 0;
/* colorChange is a boolean that indicates if the player is currently a color other than black.
The player may not change colors (pick a different trash/recycling/compost) while colorChange is true*/
let colorChange = false;


// ** Score variables **
//The player's score for this round
let score = 0;
//Records the highest score of the player during this play session
let highScore = 0;
// Records if the score has been sent to the server
let apiCall = false;


// ** Outside-of-gameplay controls **
//true indicates music is muted. Also determines which volume button appears (muteButton or volumeButton)
let mute = true;
//true indicates the game is paused
let pause = false;


//** Tutorial **
//true indicates they have not read the instructions or played yet, so tutorial will run first
let needsTutorial = true;
//determines how far along the player is in the tutorial
let tutorialPage;


// ** Loading images **
//Indicates number of successfullly loaded graphics
let loadCount = 0;
//Indicates number of successfully loaded Load screen Captions (5 in total)
let loadCaptionCount = 0;
//Determines which Load Screen Caption to show. Modified in a timeout promise every 1 second
let loadStep = 0;


// **** Static images - text, logos, backgrounds ****

//staticImageText is an array of names (w/out doc type) of all static images (must be in static image folder)
let staticImageText = ["title", "clickToPlay", "pressSpaceForInstructions", /*"bigLogo",*/ "vanWickle", "instructions1", "instructions2", "instructions3", "josBackground", "rattyBackground", "andrewsBackground", "bossBackground", "iceCream", "andrewsCrowd", "wordBackground", "highscoresBackground", "initialsBase", "healthBar", "lastCall", "brokenMachine", "phoLine", "winScreen", "loseScreen", "openCurriculumEnd", "difficultyMode", "abcStatic", "sncStatic", "auditStatic", "plmeTitle", "bluenoIntro", "rockTreeIntro", "riptaIntro", "complete1", "complete2", "todayNotification", "clickerNotification", "announcement1", "healthLabel", "tutorial0", "tutorial1", "tutorial2", "tutorial3", "tutorial4", "tutorial5", "tutorial6", "tutorial7", "tutorial8", "tutorial9", "tutorial10", "rattyEasterEgg", "rodentEasterEgg", "williamEasterEgg", "riptaEasterEgg"];
//An array to hold all static images once initialized
let staticImages = [];

//This function goes through every item in staticImageText, turns them into images with the same name, and adds them to staticImages array
staticImageText.forEach(function(image) {
    window[image] = document.createElement("img");
    staticImages.push(window[image]);
});


//Load screen captions - same as static image process but with load screen captions
//Array with the titles of all load screen captions
let loadCaptionsText = ["load1", "load2", "load3", "load4", "load5"];
//Array to hold all images created from load screen caption titles
let loadCaptions = [];
//Populates loadCaptions array with images created from each element in loadCaptionsText array
loadCaptionsText.forEach(function(image) {
    window[image] = document.createElement("img");
    loadCaptions.push(window[image]);
});



//---------------------------------------- Object Functions --------------------------------\\
//Create New Waste item by inputting a container object a wasteType object
function Waste(I, itemIndex) {
    //If no container object inputted, creates an empty one
    I = I || {};
    //If active == false, the waste instance is removed from the game
    I.active = true;
    //Inherits name, type ('gray' (trash), 'blue' (recycing), 'green' (compost)), img, frames, and current frame from the inputted waste
    I.name = itemIndex.name;
    I.type = itemIndex.type;
    I.img = itemIndex.img;
    I.frames = itemIndex.frames;
    I.currentFrame = itemIndex.currentFrame;
    
    //speed is set at the game difficulty. Doesn't increase in normal play, but does increase in openCurriculumMode
    I.speed = difficulty;
    //xRatio and yRatio determine location of the object
    //Starts at a random height within the range of player y positions
    I.yRatio = (Math.random()*(player.img.height - I.img.height)*screenHeight/600 + screenHeight * 3/10)/screenHeight;
    //Starts on the right side of the screen
    I.xRatio = 1;
    
    // ** Blueno Boss **
    //If true, waste is in a present and must be clicked before sorting
    I.present = false;
    //All waste items start as presents in Blueno Boss
    if (boss == true && level == 1) {
        I.present = true;
    };
    
    // ** Ripta Boss **
    //Speed during ripta boss is random
    I.riptaSpeed = Math.random()* 6 + 1;
    //Determines how long the waste object will pause in ripta boss
    I.riptaTime = Math.floor(Math.random() * 100 + 30);
    //Pause time counter for ripta boss
    I.riptaCurrent = 0;
    //waste moves when riptaState == 'go' but stops when riptaState == 'stop'
    I.riptaState = 'go';
    
    // ** Sound Effects **
    //Sound when correctly sorted (or clicked with iClicker)
    I.correct = new Audio("music/correct.wav");
    I.correct.volume = 0.5;
    //Sound when waste object goes off screen or mouseover pembroke seal
    I.miss = new Audio("music/miss.wav");
    I.miss.volume = 0.8;
    //Sound when powerUp is clicked
    I.special = new Audio("music/special.wav");
    I.special.volume = 0.8;
    //Sound when coldCup or present is clicked
    I.tap = new Audio("music/tap.wav");
    I.tap.volume = 0.8;
    
    //returns true if waste instance is within player hitbox and player type matches waste type
    I.hit = function() {
        return I.xRatio*screenWidth < player.x + player.img.width/player.frames*screenWidth/800 && I.xRatio*screenWidth + I.img.width/I.frames*screenWidth/800 > player.x + 84*screenWidth/800 && I.type == player.type;
    };
    
    //returns true if waste instance x position is on screen
    I.inBounds = function() {
        return I.xRatio*screenWidth + I.img.width/I.frames*screenWidth/800 > 0; //Divide width by frames to get one sprite in sprite sheet
    };
    
    //Updates waste instance position
    I.update = function() {
        
        // ** Speed Management **
        //Handles speed during ripta boss
        if (boss == true && level == 2) { //If ripta boss
            //Make waste instance start at ripta speed
            if (I.speed != 0) { 
                I.speed = I.riptaSpeed;
            };
            
            //If counter (riptaCount) has reached the end time (riptaTime), change movement state
            if (I.riptaTime == I.riptaCurrent) {
                I.riptaCurrent = 0;
                if (I.riptaState == 'go') {
                    I.riptaState = 'stop';
                    I.speed = 0;
                } else if (I.riptaState == 'stop') {
                    I.riptaState = 'go';
                    I.speed = I.riptaSpeed;
                };
            } else {
                //Continue increasing counter
                I.riptaCurrent += 1;
            }
        } else {
            //If not in the ripta boss, speed should equal game difficulty
            I.speed = difficulty;
        };
        
        //Position management
        I.xRatio -= I.speed/screenWidth * screenWidth/800;
        
        //If the instance is in bounds and has not been sorted, it remains on screen
        //Cannot be sorted (hit) if it is in a present (for Blueno boss)
        I.active = I.active && I.inBounds() && (!I.hit() || I.present);
    };
    
    // ** Draw the waste instance **
    I.draw = function() {
        //Draw the present sprite if the instance is in a present (Blueno boss)
        if (I.present == true) {
            //Changes active sprite on sprite sheet every 17 frameTicks (same mechanics as spriteUpdate() function)
            if (frameTick < 17) {
                //Continue drawing the current sprite frame
                canvasContext.drawImage(present.img, (I.currentFrame - 1) * present.width, 0, present.width, present.height, I.xRatio * screenWidth, I.yRatio*screenHeight, present.width*screenWidth/800, present.height*screenHeight/600);
            }
            
            //Change current frame when frameTick == 17
            else if (I.currentFrame == 2) { //Switch to frame 1 of sprite sheet if on frame 2
                canvasContext.drawImage(present.img, 0, 0, present.width, present.height, I.xRatio * screenWidth, I.yRatio * screenHeight, present.width*screenWidth/800, present.height*screenHeight/600);
                I.currentFrame = 1;
            } else { //Switch to frame 2 of sprite sheet if on frame 1
                canvasContext.drawImage(present.img, present.width, 0, present.width, present.height, I.xRatio * screenWidth, I.yRatio * screenHeight, present.width*screenWidth/800, present.height*screenHeight/600);
                I.currentFrame = 2;
            };
        //Draw regular waste instance sprite
        } else if (I.currentFrame < 3) { //Switch between first 2 frames (for cold cup, this is no lid)
            spriteUpdate(I, 1, 2, I.xRatio*screenWidth, I.yRatio*screenHeight);
        } else { //Switch between second 2 frames (for cold cup, this is yes lid)
            spriteUpdate(I, 3,2, I.xRatio*screenWidth, I.yRatio*screenHeight);
        };
    };
    
    //return the object instance of the waste
    return I;
}


//Player properties
let player = {
    type: 'black',//Starts without type
    img: document.createElement("img"),
    currentFrame: 1,
    frames: 16,
    x: screenWidth/15,
    y: screenHeight*3/10
};

//Image used when a round is won
let playerStatic = document.createElement("img");


// ** Button Properties **
//hover: Is the mouse over the button
//startX and startY allow for scaling of button position according to screen size
//action indicates what this button will do
function Button(name, startX, startY, action) {
    this.name = name || ""
    this.img = document.createElement("img");
    this.hover = false;
    this.startX = startX || "";
    this.startY = startY || "";
    this.action = action || "";
    //Determines how large the button appears
    this.scaling = 1;

    //Draws the button
    this.draw = function() {
        if(!this.hover) { //If mouse is not hovering over the button
            canvasContext.drawImage(this.img, 0, 0, this.img.width/2, this.img.height, this.startX*screenWidth/800, this.startY*screenHeight/600, this.img.width/2*screenWidth/800 * this.scaling, this.img.height*screenHeight/600 * this.scaling);
        } else { //If the mouse is hovering over the button
            canvasContext.drawImage(this.img, this.img.width/2, 0, this.img.width/2, this.img.height, this.startX*screenWidth/800, this.startY*screenHeight/600, this.img.width/2*screenWidth/800 * this.scaling, this.img.height*screenHeight/600 * this.scaling);
        }
    }; 
    
    //Determines if the mouse is hovering over the button and changes this.hover value accordingly
    this.mouseOver = function(x,y) {
        if (x >= this.startX*screenWidth/800 && x <= this.startX*screenWidth/800 + this.img.width/2*screenWidth/800 * this.scaling && y >= this.startY*screenHeight/600 && y <= this.startY*screenHeight/600 + this.img.height*screenHeight/600 * this.scaling) {
            this.hover = true;
        } else {
            this.hover = false;
        }
    };
};


//Gameplay A,D,W illustration
function directionButton(name, startX, startY) {
    //Inherit traits from button
    this.base = Button;
    
    this.img = document.createElement("img");
    this.hover = false;
    
    //When key-press matches this button, switch to hover sprite
    this.action = function(key) {
        if (key == this.name) {
            this.hover = true;
        } else {
            this.hover = false;
        };
    };
    //Create a new button with these properties
    this.base(name, startX, startY, this.action);
    
    //Increase size of direction buttons to 1.5 times original
    this.scaling = 1.5;
};

//directionButton creation from Button
directionButton.prototype = new Button;


//Instruction waste descriptions (on page 2 of instructions)
function descriptiveButton(name, startX, startY, descriptionX, descriptionY) {
    //Inherit traits from Button
    this.base = Button;
    
    this.name = name;
    this.description = document.createElement("img");
    
    //true if showing the description for the waste (happens on mouseover)
    this.activeDescription = false;
    
    //activeDescription = true when mouse is hovering over the button
    this.action = function() {
        if (this.hover) {
            this.activeDescription = true;
        } else {
            this.activeDescription = false;
        };
    };
    
    //Create a new button with these properties
    this.base(name, startX, startY, this.action);
    
    //Decrease size of description buttons to 0.65 times the original
    this.scaling = 0.65;
    
    //When hovering over the button, also draw the description
    this.drawDescription = function() {
        if (this.activeDescription) {
            canvasContext.drawImage(this.description, descriptionX*screenWidth/800, descriptionY*screenHeight/600, this.description.width*screenWidth/800, this.description.height*screenHeight/600);
        };
    }
}

//descriptive button creation from button
descriptiveButton.prototype = new Button;


//Object creation for fake trees in Rock Tree boss fight
//Similar to waste object creation - input a blank object and it will populate and return it
function newTrees(I) {
    I = I || {}
    //Random x and y coordinates
    I.x = screenWidth/3 + Math.random() * screenWidth*2/3 - 114 * screenWidth/800;
    I.y = screenHeight/3 + Math.random() * screenHeight/3;
    I.currentFrame = 1;
    I.frames = 2;
    I.img = treeImg;
    
    I.draw = function() {
        spriteUpdate(I, 1, 2, I.x, I.y);
    }
    
    return I;
};


//---------------------------------------------Object Creation ---------------------------------\\


// ** Waste Item Properties **
//name: the name should match the sprite sheet file name
//type: trash ('gray'), recycling ('blue'), or compost ('green')
//currentFrame: Which frame of the sprite sheet should show
//frames: Total number of frames in sprite sheet
//Place: what levels the waste should appear (0 for Level 1, 1 for Level 2, 2 for Level 3, 3 for Open Curriculum Mode (all items are there))
wasteTypes = [
{name: 'coldCup',
type: 'none', //Before it is clicked, the coldCup does not have a type
frames: 4,
place: [0, 1, 2, 3]},

{name: 'plasticWare',
type: 'gray',
frames: 2,
place: [0, 1, 2, 3]},

{name: 'chips',
type: 'gray',
frames: 2,
place: [0, 1, 2, 3]},

{name: 'marinara',
type: 'blue',
frames: 2,
place: [0, 3]},

{name: 'glassBottle',
type: 'blue',
frames: 2,
place: [0, 1, 3]},

{name: 'lactaid',
type: 'blue',
frames: 2,
place: [0, 1, 2, 3]},

{name: 'pizza',
type: 'green',
frames: 2,
place: [2, 3]},

{name: 'tea',
type: 'green',
frames: 2,
place: [2, 3]},

{name: 'chopSticks',
type: 'green',
frames: 2,
place: [2, 3]},

{name: 'bones',
type: 'green',
frames: 2,
place: [2, 3]},

{name: 'toGo',
type: 'green',
frames: 2,
place: [2, 3]},

{name: 'napkins',
type: 'green',
frames: 2,
place: [2, 3]},

{name: 'straw',
type: 'gray',
frames: 2,
place: [0, 1, 2, 3]},

{name: 'hotCup',
type: 'gray',
frames: 2,
place: [0, 1, 2, 3]},

{name: 'muffin',
type: 'gray',
frames: 2,
place: [0, 2, 3]},

{name: 'condiments',
type: 'gray',
frames: 2,
place: [0, 2, 3]},

{name: 'pho',
type: 'blue',
frames: 2,
place: [1, 3]},

{name: 'pembroke',
type: 'powerDown',
frames: 2,
place: [0, 1, 2, 3],},

{name: 'smoothie',
type: 'powerUp',
frames: 4,
place: [0, 1, 2, 3]},

{name: 'morningMail',
type: 'powerUp',
frames: 2,
place: [0, 1, 2, 3]},

{name: 'iClicker',
type: 'powerUp',
frames: 2,
place: [0, 1, 2, 3]}
];

specialTypes = [
{name: 'pembroke',
type: 'powerDown',
frames: 2,
place: [0, 1, 2, 3],},

{name: 'smoothie',
type: 'powerUp',
frames: 4,
place: [0, 1, 2, 3]},

{name: 'morningMail',
type: 'powerUp',
frames: 2,
place: [0, 1, 2, 3]},

{name: 'iClicker',
type: 'powerUp',
frames: 2,
place: [0, 1, 2, 3]}
];

//For all waste types, create the image and set currentFrame to 1
wasteTypes.forEach(function(waste) {
    waste.currentFrame = 1;
    waste.img = document.createElement("img");
});


//Create present image to use in Blueno Boss
present = {
    img: document.createElement("img"),
    width: 94,
    height: 100
};


//Create lists of available waste items for each level
let places = [];
for (let j = 0; j < 5; j++) {
    places[j] = [];
    for (let i = 0; i < wasteTypes.length; i++) {
        if (wasteTypes[i].place.indexOf(j) >= 0) {
            places[j].push(wasteTypes[i]);
        }
    };
};


//** Game-play Direction Buttons **
//All direction buttons should go in this array
let directionButtons = [
//A Direction (Compost)
new directionButton(65, 800/2 - 52*1.5 - (30*1.5)/2, 600*7.7/10 + 52*1.5),
//D Direction (Trash)
new directionButton(68, 800/2 + 30*1.5 - (30*1.5)/2, 600*7.7/10 + 52*1.5),
//W Direction (Recycling)
new directionButton(87, 800/2 - (30*1.5)/2, 600*7.7/10)];


// ** Menu Buttons **
//All menu buttons should go in this array
let menuButtons = [
//More Button takes the player to Brown Sustainability homepage
new Button("moreButton", 800 * 1/10, 600 * 7/10, function() {
    if (this.hover && screen == "title") {
        window.open("https://www.brown.edu/sustainability/");
        //After 10 clicks in one play session, activates plmeMode Easter Egg
        plmeCount += 1;
        if (plmeCount >= 10) {
            plmeMode = true;
            mode = "snc";
            startLives = 10;
        };
    };
}),
//Menu Button takes player back to title page
new Button("menuButton", 800 * 1/10, 600 * 7/10, function() {
    if (this.hover && (screen == "end" || (screen == "instruction1" && pause == true))) {
        if (pause == true) {
            pause = false;
            wasteList = [];
            difficulty = 1.5;
            //Clears progress time, morningMail powerup time, iClicker powerup time, addWaste repeat
            clearAllTimeouts();
        };
        openCurriculumMode = false;
        fadeTo('actionSong');
        screen = "title";
    }
}),
//Back button returns to the previous page of instructions (or title page if on First instruction page)
new Button("backButton", 800 * 1/10, 600 * 7/10, function() {
    if (this.hover) {
        //Go to title if on first page of instructions
        if (screen == "instruction1" && pause == false) {
            screen = "title";
        } else if (screen == "instruction2") { //Go to instruction page 1 from page 2
            screen = "instruction1";
        } else if (screen == "instruction3") { //Go to instruction page 2 from page 3
            screen = "instruction2";
        }
    }
}),
//Next button goes to next instruction page
new Button("nextButton", 800 * 9/10 - 150, 600 * 7/10, function() {
    if(this.hover) {
        if (screen == "instruction1") { //Page 1 goes to page 2
            screen = "instruction2";
        } else if (screen == "instruction2") { //Page 2 goes to page 3
            screen = "instruction3";
            //If accessed from the title page, accessing last page of instructions bypasses tutorial
            if (!pause) {
              needsTutorial = false;
            }
        };
    };
}),
//Play Button plays regular game mode
new Button("playButton", 800/2 - 150/2, 600 * 7.5/10, function() {
    if (this.hover) {
        //Deactivate BiG Easter Egg
        // bigClicked = false;
        //Start game when playButton pressed
        if (pause == false) {
            openCurriculumMode = false;
            fadeTo('actionSong');
            //Start regular game if no tutorial needed, otherwise start the tutorial
            if (!needsTutorial) {
              newGame();
            } else {
              startTutorial();
            }
        //Exit pause screen if pressed while game is paused
        } else {
            togglePause();
        };
        this.hover = false;
    }
}),
//Help Button enters instructions
new Button("helpButton", 800 * 9/10 - 150, 600 * 7/10, function() {
    if(this.hover && (screen == "end" || screen == "title")) {
        //Deactivates BiG Easter Egg
        // bigClicked = false;
        screen = "instruction1";
    }
}),
//Open Curriculum Button starts Open Curriculum Mode
new Button("openCurriculum", 800/2 - 150/2, 600 * 6/10, function() {
    //Only works if openCurriculum mode is unlocked (by completing the regular game)
    if (this.hover && openCurriculumUnlocked == true) {
        needsTutorial = false;
        openCurriculumMode = true;
        fadeTo('actionSong');
        newGame();
    };
}),
//abc button changes difficulty to abc mode (most difficult)
new Button("abc", (400 + 24) + 30, 600 * 9.4/10, function() {
    if(this.hover && screen == "title" && plmeMode == false) {
        mode = "abc";
        //startDifficulty determines waste speed
        startDifficulty = 1.7;
        startLives = 3;
    }
}),
//snc button changes difficulty to snc mode (medium difficulty)
new Button("snc", 400 - 24, 600 * 9.4/10, function() {
    if (this.hover && screen == "title" && plmeMode == false) {
        mode = "snc";
        startDifficulty = 1.3;
        startLives = 10;
    }
}),
//audit changes difficulty to audit mode (low difficulty)
new Button("audit", (400 - 24) - (50 + 37), 600 * 9.4/10, function() {
    if (this.hover && screen == "title" && plmeMode == false) {
        mode = "audit";
        startDifficulty = 1;
        //Player will still lose/gain lives but they cannot lose (lives can be negative)
        startLives = 0;
    };
}),
//Pause button pauses game and brings player to an in-game instruction screen
new Button("pauseButton", 800 * 6.9/10, 600 * 9.4/10 + 6, function() {
    if (this.hover && screen == "game") {
        togglePause();
    };
}),
//Clicking the volume button unmutes the game
new Button("volumeButton", 800 * 8/10, 600 * 9.4/10, function() {
    if (this.hover && mute == true) {
        mute = false;
        musicPlayer.play();
    };
}),
//Clicking the mute button mutes the game
new Button("muteButton", 800 * 8/10, 600 * 9.4/10, function() {
    if (this.hover && mute == false) {
        mute = true;
        musicPlayer.pause();
    }
})];

let letterButtons = []
const letters = ['a', 'b', 'c', 'd', 'e', 'f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
letters.forEach(function(letter, i) {
    const x = 100 + (i % 13) * 45;
    const y = 350 + 65 * Math.floor(i / 13);
    const b = new Button(letter + "-charButton",x, y, function() {
        if (this.hover && initials.length < 3 && endScreen == 'initials') {
           initials += letter;
        } 
    })
    b.letter = letter;
    letterButtons.push(b)
})

const backspaceButton = new Button("backspaceButton", 800 * 3/10, 600 * 8.4/10, function() {
  if (this.hover && initials.length > 0 && endScreen == 'initials') {
    initials = initials.substring(0, initials.length - 1)
  }
})

const nextInitialButton = new Button("nextInitialButton", 800 * 5/10, 600 * 8.4/10, function() {
  if (this.hover && initials.length > 0) {
    endScreen = 'leaderboards'
  }
})

//Open Curriculum Menu Button takes player back to title page
const opMenuButton = new Button("opMenuButton", 800 * 7/10, 600 * 6/10, function() {
  if (this.hover && (screen == "end")) {
      openCurriculumMode = false;
      apiCall = true;
      scores = [];
      winner = false;
      
      fadeTo('actionSong');
      screen = "title";
  }
})


// ** Descriptive Buttons **
//Determines location of all descriptive buttons and their corresponding descriptions
let descriptiveButtons = [
new descriptiveButton("chips", 275, 320, 400 - 534/2, 0),
new descriptiveButton("coldCup", 275, 175, 400 - 534/2, 600*4.1/10 + 40),
new descriptiveButton("glassBottle", 370, 175, 400 - 534/2, 600*4.1/10 + 40),
new descriptiveButton("lactaid", 440, 182, 400 - 534/2, 600*4.1/10 + 40),
new descriptiveButton("marinara", 510, 195, 400 - 534/2, 600*4.1/10 + 40),
new descriptiveButton("pho", 585, 185, 400 - 534/2, 600*4.1/10 + 40),
new descriptiveButton("plasticWare", 370, 320, 400 - 534/2, 0),
new descriptiveButton("condiments", 435, 320, 400 - 534/2, 0),
new descriptiveButton("muffin", 515, 335 , 400 - 534/2, 0),
new descriptiveButton("hotCup", 600, 320, 400 - 534/2, 0),
new descriptiveButton("toGo", 340, 260, 400 - 534/2, 600 - 271),
new descriptiveButton("pizza", 420, 270, 400 - 534/2, 600 - 271),
new descriptiveButton("tea", 500, 250, 400 - 534/2, 600 - 271),
new descriptiveButton("bones", 550, 265, 400 - 534/2, 600 - 271),
// new descriptiveButton("chopSticks", 630, 265, 400 - 534/2, 600 - 271),
new descriptiveButton("napkins", 275, 270,400 - 534/2, 600 - 271),
new descriptiveButton("straw", 660, 320, 400 - 534/2, 0)];

//Add descriptive buttons and menu buttons to buttons array
let buttons = menuButtons.concat(descriptiveButtons);



// ** Cursor Properties **
//hover: is the mouse hovering over a button
let cursor = {
    img: document.createElement("img"),
    hover: false
};

// ** Rock Tree Boss **
let realTree = {
    img: document.createElement("img"),
    x: screenWidth*9/12,
    y: screenHeight*3/10,
    width: 114,
    height: 208,
    currentFrame: 1,
    frames: 4,
    //Tree Tap is how many times the rock tree has been clicked without causing damage
    treeTap: 0,
    //TreesHit is how many times the rock tree has been dealt damage
    treesHit: 0,
    
    //** Sound Effects **
    tapSound: new Audio('music/tap.wav'),
    hitSound: new Audio('music/special.wav'),
    
    //Rock Tree is immune to clicks briefly after being clicked (when noHit == true)
    noHit: false,
    //betweenHits timeout makes rock tree immune for the timout duration
    betweenHits: function() {
        if (realTree.noHit == false) {
            realTree.noHit = true;
            this.currentFrame = 3;
            setTimeout(function() {
                realTree.noHit = false;
                this.currentFrame = 1;
            }, 1000);
        };        
    },
    
    //Rock tree draw function
    draw: function() {
        if (realTree.noHit == false) { //Regular rock tree sprite
            treeUpdate(realTree, 1, this.x, this.y);
        } else if (realTree.noHit == true) { //Immune rock tree sprite
            treeUpdate(realTree, 3, this.x, this.y);
        };
    }
};

//Change volume of the rock tree sound effects
realTree.tapSound.volume = 0.8;
realTree.hitSound.volume = 0.8;

//treeImg stores images of the fake trees
let treeImg = document.createElement("img");


// ** Ripta Boss **
let ripta = {
    img: document.createElement("img"),
    currentFrame: 1,
    frames: 2,
    x: screenWidth*9/12,
    y: screenHeight*5/10
};


// ** Blueno Boss **
let blueno = {
    img: document.createElement("img"),
    currentFrame: 1,
    frames: 2,
    x: screenWidth*10/15,
    y: screenHeight*3/10
};


// ** Loading Animation **
let loading = {
    img: document.createElement("img"),
    x: screenWidth/2,
    y: screenHeight/2,
    frames: 3,
    currentFrame: 1
};


// ** BiG Easter Egg Sprite **
// var bigSprite = {
//   img: document.createElement("img"),
//   x: screenWidth*5/800,
//   y: screenHeight*495/600,
//   frames: 2,
//   currentFrame: 1
// }





//---------------------------------------Load images/music-----------------------------------\\
//When the window loads
window.onload = function() {
    //Load canvas, canvasContext, and determine resize properties
    setup();
    
    // ** Load screen images **
    //First load loading screen animation
    loading.img.src = "images/sprites/loading.png";
    loading.img.onload = function() {
        //Start load process / screen
        loadAction();
    };
    
    //Go through all loading screen captions and load their images
    for (let i = 0; i < loadCaptions.length; i++) {
        loadCaptions[i].src = "images/staticImages/loading/" + loadCaptionsText[i] + ".png";

        loadCaptions[i].onload = function() {
            loadCount += 1;
            loadCaptionCount += 1;
        };
    };

    
    // ** Load waste item sprites **
    wasteTypes.forEach(function(waste) {
        waste.img.src = "images/sprites/" + waste.name + ".png";
        
        waste.img.onload = function() {
            loadCount += 1;
        };
    });
    //Load present image
    present.img.src = "images/sprites/present.png";
    
    present.img.onload = function() {
        loadCount += 1;
    };
    
    
    // ** Load all static Images **
   for (var i = 0; i < staticImages.length; i++) {
        staticImages[i].src = "images/staticImages/" + staticImageText[i] + ".png";
        
        staticImages[i].onload = function() {
            loadCount += 1;
        };
    }

    // ** Load player sprite **
    // player.img.src = "images/sprites/runWilliam.png";
    player.img.src = "bear_draft_one.png";
    player.img.onload = function() {
        loadCount += 1;
    };
    
    //Load static image of the player for between-round pages
    playerStatic.src = "images/sprites/williamClassic.png";
    playerStatic.onload = function() {
        loadCount += 1;
    };
    
    
    // ** Boss Sprites **
    //Load ripta image
    ripta.img.src = "images/sprites/ripta.png";
    ripta.img.onload = function() {
        loadCount += 1;
    };
    
    //Load Blueno Image
    blueno.img.src = "images/sprites/blueno.png";
    blueno.img.onload = function() {
        loadCount += 1;
    };
    
    //Load rocktree image
    realTree.img.src = "images/sprites/realTree.png";
    realTree.img.onload = function() {
        loadCount += 1;
    };
    
    //Load fake tree image
    treeImg.src = "images/sprites/fakeTree.png";
    treeImg.onload = function() {
        loadCount += 1;
    };
    
    
    // ** Load BiG Easter Egg **
    // bigSprite.img.src = "images/sprites/bigSprite.png";
    // bigSprite.img.onload - function() {
    //   loadCount += 1;
    // };
    

    // ** Load Button Sprites **
    //Load menu buttons
    for (let i = 0; i < menuButtons.length; i++) {
        menuButtons[i].img.src = "images/buttons/" + ["moreButton", "menuButton", "backButton", "nextButton", "playButton", "helpButton", "openCurriculum", "abc", "snc", "audit", "pauseButton", "muteButton", "volumeButton"][i] + ".png";
        
        menuButtons[i].img.onload = function() {
            loadCount += 1;
        };
    };

    opMenuButton.img.src = "images/buttons/opMenuButton.png"
    nextInitialButton.img.src = "images/buttons/nextInitialButton.png"
    backspaceButton.img.src = "images/buttons/backspaceButton.png"

    for (let i = 0; i < letterButtons.length; i++) {
        letterButtons[i].img.src = "images/buttons/charButton.png"
        letterButtons[i].img.onload = function() {
            loadCount += 1;
        }
    }
    
    //Load descriptive buttons
    for (let i = 0; i < descriptiveButtons.length; i++) {
        
        descriptiveButtons[i].img.src = "images/buttons/" + descriptiveButtons[i].name + "Button.png";
        descriptiveButtons[i].description.src = "images/staticImages/" + descriptiveButtons[i].name + "Description.png";
        
        descriptiveButtons[i].img.onload = function() {
            loadCount += 1;
        };
        descriptiveButtons[i].description.onload = function() {
            loadCount += 1;
        };
    };
    
    //Load direction buttons
    for (let i = 0; i < directionButtons.length; i++) {
        directionButtons[i].img.src = "images/buttons/" + ["aDirection", "dDirection",/* "sDirection",*/ "wDirection"][i] + ".png";
        
        directionButtons[i].img.onload = function() {
            loadCount += 1;
        };
    };
    
    // ** Load cursor sprites **
    cursor.img.src = "images/sprites/cursor.png";
    cursor.img.onload = function() {
        loadCount += 1;
    };
    
    
    //Events handles all key-press events
    events();
    //Animate updates the game
    animate();
};





//-------------------------------------------Event listeners------------------------------------\\
const events = () => {
    //For all key-press events
    handleKeyPresses(); 
    
    //For all mouse-move events
    handleMouseMove(); 
    
    //For all mouse-up events
    handleMouseUp();  
    
    //For all mouse-click events
    handleMouseClick();
    
    //Handles resize events
    handleResize();

    //Loops background music
    musicLoop();
};




//Handles all key presses
const handleKeyPresses = () => {
  document.addEventListener('keydown', evt => {
    
    if (screen == "game") {
      //If space bar pressed
      if (evt.keyCode == 32) {
        //If between levels, start the next level
        if (roundWon == true && level < 3) {
          roundWon = false;
          level ++;
          fadeTo('actionSong');
          timer(level);
          startAddWaste();
        //If on boss introduction screen, start the boss fight
        } else if (boss == true && bossBegin == false) {
            bossBegin = true;
            startAddWaste();
            //First treeHit() event puts rock tree in a random location
            if (level == 3) {
                treeHit();
            };
        //If on tutorial
        } else if (needsTutorial) {
          changeTutorialPageOnSpace();
        }
      //If key press other than space, change player type accordingly
      } else if (colorChange == false) {
        player.shirtColor(evt.keyCode);
      }
      
      //Ripta Easter Egg
      if (level == 2 && boss == true && (evt.keyCode == 37 || evt.keyCode == 39)) {
        riptaTitle = true;
      }
    }
  })
}


//Handle all space presses during tutorial
const changeTutorialPageOnSpace = () => {
  //Add chips after tutorial page 3 intro
  if (tutorialPage == 3 && wasteList.length == 0) {
    addSingleWaste("chips");
  //Add coldCup after tutorial page 4 intro
  } else if (tutorialPage == 4 && wasteList.length == 0) {
    addSingleWaste("coldCup");
  //Add a random waste after tutorial pages 5 and 6 intro
  } else if ((tutorialPage == 5 || tutorialPage == 6) && wasteList.length == 0) {
    let newWaste = wasteTypes[Math.floor(Math.random()*(wasteTypes.length - 4))];
    addSingleWaste(newWaste.name);
  //Add smoothie after tutorial page 7 intro
  } else if (tutorialPage == 7 && wasteList.length == 0) {
    addSingleWaste("smoothie");
  //Add pembroke seal after tutorial page 8 intro
  } else if (tutorialPage == 8 && wasteList.length == 0) {
    addSingleWaste("pembroke");
  //End the tutorial after tutorial page 10 intro
  } else if (tutorialPage == 10) {
    endTutorial();
  //Go to next tutorial page for all pages that don't involve gameplay
  } else if (tutorialPage == 0 || tutorialPage == 1 || tutorialPage == 2 || tutorialPage == 9) {
    tutorialPage ++;
  }
}


//Handles all mouse move events
const handleMouseMove = () => {
  canvas.addEventListener('mousemove', evt => {
    //Move cursor to mouse position
    let mousePos = calculateMousePos(evt);
    cursor.x = mousePos.x;
    cursor.y = mousePos.y;

    //See if the mouse is hovering over the buttons
    buttons.forEach(function(button) {
      button.mouseOver(mousePos.x, mousePos.y);
    });

    opMenuButton.mouseOver(mousePos.x, mousePos.y);
    backspaceButton.mouseOver(mousePos.x, mousePos.y);
    nextInitialButton.mouseOver(mousePos.x, mousePos.y);

    letterButtons.forEach(button => {
          button.mouseOver(mousePos.x, mousePos.y);
  })
    
    //If mouse hovering over descriptive buttons, show their description
    descriptiveButtons.forEach(function(button) {
      button.action();
    });
    
    //Ratty Easter Egg
    if (level == 3 && cursor.x > 94*screenWidth/800 && cursor.x < 163*screenWidth/800 && cursor.y > 49*screenHeight/600 && cursor.y < 141*screenHeight/600) {
      rattyVersion = 1; //Show "Ratty"
    } else if (level == 3 && cursor.x > 539*screenWidth/800 && cursor.x < 574*screenWidth/800 && cursor.y > 99*screenHeight/600 && cursor.y < 134*screenHeight/600) {
      rattyVersion = 2; //Show "Rodent"
    } else {
      rattyVersion = 0; //Show "Sharpe" (Default)
    }
  })
}


//Handles all mouse up events
const handleMouseUp = () => {
  canvas.addEventListener('mouseup', evt => {
    //Go through all menu buttons to find volumeButton and muteButton
    for (let i = 0; i < menuButtons.length; i ++) {
      //If the music is not paused, and mouse is hovering over volume/mute button, start music
      if (!musicPlayer.paused && menuButtons[i].name == "muteButton") {
        menuButtons[i].action();
        break;
      //If music is paused, and mouse is hovering over volume/mute button, pause music
      } else if (musicPlayer.paused && menuButtons[i].name == "volumeButton") {
          menuButtons[i].action();
          break;
      };
    };
  });
}


//Handle Mouse Click Events
const handleMouseClick = () => {
  canvas.addEventListener('click', evt => {
    //Calculate mouse position
    let mousePos = calculateMousePos(evt);
    
    if (screen == "game") {
            
      //Pause game if pause button pressed      
      buttons.forEach(function(button) {
        if (button.name == "pauseButton") {
            button.action();
        };
      });
            

      //Go through wasteList to check which waste is being clicked and react accordingly
      wasteList.forEach(waste => {
        //If coldCup without lid clicked, add lid and allow it to be recycled
        if(waste.name == 'coldCup' && !waste.present && waste.type == 'none') {
          if(click(mousePos.x, mousePos.y, waste)) {
            waste.tap.play();
            waste.currentFrame = 3;
            waste.type = 'blue';
          }
        //If iClicker clicked, start Clicker Power
        } else if (waste.name == 'iClicker') {
          if(click(mousePos.x, mousePos.y, waste)) {
            waste.special.play();
            clickerPower();

            //Only move on in tutorial if iClicker is clicked before sorting the other waste
            if (needsTutorial) {
              tutorialWasteClick();
            }

            //Remove iClicker after clicking it
            waste.active = false;
          };
        //If smoothie clicked, add a life and turn it into a recyclable cup
        } else if (waste.name == 'smoothie') {
          if(click(mousePos.x, mousePos.y, waste) && waste.type != 'blue') {
            waste.special.play();
            lives += 1;
            waste.type = 'blue';
            waste.currentFrame = 3;
          };
        //If morning mail clicked, start morning mail power
        } else if (waste.name == 'morningMail') {
          if(click(mousePos.x, mousePos.y, waste)) {
            waste.special.play();
            mailPower();

            //Only move on in tutorial if morning mail is clicked before sorting other waste
            if (needsTutorial) {
              tutorialWasteClick();
            }

            //Remove morning mail after clicking it
            waste.active = false;
          }
        }

        //If a waste item is clicked while clickerPower is active, sort it
        if (startClick > 0 && click(mousePos.x, mousePos.y, waste) && (waste.type == 'blue' || waste.type == 'gray' || waste.type == 'green')) {
          waste.correct.play();

          //Move on to next tutorial page
          if (needsTutorial) {
            clearAllTimeouts();
            tutorialPage ++;
          }

          //Add points and difficulty accordingly in open curriculum mode
          if(openCurriculumMode) {
            if (mode == "abc") {
              score += 2;
              difficulty += 0.1;
            } else if (mode == "snc") {
              score += 1;
              difficulty += 0.07;
            } else if (mode == "audit") {
              difficulty += 0.05;
            };
          };
          //Remove the waste from play
          waste.active = false;
        };
        
        //If on Blueno boss fight, click to remove presents
        if (bossBegin == true && level == 1) {
          if(mousePos.x >= waste.xRatio*screenWidth && mousePos.x <= waste.xRatio*screenWidth + present.width*screenWidth/800 && mousePos.y >= waste.yRatio*screenHeight && mousePos.y <= waste.yRatio*screenHeight + present.height*screenHeight/600 && waste.present == true) {
            waste.tap.play();
            waste.present = false;
          };
        };
      })
      
      
      // ** Rock Tree Boss Fight **
      
      //If Rock Tree clicked and not immune
      if (bossBegin == true && level == 3 && mousePos.x > realTree.x + realTree.treeTap * 114/10 /2 * screenWidth/800 && mousePos.x < realTree.x + realTree.treeTap * 114/10 /2 * screenWidth/800 + realTree.width && mousePos.y > realTree.y + realTree.treeTap * 208/10 * screenHeight/600 && mousePos.y < realTree.y + realTree.treeTap * 208/10 + realTree.height && realTree.noHit == false) {
        //If Rock Tree has already been tapped three times, deal damage to Rock Tree
        if (realTree.treeTap >= 3) {

          realTree.hitSound.play();

          bossLife -= 10;
          realTree.height = 208;
          realTree.width = 114;
          realTree.treeTap = 0;

          //Respawn Rock Tree and add more fake trees
          treeHit();
        //If tapped fewer than three times, add to the treeTap counter, make it immune, and make it smaller
        } else {
          realTree.betweenHits();

          realTree.tapSound.play();

          realTree.treeTap += 1;

          //Make Rock Tree smaller every time it gets tapped
          realTree.height = realTree.height - 208/10;
          realTree.width = realTree.width - 114/10;
        };
      };
    
    //If screen != "game"
    } else {
      //William Easter Egg if left gate lamp clicked in Win Screen
      if (screen == "end" && lives > 0 && mousePos.x > 31 && mousePos.x < 43*screenWidth/800 && mousePos.y > 258*screenHeight/600 && mousePos.y < 267*screenHeight/600) {
        williamWasHere = !williamWasHere;
      //BiG Easter Egg if BiG logo clicked on title screen
      } /*else if (screen == "title" && mousePos.x > screenWidth * 5/800 && mousePos.x < screenWidth*5/800 + bigLogo.width*screenWidth/800 && mousePos.y > screenHeight * 495/600 && mousePos.y < screenHeight * 495/600 + bigLogo.height*screenHeight/600) {
        bigClicked = true;
      };*/
      
      if (!openCurriculumMode) {
        //Handle button presses for all buttons except sound buttons (those are handled in handleMouseUp() function)
        buttons.forEach(button => {
          if (button.name != "volumeButton" && button.name != "muteButton") {
            button.action();
          }
        });
      } else {
        if (pause) {
           //Handle button presses for all buttons except sound buttons (those are handled in handleMouseUp() function)
          buttons.forEach(button => {
            if (button.name != "volumeButton" && button.name != "muteButton") {
              button.action();
            }
          });
        }
        if (endScreen == 'initials') {
            letterButtons.forEach(button => {
              button.action();
          })
          nextInitialButton.action();
          backspaceButton.action();
        } else if (endScreen == 'leaderboards') {
          // TODO: Make Logo
          opMenuButton.action();
        }
      }

    };
  });
}


//Handles all resize events
const handleResize = () => {
  window.addEventListener("resize", () => {
    resizeScreen();
  });
}


//Loop Music
const musicLoop = () => {
  musicPlayer.addEventListener('timeupdate', function(){
    //After music ends, there is a pause before repeat by default
    //Pause can be avoided by adding a buffer and starting from the beginning once the music reaches that far from the end of the song
    const buffer = 0.36;
    if(this.currentTime > this.duration - buffer){
        this.currentTime = 0
        this.play()
    }
  });
}

//------------------------------------------------Animate----------------------------------\\
const animate = () => {
  //Call this function repeatedly
  requestAnimationFrame(animate);

  //Resize canvas size to whatever screenWidth/screenHeight are after a resize event
  canvasContext.canvas.width = screenWidth;
  canvasContext.canvas.height = screenHeight;


  //During gameplay
  if (screen == "game" && pause == false) {
    wasteList.forEach(waste => {

      //Update positions of all waste items on screen
      waste.update();

      //Play sound effect if sorted correctly
      if(waste.hit() && waste.present == false) {
        //play the correct sound effect
        if (!(wasteList.length - 1 > 0 && tutorialPage == 5) && !(tutorialPage == 6)) {
          waste.correct.play();
        };

        //Add points/difficulty for each sorted waste in open curriculum mode
        if(openCurriculumMode) {
          if (mode == "abc") {
            score += 2;
            difficulty += 0.1;
          } else if (mode == "snc") {
            score += 1;
            difficulty += 0.07;
          } else if (mode == "audit") {
            difficulty += 0.05;
          };
        //if on Blueno boss or Ripta boss, each correctly sorted waste deals damage
        } else if (bossBegin == true && (level == 1 || level == 2)) {
          bossLife -= 10;
        //If correctly sorted during tutorial
        } else if (needsTutorial) {
          tutorialWasteHit(waste);
        }
        
      //If waste is out of bounds (player missed it)
      } else if (!waste.inBounds()) {
        //If player misses a waste item during the tutorial, activate tutorialWasteMiss() function
        if (needsTutorial) {
          tutorialWasteMiss(waste);
        //Lose a life if any normal waste item is missed
        } else if (waste.type != 'powerUp' && waste.type != 'powerDown') {
          waste.miss.play();
          lives -= 1;
          //End game (except in audit mode) if player runs out of lives
          if(lives <= 0 && mode != "audit") {
            //End game when all lives gone
            wasteList = [];
            clearAllTimeouts();
            fadeTo('winSong');
            screen = "end";
          };
        };
        
      //For Morning Mail and iClicker tutorial levels, add the morningMail or iClicker items after the waste item has gotten slightly down the play field
      } else if (waste.type != 'powerUp' && waste.type != 'powerDown' && needsTutorial && waste.xRatio <= (1 - 80 * waste.speed/screenWidth * screenWidth/800) && waste.xRatio >= (1 - 81 * waste.speed/screenWidth * screenWidth/800) && wasteList.length == 1) {
        if (tutorialPage == 5) {
          addSingleWaste("morningMail");
        } else if (tutorialPage == 6) {
          addSingleWaste("iClicker");
        }
      
      //Check if mouse is over the pembroke seal, and lose a life if it is
      //(Cannot put this in an event listener because pembroke seal can hit the cursor even if the cursor does not move)
      } else if (waste.name == 'pembroke') {
        pembrokePower(waste);
      };
    })
    
    //Remove all out-of-play (hit, clicked, or out of bounds) waste items
    wasteList = wasteList.filter(waste => {
      return waste.active;
    });


    // ** Draw appropriate screen **
    
    //Draw game if screen == "game"
    drawGame();
  } else if (screen == "title") {
    drawTitle();
  } else if (screen == "instruction1" || screen == "instruction2" || screen == "instruction3") {
    drawInstruction();
  } else if (screen == "end") {
    drawEnd();
  } else if (screen == "roundOver") {
    drawRoundOver();
  } else if (screen == "load") {
    drawLoad();
  };


  //Draw cursor
  canvasContext.drawImage(cursor.img, cursor.x, cursor.y, cursor.img.width*screenWidth/800* 2/3, cursor.img.height*screenHeight/600 * 2/3);
}



//-------------------------------------------------Game functions---------------------------------------\\

//Adds waste to the screen at random intervals
const addWaste = () => {
  let itemIndex;
  //If this is the first waste object, add it immediately without waiting for an interval to complete
  if (firstWaste) {
    firstWaste = false;
    if (bossBegin == false) {
      //isSpecial: random number from 0 to 9 to determine if this waste item is a special item (powerup or powerdown)
      let isSpecial = Math.floor(Math.random() * 10);
      //If it is a special item
      if (isSpecial >= 10 - specialFreq) {
        //itemIndex: object for the waste item chosen from wasteTypes array
        itemIndex = wasteTypes[Math.round(Math.random()*(specialTypes.length -1)) + (wasteTypes.length - specialTypes.length)];
      //If it is not a special item
      } else {
        //Select item from all non-special items based on the level
        itemIndex = places[level - 1][Math.round(Math.random()*(places[level - 1].length - specialTypes.length - 1))];
      };
    //If this is not a boss fight (no powerups or powerdowns in boss fights)
    } else {
      //Select item from all non-special items
      itemIndex = places[level - 1][Math.round(Math.random()*(places[level - 1].length - specialTypes.length - 1))];
    };
    
    //Do not add to waste list if game is paused
    if (pause == false) {
      wasteList.push(Waste({}, itemIndex));
    };
        
  }
  
  //Add at random intervals after first waste
  let timeBetween;
  if (bossBegin == true && level == 2) {
    //timeBetween determines the amount of time between adding waste items
    //timeBetween is set to 3000 ms for Ripta boss
    timeBetween = 3000;
    
  } else {
    //For all other cases, timeBetween is a random number that increases with difficulty
    timeBetween = Math.random()*2000 + 1500 / (difficulty / 1.5);
  };
    
  //Waste is added at random intervals (determined by timeBetween) as long as wasteRepeat is running
  wasteRepeat = setTimeout(function() {

    //Same process as first waste     
    if (bossBegin == false) {
      let isSpecial = Math.random() * 10;

      if (isSpecial >= 10 - specialFreq) {
        itemIndex = wasteTypes[Math.round(Math.random()*(specialTypes.length -1)) + (wasteTypes.length - specialTypes.length)];
      } else {
        itemIndex = places[level - 1][Math.round(Math.random()*(places[level - 1].length - specialTypes.length - 1))];
      };
    } else { //No powerUps or powerDowns in boss fights
      itemIndex = places[level - 1][Math.round(Math.random()*(places[level - 1].length - specialTypes.length - 1))];
    };
            
    if (pause == false) {
      wasteList.push(Waste({}, itemIndex));
    };
    
    //Call the same function again to add more waste
    addWaste();
  }, timeBetween);
};


//Starts adding waste items for a level
//firstWaste should be true whenever calling addWaste()
const startAddWaste = () => {
  firstWaste = true;
  wasteList = [];
  addWaste();
}


//Adds only a single waste item
const addSingleWaste = wasteName => {
  let itemIndex;
  for (let i = 0; i < wasteTypes.length; i++) {
    if (wasteTypes[i].name == wasteName) {
      itemIndex = wasteTypes[i];
    }
  }
  
  wasteList.push(Waste({}, itemIndex)); 
};


//Creates a string with the current game time
const clockTime = (time, interval) => {
  //Finds relevant values from the time given in the format: hour:minutes AM/PM
  let hourStr = time.substr(0,time.indexOf(':'))
  let minStr = time.substr(time.indexOf(':') + 1, 2)
  let dayNight = time.substr(time.length - 2, 2);
  
  //Converts string values of the time to integers
  let hourInt = parseInt(hourStr);
  let minInt = parseInt(minStr);

  //Increases the time by the inputted interval
  minInt = minInt + interval;
  if (minInt >= 60) {
    hourInt = hourInt + 1;
    minInt = minInt % 60;
  }
  
  //Adjusts for AM/PM
  if (hourInt == 12 && minInt == 0) {

    if (dayNight == 'AM') {
        dayNight = 'PM';
    } else {
        dayNight = 'AM';
    };
  } else if (hourInt > 12) {
    hourInt = hourInt % 12;
  };
  
  //Converts integer back into string
  if (minInt == 0) {
    minStr = '00';
  } else {
    minStr = minInt.toString();
  }
  hourStr = hourInt.toString();
  
  //Puts hour, minutes, and AM/PM together to form gameTime string
  gameTime = hourStr + ':' + minStr + ' ' + dayNight;
}

//Game timer
const timer = level => {
  //Start time based on the level
  if (level == 1) {
    gameTime = '6:00 PM';
  } else if (level == 3) {
    gameTime = '7:30 AM';
  } else if (level == 2) {
    gameTime = '11:00 AM';
  };
  
  //Timer interval
  progress = setInterval(function() {
    //End time based on level
    if ((level == 1 && gameTime == '2:00 AM') || (level == 3 && gameTime == '7:30 PM') || (level == 2 && gameTime == '2:00 AM')) {
      //Don't slow down anymore for Jo's Level
      speedUp = false;
      //Start boss fight
      boss = true;
      fadeTo('bossSong');
      //Remove all waste items
      wasteList = [];
      //Clear this interval and all others
      clearAllTimeouts();
      return;
    //During play, increase game time at regular intervals
    } else if (pause == false) {
      clockTime(gameTime, 30);
    };
  },3000); //should be 3000-----------------------------------------------------Changes speed of game
}


//Draw Boss Fight Images
const bossFight = level => {
  // ** Health Bar **
  //Draw health bar (scili) with x-position determined by boss health
  canvasContext.drawImage(healthBar, 0, 0, healthBar.width * bossLife/100, healthBar.height, screenWidth - healthBar.width * 1.25 * bossLife/100 * screenWidth/800, screenHeight * 0.8/10, healthBar.width * 1.25 * bossLife/100 * screenWidth/800, healthBar.height * 1.25 * screenHeight/600);
  //Draw "Boss Health" Label above health bar
  canvasContext.drawImage(healthLabel, screenWidth * 14/15 - healthLabel.width * screenWidth/800, screenWidth*0.3/10, healthLabel.width * screenWidth/800, healthLabel.height * screenHeight/600);
  
  //** Boss Image **
  //Blueno for level 1
  if (level == 1) {
    //Draw Blueno Sprite
    spriteUpdate(blueno, 1, 2, screenWidth * 14/15 - player.img.width/player.frames * screenWidth/800, screenHeight * 3/10 + (player.img.height - blueno.img.height) * screenHeight/600);
    
    //Draw Blueno introduction caption
    if (bossBegin == false) {
        canvasContext.drawImage(bluenoIntro, (800/2 - (bluenoIntro.width/1)/2) * screenWidth/800, (600/2 - (bluenoIntro.height/1)/2) * screenHeight/600, bluenoIntro.width/1 * screenWidth/800, bluenoIntro.height/1 * screenHeight/600);
    }
  
  //Rock Tree for level 3
  } else if(level == 3) {
    //Draw Rock Tree sprite to the right of the screen and the caption in the middle before boss fight begins
    if (bossBegin == false) {
      canvasContext.drawImage(rockTreeIntro, (800/2 - (rockTreeIntro.width/1)/2) * screenWidth/800, (600/2 - (rockTreeIntro.height/1)/2) * screenHeight/600, rockTreeIntro.width/1 * screenWidth/800, rockTreeIntro.height/1 * screenHeight/600);
      spriteUpdate(realTree, 1, 2, screenWidth * 14/15 - player.img.width/player.frames * screenWidth/800, screenHeight * 3/10 + (player.img.height - realTree.img.height) * screenHeight/600);
    //During the fight gameplay, draw the real tree and fake trees in random locations
    } else {
      realTree.draw()
      fakeTrees.forEach(function(tree) {
          tree.draw();
      })
    };
  
  //Ripta for level 2
  } else if(level == 2) {
    //Draw ripta sprite
    spriteUpdate(ripta, 1, 2, screenWidth * 14/15 - player.img.width/player.frames * screenWidth/800, screenHeight * 3/10 + (player.img.height - ripta.img.height) * screenHeight/600);
    //Draw Ripta introduction caption before boss fight gameplay
    if (bossBegin == false) {
      canvasContext.drawImage(riptaIntro, (800/2 - (riptaIntro.width/1)/2) * screenWidth/800, (600/2 - (riptaIntro.height/1)/2) * screenHeight/600, riptaIntro.width/1 * screenWidth/800, riptaIntro.height/1 * screenHeight/600);
    }
  }
  
  // ** Boss Fight End Sequence **
  //If boss defeated
  if (bossLife <= 0) {
    //End boss fight
    bossBegin = false;
    boss = false;
    roundWon = true;
    //Reset difficulty, boss health (for next level), and waste list
    bossLife = 100;
    difficulty = startDifficulty;
    wasteList = [];
    clearTimeout(wasteRepeat);
    
    //Change music
    fadeTo('winSong');
    
    //End game if that was the last boss
    if (level == 3) {
      openCurriculumUnlocked = true;
      screen = "end";
    };
  };
};


//Handle damage-blowing hits on the Rock Tree boss
const treeHit = () => {
  //For all hits (except for the initialization hit), subtract damage
  if (realTree.treesHit != 0) {
    bossLife -= 10;
  };
  
  //Move rock tree to a random location
  realTree.x = screenWidth/2 + Math.random() * screenWidth/2 - realTree.img.width/realTree.frames * screenWidth/800;
  realTree.y = screenHeight/3 + Math.random() * screenHeight/3;
  
  //Add to the treesHit counter to determine how many fake trees to draw
  realTree.treesHit += 1;
  
  //Add fake trees
  fakeTrees = [];
  for (let i = 0; i < realTree.treesHit; i++) {
    fakeTrees.push(newTrees());
  };
};


//Handle all challenge events (Last Call, Pho Line, Ice Cream Machine)
const challenges = () => {
  //For the last two hours of Jo's level, speed up gameplay and draw last call announcement
  if (level == 1 && boss == false && roundWon == false && (gameTime == '12:00 AM' || gameTime == '12:30 AM' || gameTime == '1:00 AM' || gameTime == '1:30 AM' || gameTime == '2:00 AM')) {
    //Only speed up gameplay if it has not already been sped up
    if (!speedUp) {
      difficulty = difficulty * 2;
    };
    speedUp = true;
    //Draw Last Call announcement
    canvasContext.drawImage(lastCall, (400 - 578/2) * screenWidth/800, screenHeight * 2/10, 578 * screenWidth/800, 34 * screenHeight/600);
  //From 9AM to 10:30AM, add ice cream view blocker and draw Broken Ice Cream Machine announcement
  } else if (level == 3 && (gameTime == '9:00 AM' || gameTime == '9:30 AM' || gameTime == '10:00 AM')) {
    //Draw Ice Cream view blocker
    canvasContext.drawImage(iceCream, screenWidth/4, screenHeight/5, screenWidth*3/4, screenHeight*3/4);
    //Draw broken ice cream machine announcement
    canvasContext.drawImage(brokenMachine, (400 - 553/2) * screenWidth/800, screenHeight * 2/10, 553 * screenWidth/800, 34 * screenHeight/600);
  //From 1PM to 2:30PM in Andrews, add Pho Line view blocker and announcement
  } else if (level == 2 && (gameTime == '1:00 PM' || gameTime == '1:30 PM' || gameTime == '2:00 PM')) {
    //Draw pho line view blocker
    canvasContext.drawImage(andrewsCrowd, screenWidth*500/800, screenHeight * 3/10, 344 * screenWidth/800, 287 * screenHeight/600);
    //Draw announcement
    canvasContext.drawImage(phoLine, (400 - 297/2) * screenWidth/800, screenHeight * 2/10, 297 * screenWidth/800, 34 * screenHeight/600);
  }
};


// ** Special Item Powers **

//iClicker Power timeout
const clickerPower = () => {
  //If multiple iClickers are clicked during the timeout, iClicker power ends when the last timeout ends
  startClick += 1;
  clickerTime = setTimeout(function() {
    startClick -= 1;
  }, 5000);
};

//morning mail power timeout
const mailPower = () => {
  //Slow down game
  difficulty = difficulty / 1.5;
  //If multiple morning mails are clicked during the timeout, speed game back up to normal when the last timeout ends
  //Each morning mail clicked during the timeout adds additional slowdown
  startMail += 1;
  mailTime = setTimeout(function() {
    difficulty = difficulty * 1.5;
    startMail -= 1;
  }, 5000);
};

//Pembroke Seal powerdown
const pembrokePower = waste => {
  //If the cursor is touching the pembroke seal, lose a life
  if (click(cursor.x, cursor.y, waste)) {
    //Play unhappy sound effect
    waste.miss.play();
    lives -= 1;
    //Remove the pembroke seal from play
    waste.active = false;
    //If the cursor touches the pembroke seal during the tutorial, add a new pembroke seal, but do not allow game to end
    if (needsTutorial) {
      addSingleWaste("pembroke");
      // prevents loss from happening during tutorial
      if (lives == -1) {
        lives = 3;
      }
    //If regular gameplay and player runs out of lives (not on audit mode), end game
    } 
    if(lives <= 0 && mode != "audit" && !needsTutorial) {
      wasteList = [];
      clearAllTimeouts();
      fadeTo('winSong');
      screen = "end";
    };
  };
};


//Determines if mouse is within sprite hitbox
const click = (mouseX, mouseY, sprite) => {
  return mouseX >= sprite.xRatio*screenWidth && mouseX <= sprite.xRatio*screenWidth + sprite.img.width/sprite.frames*screenWidth/800 && mouseY >= sprite.yRatio*screenHeight && mouseY <= sprite.yRatio*screenHeight + sprite.img.height*screenHeight/600;
}


//Draw text
const colorText = (text, centerX, centerY, fillColor) => {
  const textSize = 30 * screenHeight/600;
  const textFont = textSize + "px" + " Trash Dash";
  canvasContext.font = textFont;
  canvasContext.textAlign = "center";
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(text, centerX, centerY);
}


//Draw rectangles
const colorRect = (x, y, width, height, fillColor) => {
  canvasContext.fillStyle = fillColor;
  canvasContext.rect(x,y,width,height);
  canvasContext.fill();
}


//Calculate mouse position and return that as an x and y object value
const calculateMousePos = evt => {
  const rect = canvas.getBoundingClientRect(), root = document.documentElement;

  const mouseX = evt.clientX - rect.left - root.scrollLeft;
  const mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}


//Updates sprite sheets
const spriteUpdate = (sprite, startFrame, frameSum, x, y) => {
  //Every 17 game frames, the sprite sheet frame shifts
  //In the time between frame shifts, continue drawing the current sprite sheet frame
  if (frameTick != 17) {
    canvasContext.drawImage(sprite.img, (sprite.currentFrame - 1) * sprite.img.width/sprite.frames, 0, sprite.img.width/sprite.frames, sprite.img.height, x, y, sprite.img.width/sprite.frames*screenWidth/800, sprite.img.height*screenHeight/600);
    return;
  }

  // ** Handle frame shifts (frameTick == 17) **
  
  //If the sprite is currently on the last frame in its cycle, go back to the first frame in the cycle
  if (startFrame + (frameSum - 1) == sprite.currentFrame) {
    canvasContext.drawImage(sprite.img, (startFrame - 1) * sprite.img.width/sprite.frames, 0, sprite.img.width/sprite.frames, sprite.img.height, x, y, sprite.img.width/sprite.frames*screenWidth/800, sprite.img.height*screenHeight/600);
    sprite.currentFrame = startFrame;
  //If the sprite is not on the last frame in its cycle, move to the next frame
  } else {
    canvasContext.drawImage(sprite.img, sprite.currentFrame * sprite.img.width/sprite.frames, 0, sprite.img.width/sprite.frames, sprite.img.height, x, y, sprite.img.width/sprite.frames*screenWidth/800, sprite.img.height*screenHeight/600);
    sprite.currentFrame += 1;
  }
}


//Like spriteUpdate() but specifically for the Rock Tree Boss
const treeUpdate = (sprite, startFrame, x, y) => {
  //Keep drawing the current frame between frame shifts
  if (frameTick != 17) {
    canvasContext.drawImage(sprite.img, (sprite.currentFrame - 1) * sprite.img.width/sprite.frames, 0, sprite.img.width/sprite.frames, sprite.img.height, x + sprite.treeTap * 114/10 /2 * screenWidth/800, y + sprite.treeTap * 208/10 * screenHeight/600, sprite.width*screenWidth/800, sprite.height*screenHeight/600);
  //If it is a frame shift (frameTick == 17) and the sprite is on its last frame (2nd frame), cycle back to the first
  } else if (startFrame + 1 <= sprite.currentFrame) {
    canvasContext.drawImage(sprite.img, (startFrame - 1) * sprite.img.width/sprite.frames, 0, sprite.img.width/sprite.frames, sprite.img.height, x + sprite.treeTap * 114/10 / 2 * screenWidth/800, y + sprite.treeTap * 208/10 * screenHeight/600, sprite.width*screenWidth/800, sprite.height*screenHeight/600);
    sprite.currentFrame = startFrame;
  //If it is a frame shift (frameTick == 17) and the sprite is on its first frame, move to the second
  } else {
    canvasContext.drawImage(sprite.img, sprite.currentFrame * sprite.img.width/sprite.frames, 0, sprite.img.width/sprite.frames, sprite.img.height, x + sprite.treeTap * 114/10 /2 * screenWidth/800, y + sprite.treeTap * 208/10 * screenHeight/600, sprite.width*screenWidth/800, sprite.height*screenHeight/600);
    sprite.currentFrame += 1;
  }
};


//Change player type based on key press
//Default is black
player.shirtColor = function(key = 0) {
  let sheetNum;
  
  //If D, W, or A pressed, do not allow any other color changes as long as colorChange is true
  if (key == 68 || key == 87 || key == 65) {
    colorChange = true;
    
    //If D key pressed, change player.type to 'gray' (trash)
    if (key == 68) {
      sheetNum = 4;
      player.type = 'gray';
    //If W key pressed, change player.type to 'green' (compost)
    } else if (key == 87) {
      sheetNum = 3;
      player.type = 'green'
    //If A key pressed, change player.type to 'blue' (recycling)
    } else if (key == 65) {
      sheetNum = 2;
      player.type = 'blue';
    //All other key presses keep player.type as 'black' (default)
    } else {
      sheetNum = 1;
      player.type = 'black';
    };
  
    //Highlight the corresponding direction button
    directionButtons.forEach(function(button) {
        button.action(key);
    })
    
    //Move the player sprite to the correct color without resetting the run animation to its first frame
    player.currentFrame += 4 * (sheetNum - Math.ceil(player.currentFrame/4));
    
    //After timeout ends, player can change colors again
    setTimeout(function() {
      //Reset player.type to the default
      player.type = 'black';
      
      //Reset player sprite animation to black
      player.currentFrame += 4 * (1 - Math.ceil(player.currentFrame/4));
      //Unhighlight all direction buttons
      directionButtons.forEach(function(button) {
        button.action(0);
      })

      colorChange = false;
    //this timeout length determines the wait time before changing colors 
    }, 500); 
  };
};


//Draw the player sprite
player.draw = function() {
  //Draw the static player image between rounds
  if (roundWon == true) {
    canvasContext.drawImage(playerStatic, screenWidth/15, screenHeight*3/10, playerStatic.width*screenWidth/800, playerStatic.height*screenHeight/600);
  //Draw the black shirt player run sequence
  } else if (player.type == 'black') {
    spriteUpdate(player, 1, 4, screenWidth/15, screenHeight*3/10);
  //Draw the blue shirt player run sequence
  } else if (player.type == 'blue') {
    spriteUpdate(player, 5, 4, screenWidth/15, screenHeight*3/10);
  //Draw the green shirt player run sequence
  } else if (player.type == 'green') {
    spriteUpdate(player, 9, 4, screenWidth/15, screenHeight*3/10);
  //Draw the gray shirt player run sequence
  } else if (player.type == 'gray') {
    spriteUpdate(player, 13, 4, screenWidth/15, screenHeight*3/10);
  };
}


//Resize the canvas maintaining 600/800 aspect ratio whenever the window is resized
function resizeScreen() {
  //redraw canvas such that screenHeight/screenWidth = 600/800 for any window
  document.body.style.height = window.innerHeight + 'px';
  if (window.innerWidth < window.innerHeight*800/600) {
    screenWidth = (window.innerWidth * 0.9);
    screenHeight = (window.innerWidth * 0.9)*600/800;
  } else {
    screenWidth = (window.innerHeight * 0.9)*800/600;
    screenHeight = (window.innerHeight * 0.9);
  }
}


//Restarts the game
const newGame = () => {
  screen = "game";
  lives = startLives;
  score = 0;
  difficulty = startDifficulty;
  if (!openCurriculumMode) {
    level = 1;
  } else {
    level = 4;
  };
  boss = false;
  bossBegin = false;
  roundWon = false;
  startClick = 0;
  startMail = 0;
  speedUp = false;
  keyList = [];

  startAddWaste();

  player.type = 'black';
  if (!openCurriculumMode) {
      timer(level);
  };
};


//Starts tutorial
const startTutorial = () => {
  //Go to first page of tutorial
  tutorialPage = 0;
  screen = "game";
  lives = startLives;
  score = 0;
  difficulty = startDifficulty;
  level = 1;
  wasteList = [];
  boss = false;
  bossBegin = false;
  roundWon = false;
  startClick = 0;
  startMail = 0;
  speedUp = false;
  keyList = [];
  player.type = 'black';
  wasteList = [];
};


//Pause game if not paused, or unpause game if paused
const togglePause = () => {
  //Pause game if not paused (go to first page of instructions)
  if (pause == false) {
    screen = "instruction1";
    pause = true;
  //Unpause game if paused
  } else {
    screen = "game";
    pause = false;
  }
};


//Draw Special item notifications and between-round screens
const notifications = () => {
  //Draw between-round notifications for rounds 1 and 2 (after round 3, game goes to end screen)
  if (roundWon == true) {
    if (level == 1) {
      canvasContext.drawImage(complete1, (800/2 - (complete1.width/1)/2) * screenWidth/800, (600/2 - (complete1.height/1)/2) * screenHeight/600, complete1.width/1 * screenWidth/800, complete1.height/1 * screenHeight/600);
    } else if (level == 2) {
      canvasContext.drawImage(complete2, (800/2 - (complete2.width/1)/2) * screenWidth/800, (600/2 - (complete2.height/1)/2) * screenHeight/600, complete2.width/1 * screenWidth/800, complete2.height/1 * screenHeight/600);
    };
  //Draw special item notifications
  } else {
    //Draw Morning Mail announcements (including "Join Scrap")
    if (startMail > 0) {
      canvasContext.drawImage(todayNotification, screenWidth - (todayNotification.width * 1.5 + 10) * screenWidth/800, 10 * screenHeight/600, todayNotification.width * 1.5 * screenWidth/800, todayNotification.height * 1.5 * screenHeight/600);

      canvasContext.drawImage(announcement1, (800/2 - announcement1.width/2) * screenWidth/800, screenHeight/3 + (player.img.height + 5) * screenHeight/600, announcement1.width * screenWidth/800, announcement1.height * screenHeight/600);
      
      //If player has iClicker and morning mail at the same time, put the announcements at different heights
      if (startClick > 0) {
        canvasContext.drawImage(clickerNotification, screenWidth - (clickerNotification.width * 1.5 + 10) * screenWidth/800, 50 * screenHeight/600, clickerNotification.width * 1.5 * screenWidth/800, clickerNotification.height * 1.5 * screenHeight/600);
      }
    //If player just has iClicker, draw that announcement in the top right
    } else if (startClick > 0) {
      canvasContext.drawImage(clickerNotification, screenWidth - (clickerNotification.width * 1.5 + 10) * screenWidth/800, 10 * screenHeight/600, clickerNotification.width * 1.5 * screenWidth/800, clickerNotification.height * 1.5 * screenHeight/600);
    }
  }
};


//Load caption interval
const loadAction = () => {
  screen = "load";
  
  //Update the load caption at the end of each iteration of the interval
  let loadInterval = setInterval(function() {
    if (loadStep == 5) {
      clearInterval(loadInterval);
    }

    if (loadCaptionCount == 5) {
      loadStep += 1;
    };
  }, 1000);
    
};


//end all gameplay timeouts and intervals
const clearAllTimeouts = () => {
  clearTimeout(mailTime);
  difficulty = startDifficulty;
  startMail = 0;
  
  clearTimeout(clickerTime);
  startClick = 0;
  
  clearTimeout(wasteRepeat);
  
  clearInterval(progress);
}


//Fade in music
const fadeIn = () => {
  let fadeInInterval = setInterval(function() {
    if (musicPlayer.volume <= 0.4) {
      musicPlayer.volume += 0.1;
    } else {
      clearInterval(fadeInInterval);
    }
    
  }, 100);
  
}


//Fade out of current background song and into inputted song
const fadeTo = songTitle => {
  //Create a promise that resolves when the current song is faded out completely
  const toNewSongPromise = new Promise((resolve, reject) => {
    //Fade song out slightly at each iteration of the interval
    let fadeOutInterval = setInterval(() => {
      if (musicPlayer.volume >= 0.1) {
        musicPlayer.volume -= 0.1;
      } else {
        //If music is not paused, play the new song immediately
        if (!musicPlayer.paused) {
          musicPlayer.src = "music/" + songTitle + ".m4a";
          musicPlayer.play();
        //If music is paused, change to the new song, but leave it paused
        } else {
          musicPlayer.src = "music/" + songTitle + ".m4a";
        };
        
        //Once the song is faded out all the way, end the fade out interval
        clearInterval(fadeOutInterval);

        resolve();
      }

    }, 50);
  //Once song is completely faded out and changed to the new song, bring volume back up
  }).then(fadeIn);
}


//Update the game frame tick at every iteration of animate() whenever there are sprites
const tickUpdate = () => {
  frameTick += 1;
  if (frameTick > 17) {
    frameTick = 0;
  };
}


//Start a new game at the end of the tutorial
const endTutorial = () => {
  tutorialPage = 0;
  needsTutorial = false;
  newGame();
}


//Determine what to do when a waste item is sorted in the tutorial
const tutorialWasteHit = waste => {
  //Move to the next page for chip and coldCup page
  //Move to the next page for Morning Mail page if morning mail was already clicked
  if (wasteList.length - 1 == 0 && tutorialPage != 6) {
    tutorialPage ++;
  //If morning mail not clicked yet, or if the player is on iClicker page, start the activity again
  } else if (tutorialPage == 5 || tutorialPage == 6) {
    waste.miss.play();
    wasteList = [];
    addSingleWaste(waste.name);
  }
  clearAllTimeouts();
}


//Determine what to do when a waste item is missed in the tutorial
const tutorialWasteMiss = waste => {
  
  //Move to the next page for the Pembroke Seal
  if (tutorialPage == 8) {
    waste.correct.play();
    tutorialPage ++;
  //For all other pages
  } else {
    waste.miss.play();
    
    //If morning mail or iClicker are missed, add a random waste item
    //New morning mail / iClicker will be added when the new waste reaches a certain x position
    if (waste.name == 'morningMail' || waste.name == 'iClicker') {
      let newWaste = wasteTypes[Math.floor(Math.random()*(wasteTypes.length - 4))];
      addSingleWaste(newWaste.name);
    } else {
      //Lose a life in the coldCup section (but do not allow game to end if lives <= 0)
      if (tutorialPage == 7) {
        lives --;
      //If regular waste is missed on the morning mail or iClicker page, start the activity over
      } else if (tutorialPage == 5 || tutorialPage == 6) {
        wasteList = [];
      }
      
      //Add this waste item again
      addSingleWaste(waste.name);
    };
  };
}


//Determine what to do when a waste item is clicked in the tutorial
const tutorialWasteClick = () => {
  //If Morning Mail or iClicker clicked after the other waste was already sorted, start over the activity
  if (wasteList.length - 1 == 0) {
    let newWaste = wasteTypes[Math.floor(Math.random()*(wasteTypes.length - 4))];
    addSingleWaste(newWaste.name);
    
    clearAllTimeouts();
  }
}


//Draw the tutorial caption centered vertically and slightly to the right of center
const drawEachTutorial = page => {
  canvasContext.drawImage(page, (800 - tutorial1.width - 20) * screenWidth/800, (600/2 - page.height/2) * screenHeight/600, page.width * screenWidth/800, page.height * screenHeight/600);
}


//Draw the proper tutorial caption (do not draw captions if playing the activity)
const drawTutorial = () => {
  if (tutorialPage == 0) {
    drawEachTutorial(tutorial0);
  } else if (tutorialPage == 1) {
    drawEachTutorial(tutorial1);
  } else if (tutorialPage == 2) {
    drawEachTutorial(tutorial2);
  } else if (tutorialPage == 3 && wasteList.length == 0) {
    drawEachTutorial(tutorial3);
  } else if (tutorialPage == 4 && wasteList.length == 0) {
    drawEachTutorial(tutorial4);
  } else if (tutorialPage == 5 && wasteList.length == 0) {
    drawEachTutorial(tutorial5);
  } else if (tutorialPage == 6 && wasteList.length == 0) {
    drawEachTutorial(tutorial6);
  } else if (tutorialPage == 7 && wasteList.length == 0) {
    drawEachTutorial(tutorial7);
  } else if (tutorialPage == 8 && wasteList.length == 0) {
    drawEachTutorial(tutorial8);
  } else if (tutorialPage == 9) {
    canvasContext.drawImage(tutorial9, (800 - tutorial1.width - 20) * screenWidth/800, (600/2 - tutorial9.height/3) * screenHeight/600, tutorial9.width * screenWidth/800, tutorial9.height * screenHeight/600);
  } else if (tutorialPage == 10) {
    drawEachTutorial(tutorial10);
  }
}


//Set up canvas, canvasContext, and determine resize properties
const setup = () => {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  canvasContext.mozImageSmoothingEnabled = false;
  canvasContext.webkitImageSmoothingEnabled = false;
  canvasContext.msImageSmoothingEnabled = false;
  canvasContext.imageSmoothingEnabled = false;
}

// -----------------------------------------    Draw Screens ---------------------------------------------//


//This function draws everything on the screen
const drawGame = () => {
  //Update game frame tick
  tickUpdate();
  
  // ** Draw Level Backgrounds **
  
  if (!openCurriculumMode) {   
    //Draw Jo's Level background
    if (level == 1) {
      canvasContext.drawImage(josBackground,0,0, screenWidth, screenHeight);
    //Draw Ratty Background (change it slightly for Easter Eggs)
    } else if (level == 3) {
      if (rattyVersion == 0) {
        canvasContext.drawImage(rattyBackground, 0, 0, screenWidth, screenHeight);
      } else if (rattyVersion == 1) {
        canvasContext.drawImage(rattyEasterEgg, 0, 0, screenWidth, screenHeight);
      } else if (rattyVersion == 2) {
        canvasContext.drawImage(rodentEasterEgg, 0, 0, screenWidth, screenHeight);
      }
    //Draw Andrews Level Background
    } else if (level == 2) {
      canvasContext.drawImage(andrewsBackground, 0, 0, screenWidth, screenHeight);
    };
  //Draw Open Curriculum Mode Background
  } else {
    canvasContext.drawImage(bossBackground, 0, 0, screenWidth, screenHeight);
  };
  
  //Draw player sprite
  player.draw();
  
  
  //Draw boss fight
  if (boss == true) {
      bossFight(level);
  }   


  //Draw tutorial
  if (needsTutorial) {
    drawTutorial();
  };


  //Draw every waste item on screen
  wasteList.forEach(function(waste) {
    waste.draw();
  });


  //Draw all challenges (Last Call, Pho Line, Ice Cream)
  challenges();
  
  
  //Draw direction buttons (A,W,D)
  directionButtons.forEach(function(button) {
    button.draw();
  });


  //Draw all notifications (Morning Mail, Join Scrap, iClicker)
  notifications();


  //Draw pause button and sound buttons
  buttons.forEach(function(button) {
    if (button.name == "pauseButton" || (button.name == "volumeButton" && mute == true) || (button.name == "muteButton" && mute == false)) {
      button.draw();
    };
  });

  
  //Only draw lives for regular game or last two tutorial activities
  if (!needsTutorial || tutorialPage == 7 || tutorialPage == 8 || openCurriculumUnlocked) {
    //Draw Lives
    canvasContext.drawImage(wordBackground, screenWidth* 0.5/10, screenHeight*0.8/10, screenWidth*2.5/10, screenHeight*1/10);
    colorText("LIVES: " + lives, screenWidth * 0.5/10 + screenWidth*2.5/10/2, screenHeight*1.6/10, 'black');
  };


  //Do not draw time for the tutorial
  if (!needsTutorial) {
    //Draw score for open curriculum, time left for game
    canvasContext.drawImage(wordBackground, screenWidth*3.75/10, screenHeight*0.8/10, screenWidth*2.5/10, screenHeight*1/10);
    if (!openCurriculumMode) {
      colorText(gameTime, screenWidth/2, screenHeight*1.6/10, 'black');
    } else {
      colorText("SCORE: " + score, screenWidth/2, screenHeight*1.6/10, 'black');
    };    
  };
}


//Draw Title screen
const drawTitle = () => {
  //Draw Background
  canvasContext.drawImage(vanWickle, 0,0, screenWidth, screenHeight);

  //Draw title
  if (plmeMode == false && riptaTitle == false) {
    canvasContext.drawImage(title, screenWidth/2 - (title.width*screenWidth/800)/2, 10*screenHeight/600, screenWidth*title.width/800, screenHeight*title.height/600);
  //Draw plme Easter Egg title
  } else if (plmeMode) {
    canvasContext.drawImage(plmeTitle, screenWidth/2 - (plmeTitle.width*screenWidth/800)/2, 10*screenHeight/600, screenWidth*plmeTitle.width/800, screenHeight*title.height/600);
  //Draw Ripta Easter Egg Title
  } else if (riptaTitle) {
    canvasContext.drawImage(riptaEasterEgg, screenWidth/2 - (riptaEasterEgg.width*screenWidth/800)/2, 10*screenHeight/600, screenWidth*riptaEasterEgg.width/800, screenHeight*riptaEasterEgg.height/600);
  }


  //Draw all menu buttons
  menuButtons.forEach(function(button) {
    if (button.name == "playButton" || button.name == "helpButton" || button.name == "moreButton" || (button.name == "openCurriculum" && openCurriculumUnlocked) || (button.name == "abc" && mode != "abc" && plmeMode == false) || (button.name == "snc" && mode != "snc" && plmeMode == false) || (button.name == "audit" && mode != "audit" && plmeMode == false) || (button.name == "volumeButton" && mute == true) || (button.name == "muteButton" && mute == false)) {
      button.draw();
    };
  });
  
  
  //Draw difficulty buttons with the selected one in its selected state
  if (mode == "abc") {
    canvasContext.drawImage(abcStatic, (800/2 + 30 + 24 - (87/2 - 57/2)) * screenWidth/800, (600 * 9.4/10 - (26/2 - 17/2)) * screenHeight/600, 50 * screenWidth/800, 26 * screenHeight/600);
  } else if (mode == "snc") {
    canvasContext.drawImage(sncStatic, (800/2 - 70/2) * screenWidth/800, (600 * 9.4/10 - (26/2 - 17/2))* screenHeight/600, 70 * screenWidth/800, 26 * screenHeight/600);
  } else { //Audit
    canvasContext.drawImage(auditStatic, ((800/2 - 24) - (50 + 37) - (50/2 - 38/2)) * screenWidth/800, (600 * 9.4/10 - (26/2 - 17/2)) * screenHeight/600, 87 * screenWidth/800, 26 * screenHeight/600);
  }
  
  //Draw difficulty mode caption
  canvasContext.drawImage(difficultyMode, screenWidth/2 - 62 * screenWidth/800, screenHeight * 8.9/10, 123 * screenWidth/800, 17 * screenHeight/600);


  //Draw BiG logo
  // if (!bigClicked) {
  //   canvasContext.drawImage(bigLogo, screenWidth*5/800, screenHeight*495/600, bigLogo.width*screenWidth/800, bigLogo.height*screenHeight/600);
  // //Draw BiG sprite Easter Egg
  // } else {
  //   tickUpdate();
  //   spriteUpdate(bigSprite, 1, 2, screenWidth*5/800, screenHeight*495/600);
  // };
}


const drawInstruction = () => {
  //Draw background
  if (pause == false) {
    canvasContext.drawImage(vanWickle, 0, 0, screenWidth, screenHeight);
  } else if (level == 1) {
    canvasContext.drawImage(josBackground, 0, 0, screenWidth, screenHeight);
  } else if (level == 3) {
    canvasContext.drawImage(rattyBackground, 0, 0, screenWidth, screenHeight);
  } else if (level == 2) {
    canvasContext.drawImage(andrewsBackground, 0, 0, screenWidth, screenHeight);
  } else if (level == 4) {
    canvasContext.drawImage(bossBackground, 0, 0, screenWidth, screenHeight);
  };

  //Decide which page of instructions to display
  if (screen == "instruction1") {
    canvasContext.drawImage(instructions1, 0, 0, screenWidth, screenHeight);
  } else if (screen == "instruction2") {
    canvasContext.drawImage(instructions2, 0, 0, screenWidth, screenHeight);
  } else if (screen == "instruction3") {
    canvasContext.drawImage(instructions3, 0, 0, screenWidth, screenHeight);
  }

  //Draw all necessary menu buttons
  menuButtons.forEach(function(button) {
    if ((button.name == "backButton" && (pause == false || (screen == "instruction2" || screen == "instruction3"))) || button.name == "playButton") {
      button.draw();
    } else if (button.name == "nextButton" && (screen == "instruction1" || screen == "instruction2")) {
      button.draw();
    } else if (button.name == "menuButton" && screen == "instruction1" && pause == true) {
      button.draw();
    } else if ((button.name == "volumeButton" && mute == true) || (button.name == "muteButton" && mute == false)) {
      button.draw();
    };
  });

  
  //Draw descriptive buttons on the second instruction page
  if(screen == "instruction2") {
    descriptiveButtons.forEach(function(button) {
      button.draw();
    });
    for (let i = 0; i < descriptiveButtons.length; i++) {
      descriptiveButtons[i].drawDescription();
    };
  }; 
};


//Draw End Screen
const drawEnd = () => {  
  //Calculate high score for Open Curriculum Mode
  if (openCurriculumMode && score > highScore) {
    highScore = score;
  };
  
  //Draw Win Screen
  if (!openCurriculumMode) {
    //Draw all necessary menu buttons
    menuButtons.forEach(function(button) {
      if (button.name == "menuButton" || button.name == "helpButton" || button.name == "playButton" || (button.name == "openCurriculum" && openCurriculumUnlocked) || (button.name == "volumeButton" && mute == true) || (button.name == "muteButton" && mute == false)) {
        button.draw();
      };
    });
  }
  if (!openCurriculumMode && lives > 0) {
    canvasContext.drawImage(winScreen, 0, 0, screenWidth, screenHeight);

    //Draw William Easter Egg in Win Screen
    if (williamWasHere) {
      canvasContext.drawImage(williamEasterEgg, 15*screenWidth/800, 365*screenHeight/600, 34*screenWidth/800, 34*screenWidth/800 * williamEasterEgg.height/williamEasterEgg.width);
    }
    
  //Draw Lose Screen
  } else if (!openCurriculumMode && lives < 1) {
    canvasContext.drawImage(loseScreen, 0, 0, screenWidth, screenHeight);
  //Draw Open Curriculum End Screen
  } else if (openCurriculumMode && endScreen == 'initials') {
    canvasContext.drawImage(openCurriculumEnd, 0, 0, screenWidth, screenHeight);
    letterButtons.forEach(function(button, i) { 
        button.draw();
        colorText(button.letter,(i % 13 * 0.0556 * screenWidth) + 2.9/18 * screenWidth, (Math.floor(i / 13) * screenHeight*1.1/10)+ 6.65/10*screenHeight, 'black');
    })
    backspaceButton.draw();
    nextInitialButton.draw();
    canvasContext.drawImage(initialsBase, screenWidth*3/10, screenHeight*2.5/10, screenWidth*4/10, screenHeight*3/10);
    colorText(initials, screenWidth / 2, screenHeight * 5.1 / 10)

    //Draw Score
    canvasContext.drawImage(wordBackground, screenWidth*3.75/10, screenHeight*0.4/10, screenWidth*2.5/10, screenHeight*1/10);
    colorText("SCORE: " + score, screenWidth/2, screenHeight*1.2/10, 'black');
    apiCall = true;
  }
  if (endScreen == 'leaderboards') { // If the user has finished entering their initials
    canvasContext.drawImage(highscoresBackground, 0, 0, screenWidth, screenHeight);
    colorText("Great job, " + initials, screenWidth * 2.95/4, screenHeight * 2.8 / 10)
    if (winner) {
      colorText("Send a photo of", screenWidth * 2.95/ 4, screenHeight * 3.4 / 10)
      colorText("this screen to", screenWidth * 2.95/ 4, screenHeight * 4 / 10)
      colorText("get a prize.", screenWidth * 2.95/ 4, screenHeight * 4.6 / 10)
    } else {
      colorText("Score in the", screenWidth * 2.95/ 4, screenHeight * 3.4 / 10)
      colorText("top 5 to win", screenWidth * 2.95/ 4, screenHeight * 4 / 10)
      colorText("a prize.", screenWidth * 2.95/ 4, screenHeight * 4.6 / 10)
    }
    if (scores.length > 0) {
      // if we've received leaderboard information from the server
      scores.forEach(function(s, i) {
        colorText((i + 1) + ".", screenWidth / 8.2, screenHeight * (3.6 + 0.8 * i) / 10)
        colorText(s.initials, screenWidth / 5, screenHeight * (3.6 + 0.8 * i) / 10)
        colorText(s.points, screenWidth / 2.6, screenHeight * (3.6 + 0.8 * i) / 10)
      })
    } else {
      // write server error
      colorText("Loading Server.", screenWidth / 4, screenHeight * 5 / 10)
      colorText("Please wait.", screenWidth / 4, screenHeight * 5.6 / 10)
    }
    colorText(initials, screenWidth / 5, screenHeight * (3.6 + 0.8 * 5) / 10)
    colorText(score, screenWidth / 2.6, screenHeight * (3.6 + 0.8 * 5) / 10)
    //Draw menu button for the end of the open curriculum section
    opMenuButton.draw();

    if (apiCall) {
      const url = 'https://td-server.herokuapp.com/post-score'
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          initials,
          points: score,
        }),
        headers: {"Content-Type": "application/json"},
      })
      .then(response => response.json())
      .then(data => {
        if (data.winner) {
          winner = true
        }
        console.log(data)
        scores = data.scores
      })
      .catch(error => {
        winner = false
        scores = false
      })
      apiCall = false; // reset boolean such that the API will not be called again
    }
  }
}


const drawLoad = () => {
  //Update frame tick for the loading sprite
  tickUpdate();
    
  //Draw background
  colorRect(0, 0, screenWidth, screenHeight, '#00cb00');
  
  //Draw loading sprite
  spriteUpdate(loading, 1, 3, (800 - loading.img.width/3)/2 * screenWidth/800, (600 - loading.img.height)/2 * screenHeight/600);

  //Draw the proper caption
  if (loadCaptionCount == 5) {
    if (loadStep == 0) {
      canvasContext.drawImage(load1, (800 - load1.width)/2 * screenWidth/800, screenHeight*2/3, load1.width*screenWidth/800, load1.height*screenHeight/600);
    } else if (loadStep == 1) {
      canvasContext.drawImage(load2, (800 - load2.width)/2 * screenWidth/800, screenHeight*2/3, load2.width*screenWidth/800, load2.height*screenHeight/600);
    } else if (loadStep == 2) {
      canvasContext.drawImage(load3, (800 - load3.width)/2 * screenWidth/800, screenHeight*2/3, load3.width*screenWidth/800, load3.height*screenHeight/600);
    } else if (loadStep == 3) {
      canvasContext.drawImage(load4, (800 - load4.width)/2 * screenWidth/800, screenHeight*2/3, load4.width*screenWidth/800, load4.height*screenHeight/600);
    } else if (loadStep == 4) {
      canvasContext.drawImage(load5, (800 - load5.width)/2 * screenWidth/800, screenHeight*2/3, load5.width*screenWidth/800, load5.height*screenHeight/600);
    } else if (loadStep == 5) {
      //Only go on to title screen once all images are loaded
      if (loadCount >= 156) {
        screen = "title";
      };
    };
  };
};