import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

console.log(`three ${THREE.REVISION}`);

// setup renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(new THREE.Color('#fff'));

export function getDomElement()
{ return renderer.domElement; }

// 2 meters
const interestArea = 2;

// setup camera and handle resize (renderer and camera)
const camera = new THREE.PerspectiveCamera();

camera.fov = 55;
camera.near = interestArea / 100;
camera.far = interestArea * 10;
camera.position.set(1, .7, 1).normalize().multiplyScalar(interestArea);
camera.lookAt(0, 0, 0);

export function resize(width: number, height: number)
{
    const size = renderer.getSize(new THREE.Vector2());
    if (Math.abs(size.x - width) > Number.EPSILON || Math.abs(size.y - height) > Number.EPSILON)
    {
        renderer.setSize(width, height, true);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

// setup scene and controls
const scene = new THREE.Scene();
const orbitControls = new OrbitControls(camera, renderer.domElement);

orbitControls.enablePan = false;
orbitControls.enableDamping = true;
orbitControls.dampingFactor = .1;
orbitControls.target.setScalar(0);

scene.add(camera);

// define update loop
function update(timestamp: number)
{
    orbitControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

function debug()
{
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);
    const gridHelper = new THREE.GridHelper(2, 4);
    gridHelper.position.y = -1 / 1000; // -1mm
    scene.add(gridHelper);
}

export function createDemo()
{
    debug();

    const object3d = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: new THREE.Color('#f00'), wireframe: true })
    );
    scene.add(object3d);
    
    requestAnimationFrame(update);
}