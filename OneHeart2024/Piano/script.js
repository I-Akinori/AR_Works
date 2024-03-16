let count = 0;
const Rings = [];
const Keys = [];
const KeyPressed = [];
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
let totalheight = 0;
let touched = false;
var group = new THREE.Group();

function randomColor() {
    const color = new THREE.Color();
    color.setHSL(Math.random(), 1.0, 0.7);
    return color;
}
function whiteKey(z) {
    const mesh_geometry = new THREE.BoxGeometry(1.25, 0.25, 0.23);

    const colHSL = new THREE.Color(0xffffff);
    const mesh_material = new THREE.MeshStandardMaterial({
        color: colHSL, metalness: 0.0, roughness: 0.0
    });
    const mesh = new THREE.Mesh(mesh_geometry, mesh_material);
    mesh.position.z = z;
    mesh.position.y = (0.25 / 2) * 0.25;

    group.add(mesh);
    return mesh;
}
function blackKey(z) {
    const mesh_geometry = new THREE.BoxGeometry(1.25 / 2, 0.25, 0.2);

    const colHSL = new THREE.Color(0x000000);
    const mesh_material = new THREE.MeshStandardMaterial({
        color: colHSL, metalness: 0.0, roughness: 0.0
    });
    const mesh = new THREE.Mesh(mesh_geometry, mesh_material);
    mesh.position.x = -1.25 / 4 - 0.125 / 2;
    mesh.position.y = (0.25 / 2 + 0.5) * 0.25;
    mesh.position.z = z;
    
    group.add(mesh);
    return mesh;
}

function ring(x, y, z) {
    const mesh_geometry = new THREE.RingGeometry(0.4, 0.5, 32);
    const mesh_material = new THREE.MeshPhongMaterial({ color: randomColor(), transparent: true, opacity: 0.8 });
    const mesh = new THREE.Mesh(mesh_geometry, mesh_material);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    mesh.rotation.x = - Math.PI / 2;
    
    group.add(mesh);
    return mesh;
}

class Ring { 
    constructor(x, y, z) {
        this.time = 60;
        this.mesh = ring(x, y, z);
        this.updateScale();
    }
    updateScale() {
        this.mesh.scale.x = this.mesh.scale.x * 1.07;
        this.mesh.scale.y = this.mesh.scale.y * 1.07;
        this.mesh.scale.z = this.mesh.scale.z * 1.07;
        this.mesh.position.y = this.mesh.position.y - 0.01;
        this.mesh.material.opacity = this.mesh.material.opacity * 0.93;
        this.time = this.time - 1;

        console.log(this.time);
        return this.time < 0;
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
camera.add(listener);
scene.add(camera);

const sounds = [];
const C  = new THREE.Audio(listener);
const Cs = new THREE.Audio(listener);
const D  = new THREE.Audio(listener);
const Ds = new THREE.Audio(listener);
const E  = new THREE.Audio(listener);
const F  = new THREE.Audio(listener);
const Fs = new THREE.Audio(listener);
const G  = new THREE.Audio(listener);
const Gs = new THREE.Audio(listener);
const A  = new THREE.Audio(listener);
const As = new THREE.Audio(listener);
const B = new THREE.Audio(listener);
sounds.push(C);
sounds.push(D);
sounds.push(E);
sounds.push(F);
sounds.push(G);
sounds.push(A);
sounds.push(B);
sounds.push(Cs);
sounds.push(Ds);
sounds.push(Fs);
sounds.push(Gs);
sounds.push(As);

audioLoader.load('data/C.mp3', function(buffer){
    C.setBuffer(buffer);
    C.setLoop(false);
    C.setVolume(0.5);
});

audioLoader.load('data/Cs.mp3', function (buffer) {
    Cs.setBuffer(buffer);
    Cs.setLoop(false);
    Cs.setVolume(0.5);
});

audioLoader.load('data/D.mp3', function (buffer) {
    D.setBuffer(buffer);
    D.setLoop(false);
    D.setVolume(0.5);
});

audioLoader.load('data/Ds.mp3', function (buffer) {
    Ds.setBuffer(buffer);
    Ds.setLoop(false);
    Ds.setVolume(0.5);
});

audioLoader.load('data/E.mp3', function (buffer) {
    E.setBuffer(buffer);
    E.setLoop(false);
    E.setVolume(0.5);
});

audioLoader.load('data/F.mp3', function (buffer) {
    F.setBuffer(buffer);
    F.setLoop(false);
    F.setVolume(0.5);
});

audioLoader.load('data/Fs.mp3', function (buffer) {
    Fs.setBuffer(buffer);
    Fs.setLoop(false);
    Fs.setVolume(0.5);
});

audioLoader.load('data/G.mp3', function (buffer) {
    G.setBuffer(buffer);
    G.setLoop(false);
    G.setVolume(0.5);
});

audioLoader.load('data/Gs.mp3', function (buffer) {
    Gs.setBuffer(buffer);
    Gs.setLoop(false);
    Gs.setVolume(0.5);
});

audioLoader.load('data/A.mp3', function (buffer) {
    A.setBuffer(buffer);
    A.setLoop(false);
    A.setVolume(0.5);
});

audioLoader.load('data/As.mp3', function (buffer) {
    As.setBuffer(buffer);
    As.setLoop(false);
    As.setVolume(0.5);
});

audioLoader.load('data/B.mp3', function (buffer) {
    B.setBuffer(buffer);
    B.setLoop(false);
    B.setVolume(0.5);
});
//pannel();
for (i = 0; i < 7; i++) {
    Keys.push(whiteKey((1 - i / 6) * 1.5 - 0.75));
    KeyPressed.push(false); 
}
for (i = 0; i < 5; i++) {
    Keys.push(blackKey((1 - (i + 0.5 + (i < 2 ? 0 : 1)) / 6) * 1.5 - 0.75));
    KeyPressed.push(false);
}
group.rotation.y = -Math.PI / 2;
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
    patternUrl: 'data/pattern-piano.patt',
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
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, 1, -0.3).normalize();
scene.add(directionalLight2);


const raycaster = new THREE.Raycaster();
renderer.domElement.addEventListener('touchstart', (event) => {
    tourched = true;
    event.preventDefault();
    const num = event.touches.length;
    const indexes = [];
    for (i = 0; i < num; i++) {
        const touch = event.touches[i];
        const element = event.currentTarget;
        const x = touch.clientX - element.offsetLeft;
        const y = touch.clientY - element.offsetTop;
        const w = element.offsetWidth;
        const h = element.offsetHeight;
        const mouse = new THREE.Vector2((x / w) * 2 - 1, -(y / h) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(Keys);
        if (intersects.length !== 0) {
            index = Keys.indexOf(intersects[0].object);
            if (!indexes.includes(index)) {
                indexes.push(index);
                if (!KeyPressed[index]) {
                    if (sounds[index].isPlaying) {
                        sounds[index].stop();
                    }
                    Rings.push(new Ring(Keys[index].position.x, Keys[index].position.y + 0.1, Keys[index].position.z));
                }
                KeyPressed[index] = true;
                sounds[index].play();
            }
        }
    }
});
renderer.domElement.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const num = event.touches.length;
    const indexes = [];
    for (i = 0; i < num; i++) {
        const touch = event.touches[i];
        const element = event.currentTarget;
        const x = touch.clientX - element.offsetLeft;
        const y = touch.clientY - element.offsetTop;
        const w = element.offsetWidth;
        const h = element.offsetHeight;
        const mouse = new THREE.Vector2((x / w) * 2 - 1, -(y / h) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(Keys);
        if (intersects.length !== 0) {
            index = Keys.indexOf(intersects[0].object);
            if (!indexes.includes(index)) {
                indexes.push(index);
                if (!KeyPressed[index]) {
                    if (sounds[index].isPlaying) {
                        sounds[index].stop();
                    }
                    Rings.push(new Ring(Keys[index].position.x, Keys[index].position.y + 0.1, Keys[index].position.z));
                }
                KeyPressed[index] = true;
                sounds[index].play();
            }
        }
    }

    for (i = 0; i < 12; i++) {
        if (!indexes.includes(i) && KeyPressed[i]) {
            KeyPressed[i] = false;
            //sounds[i].stop();
        }
    }
});
renderer.domElement.addEventListener('touchend', (event) => {
    tourched = false;
    const num = event.touches.length;
    const indexes = [];
    for (i = 0; i < num; i++) {
        const touch = event.touches[i];
        const element = event.currentTarget;
        const x = touch.clientX - element.offsetLeft;
        const y = touch.clientY - element.offsetTop;
        const w = element.offsetWidth;
        const h = element.offsetHeight;
        const mouse = new THREE.Vector2((x / w) * 2 - 1, -(y / h) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(Keys);
        if (intersects.length !== 0) {
            index = Keys.indexOf(intersects[0].object);
            if (!indexes.includes(index)) {
                indexes.push(index);
                //KeyPressed[index] = true;
                //sounds[index].play();
            }
        }
    }
    for (i = 0; i < 12; i++) {
        if (!indexes.includes(i) && KeyPressed[i]) {
            KeyPressed[i] = false;
            //sounds[i].stop();
        }
    }
});
renderer.domElement.addEventListener('touchcancel', (event) => {
    tourched = false;
    const num = event.touches.length;
    const indexes = [];
    for (i = 0; i < num; i++) {
        const touch = event.touches[i];
        const element = event.currentTarget;
        const x = touch.clientX - element.offsetLeft;
        const y = touch.clientY - element.offsetTop;
        const w = element.offsetWidth;
        const h = element.offsetHeight;
        const mouse = new THREE.Vector2((x / w) * 2 - 1, -(y / h) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(Keys);
        if (intersects.length !== 0) {
            index = Keys.indexOf(intersects[0].object);
            if (!indexes.includes(index)) {
                indexes.push(index);
                //KeyPressed[index] = true;
                //sounds[index].play();
            }
        }
    }
    for (i = 0; i < 12; i++) {
        if (!indexes.includes(i) && KeyPressed[i]) {
            KeyPressed[i] = false;
            //sounds[i].stop();
        }
    }
});

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
            for (i = 0; i < 7; i++) {
                if (KeyPressed[i]) {
                    Keys[i].position.y = (0.25 / 2) * 0.25 - 0.1;
                    Keys[i].material.color = new THREE.Color(0xffaaaa);
                } else {
                    Keys[i].position.y = (0.25 / 2) * 0.25;
                    Keys[i].material.color = new THREE.Color(0xffffff);
                }
            }
            for (i = 7; i < 12; i++) {
                if (KeyPressed[i]) {
                    Keys[i].position.y = (0.25 / 2 + 0.5) * 0.25 - 0.1;
                    Keys[i].material.color = new THREE.Color(0x550000);
                } else {
                    Keys[i].position.y = (0.25 / 2 + 0.5) * 0.25;
                    Keys[i].material.color = new THREE.Color(0x000000);
                }
            }
            for (let i = Rings.length - 1; i >= 0; i--) {
                if (Rings[i].updateScale()) {
                    Rings[i].dispose();
                    Rings.splice(i, 1);
                }
            }
            console.log(Rings.length);
        }
    }
    
	renderer.render(scene, camera);
});