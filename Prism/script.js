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
const Prisms = [];
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
function rainbow(val) { 
    const color = new THREE.Color();
    if (val < 0.25) {
        color.r = 0;
        color.g = val * 4;
        color.b = 1;
    } else if (val < 0.50) {
        color.r = 0;
        color.g = 1;
        color.b = (val - 0.25) * 4;
    } else if (val < 0.75) {
        color.r = (val - 0.5) * 4;
        color.g = 1;
        color.b = 0;
    } else {
        color.r = 1;
        color.g = 1 - (val - 0.75) * 4;
        color.b = 0;
    }
    return color;
}
function prism(x, z) {
    const mesh_geometry = new THREE.BoxGeometry(0.23, 0.23, 0.23);

    const colHSL = new THREE.Color(0xffffff);
    const mesh_material = new THREE.MeshStandardMaterial({
        color: colHSL, metalness: 0.0, roughness: 0.0 });
    const mesh = new THREE.Mesh(mesh_geometry, mesh_material);
    mesh.position.x = x;
    mesh.position.z = z;
    
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
class Prism { 
    constructor(x, z, h) {
        this.height = h;
        this.mesh = prism(x, z);
        this.updateHeight();
    }
    updateHeight() {
        this.mesh.scale.y = this.height;
        this.mesh.position.y = (this.height / 2) * 0.25;
        console.log(this.mesh.position.y);
        this.mesh.material.color = rainbow(this.height / 6.2);
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
function pannel() { 
    let verts = [];
    let colors = [];
    let faces = [];

    verts.push(-0.625, 0, -0.75);
    verts.push(-0.625, 0, 0.75);
    verts.push(0.625, 0, 0.75);
    verts.push(0.625, 0, -0.75);

    colors.push(1, 1, 1);
    colors.push(1, 1, 1);
    colors.push(1, 1, 1);
    colors.push(1, 1, 1);

    faces.push(0, 1, 2);
    faces.push(0, 2, 3);

    const mesh_geometry = new THREE.BufferGeometry();

    const verticesArray = new Float32Array(verts);
    mesh_geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));

    const colorsArray = new Float32Array(colors);
    mesh_geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const indicesArray = new Uint16Array(faces);
    mesh_geometry.setIndex(new THREE.BufferAttribute(indicesArray, 1));

    mesh_geometry.computeFaceNormals();
    mesh_geometry.computeVertexNormals();
    mesh_geometry.computeBoundingBox();
    mesh_geometry.computeBoundingSphere();
    const mesh_material = new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors });
    const mesh = new THREE.Mesh(mesh_geometry, mesh_material);

    group.add(mesh);
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

//pannel();
for (i = 0; i < 5; i++) {
    for (j = 0; j < 6; j++) {
        const x = 1.25 / 5 * (- 2 + i);
        const y = 1.5 / 6 * (- 2.5 + j);
        const p = new Prism(x, y, (i + j + 1) * 0.3);
        Prisms.push(p);
    }
}
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
    patternUrl: 'data/pattern-seed.patt',
    changeMatrixMode: 'cameraTransformMatrix'
});



const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);


document.addEventListener('touchstart', function (e) {
    const b = new Ball();
    console.log("touched");
    Balls.push(b);
}, { passive: false });

// animation
requestAnimationFrame(function animate() {
    requestAnimationFrame(animate);

    const sec = performance.now() / 1000;

    if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
        scene.visible = camera.visible;

        if (camera.visible) {
            for (i = 0; i < 5; i++) {
                for (j = 0; j < 6; j++) {
                    Prisms[i * 6 + j].height = (1.1 + Math.cos(sec + i * 0.3) * 0.5 + Math.sin(sec + j * 0.7) * 0.5) * 3;
                    Prisms[i * 6 + j].updateHeight();
                }
            }
        }
    }
    
	renderer.render(scene, camera);
});