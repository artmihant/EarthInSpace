import * as THREE from "three";
import {toRaw} from "vue";

const {
    EventDispatcher,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer,
    Camera
} = THREE;


export default class Plot {
    /**
     * @param {Camera} camera
     * @param {HTMLElement=} canvas
     */
    constructor(camera) {
        this.scene = new Scene();
        this.camera = camera;
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.controls = null;
    }

    /** @return {HTMLCanvasElement} */
    get canvas() {
        return this.renderer.domElement;
    }


    setSize({width, height}) {
        this.renderer.setSize(width, height);

        const {camera} = this;

        if (camera.hasOwnProperty('aspect')) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    }

    addToScene(obj){
        this.scene.add(toRaw(obj))
    }

    addToCamera(obj){
        this.camera.add(toRaw(obj))
    }

    /**
     * @param controls
     * @return {this}
     */
    setControls(controls) {
        this.controls = toRaw(controls);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
