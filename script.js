const mesh_vertices = [];
mesh_vertices.push(-1.0, -1.0, 0.0);
mesh_vertices.push(1.0, -1.0, 0.0);
mesh_vertices.push(1.0, 1.0, 0.0);
mesh_vertices.push(-1.0, 1.0, 0.0);

const mesh_indices = [];
mesh_indices.push(0, 1, 2);
mesh_indices.push(2, 3, 0);

const meshes = [];
const now = new Date();
const normalizedDay = normalizeDate(now);
const rand_dic = [];

let branchID = 0;
let randID = 0;
InitRand();

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
    
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * 0.12 + ave + 1;
    return num - Math.floor(num);
}
function randomColor(orig) { 
    const color = new THREE.Color();
    color.setHSL(boxMuller01(0.7 - normalizedDay), 1.0, 0.7);
    let colVec = new THREE.Vector3(color.r, color.g, color.b);
    return colVec.lerp(orig, MyRandom());
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
        T.changeLen(0.8);
        T.changeWid(0.5);

        const T1 = T.duplicate();
        const T2 = T.duplicate();
        T1.roll(deg2rad(110 + MyRandom() * 20));
        T1.turn(deg2rad(20 + MyRandom() * 20));
        T2.roll(deg2rad(-110 - MyRandom() * 20));
        T2.turn(deg2rad(20 + MyRandom() * 20));
        T.roll(deg2rad(-10 + MyRandom() * 20));
        T.turn(deg2rad(20 + MyRandom() * 20));

        T.changeLen(0.8 + MyRandom() * 0.4);
        T.changeWid(0.8 + MyRandom() * 0.4);
        T1.changeLen(0.8 + MyRandom() * 0.4);
        T1.changeWid(0.8 + MyRandom() * 0.4);
        T2.changeLen(0.8 + MyRandom() * 0.4);
        T2.changeWid(0.8 + MyRandom() * 0.4);

        const seg = 3;
        T.draw_windingly(seg);
        T1.draw_windingly(seg);
        T2.draw_windingly(seg);

        branch(gen - 1, T);
        branch(gen - 1, T1);
        branch(gen - 1, T2);
    }
}
class Turtle {
    constructor() { 
        this.length = 1 * 0.2;
        this.width = 0.15 * 0.2;
        this.pos = new THREE.Vector3(0, 0, 0);
        this.front = new THREE.Vector3(0, 0, 1);
        this.up = new THREE.Vector3(0, 1, 0);
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
    draw_windingly(segments) {
        branchID++;
        let verts = [];
        let colors = [];
        let nor = this.up.clone().cross(this.front);
        let slide_vec = [];
        let end_col = randomColor(this.col);

        for (let seg = 0; seg < segments - 1; seg++) {
            const slide_dir = MyRandom() * Math.PI;
            const slide_dis = MyRandom() * this.width;
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
                tmp_vec.add(this.front.clone().multiplyScalar(this.length * ratio))
                let tmp_vec2 = nor.clone();
                tmp_vec2.multiplyScalar(Math.cos(t));
                tmp_vec2.add(this.up.clone().multiplyScalar(Math.sin(t)));
                tmp_vec2.multiplyScalar(this.width * (1.0 - 0.5 * ratio));
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
        this.pos.add(this.front.clone().multiplyScalar(this.length));
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
        scene.add(mesh);
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
const camera = new THREE.OrthographicCamera(-1, +1, height / width, -height / width, 0.01, 1000);
camera.position.z = 1;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);
const controls = new THREE.OrbitControls(camera, renderer.domElement);

let t = new Turtle();
t.draw_windingly(3);
branch(4, t);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// animation
function animation(time) {

    let t = time / 5000;

    for (let i = 0; i < branchID; i++) {
        console.log(i);
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
        scene.remove(meshes[i]);

        //vertices = meshes[i].geometry.attributes.position.array;
        //meshes[i].geometry.attributes.position.needsUpdate = true;
        //meshes[i].geometry.computeBoundingBox();
        //meshes[i].geometry.computeBoundingSphere();
    }
    meshes.length = 0;

    randID = 0;
    branchID = 0;
    t = new Turtle();
    t.draw_windingly(3);
    branch(4, t);

	controls.update(); 
	renderer.render(scene, camera);
}