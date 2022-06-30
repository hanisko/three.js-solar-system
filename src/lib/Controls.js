import * as THREE from "three";
import GUI from 'lil-gui';

const config = {
    selectedCamera: 'earthOrbit',
    orbitCameraChanged: true,
    rotation: {
        mercury: true,
        venus: true,
        earth: true,
        moon: false,
        mars: true,
        mercurySun: false,
        venusSun: false,
        earthSun: false,
        marsSun: false,
    },
    lights: {
        changed: false,
        ambientLight: false,
        sunLight: true,
    },
    orbits: {
        changed: false,
        mercury: false,       
        venus: false,       
        earth: false,       
        mars: false,       
    }
};

const cameras = ['mercuryOrbit', 'venusOrbit', 'earthOrbit', 'moonOrbit', 'marsOrbit', 'earthSun',  'earthMoon'];
const orbitCameras = ['earthOrbit', 'moonOrbit', 'mercuryOrbit', 'venusOrbit', 'marsOrbit'];


export default class Controls {

    constructor() {

        const gui = new GUI();

        const rotations = gui.addFolder('Planet rotations');
        const ownAxis = rotations.addFolder('own axis');
        const orbitRotations = rotations.addFolder('orbits');
        const lights = gui.addFolder('lights');
        const orbits = gui.addFolder('orbits');

        gui.add(config, 'selectedCamera', cameras).onChange(function (value) {
            config.selectedCamera = value;
        });
        ownAxis.add(config.rotation, 'earth').onChange(function (value) {
            config.rotation.earth = value;
        });

        ownAxis.add(config.rotation, 'mercury').onChange(function (value) {
            config.rotation.mercury = value;
        });
        ownAxis.add(config.rotation, 'venus').onChange(function (value) {
            config.rotation.venus = value;
        });
        ownAxis.add(config.rotation, 'mars').onChange(function (value) {
            config.rotation.venus = value;
        });

        orbitRotations.add(config.rotation, 'mercurySun').name('mercury').onChange(function (value) {
            config.mercurySun = value;
        });    
        orbitRotations.add(config.rotation, 'venusSun').name('venus').onChange(function (value) {
            config.venusSun = value;
        });
        orbitRotations.add(config.rotation, 'earthSun').name('earth').onChange(function (value) {
            config.earthSun = value;
        });
        orbitRotations.add(config.rotation, 'moon').onChange(function (value) {
            config.rotation.moon = value;
        });
        orbitRotations.add(config.rotation, 'marsSun').name('mars').onChange(function (value) {
            config.marsSun = value;
        });


        lights.add(config.lights, 'ambientLight').onChange(function (value) {
            config.lights.ambientLight = value;
            config.lights.changed = true;
        });
        lights.add(config.lights, 'sunLight').onChange(function (value) {
            config.lights.sunLight = value;
            config.lights.changed = true;
        });      

        orbits.add(config.orbits, 'mercury').onChange(function (value) {
            config.orbits.mercury = value;
            config.orbits.changed = true;
        });
        orbits.add(config.orbits, 'venus').onChange(function (value) {
            config.orbits.venus = value;
            config.orbits.changed = true;
        });
        orbits.add(config.orbits, 'earth').onChange(function (value) {
            config.orbits.earth = value;
            config.orbits.changed = true;
        });
        orbits.add(config.orbits, 'mars').onChange(function (value) {
            config.orbits.mars = value;
            config.orbits.changed = true;
        });
    }

    getCamera(name) {
        return config.camera[name];
    }

    hasRotation(name) {
        return config.rotation[name];
    }

    isOrbitCamera() {
        if (orbitCameras.includes(config.selectedCamera)) {
            return true;
        }
        return false;
    }

    lightChanged() {
        return config.lights.changed;
    }

    checkLight(light) {
        light.intensity = 0;
        if (config.lights.ambientLight) {
            light.intensity = 1;
        } else if (config.lights.sunLight && light.isPointLight) {
            light.intensity = 1;
        }

        config.lights.changed = false;
    }

    orbitChanged() {
        return config.orbits.changed;
    }

    checkOrbits(orbits) {
        config.orbits.changed = false;

        for (let [key, element] of Object.entries(orbits)) {
            console.log(config.orbits[key])
            element.visible = config.orbits[key]
          }
    }


    configCamera(camera, orbitControls, mesh) {       
        const position = new THREE.Vector3();
        switch (config.selectedCamera) {
            case 'earthOrbit':               
                mesh.earth.getWorldPosition(position);
                orbitControls.target = position;
                break;
            case 'moonOrbit':
                mesh.moon.getWorldPosition(position);
                orbitControls.target = position;
                break;
            case 'mercuryOrbit':
                mesh.mercury.getWorldPosition(position);
                orbitControls.target = position;
                break;
            case 'venusOrbit':
                mesh.venus.getWorldPosition(position);
                orbitControls.target = position;
                break;
            case 'marsOrbit':
                mesh.mars.getWorldPosition(position);
                orbitControls.target = position;
                break;
            case 'earthMoon':
                mesh.earth.getWorldPosition(position);
                camera.position.copy(position);                  
                const  moonPos  = new THREE.Vector3();
                moonPos.setFromMatrixPosition(mesh.moon.matrixWorld);
                camera.lookAt(moonPos);
                break;
            case 'earthSun':
                mesh.earth.getWorldPosition(position);
                camera.position.copy(position)
                camera.lookAt(0, 0, 0);
                break;
        }

        orbitControls.enabled = false;
        if (this.isOrbitCamera()) {
            orbitControls.update();
            orbitControls.enabled = true;
        }

        return {
            'camera': camera,
            'orbitControls': orbitControls,
        };
    }

}