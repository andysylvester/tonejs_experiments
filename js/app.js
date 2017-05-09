
/// SETUP OSC ///
var monoSynth = new Tone.MonoSynth({

    "filterEnvelope" : {
        "attack" : 0.02,
        "decay" : 0.1,
        "sustain" : 0.2,
        "release" : 0.9,
    },
    filter: {
      type: 'lowpass'
    },
    oscillator:{
      type:"sine"
    }
}).toMaster();

var monoSynth = new Tone.MonoSynth().toMaster();
var major_generator = 5;
var minor_generator = 3;

//set initial volume
Tone.Master.volume.rampTo(-10, 0.05);

nx.onload = function() {
  nx.colorize("#212121"); // sets accent (default)

  initControls();

  //event listeners

  /// BUTTON ///
  midiStatus.on("*", function(data){
    playPattern();
  });

  ///  SLIDERS  ///
  sliderMajor.on("*", function(data){
    major_generator = Math.trunc(data.value);
	// console.log("Major generator is", data.value);
  });
  sliderMinor.on("*", function(data){
    minor_generator = Math.trunc(data.value);
	//console.log("Minor generator is", minor_generator);
  });


};

var initControls = function(){
  midiStatus.mode = "impulse";
  ///  SLIDERS  ///
  sliderMajor.set({value:5});
  sliderMinor.set({value:3});
};

// *******************************************************
// 
//  FUNCTION: resultant
// 
//  USAGE: resultant(major_generator, minor_generator);
// 
//  DESCRIPTION:
//     This function will generate a Schillinger resultant
//     based on two integers for the major generator and minor
//     generator and return this as an array to the calling function.
// 
// 
//  INPUTS:
//     major_generator - First generator for the resultant
// 
//     minor_generator - Second generator for the resultant
// 
//  OUTPUTS:
//     resultant - Sequence of numbers returned as an array
// 
// *******************************************************

function resultant(major_generator, minor_generator) {
	// var major_generator = 7;
	// var minor_generator = 3;

	var total_counts   = major_generator * minor_generator;
	var result_counter = 0;
	var major_mod      = 0;
	var minor_mod      = 0;
	var i              = 0;
	var j              = 0;
	var resultant      = [];

	console.log("Generator Total = %d \n", total_counts);

	while (i < total_counts) {
	   i++;
	   result_counter++;
	   major_mod = i % major_generator;
	   minor_mod = i % minor_generator;
	   if ((major_mod == 0) || (minor_mod == 0)) {
		  resultant.push(result_counter);
		  result_counter = 0;
	   }
	   console.log("%d \n", i);
	   console.log("Modulus of %d is %d  \n", major_generator, major_mod);
	   console.log("Modulus of %d is %d  \n", minor_generator, minor_mod);
	}

	console.log("\n");
	console.log("The resultant is ", resultant);
	console.log("The resultant length is ", resultant.length);
	return resultant;
};

var playPattern = function(){

    var test = resultant(major_generator, minor_generator);
    var listOfObjects = [];
    var i = 0;
    // Create an array of events
	test.forEach(function(entry) {
		var singleObj = {};
		singleObj['time'] = i;
		singleObj['note'] = Tone.Frequency(entry + 60, "midi");
		singleObj['dur'] = 1;
		listOfObjects.push(singleObj);
		i++;
	});

	//pass in an array of events
	var part = new Tone.Part(function(time, event){
		//the events will be given to the callback with the time they occur
		monoSynth.triggerAttackRelease(event.note, event.dur, time)
	}, listOfObjects);
	//start the part at the beginning of the Transport's timeline
	part.start(0);
    Tone.Transport.start('+0.1');

}
