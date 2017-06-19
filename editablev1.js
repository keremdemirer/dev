
// IMAGE EDITING
// 


// var svgBoxWidth = squareBoxSize;
// var svgBoxHeight = squareBoxSize;
// var containerDivWidth = parseFloat(d3.select('#product-design').style('width'));
// var containerDivHeight = parseFloat(d3.select('#product-design').style('height'));
// var clipX = result.designX;
// var clipY = result.designY;
// var clipWidth =result.designWidth;
// var clipHeight = result.designHeight;


class editable {
  //target is a CSS selector
  constructor(target,container,containerWidth){
    this.initial = {}
    // this.initial init props
    this.target = target;
    this.targetName = target.replace('#','');
    this.container = container
    
    this.containerWidth = containerWidth;
    
    this.handleIds = {
      bottomRight:'#resizeHandleBottomRight',
      bottomLeft:'#resizeHandleBottomLeft',
      topRight:'#resizeHandleTopRight',
      topLeft:'#resizeHandleTopLeft',
      topCenter:'#rotationHandleTopCenter'
    }
    this.targetBB = d3.select(target).node().getBBox();
    this.rotationDragEventStore={};
    this.rotationDragEventStore.dragging = false;




    
  }

  getStyleTransforms(target){
      //test regex
      var transformOriginResult = d3.select(target).style('transform-origin');
      var translationResult = /translate\((\W?\d+\.?\d*)px,\s+(\W?\d+\.?\d*)px\)/.exec(d3.select(target).style('transform'));
      var rotationResult = /rotate\((\W?\d+\.?\d*)deg\)/.exec(d3.select(target).style('transform'));
      var scaleResult = /scale\((\d+\.?\d*),\s*(\d+\.?\d*)\)/.exec(d3.select(target).style('transform'));
      if(translationResult!==null){
        translationResult[1] = parseFloat(translationResult[1]);
        translationResult[2] = parseFloat(translationResult[2]);
      }
      else{
        var translationResult=[];
        translationResult[1] = 0;
        translationResult[2] = 0;
      }
      if(rotationResult!==null){
        rotationResult[1] = parseFloat(rotationResult[1]);
        
      }
      else{
        var rotationResult=[];
        rotationResult[1] = 0;
      }
      if(scaleResult!==null){
        scaleResult[1] = parseFloat(scaleResult[1]);
        scaleResult[2] = parseFloat(scaleResult[2]);
      }
      else{
        var scaleResult=[];
        scaleResult[1] = 1;
        scaleResult[2] = 1;
      }
      if(transformOriginResult){
        transformOriginResult = transformOriginResult.replace(/(%|px)/g,'');
        transformOriginResult = transformOriginResult.split(' ');
        transformOriginResult[1] = parseFloat(translationResult[1]);
        transformOriginResult[2] = parseFloat(translationResult[2]);
      }
      else{
        var translationResult=[];
        translationResult[1] = 50;
        translationResult[2] = 50;
      }
   
      return {
              translation:{x:translationResult[1],y:translationResult[2]},
              rotation:rotationResult[1],
              scale:{x:scaleResult[1],y:scaleResult[2]},
              transformOrigin:{x:transformOriginResult[1],y:transformOriginResult[2]}
             };
   
    
  }

  update(target,object){
    //crossbrowser
      
    var targetTransform = d3.select(target).style('transform');
    var update ='';

    if(object.hasOwnProperty('translate')){

      let updateString = ` translate(${object.translate.x}px,${object.translate.y}px)`; 
      update = targetTransform.replace(/translate\(.*x\)/,updateString);
        
    }

    if(object.hasOwnProperty('rotate')){
      
      let updateString = ` rotate(${object.rotate}deg)`;
      update = targetTransform.replace(/rotate\(.*g\)/,updateString);
 

    }

    if(object.hasOwnProperty('scale')){
      
      let updateString = ` scale(${object.scale.x}, ${object.scale.y})`;
      update = targetTransform.replace(/scale\(.*\d\)/,updateString);


    }
 // console.log(update);
    d3.select(target).style('transform',update);

    if(object.hasOwnProperty('transformOrigin')){
      let updateString = `${object.transformOrigin.x}px ${object.transformOrigin.y}px`; 
      console.log(target,updateString)
      d3.select(target).style('transform-origin',updateString);
    }

    if(object.hasOwnProperty('x')){
      d3.select(target).attr('x',object.x);
      
    }  
    if(object.hasOwnProperty('y')){
      d3.select(target).attr('y',object.y);
      
    }      

  }

  currentState(format){

      var data = {};
      data.handleGroup = {
          translation:{},
          scale:{},
          transformOrigin:{}
      }
      data.handle = {
        topLeft:{},
        topRight:{},
        bottomRight:{},
        bottomLeft:{},
        topCenter:{}
      };
      let handleGroupTransforms = getStyleTransforms(this.handleIds.topLeft);
      data.handleGroup.transformOrigin.x = handleGroupTransforms.transformOrigin.x;
      data.handleGroup.transformOrigin.y = handleGroupTransforms.transformOrigin.y;
      data.handleGroup.translate.x = handleGroupTransforms.translation.x;
      data.handleGroup.translate.y = handleGroupTransforms.translation.y;
      data.handleGroup.rotate = handleGroupTransforms.rotation;
      data.handleGroup.scale.x = handleGroupTransforms.scale.x;
      data.handleGroup.scale.y = handleGroupTransforms.scale.y;
      
      data.handle.topLeft.x = parseFloat(d3.select(this.handleIds.topLeft).attr('cx'));
      data.handle.topLeft.y = parseFloat(d3.select(this.handleIds.topLeft).attr('cy'));
      data.handle.topRight.x = parseFloat(d3.select(this.handleIds.topRight).attr('cx'));
      data.handle.topRight.y = parseFloat(d3.select(this.handleIds.topRight).attr('cy'));
      data.handle.bottomLeft.x = parseFloat(d3.select(this.handleIds.bottomLeft).attr('cx'));
      data.handle.bottomLeft.y = parseFloat(d3.select(this.handleIds.bottomLeft).attr('cy'));
      data.handle.bottomRight.x = parseFloat(d3.select(this.handleIds.bottomRight).attr('cx'));
      data.handle.bottomRight.y = parseFloat(d3.select(this.handleIds.bottomRight).attr('cy'));
      data.handle.topCenter.x = parseFloat(d3.select(this.handleIds.topCenter).attr('cx'));
      data.handle.topCenter.y = parseFloat(d3.select(this.handleIds.topCenter).attr('cy'));

      data.target = {
          translation:{},
          scale:{},
          transformOrigin:{}
      };
      let targetTransforms = getStyleTransforms(this.target);
      let targetBB = d3.select(this.target).node().getBBox();
      data.target.transformOrigin.x = targetTransforms.transformOrigin.x;
      data.target.transformOrigin.y = targetTransforms.transformOrigin.y;
      data.target.translate.x = targetTransforms.translation.x;
      data.target.translate.y = targetTransforms.translation.y;
      data.target.rotate = targetTransforms.rotation;
      data.target.scale.x = targetTransforms.scale.x;
      data.target.scale.y = targetTransforms.scale.y;
      
      data.target.width = targetBB.width;
      data.target.height = targetBB.height;
      data.target.x = targetBB.x;
      data.target.y = targetBB.y;
    
    if(format === 'api'){

      //convert To API DATA
      let data = {};

      
      return data;
    
    }
    else{

      return data;

    }

  }
  get currentState(){
    return this.currentState();
  }
  initHandles(options){

  var x = this.targetBB.x + this.targetBB.width/2;
  var y = this.targetBB.y + this.targetBB.height/2; 
  d3.select(this.target).style('transform-origin',`${x}px ${y}px`)
  .style('transform','translate(0px,0px) rotate(0deg) scale(1,1)');


  var handleAttributes ={};
  handleAttributes.radius=10;
  handleAttributes.topCenterDiff = 30;
  
  //scope pass
  handleAttributes.thisEditable = this;

  handleAttributes.locations = function(location, coordinate) {

  var imageBB = d3.select(this.thisEditable.target).node().getBBox();

    switch(location){
      case 'bottomRight':
      if(coordinate === 'x'){
        return  imageBB.x + imageBB.width;
      }
      else{
        return  imageBB.y + imageBB.height;
      }
      break;
      case 'bottomLeft':
      if(coordinate === 'x'){
        return  imageBB.x;
      }
      else{
        return imageBB.y + imageBB.height;
      }
      break;
      case 'topLeft':
      if(coordinate === 'x'){
        return  imageBB.x;
      }
      else{
        return imageBB.y;
      }
      break;
      case 'topRight':
      if(coordinate === 'x'){
        return  imageBB.x + imageBB.width;
      }
      else{
        return imageBB.y;
      }
      break;
      case 'topCenter':
      if(coordinate === 'x'){
        return  imageBB.x + imageBB.width/2;
      }
      else{
        return imageBB.y;
      }
      default: return false;
    }

  }; 
  
  handleAttributes.styles={};
  handleAttributes.transformOrigin={};

  handleAttributes.styles.fill ='rgba(255,177,177,0.7)';
  handleAttributes.styles.stroke ='rgba(0,0,0,1)';
  handleAttributes.styles.strokeWidth = 3;

  handleAttributes.transformOrigin.x = 0;
  handleAttributes.transformOrigin.y = 0;

  handleAttributes.ids={
      bottomRight:'resizeHandleBottomRight',
      bottomLeft:'resizeHandleBottomLeft',
      topRight:'resizeHandleTopRight',
      topLeft:'resizeHandleTopLeft',
      topCenter:'rotationHandleTopCenter',

  };
 
  var thisEditable=this;
  thisEditable.handleAttributes = handleAttributes;
      //Event Bindings
      var topLeftDrag = d3.drag(this.handleAttributes,thisEditable)
                  .on("start", function(){})
                  .on("drag", onTopLeftDrag)
                  .on("end", function(){});
      var topRightDrag = d3.drag(this.handleAttributes,thisEditable)
                  .on("start", function(){})
                  .on("drag", onTopRightDrag)
                  .on("end", function(){});
      var bottomLeftDrag = d3.drag(this.handleAttributes,thisEditable)
                  .on("start", function(){})
                  .on("drag", onBottomLeftDrag)
                  .on("end", function(){});
      var bottomRightDrag = d3.drag(this.handleAttributes,thisEditable)
                  .on("start", function(){})
                  .on("drag", onBottomRightDrag)
                  .on("end", function(){});

      var topCenterDrag = d3.drag(this.handleAttributes,thisEditable)
                  .on("start", onTopCenterDragStart)
                  .on("drag", onTopCenterDrag)
                  .on("end", onTopCenterDragEnd);
 
  var targetName  = this.targetName;
  var handleGroup = d3.select(this.container).append('g').attr('id',`${targetName}HandleGroup`)
  .style('transform','translate(0px,0px) rotate(0deg) scale(1,1)');  
      
      handleGroup.append('circle')
     .attr('id',handleAttributes.ids.topLeft)
     .attr("cx", handleAttributes.locations('topLeft','x') )
     .attr("cy", handleAttributes.locations('topLeft','y') )
     
     .attr("data-x", handleAttributes.locations('topLeft','x') )
     .attr("data-y", handleAttributes.locations('topLeft','y') )
     
     .attr("r", handleAttributes.radius)
     .attr('stroke',handleAttributes.styles.stroke)
     .attr('stroke-width',handleAttributes.styles.strokeWidth)
     .attr('fill',handleAttributes.styles.fill)
   
     .call(topLeftDrag);
      
      handleGroup.append('circle')
     .attr('id',handleAttributes.ids.topRight)
     .attr("cx", handleAttributes.locations('topRight','x') )
     .attr("cy", handleAttributes.locations('topRight','y') )

     .attr("data-x", handleAttributes.locations('topRight','x') )
     .attr("data-y", handleAttributes.locations('topRight','y') )
     
     .attr("r", handleAttributes.radius)
     .attr('stroke',handleAttributes.styles.stroke)
     .attr('stroke-width',handleAttributes.styles.strokeWidth)
     .attr('fill','black')

     .call(topRightDrag);
     
      handleGroup.append('circle')
     .attr('id',handleAttributes.ids.bottomLeft)
     .attr("cx", handleAttributes.locations('bottomLeft','x') )
     .attr("cy", handleAttributes.locations('bottomLeft','y') )

     .attr("data-x", handleAttributes.locations('bottomLeft','x') )
     .attr("data-y", handleAttributes.locations('bottomLeft','y') )
     
     .attr("r", handleAttributes.radius)
     .attr('stroke',handleAttributes.styles.stroke)
     .attr('stroke-width',handleAttributes.styles.strokeWidth)
     .attr('fill',handleAttributes.styles.fill)
     .call(bottomLeftDrag);
      
      handleGroup.append('circle')
     .attr('id', handleAttributes.ids.bottomRight)
     .attr("cx", handleAttributes.locations('bottomRight','x') )
     .attr("cy", handleAttributes.locations('bottomRight','y') )

     .attr("data-x", handleAttributes.locations('bottomRight','x') )
     .attr("data-y", handleAttributes.locations('bottomRight','y') )
     
     .attr("r", handleAttributes.radius)
     .attr('stroke',handleAttributes.styles.stroke)
     .attr('stroke-width',handleAttributes.styles.strokeWidth)
     .attr('fill',handleAttributes.styles.fill)
     .call(bottomRightDrag);

      handleGroup.append('circle')
     .attr('id', handleAttributes.ids.topCenter)
     .attr("cx", handleAttributes.locations('topCenter','x') )
     .attr("cy", handleAttributes.locations('topCenter','y') - handleAttributes.topCenterDiff )

     .attr("data-x", handleAttributes.locations('topCenter','x') )
     .attr("data-y", handleAttributes.locations('topCenter','y') - handleAttributes.topCenterDiff )
     
     .attr("r", handleAttributes.radius)
     .attr('stroke',handleAttributes.styles.stroke)
     .attr('stroke-width',handleAttributes.styles.strokeWidth)
     .attr('fill',handleAttributes.styles.fill)
     .call(topCenterDrag);

//EVENT BINDINGS
//
//

function onTopLeftDrag(d){
       
        var handle = d3.select(this);
        var target = d3.select(thisEditable.target);
        var targetBB = target.node().getBBox();


        var x = (parseFloat(handle.attr('data-x')) || 0) + d3.event.dx,
        y = (parseFloat(handle.attr('data-y')) || 0) + d3.event.dy;




        var x1 = handleAttributes.locations('topLeft','x'),
        y1 = handleAttributes.locations('topLeft','y'),
        x2 = handleAttributes.locations('bottomRight','x'),
        y2 = handleAttributes.locations('bottomRight','y');

        var m = (y2-y1)/(x2-x1);
        var b = targetBB.x;

    console.log('topLeft',x1,y1,x2,y2,m)

        handle.attr('cx',  x);
        handle.attr('cy',  m*x + b);


        d3.select(`#${handleAttributes.ids.bottomLeft}`).attr('cx',  x);
        d3.select(`#${handleAttributes.ids.topRight}`).attr('cy',  m*x + b);


        var n = x - thisEditable.targetBB.x;//replace with initial x
        var s = 1 - n/targetBB.width ; 
        // console.log(d3.event.x,d3.event.dx)
        
        // console.log(target.style('transform','translateX('+x+'px)'))
        // target.style('transform-origin','100% 100%');
        // console.log('scale('+a+','+a+')');
        // target.style('transform','scale('+a+','+a+')');
        var dSizeWidth = targetBB.width*s - targetBB.width;
        var dSizeHeight = targetBB.height*s - targetBB.height;
        d3.select(`#${handleAttributes.ids.topCenter}`)
        .attr('cy', y - handleAttributes.topCenterDiff)
        .attr('cx', x + targetBB.width*s/2);
 

        // var currentTransforms = thisEditable.getStyleTransforms(thisEditable.target);
        
        handle.attr('data-x', x);
        handle.attr('data-y', m*x + b);

         var targetUpdateObject={
          transformOrigin:{
            x:parseFloat(handle.attr('data-x')) + targetBB.width + dSizeWidth,
            y:parseFloat(handle.attr('data-y')) + targetBB.height + dSizeHeight
          },
          scale:{
            x:s,
            y:s
          }

         }
         thisEditable.update(thisEditable.target,targetUpdateObject);
        


}
function onTopRightDrag(d){

        var handle = d3.select(this);
        var target = d3.select(thisEditable.target);
        var targetBB = target.node().getBBox();


        var x = (parseFloat(handle.attr('data-x')) || 0) + d3.event.dx,
        y = (parseFloat(handle.attr('data-y')) || 0) + d3.event.dy;




        var x1 = handleAttributes.locations('topRight','x'),
        y1 = handleAttributes.locations('topRight','y'),
        x2 = handleAttributes.locations('bottomLeft','x'),
        y2 = handleAttributes.locations('bottomLeft','y');
        

        var m = (y2-y1)/(x2-x1);
        var b = targetBB.x + targetBB.width;

        console.log('topRight',typeof x1,typeof y1,x2,y2,m)  



        handle.attr('cx',  x);
        handle.attr('cy',  m*x + b);
        
        d3.select(`#${handleAttributes.ids.bottomRight}`).attr('cx',  x);
        d3.select(`#${handleAttributes.ids.topLeft}`).attr('cy', y);


        var n = x - thisEditable.targetBB.x;//replace with initial x
        var s = n/targetBB.width ; 
        // console.log(d3.event.x,d3.event.dx)
        
        // console.log(target.style('transform','translateX('+x+'px)'))
        // target.style('transform-origin','100% 100%');
        // console.log('scale('+a+','+a+')');
        // target.style('transform','scale('+a+','+a+')');
        var dSizeWidth = targetBB.width*s - targetBB.width;
        var dSizeHeight = targetBB.height*s - targetBB.height;

         var targetUpdateObject={
          transformOrigin:{
            x:thisEditable.currentState.transformOrigin.x + dSizeWidth,
            y:thisEditable.currentState.transformOrigin.y + dSizeHeight
          },
          scale:{
            x:s,
            y:s
          },
         }
         console.log(thisEditable.target)
         thisEditable.update(thisEditable.target,targetUpdateObject);
        
        handle.attr('data-x', x);
        handle.attr('data-y', m*x + b);


}
function onBottomLeftDrag(d){}
function onBottomRightDrag(d){}

function onTopCenterDragStart(d){
        var scope = thisEditable.rotationDragEventStore;
        // d3.event.sourceEvent.stopPropagation();
        
        scope.target = d3.select(thisEditable.target);
        var targetBB = scope.target.node().getBBox();
        var target = scope.target;

        scope.h_x = d3.event.sourceEvent.pageX;
        scope.h_y = d3.event.sourceEvent.pageY;
        // e.preventDefault();
        // e.stopPropagation();
        scope.dragging = true;
        // target_wp = $(e.target).closest('.draggable_wp');
        if (!target.datum()){

        target.datum({
          data:{
            left: targetBB.x,
            top: targetBB.y
          }
        });

        } 
        scope.o_x = target.datum().data.left;
        scope.o_y = target.datum().data.top; // origin point
        
        scope.last_angle = target.datum().data.last_angle || 0;
        // console.log(scope.o_x,scope.o_y,scope.h_x,scope.h_y,target.datum().data)

}
function onTopCenterDragEnd(d){
        var scope = thisEditable.rotationDragEventStore;
        scope.dragging = false
        var s_x = d3.event.sourceEvent.pageX,
            s_y = d3.event.sourceEvent.pageY;
        
        // Saves the last angle for future iterations
        var s_rad = Math.atan2(s_y - scope.o_y, s_x - scope.o_x); // current to origin
        s_rad -= Math.atan2(scope.h_y - scope.o_y, scope.h_x - scope.o_x); // handle to origin
        s_rad += scope.last_angle;
        scope.target.datum().data.last_angle= s_rad;

}

function onTopCenterDrag(d) {
// console.log(d3.event)
         var scope = thisEditable.rotationDragEventStore;
         var target = scope.target;
         var targetBB = target.node().getBBox();

         var handle = d3.select(this);
         // window.dragMoveListener(e);
       
         // var bb = d3.select("#content").node().getBBox();

         // var resistor_x = bb.x + bb.width/2;
         // var resistor_y = bb.y + bb.height/2;
         var mouse_x = d3.event.sourceEvent.pageX;
         var mouse_y = d3.event.sourceEvent.pageY;
         var dx =  mouse_x - scope.o_x ;
         var dy =  mouse_y - scope.o_y ;
         if(mouse_x !== scope.o_x && mouse_y !== scope.o_y){

                var s_rad = Math.atan2(dy, dx); // current to origin
                s_rad -= Math.atan2(scope.h_y - scope.o_y, scope.h_x - scope.o_x); // handle to origin
                s_rad += scope.last_angle; // relative to the last one
                var degree = (s_rad * (360 / (2 * Math.PI)));
                // console.log(scope.h_y,dx,scope.o_y)
         }
         // d = Math.sqrt(dx*dx + dy*dy);    // Find distance to mouse
         // if( /rotate\((\W?\d+\.?\d*)deg\)/.exec( d3.select('#handleGroup').style('transform')) === null ) {
         //  var alpha = 0;
         // }
         // else{

         //  var alpha = parseFloat(/rotate\((\W?\d+\.?\d*)deg\)/.exec( d3.select('#handleGroup').style('transform'))[1]); 
         //  alpha = alpha%360;
         //  console.log(alpha)
         // }
         // theta = (90 + Math.atan2(dy, dx)*180/Math.PI); 
         
         // theta = theta - alpha;
         


         // console.log(originX,originY,dx,dy,Math.atan2(dy, dx));

          //Find angle to mouse in degrees
        // console.log()

         // target.style('transform-origin','50% 50%')
         // target.style('transform','rotate('+theta+'deg)')
         var newHandleYPercentage = ( (targetBB.height +  handleAttributes.topCenterDiff) / ((2*targetBB.height) +  handleAttributes.topCenterDiff) )* 100 ;
         
         var targetTransforms = thisEditable.getStyleTransforms(thisEditable.target);
         var handleTransforms = thisEditable.getStyleTransforms(`#${handleAttributes.ids.topCenter}`);

         
         
         console.log(thisEditable.targetBB.x*targetTransforms.scale.x,thisEditable.targetBB.x)
         var rotCenterx = (parseFloat(d3.select(`#${handleAttributes.ids.bottomRight}`).attr('cx')) + parseFloat(d3.select(`#${handleAttributes.ids.topLeft}`).attr('cx')) ) /2;
         var rotCenterY = (parseFloat(d3.select(`#${handleAttributes.ids.bottomRight}`).attr('cy')) + parseFloat(d3.select(`#${handleAttributes.ids.topLeft}`).attr('cy')) ) /2;
console.log(rotCenterx);
           // d3.select(this.target).style('transform-origin',`${x}px ${y}px`);

         var handleGroupUpdateObject={
          transformOrigin:{
            x:rotCenterx,
            y:rotCenterY
          },
          rotate:degree
         }
         var targetUpdateObject = {
          transformOrigin:{
            x:rotCenterx,
            y:rotCenterY
          },
          rotate:degree
         }
         // console.log(handleGroupUpdateObject,`#${thisEditable.targetName}HandleGroup`)
         thisEditable.update(`#${thisEditable.targetName}HandleGroup`,handleGroupUpdateObject);
         thisEditable.update(thisEditable.target,targetUpdateObject);
         // d3.select('#handleGroup').style('transform-origin','50% '+newYPercentage+'%')
         // d3.select('#handleGroup').style('transform','rotate('+ degree +'deg)')
         

          
         // d3.select('#content').style('transform-origin','50% 50%')
         // d3.select('#content').style('transform','rotate('+ degree +'deg)')

         // transform = "translate(200, 100) rotate(" + theta + ") scale(" + d/310 + ")" ;
   

         // console.log(a);
         // d3.select("#content").attr('style',a);
         // d3.select("#handleResize").attr('style',b);



}





  }









}

setTimeout(function(){
var editableObject = new editable('#content','#mainSVG',1000);

editableObject.initHandles()

},300);




var currentTextSelection;

/**
* Gets the color of the current text selection
*/
function getCurrentTextColor(){
    return $(editor.getSelectedParentElement()).css('color');
}

/**
 * Custom `color picker` extension
 */
var ColorPickerExtension = MediumEditor.extensions.button.extend({
    name: "colorPicker",
    action: "applyForeColor",
    aria: "color picker",
    contentDefault: "<span class='editor-color-picker'>Text Color<span>",

    init: function() {
        this.button = this.document.createElement('button');
        this.button.classList.add('medium-editor-action');
        this.button.innerHTML = '<b>Text color</b>';
        
        //init spectrum color picker for this button
        initPicker(this.button);
        
        //use our own handleClick instead of the default one
        this.on(this.button, 'click', this.handleClick.bind(this));
    },
     handleClick: function (event) {
         //keeping record of the current text selection
         currentTextSelection = editor.exportSelection();
         
         //sets the color of the current selection on the color picker
         $(this.button).spectrum("set", getCurrentTextColor());

         //from here on, it was taken form the default handleClick
         event.preventDefault();
         event.stopPropagation();

         var action = this.getAction();

         if (action) {
             this.execAction(action);
         }
     }
});

var pickerExtension = new ColorPickerExtension();

function setColor(color) {
    var finalColor = color ? color.toRgbString() : 'rgba(0,0,0,0)';

    pickerExtension.base.importSelection(currentTextSelection);
    pickerExtension.document.execCommand("styleWithCSS", false, true);
    pickerExtension.document.execCommand("foreColor", false, finalColor);
}

function initPicker(element) {
    $(element).spectrum({
        allowEmpty: true,
        color: "#f00",
        showInput: true,
        showAlpha: true,
        showPalette: true,
        showInitial: true,
        hideAfterPaletteSelect: true,
        preferredFormat: "hex3",
        change: function(color) {
            setColor(color);
        },
        hide: function(color) {
            setColor(color);
        },
        palette: [
            ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
            ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
            ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
            ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
            ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
            ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
            ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
            ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
        ]
    });
}










/*var html = document.querySelector(".html");*/
var  editableText = document.querySelector(".editable");
var editor = new MediumEditor('.editable', {
  placeholder:{
        text: 'Hello!',
        hideOnClick: true
    },
  buttonLabels: false,
  imageDragging: false,

  toolbar: {
    buttons: ['colorPicker','bold', 'italic', 'underline', 'quote']
  },    
  extensions: {
        'colorPicker': pickerExtension
    }
})/*.subscribe("editableInput", function() {
  html.value = editableText.innerHTML;
});

html.onkeyup = html.ontouchend = function() {
  editableText.innerHTML = html.value;
};
editableText.innerHTML = html.value*/
