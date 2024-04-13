// DrawRectangle.js
let canvas;
let ctx;


function main() {
    // Retrieve <canvas> element <- (1)
    canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    
    // Get the rendering context for 2DCG <- (2)
    ctx = canvas.getContext('2d');
    
    var v1 = new Vector3([2.25,2.25,0]);
     
    // Draw a blue rectangle <- (3)
    // ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color
    // ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color
   
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //drawVector(v1, "red");
} 

function drawVector(v, color){
    const canvas = document.getElementById("example");
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2); //origin at the center of the canvas
        ctx.lineTo(canvas.width / 2 + v.elements[0] * 20, canvas.height / 2 - v.elements[1] * 20); //scale coordinates by 20
        ctx.strokeStyle = color;
        //ctx.fill();
        ctx.stroke();
    }
}

function handleDrawEvent(){
    const canvas = document.getElementById('example');
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clears canvas 
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const x1 = parseFloat(document.getElementById('x1').value);
    const y1 = parseFloat(document.getElementById('y1').value);
    //console.log(x, y);
    var v1 = new Vector3([x1,y1,0]); //create vector
    drawVector(v1, "red"); //draw new vector
    const x2 = parseFloat(document.getElementById('x2').value); //read values
    const y2 = parseFloat(document.getElementById('y2').value);
    var v2 = new Vector3([x2,y2,0]);
    drawVector(v2, "blue");
}

function handleDrawOperationEvent(){
    const canvas = document.getElementById('example');
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const x1 = parseFloat(document.getElementById('x1').value);
    const y1 = parseFloat(document.getElementById('y1').value); 
    var v1 = new Vector3([x1,y1,0]); //create vector
    drawVector(v1, "red"); //draw new vector
    const x2 = parseFloat(document.getElementById('x2').value); //read values
    const y2 = parseFloat(document.getElementById('y2').value);
    var v2 = new Vector3([x2,y2,0]);
    drawVector(v2, "blue");
    const operation = document.getElementById('operation-select').value; //read selector value & call vector3 function 
    console.log(operation);
    console.log(v2)
    console.log(v1)
    let scalar = document.getElementById('scalar-input').value; // Retrieve scalar value
    let result;
    switch (operation) {
        case "add":
            result = v1.add(v2);
            drawVector(result, "green")
            break;
        case 'subtract':
            result = v1.sub(v2);
            drawVector(result, "green")
            break;
        case 'multiply':
            result = v1.mul(scalar);
            drawVector(result, "green");
            break;
        case 'divide':
            result = v1.div(scalar);
            drawVector(result, "green");
            break;
        case 'magnitude':
            result = v1.magnitude(); 
            console.log('Magnitude:', result);
            break; 
        case 'normalize':
            v1.normalize();
            drawVector(v1, "green");
            break;
        case 'angle between':
            result = v1.angleBetween(v2);
            console.log('Angle between v1 and v2:', result);
            break;
        case 'triangle area':
            triangleArea = areaTriangle(v1, v2);
            console.log("Area of the triangle:", triangleArea);
            break;          
        //default: console.log("bad");
    }
    //console.log(result);
}   
