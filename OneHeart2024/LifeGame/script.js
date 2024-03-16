let count = 0;
const Prisms = [];
let totalheight = 0;
var group = new THREE.Group();

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
    const mesh_geometry = new THREE.BoxGeometry(0.11, 0.11, 0.11);

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
        this.life = h;
        this.life_pre = h;
        this.color = rainbow((x + z + 1.5) / 3);
        this.mesh = prism(x, z);
        this.updateLife();
    }
    updateLife() {
        this.mesh.material.transparent = true;
        if (this.life) {
            this.mesh.material.color = this.color;
            this.mesh.material.opacity = 0.8;
        }
        else {
            this.mesh.material.color = new THREE.Color(0x000000)
            this.mesh.material.opacity = 0.8;
        }
        this.life_pre = this.life;
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
//const camera = new THREE.OrthographicCamera(-1, +1, height / width, -height / width, 0.01, 1000);
const camera = new THREE.PerspectiveCamera();
scene.add(camera);

//pannel();
for (i = 0; i < 10; i++) {
    for (j = 0; j < 12; j++) {
        const x = -1.25 + 1.25 * ((i + 0.5) / 10 + 0.5);
        const y = -1.5 + 1.5 * ((j + 0.5) / 12 + 0.5);
        const t = Math.random() < 0.25;
        const p = new Prism(x, y, t);
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
    patternUrl: 'data/pattern-life.patt',
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

    event.preventDefault();
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
    touched = true;

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
renderer.domElement.addEventListener('touchcansel', (event) => {
    event.preventDefault();
    touched = false;
});

function control() { 
    raycaster.setFromCamera(mouse, camera);

    for (i = 0; i < 10; i++) {
        for (j = 0; j < 12; j++) {
            const mesh = group.children[i * 12 + j];
            const intersects = raycaster.intersectObject(mesh);
            if (intersects.length !== 0) {
                Prisms[i * 12 + j].life_pre = true;
                Prisms[i * 12 + j].life = true;
            }
        }
    }
};

let sec_pre = 0;
let lapse = 0;
// animation
requestAnimationFrame(function animate() {
    requestAnimationFrame(animate);

    let sec = performance.now() / 1000 - sec_pre;
    sec_pre += sec;
    if (sec > 0.1) sec = 0.1;
    lapse += sec;

    if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
        scene.visible = camera.visible;

        if (camera.visible && lapse > 0.2) {
            lapse = 0;

            if (touched) control();

            for (i = 0; i < 10; i++) {
                for (j = 0; j < 12; j++) {
                    let L = 0;
                    for (p = 0; p < 3; p++) {
                        for (q = 0; q < 3; q++) {
                            if (p == 1 && q == 1) { 
                                continue;
                            }
                            if (i + 9 + p == 9 || i + 9 + p == 20
                                || j + 11 + q == 11 || j + 11 + q == 24)
                                continue;
                            if (Prisms[(i + 9 + p) % 10 * 12 + (j + 11 + q) % 12].life_pre) {
                                L++;
                            }
                        }
                    }
                    if (Prisms[i * 12 + j].life_pre) {
                        if (L != 2 && L != 3) {
                            Prisms[i * 12 + j].life = false;
                        }
                    } else {
                        if (L == 3) {
                            Prisms[i * 12 + j].life = true;
                        }
                    }
                }
            }

            if (touched) control();

            for (i = 0; i < 10; i++) {
                for (j = 0; j < 12; j++) {
                    Prisms[i * 12 + j].updateLife();
                }
            }

        }
    }
    
	renderer.render(scene, camera);
});