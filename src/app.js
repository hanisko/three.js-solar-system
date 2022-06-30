
import * as THREE from 'three';
import Earth from './lib/Earth';
import Sun from './lib/Sun';
import Moon from './lib/Moon';
import Mercury from './lib/Mercury';
import Venus from './lib/Venus';
import Mars from './lib/Mars';
import Controls from './lib/Controls';
import Starfield from "./images/textures/starfield.png";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const CAMERA_MIN_DISTANCE = 10;
const CAMERA_MAX_DISTANCE = 300;
export default class App {

    /**
     * 
     * @param {boolean} debug - debug mode -> add helpers to camera + scene
     */
    constructor(debug = false) {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.createRenderer();
        this.createScene(debug);
        this.createCamera(debug, 30);
        this.createOrbitControls();

        this.addObjects();
        this.addEventListeners();
        this.createPreloader();

        this.createGui();
        this.animate();
    }

    createGui() {
        this.gui = new Controls();
    }

    createOrbitControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enabled = false;

        this.orbitControls.enableDamping = true;
        this.orbitControls.minDistance = CAMERA_MIN_DISTANCE;
        this.orbitControls.maxDistance = CAMERA_MAX_DISTANCE;
    }

    createCamera(helper = false, fov = 45) {
        this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 10000);

        if (helper) {
            this.scene.add(new THREE.CameraHelper(this.camera));
        }
    }

    /**
     * 
     * @param {boolean} helper - add scene helper
     * @param {number} bgColor - scene background color
     */
    createScene(helper = false) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.TextureLoader().load(Starfield);

        if (helper) {
            this.scene.add(new THREE.GridHelper(10000, 100));
        }

    }

    /**
     * 
     * @param {boolean} antialias - renderer antialising
     */
    createRenderer(antialias = true) {
        this.renderer = new THREE.WebGLRenderer({
            antialias: antialias
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
    }

    addObjects() {


        // hold every solar system object
        this.solarSystem = new THREE.Group();

        this.sun = new Sun();
        this.sun.createLight(this.scene);
        this.sunMesh = this.sun.getMesh();
        this.sunSystem = new THREE.Group();
        this.sunSystem.add(this.sunMesh);

        this.mercury = new Mercury();
        this.mercuryMesh = this.mercury.getMesh();
        this.mercurySystem = new THREE.Group();
        this.mercurySystem.add(this.mercuryMesh);

        this.venus = new Venus();
        this.venusMesh = this.venus.getMesh();
        this.venusSystem = new THREE.Group();
        this.venusSystem.add(this.venusMesh);

        this.earth = new Earth();
        this.earthMesh = this.earth.getMesh();       
        this.earthSystem = new THREE.Group();
        this.earthSystem.add(this.earthMesh);

        const moon = new Moon();
        this.moonMesh = moon.getMesh();
        this.earthPivot = new THREE.Object3D();
        this.earthPivot.position.x = this.earthMesh.position.x
        this.moonMesh.position.x = 25
        this.earthPivot.add(this.moonMesh);

        this.mars = new Mars();
        this.marsMesh = this.mars.getMesh();
        this.marsSystem = new THREE.Group();
        this.marsSystem.add(this.marsMesh);

        this.solarSystem.add(this.sunSystem);
        this.solarSystem.add(this.mercurySystem);
        this.solarSystem.add(this.venusSystem);
        this.solarSystem.add(this.earthSystem);
        this.solarSystem.add(this.earthPivot);
        this.solarSystem.add(this.marsSystem);

        this.scene.add(this.mercury.orbit);
        this.scene.add(this.venus.orbit);
        this.scene.add(this.earth.orbit);
        this.scene.add(this.mars.orbit);

        this.scene.add(this.solarSystem);
        this.createLights();


    }

    createLights() {
        this.scene.add(new THREE.AmbientLight(0xffffff));

        const solarSystemSize = this.marsMesh.position.x + CAMERA_MAX_DISTANCE + 100;
        const light = new THREE.PointLight(0xFFFFFF, 3, solarSystemSize);
        light.castShadow = true;
        light.decay = 0;
        this.scene.add(light);
    }

    addEventListeners() {
        window.addEventListener('resize', this.resize.bind(this))
    }

    resize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    createPreloader() {
        // remove html/css loader
        document.documentElement.classList.remove('loading')
        document.documentElement.classList.add('loaded')
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));

        this.animateRotations();

        this.render();
    }

    render() {
        let data = this.gui.configCamera(
            this.camera,
            this.orbitControls, 
            {
                earth: this.earthMesh,
                moon: this.moonMesh,
                mercury: this.mercuryMesh,
                venus: this.venusMesh,
                mars: this.marsMesh
            },
        );
        this.camera = data.camera;
        this.orbitControls = data.orbitControls;

        if (this.gui.lightChanged) {
            this.gui.checkLight(
                this.scene.getObjectByProperty('type', 'AmbientLight')
            )

            this.gui.checkLight(
                this.scene.getObjectByProperty('type', 'PointLight')
            )
        }

        if (this.gui.orbitChanged()) {
            this.gui.checkOrbits({
                mercury: this.mercury.orbit,
                venus: this.venus.orbit,
                earth: this.earth.orbit,
                mars: this.mars.orbit,            
            });             
        }

        this.renderer.render(this.scene, this.camera);
    }

    animateRotations() {
        this.ownAxisRotations();
        this.orbitRotations();

    }

    ownAxisRotations() {
        if (this.gui.hasRotation('earth')) {
            this.earth.rotate();
        }

        if (this.gui.hasRotation('mercury')) {
            this.mercury.rotate();
        }

        if (this.gui.hasRotation('mars')) {
            this.mars.rotate();
        }

        if (this.gui.hasRotation('venus')) {
            this.venus.rotate();
        }
    }

    orbitRotations() {
        const EARTH_YEAR = 2 * Math.PI * (1 / 60) * (1 / 60) / 10; // one circle in 10 minute    

        if (this.gui.hasRotation('moon')) {
            this.earthPivot.rotation.y += EARTH_YEAR + 0.005; // rotate moon around earth
        }

        if (this.gui.hasRotation('earthSun')) {
            this.earth.orbitRotate(this.earthSystem);
        }

        if (this.gui.hasRotation('mercurySun')) {
            this.mercury.orbitRotate(this.mercurySystem);
        }
        if (this.gui.hasRotation('venusSun')) {
            this.venus.orbitRotate(this.venusSystem);
        }
        if (this.gui.hasRotation('marsSun')) {
            this.mars.orbitRotate(this.marsSystem);
        }

        let position = new THREE.Vector3();
        position.setFromMatrixPosition(this.earthMesh.matrixWorld);
        this.earthPivot.position.copy(position);
    }


}

new App();