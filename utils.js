var squareBoxSize = parseInt(d3.select("svg").attr('viewBox').split(" ")[2]);

/*********************Multiplier Convertor******************/

// function getCanvasInfo(squareBoxSize,multipliers){
//     let canvasWidth = Math.ceil(squareBoxSize * multipliers.designWidthMultiplier);
//     let canvasHeight = Math.ceil(squareBoxSize * multipliers.designHeightMultiplier);
//     let canvasX = Math.ceil(squareBoxSize * multipliers.designXMultiplier);
//     let canvasY = Math.ceil(squareBoxSize * multipliers.designYMultiplier);
//     return {
//         "x" :canvasX,
//         "y" :canvasY,
//         "width" :canvasWidth,
//         "height":canvasHeight
//     }
// }

/*********************DATA MAPPING METHOD******************/

function multiplierToPixels(data,squareBoxSize) {
// console.log(data);
data.designWidth = Math.ceil(data.designWidthMultiplier * squareBoxSize);
delete data.designWidthMultiplier
data.designHeight = Math.ceil(data.designHeightMultiplier * squareBoxSize);
delete data.designHeightMultiplier
data.designX = Math.ceil(data.designXMultiplier * squareBoxSize);
delete data.designXMultiplier
data.designY = Math.ceil(data.designYMultiplier * squareBoxSize);
delete data.designYMultiplier
// console.log(data);
return data;

}

function dbToClientTranslator(data,squareBoxSize){

var mapperObject = {
    "MultiSet212":"MultiSet212",
    "MultiSet313":"MultiSet313",
    "MultiSet122":"MultiSet122",
    "MultiSet133":"MultiSet133",
    "MultiSet595":"MultiSet595",
    "MultiSet311":"MultiSet311",
    "Horizontal":"Horizontal32",
    "Panorama21":"Horizontal21",
    "Panorama31":"Horizontal31",
    "Vertical":"Vertical23",
    "Vertica12":"Vertical12",
    "Vertica13":"Vertical13",
    "Square":"Square",
    "MultiSet411":"MultiSet411",
    "MultiSet321":"MultiSet321",
    "MultiSet331":"MultiSet331",
    "MultiSet221":"MultiSet221"
}
var identifier = mapperObject[data.printLayout];
var dimension = data.width.toString()+" x "+data.height.toString(); 
console.log(dimension,identifier,data.frameColor)
var product=
_.find(products, function(o) { return o.identifier === identifier 
&& o.color === data.frameColor
&& o.dimension === dimension; });

product = multiplierToPixels(product,squareBoxSize);

return product;

}
const exampleData = {

printLayout:"Vertical",
frameColor:"NoFrame",
width:60,
height:90

}
var result = dbToClientTranslator(exampleData,squareBoxSize);
// console.log(result);



/************************/
var thisProduct;
function testRect(identifier,size,squareBoxSize){

var product =_.find(products, function(o) { return o.identifier === identifier 
&& o.size === size;});
// console.log(product)
thisProduct =_.clone(product, true);
thisProduct =multiplierToPixels(thisProduct,squareBoxSize);




d3.select("#myClip").selectAll('rect').remove();
var rectangle = d3.select("#myClip")
.append("rect")

// .attr("fill", "#0055aa")
// .attr("opacity", "0.6")
.attr("x", thisProduct.designX)
.attr("y", thisProduct.designY)
.attr("width", thisProduct.designWidth)
.attr("height", thisProduct.designHeight)
// .attr("style", "mix-blend-mode:multiply;")
;
d3.select('#content')
.attr("width", thisProduct.designWidth)
.attr("height", thisProduct.designHeight);
return thisProduct;
}
