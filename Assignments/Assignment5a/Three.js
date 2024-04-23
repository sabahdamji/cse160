import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


function main() {

    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.z = 10;
    const scene = new THREE.Scene();

//texturing 
    const loader = new THREE.TextureLoader();
    const texture = loader.load( 'dog.jpg' );
    texture.colorSpace = THREE.SRGBColorSpace;
 
    //materials
    const material = new THREE.MeshBasicMaterial({ color: 0xFF8844, map: texture,});
    //const texturedMaterial = new THREE.MeshBasicMaterial({ map: texture });

    //3D obj
    {
        const objLoader = new OBJLoader();
objLoader.load('Tree1/Tree1.obj', (root) => {
    // Scale the object to fit within the canvas
    const scaleFactor = 0.1; // Adjust this value as needed
    root.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Move the object to the right
    const offsetX = 6; // Adjust this value as needed
    root.position.x = offsetX;

    scene.add(root);
});
      }

     {
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight( color, intensity );
        light.position.set( - 1, 2, 4 );
        scene.add( light );
    }

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);

    function makeInstance(geometry, color, x, y, z, textured = false) {
        let cubeMaterial;
        if (textured) {
            cubeMaterial = new THREE.MeshStandardMaterial({ map: texture });
        } else {
            cubeMaterial = new THREE.MeshStandardMaterial({ color: color });
        }
        const cube = new THREE.Mesh(geometry, cubeMaterial);
        scene.add(cube);
        cube.position.set(x, y, z);
        return cube;
    }

    const cubes = [
        makeInstance(sphereGeometry, 0x44aa88, 0, 0, 0),
        makeInstance(geometry, 0x8844aa, 1, 1, 0, material),
        makeInstance(geometry,0xaa8744, 2, 2, 0, ),
        makeInstance(geometry, 0x3F51B5, 3, 3, 0),
        makeInstance(geometry, 0x4CAF50, 4, 4, 0),
        makeInstance(geometry, 0xFFC107, 5, 5, 0),
        makeInstance(cylinderGeometry, 0x9C27B0, 6, 6, 0),
        makeInstance(geometry, 0xE91E63, -1, -1, 0, material),
        makeInstance(geometry, 0x00BCD4, -2, -2, 0),
        makeInstance(geometry, 0xFF5722, -3, -3, 0),
        makeInstance(geometry, 0x8BC34A, -4, -4, 0),
        makeInstance(geometry, 0x607D8B, -5, -5, 0),
        makeInstance(cylinderGeometry, 0x795548, -6, -6, 0),
        makeInstance(geometry, 0xCDDC39, -1, 1, 0, material),
        makeInstance(geometry, 0xFFEB3B, -2, 2, 0),
        makeInstance(geometry, 0x03A9F4, -3, 3, 0),
        makeInstance(geometry, 0x9E9E9E, -4, 4, 0),
        makeInstance(geometry, 0x2196F3, -5, 5, 0),
        makeInstance(cylinderGeometry, 0xFF5252, -6, 6, 0),
        makeInstance(geometry, 0x33FFFF, 1, -1, 0, material),
        makeInstance(geometry, 0xFFFF33, 2, -2, 0),
        makeInstance(geometry, 0x33FF57, 3, -3, 0),
        makeInstance(geometry, 0xFF33A1, 4, -4, 0),
        makeInstance(geometry, 0xA133FF, 5, -5, 0),
        makeInstance(cylinderGeometry, 0xFFA133, 6, -6, 0),
    ];

    function render( time ) {
        time *= 0.001; // convert time to seconds

        cubes.forEach( ( cube, ndx ) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        } );

        renderer.render( scene, camera );

        requestAnimationFrame( render );
    }

    requestAnimationFrame( render );
}

main();
