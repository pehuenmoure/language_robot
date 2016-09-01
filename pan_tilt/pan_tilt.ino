#include <Servo.h> 
#include <String.h>

Servo panservo;
Servo tiltservo;

const int maxpan = 150;
const int minpan = 40;
const int maxtilt = 200;
const int mintilt = 120;
String input = "";
//char input;

int pan = 100;
int tilt = 200;
int step = 10;
void setup() { 

  panservo.attach(8);  
  tiltservo.attach(9);
  panservo.write(pan);
  tiltservo.write(tilt);

  Serial.begin(9600);  //this is the deafult rate for node serialport
  Serial.println("ready");
} 

void loop() { 

  if(Serial.available() > 0){
    input = Serial.readStringUntil('\n');
//    while(input != 'p' && input != 't'){
//      input = (char)Serial.read();
//      delay(1);
//    }

    if (input [0] == 'p' || input[0] == 't'){
      int val = 0;
      val += (int)(input[1] - (byte)'0') * 100;
      val += (int)(input[2] - (byte)'0') * 10;
      val += (int)(input[3] - (byte)'0');
      if(val > 180){
        val = val - 360;
      }
      if (input[0] == 'p'){
        pan = pan + val;
      }
//      else{
//        tilt = tilt + val;
//      }
    }

//    if(input[0] == 'a'){
//      //if((pan + step) < maxpan) 
//      pan += step;
//    }
//
//    if(input[0] == 'd'){
//      //if((pan - step) > minpan) 
//      pan -= step;
//    }
//
//    if(input[0] == 's'){
//      //if((tilt + step ) < maxtilt) 
//      tilt += step;
//    }
//
//    if(input[0] == 'w'){
//      //if((tilt - step ) > mintilt) 
//      tilt -= step;
//    }

    if(pan < minpan) pan = minpan;
    if(pan > maxpan) pan = maxpan;

    if(tilt < mintilt) tilt = mintilt;
    if(tilt > maxtilt) tilt = maxtilt;

    panservo.write(pan);
//    tiltservo.write(tilt);
//    delay(5);
//    Serial.println("pan: " + (String)pan + " tilt: " + (String)tilt);
    Serial.println('d');
//    Serial.flush();
  }
}

//this code was adapted from an example by brad zdanivsky found on http://verticalchallenge.org/archives/2823 
