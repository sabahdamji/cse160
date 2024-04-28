// ColoredPoints.js
// Vertex shader program
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;' +
    'uniform mat4 u_ModelMatrix;' +
    'uniform mat4 u_GlobalRotateMatrix;' +
    'void main() {' +
    '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;' + 
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
let u_ModelMatrix;
let u_GlobalRotateMatrix;

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

    gl.enable(gl.DEPTH_TEST);
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

// Get the storage location of u_ModelMatrix variable
    u_ModelMatrix= gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix){
        console.log("failed to get the storage location of u_ModelMatrix");
        return;
    }

    // Get the storage location of u_GlobalRotateMatrix variable
    u_GlobalRotateMatrix= gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix){
        console.log("failed to get the storage location of u_GlobalRotateMatrix");
        return;
    }

    //set an initial value for the matric to identify
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
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
let g_globalAngle = 0;
let g_headAngle = 0;
let g_tailAngle = 0;
let g_headAnimation = false;
let g_tailAnimation = false;



//Set up actions for the HTML UI Elements
function addActionsForHtmlUI(){
    //button events (shape type)
    document.getElementById('animationDogOffButton').onclick = function() {g_tailAnimation=false;};
    document.getElementById('animationDogOnButton').onclick = function() {g_tailAnimation=true;};
    

    //size slider events
    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes();});
    document.getElementById('headSlide').addEventListener('mousemove', function() {g_headAngle = this.value; renderAllShapes();});
    document.getElementById('tailSlide').addEventListener('mousemove', function() {g_tailAngle = this.value; renderAllShapes();});
}

// function drawTree() {

//     const tree = new Tree();
//     tree.render(); 
// }


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
    //gl.clear(gl.COLOR_BUFFER_BIT);
    //renderAllShapes();
    requestAnimationFrame(tick);
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

function tick() {
    g_seconds=performance.now()/1000.0-g_startTime;
    if (g_tailAnimation) {
        g_tailAngle = Math.sin(g_seconds) * 45; 
    }
    updateAnimationAngles();
    renderAllShapes();
    requestAnimationFrame(tick);
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

function updateAnimationAngles(){
    if(g_tailAnimation){
        g_tailAngle = (45*Math.sin(g_seconds));
    }
}

//Draw every shape that is supposed to be in the canvas
function renderAllShapes(){
    var startTime = performance.now();
    // Clear <canvas>

    //pass matrix
    var globalRotMAt = new Matrix4().rotate(g_globalAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMAt.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT );

    var len = g_shapesList.length;

    //draw a test triangle
    //drawTriangle3D([-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0]);
    
    //draw a cube
    var body = new Cube();
    body.color = [0.6, 0.4, 0.2, 1.0]; 
    body.matrix.translate(-0.25, -0.25, 0.0); 
    body.matrix.rotate(-5,1,0, 0);
    body.matrix.scale(0.5,.3, .5); 
    body.render();


    var head = new Cube();
    head.color = [0.3, 0.15, 0.05, 1.0]; 
    head.matrix.translate(-0.65, -0.25, 0.0); 
    head.matrix.rotate(-g_headAngle,1,0, 0);
    head.matrix.scale(0.4,.4, .4); 
    head.render();


    var ear1 = new Cube();
    ear1.color = [0.6, 0.4, 0.2, 1.0]; 
    ear1.matrix.translate(-0.3, 0.15, 0.15); 
    ear1.matrix.rotate(-g_headAngle, 0, 1, 0); 
    ear1.matrix.scale(0.1, 0.1, 0.1); 
    ear1.render();

    var ear2 = new Cube();
    ear2.color = [0.6, 0.4, 0.2, 1.0];
    ear2.matrix.translate(-0.3, 0.15, -0.15); 
    ear2.matrix.rotate(-g_headAngle, 0, 1, 0); 
    ear2.matrix.scale(0.1, 0.1, 0.1); 
    ear2.render();

    var legPositions = [
        [-0.35, -0.55, 0.25], //front left leg
        [-0.35, -0.55, -0.25], //front right leg
        [0.05, -0.55, 0.25], //back left leg
        [0.05, -0.55, -0.25] //back right leg
    ];

    for (var i = 0; i < legPositions.length; i++) {
        var leg = new Cube();
        leg.color = [0.6, 0.4, 0.2, 1.0]; 
        leg.matrix.translate(legPositions[i][0], legPositions[i][1], legPositions[i][2]); 
        leg.matrix.scale(0.1, 0.2, 0.1); 
        leg.render();
    }

    var tail = new Cube();
    tail.color = [0.3, 0.15, 0.05, 1.0]; 
    tail.matrix.translate(0.25, -0.2, 0.0); 
    tail.matrix.scale(0.1, 0.1, 0.4); 
    tail.render();
   
    var tailExtender = new Cube();
    tailExtender.color = [0.6, 0.4, 0.2, 1.0]; 
    tailExtender.matrix.translate(0.35, -0.2, 0.0); 
    tailExtender.matrix.rotate(-g_tailAngle, 0, 1, 0);
    tailExtender.matrix.scale(0.2, 0.1, 0.0); 
    tailExtender.render();

    //check the time at the end of the function, and show on web page
    var duration = performance.now() - startTime;
    sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
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