var outputcw;
var timeIni1;
var timeFin1;
var timeIni0;
var timeIni0;
var auxTime=0;
var globalFlagHighIni=false;
var globalIniHigh=0;
var globalFlagLowIni=false;
var globalIniLow=0;
var x=0;
var contBitRead=0;
var bufferBitRead =[];
var contByteRead=0;
var bufferByteRead =[];

//Parte microfono
var auxTimeMicrofono=0;
var globalFlagHighIniMicrofono=false;
var globalIniHighMicrofono=0;
var globalFlagLowIniMicrofono=false;
var globalIniLowMicrofono=0;

var areaRX;
var areaTX;


function pulseInHighMicrofono(){ 
 micLevel=mic.getLevel();
 //ellipse(width/2, constrain(height-micLevel*height*5, 0, height), 10, 10);
 if (micLevel<=0.5){
  if (globalFlagHighIniMicrofono==true){
   globalFlagHighIniMicrofono=false;
   return(millis()-globalIniHighMicrofono);
  }
  else{  
   return -1;
  }
 }
 else{
  if (globalFlagHighIniMicrofono==true){
   return -1;
  }
  else{
   globalIniHighMicrofono=millis();
   globalFlagHighIniMicrofono=true;
   return -1;
  }
 }
}

function pulseInLowMicrofono(){
 micLevel = mic.getLevel();
 if (micLevel>0.5){
  if (globalFlagLowIniMicrofono==true){
   globalFlagLowIniMicrofono=false;
   return(millis()-globalIniLowMicrofono);
  }
  else{  
   return -1;
  }
 }
 else{
  if (globalFlagLowIniMicrofono==true){
   return -1;
  }
  else
  {
   globalIniLowMicrofono=millis();
   globalFlagLowIniMicrofono=true;
   return -1;
  }
 }
}



function pulseInHigh(){ 
 if (mouseIsPressed==false){
  if (globalFlagHighIni==true){
   globalFlagHighIni=false;
   return(millis()-globalIniHigh);
  }
  else{  
   return -1;
  }
 }
 else{
  if (globalFlagHighIni==true){
   return -1;
  }
  else
  {
   globalIniHigh=millis();
   globalFlagHighIni=true;
   return -1;
  }
 }
}

function pulseInLow(){
 if (mouseIsPressed==true){
  if (globalFlagLowIni==true){
   globalFlagLowIni=false;
   return(millis()-globalIniLow);
  }
  else{  
   return -1;
  }
 }
 else{
  if (globalFlagLowIni==true){
   return -1;
  }
  else
  {
   globalIniLow=millis();
   globalFlagLowIni=true;
   return -1;
  }
 }
}

function AddByteBufferRead(dato){
 bufferByteRead[contByteRead]=dato;
 areaRX.elt.placeholder+=bufferByteRead[contByteRead]; 
 contByteRead++; 
}

function AddBitBufferRead(dato){
 bufferBitRead[contBitRead]=dato; 
 contBitRead++;
 if (contBitRead>7){ 
  contBitRead=0;
  var auxByte=(bufferBitRead[7]*128)+(bufferBitRead[6]*64)+(bufferBitRead[5]*32)+(bufferBitRead[4]*16)+(bufferBitRead[3]*8)+(bufferBitRead[2]*4)+(bufferBitRead[1]*2)+(bufferBitRead[0]);
  AddByteBufferRead(auxByte);  
 }
}

function pollRaton(){
   //if (mouseButton === LEFT) {
   //   ellipse(50, 50, 50, 50);
   // }
   // if (mouseButton === RIGHT) {
   //   rect(25, 25, 50, 50);
   // }
   // if (mouseButton === CENTER) {
   //   triangle(23, 75, 50, 20, 78, 75);
   //} 
   auxTime= pulseInHigh();
   if (auxTime>-1){
    for (i=1;i<(auxTime/100);i++){
      //area.elt.placeholder += '1';
	  stroke(255,255,255);
	  rect(x,10,1,30);
	  x++;
      AddBitBufferRead(1);
	}
   }
   
   auxTime= pulseInLow();
   if (auxTime>-1){
    for (i=1;i<(auxTime/100);i++){
     //area.elt.placeholder += '0';
	 stroke(0,0,0);
	 rect(x,10,1,30);
	 x++;
	 AddBitBufferRead(0);
	}
   }

  /*if (mouseIsPressed) { 
    timeIni1= millis();
    ellipse(50, 50, 50, 50);
  } else {
    timeFin1= millis();
	auxTime= (timeFin1-timeIni1);
	area.elt.placeholder = auxTime;
    rect(25, 25, 50, 50);
  } */
}

function pollMicrofono(){ 
 auxTimeMicrofono= pulseInHighMicrofono();
 if (auxTimeMicrofono>-1){
  for (i=1;i<(auxTimeMicrofono/100);i++){
   //area.elt.placeholder += '1';
   stroke(255,255,255);
   rect(x,10,1,30);
   x++;
   //AddBitBufferRead(1);
  }
 }
 
 auxTimeMicrofono= pulseInLowMicrofono();
 if (auxTimeMicrofono>-1){
  for (i=1;i<(auxTimeMicrofono/100);i++){
   //area.elt.placeholder += '0';
   stroke(0,0,0);
   rect(x,10,1,30);
   x++;	 
  }
 }
}


function setup(){
  // put setup code here
  createCanvas(640,480);  
    
  areaRX=createElement('textarea');
  areaRX.position(10,65);
  areaRX.style('width','600px');
  areaRX.style('height','300px');
  areaRX.elt.placeholder='';
        
  outputcw=createInput();
  outputcw.position(10,375); 
  outputcw.style('size',260);
  outputcw.style('width','460px');  
  
  btnOutput=createButton('Send');
  btnOutput.position(480,outputcw.y);
  //btnOutput.mousePressed(greet);
  
  areaTX=createElement('textarea');
  areaTX.position(400,405);
  areaTX.elt.placeholder='';  
  
  background(0);
  
  mic=new p5.AudioIn()
  mic.start();
}

function draw(){
  // put drawing code here
  //ellipse(50, 50, 80, 80);
  
  //background(0);
  
 pollRaton();
 pollMicrofono();
}