import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';



class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }

  let sphere;
  function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  
    const fov = 60;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const scene = new THREE.Scene();
    camera.position.set(0, 1, 2);
  
    // Create texture loader
    const loader = new THREE.TextureLoader();
  
    // Load texture for skybox
    const skyTexture = loader.load('forest.jpg');
    const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
    const skyGeometry = new THREE.BoxGeometry(25, 25, 25);
    const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skybox);
  
    // Load texture for ground
    const texture = loader.load('grass.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;
  
    // Create materials
    const material = new THREE.MeshBasicMaterial({ color: 0xFF8844, map: texture });
  
    // Ambient lightx
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
  directionalLight.position.set(-1, 2, 4);
  scene.add(directionalLight);

  // Point light 
  const pointLightColor = 0xFFFFFF;
  const pointLightIntensity = 150;
  const pointLight = new THREE.PointLight(pointLightColor, pointLightIntensity);
  pointLight.position.set(0, 10, 0);
  scene.add(pointLight);
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(pointLightHelper);

  function updatePointLight() {
    pointLightHelper.update();
  }

  const gui = new GUI();
  gui.addColor(new ColorGUIHelper(pointLight, 'color'), 'value').name('color');
  gui.add(pointLight, 'intensity', 0, 250, 1);
  gui.add(pointLight, 'distance', 0, 40).onChange(updatePointLight);
  makeXYZGUI(gui, pointLight.position, 'position');

  // Orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(-20, 3.5, 2);

  controls.update();

  let loadedObject = null;

    // 3D object
    {
      const objLoader = new OBJLoader();
      objLoader.load('spider/monk.obj', (root) => {
        const scaleFactor = -0.1;
        root.scale.set(scaleFactor, scaleFactor, scaleFactor);
        root.position.x = 3;
        root.rotation.x = Math.PI / 2; 
        root.position.set(3, -0.5, 0); 

        root.position.y = 0.5;
        scene.add(root);
        //loadedObject = root; 

      });
    }





  
    // const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
    // directionalLight.position.set(-1, 2, 4);
    // scene.add(directionalLight);
  
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);

    // Banana shape
class BananaCurve extends THREE.Curve {
  constructor(scale = 1) {
    super();
    this.scale = scale;
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const tx = Math.cos(t * Math.PI) * 3;
    const ty = Math.sin(t * Math.PI) * 1.5 - 1;
    const tz = 0;

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}

const path = new BananaCurve(1);
const bananaGeometry = new THREE.TubeGeometry(path, 5, 1, 8, false);
const bananaTexture = loader.load('banana.jpg'); 
const bananaMaterial = new THREE.MeshStandardMaterial({ map: bananaTexture });
const banana = new THREE.Mesh(bananaGeometry, bananaMaterial);
banana.position.set(6, 5,9);
banana.rotation.x = 3;
banana.rotation.y = 2;

scene.add(banana);
    
    function makeInstance(geometry, color, x, y, z, textured = false) {
        let cubeMaterial;
        if (textured) {
            cubeMaterial = new THREE.MeshStandardMaterial({ map: texture });
        } else {
            cubeMaterial = new THREE.MeshStandardMaterial({ color: color });
        }
        const cube = new THREE.Mesh(geometry, cubeMaterial);
        scene.add(cube);
        cube.position.set(x, y - (geometry.parameters.height ? geometry.parameters.height / 2 : 0), z);
        return cube;
    }
    // 0x7CFC00
    // 0x107800
    // 0x70c048
    // 0x70c04
    // 0x90e048
    // 0xc0f098

    const cubes = [
        makeInstance(geometry, 0x7CFC00, 0, 0.25, -4, material),
        makeInstance(geometry, 0x107800, 1, 0.3, -4, material),
        makeInstance(geometry, 0x90e048, 2, 0, -4, material),
        makeInstance(geometry, 0x70c048, 3, 0.3, -4, material),
        makeInstance(geometry, 0x7CFC00, 4, 0, -4, material),
        makeInstance(geometry, 0xc0f098, 5, 0, -4, material),
        makeInstance(geometry, 0x90e048, 0, 0, -3, material),
        makeInstance(geometry, 0x7CFC00, 1, 0.1, -3, material),
        makeInstance(geometry, 0x98e070, 2, 0.1, -3, material),
        makeInstance(geometry, 0x107800, 3, 0.1, -3, material),
        makeInstance(geometry, 0x90e048, 4, 0.3, -3, material),
        makeInstance(geometry, 0x7CFC00, 5, 0, -3, material),
        makeInstance(geometry, 0xc0f098, 0, 0.1, -2, material),
        makeInstance(geometry, 0x90e048, 1, 0.2, -2, material),
        makeInstance(geometry, 0x7CFC00, 2, 0.1, -2, material),
        makeInstance(geometry, 0xc0f098, 3, 0.15, -2, material),
        makeInstance(geometry, 0x90e048, 4, 0.2, -2, material),
        makeInstance(geometry, 0x107800, 5, 0, -2, material),
        makeInstance(geometry, 0xc0f098, 0, 0.1, -1, material),
        makeInstance(geometry, 0x90e048, 1, 0.15, -1, material),
        makeInstance(geometry, 0x7CFC00, 2, 0.25, -1, material),
        makeInstance(geometry, 0x90e048, 3, 0.40, -1, material),
        makeInstance(geometry, 0x70c048, 4, 0.21, -1, material),
        makeInstance(geometry, 0x90e048, 5, 0, -1, material),
        makeInstance(geometry, 0x7CFC00, 0, 0.32, 0, material),
        makeInstance(geometry, 0x107800, 1, 0.1, 0, material),
        makeInstance(geometry, 0xc0f098, 2, 0.24, 0, material),
        makeInstance(geometry, 0x90e048, 3, 0.1, 0, material),
        makeInstance(geometry, 0x7CFC00, 4, 0.2, 0, material),
        makeInstance(geometry, 0x90e048, 5, 0, 0, material),
        makeInstance(geometry, 0xc0f098, 0, 0.11, 1, material),
        makeInstance(geometry, 0x90e048, 1, 0.12, 1, material),
        makeInstance(geometry, 0x7CFC00, 2, 0.3, 1, material),
        makeInstance(geometry, 0x90e048, 3, 0.2, 1, material),
        makeInstance(geometry, 0xc0f098, 4, 0, 1, material),
        makeInstance(geometry, 0x7CFC00, 5, 0, 1, material),
        makeInstance(geometry, 0x70c048, 0, 0, 2, material),
        makeInstance(geometry, 0x7CFC00, 1, 0.14, 2, material),
        makeInstance(geometry, 0x107800, 2, 0.09, 2, material),
        makeInstance(geometry, 0x70c048, 3, 0.12, 2, material),
        makeInstance(geometry, 0x7CFC00, 4, 0.23, 2, material),
        makeInstance(geometry, 0x70c048, 5, 0, 2, material),
        makeInstance(geometry, 0x107800, 0, 0.2, 3, material),
        makeInstance(geometry, 0xc0f098, 1, 0.1, 3, material),
        makeInstance(geometry, 0x70c048, 2, 0.17, 3, material),
        makeInstance(geometry, 0x7CFC00, 3, 0.23, 3, material),
        makeInstance(geometry, 0xc0f098, 4, 0.24, 3, material),
        makeInstance(geometry, 0x7CFC00, 5, 0, 3, material),
        makeInstance(geometry, 0x70c048, 0, 0.17, 4, material),
        makeInstance(geometry, 0xc0f098, 1, 0.16, 4, material),
        makeInstance(geometry, 0x7CFC00, 2, 0.3, 4, material),
        makeInstance(geometry, 0x7CFC00, 3, 0.2, 4, material),
        makeInstance(geometry, 0x70c048, 4, 0.13, 4, material),
        makeInstance(geometry, 0xc0f098, 5, 0, 4, material ),

        
        makeInstance(sphereGeometry, 0xFFD700, 10, 9, -9, false),
        //makeInstance(bananaGeometry, 0xFFD700, 10, 5, 11, false),



        
    ];

    sphere = cubes[cubes.length - 1];

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      return needResize;
    }
  
    
    function render(time) {
      time *= 0.001; // convert time to seconds
  
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;

      banana.rotation.x += 0.01;
      banana.rotation.y += 0.01;
  
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }


  
      renderer.render(scene, camera);
      controls.update();
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
  }
  
main();
