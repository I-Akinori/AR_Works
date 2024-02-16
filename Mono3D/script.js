const meshes = [];
const now = new Date();
const normalizedDay = normalizeDate(now);
const rand_dic = [];

let tree_wid_ave;
let tree_wid_amp;
let tree_len_ave;
let tree_len_amp;
let tree_dir_amp;
let tree_ang_ave;
let tree_ang_amp;
let tree_col_amp;
let tree_col_rat;

let branchID = 0;
let randID = 0;
let count = 0;
const Balls = [];
InitRand();
var group = new THREE.Group();

function InitRand() { 
    for (let i = 0; i < 1024 * 2; i++) { 
        rand_dic.push(Math.random());
    }
}
function MyRandom() { 
    return rand_dic[randID++];
}
function deg2rad(deg) { 
    return deg / 180 * Math.PI;
}
function normalizeDate(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const endOfYear = new Date(date.getFullYear(), 11, 31);
    const totalDays = (endOfYear - startOfYear) / (1000 * 60 * 60 * 24);
    const dayOfYear = (date - startOfYear) / (1000 * 60 * 60 * 24);

    return dayOfYear / totalDays;
}
function boxMuller01(ave) {
    let u = 0, v = 0;
    while (u === 0) u = MyRandom();
    while (v === 0) v = MyRandom();
    
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * 0.5 + ave;
    if (num < 1) { num = 1; }
    return num;
}
function randomColor(orig) { 
    const color = new THREE.Color();
    color.setHSL(boxMuller01(0.7 - normalizedDay), 1.0, 0.5);
    let colVec = new THREE.Vector3(color.r, color.g, color.b);
    return colVec.lerp(orig, MyRandom() * tree_col_rat);
}
function randomColor() {
    const color = new THREE.Color();
    color.setHSL(Math.random(), 1.0, 0.7);
    return color;
}
function ball() {
    let mesh_geometry = new THREE.SphereGeometry(0.4);
    if (Math.random() < 0.3)
        mesh_geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);

    const colHSL = randomColor();
    const mesh_material = new THREE.MeshStandardMaterial({
        color: colHSL, metalness: 0.4, roughness: 0.1 });
    const mesh = new THREE.Mesh(mesh_geometry, mesh_material);
    meshes.push(mesh);

    group.add(mesh);
    return mesh;
}
class Ball{
    constructor(){
        this.start_time = performance.now();
        this.mesh = ball();
        this.vel = boxMuller01(2);
    }
    updatePosition() {
        const sec = (performance.now() - this.start_time) / 1000;
        this.mesh.position.y = sec * 5 * this.vel - 0.5;
        this.mesh.position.z = sec * sec * 30;
        this.mesh.rotation.x = sec * 10;
        console.log(sec);

        return sec > 5;
    }
    dispose() { 
        if (this.mesh.geometry) {
            this.mesh.geometry.dispose();
        }
        if (this.mesh.material) {
            this.mesh.material.dispose();
        }
    }
}

const width = window.innerWidth, height = window.innerHeight;
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setClearColor(new THREE.Color(), 0);
renderer.setSize(width, height);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0px';
renderer.domElement.style.left = '0px';
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.visible = false;
const camera = new THREE.OrthographicCamera(-1, +1, height / width, -height / width, 0.01, 1000);
scene.add(camera);

scene.add(group);

const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam'
});

arToolkitSource.init(() => {
    setTimeout(() => {
        onResize();
    }, 2000);
});

addEventListener('resize', () => {
    onResize();
});

function onResize() {
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
};

const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'data/camera_para.dat',
    detectionMode: 'mono'
});

arToolkitContext.init(() => {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

const arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
    type: 'pattern',
    patternUrl: 'data/pattern-mono.patt',
    changeMatrixMode: 'cameraTransformMatrix'
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);


let touched = false;
document.addEventListener('touchstart', function (e) {
    touched = true;
}, { passive: false });

let mixer;
let time_count = 12;
const loader = new THREE.GLTFLoader();
const clock = new THREE.Clock();

loader.load('data/RollingBall.glb', function (gltf) {
    scene.add(gltf.scene);

    mixer = new THREE.AnimationMixer(gltf.scene);

    function animate() {
        requestAnimationFrame(animate);

        if (arToolkitSource.ready) {
            arToolkitContext.update(arToolkitSource.domElement);
            scene.visible = camera.visible;

            if (camera.visible) {
                if (touched && time_count > 12) {
                    console.log(time_count);
                    time_count = 0;
                    gltf.animations.forEach((clip) => {
                        mixer.clipAction(clip).reset();
                        mixer.clipAction(clip).setLoop(THREE.LoopOnce);
                        mixer.clipAction(clip).clampWhenFinished = true;
                        mixer.clipAction(clip).play();
                    });
                }
                const delta = clock.getDelta();
                mixer.update(delta);
                time_count += delta;
            }
        }
        touched = false;

        renderer.render(scene, camera);
    }

    animate();
});