// ColoredPoints.js
// Vertex shader program
var VSHADER_SOURCE = 
    'precision mediump float;' +
    'attribute vec4 a_Position;' +
    'attribute vec2 a_UV;' +
    'varying vec2 v_UV;' +
    'uniform mat4 u_ModelMatrix;' +
    'uniform mat4 u_GlobalRotateMatrix;' +
    'uniform mat4 u_ViewMatrix;' +
    'uniform mat4 u_ProjectionMatrix;' +
    'void main() {' +
        'gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;' + 
        'v_UV = a_UV;' + 
    '}';
 // Fragment shader program
 var FSHADER_SOURCE =
 'precision mediump float;' +
 'varying vec2 v_UV;' +
 'uniform vec4 u_FragColor;' +
 'uniform sampler2D u_Sampler0;' +
 'uniform sampler2D u_Sampler1;' +
 'uniform sampler2D u_Sampler2;' +
 'uniform sampler2D u_Sampler3;' +
 'uniform int u_whichTexture;' +
 'void main() {' +
 '    if (u_whichTexture == 0) {' +
 '        gl_FragColor = texture2D(u_Sampler0, v_UV);' +
 '    } else if (u_whichTexture == 1) {' +
 '        gl_FragColor = texture2D(u_Sampler1, v_UV);' +
 '    } else if (u_whichTexture == 2) {' +
 '        gl_FragColor = texture2D(u_Sampler2, v_UV);' +
 '    } else if (u_whichTexture == 3) {' +
 '        gl_FragColor = texture2D(u_Sampler3, v_UV);' +
'     } else {' +
'        gl_FragColor = u_FragColor;' +
 '    }' +
 '}';



//Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_whichTexture;

function setupWebGL(){
    //Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    //Get the rendering context for webGL
    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl){
        console.log("Failed to get the rendering context for WebGL");
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
    // Get the storage location of a_UV variable
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0){
        console.log("Failed to get the storage location of a_UV");
        return;
    }
    // Get the storage location of u_ViewMatrix uniform variable
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix){
        console.log("Failed to get the storage location of u_ViewMatrix");
        return;
    }
    // Get the storage location of u_ProjectionMatrix uniform variable
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix){
        console.log("Failed to get the storage location of u_ProjectionMatrix");
        return;
    }

    // Get the storage location of u_FragColor variable
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor){
        console.log("Failed to get the storage location of u_FragColor");
        return;
    }

    // Get the storage location of u_Sampler0 and u_Sampler1
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return false;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler1');
      return false;
    }

    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
      console.log('Failed to get the storage location of u_Sampler2');
      return false;
    }

    u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if (!u_Sampler3) {
      console.log('Failed to get the storage location of u_Sampler3');
      return false;
    }

    // Get the storage location of u_Sampler0 and u_Sampler1
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture ) {
      console.log('Failed to get the storage location of u_whichTexture');
      return false;
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

    document.getElementById('goPlayFetchButton').onclick = function() {renderDogs = false;
        renderAllShapes()};
}

// function drawTree() {

//     const tree = new Tree();
//     tree.render(); 
// }

function initTextures(gl, n) {
    // Create the sky image object
    var skyImage = new Image();
    skyImage.onload = function() { sendTextureToGLSL(skyImage, 0); };
    skyImage.src = '../Assignment3b/sky.jpg';

    // Load dog texture
    var grassImage = new Image();
    grassImage.onload = function() { sendTextureToGLSL(grassImage, 1); };
    grassImage.src = '../Assignment3b/grass.jpg';

    var dawg = new Image();
    dawg.onload = function() { sendTextureToGLSL(dawg, 2); };
    dawg.src = '../Assignment3b/dawg.jpg';
  
    return true;
}

function sendTextureToGLSL(image, textureUnit) {
    // Create a texture object
    var texture = gl.createTexture(); 
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }
  
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y-axis
    
    // Make the texture unit active
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
      
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);   
    
    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the image to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
    // Pass the texture unit to the corresponding sampler uniform
    if (textureUnit === 0) {
        gl.uniform1i(u_Sampler0, textureUnit);   // Pass the texture unit to u_Sampler0
    } else if (textureUnit === 1) {
        gl.uniform1i(u_Sampler1, textureUnit);   // Pass the texture unit to u_Sampler1
    } else if (textureUnit === 2) {
        gl.uniform1i(u_Sampler2, textureUnit);   // Pass the texture unit to u_Sampler1
    }
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    //console.log('Finished loading texture');
}

function main() {

    //set up canvas and gl variables
    setupWebGL();
    //set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    //Set up actona for the HTML UI Elements
    addActionsForHtmlUI();

    document.onkeydown =keydown;
    document.addEventListener('keydown', moveCamera);

    initTextures(gl,1);
    initTextures(gl,0);
// Register function (event handler) to be called on a mouse press
    //canvas.onmousedown = click;
    //canvas.onmousemove = function(ev) {if(ev.buttons == 1) { click(ev) } };

    //specify the color for clearning canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    //clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // renderAllShapes();
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


function keydown(ev){
    if (ev.keyCode == 39 || ev.key === 'e' || ev.key === 'E'){ //right key
        g_camera.eye.elements[0] += 0.2;
    } else if (ev.keyCode == 37 || ev.key === 'q' || ev.key === 'Q'){ //left arrow
        g_camera.eye.elements[0] -= 0.2;
    }
    renderAllShapes();
    console.log(ev.keyCode);
}

function moveCamera(ev){
    if ( ev.key == 'W' || ev.key == 'w'){
        g_camera.forward(); //move cam forward on w
    } else if ( ev.key == 'A' || ev.key == 'a'){
        g_camera.left(); //move cam left on a
} else if ( ev.key == 'S' || ev.key == 's'){
    g_camera.back(); //move cam back on s
} else if ( ev.key == 'D' || ev.key == 'd'){
    g_camera.right(); //move cam right on d
}
}

 var g_shapesList = [];

    var g_points = []; 
    var g_colors = []; 
    var g_sizes= [];

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
var g_camera = new Camera();
    //g_camera.forward();

// let g_camera ={
//     eye: { x: 0, y: 0, z: 3 },
//     at: { x: 0, y: 0, z: -100 },
//     up: { x: 0, y: 1, z: 0 }
// };
console.log("g cam2", g_camera);



// g_camera = new Camera();
//console.log("g_cam", g_camera);

var g_map=[
[1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,1],
[1,0,0,1,1,0,0,1],
[1,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,1],
[1,0,0,0,1,0,0,1],
[1,0,0,0,0,0,0,1],
]

function drawMap(){
    for (x=0;x<9;x++){
        for(y=0;y<8;y++){
            if (g_map[x][y]==1){
                var body = new Cube();
                body.color = [1.0,1.0,1.0,1.0];
                body.matrix.translate(x-4,-.75,y-4);
                body.render()
            }
        }
    }
}
// function dogGotBall(){
//     var ball = new Cube();
//     ball.color = [1.0,0.0,0.0,1.0];
//     ball.textureNum= 2;
//     ball.matrix.scale(50,50,50);
//     ball.matrix.translate(-.5,-.5,-.5);
//     ball.render();
// }

function createDog(x, y, z) {
    var body = new Cube();
    body.color = [0.6, 0.4, 0.2, 1.0]; 
    body.textureNum = -1;
    body.matrix.translate(x, y, z); 
    body.matrix.rotate(-5,1,0, 0);
    body.matrix.scale(0.5,.3, .5); 
    body.render();

    var head = new Cube();
    head.color = [0.3, 0.15, 0.05, 1.0]; 
    head.matrix.translate(x - 0.4, y + 0.02, z); 
    head.matrix.rotate(-g_headAngle,1,0, 0);
    head.matrix.scale(0.4,.4, .4); 
    head.render();

    var ear1 = new Cube();
    ear1.color = [0.6, 0.4, 0.2, 1.0]; 
    ear1.matrix.translate(x - 0.05, y + 0.15, z + 0.15); 
    ear1.matrix.rotate(-g_headAngle, 0, 1, 0); 
    ear1.matrix.scale(0.1, 0.1, 0.1); 
    ear1.render();

    var ear2 = new Cube();
    ear2.color = [0.6, 0.4, 0.2, 1.0];
    ear2.matrix.translate(x - 0.1, y + 0.45, z - 0.15); 
    ear2.matrix.rotate(-g_headAngle, 0, 1, 0); 
    ear2.matrix.scale(0.1, 0.1, 0.1); 
    ear2.render();

    var legPositions = [
        [x - 0.15, y - 0.2, z + 0.25], 
        [x - 0.15, y - 0.2, z - 0.25], 
        [x + 0.25, y - 0.2, z + 0.25], 
        [x + 0.25, y - 0.2, z - 0.25] 
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
    tail.matrix.translate(x + 0.65, y + 0.1, z); 
    tail.matrix.scale(0.1, 0.1, 0.4); 
    tail.render();

    var tailExtender = new Cube();
    tailExtender.color = [0.6, 0.4, 0.2, 1.0]; 
    tailExtender.matrix.translate(x + 0.45, y + 0.1, z); 
    tailExtender.matrix.rotate(-g_tailAngle, 0, 1, 0);
    tailExtender.matrix.scale(0.2, 0.1, 0.0); 
    tailExtender.render();
}

let renderDogs = true;

//Draw every shape that is supposed to be in the canvas
function renderAllShapes(){
    var startTime = performance.now();

    // Clear <canvas>
    
    var projMat = new Matrix4();
    projMat.setPerspective(50, canvas.width/canvas.height, .1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var len = g_shapesList.length;

    //draw a test triangle
    //drawTriangle3D([-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0]);
    
   //draw the floor
   var floor =new Cube();
   floor.color = [1.0,0.0,0.0,1.0];
   //floor.textureNum= 1;
   floor.matrix.translate(0, -.75, 0.0);
   floor.matrix.scale(10,0,10);
   floor.matrix.translate(-.5,0,-0.5);
   //floor.render();

    //draw the sky
    var sky = new Cube();
    sky.color = [1.0, 0.0, 0.0, 1.0];
    sky.matrix.scale(50, 50, 50);
    sky.matrix.translate(-0.5, -0.5, -0.5);

    if (renderDogs) {
        sky.textureNum = 0; //use the first sky texture
        floor.textureNum= 1;
    } else {
        sky.textureNum =  2; //use the second sky texture
        floor.textureNum= 2;


    }

    sky.render();
    floor.render();


    
    if (renderDogs) {
    createDog(-0.25, -0.25, -1.0); 
    createDog(1.5, -0.25, -1.0); 
    createDog(-2.5, -0.25, -1.0); 
    createDog(-1.0, -0.5, 2.5); 
    createDog(0.5, -0.25, 3.0); 
    createDog(-0.5, -0.25, 1.5); 
    }


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

//     console.log("gl:", gl);
// console.log("canvas", canvas);
// console.log("gl.program", gl.program);