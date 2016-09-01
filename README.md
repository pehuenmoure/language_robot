# Ella

To run Ella:

1. Clone the repo onto your Pi's home folder
2. Upload the `pan_tilt.ino` inside the pan_tilt folder to your Arduino
3. On terminal cd into the mjpg folder: `~/Ella/mjpg-streamer-master/mjpg-streamer-experimental` and silently run the pi cam `./mjpg_streamer -o "output_http.so -w ./www" -i "input_raspicam.so -fps 15" &`
4. Navigate to the Ella folder and run the server: `node server.js /dev/ttyACM0`
5. In your browser go to http://andrea-pi.local:8000/
6. When you're done, shut down safely: `sudo halt`
7. Turn off speaker and power bank


Once stuff is setup up, these are the typical hardware steps before running the server:
1. Turn on power bank 
2. Turn on speaker 
3. Unplug and replug sound card
