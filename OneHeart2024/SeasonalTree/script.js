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
InitRand();
InitTreeParams();
var group = new THREE.Group();

function GrowthRatio(gen, num) {
    let val = num / 60 - (5 - gen);
    if (val < 0) {
        val = 0;
    } else if (val > 1) {
        val = 1;
    }
    return val;
}
function GrowthRatio2(gen, num) {
    let val = num / 60 - (6 - gen);
    if (val < 0) {
        val = 0;
    } else if (val > 1) {
        val = 1;
    }
    return val;
}
function InitRand() { 
    for (let i = 0; i < 1024 * 2; i++) { 
        rand_dic.push(Math.random());
    }
}
function InitTreeParams() {
    tree_wid_ave = 0.45 + 0.3 * Math.random();
    tree_wid_amp = 0.1  + 0.2 * Math.random();
    tree_len_ave = 0.6  + 0.4 * Math.random();
    tree_len_amp = 0.1  + 0.3 * Math.random();
    tree_dir_amp = 30 * Math.random();
    tree_ang_ave = 15 + 40 * Math.random();
    tree_ang_amp = 5 + 35 * Math.random();
    tree_col_amp = 0.02 + 0.2 * Math.random();
    tree_col_rat = Math.random();
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
    
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * tree_col_amp + ave + 1;
    return num - Math.floor(num);
}
function randomColor(orig) { 
    const color = new THREE.Color();
    color.setHSL(boxMuller01(0.7 - normalizedDay), 1.0, 0.7);
    let colVec = new THREE.Vector3(color.r, color.g, color.b);
    return colVec.lerp(orig, MyRandom() * tree_col_rat);
}
function randomColor() {
    const color = new THREE.Color();
    color.setHSL(boxMuller01(0.7 - normalizedDay), 1.0, 0.7);
    let colVec = new THREE.Vector3(color.r, color.g, color.b);
    return colVec;
}
function branch(gen, T)
{
    if (gen > 0) {
        T.changeLen(tree_len_ave);
        T.changeWid(tree_wid_ave);

        const T1 = T.duplicate();
        const T2 = T.duplicate();

        let ave_a = 120;
        let amp_a = tree_dir_amp;
        let min_a = ave_a - amp_a / 2;

        let ave_b = tree_ang_ave;
        let amp_b = tree_ang_amp;
        let min_b = ave_b - amp_b / 2;

        T1.roll(deg2rad(ave_a + MyRandom() * amp_a));
        T1.turn(deg2rad(min_b + MyRandom() * amp_b));

        ave_a = -120;
        min_a = ave_a - amp_a / 2;
        T2.roll(deg2rad(min_a + MyRandom() * amp_a));
        T2.turn(deg2rad(min_b + MyRandom() * amp_b));

        ave_a = 0;
        min_a = ave_a - amp_a / 2;
        T.roll(deg2rad(ave_a + MyRandom() * amp_a));
        T.turn(deg2rad(min_b + MyRandom() * amp_b));

        const ave_r = 1.0;
        const amp_r = tree_wid_amp;
        const min_r = ave_r - amp_r / 2;
        T.changeLen(min_r + MyRandom() * amp_r);
        T.changeWid(min_r + MyRandom() * amp_r);
        T1.changeLen(min_r + MyRandom() * amp_r);
        T1.changeWid(min_r + MyRandom() * amp_r);
        T2.changeLen(min_r + MyRandom() * amp_r);
        T2.changeWid(min_r + MyRandom() * amp_r);

        const seg = 3;
        T.draw_windingly(seg, GrowthRatio(gen, count), GrowthRatio2(gen, count));
        T1.draw_windingly(seg, GrowthRatio(gen, count), GrowthRatio2(gen, count));
        T2.draw_windingly(seg, GrowthRatio(gen, count), GrowthRatio2(gen, count));

        branch(gen - 1, T);
        branch(gen - 1, T1);
        branch(gen - 1, T2);
    }
}
class Turtle {
    constructor() { 
        this.length = 1 * 0.8;
        this.width = 0.15 * 0.6;
        this.pos = new THREE.Vector3(0, 0, 0);
        this.front = new THREE.Vector3(0, 1, 0);
        this.up = new THREE.Vector3(0, 0, 1);
        this.col = new THREE.Vector3(1, 1, 1); //randomColor();
    }
    
    duplicate() {
        let t = new Turtle();
        t.length = this.length;
        t.width = this.width;
        t.pos = this.pos.clone();
        t.front = this.front.clone();
        t.up = this.up.clone();
        t.col = this.col.clone();
        return t;
    }
    draw() {
        //draw_line(this.pos, this.pos.clone().add(this.front.clone().multiplyScalar(this.length)), this.width);
        move();
    }
    draw_windingly(segments, growth, growth2) {
        branchID++;
        let verts = [];
        let colors = [];
        let nor = this.up.clone().cross(this.front);
        let slide_vec = [];
        let end_col = randomColor(this.col);

        for (let seg = 0; seg < segments - 1; seg++) {
            const slide_dir = MyRandom() * Math.PI;
            const slide_dis = MyRandom() * this.width * growth;
            let tmp_vec = nor.clone();
            tmp_vec.multiplyScalar(Math.cos(slide_dir));
            tmp_vec.add(this.up.clone().multiplyScalar(Math.sin(slide_dir)));
            tmp_vec.multiplyScalar(slide_dis);
            slide_vec.push(tmp_vec);
        }

        for (let i = 0; i < 16; i++) {
            const t = 2 * Math.PI / 16 * i;

            for (let seg = 0; seg < segments + 1; seg++)
            { 
                let ratio = seg / segments
                let tmp_vec = this.pos.clone();
                tmp_vec.add(this.front.clone().multiplyScalar(this.length * ratio * growth))
                let tmp_vec2 = nor.clone();
                tmp_vec2.multiplyScalar(Math.cos(t));
                tmp_vec2.add(this.up.clone().multiplyScalar(Math.sin(t)));
                let wid_rat = 0.5 * growth2;
                tmp_vec2.multiplyScalar(this.width * growth * (1.0 - (1.0 - wid_rat) * ratio));
                tmp_vec.add(tmp_vec2);
                if (seg > 0 && seg < segments) { 
                    tmp_vec.add(slide_vec[seg - 1]);
                }
                verts.push(tmp_vec.x, tmp_vec.y, tmp_vec.z);
                let lerp_col = this.col.clone().lerp(end_col, ratio);
                //let lerp_col = this.col.clone();
                colors.push(lerp_col.x, lerp_col.y, lerp_col.z);
            }
        }

        let faces = [];
        for (let i = 0; i < 16; i++) {
            const j = (i + 1) % 16;
            for (let seg = 0; seg < segments; seg++) {
                faces.push(i * (segments + 1) + seg + 1, i * (segments + 1) + seg, j * (segments + 1) + seg);
                faces.push(i * (segments + 1) + seg + 1, j * (segments + 1) + seg, j * (segments + 1) + seg + 1);
            }
        }
        verts.push(this.pos.x, this.pos.y, this.pos.z);
        colors.push(this.col.x, this.col.y, this.col.z);
        this.pos.add(this.front.clone().multiplyScalar(this.length * growth));
        verts.push(this.pos.x, this.pos.y, this.pos.z);
        colors.push(end_col.x, end_col.y, end_col.z);
        this.col = end_col.clone();

        for (let i = 0; i < 16; i++) {
            const j = (i + 1) % 16;
            faces.push(i * (segments + 1), 16 * (segments + 1), j * (segments + 1));
            faces.push(i * (segments + 1) + segments, j * (segments + 1) + segments, 16 * (segments + 1) + 1);
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
        const mesh_material = new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors });
        const mesh = new THREE.Mesh(mesh_geometry, mesh_material);
        meshes.push(mesh);
        group.add(mesh);
    }
    move() {
        this.pos = this.pos.clone().add(this.front.clone().multiplyScalar(this.length));
    }
    move_delta(delta) {
        this.pos = this.pos.clone().add(delta);
    }
    roll(angle) { 
        let nor = this.up.clone().cross(this.front);
        this.up = this.up.clone().multiplyScalar(Math.cos(angle)).add(nor.multiplyScalar(Math.sin(angle)));
    }
    
    turn(angle) {
        let nor = this.front.clone().cross(this.up);
        this.front = this.front.clone().multiplyScalar(Math.cos(angle)).add(nor.multiplyScalar(Math.sin(angle)));
    }
    
    changeLen(ratio) {
        this.length = this.length * ratio;
    }
    
    changeWid(ratio) {
        this.width = this.width * ratio;
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
    patternUrl: 'data/pattern-seed.patt',
    changeMatrixMode: 'cameraTransformMatrix'
});


const gen = 4;
let t = new Turtle();
t.draw_windingly(3, GrowthRatio(gen + 1, count), GrowthRatio2(gen + 1, count));
branch(gen, t);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

var isDragging = false;
var previousTouchPosition = {
    x: 0,
    y: 0
};
var initialDistance = null;
function getDistance(touches) {
    var dx = touches[0].pageX - touches[1].pageX;
    var dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
}

document.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
        e.preventDefault();
        isDragging = true;
        previousTouchPosition = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
        };
    }
    if (e.touches.length === 2) {
        e.preventDefault();
        initialDistance = getDistance(e.touches);
    }
}, { passive: false });

document.addEventListener('touchmove', function (e) {
    if (isDragging) {
        e.preventDefault();
        var currentTouchPosition = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
        };

        var deltaMove = {
            x: currentTouchPosition.x - previousTouchPosition.x,
            y: currentTouchPosition.y - previousTouchPosition.y
        };

        var rotationSpeed = 0.005;
        group.rotation.y += deltaMove.x * rotationSpeed;
        group.rotation.x += deltaMove.y * rotationSpeed;

        previousTouchPosition = {
            x: currentTouchPosition.x,
            y: currentTouchPosition.y
        };
    }
    if (e.touches.length === 2) {
        var currentDistance = getDistance(e.touches);
        if (initialDistance) {
            e.preventDefault();
            var scale = currentDistance / initialDistance;
            group.scale.set(scale, scale, scale);
        }
    }
}, { passive: false });

document.addEventListener('touchend', function (e) {
    isDragging = false;
    initialDistance = null;
});

// animation
requestAnimationFrame(function animate() {
    requestAnimationFrame(animate);

    if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
        scene.visible = camera.visible;

        if (count < 300 && camera.visible) {
            count++;
            for (let i = 0; i < branchID; i++) {
                if (meshes[i].geometry) {
                    meshes[i].geometry.dispose();
                }
                if (meshes[i].material) {
                    if (meshes[i].material instanceof Array) {
                        meshes[i].material.forEach(material => material.dispose());
                    } else {
                        meshes[i].material.dispose();
                    }
                }
                group.remove(meshes[i]);
            }
            meshes.length = 0;

            randID = 0;
            branchID = 0;
            t = new Turtle();
            t.draw_windingly(3, GrowthRatio(gen + 1, count), GrowthRatio2(gen + 1, count));
            branch(gen, t);
        }
    }
    
	renderer.render(scene, camera);
});