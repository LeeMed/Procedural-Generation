const RF = require("./RegularFunc.js");

const fs = require('fs');



const specialcolors = [
  { name: "red", red: 255, green: 0,blue:0 },
  { name: "color2", red: 255, green: 221,blue:126 },
  { name: "color3", red: 254, green: 208,blue:108 },
  { name: "color4",red: 8, green: 65,blue:130},
  { name: "color5", red: 253, green: 138,blue:59 },
  { name: "color6",red: 232, green: 246,blue:226},
  { name: "color7",red: 211, green: 14,blue:32},
  { name: "color8",red: 152, green: 215,blue:187 },
  { name: "color9", red: 253, green: 128,blue:56 },
  { name: "color10", red: 130, green: 0,blue:38},
  { name: "color11", red: 223, green: 243,blue:218 },
  { name: "color12",red: 8, green: 76,blue:143 },
  { name: "color13", red: 253, green: 88,blue:45},
  { name: "color14", red: 185, green: 228,blue:189 },
  { name: "color15",red: 255, green: 234,blue:144 },
  { name: "color16", red: 226, green: 25,blue:28},
  { name: "color17", red: 254, green: 157,blue: 67},
  { name: "color18",red: 23, green: 120,blue:180},
  { name: "color19", red: 66, green: 166,blue:204 },
  { name: "color20", red: 255, green: 242,blue:172},
  { name: "color21", red: 253, green: 92,blue:46},
  { name: "color22", red: 244, green: 251,blue:237},
  { name: "color23", red: 130, green: 0,blue:38},
  { name: "gold", red: 255, green: 215,blue:128},
];

function getValueFromName2(color){
  const results = specialcolors.filter((c)=>c.name === color);
  let output = [results[0].red,results[0].green,results[0].blue,255 ];
  return output;
}


function fillPixel2(x,y,color,image)
{
  image.data[ 4*x + y*image.width*4 ] = 0;
  image.data[ 4*x + y*image.width*4 + 1 ] = 0;
  image.data[ 4*x + y*image.width*4 + 2 ] = 0;
  image.data[ 4*x + y*image.width*4 + 3 ] = color[1];
}

function minimalDistance2(x,y,L,k){
  let S= (L.map(elt => [ Math.sqrt( (x-elt[0])**2 + (y-elt[1])**2)  , elt[2] ]) );
  let min = S[0][0];
  for(let k=1;k<S.length;k++){
    if(S[k][0]<=min){
	min=S[k][0];
    }

  }
  return 255-k*min;
}


function minimalDistance(x,y,L){
  let S= (L.map(elt => [ Math.sqrt( (x-elt[0])**2 + (y-elt[1])**2)  , elt[2] ]) );
  let min = S[0][0];
  let mindex = 0;
  for(let k=1;k<S.length;k++){
    if(S[k][0]<=min){
	min=S[k][0];
      mindex=k;
    }

  }
  return S[mindex][1];
}

function createZoneRand(height,width){
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  return ([random(0,height),random(0,width),specialcolors[Math.floor(Math.random()*specialcolors.length)].name ]);
}




function Voronoi(l,m,nbr){
  const T=[];
  for(let k =0;k<nbr;k++){
      T[k]=createZoneRand(l,m);
  }

    const width = l, height = m;
     const [image,canvas,context] = RF.initCanvas(height,width);
 /* let canvas = document.getElementById('gener');
  canvas.width = width; canvas.height = height;
  let context = canvas.getContext("2d");
  let image = context.createImageData(width, height);*/

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < 4*canvas.width; x+=1) {

      RF.fillPixel(x,y,getValueFromName2(minimalDistance(x,y,T)),image);


    }
  }
  let imageStructure= {img:image,w:canvas.width,h:canvas.height};

 RF.show(imageStructure,canvas,context,fs,'Vor');
 // context.putImageData(image, 0, 0);
}

function Voronoiblack(l,m,nbr){
  const T=[];
  for(let k =0;k<nbr;k++){
      T[k]=createZoneRand(l,m);
  }

    const width = l, height = m;
      const [image,canvas,context] = RF.initCanvas(height,width);
/*  let canvas = document.getElementById('gener');
  canvas.width = width; canvas.height = height;
  let context = canvas.getContext("2d");
  let image = context.createImageData(width, height);*/



  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < 4*canvas.width; x+=1) {

      fillPixel2(x,y,getValueFromName2(minimalDistance(x,y,T)),image);


    }
  }
  let imageStructure= {img:image,w:canvas.width,h:canvas.height};
 RF.show(imageStructure,canvas,context,fs,'Vorb');
  context.putImageData(image, 0, 0);
}

function Noise(height,width,color,s,nbr){
  const T=[];
  for(let k =0;k<nbr;k++){
      T[k]=createZoneRand(height,height);
  }
  const [image,canvas,context] = RF.initCanvas(height,width);//width and height
  for (let y = 0; y < canvas.height; y++) {
    for (let x =0 ; x < 4*canvas.width; x+=1) {

      RF.fillPixel(x,y,[color[0]*minimalDistance2(x,y,T,s)/255,color[1]*minimalDistance2(x,y,T,s)/255,color[2]*minimalDistance2(x,y,T,s)/255,255],image);


    }

  }
  let imageStructure= {img:image,w:canvas.width,h:canvas.height};
    RF.show(imageStructure,canvas,context,fs,'Noise');


}

/////////////////////://
function interpolate(a0,a1,w){
  return (a1 - a0)*smooth(w) +w ;
}

function randomGradient(ix,iy){
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    let theta = random(0,(ix+iy)*Math.PI) ;
  return [Math.cos(theta),Math.sin(theta)];
}

function dotGridGradient(ix,iy,x,y){
  let gradient = randomGradient(ix,iy);
  let dx = x -ix;
  let dy = y -iy;
  return (dx*gradient[0] +dy*gradient[1]);
}


function smooth(x){
    return 6*x**5 -15*x**4 + 10*x**3;
}
function perlin(x,y){
  let x0=x;
  let x1 = x0+1 ;
  let y0 = y;
  let y1=y0 +1;

  let sx = x ;
  let sy = y;

  let n0 = dotGridGradient(x0,y0,x,y);
  let n1 = dotGridGradient(x1,y0,x,y);
  let ix0 = interpolate(n0,n1,sx);

  n0 = dotGridGradient(x0,y1,x,y);
  n1 = dotGridGradient(x1,y1,x,y);
  let ix1 = interpolate(n0,n1,sx);

  let value = interpolate(ix0,ix1,sy);
  return value ;
}


function Noise1(height,width){


  const [image,canvas,context] = RF.initCanvas(height,width);//width and height


  for (let y = 0; y < canvas.height; y++) {

    for (let x =0 ; x < 4*canvas.width; x+=1) {
      let r = perlin(x,y);
      RF.fillPixel(x,y,[0,255*r/255,100,255],image);



    }

  }
  let imageStructure= {img:image,w:canvas.width,h:canvas.height};
    RF.show(imageStructure,canvas,context,fs,'Noise1');


}

function Noise2(height,width){
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  

  const [image,canvas,context] = RF.initCanvas(height,width);//width and height

  let y0 = 0;
  for (let y = 0; y < canvas.height; y++) {
    let x0 =  0;
    for (let x =0 ; x < 4*canvas.width; x+=1) {

	let r = random(0,x0 +y0);
      RF.fillPixel(x,y,[0,255*r/255,100,255],image);
      x0 = x0 + 1;




    }
    y0 =y0 + 1;
  }
  let imageStructure= {img:image,w:canvas.width,h:canvas.height};
    RF.show(imageStructure,canvas,context,fs,'Noise2');

}

exports.Voronoi = Voronoi;
exports.Voronoiblack = Voronoiblack;
exports.Noise = Noise;
exports.Noise1 = Noise1;
exports.Noise2 = Noise2;
// Execute like that
// Voronoi(400,400,100);
// Voronoiblack(400,400,100);
// Noise(400,400,[255,0,0,0],2,100);
// Noise1(400,400);
// Noise2(400,400);
