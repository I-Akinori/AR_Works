let count = 0;
const Prisms = [];
let totalheight = 0;
var group = new THREE.Group();
let i = 0;
let j = 0;

function rainbow(val) { 
    const color = new THREE.Color();
    if (val < 0.25) {
        color.r = 0;
        color.g = val * 4;
        color.b = 1;
    } else if (val < 0.50) {
        color.r = 0;
        color.g = 1;
        color.b = (0.5 - val) * 4;
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
    const mesh_geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

    const colHSL = new THREE.Color(0xffffff);
    const mesh_material = new THREE.MeshStandardMaterial({
        color: colHSL, metalness: 0.0, roughness: 0.0 });
    const mesh = new THREE.Mesh(mesh_geometry, mesh_material);
    mesh.position.x = x;
    mesh.position.z = z;
    
    group.add(mesh);
    return mesh;
}

class Prism { 
    constructor(x, z, h) {
        this.height = h;
        this.height_pre = h;
        this.height_pre2 = h;
        this.mesh = prism(x, z);
        this.updateHeight();
        totalheight += h;
    }
    updateHeight() {
        this.mesh.scale.y = this.height;
        this.mesh.position.y = (this.height / 2) * 0.25;
        this.mesh.visible = false;
        this.height_pre2 = this.height_pre;
        this.height_pre = this.height;
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
function init_wave() { 
    let verts = [];
    let colors = [];
    let faces = [];
    
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
function update_wave() {
    let verts = [];
    let colors = [];
    let faces = [];

    // 0 - 41
    for (i = 0; i < 6; i++) {
        for (j = 0; j < 7; j++) {
            verts.push(-0.625 + 1.25 * i / 5, Prisms[i * 7 + j].height / 4, -0.75 + 1.5 * j / 6);
            colors.push(Prisms[i * 7 + j].height / 4, Prisms[i * 7 + j].height / 4, 1);
        }
    }
    // 42 - 83
    for (i = 0; i < 6; i++) {
        for (j = 0; j < 7; j++) {
            verts.push(-0.625 + 1.25 * i / 5, 0, -0.75 + 1.5 * j / 6);
            colors.push(0, 0, 1);
        }
    }
    for (i = 0; i < 5; i++) {
        for (j = 0; j < 6; j++) {
            const index = i * 7 + j;
            faces.push(index, index + 7 + 1, index + 7);
            faces.push(index, index + 1, index + 7 + 1);
        }
    }
    for (i = 0; i < 5; i++) {
        const index = i * 7;
        faces.push(index, index + 42 + 7, index + 42);
        faces.push(index, index + 7, index + 42 + 7);
    }
    for (i = 0; i < 5; i++) {
        const index = i * 7 + 6;
        faces.push(index, index + 42, index + 42 + 7);
        faces.push(index, index + 42 + 7, index + 7);
    }
    for (j = 0; j < 6; j++) {
        const index = 0 * 7 + j;
        faces.push(index, index + 42, index + 42 + 1);
        faces.push(index, index + 42 + 1, index + 1);
    }
    for (j = 0; j < 6; j++) {
        const index = 5 * 7 + j;
        faces.push(index, index + 42 + 1, index + 42);
        faces.push(index, index + 1, index + 42 + 1);
    }

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
    mesh_material.transparent = true;
    mesh_material.opacity = 0.5;
    group.children[6 * 7] = new THREE.Mesh(mesh_geometry, mesh_material);

};

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
const camera = new THREE.PerspectiveCamera();
scene.add(camera);

for (i = 0; i < 6; i++) {
    for (j = 0; j < 7; j++) {
        const x = -0.625 + 1.25 * i / 5;
        const y = -0.75 + 1.5 * j / 6;
        const p = new Prism(x, y, (i + j + 3) * 0.4);
        Prisms.push(p);
    }
}

init_wave();

const loader = new THREE.OBJLoader();
let ship_obj;

loader.load(
    'data/ship.obj',
    function (obj) {
        ship_obj = obj;
        group.add(obj);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    }
);
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
    patternUrl: 'data/pattern-ship.patt',
    changeMatrixMode: 'cameraTransformMatrix'
});

const markerPlane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    new THREE.MeshBasicMaterial({
        colorWrite: false,
        depthWrite: false,
    })
);
markerPlane.rotation.x = -0.5 * Math.PI;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const raycaster = new THREE.Raycaster();
let touched = false;
let mouse = new THREE.Vector2(0, 0);

renderer.domElement.addEventListener('touchstart', (event) => {
    event.preventDefault();
    touched = true;
    const touch = event.touches[0];
    const element = event.currentTarget;
    const x = touch.clientX - element.offsetLeft;
    const y = touch.clientY - element.offsetTop;
    const w = element.offsetWidth;
    const h = element.offsetHeight;
    mouse = new THREE.Vector2((x / w) * 2 - 1, -(y / h) * 2 + 1);
});

renderer.domElement.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const element = event.currentTarget;
    const x = touch.clientX - element.offsetLeft;
    const y = touch.clientY - element.offsetTop;
    const w = element.offsetWidth;
    const h = element.offsetHeight;
    mouse = new THREE.Vector2((x / w) * 2 - 1, -(y / h) * 2 + 1);
});
renderer.domElement.addEventListener('touchend', (event) => {
    event.preventDefault();
    touched = false;
});
renderer.domElement.addEventListener('touchcancel', (event) => {
    event.preventDefault();
    touched = false;
});
function control() {
    raycaster.setFromCamera(mouse, camera);

    for (i = 0; i < 6; i++) {
        for (j = 0; j < 7; j++) {
            const mesh = group.children[i * 7 + j];
            const intersects = raycaster.intersectObject(mesh);
            if (intersects.length !== 0) {
                console.log(i * 7 + j);
                Prisms[i * 7 + j].height_pre += (4 - Prisms[i * 7 + j].height_pre) / 20;
                Prisms[i * 7 + j].height_pre2 += (4 - Prisms[i * 7 + j].height_pre) / 20;
            }
        }
    }
}
let sec_pre = 0;
// animation
requestAnimationFrame(function animate() {
    requestAnimationFrame(animate);

    let sec = performance.now() / 1000 - sec_pre;
    sec_pre += sec;
    if (sec > 0.05) sec = 0.05;

    if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
        scene.visible = camera.visible;

        if (camera.visible) {
            if (touched) control();
            let sum = 0;
            for (i = 0; i < 6; i++) {
                for (j = 0; j < 7; j++) {
                    let h = Prisms[i * 7 + j].height_pre;
                    const k = 0.999;
                    const s = 0.5 * sec * sec;
                    h += (Prisms[i * 7 + j].height_pre - Prisms[i * 7 + j].height_pre2) * k;
                    if (i < 5)
                        h -= (Prisms[i * 7 + j].height_pre - Prisms[(i + 1) % 6 * 7 + j].height_pre) * s;
                    if (i > 0)
                        h -= (Prisms[i * 7 + j].height_pre - Prisms[(i + 5) % 6 * 7 + j].height_pre) * s;
                    if (j < 6)
                        h -= (Prisms[i * 7 + j].height_pre - Prisms[i % 6 * 7 + (j + 1) % 7].height_pre) * s;
                    if (j > 0)
                        h -= (Prisms[i * 7 + j].height_pre - Prisms[i % 6 * 7 + (j + 6) % 7].height_pre) * s;

                    Prisms[i * 7 + j].height = h;// (1.1 + Math.cos(sec + i * 0.3) * 0.5 + Math.sin(sec + j * 0.7) * 0.5) * 3;
                    sum += h;
                }
            }
            for (i = 0; i < 6; i++) {
                for (j = 0; j < 7; j++) {
                    Prisms[i * 7 + j].height -= (sum - totalheight) / 42 * 0.001;
                    Prisms[i * 7 + j].updateHeight();
                }
            }
            update_wave();
            ship_obj.position.y = Prisms[2 * 7 + 3].height / 8 + Prisms[3 * 7 + 3].height / 8;
            ship_obj.rotation.x = (Prisms[2 * 7 + 2].height / 8 + Prisms[2 * 7 + 2].height / 8
                - Prisms[2 * 7 + 4].height / 8 - Prisms[2 * 7 + 4].height / 8);
            ship_obj.rotation.z = - (Prisms[2 * 7 + 3].height / 4 - Prisms[3 * 7 + 3].height / 4);
        }
    }
    
	renderer.render(scene, camera);
});