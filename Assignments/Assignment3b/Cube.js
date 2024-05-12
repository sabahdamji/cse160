class Cube {
  constructor() {
      this.type = "cube";
      //this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.textureNum=-999;
  }
  
  render() {
      var rgba = this.color;


      gl.uniform1i(u_whichTexture, this.textureNum);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      
//      //front of cube
      drawTriangle3DUV([0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0]);
      drawTriangle3DUV([0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1]);

      //top of cube
      drawTriangle3DUV([0,1,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0]);
      drawTriangle3DUV([0,1,0,  0,1,1,  1,1,1], [0,0, 0,1, 1,1]);

      //bottom of cube
      drawTriangle3DUV([0,0,0,  1,0,1,  0,0,1], [0,0, 1,1, 1,0]);
      drawTriangle3DUV([0,0,0,  1,0,0,  1,0,1], [0,0, 0,1, 1,1]);

      //left of cube
      drawTriangle3DUV([1,0,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0]);
      drawTriangle3DUV([1,0,0,  1,0,1,  1,1,1], [0,0, 0,1, 1,1]);

      //right of cube
      drawTriangle3DUV([0,0,0,  0,1,1,  0,1,0], [0,0, 1,1, 1,0]);
      drawTriangle3DUV([0,0,0,  0,0,1,  0,1,1], [0,0, 0,1, 1,1]);

      //bck of cube
      drawTriangle3DUV([0,0,1,  1,1,1,  0,1,1], [0,0, 1,1, 1,0]);
      drawTriangle3DUV([0,0,1,  1,0,1,  1,1,1], [0,0, 0,1, 1,1]);    
  }
}
