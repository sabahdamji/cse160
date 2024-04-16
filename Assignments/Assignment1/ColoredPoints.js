// ColoredPoints.js
// Vertex shader program
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;' +
    'uniform float u_Size;' +
    'void main() {' +
    '  gl_Position = a_Position;' +
    '  gl_PointSize = u_Size;' +
    '}';
    // Fragment shader program
    var FSHADER_SOURCE =
    'precision mediump float;' +
    'uniform vec4 u_FragColor;' +
    'void main() {' +
    '  gl_FragColor = u_FragColor;' +
    '}';


//Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
    //Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    //Get the rendering context for webGL
    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl){
        console.log("Failed to ger the rendering context for WebGL");
    return;
    }
}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders');
        return;
    }

// Get the storage location of a_Position variable
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0){
        console.log("Failed to get the storage location of a_Position");
        return;
    }

    // Get the storage location of u_FragColor variable
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor){
        console.log("Failed to get the storage location of u_FragColor");
        return;
    }
// Get the storage location of u_Size variable
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size){
        console.log("failed to get the storage location of u_Size");
        return;
    }
}
//Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const TREE = 3;

//Globals related to UI Elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType=POINT;
let g_selectedSegments = 10;


//Set up actions for the HTML UI Elements
function addActionsForHtmlUI(){
    //button events (shape type)
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0];};
    document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0];};
    document.getElementById('clearButton').onclick = function() { g_shapesList=[]; renderAllShapes()};

    document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
    document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
    document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};
    document.getElementById('treeButton').onclick = function() {g_selectedType = TREE; drawTree();};
    

    //slider events
    document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value / 100;});
    document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value / 100;});
    document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value / 100;});

    //size slider events
    document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value;});

    //segment slider events
    //document.getElementById('segmentSlide').addEventListener('input', function() {g_selectedSegments = parseInt(this.value);});
    document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_selectedSegments = this.value;});

}

function drawTree() {

    const tree = new Tree();
    tree.render(); 
}


function main() {

    //set up canvas and gl variables
    setupWebGL();
    //set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    //Set up actona for the HTML UI Elements
    addActionsForHtmlUI();

// Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) {if(ev.buttons == 1) { click(ev) } };

    //specify the color for clearning canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    //clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
}




 var g_shapesList = [];

    //var g_points = []; // The array for a mouse press
    //var g_colors = []; // The array to store the color of a point
    //var g_sizes= [];

function click(ev) {
        //extract the event click and return it in WEBGL coordinates
    let [x,y] = convertCoordinatesEventToGL(ev);


    //Create and store the new point
    let point;
    if (g_selectedType === POINT) {
        point = new Point();
    } else if (g_selectedType === TRIANGLE) {
        point = new Triangle();
    } else if (g_selectedType === CIRCLE) {
        point = new Circle();
    } else if (g_selectedType === TREE) {
        point = new Tree(); 
    }

    point.position= [x,y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);
  

    //draw every shape that is supposed to be on the canvas
    renderAllShapes();
} 

    function convertCoordinatesEventToGL(ev){
        var x = ev.clientX; // x coordinate of a mouse pointer
        var y = ev.clientY; // y coordinate of a mouse pointer
        var rect = ev.target.getBoundingClientRect();

        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

        return ([x,y]);
    }

//Draw every shape that is supposed to be in the canvas
function renderAllShapes(){
    var startTime = performance.now();
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_shapesList.length;

    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }

    //check the time at the end of the function, and show on web page
    var duration = performance.now() - startTime;
    //sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

    //ser the text of the HTML
    function sendTextToHTML(text, htmlID){
        var htmlElm = document.getElementById(htmlID);
        if(!htmlElm){
            console.log("Failed to get " + htmlID + " from HTML");
            return;
        }
        htmlElm.innerHTML = text; 
    }