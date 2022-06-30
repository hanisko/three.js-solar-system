import * as THREE from "three";
import Planet from "./Planet";

import MoonTexture from "../images/textures/moon.jpg";
import MoonNormalMapTexture from "../images/textures/moon_normals.png";

const RADIUS = 17; // 1 737 km
const DISTANCE_FROM_EARTH = 15; // 384 400 km

export default class Moon extends Planet {

    constructor() {
        super(MoonTexture);

    }

    getMesh() {
        if (this.mesh === undefined || this.mesh === null) {
            const geometry = new THREE.SphereGeometry(this.radius);

            const texture = new THREE.TextureLoader().load(this.textureFile);

            const material = new THREE.MeshStandardMaterial({ map: texture });

            const normalMapTexture = new THREE.TextureLoader().load(MoonNormalMapTexture);
            material.normalMap = normalMapTexture;

            this.mesh = new THREE.Mesh(geometry, material);

            this.mesh.rotation.y = Math.PI / 1.2;

            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;

        }
        return this.mesh;
    }    
}