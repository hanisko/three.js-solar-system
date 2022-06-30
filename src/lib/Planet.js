import * as THREE from "three";
import PlanetData from "../data/PlanetData"

export default class Planet {

    constructor(textureFile) {

        this.scaleFactor = 0.001;
        this.scaleRotationFactor = 0.1;
        this.scaleDistanceFactor = 0.00004;

        this.loadPlanetData(this.constructor.name.toLowerCase());
      
        this.radius = this.data.radius *   this.scaleFactor;
        this.rotationOwnAxis = this.data.rotations.ownAxis;
        this.orbitSpeed = this.data.rotations.sun;
        const xCoordinates =  this.data.distanceFromSun * this.scaleDistanceFactor;

        this.textureFile = textureFile;
        this.position = new THREE.Vector3(xCoordinates, 0, 0);

        this.createOrbitCircle();
    }

    loadPlanetData(name) {
        this.data = PlanetData[name];
    }

    createOrbitCircle() {
        const geometry = new THREE.RingGeometry(this.position.x - 1, this.position.x, 1000);
       
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        material.side = THREE.DoubleSide;
        this.orbit = new THREE.Mesh( geometry, material );

        this.orbit.rotation.x = Math.PI  * 3 / 2;
        this.orbit.visible = false;
    }

    getMesh() {
        if (this.mesh === undefined || this.mesh === null) {
            const geometry = new THREE.SphereGeometry(this.radius);

            const texture = new THREE.TextureLoader().load(this.textureFile);

            const material = new THREE.MeshStandardMaterial({ map: texture });

            this.mesh = new THREE.Mesh(geometry, material);
            
            this.mesh.position.x = this.position.x;

        }

        return this.mesh;
    }

    getRotationSpeed() {
        return 1 / this.rotationOwnAxis * this.scaleRotationFactor;
    }

    rotate() {
        if (this.mesh !== undefined || this.mesh !== null) {
            this.mesh.rotation.y += this.getRotationSpeed();
        }
    }

    
    getOrbitSpeed() {
        return 1 / this.orbitSpeed * this.scaleRotationFactor;
    }

    orbitRotate(system) {
        system.rotation.y += this.getOrbitSpeed();
    }


    
}