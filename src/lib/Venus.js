import * as THREE from "three";
import Planet from "./Planet";

import VenusTexture from "../images/textures/venus.jpg";
import VenusClouds from "../images/textures/venus_clouds.jpg";

export default class Venus extends Planet {

    constructor() {
        super(VenusTexture);
    } 

    getMesh() {
        if (this.group === undefined || this.group === null) {
            this.createVenus();
            this.createClouds();
            this.group = new THREE.Group();
            this.group.add(this.venusMesh);
            this.group.add(this.cloudMesh);

            this.group.position.x = this.position.x;
        }

        return this.group;
    }

    createVenus() {
        const geometry = new THREE.SphereGeometry(this.radius);

        const texture = new THREE.TextureLoader().load(VenusTexture);
        const material = new THREE.MeshStandardMaterial({ map: texture });       

        this.venusMesh = new THREE.Mesh(geometry, material,);
    }

    createClouds() {
        const geometry = new THREE.SphereGeometry(this.radius + 0.05);
        const texture = new THREE.TextureLoader().load(VenusClouds);
        const material = new THREE.MeshStandardMaterial({ 
            map: texture ,
            opacity: 0.4,
            transparent: true,
        });

        this.cloudMesh = new THREE.Mesh(geometry, material);        
    }

    rotate() {
        const value = this.getRotationSpeed();
        if (this.group !== undefined || this.group !== null) {
            this.group.rotation.y += value;
        }

        this.cloudMesh.rotateY(value / 10);
    }
}