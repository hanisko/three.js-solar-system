import * as THREE from "three";
import Planet from "./Planet";

import SunTexture from "../images/textures/sun.jpg";


export default class Sun extends Planet {

    constructor(scene) {
        super(SunTexture);

        this.getMesh();
        this.mesh.material.emissive.setHex(0xffff00)
        this.mesh.material.emissiveIntensity  = 0.1;
    }

    createSpotLight(scene, coord, sign = 1) {
        const size = this.radius * 2;
        const intesity = 3;
        const color = 0xFFFFFF;

        const sl = new THREE.SpotLight(color, intesity, size);
        sl.position[coord] = size * sign
        sl.angle /= 1.5;       
        scene.add(sl);
    }

    createLight(scene) {
        this.createSpotLight(scene, 'y');
        this.createSpotLight(scene, 'y', -1);
        this.createSpotLight(scene, 'x');
        this.createSpotLight(scene, 'x', -1);
        this.createSpotLight(scene, 'z');
        this.createSpotLight(scene, 'z', -1); 
    }
}