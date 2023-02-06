const fs = require('fs');
const { createCanvas, createImageData } = require('canvas');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}




const width = 500, height = 300;
let canvas = createCanvas(width, height);
let context = canvas.getContext('2d');
let image = createImageData(width, height);
console.log(image);




function bruit_blanc(image, f){  //f est la fréquence
let n = 0; // Index inside the image array
for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++, n += 4) {
        image.data[n]   = 255;
        image.data[n+1] = 255;
        image.data[n+2] = 255;
        image.data[n+3] = getRandomInt(f);//opacité
    }
}
return image;
}





//print_image(bruit_blanc(image, 258));
print_image(bruit_blanc(image, 255));

function print_image(image){
context.putImageData(image, 0, 0);
let buffer = canvas.toBuffer('image/png');
fs.writeFileSync('bruit-blanc.png', buffer);
}
