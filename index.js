var rows = height = window.innerHeight // height
var columns = width = window.innerWidth // width
//const rows = 200 // height
//const columns = 500 // width
var canvas = document.getElementById('grid');
canvas.height = rows
canvas.width = columns
var ctx = canvas.getContext("2d");
var activeColor = '#ffffff';
var inactiveColor = '#000000'
var intervalCode
//var percentLivingCellsAtStart = 0.05
var percentLivingCellsAtStart = 0
var msRefresh = 50
var imageData = new ImageData(columns, rows)
var run = true

var currentBoard = new BitSet(rows * columns);
var nextBoard = new BitSet(rows * columns)

currentBoard.set(0)

for (let x=0; x < columns; x++) {
  for (let y=0; y < rows; y++) {
    if (Math.random() < percentLivingCellsAtStart) currentBoard.set(flattenIndex(x,y))
  }
}

//nextBoard = [...currentBoard]

function flattenIndex(x,y) {
  return ((columns * y) + x)
}

function flattenXYtoImageDataIndex(x,y) {
  return ((columns * y) + x) * 4
}

function drawPixel(i, isAlive) {
  if (isAlive) {
    imageData.data[i + 0] = 255;    // R value
    imageData.data[i + 1] = 255;  // G value
    imageData.data[i + 2] = 255;    // B value
    imageData.data[i + 3] = 255;  // A value
  } else {
    imageData.data[i + 0] = 0;    // R value
    imageData.data[i + 1] = 0;  // G value
    imageData.data[i + 2] = 0;    // B value
    imageData.data[i + 3] = 255;  // A value
  }
}

function setPixel(x,y,isAlive) {
  if(isAlive){
    nextBoard.set(flattenIndex(x, y))
//  nextBoard[y][x] = 0b1
  } else {
    nextBoard.clear(flattenIndex(x, y))
//  nextBoard[y][x] = 0b0
  }
}

function drawBoard () {
  imageData.data.fill(0)
  for (let x=0; x < width; x++) {
    for (let y=0; y < height; y++) {
      if (currentBoard.test(flattenIndex(x, y))) {
        drawPixel(flattenXYtoImageDataIndex(x,y), true)
      } else {
        drawPixel(flattenXYtoImageDataIndex(x,y), false)
      }
    }
  }
  ctx.putImageData(imageData, 0, 0)
}

const subY = (y) => {
  return y === 0 ? height - 1 : y - 1
}

const addY = (y) => {
  return y === height - 1 ? 0 : y + 1
}

const subX = (x) => {
  return x === 0 ? width - 1 : x - 1
}

const addX = (x) => {
  return x === width - 1 ? 0 : x + 1
}

function countNeighbors(y, x) {
  let count = 0
  if (currentBoard.test(flattenIndex( subX(x), subY(y)))) count++ // NW
  if (currentBoard.test(flattenIndex(      x,  subY(y)))) count++ // N
  if (currentBoard.test(flattenIndex( addX(x), subY(y)))) count++ // NE
  if (currentBoard.test(flattenIndex( addX(x),      y)))  count++ // E
  if (currentBoard.test(flattenIndex( addX(x), addY(y)))) count++ // SE
  if (currentBoard.test(flattenIndex(      x,  addY(y)))) count++ // S
  if (currentBoard.test(flattenIndex( subX(x), addY(y)))) count++ // SW
  if (currentBoard.test(flattenIndex( subX(x),      y)))  count++ // W
  return count
}


function advanceGeneration() {
  console.log('hi', currentBoard)
  for (let x=0; x < width; x++) {
    for (let y=0; y < height; y++){
      const currentCellIsAlive = currentBoard.test(flattenIndex(x, y))
      const numberOfLiveNeighbors = countNeighbors(y, x)
      
      if (currentCellIsAlive) {
        if (numberOfLiveNeighbors === 2 || numberOfLiveNeighbors === 3) {
          nextBoard.set(flattenIndex(x, y))
        } else {
//        nextBoard[y][x] = false
        }
      } else {
        if (numberOfLiveNeighbors === 3){
          nextBoard.set(flattenIndex(x, y))
        } else {
//        nextBoard[y][x] = false
        }
      }
    }
  }
  currentBoard.copyBits(nextBoard)
  nextBoard.clearAll()
  
  //    Any live cell with two or three live neighbours survives.
  //    Any dead cell with three live neighbours becomes a live cell.
  //    All other live cells die in the next generation. Similarly, all other dead cells stay dead.
}

function startInterval() {
  if (run) {
    drawBoard()
    advanceGeneration()
    window.requestAnimationFrame(startInterval)
  }
}
 
//canvas.addEventListener('click', function(ev) {
//run = !run
//window.requestAnimationFrame(startInterval)
//});

function fill(x, y, p) {
  // Crosshair with random chance to skip pixel -------
  //for (let ix = 0; ix < columns; ++ix) {
  //  if (Math.random() < p) setPixel(ix, y | 0, true);
  //}
  //for (let iy = 0; iy < rows; ++iy) {
  //  if (Math.random() < p) setPixel(x | 0, iy, true);
  //}
  //-------------------
  
  // Solid crosshair -------------
  for (let ix = 0; ix < columns; ++ix) {
    setPixel(ix, y | 0, true);
  }
  for (let iy = 0; iy < rows; ++iy) {
    setPixel(x | 0, iy, true);
  }
  // ------------------
  
  
  // Localized cells selection ------
  //let ix = x|0;
  //let iy = y|0;
  //setPixel(ix, y-1 | 0, true);
  //setPixel(ix, y-2 | 0, true);
  //setPixel(ix, y+1 | 0, true);
  //setPixel(ix, y+2 | 0, true);
  //
  //setPixel(ix-1, y | 0, true);
  //setPixel(ix-2, y | 0, true);
  //setPixel(ix+1, y | 0, true);
  //setPixel(ix+2, y | 0, true);
  //--------------------------
}

var down = false;
[ [canvas, "mousedown"],
  [canvas, "touchstart"]
].forEach(eh => eh[0].addEventListener(eh[1], e => down = true));
[ [document, "mouseup"],
  [document, "touchend"]
].forEach(eh => eh[0].addEventListener(eh[1], e => down = false));
[ [canvas, "mousemove"],
  [canvas, "touchmove"],
  [canvas, "mousedown"]
].forEach(eh => eh[0].addEventListener(eh[1], e => {
  if (!down) return;
  var loc;
  if (e.touches) {
    if (e.touches.length > 1) return;
    loc = e.touches[0];
  } else {
    loc = e;
  }
  var bcr = canvas.getBoundingClientRect();
  fill((loc.clientX - bcr.left), (loc.clientY - bcr.top), 0.5);
}));

document.addEventListener('keypress', (e) => {
  if (e.key === 'f') {
    var el = document.getElementById('grid');
    
    if(el.webkitRequestFullScreen) {
      el.webkitRequestFullScreen();
    }
    else {
      el.mozRequestFullScreen();
    }     
  } else if (e.key === 'd') {
    run = false
  }
})

window.requestAnimationFrame(startInterval)
