class Sphere {
    constructor() {
        this.type = "sphere";
        this.color = [1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
        this.verts32 = new Float32Array([]);
        this.textureNum = -2;

    }

    render() {
        var rgba = this.color;

        // Set the texture uniform
        gl.uniform1i(u_whichTexture, this.textureNum);
        // Set the model matrix uniform
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var d = Math.PI / 10;
        //var dd = Math.PI / 100;

        for (var t = 0; t < Math.PI; t += d) {
            for (var r = 0; r < (2 * Math.PI); r += d) {
                var p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
                var p2 = [Math.sin(t + d) * Math.cos(r), Math.sin(t + d) * Math.sin(r), Math.cos(t + d)];
                var p3 = [Math.sin(t) * Math.cos(r + d), Math.sin(t) * Math.sin(r + d), Math.cos(t)];
                var p4 = [Math.sin(t + d) * Math.cos(r + d), Math.sin(t + d) * Math.sin(r + d), Math.cos(t + d)];

                var v1 = p1.concat(p2).concat(p4);
                var uv1 = [0, 0, 0, 0, 0, 0];

                var v2 = p1.concat(p4).concat(p3);
                var uv2 = [0, 0, 0, 0, 0, 0];

                // Set the color for the first triangle
                gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
                drawTriangle3DUVNormal(v1, uv1, v1);

                // Set the color for the second triangle
                gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
                drawTriangle3DUVNormal(v2, uv2, v2);
            }
        }
    }
}
