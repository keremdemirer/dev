/******************************************************************

v.0.1
Dependencies:D3,Sylvester

********************************************************************/

class parabolFreeTransform {
  constructor(container,target,options){

    this.tcOffset = options.handles.tcOffset;
    this.handleRadius = options.handles.r;
    this.handleStrokeColor = options.handles.stroke;
    this.handleStrokeWidth = options.handles.strokeWidth;
    this.handleFill = options.handles.fill;
    this.target= target;
    this.container= container;
      
    this.bb = d3.select(this.target).node().getBBox();

    this.bb.ox = this.bb.x+this.bb.width/2;
    this.bb.oy = this.bb.y+this.bb.height/2;
    this.alpha = Math.atan2(this.bb.height,this.bb.width);    
    this.slope = this.bb.height/this.bb.width;
  }

  //METHODS
  updateStateStoreBB(){
  
  this.stateStore.bb.x= this.stateStore.tl.x;
  this.stateStore.bb.y= this.stateStore.tl.y;
  this.stateStore.bb.width= this.stateStore.br.x-this.stateStore.tl.x;
  this.stateStore.bb.height= this.stateStore.br.y-this.stateStore.tl.y;
  this.stateStore.bb.r = Math.sqrt( 
  Math.pow(this.stateStore.bb.width,2)+
  Math.pow(this.stateStore.bb.height,2) 
  )/2; 
  this.stateStore.bb.ox = this.stateStore.bb.x + this.stateStore.bb.width/2
  this.stateStore.bb.oy = this.stateStore.bb.y + this.stateStore.bb.height/2

  }
  saveAction(s,a,tx,ty){
  this.stateStore.s=s;
  this.stateStore.tx=tx;
  this.stateStore.ty=ty;
  this.stateStore.a=a;
  }
  
  updateOrigin(tox,toy){
 
  d3.select(this.target).style('transform-origin',`${tox}px ${toy}px`); 

  // var c = d3.select(this.container);
  // c.selectAll('.ctol').remove()
  // c.selectAll('.ctoc').remove()
  // c.append('line')
  // .classed('ctol',true)
  // .attr('x1',0)
  // .attr('y1',toy)
  // .attr('x2',tox)
  // .attr('y2',toy)
  // .attr('stroke-width',3)
  // .attr('stroke','blue')
  // .attr('fill','blue')

  // c.append('line')
  // .classed('ctol',true)  
  // .attr('x1',tox)
  // .attr('y1',0)
  // .attr('x2',tox)
  // .attr('y2',toy)
  // .attr('stroke-width',3)
  //   .attr('stroke','blue')
  // .attr('fill','blue')

  // c.append('circle')
  // .classed('ctoc',true)
  // .attr('cx',tox)
  // .attr('cy',toy)
  // .attr('r',10)
  // .attr('stroke-width',3)
  // .attr('stroke','blue')
  // .attr('fill','red')

  this.stateStore.targetOrigin.x=tox;
  this.stateStore.targetOrigin.y=toy;
  }
  updateDeltaRotations(){
  

  this.stateStore.tl.drx = this.stateStore.tl.rx - this.stateStore.tl.x;
  this.stateStore.tl.dry = this.stateStore.tl.ry - this.stateStore.tl.y;
  this.stateStore.tr.drx = this.stateStore.tr.rx - this.stateStore.tr.x;
  this.stateStore.tr.dry = this.stateStore.tr.ry - this.stateStore.tr.y;
  this.stateStore.bl.drx = this.stateStore.bl.rx - this.stateStore.bl.x;
  this.stateStore.bl.dry = this.stateStore.bl.ry - this.stateStore.bl.y;
  this.stateStore.br.drx = this.stateStore.br.rx - this.stateStore.br.x;
  this.stateStore.br.dry = this.stateStore.br.ry - this.stateStore.br.y;
  if(this.stateStore.scaling){
  this.stateStore.dox = this.stateStore.ox - this.stateStore.bb.ox;
  this.stateStore.doy = this.stateStore.oy - this.stateStore.bb.oy;
  }

  }
  
  drawControlPoints(){
  
  // var c = d3.select(this.container);
  // c.selectAll('.rotvis').remove()
  // c.append('circle')
  // .classed('rotvis',true)
  // .attr('cx',  this.stateStore.tl.rx)
  // .attr('cy',  this.stateStore.tl.ry)
  // .attr('r', 5)
  // .attr('stroke-width',2)
  // .attr('stroke','black')
  // .attr('fill','rgba(255,0,0,1)');
  //   c.append('circle')
  // .classed('rotvis',true)
  // .attr('cx',  this.stateStore.bl.rx)
  // .attr('cy',  this.stateStore.bl.ry)
  // .attr('r',5)
  // .attr('stroke-width',2)
  // .attr('stroke','black')
  // .attr('fill','rgba(255,0,255,1)');
  //   c.append('circle')
  // .classed('rotvis',true)
  // .attr('cx',  this.stateStore.tr.rx)
  // .attr('cy',  this.stateStore.tr.ry)
  // .attr('r', 5)
  // .attr('stroke-width',2)
  // .attr('stroke','black')
  // .attr('fill','rgba(0,255,255,1)');
  // c.append('circle')
  // .classed('rotvis',true)
  // .attr('cx',  this.stateStore.br.rx)
  // .attr('cy',  this.stateStore.br.ry)
  // .attr('r', 5)
  // .attr('stroke-width',2)
  // .attr('stroke','black')
  // .attr('fill','rgba(0,0,255,1)');
  //  c.append('circle')
  // .classed('rotvis',true)
  // .attr('cx',  this.stateStore.ox)
  // .attr('cy',   this.stateStore.oy)
  // .attr('r', 5)
  // .attr('stroke-width',2)
  // .attr('stroke','black')
  // .attr('fill','rgba(0,0,0,1)');  
  
      this.eventStore.tl
      .attr('cx',this.stateStore.tl.rx)
      .attr('cy',this.stateStore.tl.ry)
      this.eventStore.tr
      .attr('cx',this.stateStore.tr.rx)
      .attr('cy',this.stateStore.tr.ry)
      this.eventStore.bl
      .attr('cx',this.stateStore.bl.rx)
      .attr('cy',this.stateStore.bl.ry)
      this.eventStore.br
      .attr('cx',this.stateStore.br.rx)
      .attr('cy',this.stateStore.br.ry)
      this.eventStore.tc
      .attr('cx',this.stateStore.tc.rx)
      .attr('cy',this.stateStore.tc.ry)
  }
  updateControlPoints(activeHandle){ 

var cosRot = Math.cos(this.stateStore.a);
var sinRot = Math.sin(this.stateStore.a);

  
if(activeHandle === 'tc'){

var cosAMinusRot = Math.cos(this.alpha-this.stateStore.a); 
var sinAMinusRot = Math.sin(this.alpha-this.stateStore.a);
var cosAPlusRot = Math.cos(this.alpha+this.stateStore.a); 
var sinAPlusRot = Math.sin(this.alpha+this.stateStore.a);
var cos90APlusRot = Math.cos(Math.PI/2 - this.alpha+this.stateStore.a); 
var sin90APlusRot = Math.sin(Math.PI/2 - this.alpha+this.stateStore.a);
var r = this.stateStore.bb.r;
var ox = this.stateStore.ox;
var oy = this.stateStore.oy;
//tl
     var nx = -r*cosAPlusRot+ox 
     var ny = -r*sinAPlusRot+oy 
     this.stateStore.tl.rx = nx;
     this.stateStore.tl.ry = ny;
//tr           

     nx = +r*sin90APlusRot+ox  
     ny = -r*cos90APlusRot+oy
     this.stateStore.tr.rx = nx;
     this.stateStore.tr.ry = ny;
//bl
     nx = -r*cosAMinusRot+ox  
     ny = +r*sinAMinusRot+oy
     this.stateStore.bl.rx = nx;
     this.stateStore.bl.ry = ny;
 //br
     nx = +r*cosAPlusRot+ox 
     ny = +r*sinAPlusRot+oy
     this.stateStore.br.rx = nx;
     this.stateStore.br.ry = ny;
  
this.stateStore.targetOrigin.x = this.stateStore.ox;
this.stateStore.targetOrigin.y = this.stateStore.oy;


}

else if(activeHandle === 'tl'){

var cosAPlusRot = Math.cos(this.alpha+this.stateStore.a); 
var sinAPlusRot = Math.sin(this.alpha+this.stateStore.a);
var r = this.stateStore.bb.r;

this.stateStore.tl.rx = this.stateStore.br.rx - 2*r * cosAPlusRot;
this.stateStore.tl.ry = this.stateStore.br.ry - 2*r * sinAPlusRot;
 
this.stateStore.bl.rx  = this.stateStore.br.rx - this.stateStore.bb.width * cosRot;
this.stateStore.bl.ry  = this.stateStore.br.ry - this.stateStore.bb.width * sinRot;
      
this.stateStore.tr.rx  = this.stateStore.br.rx + this.stateStore.bb.height * sinRot;
this.stateStore.tr.ry  = this.stateStore.br.ry - this.stateStore.bb.height * cosRot;
 
this.stateStore.ox = this.stateStore.br.rx - r * cosAPlusRot;
this.stateStore.oy = this.stateStore.br.ry - r * sinAPlusRot;
  
this.stateStore.targetOrigin.x = this.stateStore.br.rx;
this.stateStore.targetOrigin.y = this.stateStore.br.ry;

 }
else if(activeHandle === 'tr'){

var cos180APlusRot = Math.cos(Math.PI - this.alpha+this.stateStore.a); 
var sin180APlusRot = Math.sin(Math.PI - this.alpha+this.stateStore.a);
var r = this.stateStore.bb.r;
  
 this.stateStore.tl.rx  = this.stateStore.bl.rx + this.stateStore.bb.height * sinRot;
 this.stateStore.tl.ry  = this.stateStore.bl.ry - this.stateStore.bb.height * cosRot;
  
 this.stateStore.br.rx  = this.stateStore.bl.rx + this.stateStore.bb.width * cosRot;
 this.stateStore.br.ry  = this.stateStore.bl.ry + this.stateStore.bb.width * sinRot;
 
 this.stateStore.tr.rx = this.stateStore.bl.rx - 2*r * cos180APlusRot;
 this.stateStore.tr.ry = this.stateStore.bl.ry - 2*r * sin180APlusRot;

this.stateStore.ox = this.stateStore.bl.rx - r * cos180APlusRot;
this.stateStore.oy = this.stateStore.bl.ry - r * sin180APlusRot;

this.stateStore.targetOrigin.x = this.stateStore.bl.rx;
this.stateStore.targetOrigin.y = this.stateStore.bl.ry;

  
}
else if(activeHandle === 'bl'){
  
var cosAPlus90MinusRot = Math.cos(this.alpha+Math.PI/2 - this.stateStore.a);
var sinAPlus90MinusRot = Math.sin(this.alpha+Math.PI/2 - this.stateStore.a);
var r = this.stateStore.bb.r;
 
 this.stateStore.bl.rx = this.stateStore.tr.rx - 2*r * sinAPlus90MinusRot;
 this.stateStore.bl.ry = this.stateStore.tr.ry - 2*r * cosAPlus90MinusRot;
 
 this.stateStore.br.rx  = this.stateStore.tr.rx - this.stateStore.bb.height * sinRot;
 this.stateStore.br.ry  = this.stateStore.tr.ry + this.stateStore.bb.height * cosRot;
      
 this.stateStore.tl.rx  = this.stateStore.tr.rx - this.stateStore.bb.width * cosRot;
 this.stateStore.tl.ry  = this.stateStore.tr.ry - this.stateStore.bb.width * sinRot;
 
 this.stateStore.ox = this.stateStore.tr.rx - r * sinAPlus90MinusRot;
 this.stateStore.oy = this.stateStore.tr.ry - r * cosAPlus90MinusRot;

 this.stateStore.targetOrigin.x = this.stateStore.tr.rx;
 this.stateStore.targetOrigin.y = this.stateStore.tr.ry;

}
else if(activeHandle === 'br'){
 
var cosAPlusRot = Math.cos(this.alpha+this.stateStore.a); 
var sinAPlusRot = Math.sin(this.alpha+this.stateStore.a);
var r = this.stateStore.bb.r;
  
 this.stateStore.bl.rx = this.stateStore.tl.rx - this.stateStore.bb.height * sinRot;
 this.stateStore.bl.ry = this.stateStore.tl.ry + this.stateStore.bb.height * cosRot;
 
 this.stateStore.br.rx  = this.stateStore.tl.rx + 2*r * cosAPlusRot;
 this.stateStore.br.ry  = this.stateStore.tl.ry + 2*r * sinAPlusRot;
      
this.stateStore.tr.rx  = this.stateStore.tl.rx + this.stateStore.bb.width * cosRot;
this.stateStore.tr.ry  = this.stateStore.tl.ry + this.stateStore.bb.width * sinRot;
 
this.stateStore.ox = this.stateStore.tl.rx + r * cosAPlusRot;
this.stateStore.oy = this.stateStore.tl.ry + r * sinAPlusRot;

this.stateStore.targetOrigin.x = this.stateStore.tl.rx;
this.stateStore.targetOrigin.y = this.stateStore.tl.ry;

}

  

this.stateStore.tc.rx = this.stateStore.ox + (this.stateStore.bb.height/2 - this.tcOffset) * sinRot;
this.stateStore.tc.ry = this.stateStore.oy - (this.stateStore.bb.height/2 - this.tcOffset) * cosRot;


if(this.eventStore.freeDragging){
 
this.stateStore.tl.rx += this.eventStore.currentDragDeltaX;
this.stateStore.tl.ry += this.eventStore.currentDragDeltaY;
this.stateStore.tr.rx += this.eventStore.currentDragDeltaX;
this.stateStore.tr.ry += this.eventStore.currentDragDeltaY;
this.stateStore.bl.rx += this.eventStore.currentDragDeltaX;
this.stateStore.bl.ry += this.eventStore.currentDragDeltaY;
this.stateStore.br.rx += this.eventStore.currentDragDeltaX;
this.stateStore.br.ry += this.eventStore.currentDragDeltaY;
this.stateStore.tc.rx += this.eventStore.currentDragDeltaX;
this.stateStore.tc.ry += this.eventStore.currentDragDeltaY;
this.stateStore.ox += this.eventStore.currentDragDeltaX;
this.stateStore.oy += this.eventStore.currentDragDeltaY;
this.stateStore.targetOrigin.x += this.eventStore.currentDragDeltaX;
this.stateStore.targetOrigin.y += this.eventStore.currentDragDeltaY;
}  
  

this.updateDeltaRotations();
this.drawControlPoints();
}

updateCompansation(target,ctx,cty,drag,rotated,rtx,rty,change) {

  var ctrMat = $M([
  [1,0,ctx],
  [0,1,cty],
  [0,0,1]
  ]);
 
  rtx = rtx || 0;
  rty = rty || 0;
  
    if(drag){
      
  var deltaDragMat = $M([
  [1,0, this.stateStore.ddx],
  [0,1,this.stateStore.ddy],
  [0,0,1]
  ]);
    
    this.stateStore.ctrMat=deltaDragMat.x(this.stateStore.ctrMat);
    this.stateStore.dragCounter = 0;
    this.stateStore.dragged = false;

    this.stateStore.oldDdx = this.stateStore.ddx;
    this.stateStore.oldDdy = this.stateStore.ddy;
      

  }

 

    if(rotated){
            
      if(!change){

      }
      else{
      
      this.stateStore.ctrMat.elements[0][2] -= this.stateStore.oldRtx;
      this.stateStore.ctrMat.elements[1][2] -= this.stateStore.oldRty;

      this.stateStore.ctrMat.elements[0][2] += rtx;
      this.stateStore.ctrMat.elements[1][2] += rty;

      this.stateStore.oldRtx = rtx
      this.stateStore.oldRty = rty
      }
      

       this.stateStore.afterRotationAction = false;
       this.stateStore.dragCounter = 0;
    }
  
  this.stateStore.ctrMat=ctrMat.x(this.stateStore.ctrMat);
  this.transform(target,this.stateStore.s,this.stateStore.a,0,0);


}

transform(target,s,a,tx,ty,handles,rotation){

var rMat = $M([
  [Math.cos(a),-Math.sin(a),0],
  [Math.sin(a),Math.cos(a),0],
  [0,0,1]
]);
var trMat = $M([
  [1,0,tx],
  [0,1,ty],
  [0,0,1]
]);
var sMat = $M([
  [s,0,0],
  [0,s,0],
  [0,0,1]
]);

if(!rotation){

var translationMatrix = this.stateStore.ctrMat.x(trMat);     
var transformMatrix = sMat.x(rMat);
transformMatrix = transformMatrix.x(translationMatrix);

this.stateStore.transformMatrix = transformMatrix;
this.saveAction(s,a,tx,ty);

}

else if(rotation){

var transformMatrix = sMat.x(rMat); 
transformMatrix = transformMatrix.x(this.stateStore.ctrMat)
this.stateStore.transformMatrix = transformMatrix;
this.saveAction(this.stateStore.s,a,this.stateStore.tx,this.stateStore.ty);

}

var tme = transformMatrix.elements;  
var matrixString = `matrix(${tme[0][0]},${tme[1][0]},${tme[0][1]},${tme[1][1]},${tme[0][2]},${tme[1][2]})` 
d3.select(target).style('transform',matrixString);

}


init(){

var obj = this;

obj.stateStore ={
  s:1,
  tx:0,
  ty:0,
  a:0,
  lastOrigin:'tc',
  bb:{
    width:obj.bb.width,
    height:obj.bb.height,
    x:obj.bb.x,
    y:obj.bb.y,
ox:obj.bb.x + obj.bb.width/2,
oy:obj.bb.y + obj.bb.height/2
  },
ctrMat:$M([
  [1,0,0],
  [0,1,0],
  [0,0,1]
]),
transformMatrix:$M([
  [1,0,0],
  [0,1,0],
  [0,0,1]
]),
  tcOpsMat:$M([
  [1,0,0],
  [0,1,0],
  [0,0,1]
]),
tl:{
  x:obj.bb.x,
  y:obj.bb.y,
  rx:obj.bb.x,
  ry:obj.bb.y,
  drx:0,
  dry:0,
  r:obj.handleRadius,
  stroke:obj.handleStrokeColor,
  strokeWidth:obj.handleStrokeWidth,
  fill:obj.handleFill,
  id:'tl'

},
tr:{
  x:obj.bb.x + obj.bb.width,
  y:obj.bb.y,
  rx:obj.bb.x + obj.bb.width,
  ry:obj.bb.y,
  drx:0,
  dry:0,
  r:obj.handleRadius,
  stroke:obj.handleStrokeColor,
  strokeWidth:obj.handleStrokeWidth,
  fill:obj.handleFill,
  id:'tr'
},
bl:{
  x:obj.bb.x,
  y:obj.bb.y + obj.bb.height,
  rx:obj.bb.x,
  ry:obj.bb.y + obj.bb.height,
  drx:0,
  dry:0,
  r:obj.handleRadius,
  stroke:obj.handleStrokeColor,
  strokeWidth:obj.handleStrokeWidth,
  fill:obj.handleFill,
  id:'bl'
},
br:{
  x:obj.bb.x + obj.bb.width,
  y:obj.bb.y + obj.bb.height,
  rx:obj.bb.x + obj.bb.width,
  ry:obj.bb.y + obj.bb.height,
  drx:0,
  dry:0,
  r:obj.handleRadius,
  stroke:obj.handleStrokeColor,
  strokeWidth:obj.handleStrokeWidth,
  fill:obj.handleFill,
  id:'br'
},
tc:{
  x:obj.bb.x + obj.bb.width/2,
  y:obj.bb.y + obj.tcOffset,
  rx:obj.bb.x + obj.bb.width/2,
  ry:obj.bb.y + obj.tcOffset,
  drx:0,
  dry:0,
  r:obj.handleRadius,
  stroke:obj.handleStrokeColor,
  strokeWidth:obj.handleStrokeWidth,
  fill:obj.handleFill,
  id:'tc'
},
ox:obj.bb.x + obj.bb.width/2,
oy:obj.bb.y + obj.bb.height/2,
dox:0,
doy:0,
target:{
x:obj.bb.x,
y:obj.bb.y
},
dragTranslation:{
  x:0,
  y:0
},
ddx:0,
ddy:0,
dragged:false,
freeDragging:false,
afterScalingAction:false,
targetOrigin:{
  x:0,
  y:0
},
oldRtx:0,
oldRty:0,
acDDX:0,
acDDY:0,
oldDdx:0,
oldDdy:0,  
dragCounter:0,
conrnerHandlesClicked:false,
rotating:false,
scaling:false
}
obj.stateStore.dsx=function(){

return  this.bb.width - obj.bb.width  ;
}
obj.stateStore.dsy=function(){

return  this.bb.height - obj.bb.height ;
}

obj.handleAttributes = [obj.stateStore.tl,obj.stateStore.tr,obj.stateStore.bl,obj.stateStore.br,obj.stateStore.tc];
obj.eventStore = {
  lastAngle : 0,
  freeDragging:false,
tlCanCompansate:true,
trCanCompansate:true,
blCanCompansate:true,
brCanCompansate:true,
tcCancompansate:true,
lastWidthBeforeScale:obj.stateStore.bb.width
};
    
    // var c = d3.select(this.container);
    // c.append('rect')
    // .attr('x',this.bb.x)
    // .attr('y',this.bb.y)
    // .attr('width',this.bb.width)
    // .attr('height',this.bb.height)
    // .attr('stroke-width',2)
    // .attr('stroke','yellow')
    // .attr('fill','rgba(255,255,0,0.1)');


        //CREATE DRAG EVENTS
    var topLeftDrag = d3.drag(obj)
                .on("start", onTopLeftDragStart)
                .on("drag", onTopLeftDrag)
                .on("end", onTopLeftDragEnd);
    var topRightDrag = d3.drag(obj)
                .on("start", onTopRightDragStart)
                .on("drag", onTopRightDrag)
                .on("end", onTopRightDragEnd);
    var bottomLeftDrag = d3.drag(obj)
                .on("start", onBottomLeftDragStart)
                .on("drag", onBottomLeftDrag)
                .on("end", onBottomLeftDragEnd);
    var bottomRightDrag = d3.drag(obj)
                .on("start", onBottomRightDragStart)
                .on("drag", onBottomRightDrag)
                .on("end", onBottomRightDragEnd);
    var topCenterDrag = d3.drag(obj)
                .on("start", onTopCenterDragStart)
                .on("drag", onTopCenterDrag)
                .on("end", onTopCenterDragEnd);
    var targetDrag = d3.drag(obj)
                .on("start", onTargetDragStart)
                .on("drag", onTargetDrag)
                .on("end", onTargetDragEnd);
    d3.select(this.target).call(targetDrag);
  

//DEFINE EVENT FUNCTIONS
function onTopLeftDragStart(d){
 //unutma
  var w = obj.stateStore.bb.width;
  obj.eventStore.lastWidthBeforeScale = w;
  
        obj.eventStore.handle = d3.select(this);

        obj.eventStore.tr = d3.select(`#tr`);
        obj.eventStore.bl = d3.select(`#bl`);  
        obj.eventStore.tc = d3.select(`#tc`); 
        
        obj.eventStore.lastS = obj.stateStore.s;
        
        var ssbbx = obj.stateStore.bb.x,
        ssbby = obj.stateStore.bb.y,
        ssbbwidth = obj.stateStore.bb.width,
        ssbbheight = obj.stateStore.bb.height;
        obj.eventStore.eventStartBB = {
          x:ssbbx,
          y:ssbby,
          width:ssbbwidth,
          height:ssbbheight
        };
        
        var drag=false;  
        if(obj.stateStore.dragged){
        drag = true;
        }
        var rotated=false;
        if(obj.stateStore.rotated){
        rotated = true;
        }

  //UPDATE ORIGIN TO BOTTOM RIGHT
  if(obj.eventStore.tlCanCompansate){
  
  obj.updateOrigin(obj.stateStore.br.rx,obj.stateStore.br.ry);


  if(obj.stateStore.lastOrigin === 'tr'){
  obj.updateCompansation(obj.target,0,obj.stateStore.dsy(),drag,rotated,obj.stateStore.br.drx,obj.stateStore.br.dry,true);
  
  }
  if(obj.stateStore.lastOrigin === 'tl'){

  
  obj.updateCompansation(obj.target,obj.stateStore.dsx(),obj.stateStore.dsy(),drag,rotated,obj.stateStore.br.drx,obj.stateStore.br.dry,true);

  }
  if(obj.stateStore.lastOrigin === 'bl'){
  obj.updateCompansation(obj.target,obj.stateStore.dsx(),0,drag,rotated,obj.stateStore.br.drx,obj.stateStore.br.dry,true);

  }
  if(obj.stateStore.lastOrigin === 'tc'){ 
  obj.updateCompansation(obj.target,obj.stateStore.dsx()/2,obj.stateStore.dsy()/2,drag,rotated,obj.stateStore.br.drx,obj.stateStore.br.dry,true);
    
    
}
 obj.stateStore.lastOrigin  = 'br';
obj.stopCompansation('tl');
  }
  else{
      obj.updateCompansation(obj.target,0,0,drag);
      obj.stateStore.lastOrigin  = 'br';
  }
        
}


function onBottomRightDragStart(d){

        obj.eventStore.handle = d3.select(this);

        obj.eventStore.tr = d3.select(`#tr`);
        obj.eventStore.bl = d3.select(`#bl`);  
        obj.eventStore.tc = d3.select(`#tc`); 
        
        obj.eventStore.lastS = obj.stateStore.s;
  
        var ssbbx = obj.stateStore.bb.x,
        ssbby = obj.stateStore.bb.y,
        ssbbwidth = obj.stateStore.bb.width,
        ssbbheight = obj.stateStore.bb.height;
        obj.eventStore.eventStartBB = {
          x:ssbbx,
          y:ssbby,
          width:ssbbwidth,
          height:ssbbheight
        };

  
  
var drag=false;    
if(obj.stateStore.dragged){
drag =true;
}       
var rotated=false;
  if(obj.stateStore.rotated){
  rotated = true;
 }

  //UPDATE ORIGIN BOTTOM RIGHT
if(obj.eventStore.brCanCompansate){



obj.updateOrigin(obj.stateStore.tl.rx,obj.stateStore.tl.ry);


if(obj.stateStore.lastOrigin === 'tr'){
obj.updateCompansation(obj.target,-1*obj.stateStore.dsx(),0,drag,rotated,obj.stateStore.tl.drx,obj.stateStore.tl.dry,true);

}
if(obj.stateStore.lastOrigin === 'br'){
obj.updateCompansation(obj.target,-1*obj.stateStore.dsx(),-1*obj.stateStore.dsy(),drag,rotated,obj.stateStore.tl.drx,obj.stateStore.tl.dry,true);

}
if(obj.stateStore.lastOrigin === 'bl'){
obj.updateCompansation(obj.target,0,-1*obj.stateStore.dsy(),drag,rotated,obj.stateStore.tl.drx,obj.stateStore.tl.dry,true);

}
if(obj.stateStore.lastOrigin === 'tc'){
obj.updateCompansation(obj.target,-1*obj.stateStore.dsx()/2,-1*obj.stateStore.dsy()/2,drag,rotated,obj.stateStore.tl.drx,obj.stateStore.tl.dry,true);
}

  obj.stateStore.lastOrigin  = 'tl';
obj.stopCompansation('br');
}
  else{
      obj.updateCompansation(obj.target,0,0,drag);
      obj.stateStore.lastOrigin  = 'tl';
  }

}
function onTopRightDragStart(d){
  
        obj.eventStore.handle = d3.select(this);
        obj.eventStore.br = d3.select(`#br`);
        obj.eventStore.tl = d3.select(`#tl`);  
        obj.eventStore.tc = d3.select(`#tc`); 
        
        obj.eventStore.lastS = obj.stateStore.s;
  
          var ssbbx = obj.stateStore.bb.x,
        ssbby = obj.stateStore.bb.y,
        ssbbwidth = obj.stateStore.bb.width,
        ssbbheight = obj.stateStore.bb.height;
        obj.eventStore.eventStartBB = {
          x:ssbbx,
          y:ssbby,
          width:ssbbwidth,
          height:ssbbheight
        };
    
  
  var drag=false;    
if(obj.stateStore.dragged){
drag =true;
}   
var rotated=false;
  if(obj.stateStore.rotated){
  rotated = true;
 }        

        
//UPDATE ORIGIN BOTTOM LEFT
if(obj.eventStore.trCanCompansate){

obj.updateOrigin(obj.stateStore.bl.rx,obj.stateStore.bl.ry);

if(obj.stateStore.lastOrigin === 'br'){
obj.updateCompansation(obj.target,-1*obj.stateStore.dsx(),0,drag,rotated,+obj.stateStore.bl.drx,+obj.stateStore.bl.dry,true);

}
if(obj.stateStore.lastOrigin === 'tl'){
obj.updateCompansation(obj.target,0,obj.stateStore.dsy(),drag,rotated,+obj.stateStore.bl.drx,+obj.stateStore.bl.dry,true);

}
if(obj.stateStore.lastOrigin === 'tr'){
obj.updateCompansation(obj.target,-1*obj.stateStore.dsx(),obj.stateStore.dsy(),drag,rotated,obj.stateStore.bl.drx,+obj.stateStore.bl.dry,true);

}
if(obj.stateStore.lastOrigin === 'tc'){
obj.updateCompansation(obj.target,-1*obj.stateStore.dsx()/2,obj.stateStore.dsy()/2,drag,rotated,+obj.stateStore.bl.drx,+obj.stateStore.bl.dry,true);
}

obj.stateStore.lastOrigin  = 'bl';
  obj.stopCompansation('tr');
}
  else{
      obj.updateCompansation(obj.target,0,0,drag);
    obj.stateStore.lastOrigin  = 'bl';
  }

}
function onBottomLeftDragStart(d){
  
        obj.eventStore.handle = d3.select(this);
        obj.eventStore.br = d3.select(`#br`);
        obj.eventStore.tl = d3.select(`#tl`);  
        obj.eventStore.tc = d3.select(`#tc`); 
        obj.eventStore.lastS = obj.stateStore.s;
        
        var ssbbx = obj.stateStore.bb.x,
        ssbby = obj.stateStore.bb.y,
        ssbbwidth = obj.stateStore.bb.width,
        ssbbheight = obj.stateStore.bb.height;
        obj.eventStore.eventStartBB = {
          x:ssbbx,
          y:ssbby,
          width:ssbbwidth,
          height:ssbbheight
        };
  
  
  var drag=false;    
if(obj.stateStore.dragged){
drag =true;
} 
var rotated=false;
  if(obj.stateStore.rotated){
  rotated = true;
 }
        
//UPDATE ORIGIN TOP RIGHT
if(obj.eventStore.blCanCompansate){

//1 
obj.updateOrigin(obj.stateStore.tr.rx,obj.stateStore.tr.ry);
//2
if(obj.stateStore.lastOrigin === 'br'){
obj.updateCompansation(obj.target,0,-1*obj.stateStore.dsy(),drag,rotated,+obj.stateStore.tr.drx,+obj.stateStore.tr.dry,true);


}
if(obj.stateStore.lastOrigin === 'tl'){
obj.updateCompansation(obj.target,obj.stateStore.dsx(),0,drag,rotated,+obj.stateStore.tr.drx,+obj.stateStore.tr.dry,true);


}
if(obj.stateStore.lastOrigin === 'bl'){
obj.updateCompansation(obj.target,obj.stateStore.dsx(),-1*obj.stateStore.dsy(),drag,rotated,+obj.stateStore.tr.drx,+obj.stateStore.tr.dry,true);


}
if(obj.stateStore.lastOrigin === 'tc'){
obj.updateCompansation(obj.target,obj.stateStore.dsx()/2,-1*obj.stateStore.dsy()/2,drag,rotated,+obj.stateStore.tr.drx,+obj.stateStore.tr.dry,true);

}

obj.stateStore.lastOrigin  = 'tr';
  obj.stopCompansation('bl');
}
else{
    obj.updateCompansation(obj.target,0,0,drag);
    obj.stateStore.lastOrigin  = 'tr';
}

}
function onTopLeftDragEnd(d){
obj.stateStore.scaling = false;
  obj.updateStateStoreBB();
 if(obj.eventStore.lastWidthBeforeScale !== obj.stateStore.bb.width){
  obj.stateStore.afterScalingAction = true; 
 }
  else{
  obj.stateStore.afterScalingAction = false;  
  }
 obj.stateStore.conrnerHandlesClicked  =true; 

}
function onBottomRightDragEnd(d){
  obj.stateStore.scaling = false;
  obj.updateStateStoreBB();


  if(obj.eventStore.lastWidthBeforeScale !== obj.stateStore.bb.width){
  obj.stateStore.afterScalingAction = true; 
 }
  else{
  obj.stateStore.afterScalingAction = false;  
  }
obj.stateStore.conrnerHandlesClicked  =true;
}
function onTopRightDragEnd(d){
  obj.stateStore.scaling = false;
  obj.updateStateStoreBB();


   if(obj.eventStore.lastWidthBeforeScale !== obj.stateStore.bb.width){
  obj.stateStore.afterScalingAction = true; 
 }
  else{
  obj.stateStore.afterScalingAction = false;  
  }

obj.stateStore.conrnerHandlesClicked  =true;
}
function onBottomLeftDragEnd(d){
  obj.stateStore.scaling = false;
  obj.updateStateStoreBB();
   if(obj.eventStore.lastWidthBeforeScale !== obj.stateStore.bb.width){
  obj.stateStore.afterScalingAction = true; 
 }
  else{
  obj.stateStore.afterScalingAction = false;  
  }
 obj.stateStore.conrnerHandlesClicked  =true;
}
function onTopLeftDrag(d){

obj.stateStore.scaling = true;
  
  
        obj.eventStore.handleX = obj.stateStore.tl.x;
        obj.eventStore.handleY = obj.stateStore.tl.y;
        

        obj.eventStore.updatedX = obj.eventStore.handleX + d3.event.dx,
        obj.eventStore.updatedY = obj.eventStore.handleY + d3.event.dx*obj.slope;

        
        
  
        obj.eventStore.updatedTopCenterX = obj.eventStore.updatedX + (obj.stateStore.br.x - obj.eventStore.updatedX)/2;
        obj.eventStore.updatedTopCenterY = obj.eventStore.updatedY + obj.tcOffset;
        
        var n = obj.eventStore.updatedX -  obj.eventStore.eventStartBB.x;
        var s = 1 - n/ obj.eventStore.eventStartBB.width ;  
        s = s*obj.eventStore.lastS;
        
        obj.eventStore.handle.attr('cx',  obj.eventStore.updatedX)
        .attr('cy',   obj.eventStore.updatedY);
        obj.eventStore.bl.attr('cx',obj.eventStore.updatedX);
        obj.eventStore.tr.attr('cy',obj.eventStore.updatedY);
        obj.eventStore.tc
        .attr('cx', obj.eventStore.updatedTopCenterX)
        .attr('cy', obj.eventStore.updatedTopCenterY);
        
        obj.stateStore.tl.x = obj.eventStore.updatedX;
        obj.stateStore.tl.y = obj.eventStore.updatedY;
        obj.stateStore.bl.x = obj.eventStore.updatedX;
        obj.stateStore.tr.y = obj.eventStore.updatedY;
        obj.stateStore.tc.x = obj.eventStore.updatedTopCenterX;
        obj.stateStore.tc.y = obj.eventStore.updatedTopCenterY;

  obj.transform(obj.target,s,obj.stateStore.a,0,0);
  obj.updateStateStoreBB();
  obj.updateControlPoints('tl');



}
function onBottomRightDrag(d){
 obj.stateStore.scaling = true;    
        
        obj.eventStore.handleX = obj.stateStore.br.x;
        obj.eventStore.handleY = obj.stateStore.br.y;
        obj.eventStore.updatedX = obj.eventStore.handleX + d3.event.dx,
        obj.eventStore.updatedY = obj.eventStore.handleY + d3.event.dx*obj.slope;
        
        obj.eventStore.updatedTopCenterX = obj.eventStore.updatedX - (obj.eventStore.updatedX - obj.stateStore.tl.x)/2;

        var n = obj.eventStore.updatedX - obj.eventStore.eventStartBB.x;
        var s = n/obj.eventStore.eventStartBB.width ;  
        s = s*obj.eventStore.lastS;

        obj.eventStore.handle.attr('cx',  obj.eventStore.updatedX)
        .attr('cy',  obj.eventStore.updatedY )
        obj.eventStore.bl.attr('cy',   obj.eventStore.updatedY )
        obj.eventStore.tr.attr('cx',  obj.eventStore.updatedX)
        obj.eventStore.tc
        .attr('cx', obj.eventStore.updatedTopCenterX);

        obj.stateStore.br.x = obj.eventStore.updatedX;
        obj.stateStore.br.y = obj.eventStore.updatedY;
        obj.stateStore.bl.y = obj.eventStore.updatedY;
        obj.stateStore.tr.x = obj.eventStore.updatedX;
        obj.stateStore.tc.x = obj.eventStore.updatedTopCenterX;

     obj.transform(obj.target,s,obj.stateStore.a,0,0);
    obj.updateStateStoreBB();
  obj.updateControlPoints('br');

}
function onTopRightDrag(d){
obj.stateStore.scaling = true;
        obj.eventStore.handleX = obj.stateStore.tr.x;
        obj.eventStore.handleY = obj.stateStore.tr.y;
        obj.eventStore.updatedX = obj.eventStore.handleX + d3.event.dx;
        obj.eventStore.updatedY = obj.eventStore.handleY - d3.event.dx*obj.slope;
        obj.eventStore.updatedTopCenterX = obj.eventStore.updatedX - (obj.eventStore.updatedX - obj.stateStore.bl.x)/2;
        obj.eventStore.updatedTopCenterY = obj.eventStore.updatedY + obj.tcOffset;
        
        var n = obj.eventStore.updatedX - obj.eventStore.eventStartBB.x;
        var s = n/obj.eventStore.eventStartBB.width ;  
        s = s*obj.eventStore.lastS;
        
        obj.eventStore.handle.attr('cx',obj.eventStore.updatedX)
        .attr('cy',  obj.eventStore.updatedY)
        obj.eventStore.tl.attr('cy',  obj.eventStore.updatedY)
        obj.eventStore.br.attr('cx',  obj.eventStore.updatedX)
        obj.eventStore.tc
        .attr('cx', obj.eventStore.updatedTopCenterX)
        .attr('cy', obj.eventStore.updatedTopCenterY)

        obj.stateStore.tr.x = obj.eventStore.updatedX;
        obj.stateStore.tr.y = obj.eventStore.updatedY;
        obj.stateStore.tl.y = obj.eventStore.updatedY;
        obj.stateStore.br.x = obj.eventStore.updatedX;
        obj.stateStore.tc.x = obj.eventStore.updatedTopCenterX;
        obj.stateStore.tc.y = obj.eventStore.updatedTopCenterY;
 
 
     obj.transform(obj.target,s,obj.stateStore.a,0,0);
    obj.updateStateStoreBB();
    obj.updateControlPoints('tr');
                 
}
function onBottomLeftDrag(d){
obj.stateStore.scaling = true;
        obj.eventStore.handleX = obj.stateStore.bl.x;
        obj.eventStore.handleY = obj.stateStore.bl.y;
        obj.eventStore.updatedX = obj.eventStore.handleX + d3.event.dx,
        obj.eventStore.updatedY = obj.eventStore.handleY - d3.event.dx*obj.slope;
        obj.eventStore.updatedTopCenterX = obj.eventStore.updatedX + (obj.stateStore.tr.x - obj.eventStore.updatedX)/2;


        var n = obj.eventStore.updatedX - obj.eventStore.eventStartBB.x;
        var s = 1 - n/obj.eventStore.eventStartBB.width ;  
        s = s*obj.eventStore.lastS;
        
        obj.eventStore.handle.attr('cx',  obj.eventStore.updatedX)
        .attr('cy', obj.eventStore.updatedY)
        obj.eventStore.br.attr('cy',  obj.eventStore.updatedY)
        obj.eventStore.tl.attr('cx',  obj.eventStore.updatedX)
        obj.eventStore.tc.attr('cx', obj.eventStore.updatedTopCenterX)

        obj.stateStore.bl.x = obj.eventStore.updatedX;
        obj.stateStore.bl.y = obj.eventStore.updatedY;
        obj.stateStore.br.y = obj.eventStore.updatedY;
        obj.stateStore.tl.x = obj.eventStore.updatedX;
        obj.stateStore.tc.x = obj.eventStore.updatedTopCenterX;
   
        obj.transform(obj.target,s,obj.stateStore.a,0,0);
    obj.updateStateStoreBB();
  obj.updateControlPoints('bl');
}

//----- TRANSLATION DRAG EVENT

 function onTargetDragStart(d){
        obj.eventStore.bl = d3.select(`#bl`);
        obj.eventStore.tr = d3.select(`#tr`); 
        obj.eventStore.br = d3.select(`#br`);
        obj.eventStore.tl = d3.select(`#tl`);  
        obj.eventStore.tc = d3.select(`#tc`); 
        obj.eventStore.lastDragX = obj.stateStore.dragTranslation.x;
        obj.eventStore.lastDragY = obj.stateStore.dragTranslation.y;
     
        obj.eventStore.freeDragging = true;
}
function onTargetDrag(d){
   
        obj.eventStore.handleX = obj.stateStore.tx;
        obj.eventStore.handleY = obj.stateStore.ty;
        
        obj.eventStore.currentDragDeltaX =  d3.event.dx;
        obj.eventStore.currentDragDeltaY =  d3.event.dy;
  
        var tx = obj.stateStore.tx + d3.event.dx;
        var ty = obj.stateStore.ty + d3.event.dy;
        
        obj.stateStore.dragTranslation.x += d3.event.dx;
        obj.stateStore.dragTranslation.y += d3.event.dy;
  
        obj.eventStore.bl.attr('cx',obj.stateStore.bl.x += d3.event.dx)
        .attr('cy',obj.stateStore.bl.y += d3.event.dy)
        obj.eventStore.tr.attr('cx',obj.stateStore.tr.x += d3.event.dx)
        .attr('cy',obj.stateStore.tr.y += d3.event.dy)
        obj.eventStore.br.attr('cx',obj.stateStore.br.x += d3.event.dx)
        .attr('cy',obj.stateStore.br.y += d3.event.dy)
        obj.eventStore.tl.attr('cx',obj.stateStore.tl.x += d3.event.dx)
        .attr('cy',obj.stateStore.tl.y += d3.event.dy) 
        obj.eventStore.tc.attr('cx',obj.stateStore.tc.x += d3.event.dx)
        .attr('cy',obj.stateStore.tc.y += d3.event.dy)
        
        obj.transform(obj.target,
          obj.stateStore.s,
          obj.stateStore.a,
          tx,
          ty);
obj.updateControlPoints();
  
               obj.updateOrigin(obj.stateStore.targetOrigin.x,
               obj.stateStore.targetOrigin.y)

}
function onTargetDragEnd(d){
  obj.stateStore.dragCounter++;

  if(obj.stateStore.dragCounter===1){
  obj.stateStore.ddx = obj.stateStore.dragTranslation.x-obj.eventStore.lastDragX;
  obj.stateStore.ddy = obj.stateStore.dragTranslation.y-obj.eventStore.lastDragY;
  }
  else if(obj.stateStore.dragCounter>1){
  obj.stateStore.ddx += obj.stateStore.dragTranslation.x-obj.eventStore.lastDragX;
  obj.stateStore.ddy += obj.stateStore.dragTranslation.y-obj.eventStore.lastDragY;
  }



if(obj.eventStore.lastDragX !==  obj.stateStore.dragTranslation.x){
  obj.stateStore.dragged = true;
}

  obj.updateStateStoreBB()

  obj.eventStore.freeDragging = false;

}

function onTopCenterDragStart()  {
  
  
var drag=false;    

if(obj.stateStore.dragged){
drag =true;

} 

var rotated=false; 

if(obj.stateStore.rotated){
var rotated =true;
}   

   if(obj.eventStore.lastWidthBeforeScale !== obj.stateStore.bb.width){
  obj.stateStore.afterScalingAction = true; 
 }
  else{
  obj.stateStore.afterScalingAction = false;  
  }


//UPDATE ORIGIN TOP CENTER
if(obj.eventStore.tcCanCompansate){

if(!obj.stateStore.rotated){  

obj.updateOrigin(obj.stateStore.bb.ox,obj.stateStore.bb.oy);
}
else{
obj.updateOrigin(obj.stateStore.ox,obj.stateStore.oy);
}

if(obj.stateStore.lastOrigin === 'tl'){
obj.updateCompansation(obj.target,obj.stateStore.dsx()/2,obj.stateStore.dsy()/2,drag,rotated,obj.stateStore.dox,obj.stateStore.doy,true);

}
if(obj.stateStore.lastOrigin === 'tr'){
obj.updateCompansation(obj.target,-1*obj.stateStore.dsx()/2,obj.stateStore.dsy()/2,drag,rotated,obj.stateStore.dox,obj.stateStore.doy,true);

}
if(obj.stateStore.lastOrigin === 'bl'){
obj.updateCompansation(obj.target,obj.stateStore.dsx()/2,-1*obj.stateStore.dsy()/2,drag,rotated,obj.stateStore.dox,obj.stateStore.doy,true);

}
if(obj.stateStore.lastOrigin === 'br'){

obj.updateCompansation(obj.target,-1*obj.stateStore.dsx()/2,-1*obj.stateStore.dsy()/2,drag,rotated,obj.stateStore.dox,obj.stateStore.doy,true);

}
obj.stateStore.lastOrigin  = 'tc';
obj.stopCompansation('tc');

}
else{

    obj.updateCompansation(obj.target,0,0,drag);
    obj.stateStore.lastOrigin  = 'tc';

}  
        obj.eventStore.handle = d3.select(this);
        
        obj.eventStore.hx = d3.event.sourceEvent.pageX;
        obj.eventStore.hy = d3.event.sourceEvent.pageY;

        obj.eventStore.dragging = true;
        
        obj.eventStore.ox = obj.stateStore.bb.x + obj.stateStore.bb.width/2;
        obj.eventStore.oy = obj.stateStore.bb.y + obj.stateStore.bb.height/2; // origin point

}
function onTopCenterDrag(d){

         obj.stateStore.rotating = true;
         obj.eventStore.pageX = d3.event.sourceEvent.pageX;
         obj.eventStore.pageY = d3.event.sourceEvent.pageY;
         obj.eventStore.dx =  obj.eventStore.pageX - obj.eventStore.ox;
         obj.eventStore.dy =  obj.eventStore.pageY - obj.eventStore.oy;
         
       
         if(obj.eventStore.pageX !== obj.eventStore.ox && obj.eventStore.pageY !== obj.eventStore.oy){

         var s_rad =  Math.atan2(obj.eventStore.dy, obj.eventStore.dx); // current to origin
         s_rad -= Math.atan2(obj.eventStore.hy - obj.eventStore.oy, obj.eventStore.hx - obj.eventStore.ox); // handle to origin
         s_rad += obj.eventStore.lastAngle; // relative to the last one
         
         obj.transform(obj.target,obj.stateStore.s,s_rad,0,0,false,true);
           
            obj.updateStateStoreBB();
            obj.updateControlPoints('tc');
         }
}
function onTopCenterDragEnd(d){
  obj.stateStore.rotating = false;

        obj.eventStore.dragging = false
        var sx = d3.event.sourceEvent.pageX,
            sy = d3.event.sourceEvent.pageY;
        // Saves the last angle for future iterations
      
        var s_rad = Math.atan2(sy - obj.eventStore.oy, 
                               sx - obj.eventStore.ox); // current to origin
        s_rad -= Math.atan2(obj.eventStore.hy - obj.eventStore.oy, 
                            obj.eventStore.hx - obj.eventStore.ox); // handle to origin
        
        if(s_rad){
        obj.stateStore.afterRotationAction = true;
        }
        
        obj.stateStore.rotated = true;
        s_rad += obj.eventStore.lastAngle;
        
        
        obj.eventStore.lastAngle = s_rad;
 
  }  

var handleGroup = d3.select(this.container).append('g').attr('id',`handleGroup`);
handleGroup
.selectAll('circle')
.data(this.handleAttributes)
.enter()
.append('circle')
.attr('id',function(d,i){return d.id;})
.attr("cx",function(d,i){return d.x;})
.attr("cy",function(d,i){return d.y;})
.attr("r", function(d,i){return d.r;})
.attr('stroke',function(d,i){return d.stroke;})
.attr('stroke-width',function(d,i){return d.strokeWidth;})
.attr('fill',function(d,i){return d.fill;});
handleGroup.select('#tl').call(topLeftDrag);
handleGroup.select('#tr').call(topRightDrag);
handleGroup.select('#bl').call(bottomLeftDrag);
handleGroup.select('#br').call(bottomRightDrag);
handleGroup.select('#tc').call(topCenterDrag);

//Update HANDLE AND TARGET ORIGINS TO CENTER
this.updateOrigin(this.stateStore.tl.x+this.stateStore.bb.width/2,this.stateStore.tl.y+this.stateStore.bb.height/2);
this.stateStore.lastOrigin='tc';

  this.eventStore.tl=d3.select('#tl');
  this.eventStore.tr=d3.select('#tr');
  this.eventStore.bl=d3.select('#bl');
  this.eventStore.br=d3.select('#br');
  this.eventStore.tc=d3.select('#tc');

}

stopCompansation(loc){
  if(loc === 'tl'){
    this.eventStore.tlCanCompansate=false;
    this.eventStore.trCanCompansate=true;
    this.eventStore.blCanCompansate=true;
    this.eventStore.brCanCompansate=true;
    this.eventStore.tcCanCompansate=true;
   }
   if(loc === 'tr'){
    this.eventStore.tlCanCompansate=true;
    this.eventStore.trCanCompansate=false;
    this.eventStore.blCanCompansate=true;
    this.eventStore.brCanCompansate=true;
    this.eventStore.tcCanCompansate=true;
   }
    if(loc === 'bl'){
    this.eventStore.tlCanCompansate=true;
    this.eventStore.trCanCompansate=true;
    this.eventStore.blCanCompansate=false;
    this.eventStore.brCanCompansate=true;
    this.eventStore.tcCanCompansate=true;
   }
    if(loc === 'br'){
    this.eventStore.tlCanCompansate=true;
    this.eventStore.trCanCompansate=true;
    this.eventStore.blCanCompansate=true;
    this.eventStore.brCanCompansate=false;
    this.eventStore.tcCanCompansate=true;
   }
    if(loc === 'tc'){
    this.eventStore.tlCanCompansate=true;
    this.eventStore.trCanCompansate=true;
    this.eventStore.blCanCompansate=true;
    this.eventStore.brCanCompansate=true;
    this.eventStore.tcCanCompansate=false;
   }
}

}


// Create Parabol Free Transform
function pft(container,content,options){
  var instance  = new parabolFreeTransform(container,content,options);
  instance.init();
  return instance;
}


// setTimeout(function(){

// var example = pft('#container','#content',{
//   handles:{
//     r:10,
//     stroke:'blue',
//     strokeWidth:1,
//     fill:'cyan',
//     tcOffset:-30
//   }
// });


// },4000);





// var currentTextSelection;

// /**
// * Gets the color of the current text selection
// */
// function getCurrentTextColor(){
//     return $(editor.getSelectedParentElement()).css('color');
// }

// /**
//  * Custom `color picker` extension
//  */
// var ColorPickerExtension = MediumEditor.extensions.button.extend({
//     name: "colorPicker",
//     action: "applyForeColor",
//     aria: "color picker",
//     contentDefault: "<span class='editor-color-picker'>Text Color<span>",

//     init: function() {
//         this.button = this.document.createElement('button');
//         this.button.classList.add('medium-editor-action');
//         this.button.innerHTML = '<b>Text color</b>';
        
//         //init spectrum color picker for this button
//         initPicker(this.button);
        
//         //use our own handleClick instead of the default one
//         this.on(this.button, 'click', this.handleClick.bind(this));
//     },
//      handleClick: function (event) {
//          //keeping record of the current text selection
//          currentTextSelection = editor.exportSelection();
         
//          //sets the color of the current selection on the color picker
//          $(this.button).spectrum("set", getCurrentTextColor());

//          //from here on, it was taken form the default handleClick
//          event.preventDefault();
//          event.stopPropagation();

//          var action = this.getAction();

//          if (action) {
//              this.execAction(action);
//          }
//      }
// });

// var pickerExtension = new ColorPickerExtension();

// function setColor(color) {
//     var finalColor = color ? color.toRgbString() : 'rgba(0,0,0,0)';

//     pickerExtension.base.importSelection(currentTextSelection);
//     pickerExtension.document.execCommand("styleWithCSS", false, true);
//     pickerExtension.document.execCommand("foreColor", false, finalColor);
// }

// function initPicker(element) {
//     $(element).spectrum({
//         allowEmpty: true,
//         color: "#f00",
//         showInput: true,
//         showAlpha: true,
//         showPalette: true,
//         showInitial: true,
//         hideAfterPaletteSelect: true,
//         preferredFormat: "hex3",
//         change: function(color) {
//             setColor(color);
//         },
//         hide: function(color) {
//             setColor(color);
//         },
//         palette: [
//             ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
//             ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
//             ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
//             ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
//             ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
//             ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
//             ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
//             ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
//         ]
//     });
// }








// /*var html = document.querySelector(".html");*/
// var  editableText = document.querySelector(".editable");
// var editor = new MediumEditor('.editable', {
//   placeholder:{
//         text: 'Hello!',
//         hideOnClick: true
//     },
//   buttonLabels: false,
//   imageDragging: false,

//   toolbar: {
//     buttons: ['colorPicker','bold', 'italic', 'underline', 'quote']
//   },    
//   extensions: {
//         'colorPicker': pickerExtension
//     }
// })/*.subscribe("editableInput", function() {
//   html.value = editableText.innerHTML;
// });

// html.onkeyup = html.ontouchend = function() {
//   editableText.innerHTML = html.value;
// };
// editableText.innerHTML = html.value*/





 
