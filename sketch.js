const screenWidth = 1280;
const screenHeight = 819;

// Store bubble and note objects
let bubbles = [];
let notes = [];

let numBubbles = 20;

// Clam top and bottom images (for opening mouth)
let clamTop, clamBottom;
let backgroundImage;

// sound variables
let noteC, noteDb, noteE, noteF, noteG, noteAb, noteBb, noteC2;
let loop1, loop2, loop3, loop4, loop5, loop6, loop7, loop8;
let bubblePone, bubblePtwo;
let bubblePops;

// clam's original width/height divided by x to make smaller
let clamWidth = 494 / 3;
let clamHeight = 270 / 3;

// used to keep track of what clams open their mouths
let clamOneOpen = false;
let clamTwoOpen = false;
let clamThreeOpen = false;
let clamFourOpen = false;
let clamFiveOpen = false;
let clamSixOpen = false;
let clamSevenOpen = false;
let clamEightOpen = false;

// used to see if user clicked to start playing
let started = false;

let curtainX = 0; // Initial x-position of the curtains
let curtainSpeed = 20; // Speed of c
let curtainisOpen = false; // To track if the curtains are fully open

let customFont;

let noteWidth = 50;
let noteHeight = 50;

function preload() {
  // Load the images before the sketch starts
  clamTop = loadImage("media/clamTop.png");
  clamBottom = loadImage("media/clamBottom.png");
  backgroundImage = loadImage("media/spongebg.png");
  customFont = loadFont("media/CarryYouRegular.ttf");
  noteImage = loadImage("media/musicnotes.png");

  //load notes before sketch starts
  noteC = loadSound("sound/notes/C.wav");
  noteDb = loadSound("sound/notes/Db.wav");
  noteE = loadSound("sound/notes/E.wav");
  noteF = loadSound("sound/notes/F.wav");
  noteG = loadSound("sound/notes/G.wav");
  noteAb = loadSound("sound/notes/Ab.wav");
  noteBb = loadSound("sound/notes/Bb.wav");
  noteC2 = loadSound("sound/notes/C2.wav");

  //load backtrack before sketch starts
  loop1 = loadSound("sound/backtrack/loop1-120.wav");
  loop2 = loadSound("sound/backtrack/loop2-140.wav");
  loop3 = loadSound("sound/backtrack/loop3-140.wav");
  loop4 = loadSound("sound/backtrack/loop4-95.wav");
  loop5 = loadSound("sound/backtrack/loop5-110.wav");
  loop6 = loadSound("sound/backtrack/loop6-105.wav");
  loop7 = loadSound("sound/backtrack/loop7-90.wav");
  loop8 = loadSound("sound/backtrack/loop8-80.wav");

  bubblePone = loadSound("sound/sfx/bubblePopOne.wav");
  bubblePtwo = loadSound("sound/sfx/bubblePopOne.wav");

  if (navigator.requestMIDIAccess) {
    console.log("This browser supports WebMIDI!");
  } else {
    console.log("WebMIDI is not supported in this browser.");
  }

  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}

function onMIDISuccess(midiAccess) {
  for (var input of midiAccess.inputs.values()) {
    input.onmidimessage = getMIDIMessage;
  }
}

function onMIDIFailure() {
  console.log("Could not access your MIDI devices.");
}

function setup() {
  createCanvas(screenWidth, screenHeight); // set as full screen width
  angleMode(DEGREES);
  textAlign(CENTER);

  // Generate initial bubbles
  for (let i = 0; i < 20; i++) {
    bubbles.push(
      new Bubble(random(width), height + random(100), random(20, 50))
    );
  }

  bubblePops = [bubblePone, bubblePtwo];

  loop1.loop();
  loop1.amp(0);
  loop2.loop();
  loop2.amp(0);
  loop3.loop();
  loop3.amp(0);
  loop4.loop();
  loop4.amp(0);
  loop5.loop();
  loop5.amp(0);
  loop6.loop();
  loop6.amp(0);
  loop7.loop();
  loop7.amp(0);
  loop8.loop();
  loop8.amp(0);
}

function getMIDIMessage(midiMessage) {
  value = midiMessage.data[2];
  channel = midiMessage.data[1];
  on = midiMessage.data[0];

  console.log(`${on}, ${channel}, ${value}`);

  switch (channel + value) {
    case 36:
      // noteC.stop();
      noteStop(noteC);
      break;
    case 37:
      // noteDb.stop();
      noteStop(noteDb);
      break;
    case 38:
      // noteE.stop();
      noteStop(noteE);
      break;
    case 39:
      // noteF.stop();
      noteStop(noteF);
      break;
    case 40:
      // noteG.stop();
      noteStop(noteG);
      break;
    case 41:
      // noteAb.stop();
      noteStop(noteAb);
      break;
    case 42:
      // noteBb.stop();
      noteStop(noteBb);
      break;
    case 43:
      // noteC2.stop();
      noteStop(noteC2);
      break;
    default:
      console.log("No note stopped");
      break;
  }

  switch (channel) {
    case 36:
      if (value > 0) {
        clamOneOpen = true;
        noteC.play();
      } else {
        clamOneOpen = false;
      }
      break;
    case 37:
      if (value > 0) {
        clamTwoOpen = true;
        noteDb.play();
      } else {
        clamTwoOpen = false;
      }
      break;
    case 38:
      if (value > 0) {
        clamThreeOpen = true;
        noteE.play();
      } else {
        clamThreeOpen = false;
      }
      break;
    case 39:
      if (value > 0) {
        clamFourOpen = true;
        noteF.play();
      } else {
        clamFourOpen = false;
      }
      break;
    case 40:
      if (value > 0) {
        clamFiveOpen = true;
        noteG.play();
      } else {
        clamFiveOpen = false;
      }
      break;
    case 41:
      if (value > 0) {
        clamSixOpen = true;
        noteAb.play();
      } else {
        clamSixOpen = false;
      }
      break;
    case 42:
      if (value > 0) {
        clamSevenOpen = true;
        noteBb.play();
      } else {
        clamSevenOpen = false;
      }
      break;
    case 43:
      if (value > 0) {
        clamEightOpen = true;
        noteC2.play();
      } else {
        clamEightOpen = false;
      }
      break;
    case 70:
      value = map(value, 0, 127, 0, 1);
      loop1.amp(value);
      break;
    case 71:
      value = map(value, 0, 127, 0, 1);
      loop2.amp(value);
      break;
    case 72:
      value = map(value, 0, 127, 0, 1);
      loop3.amp(value);
      break;
    case 73:
      value = map(value, 0, 127, 0, 1);
      loop4.amp(value);
      break;
    case 74:
      value = map(value, 0, 127, 0, 1);
      loop5.amp(value);
      break;
    case 75:
      value = map(value, 0, 127, 0, 1);
      loop6.amp(value);
      break;
    case 76:
      value = map(value, 0, 127, 0, 1);
      loop7.amp(value);
      break;
    case 77:
      value = map(value, 0, 127, 0, 1);
      loop8.amp(value);
      break;
    default:
      console.log("No case was met.");
      break;
  }
}

let floatOffset = 0; // Used to track the floating animation

function draw() {
  if (started)
    if (!curtainisOpen) {
      drawCurtainEffect();
    } else {
      gameLoop();
    }
  else {
    background(0);
    fill("blue");
    textSize(80);
    textFont(customFont);
    text("Under the Sea Live Show", width / 2, height / 2);

    // Calculate floating effect
    let floatY = height / 2 + sin(floatOffset) * 20;
    text("Under the Sea Live Show", width / 2, floatY);

    // Update offset for animation
    floatOffset += 2;
  }
}

function drawCurtainEffect() {
  background(0);

  // Left Curtain
  fill(50);
  rect(0, 0, curtainX, height);

  // Right Curtain
  rect(width - curtainX, 0, curtainX, height);

  // Update curtain position
  curtainX += curtainSpeed;

  // Check if curtains are fully open
  if (curtainX >= width / 2) {
    curtainisOpen = true;
  }
}

function mouseClicked() {
  started = true;
}

function gameLoop() {
  background(0);
  tint(255, 205);
  image(backgroundImage, 0, 0, screenWidth, screenHeight); // Draw background image
  noTint();

  drawClams();

  // Create musical notes when clams are open
  if (clamOneOpen) notes.push(new Note(250, screenHeight - 270, 48));
  if (clamTwoOpen) notes.push(new Note(525, screenHeight - 155, 48));
  if (clamThreeOpen) notes.push(new Note(725, screenHeight - 100, 48));
  if (clamFourOpen) notes.push(new Note(850, screenHeight - 100, 48));
  if (clamFiveOpen) notes.push(new Note(180, screenHeight - 460, 48));
  if (clamSixOpen) notes.push(new Note(680, screenHeight - 170, 48));
  if (clamSevenOpen) notes.push(new Note(890, screenHeight - 280, 48));
  if (clamEightOpen) notes.push(new Note(1190, screenHeight - 695, 48));

  // Draw and update each bubble
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].move();
    bubbles[i].display();

    // Reset bubble position if it moves off the canvas
    if (bubbles[i].y < -bubbles[i].size) {
      bubbles[i].y = height + random(100);
      bubbles[i].x = random(width);
    }

    // Remove bubble if clicked
    if (bubbles[i].isClicked(mouseX, mouseY)) {
      bubblePops[Math.floor(random(2))].play();
      numBubbles--;
      bubbles.splice(i, 1); // Remove the clicked bubble
    }
  }

  // Draw and update each note
  for (let i = notes.length - 1; i >= 0; i--) {
    notes[i].move();
    notes[i].display();

    // Remove notes that go off-screen
    if (notes[i].y < -notes[i].size) {
      notes.splice(i, 1);
    }
  }

  if (numBubbles < 20) {
    bubbles.push(
      new Bubble(random(width), height + random(100), random(20, 50))
    );
    numBubbles++;
  }
  // drawNote();
}

function noteStop(note) {
  note.jump(9.8);
}

function drawClams() {
  push();
  translate(0, screenHeight - clamHeight);
  push();
  translate(150, -210);
  rotate(10);
  createClam(clamOneOpen, false, 1);
  pop();
  push();
  translate(590, -90);
  rotate(-10);
  createClam(clamTwoOpen, true, 0.6);
  pop();
  push();
  translate(650, -40);
  rotate(5);
  createClam(clamThreeOpen, false, 0.8);
  pop();
  push();
  translate(930, -20);
  rotate(5);
  createClam(clamFourOpen, true, 0.8);
  pop();
  push();
  translate(280, -400);
  rotate(-5);
  createClam(clamFiveOpen, true, 1);
  pop();
  push();
  translate(650, -80);
  createClam(clamSixOpen, false, 0.3);
  pop();
  push();
  translate(850, -200);
  createClam(clamSevenOpen, false, 0.4);
  pop();
  push();
  translate(1250, -575);
  rotate(25);
  createClam(clamEightOpen, true, 0.7);
  pop();
  pop();
}

function createClam(isOpen, flipped, size) {
  push();
  scale(size, size);
  if (isOpen && !flipped) {
    translate(0, -20);
    rotate(-15);
  } else if (isOpen && flipped) {
    translate(0, -20);
    rotate(15);
  }
  if (flipped) scale(-1, 1); // Flip clam horizontally if needed
  image(clamBottom, 0, 0, clamWidth, clamHeight); // Draw clam bottom

  push();
  translate(-5, 5);
  if (isOpen) rotate(-15);
  image(clamTop, 0, 0, clamWidth, clamHeight); // Draw clam top
  pop();
  pop();
}

// Define the Note class
class Note {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = random(2, 5); // Speed of the note

    // Generate a random color for each note
    this.color = color(random(255), random(255), random(255));
  }

  move() {
    this.y -= this.speed; // Move the note upward
    this.x += sin(frameCount / 10) * 2; // Sway horizontally
  }

  display() {
    fill(this.color); // Set the note's color
    noStroke();
    textFont("Courier New");
    textSize(this.size);
    text("♪", this.x, this.y); // Display musical note symbol
  }
}

// Bubble class definition
class Bubble {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = random(1, 3); // Speed of the bubble
  }

  move() {
    this.y -= this.speed; // Move the bubble upward
  }

  display() {
    fill(255, 255, 255, 128); // Semi-transparent white color for the bubble
    noStroke();
    ellipse(this.x, this.y, this.size, this.size); // Draw the bubble
  }

  isClicked(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.size / 2 && mouseIsPressed) {
      return true; // Check if the mouse clicks inside the bubble
    }
    return false;
  }
}

function drawNote() {
  let noteWidth = 100;
  let noteHeight = 100;

  image(noteImage, noteX, noteY, noteWidth, noteHeight);
}

function UpdateNoteSize() {
  noteWidth += 1;
  noteHeight += 1;
}
