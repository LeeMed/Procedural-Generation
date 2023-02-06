/*Function that takes as an input:
Number : number_vertex
Number : radius
returns:
a Function representing the conditions being true when at the pixels where the
polygone is depicted
*/
function polyFactory(number_vertex,radius){
  function poly(x,y){
    let arr = [];
    (arr).length = number_vertex*2;// because x,y
    arr.fill(0.0);
    let new_array = arr.map(
      function(value,index){
        if(index%2===0){//les x
          let i = Math.floor(index/2);
          return Math.floor(x+((Math.sin((i*(2*Math.PI))/number_vertex))*radius));//convention floor choisie
        }
        else{//les y
          let i = Math.floor(index/2);
          return Math.floor(y +((Math.cos((i*(2*Math.PI))/number_vertex))*radius));
        }
      }
    );
    return new_array;
  }
  return poly;
}

function distance(x1,y1,x2,y2){
  return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
}
/*function that returns the angle formed by the point above the barycenter(xB,yB)
and the point x,y, both on the circle who's center is the barycenter
circonsrit in english ?
*/
function findAngleToY(x,y,xB,yB){
  if(distance(x,y,xB,yB)===0){
    return 0;
  }
  return (Math.sin((x-xB)/distance(x,y,xB,yB)))>0? Math.acos((yB-y)/distance(x,y,xB,yB)) :-(Math.acos((yB-y)/distance(x,y,xB,yB)));
}
/*Function that takes as an input
Number : point_array,angle,xb,yb
point_array = [x1,y1,x2,y2];
and returns the point_array rotate with an angle angle
with regards to xB, yB*/
function rotate(point_array,angle,xB,yB){
  //We use a rotation matrix
  // console.log(point_array);
  for (let i = 0; i < point_array.length; i+=2){
    let xR = point_array[i]-xB;
    let yR = point_array[i+1]-yB;
    point_array[i] = Math.floor(xB + Math.cos(angle)*xR - Math.sin(angle)*yR);
    point_array[i+1] = Math.floor(yB + Math.sin(angle)*xR + Math.cos(angle)*yR);
  }
  return point_array;
}

/*returns equation of the line */
function line(x1,y1,x2,y2){
  if(x1 === x2){//case where the line is being draww verticallly
    return ()=>x2;
  }
  let slope = (y2-y1)/(x2 - x1);//added a negativ slope because reversed abscisse ?

  return (x)=>Math.floor(slope*(x-x1)+y1);//round ?
}


/*function that takes as an input:
Number x1,y1,x2,y2,xB,yB
returns: a  function that returns true if
x it is on the same side of the lines the
given point(xb,yb) */
function permittedZoneSegment(x1,y1,x2,y2,xB,yB){
  //vertical case
  if(x1 === x2){
    let permittedZoneIsLeft = xB < x1;
    if(permittedZoneIsLeft){
      return (x) => x < x1;
    }
    return (x) => x > x1;
  }
  //other cases
  else{
    let permittedZoneIsAbove;
    permittedZoneIsAbove = yB < line(x1,y1,x2,y2)(xB);//because axes is upside down
    if(permittedZoneIsAbove){
      return (x,y)=>  y < line(x1,y1,x2,y2)(x);
    }
    return (x,y)=>  y > line(x1,y1,x2,y2)(x);
  }
}



/*Function that takes as in input
Number array :point_array
Number : xb,yb
and return the function array representing the condition for each pair
of vertexes (the vertexes composing the polygone) if the point given to the said function
is on the "right" side of the line created by those two vertexes.
In the end it creates an function array that if they are all true when given the same pixel
it means that pixel the is inside the polygone */
 function borderConditonGernerator(point_array,xB,yB){
   let bool_arr =[];
  (bool_arr).length = Math.round((point_array.length)/2)-1;//specilaised for square
  bool_arr.fill(false);
  bool_arr = bool_arr.map((element,i)=>(permittedZoneSegment(point_array[i*2], point_array[(i*2)+1], point_array[(i*2)+2], point_array[(i*2)+3],xB,yB)));
  bool_arr = bool_arr.concat( permittedZoneSegment(point_array[point_array.length-2],point_array[point_array.length-1],point_array[0],point_array[1],xB,yB) );
  return bool_arr;
}
/*input:function array :funct_array
returns a function that is the concatenation of the function array given
but specilised for the value x,y
*/
function closePolygone(bool_arr){
  function isInsidePoly(x,y){
    //and for the segment beetween the last and first element
    return bool_arr.reduce((acc,elmt)=>acc && elmt(x,y),true);
  }
  return isInsidePoly;
}


/*Takes as input x,y and returns a function that returns True if
the input is inside the polygone OLD UNOPTIMISED VERSION
WE KEEP IT HERE FOR POSTERITY */

// function closePolygone(point_array,xB,yB){
//
//   function isInsidePoly(x,y){
//     let bool_arr =[];
//     (bool_arr).length = Math.round((point_array.length)/2)-1;//specilaised for square
//     bool_arr.fill(false);
//     bool_arr = bool_arr.map((element,i)=>(permittedZoneSegment(point_array[i*2], point_array[(i*2)+1], point_array[(i*2)+2], point_array[(i*2)+3],xB,yB)(x,y)));
//     //and for the segment beetween the last and first element
//     bool_arr = bool_arr.concat( permittedZoneSegment(point_array[point_array.length-2],point_array[point_array.length-1],point_array[0],point_array[1],xB,yB)(x,y) )
//     return bool_arr.reduce((acc,elmt)=>acc && elmt,true);
//   }
//   return isInsidePoly;
// }

/*input:
Number: number_vertices,size,h,w,x_s=0,y_s=0,x_j=size,y_j=size,rot=0

return the function array representing the conditions needing to be true for
a pixel to be drawn.

Does that in order to represent a tiling of polygones with caractestics given as input

the spread beetween the tiles, and their starting positions can also be set

those need to be carfully computed by hand, this is the cost of genericity

We haven'nt been able to do otherwise.
*/

function polygoneDrawingPattern(number_vertices,size,h,w,x_s=0,y_s=0,x_j=size,y_j=size,rot=0){
  let a  = [];
  let poly = polyFactory(number_vertices,size);
  for(let y = y_s; y < h+size; y +=y_j ){//on ajoute size pour qeu ça aille jusqu'au bord
    for(let x = x_s; x < w+size; x +=x_j ){
      let bool_array = borderConditonGernerator(rotate(poly(x,y),rot,x,y),x,y);
      a = a.concat(closePolygone(bool_array));
    }
  }
  return a;
}

/* function that returns an array containing the functions modeling the conditions
necessarry to draw a square tiling*/
function squareTilingCondition(number_vertices,size,h,w){
  let cst = Math.floor(Math.sqrt(2)/2*size);
  return polygoneDrawingPattern(number_vertices,size,h,w,cst,cst,cst*2 + 1,cst*2 + 1);
}

function squareTilingCondition1(number_vertices,size,h,w){
  let a  = [];
  let cst = Math.floor((Math.sqrt(2)/2)*size);
  console.log("function over");
  a = a.concat(polygoneDrawingPattern(4,size,h,w,cst,cst,cst*4,cst*4,Math.PI/4));
  a = a.concat(polygoneDrawingPattern(4,size,h,w,cst*3,cst*3,cst*4,cst*4,Math.PI/4));

  return a;
}
function squareTilingCondition2(number_vertices,size,h,w){
  let a  = [];
  let cst = Math.floor((Math.sqrt(2)/2)*size);
  a = a.concat(polygoneDrawingPattern(4,size,h,w,cst*3,cst,cst*4,cst*4,Math.PI/4));
  a = a.concat(polygoneDrawingPattern(4,size,h,w,cst,cst*3,cst*4,cst*4,Math.PI/4));
  return a;
}


function triangleTilingCondition1(number_vertices,size,h,w){
  let a  = [];
  let cst = Math.floor(Math.sqrt(3)*size);
  a = a.concat(polygoneDrawingPattern(3,size,h,w,0,size,cst,size*(6/2),Math.PI));
  a = a.concat(polygoneDrawingPattern(3,size,h,w,cst/2,size*(5/2),cst,size*(6/2),Math.PI));
  return a;
}
function triangleTilingCondition2(number_vertices,size,h,w){
  let a  = [];
  let cst = Math.floor(Math.sqrt(3)*size);
  a = a.concat(polygoneDrawingPattern(3,size,h,w,cst/2,size/2,cst,size*(6/2),0));
  a = a.concat(polygoneDrawingPattern(3,size,h,w,0,size*(4/2),cst,size*(6/2),0));
  return a;
}

function hexagoneTilingCondition1(number_vertices,size,h,w){
  let a  = [];
  let cst = Math.floor((Math.sqrt(3)/2)*size);
  a = a.concat(polygoneDrawingPattern(number_vertices,size,h,w,0,0,3*size,cst*6,Math.PI/2));
  a = a.concat(polygoneDrawingPattern(number_vertices,size,h,w,(3/2)*size,3*cst,3*size,cst*6,Math.PI/2));
  return a;
}
function hexagoneTilingCondition2(number_vertices,size,h,w){
  let a  = [];
  let cst = Math.floor((Math.sqrt(3)/2)*size);
  a = a.concat(polygoneDrawingPattern(number_vertices,size,h,w,size*(3/2),cst,3*size,cst*6,Math.PI/2));
  a = a.concat(polygoneDrawingPattern(number_vertices,size,h,w,0,4*cst,3*size,cst*6,Math.PI/2));
  return a;
}
function hexagoneTilingCondition3(number_vertices,size,h,w){
  let a  = [];
  let cst = Math.floor((Math.sqrt(3)/2)*size);
  a = a.concat(polygoneDrawingPattern(number_vertices,size,h,w,0,cst*2,3*size,cst*6,Math.PI/2));
  a = a.concat(polygoneDrawingPattern(number_vertices,size,h,w,(3/2)*size,5*cst,3*size,cst*6,Math.PI/2));
  return a;
}


function triangleSemiTilingCondition1(number_vertices,size,h,w){
  //we are going to deduce the size of the square to jump thanks to the size
  //of the base of the triangle
  //+Size on the x end condition to draw until the end of the of the tiling
  let a  = [];
  let baseSize = Math.floor(Math.sqrt(3)*size);
  let triangleHeight = Math.floor(size+((1/2)*size));
  a = a.concat(polygoneDrawingPattern(number_vertices,size,h,w,0,size,baseSize,2*baseSize + 2*triangleHeight,Math.PI));
  a = a.concat(polygoneDrawingPattern(number_vertices,size,h,w,baseSize/2,triangleHeight + baseSize+ size,baseSize,2*baseSize + 2*triangleHeight,Math.PI));
  return a;
}
function triangleSemiTilingCondition2(number_vertices,size,h,w){
  //we are going to deduce the size of the square to jump thanks to the size
  //of the base of the triangle
  let a  = [];
  let baseSize = Math.floor(Math.sqrt(3)*size);
  let triangleHeight = Math.floor(size+((1/2)*size));
  a = a.concat(polygoneDrawingPattern(number_vertices,size,h,w,baseSize/2,triangleHeight-size,baseSize,2*baseSize + 2*triangleHeight,0));
  a = a.concat(polygoneDrawingPattern(number_vertices,size,h,w,0,triangleHeight + baseSize+(triangleHeight - size),baseSize,2*baseSize + 2*triangleHeight,0));
  return a;
}
function squareSemiTilingCondition1(number_vertices,size,h,w){
  //we are going to deduce the size of the square to jump thanks to the size
  //of the base of the triangle
  let a  = [];
  let baseSize = Math.floor(Math.sqrt(3)*size);
  let triangleHeight = Math.floor(size+((1/2)*size));
  let squareSize = Math.floor(baseSize*(1/Math.sqrt(2)));
  a = a.concat(polygoneDrawingPattern(number_vertices,squareSize,h,w,baseSize,triangleHeight+(baseSize/2) +1,2* baseSize,2*baseSize + 2*triangleHeight,Math.PI/4));
  a = a.concat(polygoneDrawingPattern(number_vertices,squareSize,h,w,(3/2)*baseSize,(2*triangleHeight + (3/2)*baseSize)+1,2*baseSize,2*baseSize + 2*triangleHeight,Math.PI/4));
  return a;
}

function squareSemiTilingCondition2(number_vertices,size,h,w){
  //we are going to deduce the size of the square to jump thanks to the size
  //of the base of the triangle
  let a  = [];
  let baseSize = Math.floor(Math.sqrt(3)*size);
  let triangleHeight = Math.floor(size+((1/2)*size));
  let squareSize = Math.floor(baseSize*(1/Math.sqrt(2)));
  a = a.concat(polygoneDrawingPattern(number_vertices,squareSize,h,w,0,triangleHeight+(baseSize/2)+1, 2* baseSize,2*baseSize + 2*triangleHeight,Math.PI/4));
  a = a.concat(polygoneDrawingPattern(number_vertices,squareSize,h,w, baseSize/2,(2*triangleHeight + (3/2)*baseSize)+1,2*baseSize,2*baseSize + 2*triangleHeight,Math.PI/4));
  return a;
}


exports.distance = distance;
exports.findAngleToY = findAngleToY;
exports.polyFactory = polyFactory;
exports.squareTilingCondition = squareTilingCondition;
exports.squareTilingCondition1 = squareTilingCondition1;
exports.squareTilingCondition2 = squareTilingCondition2;
exports.triangleTilingCondition1 = triangleTilingCondition1;
exports.triangleTilingCondition2 = triangleTilingCondition2;
exports.hexagoneTilingCondition1 = hexagoneTilingCondition1;
exports.hexagoneTilingCondition2 = hexagoneTilingCondition2;
exports.hexagoneTilingCondition3 = hexagoneTilingCondition3;
exports.triangleSemiTilingCondition1 = triangleSemiTilingCondition1;
exports.triangleSemiTilingCondition2 = triangleSemiTilingCondition2;
exports.squareSemiTilingCondition1 = squareSemiTilingCondition1;
exports.squareSemiTilingCondition2 = squareSemiTilingCondition2;
exports.polygoneDrawingPattern = polygoneDrawingPattern;
