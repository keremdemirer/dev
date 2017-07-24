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
    if(!options.text){
      this.isText = false;
    }
    else if(options.text){
      this.isText = options.text;
 
    }
    // console.log(options.text,this.isText)
    this.bb = d3.select(this.target).node().getBBox();
    this.bb.r = Math.sqrt( 
    Math.pow(this.bb.width,2)+
    Math.pow(this.bb.height,2) 
    )/2; 
    this.bb.ox = this.bb.x+this.bb.width/2;
    this.bb.oy = this.bb.y+this.bb.height/2;
    this.alpha = Math.atan2(this.bb.height,this.bb.width); 
    this.slope = this.bb.height/this.bb.width;
    
    if(this.isText){
    this.lineStrokeColor = options.lines.stroke;
    this.lineStrokeWidth = options.lines.strokeWidth;
    this.lineStrokeDashArray = options.lines.strokeDashArray;
    }
    
    if(!this.isText){
    this.allignAreas = [];
    this.allignAreaRadius = options.allignArea.r;
    this.generalAllignAreaOffset = options.allignArea.generalAllignAreaOffset; // internal different for every of them.
    this.allignAreaStrokeColor = options.allignArea.stroke;
    this.allignAreaStrokeWidth = options.allignArea.strokeWidth;
    this.allignAreaFill = options.allignArea.fill;
    }
    
    if(options.snap){
    
      this.rotSnap = options.snap.rotation || false;
      this.sclSnap = options.snap.scale || false;
      this.dragSnap = options.snap.translation || false;



    }

  }


  updateStateStoreBB(mode){
  
  var x,y,w,h;
  x=this.stateStore.tl.x;
  y=this.stateStore.tl.y;
  w=this.stateStore.br.x-this.stateStore.tl.x;
  h=this.stateStore.br.y-this.stateStore.tl.y;

  if(mode === 'lastBBUpdateRequest'){
  
  this.stateStore.lastBB.x= x;
  this.stateStore.lastBB.y= y;
  
  this.stateStore.lastBB.width= w;
  this.stateStore.lastBB.height= h;

  this.stateStore.lastBB.r = Math.sqrt( 
  Math.pow(this.stateStore.lastBB.width,2)+
  Math.pow(this.stateStore.lastBB.height,2) 
  )/2; 
  this.stateStore.lastBB.ox = this.stateStore.lastBB.x + this.stateStore.lastBB.width/2
  this.stateStore.lastBB.oy = this.stateStore.lastBB.y + this.stateStore.lastBB.height/2


  }
  else
  {

  this.stateStore.bb.x= x;
  this.stateStore.bb.y= y;
  
  this.stateStore.bb.width= w;
  this.stateStore.bb.height=h;

  this.stateStore.bb.r = Math.sqrt( 
  Math.pow(this.stateStore.bb.width,2)+
  Math.pow(this.stateStore.bb.height,2) 
  )/2; 
  this.stateStore.bb.ox = this.stateStore.bb.x + this.stateStore.bb.width/2
  this.stateStore.bb.oy = this.stateStore.bb.y + this.stateStore.bb.height/2

  }


// if(d3.select('.boom')){

// d3.selectAll('.boom').remove();
// }
// d3.select('#container').append('rect')
// .classed('boom',true)
// .style('pointer-events','none')
// .attr('x',  this.stateStore.bb.x)
// .attr('y',  this.stateStore.bb.y)
// .attr('width',  this.stateStore.bb.width)
// .attr('height',  this.stateStore.bb.height)
// .attr('stroke','brown')
// .attr('strokeWidth',2)
// .attr('fill','rgba(33,56,144,0.2)')
// d3.select('#container').append('line')
// .classed('boom',true)
// .style('pointer-events','none')
// .attr('x1',this.stateStore.tl.x)
// .attr('y1',this.stateStore.tl.y)
// .attr('x2',this.stateStore.tl.x + this.stateStore.bb.width)
// .attr('y2',this.stateStore.tl.y + this.stateStore.bb.height)
// .attr('stroke','black')
// .attr('strokeWidth','3')
// d3.select('#container').append('circle')
// .classed('boom',true)
// .style('pointer-events','none')
// .attr('cx',  this.stateStore.bb.ox)
// .attr('cy',  this.stateStore.bb.oy)
// .attr('r',10)

// .attr('stroke','black')
// .attr('strokeWidth','3')
// .attr('fill','rgba(222,33,120,0.3)');


console.log(this.stateStore.bb.x, this.stateStore.lastBB.x)
 }


  saveAction(s,a,tx,ty){
  this.stateStore.s=s;
  this.stateStore.tx=tx;
  this.stateStore.ty=ty;
  this.stateStore.a=a;
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


console.warn("DOX DOY",this.stateStore.dox,this.stateStore.doy)
console.error("BLDRX BL DRY", this.stateStore.bl.drx , this.stateStore.bl.dry );


  }
  
  drawTextBoxLines(){
  var c = d3.select(this.container);  
  c.selectAll(`.${this.target.replace('#','')}HandleLine`).remove()
  c.append('line')
  .classed(`${this.target.replace('#','')}HandleLine`,true)
  .classed(`handleLine`,true)
  .attr('x1',  this.stateStore.tl.rx)
  .attr('y1',  this.stateStore.tl.ry)
  .attr('x2',  this.stateStore.tr.rx)
  .attr('y2',  this.stateStore.tr.ry)
  .attr('stroke-width',this.lineStrokeWidth)
  .attr('stroke',this.lineStrokeColor)
  .attr('stroke-dasharray',this.lineStrokeDashArray);
  c.append('line')
  .classed(`${this.target.replace('#','')}HandleLine`,true)
  .classed(`handleLine`,true)
  .attr('x1',  this.stateStore.tr.rx)
  .attr('y1',  this.stateStore.tr.ry)
  .attr('x2',  this.stateStore.br.rx)
  .attr('y2',  this.stateStore.br.ry)
  .attr('stroke-width',this.lineStrokeWidth)
  .attr('stroke',this.lineStrokeColor)
  .attr('stroke-dasharray',this.lineStrokeDashArray);
    c.append('line')
  .classed(`${this.target.replace('#','')}HandleLine`,true)
  .classed(`handleLine`,true)
  .attr('x1',  this.stateStore.br.rx)
  .attr('y1',  this.stateStore.br.ry)
  .attr('x2',  this.stateStore.bl.rx)
  .attr('y2',  this.stateStore.bl.ry)
  .attr('stroke-width',this.lineStrokeWidth)
  .attr('stroke',this.lineStrokeColor)
  .attr('stroke-dasharray',this.lineStrokeDashArray);
    c.append('line')
  .classed(`${this.target.replace('#','')}HandleLine`,true)
  .classed(`handleLine`,true)
  .attr('x1',  this.stateStore.bl.rx)
  .attr('y1',  this.stateStore.bl.ry)
  .attr('x2',  this.stateStore.tl.rx)
  .attr('y2',  this.stateStore.tl.ry)
  .attr('stroke-width',this.lineStrokeWidth)
  .attr('stroke',this.lineStrokeColor)
  .attr('stroke-dasharray',this.lineStrokeDashArray);

  }
  drawControlPoints(isSnapped){
  
  if(this.isText){
  this.drawTextBoxLines()
  }




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
       

  // d3.selectAll('.dede').remove();

  // d3.select('#contentHandleGroup')
  // .append('circle')
  // .classed('dede',true)
  // .attr('cx',this.stateStore.tl.urx)
  // .attr('cy',this.stateStore.tl.ury)
  // .attr('r',10)
  // .attr('fill','blue')
  // .attr('strokeWidth',2)
  // .attr('stroke','black')
  //   d3.select('#contentHandleGroup')
  //  .append('circle')
  // .classed('dede',true)
  // .attr('cx',this.stateStore.bl.urx)
  // .attr('cy',this.stateStore.bl.ury)
  // .attr('r',10)
  // .attr('fill','green')
  // .attr('strokeWidth',2)
  // .attr('stroke','black')
  //   d3.select('#contentHandleGroup')
  //  .append('circle')
  // .classed('dede',true)
  // .attr('cx',this.stateStore.tr.urx)
  // .attr('cy',this.stateStore.tr.ury)
  // .attr('r',10)
  // .attr('fill','magenta')
  // .attr('strokeWidth',2)
  // .attr('stroke','black')
  //     d3.select('#contentHandleGroup')
  //  .append('circle')
  // .classed('dede',true)
  // .attr('cx',this.stateStore.br.urx)
  // .attr('cy',this.stateStore.br.ury)
  // .attr('r',10)
  // .attr('fill','yellow')
  // .attr('strokeWidth',2)
  // .attr('stroke','black')

  }
  updateControlPoints(activeHandle,isSnapped){ 

if(isSnapped){
 var bb = this.bb;
}
else{
 var bb = this.stateStore.bb;
}
var cosRot = Math.cos(this.stateStore.a);
var sinRot = Math.sin(this.stateStore.a);
  
if(activeHandle === 'tc'){

var cosAMinusRot = Math.cos(this.alpha-this.stateStore.a); 
var sinAMinusRot = Math.sin(this.alpha-this.stateStore.a);
var cosAPlusRot = Math.cos(this.alpha+this.stateStore.a); 
var sinAPlusRot = Math.sin(this.alpha+this.stateStore.a);
var cos90APlusRot = Math.cos(Math.PI/2 - this.alpha+this.stateStore.a); 
var sin90APlusRot = Math.sin(Math.PI/2 - this.alpha+this.stateStore.a);
var r = bb.r;
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
var r = bb.r;

//unROTATEDPOINTS
this.stateStore.tl.urx = this.stateStore.br.urx - 2*r *Math.cos(this.alpha);
this.stateStore.tl.ury = this.stateStore.br.ury - 2*r *Math.sin(this.alpha);
 
this.stateStore.bl.urx  = this.stateStore.br.urx- bb.width;
this.stateStore.bl.ury  = this.stateStore.br.ury;
      
this.stateStore.tr.urx  = this.stateStore.br.urx;
this.stateStore.tr.ury  = this.stateStore.br.ury - bb.height;

//ROTATEDPOINTS
this.stateStore.tl.rx = this.stateStore.br.rx - 2*r * cosAPlusRot;
this.stateStore.tl.ry = this.stateStore.br.ry - 2*r * sinAPlusRot;
 
this.stateStore.bl.rx  = this.stateStore.br.rx - bb.width * cosRot;
this.stateStore.bl.ry  = this.stateStore.br.ry - bb.width * sinRot;
      
this.stateStore.tr.rx  = this.stateStore.br.rx + bb.height * sinRot;
this.stateStore.tr.ry  = this.stateStore.br.ry - bb.height * cosRot;
 
this.stateStore.ox = this.stateStore.br.rx - r * cosAPlusRot;
this.stateStore.oy = this.stateStore.br.ry - r * sinAPlusRot;
  
this.stateStore.targetOrigin.x = this.stateStore.br.rx;
this.stateStore.targetOrigin.y = this.stateStore.br.ry;



 }
else if(activeHandle === 'tr'){

var cos180APlusRot = Math.cos(Math.PI - this.alpha+this.stateStore.a); 
var sin180APlusRot = Math.sin(Math.PI - this.alpha+this.stateStore.a);
var r = bb.r;
  

 this.stateStore.tl.urx  = this.stateStore.bl.urx ;
 this.stateStore.tl.ury  = this.stateStore.bl.ury - bb.height ;
  
 this.stateStore.br.urx  = this.stateStore.bl.urx + bb.width ;
 this.stateStore.br.ury  = this.stateStore.bl.ury ;
 
 this.stateStore.tr.urx = this.stateStore.bl.urx - 2*r * Math.cos(Math.PI - this.alpha);
 this.stateStore.tr.ury = this.stateStore.bl.ury - 2*r * Math.sin(Math.PI - this.alpha);





 this.stateStore.tl.rx  = this.stateStore.bl.rx + bb.height * sinRot;
 this.stateStore.tl.ry  = this.stateStore.bl.ry - bb.height * cosRot;
  
 this.stateStore.br.rx  = this.stateStore.bl.rx + bb.width * cosRot;
 this.stateStore.br.ry  = this.stateStore.bl.ry + bb.width * sinRot;
 
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
var r = bb.r;
 


 this.stateStore.bl.urx = this.stateStore.tr.urx - 2*r * Math.sin(this.alpha+Math.PI/2) ;
 this.stateStore.bl.ury = this.stateStore.tr.ury - 2*r * Math.cos(this.alpha+Math.PI/2) ;
 
 this.stateStore.br.urx  = this.stateStore.tr.urx ;
 this.stateStore.br.ury  = this.stateStore.tr.ury + bb.height;
      
 this.stateStore.tl.urx  = this.stateStore.tr.urx - bb.width ;
 this.stateStore.tl.ury  = this.stateStore.tr.ury ;


 


 this.stateStore.bl.rx = this.stateStore.tr.rx - 2*r * sinAPlus90MinusRot;
 this.stateStore.bl.ry = this.stateStore.tr.ry - 2*r * cosAPlus90MinusRot;
 
 this.stateStore.br.rx  = this.stateStore.tr.rx - bb.height * sinRot;
 this.stateStore.br.ry  = this.stateStore.tr.ry + bb.height * cosRot;
      
 this.stateStore.tl.rx  = this.stateStore.tr.rx - bb.width * cosRot;
 this.stateStore.tl.ry  = this.stateStore.tr.ry - bb.width * sinRot;
 
 this.stateStore.ox = this.stateStore.tr.rx - r * sinAPlus90MinusRot;
 this.stateStore.oy = this.stateStore.tr.ry - r * cosAPlus90MinusRot;

 this.stateStore.targetOrigin.x = this.stateStore.tr.rx;
 this.stateStore.targetOrigin.y = this.stateStore.tr.ry;

}
else if(activeHandle === 'br'){
 
var cosAPlusRot = Math.cos(this.alpha+this.stateStore.a); 
var sinAPlusRot = Math.sin(this.alpha+this.stateStore.a);
var r = bb.r;
  
// console.log('%c'+r,'color:green; font-size:28px;')

 
 this.stateStore.bl.urx = this.stateStore.tl.urx;
 this.stateStore.bl.ury = this.stateStore.tl.ury + bb.height ;
 
 this.stateStore.br.urx  = this.stateStore.tl.urx + 2*r * Math.cos(this.alpha);
 this.stateStore.br.ury  = this.stateStore.tl.ury + 2*r * Math.sin(this.alpha);
      
this.stateStore.tr.urx  = this.stateStore.tl.urx + bb.width;
this.stateStore.tr.ury  = this.stateStore.tl.ury ;





 this.stateStore.bl.rx = this.stateStore.tl.rx - bb.height * sinRot;
 this.stateStore.bl.ry = this.stateStore.tl.ry + bb.height * cosRot;
 
 this.stateStore.br.rx  = this.stateStore.tl.rx + 2*r * cosAPlusRot;
 this.stateStore.br.ry  = this.stateStore.tl.ry + 2*r * sinAPlusRot;
      
this.stateStore.tr.rx  = this.stateStore.tl.rx + bb.width * cosRot;
this.stateStore.tr.ry  = this.stateStore.tl.ry + bb.width * sinRot;
 
this.stateStore.ox = this.stateStore.tl.rx + r * cosAPlusRot;
this.stateStore.oy = this.stateStore.tl.ry + r * sinAPlusRot;

this.stateStore.targetOrigin.x = this.stateStore.tl.rx;
this.stateStore.targetOrigin.y = this.stateStore.tl.ry;



}

  

this.stateStore.tc.rx = this.stateStore.ox + (bb.height/2 - this.tcOffset) * sinRot;
this.stateStore.tc.ry = this.stateStore.oy - (bb.height/2 - this.tcOffset) * cosRot;


if(this.eventStore.freeDraggingX){

this.stateStore.tl.urx += this.eventStore.currentDragDeltaX;
this.stateStore.tr.urx += this.eventStore.currentDragDeltaX;
this.stateStore.bl.urx += this.eventStore.currentDragDeltaX;
this.stateStore.br.urx += this.eventStore.currentDragDeltaX;

 
this.stateStore.tl.rx += this.eventStore.currentDragDeltaX;
this.stateStore.tr.rx += this.eventStore.currentDragDeltaX;
this.stateStore.bl.rx += this.eventStore.currentDragDeltaX;
this.stateStore.br.rx += this.eventStore.currentDragDeltaX;


this.stateStore.tc.rx += this.eventStore.currentDragDeltaX;
this.stateStore.ox += this.eventStore.currentDragDeltaX;
this.stateStore.targetOrigin.x += this.eventStore.currentDragDeltaX;

}  
if(this.eventStore.freeDraggingY){

this.stateStore.tl.ury += this.eventStore.currentDragDeltaY;
this.stateStore.tr.ury += this.eventStore.currentDragDeltaY;
this.stateStore.bl.ury += this.eventStore.currentDragDeltaY;
this.stateStore.br.ury += this.eventStore.currentDragDeltaY;

this.stateStore.tl.ry += this.eventStore.currentDragDeltaY;
this.stateStore.tr.ry += this.eventStore.currentDragDeltaY;
this.stateStore.bl.ry += this.eventStore.currentDragDeltaY;
this.stateStore.br.ry += this.eventStore.currentDragDeltaY;


this.stateStore.tc.ry += this.eventStore.currentDragDeltaY;
this.stateStore.oy += this.eventStore.currentDragDeltaY;
this.stateStore.targetOrigin.y += this.eventStore.currentDragDeltaY;
}



// d3.select('#container').selectAll('.ss').remove();
// d3.select('#container').append('circle')
// .classed('ss',true)
// .style('pointer-events','none')
// .attr('cx',  this.stateStore.ox)
// .attr('cy',  this.stateStore.oy)
// .attr('r',10)

// .attr('stroke','black')
// .attr('strokeWidth','3')
// .attr('fill','red');

this.updateDeltaRotations();
this.drawControlPoints(isSnapped);


}


updateHandlesExternally(divWidth,divHeight,parentId){
        this.eventStore.dsMod = true;


        

        var drag=false;    

        if(this.stateStore.dragged){
        drag =true;

        } 

        var rotated=false; 

        if(this.stateStore.rotated){
        var rotated =true;
        }   


var norW = divWidth*this.stateStore.s;
var norH = divHeight*this.stateStore.s;

var parent = d3.select(parentId);


        if(norW !== this.stateStore.bb.width){

        this.stateStore.br.x = this.stateStore.bb.x + norW;
        this.stateStore.tr.x = this.stateStore.bb.x + norW;
   

        //update parent foreignObject
        
        parent.attr('width',norW);



        
        // this.updateCompansation(this.target,0,0,drag,rotated,this.stateStore.dox,this.stateStore.doy,true);

       // console.log("DW",dw);
        }
        console.log('pft',norH,this.stateStore.bb.height)
        if(norH !== this.stateStore.bb.height){
        

        this.stateStore.bl.y = this.stateStore.bb.y + norH;
        this.stateStore.br.y = this.stateStore.bb.y + norH;



        // this.updateCompansation(this.target,0,dh,false,false,true);

         // console.log("DH",dh);
        //update parent foreignObject
        
        parent.attr('height',norH);

        


        }

        if(norH !== this.stateStore.bb.height || norW !== this.stateStore.bb.width){
        console.log('update');
        

        

        this.eventStore.gW += (norW - this.stateStore.bb.width)/this.stateStore.s;
        this.eventStore.gH += (norH - this.stateStore.bb.height)/this.stateStore.s;
         

        // this.eventStore.growthWidth += norW - this.stateStore.bb.width;
        // this.eventStore.growthHeight += norH - this.stateStore.bb.height;
        
        this.eventStore.dw  = norW - this.stateStore.bb.width;
        this.eventStore.dh  = norH - this.stateStore.bb.height;
  
       



        this.updateStateStoreBB()
        this.alpha = Math.atan2(this.stateStore.bb.height,this.stateStore.bb.width); 
        this.slope = this.stateStore.bb.height/this.stateStore.bb.width;
        
        this.updateControlPoints('br');
 
        //grow with enter
        //handle compansations looks easy
        // this.eventStore.tcCanCompansate = true;

}
        



}

transform(el,s,a,tx,ty,scaleOrg){
console.log(el);
el = document.getElementById(el.replace('#',''));
// a *= (Math.PI/180)
// s *= oldS;
//find origins
var ox =this.stateStore.ox;//use it to translate origin to 0,0
var oy =this.stateStore.oy;
var w,h;
w=this.stateStore.br.urx -this.stateStore.tl.urx;
h=this.stateStore.br.ury -this.stateStore.tl.ury;
var asbrx = w/2;
var asbry = h/2;
var bsx =this.stateStore.br.urx;
var bsy =this.stateStore.br.ury;

//multiply dragTranslation with 2 to get rid of extended dox doy happens when dragging

var cmx = bsx - asbrx - tx +this.stateStore.dox ;
var cmy = bsy - asbry - ty +this.stateStore.doy ;




this.stateStore.dox=this.stateStore.ox - this.stateStore.bb.ox;
this.stateStore.doy=this.stateStore.oy - this.stateStore.bb.oy;

// console.log('GW','GH',this.eventStore.gW,this.eventStore.gH)
//        console.log('%c'+'GW BRURX DOX DRAG'+this.eventStore.gW+" " +this.stateStore.br.urx+" " +this.stateStore.dox+" " +this.stateStore.dragTranslation.x,'font-size:40px') 

if(scaleOrg === 'tl'){

var bsx =this.stateStore.br.urx; 
var bsy =this.stateStore.br.ury;
var asbrx = w/2 ;
var asbry = h/2 ;

var cmx = bsx - asbrx - tx +this.stateStore.dox ;
var cmy = bsy - asbry - ty +this.stateStore.doy  ;
}
if(scaleOrg === 'br'){
var bsx =this.stateStore.br.urx;
var bsy =this.stateStore.br.ury;
var asbrx = w/2 ;
var asbry = h/2 ;

var cmx = bsx - asbrx - tx +this.stateStore.dox ;
var cmy = bsy - asbry - ty +this.stateStore.doy;
}  
if(scaleOrg === 'tr'){
var bsx =this.stateStore.br.urx;
var bsy =this.stateStore.br.ury;
var asbrx = w/2;
var asbry = h/2;

var cmx = bsx - asbrx - tx +this.stateStore.dox;
var cmy = bsy - asbry - ty +this.stateStore.doy;
}
if(scaleOrg === 'bl'){
var bsx =this.stateStore.br.urx;
var bsy =this.stateStore.br.ury;
var asbrx = w/2;
var asbry = h/2;

var cmx = bsx - asbrx - tx +this.stateStore.dox;
var cmy = bsy - asbry - ty +this.stateStore.doy;
}  


// d3.selectAll('.kokoo').remove();
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',0).attr('y1',asbry).attr('x2',asbrx).attr('y2',asbry).attr('stroke','pink').attr('stroke-width',10);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',0).attr('y1',bsy).attr('x2',bsx).attr('y2',bsy).attr('stroke','brown').attr('stroke-width',10);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',0).attr('y1',cmy).attr('x2',cmx).attr('y2',cmy).attr('stroke','green').attr('stroke-width',10);

// d3.select('#container').append('line').classed('kokoo',true).attr('x1',asbrx).attr('y1',asbry).attr('x2',bsx).attr('y2',asbry).attr('stroke','cyan').attr('stroke-width',10);

// var sw =2;
// var col = 'rgba(255,118,68,0.7)';
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.br.urx).attr('y1',this.stateStore.br.ury).attr('x2',this.stateStore.br.rx).attr('y2',this.stateStore.br.ry).attr('stroke',col).attr('stroke-width',sw);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.tl.urx).attr('y1',this.stateStore.tl.ury).attr('x2',this.stateStore.tl.rx).attr('y2',this.stateStore.tl.ry).attr('stroke',col).attr('stroke-width',sw);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.bl.urx).attr('y1',this.stateStore.bl.ury).attr('x2',this.stateStore.bl.rx).attr('y2',this.stateStore.bl.ry).attr('stroke',col).attr('stroke-width',sw);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.tr.urx).attr('y1',this.stateStore.tr.ury).attr('x2',this.stateStore.tr.rx).attr('y2',this.stateStore.tr.ry).attr('stroke',col).attr('stroke-width',sw);

// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.br.urx).attr('y1',this.stateStore.br.ury).attr('x2',this.stateStore.br.rx).attr('y2',this.stateStore.br.ury).attr('stroke',col).attr('stroke-width',sw);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.tl.urx).attr('y1',this.stateStore.tl.ury).attr('x2',this.stateStore.tl.rx).attr('y2',this.stateStore.tl.ury).attr('stroke',col).attr('stroke-width',sw);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.bl.urx).attr('y1',this.stateStore.bl.ury).attr('x2',this.stateStore.bl.rx).attr('y2',this.stateStore.bl.ury).attr('stroke',col).attr('stroke-width',sw);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.tr.urx).attr('y1',this.stateStore.tr.ury).attr('x2',this.stateStore.tr.rx).attr('y2',this.stateStore.tr.ury).attr('stroke',col).attr('stroke-width',sw);


// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.br.rx).attr('y1',this.stateStore.br.ury).attr('x2',this.stateStore.br.rx).attr('y2',this.stateStore.br.ry).attr('stroke',col).attr('stroke-width',sw);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.tl.rx).attr('y1',this.stateStore.tl.ury).attr('x2',this.stateStore.tl.rx).attr('y2',this.stateStore.tl.ry).attr('stroke',col).attr('stroke-width',sw);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.bl.rx).attr('y1',this.stateStore.bl.ury).attr('x2',this.stateStore.bl.rx).attr('y2',this.stateStore.bl.ry).attr('stroke',col).attr('stroke-width',sw);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.tr.rx).attr('y1',this.stateStore.tr.ury).attr('x2',this.stateStore.tr.rx).attr('y2',this.stateStore.tr.ry).attr('stroke',col).attr('stroke-width',sw);

// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.ox).attr('y1',this.stateStore.oy).attr('x2',this.stateStore.bb.ox).attr('y2',this.stateStore.bb.oy).attr('stroke',col).attr('stroke-width',sw);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.ox).attr('y1',this.stateStore.oy).attr('x2',this.stateStore.bb.ox).attr('y2',this.stateStore.oy).attr('stroke',col).attr('stroke-width',sw);
// d3.select('#container').append('line').classed('kokoo',true).attr('x1',this.stateStore.bb.ox).attr('y1',this.stateStore.bb.oy).attr('x2',this.stateStore.bb.ox).attr('y2',this.stateStore.oy).attr('stroke',col).attr('stroke-width',sw);



// this.stateStore.totalAngle+=a;
// console.warn(a,this.stateStore.totalAngle,this.stateStore.totalAngle*(180 / Math.PI))
  
el.setAttribute('transform',`translate(${tx},${ty}) translate(${cmx},${cmy}) rotate(${a*(180 / Math.PI)} 0,0) scale(${s},${s}) translate(${-this.bb.ox-this.eventStore.gW/2},${-this.bb.oy-this.eventStore.gH/2})`);
// oldS=s;  
this.saveAction(s,a,tx,ty);

}



allignTarget (destination,affectedPft) {

        var obj = affectedPft;

        obj.eventStore.lastDragX = obj.stateStore.dragTranslation.x;
        obj.eventStore.lastDragY = obj.stateStore.dragTranslation.y;
     
        
        if(destination.includes('l')){
        var dx = this.stateStore.aa[destination].x - obj.stateStore.tl.x;
        var dy = this.stateStore.aa[destination].y - obj.stateStore.tl.y - obj.stateStore.bb.height/2; 
        }
        else if(destination.includes('r')){
        var dx = this.stateStore.aa[destination].x - obj.stateStore.br.x;
        var dy = this.stateStore.aa[destination].y - obj.stateStore.tl.y - obj.stateStore.bb.height/2; 
        }
        else{
        var dx = this.stateStore.aa[destination].x - obj.stateStore.ox;
        var dy = this.stateStore.aa[destination].y - obj.stateStore.oy; 
        }



        obj.eventStore.currentDragDeltaX =  dx;
        obj.eventStore.currentDragDeltaY =  dy;
          
        obj.stateStore.dragTranslation.x += dx;
        obj.stateStore.dragTranslation.y += dy;

        obj.eventStore.freeDraggingX = true;
        obj.eventStore.freeDraggingY = true;
//------------------------------
        
        obj.stateStore.tl.x += dx
        obj.stateStore.tl.y += dy
        obj.stateStore.br.x += dx
        obj.stateStore.br.y += dy
        obj.stateStore.tr.x += dx
        obj.stateStore.tr.y += dy
        obj.stateStore.bl.x += dx
        obj.stateStore.bl.y += dy
        obj.stateStore.tc.x += dx
        obj.stateStore.tc.y += dy

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
    obj.updateControlPoints();
    obj.transform(obj.target, obj.stateStore.s, obj.stateStore.a, obj.stateStore.dragTranslation.x, obj.stateStore.dragTranslation.y);
    
    obj.eventStore.freeDraggingX = false;
    obj.eventStore.freeDraggingY = false;

}

init(){

var obj = this;

obj.stateStore ={
  s:1,
  tx:0,
  ty:0,
  a:0,
  totalAngle:0,
  lastOrigin:'tc',
bb:{
    width:obj.bb.width,
    height:obj.bb.height,
    x:obj.bb.x,
    y:obj.bb.y,
ox:obj.bb.x + obj.bb.width/2,
oy:obj.bb.y + obj.bb.height/2
  },
lastBB:{
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
    urx:obj.bb.x,
  ury:obj.bb.y,
  drx:0,
  dry:0,
  r:obj.handleRadius,
  stroke:obj.handleStrokeColor,
  strokeWidth:obj.handleStrokeWidth,
  fill:obj.handleFill,
  id:obj.target.replace('#','') + 'Tl',
  totalScaleOffsetX:0,
  totalScaleOffsetY:0


},
tr:{
  x:obj.bb.x + obj.bb.width,
  y:obj.bb.y,
  rx:obj.bb.x + obj.bb.width,
  ry:obj.bb.y,
    urx:obj.bb.x + obj.bb.width,
  ury:obj.bb.y,
  drx:0,
  dry:0,
  r:obj.handleRadius,
  stroke:obj.handleStrokeColor,
  strokeWidth:obj.handleStrokeWidth,
  fill:obj.handleFill,
  id:obj.target.replace('#','') + 'Tr',
  totalScaleOffsetX:0,
  totalScaleOffsetY:0
},
bl:{
  x:obj.bb.x,
  y:obj.bb.y + obj.bb.height,
  rx:obj.bb.x,
  ry:obj.bb.y + obj.bb.height,
    urx:obj.bb.x,
  ury:obj.bb.y + obj.bb.height,
  drx:0,
  dry:0,
  r:obj.handleRadius,
  stroke:obj.handleStrokeColor,
  strokeWidth:obj.handleStrokeWidth,
  fill:obj.handleFill,
  id:obj.target.replace('#','') + 'Bl',
  totalScaleOffsetX:0,
  totalScaleOffsetY:0
},
br:{
  x:obj.bb.x + obj.bb.width,
  y:obj.bb.y + obj.bb.height,
  rx:obj.bb.x + obj.bb.width,
  ry:obj.bb.y + obj.bb.height,
    urx:obj.bb.x + obj.bb.width,
  ury:obj.bb.y + obj.bb.height,

  drx:0,
  dry:0,
  r:obj.handleRadius,
  stroke:obj.handleStrokeColor,
  strokeWidth:obj.handleStrokeWidth,
  fill:obj.handleFill,
  id:obj.target.replace('#','') + 'Br',
  totalScaleOffsetX:0,
  totalScaleOffsetY:0
},
tc:{
  x:obj.bb.x + obj.bb.width/2,
  y:obj.bb.y + obj.tcOffset,
  rx:obj.bb.x + obj.bb.width/2,
  ry:obj.bb.y + obj.tcOffset,
  urx:obj.bb.x + obj.bb.width/2,
  ury:obj.bb.y + obj.tcOffset,
  drx:0,
  dry:0,
  r:obj.handleRadius,
  stroke:obj.handleStrokeColor,
  strokeWidth:obj.handleStrokeWidth,
  fill:obj.handleFill,
  id:obj.target.replace('#','') + 'Tc',
  totalScaleOffsetX:0,
  totalScaleOffsetY:0
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
scaling:false,
aa:{
  tl:{
      x:obj.bb.x + obj.generalAllignAreaOffset - obj.generalAllignAreaOffset/4,
      y:obj.bb.y + obj.generalAllignAreaOffset - obj.generalAllignAreaOffset/4
  },
  tr:{
      x:obj.bb.x + obj.bb.width - obj.generalAllignAreaOffset + obj.generalAllignAreaOffset/4,
      y:obj.bb.y + obj.generalAllignAreaOffset - obj.generalAllignAreaOffset/4
  },
  bl:{
      x:obj.bb.x + obj.generalAllignAreaOffset - obj.generalAllignAreaOffset/4,
      y:obj.bb.y + obj.bb.height - obj.generalAllignAreaOffset + obj.generalAllignAreaOffset/4
  },
  br:{
      x:obj.bb.x + obj.bb.width - obj.generalAllignAreaOffset + obj.generalAllignAreaOffset/4,
      y:obj.bb.y + obj.bb.height - obj.generalAllignAreaOffset + obj.generalAllignAreaOffset/4
  },
  tc:{
      x:obj.bb.x + obj.bb.width/2,
      y:obj.bb.y + obj.generalAllignAreaOffset - obj.generalAllignAreaOffset/4
  },
  lc:{
      x:obj.bb.x + obj.generalAllignAreaOffset - obj.generalAllignAreaOffset/4,
      y:obj.bb.y + obj.bb.height/2 
  },
  rc:{
      x:obj.bb.x + obj.bb.width - obj.generalAllignAreaOffset + obj.generalAllignAreaOffset/4,
      y:obj.bb.y + obj.bb.height/2 
  },
  bc:{
    x:obj.bb.x + obj.bb.width/2,
    y:obj.bb.y + obj.bb.height - obj.generalAllignAreaOffset + obj.generalAllignAreaOffset/4
  },
  c:{
      x:obj.bb.x + obj.bb.width/2,
      y:obj.bb.y + obj.bb.height/2
  }
},
dtl:{
  x:0,
  y:0
},
dtr:{
  x:0,
  y:0
},
dbl:{
  x:0,
  y:0
},
dbr:{
  x:0,
  y:0
},
dtc:{
  x:0,
  y:0
}
}
obj.stateStore.dsw=function(){
console.error('%cDSW','font-size:18px;')
if(obj.eventStore.dsMod){
return  (obj.bb.width*this.s) - obj.bb.width;
}
else{
 return  this.bb.width - obj.bb.width ; 
}

}
obj.stateStore.dsh=function(){
console.error('%cDSH','font-size:18px;')
if(obj.eventStore.dsMod){
return  (obj.bb.height*this.s) - obj.bb.height;
}
else{
 return  this.bb.height - obj.bb.height ; 
}
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
lastWidthBeforeScale:obj.stateStore.bb.width,
saved:{

},
lastDsx : 0,
lastDsy : 0,
lastDsw : 0,
lastDsh : 0,
currentS :1.0,
once:true,
begining:true,
rDeg :0,
growthHeight:0,
growthWidth:0,
scaleStatus:false,
gW:0,
gH:0
};

if(this.rotSnap) {
  this.eventStore.rotationSnapped = new CustomEvent('onrotationsnapped',{bubbles:true,detail:this.target});
  this.eventStore.rotationUnsnapped = new CustomEvent('onrotationunsnapped',{bubbles:true,detail:this.target});
}
if(this.dragSnap) {
  this.eventStore.dragXSnappedEvent = new CustomEvent('ondragxsnapped',{bubbles:true,detail:this.target});
  this.eventStore.dragXUnsnappedEvent = new CustomEvent('ondragxunsnapped',{bubbles:true,detail:this.target});
  this.eventStore.dragYSnappedEvent = new CustomEvent('ondragysnapped',{bubbles:true,detail:this.target});
  this.eventStore.dragYUnsnappedEvent = new CustomEvent('ondragyunsnapped',{bubbles:true,detail:this.target});
}
if(this.sclSnap) {
  this.eventStore.scaleSnapped = new CustomEvent('onscalesnapped',{bubbles:true,detail:this.target});
  this.eventStore.scaleUnsnapped = new CustomEvent('onscaleunsnapped',{bubbles:true,detail:this.target});
}



    
if(!this.isText) {

    //TL
    obj.allignAreas.push({
      id:`${obj.target.replace('#','')}AaTl`,
      x:obj.stateStore.aa.tl.x,
      y:obj.stateStore.aa.tl.y,
      r:obj.allignAreaRadius,
      stroke:obj.allignAreaStrokeColor,
      strokeWidth:obj.allignAreaStrokeWidth,
      fill:obj.allignAreaFill,
    });
    //TR
    obj.allignAreas.push({
      id:`${obj.target.replace('#','')}AaTr`,
      x:obj.stateStore.aa.tr.x,
      y:obj.stateStore.aa.tr.y,
      r:obj.allignAreaRadius,
      stroke:obj.allignAreaStrokeColor,
      strokeWidth:obj.allignAreaStrokeWidth,
      fill:obj.allignAreaFill,
    });
    //BL
    obj.allignAreas.push({
      id:`${obj.target.replace('#','')}AaBl`,
          x:obj.stateStore.aa.bl.x,
      y:obj.stateStore.aa.bl.y,
      r:obj.allignAreaRadius,
      stroke:obj.allignAreaStrokeColor,
      strokeWidth:obj.allignAreaStrokeWidth,
      fill:obj.allignAreaFill,
    });
    //BR
    obj.allignAreas.push({
      id:`${obj.target.replace('#','')}AaBr`,
       x:obj.stateStore.aa.br.x,
      y:obj.stateStore.aa.br.y,
      r:obj.allignAreaRadius,
      stroke:obj.allignAreaStrokeColor,
      strokeWidth:obj.allignAreaStrokeWidth,
      fill:obj.allignAreaFill,
    });
    //TC
    obj.allignAreas.push({
      id:`${obj.target.replace('#','')}AaTc`,
         x:obj.stateStore.aa.tc.x,
      y:obj.stateStore.aa.tc.y,
      r:obj.allignAreaRadius,
      stroke:obj.allignAreaStrokeColor,
      strokeWidth:obj.allignAreaStrokeWidth,
      fill:obj.allignAreaFill,
    });
    //LC
    obj.allignAreas.push({
      id:`${obj.target.replace('#','')}AaLc`,
        x:obj.stateStore.aa.lc.x,
      y:obj.stateStore.aa.lc.y,
      r:obj.allignAreaRadius,
      stroke:obj.allignAreaStrokeColor,
      strokeWidth:obj.allignAreaStrokeWidth,
      fill:obj.allignAreaFill,
    });
    //RC
    obj.allignAreas.push({
      id:`${obj.target.replace('#','')}AaRc`,
          x:obj.stateStore.aa.rc.x,
      y:obj.stateStore.aa.rc.y,
      r:obj.allignAreaRadius,
      stroke:obj.allignAreaStrokeColor,
      strokeWidth:obj.allignAreaStrokeWidth,
      fill:obj.allignAreaFill,
    });
    //BC
    obj.allignAreas.push({
      id:`${obj.target.replace('#','')}AaBc`,
          x:obj.stateStore.aa.bc.x,
      y:obj.stateStore.aa.bc.y,
      r:obj.allignAreaRadius,
      stroke:obj.allignAreaStrokeColor,
      strokeWidth:obj.allignAreaStrokeWidth,
      fill:obj.allignAreaFill,
    });

    //C
     obj.allignAreas.push({
      id:`${obj.target.replace('#','')}AaC`,
      x:obj.stateStore.aa.c.x,
      y:obj.stateStore.aa.c.y,
      r:obj.allignAreaRadius,
      stroke:obj.allignAreaStrokeColor,
      strokeWidth:obj.allignAreaStrokeWidth,
      fill:obj.allignAreaFill,
    });




var allignAreaGroup = d3.select(this.container).append('g').attr('id',`${this.target.replace('#','')}AllignAreaGroup`)
.classed('allignAreaGroup',true)
.classed('invisible',true);
allignAreaGroup
.selectAll('circle')
.data(obj.allignAreas)
.enter()
.append('circle')
.attr('id',function(d,i){return d.id;})
.attr("cx",function(d,i){return d.x;})
.attr("cy",function(d,i){return d.y;})
.attr("r", function(d,i){return d.r;})
.attr('stroke',function(d,i){return d.stroke;})
.attr('stroke-width',function(d,i){return d.strokeWidth;})
.attr('fill',function(d,i){return d.fill;});


allignAreaGroup.select(`${this.target}AaTl`).on("click", function () { 
d3.event.stopPropagation();
obj.allignTarget('tl',window.transformStore.text.lastActivePftTextObject);
});
allignAreaGroup.select(`${this.target}AaTr`).on("click", function () { 
d3.event.stopPropagation();
obj.allignTarget('tr',window.transformStore.text.lastActivePftTextObject);
});
allignAreaGroup.select(`${this.target}AaBl`).on("click", function () { 
d3.event.stopPropagation();
obj.allignTarget('bl',window.transformStore.text.lastActivePftTextObject);
});
allignAreaGroup.select(`${this.target}AaBr`).on("click", function () { 
d3.event.stopPropagation();
obj.allignTarget('br',window.transformStore.text.lastActivePftTextObject);
});
allignAreaGroup.select(`${this.target}AaTc`).on("click", function () { 
d3.event.stopPropagation();
obj.allignTarget('tc',window.transformStore.text.lastActivePftTextObject);
});
allignAreaGroup.select(`${this.target}AaLc`).on("click", function () { 
d3.event.stopPropagation();
obj.allignTarget('lc',window.transformStore.text.lastActivePftTextObject);
});
allignAreaGroup.select(`${this.target}AaRc`).on("click", function () { 
d3.event.stopPropagation();
obj.allignTarget('rc',window.transformStore.text.lastActivePftTextObject);
});
allignAreaGroup.select(`${this.target}AaBc`).on("click", function () { 
d3.event.stopPropagation();
obj.allignTarget('bc',window.transformStore.text.lastActivePftTextObject);
});
allignAreaGroup.select(`${this.target}AaC`).on("click", function () { 
d3.event.stopPropagation();
obj.allignTarget('c',window.transformStore.text.lastActivePftTextObject);
});


}
  
        //CREATE DRAG EVENTS
    this.topLeftDrag = d3.drag(obj)
                .on("start", onTopLeftDragStart)
                .on("drag", onTopLeftDrag)
                .on("end", onTopLeftDragEnd);
    this.topRightDrag = d3.drag(obj)
                .on("start", onTopRightDragStart)
                .on("drag", onTopRightDrag)
                .on("end", onTopRightDragEnd);
    this.bottomLeftDrag = d3.drag(obj)
                .on("start", onBottomLeftDragStart)
                .on("drag", onBottomLeftDrag)
                .on("end", onBottomLeftDragEnd);
    this.bottomRightDrag = d3.drag(obj)
                .on("start", onBottomRightDragStart)
                .on("drag", onBottomRightDrag)
                .on("end", onBottomRightDragEnd);
    this.topCenterDrag = d3.drag(obj)
                .on("start", onTopCenterDragStart)
                .on("drag", onTopCenterDrag)
                .on("end", onTopCenterDragEnd);
    this.targetDrag = d3.drag(obj)
                .on("start", onTargetDragStart)
                .on("drag", onTargetDrag)
                .on("end", onTargetDragEnd);
    d3.select(this.target).call(this.targetDrag);
    

    this.drawTextBoxLines();

//DEFINE EVENT FUNCTIONS
function onTopLeftDragStart(d){
 //unutma
  var w = obj.stateStore.bb.width;
  obj.eventStore.lastWidthBeforeScale = w;

  obj.eventStore.oDist = Math.sqrt(Math.pow(obj.stateStore.ox - d3.event.sourceEvent.pageX,2) + Math.pow( obj.stateStore.oy - d3.event.sourceEvent.pageY,2)) ;
// obj.eventStore.begining = true;
        

        obj.eventStore.updatedX = obj.stateStore.tl.x;
        obj.eventStore.updatedY = obj.stateStore.tl.y;
  
        obj.eventStore.handle = d3.select(this);

        obj.eventStore.tr = d3.select(`${obj.target}Tr`);
        obj.eventStore.bl = d3.select(`${obj.target}Bl`);  
        obj.eventStore.tc = d3.select(`${obj.target}Tc`); 
        
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
        obj.eventStore.tlonce = true;
  //UPDATE ORIGIN TO BOTTOM RIGHT
  

}


function onBottomRightDragStart(d){


  obj.eventStore.oDist = Math.sqrt(Math.pow(obj.stateStore.ox - d3.event.sourceEvent.pageX,2) + Math.pow( obj.stateStore.oy - d3.event.sourceEvent.pageY,2)) ;
// obj.eventStore.begining = true;

        obj.eventStore.updatedX = obj.stateStore.br.x;
        obj.eventStore.updatedY = obj.stateStore.br.y;

        obj.eventStore.handle = d3.select(this);

        obj.eventStore.tr = d3.select(`${obj.target}Tr`);
        obj.eventStore.bl = d3.select(`${obj.target}Bl`);  
        obj.eventStore.tc = d3.select(`${obj.target}Tc`); 
        
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
}
function onTopRightDragStart(d){
  
// obj.eventStore.begining = true;
  obj.eventStore.oDist = Math.sqrt(Math.pow(obj.stateStore.ox - d3.event.sourceEvent.pageX,2) + Math.pow( obj.stateStore.oy - d3.event.sourceEvent.pageY,2)) ;

        obj.eventStore.updatedX = obj.stateStore.tr.x;
        obj.eventStore.updatedY = obj.stateStore.tr.y;

        obj.eventStore.handle = d3.select(this);
        obj.eventStore.br = d3.select(`${obj.target}Br`);
        obj.eventStore.tl = d3.select(`${obj.target}Tl`);  
        obj.eventStore.tc = d3.select(`${obj.target}Tc`); 
        
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
    
}
function onBottomLeftDragStart(d){
 
 // obj.eventStore.begining = true;
  obj.eventStore.oDist = Math.sqrt(Math.pow(obj.stateStore.ox - d3.event.sourceEvent.pageX,2) + Math.pow( obj.stateStore.oy - d3.event.sourceEvent.pageY,2)) ;

        obj.eventStore.updatedX = obj.stateStore.bl.x;
        obj.eventStore.updatedY = obj.stateStore.bl.y;

        obj.eventStore.handle = d3.select(this);
        obj.eventStore.br = d3.select(`${obj.target}Br`);
        obj.eventStore.tl = d3.select(`${obj.target}Tl`);  
        obj.eventStore.tc = d3.select(`${obj.target}Tc`); 
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

 
}
function onTopLeftDragEnd(d){
obj.stateStore.scaling = false;




}
function onBottomRightDragEnd(d){
  obj.stateStore.scaling = false;

}


function onTopRightDragEnd(d){
  obj.stateStore.scaling = false;


}
function onBottomLeftDragEnd(d){
  obj.stateStore.scaling = false;


}
function onTopLeftDrag(d){
        // obj.stateStore.scaleStatus = true;
        // obj.scaleChecker();
        // obj.eventStore.dsMod =false;     
        // obj.stateStore.scaling = true;
     
        var d =  Math.sqrt(Math.pow(obj.stateStore.ox - d3.event.sourceEvent.pageX,2) + Math.pow( obj.stateStore.oy - d3.event.sourceEvent.pageY,2)) ;
        var a =  Math.abs(d3.event.dx);

        if(d > obj.eventStore.oDist){
        obj.eventStore.updatedX += -1*a,
        obj.eventStore.updatedY += -1*a*obj.slope;
        }
        else{
        obj.eventStore.updatedX += a,
        obj.eventStore.updatedY += a*obj.slope;
        }

        obj.eventStore.updatedTopCenterX = obj.eventStore.updatedX + (obj.stateStore.br.x - obj.eventStore.updatedX)/2;
        obj.eventStore.updatedTopCenterY = obj.eventStore.updatedY + obj.tcOffset;
        
        var n = obj.eventStore.updatedX -  obj.eventStore.eventStartBB.x;
        var s = 1 - n/ obj.eventStore.eventStartBB.width ;  
        s = s*obj.eventStore.lastS;

   if(obj.sclSnap){


        var checkS = s;
        if(checkS < 1+obj.sclSnap.snapSensivity && checkS > 1-obj.sclSnap.snapSensivity  ){
           
          //scale to inital
          s=1;
          
          //set points 

          obj.stateStore.tl.x = obj.stateStore.br.x - obj.bb.width;
          obj.stateStore.tl.y = obj.stateStore.br.y - obj.bb.height;
          obj.stateStore.bl.x = obj.stateStore.br.x - obj.bb.width;
          obj.stateStore.tr.y = obj.stateStore.br.y - obj.bb.height;
          obj.stateStore.tc.x = obj.stateStore.br.x - obj.bb.width/2;
          obj.stateStore.tc.y = obj.stateStore.br.y - obj.bb.height + obj.tcOffset;

          //fire transforms   

          //dispatch events

          document.dispatchEvent(obj.eventStore.scaleSnapped);

        }
        else{
          
          //scale to scale
          
          //set points
          obj.stateStore.tl.x = obj.eventStore.updatedX;
          obj.stateStore.tl.y = obj.eventStore.updatedY;
          obj.stateStore.bl.x = obj.eventStore.updatedX;
          obj.stateStore.tr.y = obj.eventStore.updatedY;
          obj.stateStore.tc.x = obj.eventStore.updatedTopCenterX;
          obj.stateStore.tc.y = obj.eventStore.updatedTopCenterY;   

        
          //fire transforms
        
          //dispatch events

          document.dispatchEvent(obj.eventStore.scaleUnsnapped);
        
        }
  
  obj.updateStateStoreBB();//update bb values for drawing control points //preserve the last bb
  obj.updateControlPoints('tl');//update points
  obj.transform(obj.target,s,obj.stateStore.a,obj.stateStore.dragTranslation.x,obj.stateStore.dragTranslation.y,'br') // use the last bb in transform ops 
  obj.updateStateStoreBB('lastBBUpdateRequest'); // update the lastBB


   }else{


          obj.stateStore.tl.x = obj.eventStore.updatedX;
          obj.stateStore.tl.y = obj.eventStore.updatedY;
          obj.stateStore.bl.x = obj.eventStore.updatedX;
          obj.stateStore.tr.y = obj.eventStore.updatedY;
          obj.stateStore.tc.x = obj.eventStore.updatedTopCenterX;
          obj.stateStore.tc.y = obj.eventStore.updatedTopCenterY;   
      
  //obj.transform(obj.target,s,obj.stateStore.a,0,0);
  
  obj.updateStateStoreBB();//update bb values for drawing control points //preserve the last bb
  obj.updateControlPoints('tl');//update points
  obj.transform(obj.target,s,obj.stateStore.a,obj.stateStore.dragTranslation.x,obj.stateStore.dragTranslation.y,'br') // use the last bb in transform ops 
  obj.updateStateStoreBB('lastBBUpdateRequest'); // update the lastBB
  
  }

  obj.eventStore.oDist = Math.sqrt(Math.pow(obj.stateStore.ox - d3.event.sourceEvent.pageX,2) + Math.pow( obj.stateStore.oy - d3.event.sourceEvent.pageY,2)) ;

}
function onBottomRightDrag(d){
        // obj.stateStore.scaleStatus = true;
        // obj.scaleChecker();
        // obj.eventStore.dsMod =false;       
        // obj.stateStore.scaling = true;
        
        var d = Math.sqrt(Math.pow(obj.stateStore.ox - d3.event.sourceEvent.pageX,2) + Math.pow( obj.stateStore.oy - d3.event.sourceEvent.pageY,2)) ;
        var a =  Math.abs(d3.event.dx);

        if(d < obj.eventStore.oDist){
        obj.eventStore.updatedX += -1*a,
        obj.eventStore.updatedY += -1*a*obj.slope;
        }
        else{
        obj.eventStore.updatedX += a,
        obj.eventStore.updatedY += a*obj.slope;
        }

        obj.eventStore.updatedTopCenterX = obj.eventStore.updatedX - (obj.eventStore.updatedX - obj.stateStore.tl.x)/2;

        
        var n = obj.eventStore.updatedX -  obj.eventStore.eventStartBB.x;
        var s = n/ obj.eventStore.eventStartBB.width ;  
        s = s*obj.eventStore.lastS;
   

   if(obj.sclSnap){

        var checkS = s;
        if(checkS < 1+obj.sclSnap.snapSensivity && checkS > 1-obj.sclSnap.snapSensivity  ){
        
        s=1;
          
          obj.stateStore.br.x = obj.stateStore.tl.x + obj.bb.width;
          obj.stateStore.br.y = obj.stateStore.tl.y + obj.bb.height;
          obj.stateStore.bl.y = obj.stateStore.tl.y + obj.bb.height;
          obj.stateStore.tr.x = obj.stateStore.tl.x + obj.bb.width;
          obj.stateStore.tc.x = obj.stateStore.tl.x + obj.bb.width/2;

          document.dispatchEvent(obj.eventStore.scaleSnapped);

        }
        else
        {


          obj.stateStore.br.x = obj.eventStore.updatedX;
          obj.stateStore.br.y = obj.eventStore.updatedY;
          obj.stateStore.bl.y = obj.eventStore.updatedY;
          obj.stateStore.tr.x = obj.eventStore.updatedX;
          obj.stateStore.tc.x = obj.eventStore.updatedTopCenterX;

          document.dispatchEvent(obj.eventStore.scaleUnsnapped);

        }
    }
    else
    {


          obj.stateStore.br.x = obj.eventStore.updatedX;
          obj.stateStore.br.y = obj.eventStore.updatedY;
          obj.stateStore.bl.y = obj.eventStore.updatedY;
          obj.stateStore.tr.x = obj.eventStore.updatedX;
          obj.stateStore.tc.x = obj.eventStore.updatedTopCenterX;

    }   

  
  obj.updateStateStoreBB();
  obj.updateControlPoints('br'); 
  obj.transform(obj.target,s,obj.stateStore.a,obj.stateStore.dragTranslation.x,obj.stateStore.dragTranslation.y,'tl')
  obj.updateStateStoreBB('lastBBUpdateRequest'); 

  obj.eventStore.oDist = Math.sqrt(Math.pow(obj.stateStore.ox - d3.event.sourceEvent.pageX,2) + Math.pow( obj.stateStore.oy - d3.event.sourceEvent.pageY,2)) ;
}

function onTopRightDrag(d){
        obj.stateStore.scaleStatus = true;

        obj.eventStore.dsMod =false;        
        obj.stateStore.scaling = true;
        
        var d = Math.sqrt(Math.pow(obj.stateStore.ox - d3.event.sourceEvent.pageX,2) + Math.pow( obj.stateStore.oy - d3.event.sourceEvent.pageY,2)) ;
        var a =  Math.abs(d3.event.dx);

        if(d < obj.eventStore.oDist){
        obj.eventStore.updatedX += -1*a,
        obj.eventStore.updatedY -= -1*a*obj.slope;
        }
        else{
        obj.eventStore.updatedX += a,
        obj.eventStore.updatedY -= a*obj.slope;

        }

        obj.eventStore.updatedTopCenterX = obj.eventStore.updatedX - (obj.eventStore.updatedX - obj.stateStore.bl.x)/2;
        obj.eventStore.updatedTopCenterY = obj.eventStore.updatedY + obj.tcOffset;        
        
        var n = obj.eventStore.updatedX -  obj.eventStore.eventStartBB.x;
        var s = n/ obj.eventStore.eventStartBB.width ;  
        s = s*obj.eventStore.lastS;
   
   if(obj.sclSnap){

        var checkS = s;
        if(checkS < 1+obj.sclSnap.snapSensivity && checkS > 1-obj.sclSnap.snapSensivity  ){
          s=1;

          obj.stateStore.tr.x = obj.stateStore.bl.x + obj.bb.width;
          obj.stateStore.tr.y = obj.stateStore.bl.y - obj.bb.height;
          obj.stateStore.tl.y = obj.stateStore.bl.y - obj.bb.height;
          obj.stateStore.br.x = obj.stateStore.bl.x + obj.bb.width;
          obj.stateStore.tc.x = obj.stateStore.bl.x + obj.bb.width/2;
          obj.stateStore.tc.y = obj.stateStore.bl.y - obj.bb.height/2 + obj.tcOffset;   

                   document.dispatchEvent(obj.eventStore.scaleSnapped);
        }
        else{

          obj.stateStore.tr.x = obj.eventStore.updatedX;
          obj.stateStore.tr.y = obj.eventStore.updatedY;
          obj.stateStore.tl.y = obj.eventStore.updatedY;
          obj.stateStore.br.x = obj.eventStore.updatedX;
          obj.stateStore.tc.x = obj.eventStore.updatedTopCenterX;
          obj.stateStore.tc.y = obj.eventStore.updatedTopCenterY;   

                   document.dispatchEvent(obj.eventStore.scaleUnsnapped);

        }
      }
      else{


          obj.stateStore.tr.x = obj.eventStore.updatedX;
          obj.stateStore.tr.y = obj.eventStore.updatedY;
          obj.stateStore.tl.y = obj.eventStore.updatedY;
          obj.stateStore.br.x = obj.eventStore.updatedX;
          obj.stateStore.tc.x = obj.eventStore.updatedTopCenterX;
          obj.stateStore.tc.y = obj.eventStore.updatedTopCenterY;   
}

    
  //obj.transform(obj.target,s,obj.stateStore.a,0,0);

  obj.updateStateStoreBB();
  obj.updateControlPoints('tr'); 
  obj.transform(obj.target,s,obj.stateStore.a,obj.stateStore.dragTranslation.x,obj.stateStore.dragTranslation.y,'bl')
  obj.updateStateStoreBB('lastBBUpdateRequest');  
  obj.eventStore.oDist = Math.sqrt(Math.pow(obj.stateStore.ox - d3.event.sourceEvent.pageX,2) + Math.pow( obj.stateStore.oy - d3.event.sourceEvent.pageY,2)) ;
                 
}
function onBottomLeftDrag(d){
        obj.stateStore.scaleStatus = true;
        obj.eventStore.dsMod =false;         
        obj.stateStore.scaling = true;
        
        var d = Math.sqrt(Math.pow(obj.stateStore.ox - d3.event.sourceEvent.pageX,2) + Math.pow( obj.stateStore.oy - d3.event.sourceEvent.pageY,2)) ;
        var a =  Math.abs(d3.event.dx);

        if(d > obj.eventStore.oDist){
        obj.eventStore.updatedX += -1*a,
        obj.eventStore.updatedY -= -1*a*obj.slope;
        }
        else{
        obj.eventStore.updatedX += a,
        obj.eventStore.updatedY -= a*obj.slope;
        }

        obj.eventStore.updatedTopCenterX = obj.eventStore.updatedX + (obj.stateStore.tr.x - obj.eventStore.updatedX)/2;

        
        var n = obj.eventStore.updatedX -  obj.eventStore.eventStartBB.x;
        var s = 1 - n/ obj.eventStore.eventStartBB.width ;  
        s = s*obj.eventStore.lastS;

       if(obj.sclSnap){

        var checkS = s;
        if(checkS < 1+obj.sclSnap.snapSensivity && checkS > 1-obj.sclSnap.snapSensivity  ){
          s=1;

        obj.stateStore.bl.x = obj.stateStore.tr.x - obj.bb.width;
        obj.stateStore.bl.y = obj.stateStore.tr.y + obj.bb.height;
        obj.stateStore.br.y = obj.stateStore.tr.y + obj.bb.height;
        obj.stateStore.tl.x = obj.stateStore.tr.x - obj.bb.width;
        obj.stateStore.tc.x = obj.stateStore.tr.x - obj.bb.width/2;

                 document.dispatchEvent(obj.eventStore.scaleSnapped);
        }
        else{

        obj.stateStore.bl.x = obj.eventStore.updatedX;
        obj.stateStore.bl.y = obj.eventStore.updatedY;
        obj.stateStore.br.y = obj.eventStore.updatedY;
        obj.stateStore.tl.x = obj.eventStore.updatedX;
        obj.stateStore.tc.x = obj.eventStore.updatedTopCenterX; 

                 document.dispatchEvent(obj.eventStore.scaleUnsnapped);

        }
      }
      else{
        obj.stateStore.bl.x = obj.eventStore.updatedX;
        obj.stateStore.bl.y = obj.eventStore.updatedY;
        obj.stateStore.br.y = obj.eventStore.updatedY;
        obj.stateStore.tl.x = obj.eventStore.updatedX;
        obj.stateStore.tc.x = obj.eventStore.updatedTopCenterX; 
      }
      

  //obj.transform(obj.target,s,obj.stateStore.a,0,0);
 
  obj.updateStateStoreBB();
  obj.updateControlPoints('bl'); 
  obj.transform(obj.target,s,obj.stateStore.a,obj.stateStore.dragTranslation.x,obj.stateStore.dragTranslation.y,'tr')
  obj.updateStateStoreBB('lastBBUpdateRequest');  
  obj.eventStore.oDist = Math.sqrt(Math.pow(obj.stateStore.ox - d3.event.sourceEvent.pageX,2) + Math.pow( obj.stateStore.oy - d3.event.sourceEvent.pageY,2)) ;
        
}

//----- TRANSLATION DRAG EVENT

 function onTargetDragStart(d){
        obj.eventStore.bl = d3.select(`${obj.target}Bl`);
        obj.eventStore.tr = d3.select(`${obj.target}Tr`); 
        obj.eventStore.br = d3.select(`${obj.target}Br`);
        obj.eventStore.tl = d3.select(`${obj.target}Tl`);  
        obj.eventStore.tc = d3.select(`${obj.target}Tc`); 
        obj.eventStore.lastDragX = obj.stateStore.dragTranslation.x;
        obj.eventStore.lastDragY = obj.stateStore.dragTranslation.y;
     
        obj.eventStore.freeDraggingX = true;
        obj.eventStore.freeDraggingY = true;

}
function onTargetDrag(d){
        


       
        //update these for delta rotation calculation

        
        
        // console.warn(obj.bb.ox, (obj.stateStore.br.y -((obj.stateStore.br.y - obj.stateStore.tl.y)/2)));
        // console.error(obj.stateStore.tl.x,obj.stateStore.tl.rx,obj.stateStore.tl.urx , deltaOX, deltaOY)

        //save the current drag operation.
        obj.eventStore.currentDragDeltaX =  d3.event.dx;
        obj.eventStore.currentDragDeltaY =  d3.event.dy;
        //update by last tx and ty to keep scale compensations
        obj.eventStore.tx = obj.stateStore.tx + d3.event.dx;
        obj.eventStore.ty = obj.stateStore.ty + d3.event.dy;
        // add to total drag amount 
        obj.stateStore.dragTranslation.x += d3.event.dx;
        obj.stateStore.dragTranslation.y += d3.event.dy;
        //do the transform and save
     
      if(obj.dragSnap){
         
         //what? scale ile birlikte dusunmelisin nasil yapmalisin
         var deltaOX = obj.stateStore.ox - obj.bb.ox;
         var deltaOY = obj.stateStore.oy - obj.bb.oy;

         var dragSnapX = (Math.abs(obj.stateStore.dragTranslation.x )) < obj.dragSnap.snapSensivity;
         var dragSnapY = (Math.abs(obj.stateStore.dragTranslation.y )) < obj.dragSnap.snapSensivity;
         
         

      

// devam en son deltalari hesapladin update control points dongusune bak buyumeyi takip edebiliyorsun,

 // devam en son deltalari hesapladin update control points dongusune bak buyumeyi takip edebiliyorsun,

         if(dragSnapX && !dragSnapY){
            obj.eventStore.freeDraggingY=true;
            obj.eventStore.freeDraggingX=false;

        obj.stateStore.bl.y += d3.event.dy
        obj.stateStore.tr.y += d3.event.dy
        obj.stateStore.br.y += d3.event.dy
        obj.stateStore.tl.y += d3.event.dy
        obj.stateStore.tc.y += d3.event.dy
        

        
            if(!obj.eventStore.dragXSnapped){

            obj.stateStore.bl.x -= deltaOX
            obj.stateStore.tr.x -= deltaOX
            obj.stateStore.br.x -= deltaOX
            obj.stateStore.tl.x -= deltaOX
            obj.stateStore.tc.x -= deltaOX
            
            obj.stateStore.tl.urx -= deltaOX;
            obj.stateStore.tr.urx -= deltaOX;
            obj.stateStore.bl.urx -= deltaOX;
            obj.stateStore.br.urx -= deltaOX;

             
            obj.stateStore.tl.rx -= deltaOX;
            obj.stateStore.tr.rx -= deltaOX;
            obj.stateStore.bl.rx -= deltaOX;
            obj.stateStore.br.rx -= deltaOX;
    
            obj.stateStore.ox -= deltaOX;
            

            document.dispatchEvent(obj.eventStore.dragXSnappedEvent);
            document.dispatchEvent(obj.eventStore.dragYUnsnappedEvent);


            }
            if(obj.eventStore.dragYSnapped){

            obj.stateStore.bl.y += obj.stateStore.dragTranslation.y
            obj.stateStore.tr.y += obj.stateStore.dragTranslation.y
            obj.stateStore.br.y += obj.stateStore.dragTranslation.y
            obj.stateStore.tl.y += obj.stateStore.dragTranslation.y
            obj.stateStore.tc.y += obj.stateStore.dragTranslation.y
            
            obj.stateStore.tl.ury += obj.stateStore.dragTranslation.y;
            obj.stateStore.tr.ury += obj.stateStore.dragTranslation.y;
            obj.stateStore.bl.ury += obj.stateStore.dragTranslation.y;
            obj.stateStore.br.ury += obj.stateStore.dragTranslation.y;

             
            obj.stateStore.tl.ry += obj.stateStore.dragTranslation.y;
            obj.stateStore.tr.ry += obj.stateStore.dragTranslation.y;
            obj.stateStore.bl.ry += obj.stateStore.dragTranslation.y;
            obj.stateStore.br.ry += obj.stateStore.dragTranslation.y;

            obj.stateStore.oy += obj.stateStore.dragTranslation.y;
            
            }
    obj.updateStateStoreBB()
    obj.updateControlPoints();


         obj.transform(obj.target,obj.stateStore.s,obj.stateStore.a,0, deltaOY)

            obj.eventStore.dragXSnapped = true;
            obj.eventStore.dragYSnapped = false;
            


         }
         else if(!dragSnapX && dragSnapY){
            obj.eventStore.freeDraggingY=false;
            obj.eventStore.freeDraggingX=true;

        obj.stateStore.bl.x += d3.event.dx
        obj.stateStore.tr.x += d3.event.dx
        obj.stateStore.br.x += d3.event.dx
        obj.stateStore.tl.x += d3.event.dx
        obj.stateStore.tc.x += d3.event.dx


            
            if(!obj.eventStore.dragYSnapped){

            obj.stateStore.bl.y -= deltaOY
            obj.stateStore.tr.y -= deltaOY
            obj.stateStore.br.y -= deltaOY
            obj.stateStore.tl.y -= deltaOY
            obj.stateStore.tc.y -= deltaOY
            
            obj.stateStore.tl.ury -= deltaOY;
            obj.stateStore.tr.ury -= deltaOY;
            obj.stateStore.bl.ury -= deltaOY;
            obj.stateStore.br.ury -= deltaOY;

             
            obj.stateStore.tl.ry -= deltaOY;
            obj.stateStore.tr.ry -= deltaOY;
            obj.stateStore.bl.ry -= deltaOY;
            obj.stateStore.br.ry -= deltaOY;

            obj.stateStore.oy -= deltaOY;

            document.dispatchEvent(obj.eventStore.dragXUnsnappedEvent);
            document.dispatchEvent(obj.eventStore.dragYSnappedEvent);
            }
            if(obj.eventStore.dragXSnapped){

            obj.stateStore.bl.x += obj.stateStore.dragTranslation.x
            obj.stateStore.tr.x += obj.stateStore.dragTranslation.x
            obj.stateStore.br.x += obj.stateStore.dragTranslation.x
            obj.stateStore.tl.x += obj.stateStore.dragTranslation.x
            obj.stateStore.tc.x += obj.stateStore.dragTranslation.x
            
            obj.stateStore.tl.urx += obj.stateStore.dragTranslation.x;
            obj.stateStore.tr.urx += obj.stateStore.dragTranslation.x;
            obj.stateStore.bl.urx += obj.stateStore.dragTranslation.x;
            obj.stateStore.br.urx += obj.stateStore.dragTranslation.x;

             
            obj.stateStore.tl.rx += obj.stateStore.dragTranslation.x;
            obj.stateStore.tr.rx += obj.stateStore.dragTranslation.x;
            obj.stateStore.bl.rx += obj.stateStore.dragTranslation.x;
            obj.stateStore.br.rx += obj.stateStore.dragTranslation.x;

            obj.stateStore.ox += obj.stateStore.dragTranslation.x;
          
            
            }


      
            obj.updateStateStoreBB()
            obj.updateControlPoints();
            obj.transform(obj.target,obj.stateStore.s,obj.stateStore.a,deltaOX,0)
            // obj.eventStore.ls = '01'
            
            obj.eventStore.dragXSnapped = false;
            obj.eventStore.dragYSnapped = true;
            
    

         }
         else if(dragSnapX && dragSnapY){
            obj.eventStore.freeDraggingY=false;
            obj.eventStore.freeDraggingX=false;


            if(!obj.eventStore.dragYSnapped){

            obj.stateStore.bl.y -= deltaOY
            obj.stateStore.tr.y -= deltaOY
            obj.stateStore.br.y -= deltaOY
            obj.stateStore.tl.y -= deltaOY
            obj.stateStore.tc.y -= deltaOY
            
            obj.stateStore.tl.ury -= deltaOY;
            obj.stateStore.tr.ury -= deltaOY;
            obj.stateStore.bl.ury -= deltaOY;
            obj.stateStore.br.ury -= deltaOY;

             
            obj.stateStore.tl.ry -= deltaOY;
            obj.stateStore.tr.ry -= deltaOY;
            obj.stateStore.bl.ry -= deltaOY;
            obj.stateStore.br.ry -= deltaOY;

            obj.stateStore.oy -= deltaOY;

            document.dispatchEvent(obj.eventStore.dragXSnappedEvent);
            document.dispatchEvent(obj.eventStore.dragYSnappedEvent);
            }
            if(!obj.eventStore.dragXSnapped){

            obj.stateStore.bl.x -= deltaOX
            obj.stateStore.tr.x -= deltaOX
            obj.stateStore.br.x -= deltaOX
            obj.stateStore.tl.x -= deltaOX
            obj.stateStore.tc.x -= deltaOX
            
            obj.stateStore.tl.urx -= deltaOX;
            obj.stateStore.tr.urx -= deltaOX;
            obj.stateStore.bl.urx -= deltaOX;
            obj.stateStore.br.urx -= deltaOX;

             
            obj.stateStore.tl.rx -= deltaOX;
            obj.stateStore.tr.rx -= deltaOX;
            obj.stateStore.bl.rx -= deltaOX;
            obj.stateStore.br.rx -= deltaOX;
    
            obj.stateStore.ox -= deltaOX;
            
            }




            obj.updateStateStoreBB()


          obj.updateControlPoints();
          obj.transform(obj.target,obj.stateStore.s,obj.stateStore.a,0,0)
          // obj.eventStore.ls = '11'
          
            obj.eventStore.dragXSnapped = true;
            obj.eventStore.dragYSnapped = true;
            
  
         }
         else if(!dragSnapX && !dragSnapY){
            obj.eventStore.freeDraggingY=true;
            obj.eventStore.freeDraggingX=true;

        obj.stateStore.bl.y += d3.event.dy
        obj.stateStore.tr.y += d3.event.dy
        obj.stateStore.br.y += d3.event.dy
        obj.stateStore.tl.y += d3.event.dy
        obj.stateStore.tc.y += d3.event.dy
        
        obj.stateStore.bl.x += d3.event.dx
        obj.stateStore.tr.x += d3.event.dx
        obj.stateStore.br.x += d3.event.dx
        obj.stateStore.tl.x += d3.event.dx
        obj.stateStore.tc.x += d3.event.dx


            if(obj.eventStore.dragXSnapped){

            obj.stateStore.bl.x += obj.stateStore.dragTranslation.x
            obj.stateStore.tr.x += obj.stateStore.dragTranslation.x
            obj.stateStore.br.x += obj.stateStore.dragTranslation.x
            obj.stateStore.tl.x += obj.stateStore.dragTranslation.x
            obj.stateStore.tc.x += obj.stateStore.dragTranslation.x
            
            obj.stateStore.tl.urx += obj.stateStore.dragTranslation.x;
            obj.stateStore.tr.urx += obj.stateStore.dragTranslation.x;
            obj.stateStore.bl.urx += obj.stateStore.dragTranslation.x;
            obj.stateStore.br.urx += obj.stateStore.dragTranslation.x;

             
            obj.stateStore.tl.rx += obj.stateStore.dragTranslation.x;
            obj.stateStore.tr.rx += obj.stateStore.dragTranslation.x;
            obj.stateStore.bl.rx += obj.stateStore.dragTranslation.x;
            obj.stateStore.br.rx += obj.stateStore.dragTranslation.x;

            obj.stateStore.ox += obj.stateStore.dragTranslation.x;
            

            document.dispatchEvent(obj.eventStore.dragXUnsnappedEvent);
            document.dispatchEvent(obj.eventStore.dragYUnsnappedEvent);
            
            }
            if(obj.eventStore.dragYSnapped){

            obj.stateStore.bl.y += obj.stateStore.dragTranslation.y
            obj.stateStore.tr.y += obj.stateStore.dragTranslation.y
            obj.stateStore.br.y += obj.stateStore.dragTranslation.y
            obj.stateStore.tl.y += obj.stateStore.dragTranslation.y
            obj.stateStore.tc.y += obj.stateStore.dragTranslation.y
            
            obj.stateStore.tl.ury += obj.stateStore.dragTranslation.y;
            obj.stateStore.tr.ury += obj.stateStore.dragTranslation.y;
            obj.stateStore.bl.ury += obj.stateStore.dragTranslation.y;
            obj.stateStore.br.ury += obj.stateStore.dragTranslation.y;

             
            obj.stateStore.tl.ry += obj.stateStore.dragTranslation.y;
            obj.stateStore.tr.ry += obj.stateStore.dragTranslation.y;
            obj.stateStore.bl.ry += obj.stateStore.dragTranslation.y;
            obj.stateStore.br.ry += obj.stateStore.dragTranslation.y;

            obj.stateStore.oy += obj.stateStore.dragTranslation.y;
            
            }





              obj.updateStateStoreBB()

            obj.updateControlPoints();
            obj.transform(obj.target,obj.stateStore.s,obj.stateStore.a, obj.stateStore.dragTranslation.x, obj.stateStore.dragTranslation.y)
            // obj.eventStore.ls = '00'
                 
            obj.eventStore.dragXSnapped = false;
            obj.eventStore.dragYSnapped = false;


         
         }

}
      else{

          
          obj.stateStore.bl.y += d3.event.dy;
          obj.stateStore.tr.y += d3.event.dy;
          obj.stateStore.br.y += d3.event.dy;
          obj.stateStore.tl.y += d3.event.dy;
          obj.stateStore.tc.y += d3.event.dy;

          obj.stateStore.bl.x += d3.event.dx;
          obj.stateStore.tr.x += d3.event.dx;
          obj.stateStore.br.x += d3.event.dx;
          obj.stateStore.tl.x += d3.event.dx;
          obj.stateStore.tc.x += d3.event.dx;     
          obj.updateStateStoreBB();
          obj.updateControlPoints();
          obj.transform(obj.target, obj.stateStore.s, obj.stateStore.a, obj.stateStore.dragTranslation.x, obj.stateStore.dragTranslation.y);



      }

        

               
      

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

  // obj.updateStateStoreBB()

  obj.eventStore.freeDraggingX = false;
  obj.eventStore.freeDraggingY = false;

}

function onTopCenterDragStart()  {
  
    
        obj.eventStore.handle = d3.select(this);
        
        obj.eventStore.hx = d3.event.sourceEvent.pageX;
        obj.eventStore.hy = d3.event.sourceEvent.pageY;

        obj.eventStore.dragging = true;
        
        obj.eventStore.ox = obj.stateStore.ox;
        obj.eventStore.oy = obj.stateStore.oy; // origin point
        
}
function onTopCenterDrag(d){

         obj.stateStore.rotating = true;
         obj.eventStore.pageX = d3.event.sourceEvent.pageX;
         obj.eventStore.pageY = d3.event.sourceEvent.pageY;
         obj.eventStore.dx =  obj.eventStore.pageX - obj.eventStore.ox;
         obj.eventStore.dy =  obj.eventStore.pageY - obj.eventStore.oy;
         
       
         if(obj.eventStore.pageX !== obj.eventStore.ox && obj.eventStore.pageY !== obj.eventStore.oy){
         
         
         // do something about rotation
         if(!obj.isText){
         var s_rad =  Math.atan2(obj.eventStore.dy, obj.eventStore.dx) + Math.PI/2;  
         console.log('%c'+s_rad,'font-size:40px;')
         }
         else{
         
         var s_rad =  Math.atan2(obj.eventStore.dy, obj.eventStore.dx);
         s_rad -= Math.atan2(obj.eventStore.hy - obj.eventStore.oy, obj.eventStore.hx - obj.eventStore.ox); // handle to origin
         s_rad += obj.eventStore.lastAngle; // relative to the last one

         }
 

         // current to origin         
         // s_rad -= Math.atan2(obj.eventStore.hy - obj.eventStore.oy, obj.eventStore.hx - obj.eventStore.ox); // handle to origin
         // s_rad += obj.eventStore.lastAngle; // relative to the last one
     
        var deg = s_rad * 180 / Math.PI;

        obj.eventStore.rDeg = Math.floor(deg);

        if(deg < 0){
          deg=360+deg;
           obj.eventStore.rDeg=Math.floor(deg);
        }
if(obj.rotSnap) {


        // console.log(deg)
  
         if( obj.eventStore.rDeg%obj.rotSnap.snapStep < obj.rotSnap.snapSensivity){
         console.error('snapArea')
          
          var dirCheck=0;
          while( obj.eventStore.rDeg%obj.rotSnap.snapStep ){
            dirCheck++ 
            if(dirCheck > obj.rotSnap.snapSensivity*2){
               obj.eventStore.rDeg--;
            }else{
               obj.eventStore.rDeg++; 
            }
          }
     
          console.warn( obj.eventStore.rDeg)
          s_rad = obj.eventStore.rDeg* Math.PI / 180; 
          

          document.dispatchEvent(obj.eventStore.rotationSnapped);

         
         }
         else{

          document.dispatchEvent(obj.eventStore.rotationUnsnapped);

         }
}
         // console.log(Math.abs(s_rad * 180 / Math.PI )%45)
         // * Math.PI / 180; to rad
         //  * 180 / Math.PI; to deg


         //obj.transform(obj.target,obj.stateStore.s,s_rad,0,0,false,true);
            

            obj.updateStateStoreBB();
            obj.updateControlPoints('tc');

            obj.transform(obj.target,obj.stateStore.s,s_rad,obj.stateStore.dragTranslation.x,obj.stateStore.dragTranslation.y)
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

if(!obj.isText){
var invisibility = true; 
}
else{
var invisibility = false; 
}
var handleGroup = d3.select(this.container).append('g').attr('id',`${this.target.replace('#','')}HandleGroup`)
.classed('handleGroup',true)
.classed('invisible',invisibility);
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
handleGroup.select(`${this.target}Tl`).call(this.topLeftDrag);
handleGroup.select(`${this.target}Tr`).call(this.topRightDrag);
handleGroup.select(`${this.target}Bl`).call(this.bottomLeftDrag);
handleGroup.select(`${this.target}Br`).call(this.bottomRightDrag);
handleGroup.select(`${this.target}Tc`).call(this.topCenterDrag);

//Update HANDLE AND TARGET ORIGINS TO CENTER
// this.updateOrigin(this.stateStore.tl.x+this.stateStore.bb.width/2,this.stateStore.tl.y+this.stateStore.bb.height/2);
this.stateStore.lastOrigin='tc';

  this.eventStore.tl=d3.select(`${this.target}Tl`);
  this.eventStore.tr=d3.select(`${this.target}Tr`);
  this.eventStore.bl=d3.select(`${this.target}Bl`);
  this.eventStore.br=d3.select(`${this.target}Br`);
  this.eventStore.tc=d3.select(`${this.target}Tc`);

}

stopCompansation(loc){
  if(loc === 'allow'){
    this.eventStore.tlCanCompansate=true;
    this.eventStore.trCanCompansate=true;
    this.eventStore.blCanCompansate=true;
    this.eventStore.brCanCompansate=true;
    this.eventStore.tcCanCompansate=true;

  }
  if(loc === 'block'){
    this.eventStore.tlCanCompansate=false;
    this.eventStore.trCanCompansate=false;
    this.eventStore.blCanCompansate=false;
    this.eventStore.brCanCompansate=false;
    this.eventStore.tcCanCompansate=false;

  }
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
  removeEvent(name){

    if(name === 'drag'){
      d3.select(this.target).on('.drag', null);
    }

  }
  addEvent(name,event){

    if(name === 'drag' && event === 'default'){

    d3.select(this.target).call(this.targetDrag);

    }

  }

}
// Create Parabol Free Transform
function pft(container,content,options){
  var instance  = new parabolFreeTransform(container,content,options);
  instance.init();
  return instance;
}



 
