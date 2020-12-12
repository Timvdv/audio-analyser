# Audio Analyser
This program records audio samples and sends them through a machine learning algorithm which classifies the sounds.
The results are send through MQTT to any home automation platform.

## Part list
(some are referral links, thanks to [DigitSpace](https://www.digitspace.com/) for sending me some of the parts)
- [Raspberry Pi](https://www.digitspace.com/products/raspberry-pi/raspberry-pi-4/development-board/raspberry-pi-4-model-b-main-board-2g?fcfbe02aa4229df72)
- [Raspberry Pi heatsink](https://www.kiwi-electronics.nl/aluminium-heatsink-behuizing-voor-de-raspberry-pi-4)
- [USB Microphone](https://www.digitspace.com/raspberry-pi-4b-3b-usb-microphone?fcfbe02aa4229df72)

## Run this code
- Make sure the machine learning model is running in another terminal via this guide: https://github.com/IBM/MAX-Audio-Classifier
- Run `npm install`
- Run `node main.js`

## Raspberry Pi
- Install the machine learning model
    - Install Docker
    - Install NodeJS
    - Install Git
- Run the Machine learning model using a custom build
    - Clone MAX Audio classifier repo https://github.com/IBM/MAX-Audio-Classifier
    - Run `cd` to go into the folder
    - Change to the following branch: `git checkout xuhdev-patch-1`
    - Build it using `docker build -f Dockerfile.arm32v7 -t max-audio-classifier .`
    - Run `docker run -it -p 5000:5000 max-audio-classifier` to start the model
- When the model is running open a second terminal, ssh into the pi and run the code in this repo like described above

### Temperature check on the Raspberry Pi
Run this `npm run rpi-temp` to check the temperate. It can get kind of hot.