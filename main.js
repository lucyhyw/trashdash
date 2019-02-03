

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
let mode = "abc";
//Determines how many lives the player starts with. Determined by difficulty mode
let startLives = 3;
//Determines starting difficulty of a round. Determined by difficulty mode
let startDifficulty = 1.7;
//Game mode without bosses or time countdown
let openCurriculumMode = false;
/*open curriculum mode is unlocked when all 3 levels are beaten.
When true open curriculum button appears and the mode becomes playable */
let openCurriculumUnlocked = false;


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
//Which level the player is on. Set in newGame() function
let level;
//Indicates whether or not the round has been won (and boss defeated)
let roundWon = false;

// ** Easter Eggs **
//BiG Easter Egg: true indicates BiG logo has been clicked
let bigClicked = false;
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
let staticImageText = ["title", "clickToPlay", "pressSpaceForInstructions", "bigLogo", "vanWickle", "instructions1", "instructions2", "instructions3", "josBackground", "rattyBackground", "andrewsBackground", "bossBackground", "iceCream", "andrewsCrowd", "wordBackground", "healthBar", "lastCall", "brokenMachine", "phoLine", "winScreen", "loseScreen", "openCurriculumEnd", "difficultyMode", "abcStatic", "sncStatic", "auditStatic", "plmeTitle", "bluenoIntro", "rockTreeIntro", "riptaIntro", "complete1", "complete2", "todayNotification", "clickerNotification", "announcement1", "healthLabel", "tutorial0", "tutorial1", "tutorial2", "tutorial3", "tutorial4", "tutorial5", "tutorial6", "tutorial7", "tutorial8", "tutorial9", "tutorial10", "rattyEasterEgg", "rodentEasterEgg", "williamEasterEgg", "riptaEasterEgg"];
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


//Direction Buttons
var directionButtons = [
new directionButton(65, 800/2 - 52*1.5 - (30*1.5)/2, 600*7.7/10 + 52*1.5), //A
new directionButton(68, 800/2 + 30*1.5 - (30*1.5)/2, 600*7.7/10 + 52*1.5), //D
new directionButton(87, 800/2 - (30*1.5)/2, 600*7.7/10)]; //W


//Menu Buttons
var menuButtons = [
new Button("moreButton", 800 * 1/10, 600 * 7/10, function() {
    if (this.hover && screen == "title") {
        window.open("https://www.brown.edu/initiatives/brown-is-green/home");
        plmeCount += 1;
        if (plmeCount >= 10) {
            plmeMode = true;
            mode = "snc";
            startLives = 10;
        };
    };
}),

new Button("menuButton", 800 * 1/10, 600 * 7/10, function() {
    if (this.hover && (screen == "end" || (screen == "instruction1" && pause == true))) {
        if (pause == true) {
            pause = false;
            //clearInterval(progress);
            wasteList = [];
            difficulty = 1.5;
            //clearTimeout(wasteRepeat);
            //clearTimeout(clickerTime);
            //clearTimeout(mailTime);
            //mailTime = null;
            //actionSong.pause();
            clearAllTimeouts();
        };
        
        fadeTo('actionSong');
        screen = "title";
    }
}),

new Button("backButton", 800 * 1/10, 600 * 7/10, function() {
    if (this.hover) {
        //Go to title if on first page of instructions or go back one page if not when backButton pressed
        if (screen == "instruction1" && pause == false) {
            screen = "title";
        } else if (screen == "instruction2") {
            screen = "instruction1";
        } else if (screen == "instruction3") {
            screen = "instruction2";
        }
    }
}),

new Button("nextButton", 800 * 9/10 - 150, 600 * 7/10, function() {
    if(this.hover) {
        //Go to the next page unless you are on the last page
        if (screen == "instruction1") {
            screen = "instruction2";
        } else if (screen == "instruction2") {
            screen = "instruction3";
            if (!pause) {
              needsTutorial = false;
            }
        };
    };
}),
new Button("playButton", 800/2 - 150/2, 600 * 7.5/10, function() {
    if (this.hover) {
        bigClicked = false;
        console.log(loadCount);
        //Start game when playButton pressed
        if (pause == false) {
            openCurriculumMode = false;
            fadeTo('actionSong');
            if (!needsTutorial) {
              newGame();
            } else {
              startTutorial();
            }
        } else {
            togglePause();
        };
        this.hover = false;
    }
}),


new Button("helpButton", 800 * 9/10 - 150, 600 * 7/10, function() {
    if(this.hover && (screen == "end" || screen == "title")) {
        bigClicked = false;
        screen = "instruction1";
    }
}),

new Button("openCurriculum", 800/2 - 150/2, 600 * 6/10, function() {
    if (this.hover && openCurriculumUnlocked == true) {
        openCurriculumMode = true;
        fadeTo('actionSong');
        newGame();
    };
}),

new Button("abc", (400 - 24) - (50 + 37), 600 * 9.4/10, function() {
    if(this.hover && screen == "title" && plmeMode == false) {
        mode = "abc";
        startDifficulty = 1.7;
        startLives = 3;
    }
}),

new Button("snc", 400 - 24, 600 * 9.4/10, function() {
    if (this.hover && screen == "title" && plmeMode == false) {
        mode = "snc";
        startDifficulty = 1.3;
        startLives = 10;
    }
}),

new Button("audit", (400 + 24) + 50, 600 * 9.4/10, function() {
    if (this.hover && screen == "title" && plmeMode == false) {
        mode = "audit";
        startDifficulty = 1;
        startLives = 0;
    };
}),

new Button("pauseButton", 800 * 6.9/10, 600 * 9.4/10 + 6, function() {
    if (this.hover && screen == "game") {
        togglePause();
    };
}),

new Button("muteButton", 800 * 8/10, 600 * 9.4/10, function() {
    if (this.hover && mute == true) {
        mute = false;
        
        musicPlayer.play();
    };
}),

new Button("volumeButton", 800 * 8/10, 600 * 9.4/10, function() {
    if (this.hover && mute == false) {
        mute = true;
        //actionSong.pause();
        mute = true;
        musicPlayer.pause();
    }
})];


//Descriptive Buttons
var descriptiveButtons = [
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
new descriptiveButton("toGo", 275, 260, 400 - 534/2, 600 - 271),
new descriptiveButton("pizza", 370, 270, 400 - 534/2, 600 - 271),
new descriptiveButton("tea", 470, 250, 400 - 534/2, 600 - 271),
new descriptiveButton("bones", 540, 265, 400 - 534/2, 600 - 271),
new descriptiveButton("chopSticks", 630, 265, 400 - 534/2, 600 - 271)];

var buttons = menuButtons.concat(descriptiveButtons);



//Cursor properties
//hover: is the mouse hovering over a button
var cursor = {
    img: document.createElement("img"),
    hover: false
};

var realTree = {
    img: document.createElement("img"),
    x: screenWidth*9/12,
    y: screenHeight*3/10,
    width: 114,
    height: 208,
    currentFrame: 1,
    frames: 4,
    treeTap: 0,
    treesHit: 0,
    
    tapSound: new Audio('music/tap.wav'),
    hitSound: new Audio('music/special.wav'),
 
    noHit: false,
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
    
    draw: function() {
        if (realTree.noHit == false) {
            treeUpdate(realTree, 1, this.x, this.y);
        } else if (realTree.noHit == true) {
            treeUpdate(realTree, 3, this.x, this.y);
        };
    }
};

realTree.tapSound.volume = 0.8;
realTree.hitSound.volume = 0.8;

var ripta = {
    img: document.createElement("img"),
    currentFrame: 1,
    frames: 2,
    x: screenWidth*9/12,
    y: screenHeight*5/10
};

var blueno = {
    img: document.createElement("img"),
    currentFrame: 1,
    frames: 2,
    x: screenWidth*10/15,
    y: screenHeight*3/10
};

var treeImg = document.createElement("img");

var loading = {
    img: document.createElement("img"),
    x: screenWidth/2,
    y: screenHeight/2,
    frames: 3,
    currentFrame: 1
};

var bigSprite = {
  img: document.createElement("img"),
  x: screenWidth*5/800,
  y: screenHeight*495/600,
  frames: 2,
  currentFrame: 1
}


//Create Waste lists for each level
var places = [];
for (var j = 0; j < 5; j++) {
    places[j] = [];
    for (var i = 0; i < wasteTypes.length; i++) {
        if (wasteTypes[i].place.indexOf(j) >= 0) {
            places[j].push(wasteTypes[i]);
        }
    };
};



//---------------------------------------Load images/music-----------------------------------\\
//When the window loads
window.onload = function() {
    //Load canvas
    //canvas = document.getElementById('gameCanvas');
    //canvasContext = canvas.getContext('2d');
    setup();
    
    loading.img.src = "images/sprites/loading.png";
    loading.img.onload = function() {
        loadAction();
    };
    
    for (var i = 0; i < loadCaptions.length; i++) {
        loadCaptions[i].src = "images/staticImages/loading/" + loadCaptionsText[i] + ".png";

        loadCaptions[i].onload = function() {
            loadCount += 1;
            loadCaptionCount += 1;
        };
    };

    
    
    wasteTypes.forEach(function(waste) {
        waste.img.src = "images/sprites/" + waste.name + ".png";
        
        waste.img.onload = function() {
            loadCount += 1;
        };
    });
    
    present.img.src = "images/sprites/present.png";
    
    present.img.onload = function() {
        loadCount += 1;
    };
    
    treeImg.src = "images/sprites/fakeTree.png";
    
    treeImg.onload = function() {
        loadCount += 1;
    };
        
   for (var i = 0; i < staticImages.length; i++) {
        staticImages[i].src = "images/staticImages/" + staticImageText[i] + ".png";
        
        staticImages[i].onload = function() {
            loadCount += 1;
        };
    }

    //Load player sprite
    player.img.src = "images/sprites/runWilliam.png";
    player.img.onload = function() {
        loadCount += 1;
    };
    
    playerStatic.src = "images/sprites/williamClassic.png";
    playerStatic.onload = function() {
        loadCount += 1;
    };
    
    //boss sprites
    ripta.img.src = "images/sprites/ripta.png";
    ripta.img.onload = function() {
        loadCount += 1;
    };
    
    blueno.img.src = "images/sprites/blueno.png";
    blueno.img.onload = function() {
        loadCount += 1;
    };
    
    realTree.img.src = "images/sprites/realTree.png";
    realTree.img.onload = function() {
        loadCount += 1;
    };
    
    bigSprite.img.src = "images/sprites/bigSprite.png";
    bigSprite.img.onload - function() {
      loadCount += 1;
    };
    

    //Load button sprites
    for (var i = 0; i < menuButtons.length; i++) {
        menuButtons[i].img.src = "images/buttons/" + ["moreButton", "menuButton", "backButton", "nextButton", "playButton", "helpButton", "openCurriculum", "abc", "snc", "audit", "pauseButton", "muteButton", "volumeButton"][i] + ".png";
        
        menuButtons[i].img.onload = function() {
            loadCount += 1;
        };
    };

    for (var i = 0; i < descriptiveButtons.length; i++) {
        
        descriptiveButtons[i].img.src = "images/buttons/" + descriptiveButtons[i].name + "Button.png";
        descriptiveButtons[i].description.src = "images/staticImages/" + descriptiveButtons[i].name + "Description.png";
        
        descriptiveButtons[i].img.onload = function() {
            loadCount += 1;
        };
        descriptiveButtons[i].description.onload = function() {
            loadCount += 1;
        };
    };
    
    for (var i = 0; i < directionButtons.length; i++) {
        directionButtons[i].img.src = "images/buttons/" + ["aDirection", "dDirection",/* "sDirection",*/ "wDirection"][i] + ".png";
        
        directionButtons[i].img.onload = function() {
            loadCount += 1;
        };
    };
    
    //Load cursor sprites
    cursor.img.src = "images/sprites/cursor.png";
    cursor.img.onload = function() {
        loadCount += 1;
    };

    events();
    animate();
};


//-------------------------------------------Event listeners------------------------------------\\
function events() {
    //For all key-press events
    document.addEventListener('keydown', function(evt) {

        if (screen == "game") {
            //Change player.type based on the key pressed
            if (colorChange == false) {
                player.shirtColor(evt.keyCode);
            };
            
            if (evt.keyCode == 32) {
                if (roundWon == true && level < 3) {
                    roundWon = false;
                    level ++;
                    fadeTo('actionSong');
                    firstWaste = true;
                    addWaste();
                    timer(level);
                } else if (boss == true && bossBegin == false) {
                    bossBegin = true;
                    firstWaste = true;
                    addWaste();
                    if (level == 3) {
                        treeHit();
                    };
                } else if (needsTutorial) {
                  changeTutorialPageOnSpace();
                }
            };
            
            if (level == 2 && boss == true && (evt.keyCode == 37 || evt.keyCode == 39)) {
              riptaTitle = true;
            }
        }
    })
    
    
    
    //For all mouse-move events
    canvas.addEventListener('mousemove', function (evt) {
        //Move cursor to mouse position
        var mousePos = calculateMousePos(evt);
        cursor.x = mousePos.x;
        cursor.y = mousePos.y;
        
        //See if the mouse is hovering over the buttons
            buttons.forEach(function(button) {
                button.mouseOver(mousePos.x, mousePos.y);
            });
            
            descriptiveButtons.forEach(function(button) {
                button.action();
            });
            
        if (level == 3 && cursor.x > 94*screenWidth/800 && cursor.x < 163*screenWidth/800 && cursor.y > 49*screenHeight/600 && cursor.y < 141*screenHeight/600) {
          rattyVersion = 1;
        } else if (level == 3 && cursor.x > 539*screenWidth/800 && cursor.x < 574*screenWidth/800 && cursor.y > 99*screenHeight/600 && cursor.y < 134*screenHeight/600) {
          rattyVersion = 2;
        } else {
          rattyVersion = 0;
        }
    })
    
    //Mouse up events
    canvas.addEventListener('mouseup', function(evt) {
        for (var i = 0; i < menuButtons.length; i ++) {
            if (!musicPlayer.paused && menuButtons[i].name == "volumeButton") {
                menuButtons[i].action();
                break;
            } else if (musicPlayer.paused && menuButtons[i].name == "muteButton") {
                menuButtons[i].action();
                break;
            };
        };
    });
    
    
    //For all mouse-click events
    canvas.addEventListener('click', function (evt) {
        if (screen == "game") {
            var mousePos = calculateMousePos(evt);
            
            buttons.forEach(function(button) {
                if (button.name == "pauseButton") {
                    button.action();
                };
            });
            

            //Go through wasteList to see if a coldCup is being pressed
            wasteList.forEach(function(waste) {
                if(waste.name == 'coldCup' && !waste.present && waste.type == 'none') {
                    if(click(mousePos.x, mousePos.y, waste)) {
                        waste.tap.play();
                        waste.currentFrame = 3;
                        waste.type = 'blue';
                    }
                } else if (waste.name == 'iClicker') {
                    if(click(mousePos.x, mousePos.y, waste)) {
                        waste.special.play();
                        clickerPower();
                        
                        if (needsTutorial) {
                          tutorialWasteClick();
                        }
                        
                        waste.active = false;
                    };
                } else if (waste.name == 'smoothie') {
                    if(click(mousePos.x, mousePos.y, waste) && waste.type != 'blue') {
                        waste.special.play();
                        lives += 1;
                        waste.type = 'blue';
                        waste.currentFrame = 3;
                    };
                } else if (waste.name == 'morningMail') {
                    if(click(mousePos.x, mousePos.y, waste)) {
                        waste.special.play();
                        mailPower();
                        
                        if (needsTutorial) {
                          tutorialWasteClick();
                        }
                        waste.active = false;
                    }
                }
                
                if (startClick > 0 && click(mousePos.x, mousePos.y, waste) && (waste.type == 'blue' || waste.type == 'gray' || waste.type == 'green')) {
                    waste.correct.play();
                    
                    if (needsTutorial) {
                      clearAllTimeouts();
                      tutorialPage ++;
                    }
                    
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
                    waste.active = false;
                };
            })

            if (bossBegin == true && level == 1) {
                wasteList.forEach(function(waste) {
                    if(mousePos.x >= waste.xRatio*screenWidth && mousePos.x <= waste.xRatio*screenWidth + present.width*screenWidth/800 && mousePos.y >= waste.yRatio*screenHeight && mousePos.y <= waste.yRatio*screenHeight + present.height*screenHeight/600) {
                        if(waste.present == true) {
                            waste.tap.play();
                            waste.present = false;
                        };
                    };
                })
            } else if (bossBegin == true && level == 3) {
                if(mousePos.x > realTree.x + realTree.treeTap * 114/10 /2 * screenWidth/800 && mousePos.x < realTree.x + realTree.treeTap * 114/10 /2 * screenWidth/800 + realTree.width && mousePos.y > realTree.y + realTree.treeTap * 208/10 * screenHeight/600 && mousePos.y < realTree.y + realTree.treeTap * 208/10 + realTree.height && realTree.noHit == false) {
                    if (realTree.treeTap >= 3) {
                        
                        realTree.hitSound.play();
                        
                        bossLife -= 10;
                        realTree.height = 208;
                        realTree.width = 114;
                        realTree.treeTap = 0;
                        treeHit();
                    } else {
                        realTree.betweenHits();
                        
                        realTree.tapSound.play();
                        
                        realTree.treeTap += 1;
                        realTree.height = realTree.height - 208/10;
                        realTree.width = realTree.width - 114/10;
                    };
                } else {
                }
            };
            
        } else if (screen != "game") {
          var mousePos = calculateMousePos(evt);
          if (screen == "end" && lives > 0 && mousePos.x > 31 && mousePos.x < 43*screenWidth/800 && mousePos.y > 258*screenHeight/600 && mousePos.y < 267*screenHeight/600) {
            williamWasHere = !williamWasHere;
          } else if (screen == "title" && mousePos.x > screenWidth * 5/800 && mousePos.x < screenWidth*5/800 + bigLogo.width*screenWidth/800 && mousePos.y > screenHeight * 495/600 && mousePos.y < screenHeight * 495/600 + bigLogo.height*screenHeight/600) {
            bigClicked = true;
          }
            //Handle button presses
            buttons.forEach(function(button) {
                if (button.name == "muteButton") {
                    if (mute == true) {
                        //button.action();
                    }
                } else if(button.name == "volumeButton") {
                    if (mute == false) {
                        //button.action();
                    };
                } else {
                    button.action();
                }
            });

        }
    });
    
    window.addEventListener("resize", () => {
      resizeScreen();
    });
    
    musicPlayer.addEventListener('timeupdate', function(){
                const buffer = 0.36;
                if(this.currentTime > this.duration - buffer){
                    this.currentTime = 0
                    this.play()
                }});
};



//------------------------------------------------Animate----------------------------------\\
function animate() {
    //Call this function repeatedly
    requestAnimationFrame(animate);
        
    //Dynamically scale the screen proportionally
    //resizeScreen();
    //Resize canvas
    canvasContext.canvas.width = screenWidth;
    canvasContext.canvas.height = screenHeight;
    
    
    if (screen == "game" && pause == false) {
        wasteList.forEach(function(waste) {

            waste.update();
            if(waste.hit() && waste.present == false) {
                if (!(wasteList.length - 1 > 0 && tutorialPage == 5) && !(tutorialPage == 6)) {
                  waste.correct.play();
                };

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
                } else if (bossBegin == true && (level == 1 || level == 2)) {
                    bossLife -= 10;
                } else if (needsTutorial) {
                  tutorialWasteHit(waste);
                }
            } else if (!waste.inBounds() && needsTutorial) {
                tutorialWasteMiss(waste);
            }// else if (waste.type != 'powerUp' && waste.type != 'powerDown' && needsTutorial && waste.xRatio > 0.8 && waste.xRatio < 0.85 && wasteList.length == 1) {
              else if (waste.type != 'powerUp' && waste.type != 'powerDown' && needsTutorial && waste.xRatio <= (1 - 80 * waste.speed/screenWidth * screenWidth/800) && waste.xRatio >= (1 - 81 * waste.speed/screenWidth * screenWidth/800) && wasteList.length == 1) {
              if (tutorialPage == 5) {
                addSingleWaste("morningMail");
              } else if (tutorialPage == 6) {
                addSingleWaste("iClicker");
              }
            } else if(!waste.inBounds() && waste.type != 'powerUp' && waste.type != 'powerDown') {
                waste.miss.play();
                lives -= 1;
                if(lives <= 0 && mode != "audit") {
                    //End game when all lives gone
                    //clearInterval(progress);
                    wasteList = [];
                    //difficulty = startDifficulty;
                    //clearTimeout(wasteRepeat);
                    //clearTimeout(clickerTime);
                    //clearTimeout(mailTime);
                    //mailTime = null;
                    clearAllTimeouts();
                    fadeTo('winSong');
                    screen = "end";
                };
            } else if (waste.name == 'pembroke') {
                pembrokePower(waste);
            };
        })
        /*
        wasteList.forEach(function(waste) {
            if (!waste.active) {
            };
        });*/
        
        wasteList = wasteList.filter(function(waste) {
            return waste.active;
        });

        
        //Draw all images on current screens
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
//This function adds waste to the screen at random intervals
function addWaste() {

    if (firstWaste) {
        firstWaste = false;
        if (bossBegin == false) {
            var isSpecial = Math.random() * 10;

            if (isSpecial >= 10 - specialFreq) {
                var itemIndex = wasteTypes[Math.round(Math.random()*(specialTypes.length -1)) + (wasteTypes.length - specialTypes.length)];
            } else {
                var itemIndex = places[level - 1][Math.round(Math.random()*(places[level - 1].length - specialTypes.length - 1))];
            };

        } else { //No powerUps or powerDowns in boss fights
            var itemIndex = places[level - 1][Math.round(Math.random()*(places[level - 1].length - specialTypes.length - 1))];
        };
        
        if (pause == false) {
            wasteList.push(Waste({}, itemIndex));
        };
        
    }
    //Add at random intervals
    if (bossBegin == true && level == 2) {
        var timeBetween = 3000;
    } else {
        var timeBetween = Math.random()*2000 + 1500 / (difficulty / 1.5);
    };
    
    wasteRepeat = setTimeout(function() {


            //Decide waste options according to the game level
            
            if (bossBegin == false) {
                var isSpecial = Math.random() * 10;

                if (isSpecial >= 10 - specialFreq) {
                    var itemIndex = wasteTypes[Math.round(Math.random()*(specialTypes.length -1)) + (wasteTypes.length - specialTypes.length)];
                } else {
                    var itemIndex = places[level - 1][Math.round(Math.random()*(places[level - 1].length - specialTypes.length - 1))];
                };
            } else { //No powerUps or powerDowns in boss fights
                var itemIndex = places[level - 1][Math.round(Math.random()*(places[level - 1].length - specialTypes.length - 1))];
            };
            
            if (pause == false) {
                wasteList.push(Waste({}, itemIndex));
            };
            //Call the same function again to add more waste
            addWaste();
    }, timeBetween);
};

//Adds only a single waste item
function addSingleWaste(wasteName) {
  let itemIndex;
  for (let i = 0; i < wasteTypes.length; i++) {
    if (wasteTypes[i].name == wasteName) {
      itemIndex = wasteTypes[i];
    }
  }
  
  wasteList.push(Waste({}, itemIndex));
  
  /*if (pause == false) {
      wasteList.push(Waste({}, itemIndex));
  };*/   
};


//Clock Time:
function clockTime(time, interval) {
    var hourStr = time.substr(0,time.indexOf(':'))
    var minStr = time.substr(time.indexOf(':') + 1, 2)
    var hourInt = parseInt(hourStr);
    var minInt = parseInt(minStr);
    var dayNight = time.substr(time.length - 2, 2);
    
    
    minInt = minInt + interval;
    if (minInt >= 60) {
        hourInt = hourInt + 1;
        minInt = minInt % 60;
    }
    
    if (hourInt == 12 && minInt == 0) {
        
        if (dayNight == 'AM') {
            dayNight = 'PM';
        } else {
            dayNight = 'AM';
        };
    } else if (hourInt > 12) {
        hourInt = hourInt % 12;
    };
    
    if (minInt == 0) {
        minStr = '00';
    } else {
        minStr = minInt.toString();
    }
    hourStr = hourInt.toString();
    
    gameTime = hourStr + ':' + minStr + ' ' + dayNight;
}

//Game timer:
function timer(level) { //waste countDown
    if (level == 1) {
        gameTime = '6:00 PM';
    } else if (level == 3) {
        gameTime = '7:30 AM';
    } else if (level == 2) {
        gameTime = '11:00 AM';
    };
    
    progress = setInterval(function() {
        if ((level == 1 && gameTime == '2:00 AM') || (level == 3 && gameTime == '7:30 PM') || (level == 2 && gameTime == '2:00 AM')) {
            speedUp = false;
            boss = true;
            //fadeOutActionSong();
            //fadeToBossSong();
            fadeTo('bossSong');
            //clearInterval(progress);
            wasteList = [];
            //difficulty = startDifficulty;
            //clearTimeout(wasteRepeat);
            clearAllTimeouts();
            return;
        } else if (pause == false) {
            clockTime(gameTime, 30);
        };
    },3000); //should be 3000-----------------------------------------------------Changes speed of game
}


function bossFight(level) {
    canvasContext.drawImage(healthBar, 0, 0, healthBar.width * bossLife/100, healthBar.height, screenWidth - healthBar.width * 1.25 * bossLife/100 * screenWidth/800, screenHeight * 0.8/10, healthBar.width * 1.25 * bossLife/100 * screenWidth/800, healthBar.height * 1.25 * screenHeight/600);
    canvasContext.drawImage(healthLabel, screenWidth * 14/15 - healthLabel.width * screenWidth/800, screenWidth*0.3/10, healthLabel.width * screenWidth/800, healthLabel.height * screenHeight/600);
    if (level == 1) {
        spriteUpdate(blueno, 1, 2, screenWidth * 14/15 - player.img.width/player.frames * screenWidth/800, screenHeight * 3/10 + (player.img.height - blueno.img.height) * screenHeight/600);

        if (bossBegin == false) {
            canvasContext.drawImage(bluenoIntro, (800/2 - (bluenoIntro.width/1)/2) * screenWidth/800, (600/2 - (bluenoIntro.height/1)/2) * screenHeight/600, bluenoIntro.width/1 * screenWidth/800, bluenoIntro.height/1 * screenHeight/600);
        }
        
    } else if(level == 3) {
        
        if (bossBegin == false) {
            canvasContext.drawImage(rockTreeIntro, (800/2 - (rockTreeIntro.width/1)/2) * screenWidth/800, (600/2 - (rockTreeIntro.height/1)/2) * screenHeight/600, rockTreeIntro.width/1 * screenWidth/800, rockTreeIntro.height/1 * screenHeight/600);
            spriteUpdate(realTree, 1, 2, screenWidth * 14/15 - player.img.width/player.frames * screenWidth/800, screenHeight * 3/10 + (player.img.height - realTree.img.height) * screenHeight/600);
        } else {
            realTree.draw()
            fakeTrees.forEach(function(tree) {
                tree.draw();
            })
        };
    } else if(level == 2) {
        spriteUpdate(ripta, 1, 2, screenWidth * 14/15 - player.img.width/player.frames * screenWidth/800, screenHeight * 3/10 + (player.img.height - ripta.img.height) * screenHeight/600);
       if (bossBegin == false) {
            canvasContext.drawImage(riptaIntro, (800/2 - (riptaIntro.width/1)/2) * screenWidth/800, (600/2 - (riptaIntro.height/1)/2) * screenHeight/600, riptaIntro.width/1 * screenWidth/800, riptaIntro.height/1 * screenHeight/600);
        }
    }
    
    if (bossLife <= 0) {
        bossBegin = false;
        boss = false;
        roundWon = true;
        bossLife = 100;
        difficulty = startDifficulty;
        wasteList = [];
        
        fadeTo('winSong');
        clearTimeout(wasteRepeat);
        if (level == 3) {
            //fadeOutBossSong();
            //fadeToActionSong();
            openCurriculumUnlocked = true;
            screen = "end";
        };
    };
};

function treeHit() {
    if (realTree.treesHit != 0) {
        bossLife -= 10;
    };
    
    realTree.treesHit += 1;
    realTree.x = screenWidth/2 + Math.random() * screenWidth/2 - realTree.img.width/realTree.frames * screenWidth/800;
    realTree.y = screenHeight/3 + Math.random() * screenHeight/3;
    fakeTrees = [];
    
    for (var i = 0; i < realTree.treesHit; i++) {
        fakeTrees.push(newTrees());
    };
};

function challenges() {
    if (level == 1 && boss == false && roundWon == false && (gameTime == '12:00 AM' || gameTime == '12:30 AM' || gameTime == '1:00 AM' || gameTime == '1:30 AM' || gameTime == '2:00 AM')) {
        if (!speedUp) {
            difficulty = difficulty * 2;
        };
        speedUp = true;
        canvasContext.drawImage(lastCall, (400 - 578/2) * screenWidth/800, screenHeight * 2/10, 578 * screenWidth/800, 34 * screenHeight/600);
    } else if (level == 3 && (gameTime == '9:00 AM' || gameTime == '9:30 AM' || gameTime == '10:00 AM')) {
        canvasContext.drawImage(iceCream, screenWidth/4, screenHeight/5, screenWidth*3/4, screenHeight*3/4);
        canvasContext.drawImage(brokenMachine, (400 - 553/2) * screenWidth/800, screenHeight * 2/10, 553 * screenWidth/800, 34 * screenHeight/600);
    } else if (level == 2 && (gameTime == '1:00 PM' || gameTime == '1:30 PM' || gameTime == '2:00 PM')) {
        //colorRect(screenWidth/2, screenHeight/3, screenWidth/2, 400);
        canvasContext.drawImage(andrewsCrowd, screenWidth*500/800, screenHeight * 3/10, 344 * screenWidth/800, 287 * screenHeight/600);
        canvasContext.drawImage(phoLine, (400 - 297/2) * screenWidth/800, screenHeight * 2/10, 297 * screenWidth/800, 34 * screenHeight/600);
    }
    if (difficulty >= 5 && level == 1) {
        //colorText("Last call", screenWidth/2, screenHeight*3/10, 'black');
    };
};

function clickerPower() {
    startClick += 1;
    clickerTime = setTimeout(function() {
        startClick -= 1;
    }, 5000);
};

function mailPower() {
    difficulty = difficulty / 1.5;
    startMail += 1;
    mailTime = setTimeout(function() {
        difficulty = difficulty * 1.5;
        startMail -= 1;
    }, 5000);
};

function pembrokePower(waste) {
    if (click(cursor.x, cursor.y, waste)) {
        waste.miss.play();
        lives -= 1;
        waste.active = false;
        if (needsTutorial) {
          addSingleWaste("pembroke");
        } else if(lives <= 0 && mode != "audit") {
            //End game when all lives gone
            //clearInterval(progress);
            wasteList = [];
            //difficulty = startDifficulty;
            //clearTimeout(wasteRepeat);
            //clearTimeout(clickerTime);
            //clearTimeout(mailTime);
            //mailtime = null;
            clearAllTimeouts();
            fadeTo('winSong');
            screen = "end";
            //actionSong.pause();
        };
    };
};

//Handles sprite clicks
function click(mouseX, mouseY, sprite) {
    return mouseX >= sprite.xRatio*screenWidth && mouseX <= sprite.xRatio*screenWidth + sprite.img.width/sprite.frames*screenWidth/800 && mouseY >= sprite.yRatio*screenHeight && mouseY <= sprite.yRatio*screenHeight + sprite.img.height*screenHeight/600;
}

//This function makes text
function colorText(text, centerX, centerY, fillColor) {
    var textSize = 30 * screenHeight/600;
    var textFont = textSize + "px" + " Trash Dash";
    canvasContext.font = textFont;
    //canvasContext.font = "30px Trash Dash";
    canvasContext.textAlign = "center";
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(text, centerX, centerY);
}

function colorRect(x, y, width, height, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.rect(x,y,width,height);
    canvasContext.fill();
}


function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect(), root = document.documentElement;
    
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}


//Updates sprite sheets
function spriteUpdate(sprite, startFrame, frameSum, x, y) {
    if (frameTick != 17) {
        canvasContext.drawImage(sprite.img, (sprite.currentFrame - 1) * sprite.img.width/sprite.frames, 0, sprite.img.width/sprite.frames, sprite.img.height, x, y, sprite.img.width/sprite.frames*screenWidth/800, sprite.img.height*screenHeight/600);
        return;
    }
    
    //If it's at the max frame
    if (startFrame + (frameSum - 1) == sprite.currentFrame) {
        canvasContext.drawImage(sprite.img, (startFrame - 1) * sprite.img.width/sprite.frames, 0, sprite.img.width/sprite.frames, sprite.img.height, x, y, sprite.img.width/sprite.frames*screenWidth/800, sprite.img.height*screenHeight/600);
        sprite.currentFrame = startFrame;
    } else { //If it's not at its max frame
        canvasContext.drawImage(sprite.img, sprite.currentFrame * sprite.img.width/sprite.frames, 0, sprite.img.width/sprite.frames, sprite.img.height, x, y, sprite.img.width/sprite.frames*screenWidth/800, sprite.img.height*screenHeight/600);
        sprite.currentFrame += 1;
    }
}

function treeUpdate(sprite, startFrame, x, y) {
    if (frameTick != 17) {
        canvasContext.drawImage(sprite.img, (sprite.currentFrame - 1) * sprite.img.width/sprite.frames, 0, sprite.img.width/sprite.frames, sprite.img.height, x + sprite.treeTap * 114/10 /2 * screenWidth/800, y + sprite.treeTap * 208/10 * screenHeight/600, sprite.width*screenWidth/800, sprite.height*screenHeight/600);
    } else if (startFrame + 1 <= sprite.currentFrame) { //max frame
        canvasContext.drawImage(sprite.img, (startFrame - 1) * sprite.img.width/sprite.frames, 0, sprite.img.width/sprite.frames, sprite.img.height, x + sprite.treeTap * 114/10 / 2 * screenWidth/800, y + sprite.treeTap * 208/10 * screenHeight/600, sprite.width*screenWidth/800, sprite.height*screenHeight/600);
        sprite.currentFrame = startFrame;
    } else { //If it's not at its max frame
        canvasContext.drawImage(sprite.img, sprite.currentFrame * sprite.img.width/sprite.frames, 0, sprite.img.width/sprite.frames, sprite.img.height, x + sprite.treeTap * 114/10 /2 * screenWidth/800, y + sprite.treeTap * 208/10 * screenHeight/600, sprite.width*screenWidth/800, sprite.height*screenHeight/600);
        sprite.currentFrame += 1;
    }
};


player.shirtColor = function(key = 0) {
    var sheetNum
    if (key == 68 || key == 87 || key == 65) {
        colorChange = true;
    
        if (key == 68) { //D-key
            sheetNum = 4;
            player.type = 'gray';
        } else if (key == 87) { //W-Key
            sheetNum = 3;
            player.type = 'green'
        } else if (key == 65) { //A-Key
            sheetNum = 2;
            player.type = 'blue';
        } else if (key == 83) { //S-Key
            sheetNum = 1;
            player.type = 'black';
        } else {
            sheetNum = 1;
            player.type = 'black';
        };

        directionButtons.forEach(function(button) {
            button.action(key);
        })
        player.currentFrame += 4 * (sheetNum - Math.ceil(player.currentFrame/4));

        setTimeout(function() {
            player.type = 'black';

            player.currentFrame += 4 * (1 - Math.ceil(player.currentFrame/4));
            directionButtons.forEach(function(button) {
                button.action(0);
            })

            colorChange = false;
        }, 500);
    };
};

player.draw = function() {
    if (roundWon == true) {
        canvasContext.drawImage(playerStatic, screenWidth/15, screenHeight*3/10, playerStatic.width*screenWidth/800, playerStatic.height*screenHeight/600);
    } else if (player.type == 'black') {
        spriteUpdate(player, 1, 4, screenWidth/15, screenHeight*3/10);
    } else if (player.type == 'blue') {
        spriteUpdate(player, 5, 4, screenWidth/15, screenHeight*3/10);
    } else if (player.type == 'green') {
        spriteUpdate(player, 9, 4, screenWidth/15, screenHeight*3/10);
    } else if (player.type == 'gray') {
        spriteUpdate(player, 13, 4, screenWidth/15, screenHeight*3/10);
    };
}



function resizeScreen() {
        if (window.innerWidth < window.innerHeight*800/600) {
        screenWidth = (window.innerWidth);
        screenHeight = (window.innerWidth)*600/800;
    } else {
        screenWidth = (window.innerHeight)*800/600;
        screenHeight = (window.innerHeight);
    }
}

//Restarts the game
function newGame() {
    screen = "game";
    lives = startLives;
    score = 0;
    difficulty = startDifficulty;
    if (!openCurriculumMode) {
        level = 1;
    } else {
        level = 4;
    };
    wasteList = [];
    firstWaste = true;
    boss = false;
    bossBegin = false;
    roundWon = false;
    startClick = 0;
    startMail = 0;
    speedUp = false;
    keyList = [];
    player.type = 'black';
    if (!openCurriculumMode) {
        timer(level);
    };
    addWaste();
};

//Starts tutorial
const startTutorial = () => {
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

function togglePause() {
    if (pause == false) {
        screen = "instruction1";
        pause = true;
        console.log("toggling");
    } else {
        screen = "game";
        pause = false;
    }
};


function notifications() {
    if (roundWon == true) {
        if (level == 1) {
            canvasContext.drawImage(complete1, (800/2 - (complete1.width/1)/2) * screenWidth/800, (600/2 - (complete1.height/1)/2) * screenHeight/600, complete1.width/1 * screenWidth/800, complete1.height/1 * screenHeight/600);
        } else if (level == 2) {
            canvasContext.drawImage(complete2, (800/2 - (complete2.width/1)/2) * screenWidth/800, (600/2 - (complete2.height/1)/2) * screenHeight/600, complete2.width/1 * screenWidth/800, complete2.height/1 * screenHeight/600);
        };
    } else {
        if (startMail > 0) {
            canvasContext.drawImage(todayNotification, screenWidth - (todayNotification.width * 1.5 + 10) * screenWidth/800, 10 * screenHeight/600, todayNotification.width * 1.5 * screenWidth/800, todayNotification.height * 1.5 * screenHeight/600);
            
            canvasContext.drawImage(announcement1, (800/2 - announcement1.width/2) * screenWidth/800, screenHeight/3 + (player.img.height + 5) * screenHeight/600, announcement1.width * screenWidth/800, announcement1.height * screenHeight/600);

            if (startClick > 0) {
                canvasContext.drawImage(clickerNotification, screenWidth - (clickerNotification.width * 1.5 + 10) * screenWidth/800, 50 * screenHeight/600, clickerNotification.width * 1.5 * screenWidth/800, clickerNotification.height * 1.5 * screenHeight/600);
            }
        } else if (startClick > 0) {
            canvasContext.drawImage(clickerNotification, screenWidth - (clickerNotification.width * 1.5 + 10) * screenWidth/800, 10 * screenHeight/600, clickerNotification.width * 1.5 * screenWidth/800, clickerNotification.height * 1.5 * screenHeight/600);
        }
    }
};

function loadAction() {
    screen = "load";
    
    var loadInterval = setInterval(function() {
        if (loadStep == 5) {
            clearInterval(loadInterval);
        }
        
        if (loadCaptionCount == 5) {
            loadStep += 1;
        };
    }, 1000);
    
};

const clearAllTimeouts = () => {
  clearTimeout(mailTime);
  difficulty = startDifficulty;
  startMail = 0;
  
  clearTimeout(clickerTime);
  startClick = 0;
  
  clearTimeout(wasteRepeat);
  
  clearInterval(progress);
}

const fadeIn = () => {
  let fadeInInterval = setInterval(function() {
    if (musicPlayer.volume <= 0.4) {
      musicPlayer.volume += 0.1;
    } else {
      clearInterval(fadeInInterval);
    }
    
  }, 100);
  
}

const fadeTo = songTitle => {
  const toBosspromise = new Promise((resolve, reject) => {
    let fadeOutInterval = setInterval(() => {
      if (musicPlayer.volume >= 0.1) {
        musicPlayer.volume -= 0.1;
      } else {
        if (!musicPlayer.paused) {
          musicPlayer.src = "music/" + songTitle + ".m4a";
          musicPlayer.play();
        } else {
          musicPlayer.src = "music/" + songTitle + ".m4a";
        };

        clearInterval(fadeOutInterval);

        resolve();
      }

    }, 50);
  }).then(fadeIn);
}


const tickUpdate = () => {
  frameTick += 1;
  if (frameTick > 17) {
    frameTick = 0;
  };
}

const changeTutorialPageOnSpace = () => {

  if (tutorialPage == 3 && wasteList.length == 0) {
    addSingleWaste("chips");
  } else if (tutorialPage == 4 && wasteList.length == 0) {
    addSingleWaste("coldCup");
  } else if ((tutorialPage == 5 || tutorialPage == 6) && wasteList.length == 0) {
    let newWaste = wasteTypes[Math.floor(Math.random()*(wasteTypes.length - 4))];
    addSingleWaste(newWaste.name);
  } else if (tutorialPage == 7 && wasteList.length == 0) {
    addSingleWaste("smoothie");
  } else if (tutorialPage == 8 && wasteList.length == 0) {
    addSingleWaste("pembroke");
  } else if (tutorialPage == 10) {
    endTutorial();
  } else if (tutorialPage == 0 || tutorialPage == 1 || tutorialPage == 2 || tutorialPage == 9) {
    tutorialPage ++;
  }
}

const endTutorial = () => {
  tutorialPage = 0;
  needsTutorial = false;
  newGame();
}

const tutorialWasteHit = waste => {
  if (wasteList.length - 1 == 0 && tutorialPage != 6) {
    tutorialPage ++;
  /*} else if (wasteList.length - 1 == 0 && tutorialPage == 6) {
    addSingleWaste(waste.name);
  */} else if (tutorialPage == 5 || tutorialPage == 6) {
    waste.miss.play();
    wasteList = [];
    addSingleWaste(waste.name);
  }
  clearAllTimeouts();
}

const tutorialWasteMiss = waste => {
  
  if (tutorialPage == 8) {
    waste.correct.play();
    tutorialPage ++;
  } else {
    waste.miss.play();

    if (waste.name == 'morningMail' || waste.name == 'iClicker') {
      let newWaste = wasteTypes[Math.floor(Math.random()*(wasteTypes.length - 4))];
      addSingleWaste(newWaste.name);
    } else {
      if (tutorialPage == 7) {
        lives --;
      } else if (tutorialPage == 5 || tutorialPage == 6) {
        wasteList = [];
      }
      
      addSingleWaste(waste.name);
    };
  };
}

const tutorialWasteClick = () => {
  if (wasteList.length - 1 == 0) {
    let newWaste = wasteTypes[Math.floor(Math.random()*(wasteTypes.length - 4))];
    addSingleWaste(newWaste.name);
    
    clearAllTimeouts();
  }
}

const drawEachTutorial = page => {
  canvasContext.drawImage(page, (800 - tutorial1.width - 20) * screenWidth/800, (600/2 - page.height/2) * screenHeight/600, page.width * screenWidth/800, page.height * screenHeight/600);
}

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

function setup() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.mozImageSmoothingEnabled = false;
    canvasContext.webkitImageSmoothingEnabled = false;
    canvasContext.msImageSmoothingEnabled = false;
    canvasContext.imageSmoothingEnabled = false;
}

// -----------------------------------------    Draw Screens ---------------------------------------------//


//This function draws everything on the screen
function drawGame() {
    tickUpdate();
    if (!openCurriculumMode) {    
        if (level == 1) {
            canvasContext.drawImage(josBackground,0,0, screenWidth, screenHeight);
        } else if (level == 3) {
            if (rattyVersion == 0) {
              canvasContext.drawImage(rattyBackground, 0, 0, screenWidth, screenHeight);
            } else if (rattyVersion == 1) {
              canvasContext.drawImage(rattyEasterEgg, 0, 0, screenWidth, screenHeight);
            } else if (rattyVersion == 2) {
              canvasContext.drawImage(rodentEasterEgg, 0, 0, screenWidth, screenHeight);
            }
        } else if (level == 2) {
            canvasContext.drawImage(andrewsBackground, 0, 0, screenWidth, screenHeight);
        };
    } else {
        canvasContext.drawImage(bossBackground, 0, 0, screenWidth, screenHeight);
    };
    player.draw();
    
    if (boss == true) {
        bossFight(level);
    }   
    
    if (needsTutorial) {
      drawTutorial();
    };
    
    wasteList.forEach(function(waste) {
        waste.draw();
    });
    
    challenges();
    directionButtons.forEach(function(button) {
        button.draw();
    });
    
    notifications();
    
    buttons.forEach(function(button) {
        if (button.name == "pauseButton" || (button.name == "muteButton" && mute == true) || (button.name == "volumeButton" && mute == false)) {
            button.draw();
        };
    });
    
    if (!needsTutorial || tutorialPage == 7 || tutorialPage == 8) {
      //Draw Lives
      canvasContext.drawImage(wordBackground, screenWidth* 0.5/10, screenHeight*0.8/10, screenWidth*2.5/10, screenHeight*1/10);
      colorText("LIVES: " + lives, screenWidth * 0.5/10 + screenWidth*2.5/10/2, screenHeight*1.6/10, 'black');
    };
    
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

function drawTitle() {
    //Draw Background
    canvasContext.drawImage(vanWickle, 0,0, screenWidth, screenHeight);

    //Draw text, scaled according to screen size
    if (plmeMode == false && riptaTitle == false) {
        canvasContext.drawImage(title, screenWidth/2 - (title.width*screenWidth/800)/2, 10*screenHeight/600, screenWidth*title.width/800, screenHeight*title.height/600);
    } else if (plmeMode) {
        canvasContext.drawImage(plmeTitle, screenWidth/2 - (plmeTitle.width*screenWidth/800)/2, 10*screenHeight/600, screenWidth*plmeTitle.width/800, screenHeight*title.height/600);
    } else if (riptaTitle) {
      canvasContext.drawImage(riptaEasterEgg, screenWidth/2 - (riptaEasterEgg.width*screenWidth/800)/2, 10*screenHeight/600, screenWidth*riptaEasterEgg.width/800, screenHeight*riptaEasterEgg.height/600);
    }
    
           
    /*canvasContext.drawImage(clickToPlay, screenWidth/2 - (clickToPlay.width*screenWidth/800)/2, screenHeight*500/600, screenWidth*clickToPlay.width/800, screenHeight*clickToPlay.height/600);
    
    canvasContext.drawImage(pressSpaceForInstructions, screenWidth/2 - (pressSpaceForInstructions.width*screenWidth/800)/2, screenHeight/2, pressSpaceForInstructions.width*screenWidth/800, pressSpaceForInstructions.height*screenHeight/600);*/
    
    menuButtons.forEach(function(button) {
        if (button.name == "playButton" || button.name == "helpButton" || button.name == "moreButton" || (button.name == "openCurriculum" && openCurriculumUnlocked) || (button.name == "abc" && mode != "abc" && plmeMode == false) || (button.name == "snc" && mode != "snc" && plmeMode == false) || (button.name == "audit" && mode != "audit" && plmeMode == false) || (button.name == "muteButton" && mute == true) || (button.name == "volumeButton" && mute == false)) {
            button.draw();
        };
    });
    
    if (mode == "abc") {
        canvasContext.drawImage(abcStatic, ((800/2 - 24) - (50 + 37) - (50/2 - 38/2)) * screenWidth/800, (600 * 9.4/10 - (26/2 - 17/2)) * screenHeight/600, 50 * screenWidth/800, 26 * screenHeight/600);
    } else if (mode == "snc") {
        canvasContext.drawImage(sncStatic, (800/2 - 70/2) * screenWidth/800, (600 * 9.4/10 - (26/2 - 17/2))* screenHeight/600, 70 * screenWidth/800, 26 * screenHeight/600);
    } else {
        canvasContext.drawImage(auditStatic, (800/2 + 50 + 24 - (87/2 - 57/2)) * screenWidth/800, (600 * 9.4/10 - (26/2 - 17/2)) * screenHeight/600, 87 * screenWidth/800, 26 * screenHeight/600);
    }
    
    canvasContext.drawImage(difficultyMode, screenWidth/2 - 62 * screenWidth/800, screenHeight * 8.9/10, 123 * screenWidth/800, 17 * screenHeight/600);

    
    //Draw BiG logo, scaled according to page size
    if (!bigClicked) {
      canvasContext.drawImage(bigLogo, screenWidth*5/800, screenHeight*495/600, bigLogo.width*screenWidth/800, bigLogo.height*screenHeight/600);
    } else {
      tickUpdate();
      spriteUpdate(bigSprite, 1, 2, screenWidth*5/800, screenHeight*495/600);
    };
    
    /*var testPowerUp = new PowerUp({}, wasteTypes[1], 0);   
    testPowerUp.draw;*/
}

function drawInstruction() {
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
    

    //Draw buttons
    /*menuButtons.forEach(function(button) {
        button.draw();
    });*/
    menuButtons.forEach(function(button) {
        if ((button.name == "backButton" && (pause == false || (screen == "instruction2" || screen == "instruction3"))) || button.name == "playButton") {
            button.draw();
        } else if (button.name == "nextButton" && (screen == "instruction1" || screen == "instruction2")) {
            button.draw();
        } else if (button.name == "menuButton" && screen == "instruction1" && pause == true) {
            button.draw();
        } else if ((button.name == "muteButton" && mute == true) || (button.name == "volumeButton" && mute == false)) {
            button.draw();
        };
    });
    
    if(screen == "instruction2") {
        descriptiveButtons.forEach(function(button) {
            button.draw();
        });
        for (var i = 0; i < descriptiveButtons.length; i++) {
            descriptiveButtons[i].drawDescription(/*descriptions[i]*/);
        };/*
        descriptiveButtons.forEach(function(button) {
            button.drawDescription(descriptions);
        });*/
        /*
        chipsButton.draw();
        coldCupButton.draw();
        glassBottleButton.draw();
        lactaidButton.draw();
        marinaraButton.draw();
        plasticWareButton.draw();*/
        

    };
    
};

function drawEnd() {
    //level = 1;
    //Draw Background
    //colorRect(0, 0, canvas.width, canvas.height, '#74FF48');
    
        //Calculate high score
    if (openCurriculumMode && score > highScore) {
        highScore = score;
    };
    
    if (!openCurriculumMode && lives > 0) {
        canvasContext.drawImage(winScreen, 0, 0, screenWidth, screenHeight);
    
    if (williamWasHere) {
      canvasContext.drawImage(williamEasterEgg, 15*screenWidth/800, 365*screenHeight/600, 34*screenWidth/800, 34*screenWidth/800 * williamEasterEgg.height/williamEasterEgg.width);
    }
    
    } else if (!openCurriculumMode && lives < 1) {
        canvasContext.drawImage(loseScreen, 0, 0, screenWidth, screenHeight);
    } else {
        canvasContext.drawImage(openCurriculumEnd, 0, 0, screenWidth, screenHeight);
        
        canvasContext.drawImage(wordBackground, screenWidth*3.75/10, screenHeight*3/10, screenWidth*2.5/10, screenHeight*1/10);
        colorText("SCORE: " + score, screenWidth/2, screenHeight*3.8/10, 'black');
    
        canvasContext.drawImage(wordBackground, screenWidth*3.75/10, screenHeight*4.5/10, screenWidth*2.5/10, screenHeight*1/10);
        colorText("HIGH: " + highScore, screenWidth/2, screenHeight*5.3/10, 'black');


    }
    
    
    //Draw Text
    /*colorText("Nice trash sorting", canvas.width/2, 100, 'black')
    canvasContext.font = "40px Arial";
    colorText("You ended up with " + score + " points", canvas.width/2, 200, 'black');
    canvasContext.font = "30px Arial";
    colorText("Your high score is " + highScore + " points", canvas.width/2, 300, 'black');
    canvasContext.font = "60px Arial";
    colorText("Click to Play Again", canvas.width/2, canvas.height*3/4, 'black');*/
    
    menuButtons.forEach(function(button) {
        if (button.name == "menuButton" || button.name == "helpButton" || button.name == "playButton" || (button.name == "openCurriculum" && openCurriculumUnlocked) || (button.name == "muteButton" && mute == true) || (button.name == "volumeButton" && mute == false)) {
            button.draw();
        };
    });
    
}


function drawLoad() {
    tickUpdate();
    
    colorRect(0, 0, screenWidth, screenHeight, '#00cb00');
    spriteUpdate(loading, 1, 3, (800 - loading.img.width/3)/2 * screenWidth/800, (600 - loading.img.height)/2 * screenHeight/600);
    
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
            if (loadCount >= 130) {
                screen = "title";
            };
        };
    }
};