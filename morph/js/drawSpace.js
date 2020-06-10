var canvasSizes = {x: window.window.innerWidth*0.25, y: window.window.innerHeight*0.5};
var shapeArray = [];
var tempArray = [];
var renderPoly = {x:10,y:5};
var renderBinary = 0; //0 = not rendering & 1 = rendering


var sketch1 = function(p){

//------variables----------
  p.brushChoice = 0; // 0 = circle & 1 = square
  p.shapeArray = [];
  p.mirrorOn = 1; // 0 = no mirror & 1 = mirrors to other side
  p.hoverColor = {};

  p.setup = function() {
    //create scene
    p.canvas = p.createCanvas(canvasSizes.x,canvasSizes.y);

    p.drawSpace = p.createGraphics(p.canvas.width, p.canvas.height);
    p.drawSpace.background(200);
  };

//-----------standard draw loop---------
  p.draw = function(){
    p.selectedCol = p.color(140); //selected button color
    p.unselectedCol = p.color(230); //unselected button color
    p.thicknessSlider = document.getElementById("thicknessSlider");

    //draw mirror line
    p.drawSpace.line(p.canvas.width/2, 0, p.canvas.width/2, p.canvas.height);

    //display shapes
    for (let i = 0; i < p.shapeArray.length; i++){
      p.overBool = p.shapeArray[i].isOver();
      if (p.overBool){
        p.shapeArray[i].show(1);
      } else{
        p.shapeArray[i].show();}
    };

    p.image(p.drawSpace, 0, 0);
  };

//-------mouse dragged functionality
  p.mouseDragged = function(){          //this adds items to arrays and paints them on the drawSpace when mouse dragged
    if (p.mouseX > 0 && p.mouseX < p.drawSpace.width && p.mouseY > 0 && p.mouseY < p.drawSpace.height){
      p.thickness = p.thicknessSlider.value; //how thicc?
      p.newShape = new p.shape();
      p.shapeArray.push(p.newShape);

      if (p.mirrorOn == 1){
        p.newMirroredShape = new p.shape(1); //variable is mirror bool
        p.shapeArray.push(p.newMirroredShape);    //-> creation toggled in toggle.js
      }
    }
  };


//----------shape creation & showing--------
  p.shape = function(mirrorBool = 0){

    if (mirrorBool == 1){
      this.x = (p.canvas.width - p.mouseX)
    } else{
      this.x = p.mouseX;
    }
    this.y = p.mouseY;
    this.thickness = p.thickness;
    this.brushChoice = p.brushChoice;

    this.baseColor = p.color(40,30,100);
    this.hoverColor = p.color(255, 204, 0);
  };  //shape building function
    p.shape.prototype.show = function(hoverBinary = 0){
      //Set color based on T/F hover binary
      if (hoverBinary == 1){
        p.drawSpace.fill(this.hoverColor);
      } else {
        p.drawSpace.fill(this.baseColor);
      };

      p.drawSpace.noStroke();

      if (this.brushChoice == 0){
        p.drawSpace.ellipse(this.x, this.y, this.thickness);
      } else{
        p.drawSpace.rectMode(p.CENTER);
        p.drawSpace.rect(this.x, this.y, this.thickness, this.thickness);
      }
    };  //show shape function
    p.shape.prototype.isOver = function(){
      if (this.shape == 0){ //For circle brush
        this.d = dist(mouseX, mouseY, this.x, this.y);
        return (this.d < this.thickness);
      } else{               //For square brush
        this.leftBound = (this.x-this.thickness/2);
        this.rightBound = (this.x+this.thickness/2);
        this.topBound = (this.y-this.thickness/2);
        this.bottomBound = (this.y+this.thickness/2);

        return (this.leftBound < p.mouseX && p.mouseX < this.rightBound && this.topBound < p.mouseY && p.mouseY < this.bottomBound);
      }
    };    //change hover binary if floating over

//--------Buttons----------
    p.clearDrawSpace = function() {
      let justCleared = p.shapeArray.splice(0, p.shapeArray.length);
      p.drawSpace.background(200);
      p.drawSpace.stroke(1);
    }
    p.toggleCircleBrush = function(){
      //change colors of buttons
      p.brushChoice = 0;
    }
    p.toggleSquareBrush = function() {
      //change colors of buttons
      p.brushChoice = 1;
    }
    // p.undoClear = function(){}

  p.export = function(){
    shapeArray = p.shapeArray;
  }

  }
var myDrawSpace = new p5(sketch1,"drawSpace-div");


var sketch2 = function(p){
  p.angle = {x:1.5708, y:0};;
  p.sliceArray = [];
  p.rotationAngleChange = {x:0, y:0.01};
  p.rotationDecay = {x:0.97,y:0.97}
  p.mouseLogArray = [];
  p.calcRotationBinary = 0;


  p.setup = function(array){
    p.threeDCanvas = p.createCanvas(canvasSizes.x, canvasSizes.y, p.WEBGL);
    // p.threeDCanvas.parent('threeD-div');

    p.background(140,0,130,30);
  }

  p.draw = function(){
    p.directionalLight(255,255,70,0,1,1,-1);
    p.ambientLight(20);
    p.background(140,0,130,30);
    // p.fill(130,100,150);
    // p.directionalLight(255,255,230,-1,-1,0);

    p.ambientMaterial(200,190,250);
    p.noStroke();


    p.rotateY(p.angle.y);
    p.rotateX(p.angle.x);

    // if (renderBinary == 0){
    //   p.sphere(10,3,3);
    // };



    p.yAvg = p.findYCenter();
    p.drawSpaceWidth = myDrawSpace.width;

    // p.stroke(0.1);
    // p.fill(100,100,100);
    //--------------create slices from array and make toruses-----
    for (let i=0; i<shapeArray.length; i++){
          newSlice = new p.potslice(shapeArray[i]);

          if (renderBinary == 1){   //checks if rendering is on
            newSlice.createTorusSlice()
            p.sliceArray.push(p.newSlice)

            if (p.calcRotationBinary) {
            p.rotationChange = p.calcDeltaVector();
            p.rotationAngleChange.x = p.rotationChange.x;
            p.rotationAngleChange.y = p.rotationChange.y;

            calcRotationBinary = 0;
        }
          };

    };
    p.angle.x = (p.angle.x + p.rotationAngleChange.x) * p.rotationDecay.x;
    p.angle.y = (p.angle.y + p.rotationAngleChange.y) * p.rotationDecay.y;
  };

//-------mouse rotation logging when dragged-------
  p.mouseDragged = function() {
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height){
      p.newMouseLog = new p.mouseLog();
      p.mouseLogArray.push(p.newMouseLog);
      p.calcRotationBinary = 1;
    };
  };

p.mouseLog = function(){
  this.mX = p.mouseX;
  this.mY = p.mouseY;
};
//-----------calculate the rotation from mouse drag input---------
p.calcDeltaVector = function() {
  this.rotationChange = {
    x: 0,
    y: 0
  };
  this.deltaSum = {
    x: 0,
    y: 0
  };

  for (let i = 1; i < p.mouseLogArray.length; i++) {
    this.deltaSum.x += p.mouseLogArray[i].mX - p.mouseLogArray[i-1].mX;
    this.deltaSum.y += p.mouseLogArray[i].mY - p.mouseLogArray[i-1].mY;
  }

  this.rotationChange.x = -this.deltaSum.y/1000;
  this.rotationChange.y = this.deltaSum.x/1000;

  return this.rotationChange
}


//------------creation and functions of potslices---------
  p.potslice = function(shape){
    this.shape = shape;
    this.thickness = this.shape.thickness;
    this.yAvg = p.yAvg;
    this.drawSpaceWidth = p.drawSpaceWidth;

    this.radius = (this.drawSpaceWidth/2 - this.shape.x);
    this.yTranslation = (this.yAvg - shape.y);

    //specify torus polygons
    this.detailX = renderPoly.x; //24
    this.detailY = renderPoly.y; //16
  }
    p.potslice.prototype.createTorusSlice = function(){
      p.translate(0, 0, this.yTranslation);
      p.torus(this.radius, this.thickness, this.detailX, this.detailY);
      p.translate(0, 0, -this.yTranslation);
    };

//--------Find Y-Center Function---------
    p.findYCenter = function(){
      p.topCoord = p.height; //***height of drawSpace***
      p.bottomCoord = 0;
      //check y coordinate for each & replace topCoord & bottomCoord variables
      for (let i = 0; i < shapeArray.length; i++){
        if (shapeArray[i].y < p.topCoord){
          p.topCoord = shapeArray[i].y;
        }
        if (shapeArray[i].y > p.bottomCoord){
          p.bottomCoord = shapeArray[i].y;
        }
      }
      return ((p.topCoord + p.bottomCoord) / 2);
    }
  }
// var myThreeD = new p5(sketch2);
var myThreeD = new p5(sketch2, "threeD-div");


function render(){
  myDrawSpace.export();


  //change button text
  if (renderBinary == 0){
    document.getElementById("renderButton").textContent = "stop rendering";
  } else {
    document.getElementById("renderButton").textContent = "render";
  };
  renderBinary = !renderBinary;
};
