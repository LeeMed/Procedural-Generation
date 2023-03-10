const colors = [
  { name: "red", red: 255, green: 0,blue:0 },
  { name: "deepPink", red: 255, green: 20,blue:147 },
  { name: "orchid", red: 218, green: 112,blue:214 },
  { name: "darkStateBlue",red: 72, green: 61,blue:139},
  { name: "forestGreen", red: 34, green: 139,blue:34 },
  { name: "cyan",red: 0, green: 255,blue:255},
  { name: "lightBlue",red: 173, green: 216,blue:230},
  { name: "midnightBlue",red: 25, green: 25,blue:112 },
  { name: "white", red: 255, green: 255,blue:255 },
  { name: "lightGray", red: 211, green: 211,blue:211},
  { name: "fireBrick", red: 178, green: 34,blue:34 },
  { name: "darkOrange",red: 255, green: 145,blue:0 },
  { name: "darkKhaki", red: 189, green: 183,blue:107},
  { name: "fuchsia", red: 255, green: 0,blue:255 },
  { name: "lightGreen",red: 144, green: 238,blue:144 },
  { name: "green", red: 0, green: 128,blue:0},
  { name: "black", red: 0, green: 0,blue:0},
  { name: "blue", red: 0, green: 0,blue: 255},
  { name: "Lime",red: 0, green: 255,blue:0},
  { name: "yellow", red: 255, green: 255,blue:0 },
  { name: "slateGrey", red: 112, green: 128,blue:144},
  { name: "chocolate", red: 210, green: 105,blue:30},
  { name: "orange", red: 255, green: 165,blue:0},
  { name: "purple", red: 128, green: 0,blue:128},
  { name: "olive", red: 128, green: 128,blue:0  },
  { name: "beige", red: 245, green: 245,blue:220 },
  { name: "gold", red: 255, green: 215,blue:128},
  { name: "silver", red: 192, green: 192,blue:192},
  { name: "brown", red: 165, green: 42,blue:42 },
  { name: "pink", red: 255, green: 192,blue:203 },
  { name: "tomato", red: 255, green: 99,blue:71 },
];


function getValueFromName(color){
  const results = colors.filter((c)=>c.name === color);
  let output = [results[0].red,results[0].green,results[0].blue,255 ];
  return output;
}

function initCanvas(width,height){
  const { createCanvas, createImageData } = require('canvas');
  let canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  let image = createImageData(width, height);
  return [image,canvas,context];

}

function show(imageStructure,canvas,context,fs,fileName){
  context.putImageData(imageStructure.img, 0, 0);
  let buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(fileName+'.png', buffer);
}



function fillPixel(x,y,color,image)
{
  image.data[ 4*x + y*image.width*4 ] = color[0];
  image.data[ 4*x + y*image.width*4 + 1 ] = color[1];
  image.data[ 4*x + y*image.width*4 + 2 ] = color[2];
  image.data[ 4*x + y*image.width*4 + 3 ] = 255;
}

function applyImg(color1,color2,regWidth,canvas,imageStructure,f){

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x+=1) {
      //
      f(x,y,color1,color2,regWidth,canvas,imageStructure.img);
    }

  }
}
/*Takes as input:
Number :x,y
f(x,y)=> Boolean
returns true if all the functions given are True
False Otherwise
*/
function sumConditions(x,y,...f){
  if (f.length >0){
    return f.reduce((acc,elem)=>acc || elem(x,y),f[0](x,y));
  }else{
    return false;
  }
}

/*
input :
imageStructure : imageStructure
colorArray : array<Colors>
array arrays of f(x,y) => Boolean;[[f1,f2,f3],[f4,f5,f6]]
function that goes threw every pixel of the image and if one of the
functions given as an input is satsfied, colors the pixel in the color
 of the array colorArray with same index as the index in the function array that
 was true
*/
function applyImgBis(imageStructure,colorArray,...f){//[[f1,f2,f3],[f4,f5,f6]];
  //f1: x,y -> True, False

  if (colorArray.length !== f.length){
    console.log("warning f and coloraArray have to be the same length");
  }

  for (let y = 0; y < imageStructure.h; y++) {
    for (let x = 0; x < imageStructure.w; x++) {
      f.forEach((item, i) => {

        if(sumConditions(x,y,...item)){

          fillPixel(x,y,colorArray[i],imageStructure.img);
        }
      });
      if(x===0){fillPixel(x,y,[100,100,0,255],imageStructure.img);}
      if(y===0){fillPixel(x,y,[0,100,100,255],imageStructure.img);}
      if(x===50 && y === 50){fillPixel(x,y,[0,0,100,255],imageStructure.img);}
    }
  }
}






//return a value correspounding to the position of the pixel in the image
//0 fot top left corner; 1 for top; 2 for top right corner
//3 for left; 4 for center; 5 for right etc
//to change for a size higher than 3 maybe put size ?? la place de -1 et le mettre dans la fonction
function position(x,y,height,width){
  if(x ===0 && y=== 0)
    return 0;
  else if(x===0 && y === 4*width-1){
    return 2;
  }
  else if(x === 0){
    return 1;
  }
  else if(y=== 0 && x=== 4*width-1){
    return 6;
  }
  else if(y===4*height-1 && x===4*width-1){
    return 8;
  }
  else if( y===0){
    return 3;
  }
  else if(y===4*width-1){
    return 5;
  }
  else if(x===4*height-1){
    return 7;
  }
  else
  return 4;
}




exports.position = position;
exports.colors = colors;
exports.getValueFromName = getValueFromName;
exports.initCanvas = initCanvas;
exports.show = show;
exports.applyImgBis = applyImgBis;
exports.applyImg = applyImg;
exports.fillPixel  = fillPixel;
//exports.printImage = printImage;
//exports.printTheImage = printTheImage;
