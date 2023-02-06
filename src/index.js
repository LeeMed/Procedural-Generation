// const c = require("./colors.js");
// const M = require("./main.js")
const RF = require("./RegularFunc");
const PF = require("./polygoneFunctions");
// const ST = require("./special_tilings.js")
const applyImgBis = RF.applyImgBis;

let h = 200;
let w = 200;

document.getElementById("square").onclick = get_square;
document.getElementById("triangle").onclick = get_triangle;
document.getElementById("hex").onclick = get_hex;
document.getElementById("all").onclick = get_all;


function make(hex){
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  let R= parseInt(result[1], 16);
  let G= parseInt(result[2], 16);
  let B= parseInt(result[3], 16);
  return [R,G,B,255];
}

function get_square()
{
  let size = parseInt(document.getElementById("nbr").value);
  let hex=document.getElementById("favcolor").value;
  let hex1=document.getElementById("favcolor1").value;
  let color=make(hex);
  let color1=make(hex1);

  const width = 200, height = 200;
  let canvas = document.getElementById('squarecanvas');
  canvas.width = width; canvas.height = height;
  let context = canvas.getContext("2d");
  let image = context.createImageData(width, height);
  let imageStructure={img:image, h:height, w:width};
  let colorArray = [color,color1];
  applyImgBis(imageStructure,colorArray,PF.squareTilingCondition1(4,size,h,w),PF.squareTilingCondition2(4,size,h,w));// square
  context.putImageData(imageStructure.img,0,0);
}

function get_triangle()
{
  let size = parseInt(document.getElementById("size_t").value);
  let hex=document.getElementById("favcolor").value;
  let hex1=document.getElementById("favcolor1").value;
  let color=make(hex);
  let color1=make(hex1);

  const width = 200, height = 200;
  let canvas = document.getElementById('trianglecanvas');
  canvas.width = width; canvas.height = height;
  let context = canvas.getContext("2d");
  let image = context.createImageData(width, height);
  let imageStructure={img:image, h:height, w:width};
  let colorArray = [color,color1];
  applyImgBis(imageStructure,colorArray,PF.triangleTilingCondition1(3,size,h,w),PF.triangleTilingCondition2(3,size,h,w));//triangle//problème d'approx
  context.putImageData(imageStructure.img,0,0);
}

function get_hex()
{
  let size = parseInt(document.getElementById("size_hex").value);
  let hex=document.getElementById("favcolor").value;
  let hex1=document.getElementById("favcolor1").value;
  let hex2=document.getElementById("favcolor2").value;

  let color=make(hex);
  let color1=make(hex1);
  let color2=make(hex2);

  const width = 200, height = 200;
  let canvas = document.getElementById('hexcanvas');
  canvas.width = width; canvas.height = height;
  let context = canvas.getContext("2d");
  let image = context.createImageData(width, height);
  let imageStructure={img:image, h:height, w:width};
  let colorArray2 = [color,color1,color2];
  applyImgBis(imageStructure,colorArray2,PF.hexagoneTilingCondition1(6,size,h,w),PF.hexagoneTilingCondition2(6,size,h,w),PF.hexagoneTilingCondition3(6,size,h,w));// hexagone
  context.putImageData(imageStructure.img,0,0);
}


function get_all()
{
  let x_s = parseInt(document.getElementById("start").value);
  let y_s = parseInt(document.getElementById("end").value);
  let x_j = parseInt(document.getElementById("xjump").value);
  let y_j = parseInt(document.getElementById("yjump").value);
  let number_of_vertices = parseInt(document.getElementById("number_of_sides").value);
  let size = parseInt(document.getElementById("size_hex").value);
  let rot = parseInt(document.getElementById("rot").value);

  let x_s1 = parseInt(document.getElementById("start1").value);
  let y_s1 = parseInt(document.getElementById("end1").value);
  let x_j1 = parseInt(document.getElementById("xjump1").value);
  let y_j1 = parseInt(document.getElementById("yjump1").value);
  let number_of_vertices1 = parseInt(document.getElementById("number_of_sides1").value);
  let rot1 = parseInt(document.getElementById("rot1").value);




  let hex=document.getElementById("favcolor").value;
  let hex1=document.getElementById("favcolor1").value;

  let color=make(hex);
  let color1=make(hex1);

  const width = 200, height = 200;
  let canvas = document.getElementById('freecanvas');
  canvas.width = width; canvas.height = height;
  let context = canvas.getContext("2d");
  let image = context.createImageData(width, height);
  let imageStructure={img:image, h:height, w:width};
  let colorArray = [color,color1];
  applyImgBis(imageStructure,colorArray,PF.polygoneDrawingPattern(number_of_vertices,size,h,w,x_s,y_s,x_j,y_j,rot),PF.polygoneDrawingPattern(number_of_vertices1,size,h,w,x_s1,y_s1,x_j1,y_j1,rot1));//general drawing pattern

  // applyImgBis(imageStructure,colorArray2,PF.hexagoneTilingCondition1(6,size,h,w),PF.hexagoneTilingCondition2(6,size,h,w),PF.hexagoneTilingCondition3(6,size,h,w));// hexagone
  context.putImageData(imageStructure.img,0,0);
}
