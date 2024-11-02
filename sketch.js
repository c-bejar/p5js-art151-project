let buttonPressed = 0;

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

  createCanvas(windowWidth, windowHeight);
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
  background("blue");
  // TODO: Game stuff
}
