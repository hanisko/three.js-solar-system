import * as THREE from "three";
import Planet from "./Planet";

import EarthSpecularMap from "../images/textures//earth_specular_map.png";
import EarthNormalMap from "../images/textures/earth_normal_map.png";
import EarthTexture from "../images/textures/earth.jpg";
import EarthClouds from "../images/textures/earth_clouds.jpg";

const EARTH_TILT = 23.4;

export default class Earth extends Planet {

    constructor() {
        super(EarthTexture);
    }


    getMesh() {
        if (this.group === undefined || this.group === null) {
            this.createEarth();
            this.createClouds();
            this.group = new THREE.Group();
            this.group.add(this.earthMesh);
            this.group.add(this.cloudMesh);


            var radians = 23.4 * Math.PI / 180; // tilt in radians
            this.group.children.forEach(function (mesh) {
                mesh.geometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(- radians))
            });
            this.group.updateMatrix();
            this.group.position.x = this.position.x;
        }

        return this.group;
    }

    createEarth() {
        const geometry = new THREE.SphereGeometry(this.radius);

        const texture = new THREE.TextureLoader().load(EarthTexture);
        const material = new THREE.MeshStandardMaterial({ map: texture });

        const material2 = new THREE.MeshPhongMaterial();
        const specularTexture = new THREE.TextureLoader().load(EarthSpecularMap);
        material2.specularMap = specularTexture;

        const normalMapTexture = new THREE.TextureLoader().load(EarthNormalMap);
        material.normalMap = normalMapTexture;

        this.earthMesh = new THREE.Mesh(geometry, material, material2);

        this.earthMesh.castShadow = true;
        this.earthMesh.receiveShadow = true;
    }

    createClouds() {
        const geometry = new THREE.SphereGeometry(this.radius + 0.1);
        const texture = new THREE.TextureLoader().load(EarthClouds);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            opacity: 0.4,
            transparent: true,
            // depthWrite: true
        });

        this.cloudMesh = new THREE.Mesh(geometry, material);
    }

    rotate() {
        const value = this.getRotationSpeed();
        if (this.group !== undefined || this.group !== null) {
            var radians = EARTH_TILT * Math.PI / 180; //  23.4 digreese tilt
            var earthAxis = new THREE.Vector3(Math.sin(radians), Math.cos(radians), 0).normalize();
            this.group.rotateOnAxis(earthAxis, value);
        }

        this.cloudMesh.rotateY(value / 10);
    }

}