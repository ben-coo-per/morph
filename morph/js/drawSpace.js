
// var canvasSizes = {x: document.documentElement.clientWidth, y: document.documentElement.clientHeight};
if (document.documentElement.clientWidth > 768){
  var canvasSizes = {x: document.documentElement.clientWidth*0.66667, y: document.documentElement.clientHeight};
} else{
  var canvasSizes = {x: document.documentElement.clientWidth, y: document.documentElement.clientHeight};
}
var shapeArray = [];
var tempArray = [];
var renderPoly = {x:10,y:5};
var renderBinary = 1; //0 = not rendering & 1 = rendering
var vertexArray =[];

window.addEventListener('resize', resizeCanvas);

function resizeCanvas(){
  if (document.documentElement.clientWidth > 768){
    var canvasSizes = {x: document.documentElement.clientWidth*0.66667, y: document.documentElement.clientHeight};
  } else{
    var canvasSizes = {x: document.documentElement.clientWidth, y: document.documentElement.clientHeight};
  }

  myDrawSpace.resizeCanvas(canvasSizes.x*0.4,canvasSizes.y * 0.35);
  myThreeD.resizeCanvas(canvasSizes.x * 0.9,canvasSizes.y*0.5);
  myDrawSpace.clearDrawSpace()
}





var sketch1 = function(p){

//------variables----------
  p.brushChoice = 0; // 0 = circle & 1 = square
  p.shapeArray = [];
  p.mirrorOn = 0; // 0 = no mirror & 1 = mirrors to other side
  p.hoverColor = {};
  p.vertexCleanBinary = 0;
  p.drawMode = 'paint'; //vertex, paint, or erase
  p.movingBinary = 0;
  p.txt = 'draw'
  // p.dxThresh = 1.50;
  // p.runBinary = 0; //0=shape path is not running on a curve & 1 = it is
  // p.runDirection; //0=running to the left & 1= to the right

  p.setup = function() {
    //create scene
    p.canvas = p.createCanvas(canvasSizes.x*0.4,canvasSizes.y*0.35);

    p.drawSpace = p.createGraphics(p.canvas.width, p.canvas.height);
    p.selectedCol = p.color(140); //selected button color
    p.unselectedCol = p.color(230); //unselected button color
    // p.background(10);

  };

//-----------standard draw loop---------
  p.draw = function(){
    // p.thicknessSlider = document.getElementById("thicknessSlider");
    document.getElementById("numVerticeSlider").max = p.shapeArray.length*0.65;
    p.numVertices = document.getElementById("numVerticeSlider").value;
    p.vertexCleaning();


    //draw mirror line
    p.drawSpace.line(p.canvas.width/2, 0, p.canvas.width/2, p.canvas.height);





    //display shapes
    if(p.drawMode == 'paint'){
      for (let i = 0; i < p.shapeArray.length; i++){
        p.overBool = p.shapeArray[i].isOver();
        if (p.overBool){
          p.shapeArray[i].showPaint(1);
        } else{
          p.shapeArray[i].showPaint();
        }
      }
    } else if (p.drawMode == 'vertex') {
      p.drawSpace.background(242);
      p.drawSpace.stroke(1);
      p.drawSpace.line(p.canvas.width/2, 0, p.canvas.width/2, p.canvas.height);
      for (let i=0; i < p.vertShapeArray.length; i++){
        if(i==0){
          lastVertX = p.vertShapeArray[i].x;
          lastVertY = p.vertShapeArray[i].y;
        } else {
          lastVertX = p.vertShapeArray[i-1].x;
          lastVertY = p.vertShapeArray[i-1].y;
        }

        p.overBool = p.vertShapeArray[i].isOver();
        if (p.overBool){
          p.vertShapeArray[i].showVert(1, lastVertX, lastVertY);
        } else{
          p.vertShapeArray[i].showVert(0, lastVertX, lastVertY);
        }
      }

    }
    // p.stroke(1);
    p.image(p.drawSpace, 0, 0);
    p.text(p.txt, 10,10,30,30);

    if(renderBinary){
      myDrawSpace.export();
    }

    // if(p.vertexCleanBinary && p.mouseIsPressed != 1){
    //
    //   setTimeout(p.vertexCleaning, 800);
    //   p.vertexCleanBinary = 0;
    // }
  };



p.vertexCleaning = function(){
  p.cleanShapeArray();
  p.shapesToVertices();
}

p.cleanShapeArray = function(){
  p.shapeArray = p.shapeArray.filter(function(value, index, arr){return value != undefined;});
}

//-------mouse dragged functionality
  p.mouseDragged = function(){          //this adds items to arrays and paints them on the drawSpace when mouse dragged
    if (p.drawMode == 'paint'){
      if (p.mouseX > 0 && p.mouseX < p.drawSpace.width && p.mouseY > 0 && p.mouseY < p.drawSpace.height){
        // p.thickness = p.thicknessSlider.value; //how thicc?
        p.newShape = new p.shape();
        p.shapeArray.push(p.newShape);
        p.vertexCleanBinary = 1;
        document.getElementById("numVerticeSlider").value = p.round(p.shapeArray.length*0.15);

      }

      if (p.mirrorOn == 1){
        p.newMirroredShape = new p.shape(1); //variable is mirror bool
        p.shapeArray.push(p.newMirroredShape);    //-> creation toggled in toggle.js
      }


    }
    else if(p.drawMode == 'vertex'){
      for (let i = 0; i < p.shapeArray.length; i++){
        p.overBool = p.shapeArray[i].isOver();
        if(p.overBool){
          p.shapeArray[i].moveShape();
          // console.log(p.movingBinary);
        }
      }
      // p.movingBinary = 0;
    }

    // else if(p.drawMode == 'erase'){
    //   //add erase functionality
    // }
  };

  p.mouseReleased = function(){
    p.movingBinary = 0;
  }

  p.mousePressed = function(){
    if (p.mouseX > 0 && p.mouseX < p.drawSpace.width && p.mouseY > 0 && p.mouseY < p.drawSpace.height && p.drawMode == 'paint'){
      // p.thickness = p.thicknessSlider.value;
      p.newShape = new p.shape();
      p.shapeArray.push(p.newShape);
    }
  };




//----------shape creation & showing--------
//shape constructor function
  p.shape = function(mirrorBool = 0){
    if (mirrorBool == 1){
      this.x = (p.canvas.width - p.mouseX)
    } else{
      this.x = p.mouseX;
    }
    this.y = p.mouseY;
    this.thickness = 16;
    this.brushChoice = p.brushChoice;

    this.baseColor = p.color(43,55,90);
    this.hoverColor = p.color(220, 123, 90);
  };

  //show shape in draw mode
    p.shape.prototype.showPaint = function(hoverBinary = 0){
      //Set color based on T/F hover binary
      if (hoverBinary == 1){
        p.drawSpace.fill(this.hoverColor);

      } else {
        p.drawSpace.fill(this.baseColor);
      };

      p.drawSpace.noStroke();
        p.drawSpace.ellipse(this.x, this.y, this.thickness);
      //determine brushStroke --> this may be more useful later but if could translate to the vertices either being 'normal' vertices or curveVertices
      // if (this.brushChoice == 0){
      //   p.drawSpace.ellipse(this.x, this.y, this.thickness);
      // } else{
      //   p.drawSpace.rectMode(p.CENTER);
      //   p.drawSpace.rect(this.x, this.y, this.thickness, this.thickness);
      // }
    };

    //vertex mode show
    p.shape.prototype.showVert = function(hoverBinary = 0, lastVertX, lastVertY){
      //Set color based on T/F hover binary
      if (hoverBinary == 1){
        p.drawSpace.fill(this.hoverColor);
      } else {
        p.drawSpace.fill(this.baseColor);
      };
      p.drawSpace.stroke(1);
      p.drawSpace.line(lastVertX,lastVertY,this.x,this.y);
      p.drawSpace.noStroke();
      p.drawSpace.ellipse(this.x, this.y, this.thickness);
    };

    //change hover binary if floating over
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
    };

    p.shape.prototype.moveShape = function(){
      p.movingBinary = 1;
      this.x = p.mouseX;
      this.y = p.mouseY;
    };

  p.shapesToVertices = function(){
    p.vertShapeArray = [];
    divideBy = p.round(p.shapeArray.length/p.numVertices);
    for (let i= 0; i < p.shapeArray.length; i++){
      if (i%(p.round(p.shapeArray.length/p.numVertices)) == 0){
        p.vertShapeArray.push(p.shapeArray[i]);
      }
    }
  }



//--------Buttons----------
    p.clearDrawSpace = function() {
      let justCleared = p.shapeArray.splice(0, p.shapeArray.length);
      p.drawSpace.background(p.color(244, 241,242));
      p.drawSpace.stroke(1);
      p.drawMode = 'paint';
      p.txt = "draw"
    }

    p.togglePaintBrush = function(){
      //change colors of buttons
      p.drawMode = 'paint';
    }
    p.toggleVertexBrush = function() {
        if (p.drawMode == 'paint'){
          p.drawMode = 'vertex';
          p.txt = "adjust"
        } else {
          //add logic to change DOM elements to next page
        }
    }

    // p.next = function() {
    //   if (p.drawMode == 'paint'){
    //     p.drawMode = 'vertex';
    //     p.txt = "adjust"
    //   } else if (p.drawMode = 'vertex';){
    //     //add logic to change DOM elements to next page
    //   }
    // }


  p.export = function(){
    shapeArray = p.vertShapeArray;
  }

}

var myDrawSpace = new p5(sketch1,"drawSpace-div");

var sketch2 = function(p){

  // p.sliceArray = [];
  p.rotationTracker = 0;
  p.res = 30;
  p.rotationAmount = 360;

  p.vertexArray = [];

  p.setup = function(array){
    p.threeDCanvas = p.createCanvas(canvasSizes.x * 0.9, canvasSizes.y*0.5, p.WEBGL);
    // new p.camera(0,0,-10,0,0,0,0,0,0);

    // p.background(p.color(41, 50,65));
  }

  p.draw = function(){
    p.orbitControl(10,10,0.1);
    p.clear();

    p.angleMode(p.DEGREES);


    //-------keeping incase I want to include in the future---------
        // p.rSlider = document.getElementById("rSlider");
        // p.gSlider = document.getElementById("gSlider");
        // p.bSlider = document.getElementById("bSlider");

        // p.materialColor = p.color(p.rSlider.value, p.gSlider.value, p.bSlider.value)


        // p.rotationAmount = document.getElementById("rotationSlider").value;
        // p.res = document.getElementById("resolutionSlider").value;


    // p.noStroke();
    p.stroke(200);
    p.strokeWeight(0.1)
    p.ambientLight(160);
    p.pointLight(250, 250, 250, -1, 0, -1);
    p.materialColor = p.color(135, 132, 179);


    p.yAvg = p.findYCenter();
    p.drawSpaceWidth = myDrawSpace.width;

  if (renderBinary == 1){   //checks if rendering is on
    p.updateRender();
  }
}

  p.mappedCurve = function(shape){
    this.y = shape.y;
    this.rho = (p.drawSpaceWidth/2 - shape.x); //rho = distance from the center
  }


  p.updateRender = function(){
    for (let i=0; i<shapeArray.length; i++){
      newCurve = new p.mappedCurve(shapeArray[i]);
      p.vertexArray.push(newCurve);
    };

    for (let phi=0; phi < p.rotationAmount; phi += p.res){
      p.ambientMaterial(p.materialColor);
      for (let j=0; j < (p.vertexArray.length-1); j++){
        p.beginShape()
        p.vertex(p.vertexArray[j].rho*p.cos(phi),       p.vertexArray[j].y-p.yAvg,     p.vertexArray[j].rho*p.sin(phi));
        p.vertex(p.vertexArray[j].rho*p.cos(phi+p.res), p.vertexArray[j].y-p.yAvg,     p.vertexArray[j].rho*p.sin(phi+p.res));
        p.vertex(p.vertexArray[j+1].rho*p.cos(phi+p.res), p.vertexArray[j+1].y-p.yAvg,  p.vertexArray[j+1].rho*p.sin(phi+p.res));
        p.vertex(p.vertexArray[j+1].rho*p.cos(phi),       p.vertexArray[j+1].y-p.yAvg,   p.vertexArray[j+1].rho*p.sin(phi));
        p.endShape(p.CLOSE);
      };
    };
    p.vertexArray = [];
  };

//------------creation and functions of potslices---------
  // p.potslice = function(shape){
  //   this.shape = shape;
  //   this.thickness = this.shape.thickness;
  //   this.yAvg = p.yAvg;
  //   this.drawSpaceWidth = p.drawSpaceWidth;
  //
  //   this.radius = (this.drawSpaceWidth/2 - this.shape.x);
  //   this.yTranslation = (this.yAvg - shape.y);
  //
  //   //specify torus polygons
  //   this.detailX = renderPoly.x; //24
  //   this.detailY = renderPoly.y; //16
  // }
  //   p.potslice.prototype.createTorusSlice = function(){
  //     p.translate(0, 0, this.yTranslation);
  //     p.torus(this.radius, this.thickness, this.detailX, this.detailY);
  //     p.translate(0, 0, -this.yTranslation);
  //   };





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
var myThreeD = new p5(sketch2, "threeD-div");


function render(){
  //change button text
  if (renderBinary == 0){
    document.getElementById("renderButton").textContent = " stop ";
  } else {
    document.getElementById("renderButton").textContent = "render";
  };
  renderBinary = !renderBinary;
};
