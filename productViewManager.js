//bir cache sistemi yapabilirim unutma.
class ProductViewManager {
    
	constructor(products,baseURL) {
    	 this.products = products;
    	 this.baseURL = baseURL;
    	 this.imageCount = 0;
    	 this.counter = 0;
    	
	}
	
	imageLoaded(){
         this.counter++; 
    }
	getFrameStatus(){
		/*********Gostermelik fonksyon***********/
		var status;
		if($('#isFramed').val() === "true"){
			status=true;
		}
		else{
		    status=false;
		}


		/****************************************/
		// bu variable a senin sisteminde frame durumunu Boolean seklinde
		// veren bir fonksyon yazmalisin 
		
		return status;	
	}
	getFrameColor(){
		/*********Gostermelik fonksyon***********/
		
		if($('#isFramed').val() === "true"){
                var color = $("#frameColor").val();
        }


		/****************************************/
		// senin sisteminde frame rengini string seklinde
		// veren bir fonksyon yazmalisin 
		return color;	
	}
	getCanvasIdentifier(){
		/*********Gostermelik fonksyon***********/
		
		let identifier = $('#identifier').val();

		/****************************************/
		// bu variable a senin sisteminde frame durumunu string seklinde
		// veren bir fonksyon yazmalisin 
		
		return identifier;	
	}
	getCanvasSize(){
		/********Gostermelik fonksyon***********/
		
		let size = $('#size').val();

		/***************************************/
		 // bu variable a senin sisteminde frame rengini string seklinde
		// veren bir fonksyon yazmalisin 

		return size;	
	}
	setFrameColor(){
  
	  	if(this.getFrameStatus()){
	        let frameColorId = "#" + this.getFrameColor();
	        
	        d3.select(".loadedFrames")
	        .selectAll("*")
	        .classed('visible',false);
	        d3.select(frameColorId).classed('visible',true);
	    	}

	}
	setFrameStatus(){
	
	    if(this.getFrameStatus()){

	    	let frameColorId = "#" + this.getFrameColor();
	        d3.select(frameColorId).classed('visible',true);
	        
	        d3.select("#ShadowCanvasAlpha").classed('visible',false);
	        d3.select("#ShadowFrameAlpha").classed('visible',true);
	     
	    }
	    else
	    {
	        d3.select(".loadedFrames")
        	.selectAll("*")
        	.classed('visible',false);
	        
	        d3.select("#ShadowCanvasAlpha").classed('visible',true);
			d3.select("#ShadowFrameAlpha").classed('visible',false);
	    }

	}
	setCanvasIdentifier(animation1WithCallback,animation2WithCallback){

		var pvm = this;
		animation1WithCallback(pvm,function(){

			

            var size = pvm.getCanvasSize();
            var identifier = pvm.getCanvasIdentifier();

            var product = _.find(pvm.products, function(o) {
            	return o.identifier === identifier
            	&& o.size === size;
            }); 
            var dimension = product.renderDimension;
            

            var urlPart = "/"+identifier+"/"+dimension+"-"+size+"-";        
                  
       	    d3.select("#current").selectAll("image").each( function(d, i){
              var newUrl = d3.select(this).attr("xlink:href").replace(/\/\w+\/\d+x\d+-\w-/,urlPart);
              d3.select(this).attr("xlink:href",newUrl);
            });


            //catch the load event!
            pvm.imageCount = d3.selectAll("#current > image").size();
            var poll = setInterval(function(){
            	console.log(console.log( pvm.imageCount));
                if(pvm.imageCount === pvm.counter){
                       
                       animation2WithCallback();
                       clearInterval(poll);
                }

            },20);
    	});

     

	}
	setCanvasSize(animation1WithCallback,animation2WithCallback){
	    
	    var pvm = this;

	    animation1WithCallback(pvm,function(){

	

            var size = pvm.getCanvasSize();
            var identifier = pvm.getCanvasIdentifier();

            var product = _.find(pvm.products, function(o) {
            	return o.identifier === identifier
            	&& o.size === size;
            }); 
            var dimension = product.renderDimension;
 
            var urlPart = dimension+"-"+size+"-";          
                  
       	    d3.select("#current").selectAll("image").each( function(d, i){
	        
	          var newUrl = d3.select(this).attr("xlink:href").replace(/\d+x\d+-\w-/,urlPart);
	          d3.select(this).attr("xlink:href",newUrl);
	        });


            //catch the load event!
            pvm.imageCount = d3.selectAll("#current > image").size();
            var poll = setInterval(function(){
                if(pvm.imageCount === pvm.counter){


                       animation2WithCallback();
                       clearInterval(poll);
                }

            },20);
    	});


	}

}

