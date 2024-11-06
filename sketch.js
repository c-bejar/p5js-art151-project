const screenWidth = 1280;
const screenHeight = 819;

let buttonPressed = 0;
let bubbles = []; // Array to store bubble objects
let clamTop, clamBottom; // Variable to store image of clam's top and bottom halves
let backgroundImage; // Variable to store the background image

let clamWidth = 494 / 3;
let clamHeight = 270 / 3;

let numClams = 4;
let clamOneOpen = false;
let clamTwoOpen = false;
let clamThreeOpen = false;
let clamFourOpen = false;

function preload() {
  // Load the images before the sketch starts
  clamTop = loadImage("media/clamTop.png");
  clamBottom = loadImage("media/clamBottom.png");
  backgroundImage = loadImage("media/spongebg.png");
}

function setup() {
  WebMidi.enable(function (err) {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled!");

      // Select LPD8 as input
      const input = WebMidi.inputs.find((input) => input.name.includes("LPD8"));
      if (input) {
        console.log("LPD8 connected!");

        // Listen for pad/button presses
        input.addListener("noteon", "all", (e) => {
          buttonPressed = e.note.number - 36; // Pad MIDI note numbers start from 36
          buttonPressed = constrain(buttonPressed, 0, 7); // Ensure buttonPressed stays within 0-7
        });
      } else {
        console.log("LPD8 not found. Please connect and try again.");
      }
    }
  });

  if (navigator.requestMIDIAccess) {
    console.log("This browser supports WebMIDI!");
  } else {
    console.log("WebMIDI is not supported in this browser.");
  }

  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

  createCanvas(screenWidth, screenHeight); // set as full screen width
  angleMode(DEGREES);

  // Generate initial bubbles
  for (let i = 0; i < 20; i++) {
    bubbles.push(
      new Bubble(random(width), height + random(100), random(20, 50))
    );
  }
}

function onMIDISuccess(midiAccess) {
  for (var input of midiAccess.inputs.values()) {
    input.onmidimessage = getMIDIMessage;
  }
}

function onMIDIFailure() {
  console.log("Could not access your MIDI devices.");
}

function getMIDIMessage(midiMessage) {
  value = midiMessage.data[2];
  channel = midiMessage.data[1];
  on = midiMessage.data[0];

  console.log(`${on}, ${channel}, ${value}`);

  switch (channel) {
    case 40:
      if (value > 0) {
        clamOneOpen = true;
      } else {
        clamOneOpen = false;
      }
      break;
    case 41:
      if (value > 0) {
        clamTwoOpen = true;
      } else {
        clamTwoOpen = false;
      }
      break;
    case 42:
      if (value > 0) {
        clamThreeOpen = true;
      } else {
        clamThreeOpen = false;
      }
      break;
    case 43:
      if (value > 0) {
        clamFourOpen = true;
      } else {
        clamFourOpen = false;
      }
      break;
    default:
      console.log("No case was met.");
      break;
  }
}

function draw() {
  background(0);
  tint(255, 205);
  image(backgroundImage, 0, 0, screenWidth, screenHeight); // Draw background image

  // Draw clams based on open states
  let clamsOpen = [clamOneOpen, clamTwoOpen, clamThreeOpen, clamFourOpen];
  noTint();
  drawClams(clamsOpen);

  // Draw and update each bubble
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].move();
    bubbles[i].display();

    // Remove bubble if clicked
    if (bubbles[i].isClicked(mouseX, mouseY)) {
      bubbles.splice(i, 1); // Remove the clicked bubble
    }

    // Reset bubble position if it moves off the canvas
    if (bubbles[i].y < -bubbles[i].size) {
      bubbles[i].y = height + random(100);
      bubbles[i].x = random(width);
    }
  }
}

function drawClams(clamsOpen) {
  push();
  translate(0, screenHeight - clamHeight);
  push();
  translate(150, -210);
  rotate(10);
  createClam(clamsOpen[0], false, 1);
  pop();
  push();
  translate(590, -90);
  rotate(-10);
  createClam(clamsOpen[1], true, 0.6);
  pop();
  push();
  translate(650, -40);
  rotate(5);
  createClam(clamsOpen[2], false, 0.8);
  pop();
  push();
  translate(930, -20);
  rotate(5);
  createClam(clamsOpen[3], true, 0.8);
  pop();
  pop();
}

function createClam(isOpen, flipped, size) {
  push();
  scale(size, size);
  if (isOpen) {
    translate(0, -20);
    rotate(-15);
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
