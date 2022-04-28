import 'ext/function';
import 'ext/object';
import 'ext/string';

const {
    EventDispatcher,
    DirectionalLight,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer,
    Camera
} = THREE;


export class Renderer extends EventDispatcher {
    /**
     * @param {Camera} camera
     * @param {Object=} opt_parameters
     * @param {number=} pixelRatio
     */
    constructor(camera, opt_parameters, pixelRatio = devicePixelRatio) {
        super();

        Object.assign(this, {
            camera,
            scene_: new Scene(),
            renderer_: new WebGLRenderer(
                Object.assign({alpha: true, antialias: true}, opt_parameters),
            ),
            pixelRatio,
        });

        this.add(camera);

        opt_parameters.canvas && this.adjustSize();
    }

    /** @return {boolean} */
    get clipping() {
        return this.renderer_.localClippingEnabled;
    }

    /** @param {boolean} value */
    set clipping(value) {
        this.renderer_.localClippingEnabled = value;
    }

    /** @return {?EventDispatcher} */
    get controls() {
        return this.controls_;
    }

    /** @return {HTMLCanvasElement} */
    get canvas() {
        return this.renderer_.domElement;
    }

    /** @return {number} */
    get pixelRatio() {
        return this.renderer_.getPixelRatio();
    }

    /** @param {number} value */
    set pixelRatio(value) {
        this.renderer_.setPixelRatio(value);
    }

    /** @return {boolean} */
    get visible() {
        return this.scene_.visible;
    }

    /** @param {boolean} value */
    set visible(value) {
        this.scene_.visible = !!value;
    }

    /**
     * @param {...Object3D} arguments
     * @return {this}
     */
    add() {
        this.scene_.add(...arguments);

        return this;
    }

    /**
     * @param {function(Event=, Renderer=)} cb
     * @param {string|string[]} e
     * @return {this}
     */
    addCtrlListener(cb, e = 'change') {
        const {controls} = this;

        controls && (Array.isArray(e) ? e : [e])
            .forEach(e => controls.addEventListener(e, cb))
        ;

        return this;
    }

    /** @return {this} */
    adjustSize() {
        const r = this.canvas.getBoundingClientRect();
        return this.setSize(r.width, r.height);
    }

    /**
     * @param {function(Object3D=, number=)} cb
     * @return {this}
     */
    eachObject(cb) {
        this.scene_.children.forEach(cb);

        return this;
    }

    /**
     * @param {string} name
     * @return {?Object3D}
     */
    getObject(name) {
        return this.scene_.getObjectByName(name);
    }

    /** @return {{height: number, width: number}} */
    getSize() {
        const size = new Vector2();
        this.renderer_.getSize(size);

        return {height: size.y, width: size.x};
    }

    /**
     * @param {HTMLElement} dom
     * @param {Vector3} pos
     * @param {{x: number, y: number}=} opt_offset
     * @return {this}
     */
    project(dom, pos, opt_offset) {
        const s = this.getSize();

        (pos = pos.clone().project(this.camera))
            .setX((1 + pos.x) / 2 * s.width)
            .setY((1 - pos.y) / 2 * s.height)
        ;
        opt_offset && pos.add(opt_offset);

        Object.assign(dom.style, {
            left: `${Math.round(pos.x)}px`,
            top: `${Math.round(pos.y)}px`,
        });

        return this;
    }

    /**
     * @param {...Object3D} arguments
     * @return {this}
     */
    remove() {
        this.scene_.remove(...arguments);

        return this;
    }

    render() {
        this.renderer_.render(this.scene_, this.camera);
    }

    /**
     * @param {Object} parameters
     * @return {this}
     */
    setCamera(parameters) {
        const {camera, controls} = this;
        const lookAt = controls
            ? p => controls.target.set.do(controls.target, p)
            : p => camera.lookAt.do(camera, p)
        ;

        Object.forEach(parameters, (value, key) => {
            if (!camera.hasOwnProperty(key)) {
                // noinspection FallThroughInSwitchStatementJS
                switch (key) {
                    case 'up':
                        key = 'up';
                        break;
                    case 'focal_point':
                        lookAt(value);
                    default:
                        return;
                }
            }
            (
                p => p.isVector3 ? p.set.do(p, value) : camera[key] = value
            )(camera[key]);
        });

        return this;
    }

    /**
     * @param {function(Object3D, HTMLElement)} Controls
     * @param {Object=} opt_parameters
     * @return {this}
     */
    setControls(Controls, opt_parameters) {
        opt_parameters = Object.assign(
            {domElement: this.canvas},
            opt_parameters,
        );

        this.controls_ = Object.assign(
            new Controls(this.camera, opt_parameters.domElement),
            opt_parameters,
        );

        return this.addCtrlListener(() => this.render());
    }

    /**
     * @param {number} width
     * @param {number} height
     * @return {this}
     */
    setSize(width, height) {
        this.renderer_.setSize(width, height);

        const {camera, controls} = this;

        if (camera.hasOwnProperty('aspect')) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        controls && controls.handleResize && controls.handleResize();

        return this;
    }

    /**
     * @param {Object3D|string} obj
     * @param {boolean} visible
     * @return {?Object3D}
     *
     */
    toggleObject(obj, visible) {
        String.isString(obj) && (obj = this.getObject(obj));

        if (obj) {
            obj.toggle(visible);
            this.render();
        }

        return obj;
    }

    /** @param {boolean=} opt_force */
    update(opt_force) {
        const {controls} = this;

        controls && (
            opt_force
                ? controls.dispatchEvent({type: 'change'})
                : controls.update()
        );
    }
}
