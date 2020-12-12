const mqtt = require('mqtt')
const fs = require('fs')
var FileWriter = require('wav').FileWriter;
var mic = require('mic');
const FormData = require('form-data');
const fetch = require("node-fetch");


// Setup MQTT
const client = mqtt.connect('mqtt://tim-server.local', {
  username: "xxx", // Your MQTT server username here
  password: "xxx" // Your MQTT password here
})


// Start program when connected to MQTT
client.on('connect', () => {
  console.log("connected to MQTT");

  init();
})


//
async function init() {
  console.time('soundDetectorLoop')
  await record();
  const json = await process();

  result(json);

  console.timeEnd('soundDetectorLoop')

  await init();
}


// Setup/reset the recorder
const record = async () => {
  return new Promise( (resolve, reject) => {
    // Start the function
    const micInstance = mic({
      rate: '16000',
      channels: '1',
      debug: false
    });

    const micInputStream = micInstance.getAudioStream();

    var outputFileStream = new FileWriter('./test.wav', {
      sampleRate: 16000,
      channels: 1
    });

    micInputStream.pipe(outputFileStream);

    micInstance.start();

    setTimeout(async () => {
      micInstance.stop();

      resolve(true);
    }, 4000);
  });
}


// Do the machine learning stuff
async function process() {
  return new Promise( (resolve, reject) => {
    const formData = new FormData()

    setTimeout( () => {
      const audioBlob = fs.readFileSync('./test.wav');
      formData.append('audio', audioBlob, 'audio.wav')

      // make the POST call to the model endpoint and send the form data containing the audio
      fetch(("http://0.0.0.0:5000/model/predict"), {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then((response) => {
        // yay! we got a response. convert it to JSON
        return response.json()
      }).then((prediction) => {
        console.log(prediction)
        resolve(prediction);
      }).catch((err) => {
        console.log(err)
        reject(err);
      })
    }, 1000);
  });
}


// Send result to MQTT
function result(data) {
  const bestPrediction = data?.predictions[0];

  const { label, probability } = bestPrediction;

  console.log(label, probability) ;

  if(probability > 0.3) {
    console.log(label);

    client.publish("audioAnalyser", JSON.stringify(bestPrediction))
  }
}
