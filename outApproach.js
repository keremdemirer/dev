Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

class guiControls {

    constructor(type) {
        this.type = type;
        this.guiControlsId = type + 'GuiControls';
        this.guiControlsSelector = '#' + type + 'GuiControls';
        this.rotationWheelAngle = 0;
        this.scaleWheelAmount = 1;
    }

    init(width, height, x, y) {

        d3.select("#mainSVG").append('svg')
            .attr('id', this.guiControlsId)
            .attr('width', width)
            .attr('height', height)
            .attr('x', x)
            .attr('y', y)
            .attr('viewBox', '0 0 ' + width.toString() + " " + height.toString())
            .attr('preserveAspectRatio', 'xMinYMinmeet');

        d3.select(this.guiControlsSelector).append('g')
            .attr('id', 'rotationWheelGroup');
        d3.select(this.guiControlsSelector).append('g')
            .attr('id', 'scaleWheelGroup')
            .attr("transform", "translate(" + 0 + "," + -1 * height / 1.55 + ")");

        var rotWhlCircumferenceRadius = 50;
        var imageEditGuiControls = this;
        var rotationWheelDrag = d3.drag(imageEditGuiControls)
            .on("start", dragstarted)
            .on("drag", rotationWheelDragged)
            .on("end", dragended);
        var rotationWheelGroup = d3.select('#rotationWheelGroup').attr("transform", "translate(" + width * 0.33 + "," + height / 2.8 + ")");
        var circumference = rotationWheelGroup.append('circle')
            .attr('r', rotWhlCircumferenceRadius)

        .attr('class', 'rotWhlCircumference')
            .call(addRotLines);
        var handle = [{
            x: 0,
            y: -rotWhlCircumferenceRadius
        }];
        var handle_circle = rotationWheelGroup.append("g")
            .attr("class", "rotationWheelHandle")
            .selectAll('circle')
            .data(handle)
            .enter().append("circle")
            .attr("r", 12)
            .attr("cx", function(d) {
                return d.x; })
            .attr("cy", function(d) {
                return d.y; })
            .call(rotationWheelDrag);



        function rotationWheelDragged(d) {

            let d_from_origin = Math.sqrt(Math.pow(d3.event.x, 2) + Math.pow(d3.event.y, 2));

            var alpha = Math.acos(d3.event.x / d_from_origin);

            var circumferenceOriginX = d3.select(".rotWhlCircumference").attr('cx');
            var circumferenceOriginY = d3.select(".rotWhlCircumference").attr('cy');
            var dx = circumferenceOriginX - d3.event.x;
            var dy = circumferenceOriginY - d3.event.y;
            var theta = Math.atan2(dy, dx) * 180 / Math.PI - 90;
            if (theta < 0) { theta += 360; }

          
            if(alpha > 1.4 && alpha < 1.6){
              alpha = 1.55;
              if(d3.event.y < 0){

                imageEditGuiControls.rotationWheelAngle = 0;
              }
              else{
               imageEditGuiControls.rotationWheelAngle = 180;

              }


            }
            else if(alpha > 3.0 && alpha < 3.2){
              alpha = 3.1;

            imageEditGuiControls.rotationWheelAngle = 270;
            }
            else if(alpha < 0.1){
              alpha = 0.05;

            imageEditGuiControls.rotationWheelAngle = 90;
            }
            else{

            imageEditGuiControls.rotationWheelAngle = theta;

            }

              // console.log(imageEditGuiControls.rotationWheelAngle);
            
            var newRot = d3.select("#content").attr('style').replace(/rotate\(\W?\d+\.?\d*deg\)/,'rotate('+imageEditGuiControls.rotationWheelAngle+'deg)');
            d3.select("#content").attr('style',newRot);


            d3.select(this)
                .attr("cx", d.x = rotWhlCircumferenceRadius * Math.cos(alpha))
                .attr("cy", d.y = d3.event.y < 0 ? -rotWhlCircumferenceRadius * Math.sin(alpha) : rotWhlCircumferenceRadius * Math.sin(alpha));
        }

        var sclWhlCircumferenceRadius = 50;
        var imageEditGuiControls = this;

        var scaleWheelGroup = d3.select('#scaleWheelGroup').attr("transform", "translate(" + width * 0.66 + "," + height / 2.8 + ")");
        var circumference = scaleWheelGroup.append('circle')
            .attr('r', sclWhlCircumferenceRadius)
            .attr('class', 'sclWhlCircumference')
            .call(addScaleLines);

        var arc = d3.arc()
            .innerRadius(46)
            .outerRadius(53)
            .startAngle(0.80 * Math.PI)
            .endAngle(1.20 * Math.PI);

        var coords = arc().split("L")[1].split("A")[0].split(',');
        var arcCoords = {}
        arcCoords.arcEndx = parseFloat(coords[0]);
        arcCoords.arcEndy = parseFloat(coords[1]);
        arcCoords.arcStartx = arcCoords.arcEndx + sclWhlCircumferenceRadius;
        arcCoords.arcStarty = arcCoords.arcEndy;

        var arcGroup = scaleWheelGroup.append("g").attr('class', 'sclArcGroup');
        arcGroup.append("path")
            .attr('fill', '#ffffff')
            .attr("class", "sclArc")
            .attr("d", arc);

        var scaleWheelDrag = d3.drag(imageEditGuiControls, arcCoords)
            .on("start", dragstarted)
            .on("drag", scaleWheelDragged)
            .on("end", dragended);


        var handle = [{
            x: 0,
            y: -sclWhlCircumferenceRadius
        }];
        var handle_circle = scaleWheelGroup.append("g")
            .attr("class", "scaleWheelHandle")
            .selectAll('circle')
            .data(handle)
            .enter().append("circle")
            .attr("r", 12)
            .attr("cx", function(d) {
                return d.x; })
            .attr("cy", function(d) {
                return d.y; })
            .call(scaleWheelDrag);

        function scaleWheelDragged(d) {

            var handleCoords = {}
            handleCoords.cx = parseFloat(d3.select(".scaleWheelHandle").select('circle').attr('cx'));
            handleCoords.cy = parseFloat(d3.select(".scaleWheelHandle").select('circle').attr('cy'));
            // console.log(handleCoords.cy,arcCoords.arcEndy)


            let d_from_origin = Math.sqrt(Math.pow(d3.event.x, 2) + Math.pow(d3.event.y, 2));

            var alpha = Math.acos(d3.event.x / d_from_origin);

            var circumferenceOriginX = d3.select(".sclWhlCircumference").attr('cx');
            var circumferenceOriginY = d3.select(".sclWhlCircumference").attr('cy');
            var dx = circumferenceOriginX - d3.event.x;
            var dy = circumferenceOriginY - d3.event.y;
            var theta = Math.atan2(dy, dx) * 180 / Math.PI - 90;
            var linTheta = Math.atan2(dy, dx) * 180 / Math.PI - 90;
            if (linTheta > 215 ){ linTheta -= 360; }
            if (linTheta > -270 && linTheta < -200 ){ linTheta += 360; }
            if (theta < 0) { theta += 360; }


            var isDragging = d3.select(this)
                .classed("dragging");
            if ((theta < 145 || theta > 215) && isDragging) {
              if(linTheta > 140){
                linTheta=140;
              }
              else if(linTheta < -140){
                linTheta=-140;
              }
              
              if(linTheta < 5 && linTheta > -5 ){
                alpha = 1.55;
                  imageEditGuiControls.scaleWheelAmount = 1;
              
              }else{
                  imageEditGuiControls.scaleWheelAmount = linTheta.map(-140, 140,0,2);
              }

              
               
                d3.select(this)
                    .attr("cx", d.x = sclWhlCircumferenceRadius * Math.cos(alpha))
                    .attr("cy", d.y = d3.event.y < 0 ? -sclWhlCircumferenceRadius * Math.sin(alpha) : sclWhlCircumferenceRadius * Math.sin(alpha));


                var newScale = d3.select("#content").attr('style').replace(/scale\(\d+\.?\d*,\s*\d+\.?\d*\)/,'scale('+imageEditGuiControls.scaleWheelAmount+','+imageEditGuiControls.scaleWheelAmount+')');
                console.log(newScale)
                d3.select("#content").attr('style',newScale);
            
            } else if (theta > 180 && theta < 182) {
                d3.select(this)
                    .classed("dragging", false);

            }




        }


        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this)
                .classed("dragging", true);
        }

        function dragended(d) {
            d3.select(this)
                .classed("dragging", false);
        }

        function addRotLines() {

            var bb = d3.select(".rotWhlCircumference").node().getBBox();
            var circumferenceRad = parseFloat(d3.select(".rotWhlCircumference").attr('r'));
            var lineLength = 10;
            var l1 = {},
                l2 = {},
                l3 = {},
                l4 = {};
            var lineData = [];
            l1.id = 'l1';
            l1.x1 = bb.x + circumferenceRad;
            l1.x2 = bb.x + circumferenceRad;
            l1.y1 = bb.y - lineLength / 2;
            l1.y2 = bb.y + lineLength / 2;

            l2.id = 'l2';
            l2.x1 = bb.x + (circumferenceRad * 2) + lineLength / 2;
            l2.x2 = bb.x + (circumferenceRad * 2) - lineLength / 2;
            l2.y1 = bb.y + circumferenceRad;
            l2.y2 = bb.y + circumferenceRad;

            l3.id = 'l3';
            l3.x1 = bb.x + circumferenceRad;
            l3.x2 = bb.x + circumferenceRad;
            l3.y1 = bb.y + (circumferenceRad * 2) - lineLength / 2;
            l3.y2 = bb.y + (circumferenceRad * 2) + lineLength / 2;

            l4.id = 'l4';
            l4.x1 = bb.x - lineLength / 2;
            l4.x2 = bb.x + lineLength / 2;
            l4.y1 = bb.y + circumferenceRad;
            l4.y2 = bb.y + circumferenceRad;
            lineData.push(l1);
            lineData.push(l2);
            lineData.push(l3);
            lineData.push(l4);
            lineData.class = 'rotLine';



            var lines = rotationWheelGroup.append("g")
                .attr("class", 'rotLines')
                .selectAll('line')
                .data(lineData)
                .enter().append("line")
                .attr("id", function(d, i) {
                    return d.id; })
                .attr("x1", function(d, i) {
                    return d.x1; })
                .attr("x2", function(d, i) {
                    return d.x2; })
                .attr("y1", function(d, i) {
                    return d.y1; })
                .attr("y2", function(d, i) {
                    return d.y2; })
                .attr('stroke-width', 5)
                .attr('stroke', ' #25a8e0')
                .attr("stroke-linecap", "round");

            var arc = d3.arc()
                .innerRadius(26)
                .outerRadius(28)
                .startAngle(0.3 * Math.PI)
                .endAngle(2 * Math.PI);

            var coords = arc().split("L")[1].split("A")[0].split(',');
            var arcEndx = parseFloat(coords[0]);
            var arcEndy = parseFloat(coords[1]);

            var arcGroup = rotationWheelGroup.append("g").attr('class', 'rotArcGroup');
            arcGroup.append("path")
                .attr("class", "rotArc")
                .attr("d", arc);

            arcGroup.append('path')
                .attr('d', function(d) {
                    var x = arcEndx,
                        y = arcEndy;
                    return 'M ' + x + ' ' + y + ' l 6 6 l -12 0 z';
                })
                .attr('style', 'transform-origin:center center;transform:translateY(-3.5px)rotate(90deg);');

        }

        function addScaleLines() {

        }

      var contentDrag = d3.drag(imageEditGuiControls)
            .on("start", dragstarted)
            .on("drag", contentDragged)
            .on("end", dragended);


        function contentDragged(d) {
     
        var target = d3.select(this);
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.attr('data-x')) || 0) + d3.event.dx,
        y = (parseFloat(target.attr('data-y')) || 0) + d3.event.dy;

    //     var bb=target.node().getBBox();

    // // translate the element
    //     var translateXAmount=(x * 100)/bb.width;
    //     var translateYAmount=(y * 100)/bb.height;
        
    //     var transformOriginX=parseFloat(/transform-origin:\s+(\W?\d+\.?\d*)%\s+\W?\d+\.?\d*%/.exec(target.attr("style"))[1]); 

    //     var transformOriginY=parseFloat(/transform-origin:\s+\W?\d+\.?\d*%\s+(\W?\d+\.?\d*)%/.exec(target.attr("style"))[1]); 
    // console.log(transformOriginX,transformOriginY)
    //     console.log('transform-origin: '+ (transformOriginX + translateXAmount) +'% '+ (transformOriginY + translateYAmount )+'%')
    

    var nT = target.attr("style").replace(/translate\(\W?\d+\.?\d*px,\s+\W?\d+\.?\d*px\)/,'translate(' + x + 'px, ' + y + 'px)')
    // .replace(/transform-origin:\s+\W?\d+\.?\d*%\s+\W?\d+\.?\d*%/,'transform-origin: '+ (transformOriginX + translateXAmount) +'% '+ (transformOriginY + translateYAmount )+'%');
    target.attr('x',x);
    target.attr('y',y);
 
 // update the posiion attributes1
 

        target.attr('data-x', x);
        target.attr('data-y', y);

        
        }
        d3.select('#content').call(contentDrag);



    }


}

var imageEditGuiControls = new guiControls('imageEdit');
imageEditGuiControls.init(400, 200, 350, 30);
