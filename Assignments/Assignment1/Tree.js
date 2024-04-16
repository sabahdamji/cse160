
//used chat gpt and other web sources for help on this portion
class Tree {
    constructor() {
        this.type = "tree";
        this.position = [0.0, 0.0, 0.0]; 
        this.color = [0.0, 1.0, 0.0, 1.0]; 
        this.size = 1.0; 
    }

    render() {
        const baseWidth = 0.1;
        const baseHeight = 0.8;
        const triangleHeight = 0.1;
        const levels = 20; //levels in tree

        let vertices = [];
        for (let i = 0; i < levels; i++) {
            const levelWidth = baseWidth + (i * 0.1); 
            const levelHeight = baseHeight + (i * triangleHeight); 

            const xLeft = -levelWidth / 2;
            const xRight = levelWidth / 2;
            const yBottom = -baseHeight + (levels - i - 1) * triangleHeight; 
            const yTop = yBottom + triangleHeight;

            // Add vertices for the triangle
            vertices = vertices.concat([
                xLeft, yBottom,
                xRight, yBottom,
                0, yTop
            ]);
        }

        // Create a buffer object
        const vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the buffer object');
            return;
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // Write data into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Get the storage location of a_Position variable
        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return;
        }

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

        // Set the color for drawing 
        const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
        gl.uniform4fv(u_FragColor, this.color);

        // Draw the Christmas tree
        const numVertices = 3; // Number of vertices per triangle
        for (let i = 0; i < levels; i++) {
            gl.drawArrays(gl.TRIANGLES, i * numVertices, numVertices);
        }
    }
}