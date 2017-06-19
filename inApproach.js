
// IMAGE EDITING
// 

function initResizeHandles(){


  var handleAttributes ={};
  handleAttributes.radius=10;
  handleAttributes.locations = function(location, coordinate) {
  
  var imageBB = d3.select("#content").node().getBBox();
    
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
      topLeft:'resizeHandleTopLeft'
  };

  var mainSVG = d3.select("#mainSVG"); 
      
      mainSVG.append('circle')
     .attr('id',handleAttributes.ids.topLeft)
     .attr("cx", handleAttributes.locations('topLeft','x') )
     .attr("cy", handleAttributes.locations('topLeft','y') )
     .attr("r", handleAttributes.radius)
     .attr('stroke',handleAttributes.styles.stroke)
     .attr('stroke-width',handleAttributes.styles.strokeWidth)
     .attr('fill',handleAttributes.styles.fill);
      mainSVG.append('circle')
     .attr('id',handleAttributes.ids.topRight)
     .attr("cx", handleAttributes.locations('topRight','x') )
     .attr("cy", handleAttributes.locations('topRight','y') )
     .attr("r", handleAttributes.radius)
     .attr('stroke',handleAttributes.styles.stroke)
     .attr('stroke-width',handleAttributes.styles.strokeWidth)
     .attr('fill',handleAttributes.styles.fill);
      mainSVG.append('circle')
     .attr('id',handleAttributes.ids.bottomLeft)
     .attr("cx", handleAttributes.locations('bottomLeft','x') )
     .attr("cy", handleAttributes.locations('bottomLeft','y') )
     .attr("r", handleAttributes.radius)
     .attr('stroke',handleAttributes.styles.stroke)
     .attr('stroke-width',handleAttributes.styles.strokeWidth)
     .attr('fill',handleAttributes.styles.fill);
      mainSVG.append('circle')
     .attr('id', handleAttributes.ids.bottomRight)
     .attr("cx", handleAttributes.locations('bottomRight','x') )
     .attr("cy", handleAttributes.locations('bottomRight','y') )
     .attr("r", handleAttributes.radius)
     .attr('stroke',handleAttributes.styles.stroke)
     .attr('stroke-width',handleAttributes.styles.strokeWidth)
     .attr('fill',handleAttributes.styles.fill);

     return handleAttributes;

}

setTimeout(function(){


var handleAttributes = initResizeHandles();

interact('#' + handleAttributes.ids.topLeft)
  .draggable({
     onmove: function(e){
        var target = e.target,
        image = d3.select("#content"),
        imageBB = image.node().getBBox(),
        oldCx = parseFloat(target.getAttribute('cx')),
        oldCy = parseFloat(target.getAttribute('cy'))
        ;

        // keep the dragged position in the data-x/data-y attributes
        x = (oldCx || 0) + e.dx
        y = (oldCy || 0) + e.dy;
        // x = (parseFloat(d3.select("#content").attr('data-x')) || 0),
        // y = (parseFloat(d3.select("#content").attr('data-y')) || 0);
        
        var x1 = handleAttributes.locations('topLeft','x'),
        y1 = handleAttributes.locations('topLeft','y'),
        x2 = handleAttributes.locations('bottomRight','x'),
        y2 = handleAttributes.locations('bottomRight','y'),

        y3 = handleAttributes.locations('bottomLeft','y'),
        y4 = handleAttributes.locations('topRight','y');
        var m = (y2-y1)/(x2-x1);
        //reverseEngineered
        var b = imageBB.x;
        var newImageWidth = imageBB.width + (-1*e.dx); 
        


        // var newImageHeight = imageBB.height + (-1*e.dy); 
        // imageBB.width += e.dx
        // imageBB.height += e.dy
        // d3.select("#content").attr('width',imageBB.width)
// imageBB.y + e.dx
// var s = y + (handleAttributes.locations('bottomLeft','y') - y );

        target.setAttribute('cx',  x);
        target.setAttribute('cy',  m*x + b);
  dx = parseFloat(d3.select("#myClip").select('rect').attr('x')) - x;


        image.attr('x',x)
      image.attr('y',y + dx)
        image.attr('width',newImageWidth)
    



   //UPDATE RESIZE HANDLE TRANSFORM ORIGIN!
    


    }
});
  interact('#' + handleAttributes.ids.topRight)
  .draggable({
     onmove: function(e){
        var target = e.target,
        image = d3.select("#content"),
        imageBB = image.node().getBBox(),
        oldCx = parseFloat(target.getAttribute('cx')),
        oldCy = parseFloat(target.getAttribute('cy'))
        ;

        // keep the dragged position in the data-x/data-y attributes
        x = (oldCx || 0) + e.dx
        y = (oldCy || 0) + e.dy;
        // x = (parseFloat(d3.select("#content").attr('data-x')) || 0),
        // y = (parseFloat(d3.select("#content").attr('data-y')) || 0);
        
        var x1 = handleAttributes.locations('topRight','x'),
        y1 = handleAttributes.locations('topRight','y'),
        x2 = handleAttributes.locations('bottomLeft','x'),
        y2 = handleAttributes.locations('bottomLeft','y');
        var m = (y2-y1)/(x2-x1);
        //reverseEngineered
        var b = imageBB.x + imageBB.width;

        // imageBB.width += e.dx
        // imageBB.height += e.dy
        // d3.select("#content").attr('width',imageBB.width)

        target.setAttribute('cx',  x);
        target.setAttribute('cy',  m*x + b);
   

   //UPDATE RESIZE HANDLE TRANSFORM ORIGIN!
    


    }
});
  interact('#' + handleAttributes.ids.bottomLeft)
  .draggable({
     onmove: function(e){
        var target = e.target,
        image = d3.select("#content"),
        imageBB = image.node().getBBox(),
        oldCx = parseFloat(target.getAttribute('cx')),
        oldCy = parseFloat(target.getAttribute('cy'))
        ;

        // keep the dragged position in the data-x/data-y attributes
        x = (oldCx || 0) + e.dx
        y = (oldCy || 0) + e.dy;
        // x = (parseFloat(d3.select("#content").attr('data-x')) || 0),
        // y = (parseFloat(d3.select("#content").attr('data-y')) || 0);
        
        var x1 = handleAttributes.locations('bottomLeft','x'),
        y1 = handleAttributes.locations('bottomLeft','y'),
        x2 = handleAttributes.locations('topRight','x'),
        y2 = handleAttributes.locations('topRight','y');
        var m = (y2-y1)/(x2-x1);
        //reverseEngineered
        var b = imageBB.x + imageBB.width;

        // imageBB.width += e.dx
        // imageBB.height += e.dy
        // d3.select("#content").attr('width',imageBB.width)

        target.setAttribute('cx',  x);
        target.setAttribute('cy',  m*x + b);
   

   //UPDATE RESIZE HANDLE TRANSFORM ORIGIN!
    


    }
});
  interact('#' + handleAttributes.ids.bottomRight)
  .draggable({
     onmove: function(e){
        var target = e.target,
        image = d3.select("#content"),
        imageBB = image.node().getBBox(),
        oldCx = parseFloat(target.getAttribute('cx')),
        oldCy = parseFloat(target.getAttribute('cy'))
        ;

        // keep the dragged position in the data-x/data-y attributes
        x = (oldCx || 0) + e.dx
        y = (oldCy || 0) + e.dy;
        // x = (parseFloat(d3.select("#content").attr('data-x')) || 0),
        // y = (parseFloat(d3.select("#content").attr('data-y')) || 0);
        
        var x1 = handleAttributes.locations('bottomRight','x'),
        y1 = handleAttributes.locations('bottomRight','y'),
        x2 = handleAttributes.locations('topLeft','x'),
        y2 = handleAttributes.locations('topLeft','y');
        var m = (y2-y1)/(x2-x1);
        //reverseEngineered
        var b = imageBB.x;

        // imageBB.width += e.dx
        // imageBB.height += e.dy
        // d3.select("#content").attr('width',imageBB.width)

        target.setAttribute('cx',  x);
        target.setAttribute('cy',  m*x + b);
   

   //UPDATE RESIZE HANDLE TRANSFORM ORIGIN!
    


    }
});
                      







},100);











function updateElements(target,resizeGroup,rotateGroup){



}



  function dragMoveListener (event) {
    // var clipRect=d3.select("#myClip").select('rect');
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element

    
    nT = target.style.transform.replace(/translate\(\W?\d+\.?\d*px,\s+\W?\d+\.?\d*px\)/,'translate(' + x + 'px, ' + y + 'px)');

    target.style.webkitTransform =
    target.style.transform = nT;
 
    

    imageBB = d3.select("#content").node().getBBox();
    d3.select('#handleResize').attr('cx', imageBB.width  + imageBB.x + x).attr('cy', imageBB.height  + imageBB.y + y)
    
 


    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);



  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;


interact('#handle')
  .draggable({
    onmove: function(e){
      // window.dragMoveListener(e);
         var originX = parseInt(d3.select("#test").attr('cx'));
         var originY = parseInt(d3.select("#test").attr('cy'));
         // var bb = d3.select("#content").node().getBBox();

         // var resistor_x = bb.x + bb.width/2;
         // var resistor_y = bb.y + bb.height/2;
         var mouse_x = event.pageX;
         var mouse_y = event.pageY;
         dx =  originX - mouse_x;
         dy =  originY - mouse_y;

         console.log(dx,dy);
         // d = Math.sqrt(dx*dx + dy*dy);    // Find distance to mouse
         theta = (90+Math.atan2(dy, dx)*180/Math.PI) - 180;    //Find angle to mouse in degrees
        // console.log()


         e.target.style = "transform-origin:50% 550% ; transform:rotate("+theta+"deg);";

         // transform = "translate(200, 100) rotate(" + theta + ") scale(" + d/310 + ")" ;
         // console.log(transform);
         var a  = d3.select("#content").attr('style').replace(/rotate\(\W?\d+\.?\d*deg\)/,"rotate("+theta.toString()+"deg)");
         var b  = d3.select("#handleResize").attr('style').replace(/rotate\(\W?\d+\.?\d*deg\)/,"rotate("+theta.toString()+"deg)");

         console.log(a);
        d3.select("#content").attr('style',a);
         d3.select("#handleResize").attr('style',b);
        
    }
  });


interact('#content')
  .draggable({
        // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: ".product-design",
      endOnly: false,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    // autoScroll: true,

    // call this function on every dragmove event
    onmove: window.dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {

    
    }
  })

  // .resizable({
  //   preserveAspectRatio: true,
  //   edges: { left: true, right: true, bottom: true, top: true }
  // })
  // .on('resizemove', function (event) {
  //   var target = event.target,
  //       x = (parseFloat(target.getAttribute('data-x')) || 0),
  //       y = (parseFloat(target.getAttribute('data-y')) || 0);

  //       // console.log(event,target.style.width ,event.rect.width)
  //   // update the element's style
  //   target.style.width  = event.rect.width + 'px';
  //   target.style.height = event.rect.height + 'px';

  //   // translate when resizing from top or left edges
  //   x += event.deltaRect.left;
  //   y += event.deltaRect.top;

  //   nT = target.style.transform.replace(/translate\(\W?\d+\.?\d*px,\s+\W?\d+\.?\d*px\)/,'translate(' + x + 'px, ' + y + 'px)');

  //   target.style.webkitTransform =
  //   target.style.transform = nT;
 

  //   target.setAttribute('data-x', x);
  //   target.setAttribute('data-y', y);

  // })
  .on('dragstart', function(){

    d3.select("#contentWrapper").attr("clip-path",null);
  })
  .on('dragend', function(){
  })
  .on('resizestart', function(){

    d3.select("#contentWrapper").attr("clip-path",null);
  })
  .on('resizeend', function(){
  });








d3.select("#content").on("dblclick", function(e){

    if(! d3.select("#contentWrapper").attr("clip-path")){
    d3.select("#contentWrapper").attr("clip-path","url(#myClip)");  
}

});
