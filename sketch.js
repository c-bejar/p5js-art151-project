let buttonPressed = 0;
let bubbles = []; //Array to store bubble objects
let houseImage; // Variable to store the house image
let clamTop, clamBottom; // Variable to store image of clam's top and bottom halves
let backgroundImage; // Variable to store the background image

let clamWidth = 494 / 2;
let clamHeight = 270 / 2;

function preload() {
  // Load the images before the sketch starts
  houseImage = loadImage("media/house.png");
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

  createCanvas(windowWidth, windowHeight); // set as full screen width
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

  /**
   * Channel can be used to identify what control is being used
   * 37-43 are the pads, and 70-77 are the knobs
   * value is the output of the control
   * Pads give 0 when released, and >0 when pushed
   * Knobs Give values 0-127
   * idk what "on" is but
   *  176 corresponds to a knob
   *  153 corresponds to a pad being pushed
   *  137 corresponds to a pad being released
   */

  // We can use this function to edit variables or do other things
  // when the user does something with controls
}

function draw() {
  // background("blue");
  // TODO: Game stuff

  // Draw the background image scaled to window size
  image(backgroundImage, 0, 0, windowWidth, windowHeight);

  // purely for testing:
  drawClams();

  // Draw and update each bubble
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].move();
    bubbles[i].display();

    // If the bubble goes off the top of the canvas, reset its position
    if (bubbles[i].y < -bubbles[i].size) {
      bubbles[i].y = height + random(100);
      bubbles[i].x = random(width);
    }
  }
  // Draw the house image at the bottom right corner
  let imgWidth = houseImage.width / 2; // Scale image width
  let imgHeight = houseImage.height / 2; // Scale image height
  image(
    houseImage,
    width - imgWidth - 5,
    height - imgHeight - 5,
    imgWidth,
    imgHeight
  ); // Position with some padding
}

function drawClams() {
  push();
  translate(0, windowHeight - clamHeight);

  createClam(0, false);
  translate(clamWidth + 10, 0);
  createClam(1, false);
  translate(clamWidth + 400, 0);
  createClam(0, true);
  translate(clamWidth + 10, 0);
  createClam(0, true);
  pop();
}

function createClam(x, flipped) {
  console.log(x);
  push();
  if (flipped) scale(-1, 1);
  image(clamBottom, 0, 0, clamWidth, clamHeight);
  push();
  if (true) {
    rotate(-15);
  }
  image(clamTop, 0, 0, clamWidth, clamHeight);
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
    fill(255, 255, 255, 150); // Semi-transparent white color for the bubble
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}
