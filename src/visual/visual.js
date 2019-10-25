const THREE = require('three');
const glslify = require('glslify');
const properties = require('../core/properties');

exports.preInit = preInit;
exports.init = init;
exports.resize = resize;
exports.update = update;

exports.container = null;

let _gridSize = 10;
let _gridPoints = [];
let _InitialPositions = [
    //spinBones
    0, 0, 0, 
    0, 1, 0,
    0, 2, 0,
    0, 3, 0,
    //leftArm
    -1, 2, 0,
    -2, 3, 0,
    -2, 4, 0,
    //rightArm
    1, 2, 0,
    2, 3, 0,
    2, 4, 0,
    //leftLeg
    -1, -1, 0,
    -1, -2, 0,
    -1, -3, 0,
    -2, -4, 0,
    //RightLeg
    1, -1, 0,
    1, -2 ,0,
    1, -3, 0,
    2, -4, 0
];

let _testArmInitialPos = [
    0, 2, 0, // vert0
    -1, 2, 0, //vert1 
    -2, 2, 0, // vert2
    -3, 2, 0, //vert3
]


let _testArmBoneNdx = [
    0,0,
    0, 1,
    1, 2,
    2,2
]

let _weight = [
    1, 0,
    0.5, 0.5,
    0.5, 0.5,
    1, 0
];

function preInit() {
    exports.container = new THREE.Object3D();

}

function init () {
    let geo = new THREE.PlaneBufferGeometry( _gridSize,  _gridSize);
    let material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    let plane = new THREE.Mesh(geo, material);

    let pointGeo = new THREE.SphereGeometry(0.05, 0.05, 10);
    let pointMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff });
    let characterMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 });

    let testArmMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 });
    let lineMaterial = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
    lineMaterial.linewidth = 5;


    // helper grid
    for (let x = -_gridSize/2; x <  _gridSize/2+1; x++) {
        for (let y = -_gridSize/2; y <  _gridSize/2+1; y++) {
            let point = new THREE.Mesh(pointGeo, pointMaterial);
            point.position.set(x, y, 0);
            _gridPoints.push(point);
            plane.add(point);
        }
    } 

    //skeleton
    for(let i = 0; i< _InitialPositions.length; i+= 3) {
        let point = new THREE.Mesh(pointGeo, characterMaterial);
        point.position.set(_InitialPositions[i], _InitialPositions[i+1], _InitialPositions[i+2])
        point.scale.set(2, 2, 2);
        exports.container.add(point);
        
    }

    let leftArmRefGeometry = new THREE.Geometry();

    for(let i = 0; i< _testArmInitialPos.length; i+= 3) {
        let point = new THREE.Mesh(pointGeo, testArmMaterial);
        leftArmRefGeometry.vertices.push(new THREE.Vector3(_testArmInitialPos[i], _testArmInitialPos[i+1], _testArmInitialPos[i+2]));
        point.position.set(_testArmInitialPos[i], _testArmInitialPos[i+1], _testArmInitialPos[i+2])
        point.scale.set(2, 2, 2);
        exports.container.add(point);
        
    }

    let line = new THREE.Line(leftArmRefGeometry, lineMaterial);
    exports.container.add(plane);
    exports.container.add(line);

  

    let armTestVertices =  new Float32Array([
        0, 2, 0, // vert 0
        -1, 2, 0, //vert 1
        -2, 2, 0, //vert 2
        -3, 2, 0, //vert 3
    ]);

    let boneWeights = new Float32Array([
        1, 0, //bones[0]influence on vert 0 has a weight of 1
        0.5, 0.5, //bones[1] and bones[0] influences on vert 1 has a weight of 0.5
        0.5, 0.5,
        1, 0
    ])

    let boneIndices = new Float32Array([
        0, 0, //vert 0 is influenced by bones[0]
        0, 1, //vert 1 is infleunced by bones[0] and bones [1]
        1, 2, 
        2, 2 
    ]);

    let numBones = 3;
    let boneArray
    let boneMatrices = []; // uniform data
    let bones = []; //value before multiplying by inverse bind matric

    var bindPose = [];

    // for(let i = 0; i<numBones; i++) {
    //   boneMatrices.push(new Float32Array(boneArray.buffer, i * 3 * 9, 9));
    //   bindPose.push(m4.identity());
    //   bones.push(m4.identity()); 
    // }

    function computeMatrice(bone) {
      let m = new THREE.Matrix3().identity();
      m.set(
        bone.position.x,
        bone.position.y,
        bone.position.z,
        bone.rotation.x,
        bone.rotation.y,
        bone.rotation.Z,
        bone.scale.x,
        bone.scale.y,
        bone.scale.z
      )
    }


    let armBufferGeo = new THREE.BufferGeometry();
    armBufferGeo.addAttribute('a_position', new THREE.BufferAttribute( armTestVertices, 3));
    armBufferGeo.addAttribute('a_bonesIndex', new THREE.BufferAttribute( boneIndices, 2));
    armBufferGeo.addAttribute('a_boneWeights', new THREE.BufferAttribute( boneWeights, 2));


    let shaderMaterial = new THREE.ShaderMaterial ({
        uniforms : {
            u_bones : {value: boneMatrices}
        },
        vertexShader: glslify('./testSkinnedArm.vert'),
        fragmentShader: glslify('./testSkinnedArm.frag'),
    });

    

  
}

function resize (width, height) {

}

function update (dt) {

}

