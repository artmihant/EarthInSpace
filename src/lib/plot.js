import * as THREE from "three";
import {toRaw} from "vue";

const {
    Scene,
    Group,
    WebGLRenderer,
    TextureLoader,
    Camera
} = THREE;


export default class Plot {
    /**
     * @param {Scene} scene
     * @param {Camera} camera
     */
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.textureLoader = new TextureLoader();
        this.controls = null;
        this.objects = {scene, camera}
    }

    /** @return {HTMLCanvasElement} */
    get canvas() {
        return this.renderer.domElement;
    }

    texture(url){
        return this.textureLoader.load(url)
    }

    setSize({width, height}) {
        this.renderer.setSize(width, height);

        const {camera} = this;

        if (camera.hasOwnProperty('aspect')) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    }

    switch(name, value){
        if(value !== undefined) this.objects[name].visible = value
        else this.objects[name].visible = !this.objects[name].visible
        return this.objects[name].visible
    }

    add(fullname, obj){
        const path = fullname.split('/')
        const name = path.slice(-1)[0]
        let parentname = path.slice(0,-1).join()

        obj.name = name

        this.group(parentname).add(obj)
        this.objects[fullname] = obj

        return obj
    }

    group(name){
        return name ?
            this.objects[name] ?
                this.objects[name] :
                this.add(name, new Group()) :
            this.scene
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
