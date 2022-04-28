<template>
    <div id="scene"/>
</template>

<script>

import * as THREE from "three";
import Plot from "@/lib/plot";
import AstroControls from "@/lib/three/AstroControls";
import {AdditiveBlending, CustomBlending, MaxEquation, MultiplyBlending, SubtractiveBlending} from "three";

export default {
    data: () => ({
        size: {
            width: 1,
            height: 1
        },
        sceneObjects:{
            sunlight: new THREE.Light(),
            earth: new THREE.Group(),
            venus: new THREE.Group(),
            mars: new THREE.Group(),
            moon: new THREE.Group(),
            mercury: new THREE.Group(),
            sun: new THREE.Group(),
            stars: new THREE.Mesh(),
        },
    }),
    mounted() {
        const loader = new THREE.TextureLoader();
        const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
        this.plot = new Plot(camera);
        this.$el.appendChild(this.plot.canvas);
        this.plot.camera.position.z = 2.5;

        window.addEventListener("resize", this.windowResize);
        this.windowResize()

        const controls = new AstroControls( camera, this.$parent.$el );
        controls.rotateSpeed = 1;
        controls.zoomSpeed = 1;
        controls.panSpeed = 1;
        controls.noPan = true;
        controls.dynamicDampingFactor = 0.1;
        this.plot.setControls(controls)


        this.sceneObjects.sunlight = new THREE.DirectionalLight(0xFFFFFF, 1.25);
        this.sceneObjects.sunlight.position.set(5, 0, 0);


        Object.assign(this.sceneObjects.stars,{
            geometry: new THREE.SphereGeometry(10, 64, 32),
            material: new THREE.MeshBasicMaterial( {
                side:THREE.BackSide,
                map: loader.load('/8k_stars_milky_way.jpg'),

            } )
        })
        this.constructEarth(loader)
        this.constructVenus(loader)
        this.constructMars(loader)
        this.constructMercury(loader)
        this.constructMoon(loader)
        this.constructSun(loader)

        this.sceneObjects.moon.visible = true

        for(let key in this.sceneObjects){
            this.plot.addToScene( this.sceneObjects[key] );
        }


        this.animate();
    },
    methods: {
        windowResize(){
            this.size.width = this.$el.clientWidth
            this.size.height = this.$el.clientHeight
            this.plot.setSize(this.size)
        },

        animate(){
            this.sceneObjects.mercury.rotation.y += 0.001;
            this.sceneObjects.venus.rotation.y += 0.001;
            this.sceneObjects.earth.rotation.y += 0.001;
            this.sceneObjects.mars.rotation.y += 0.001;
            this.sceneObjects.moon.rotation.y += 0.001;
            this.sceneObjects.sun.rotation.y += 0.001;

            this.plot.render();
            requestAnimationFrame( this.animate );
        },

        constructMars(loader){

            let ground = new THREE.Mesh(
                new THREE.SphereGeometry(1, 128, 64),
                new THREE.MeshPhongMaterial( {
                    map: loader.load('/8k_mars.jpg'),
                    bumpMap: loader.load('/8k_mars.jpg'),
                    bumpScale:   0.01,
                    shininess: 0.5,
                })
            )
            this.sceneObjects.mars.add(ground);
            this.sceneObjects.mars.visible = false
        },

        constructMercury(loader){

            let ground = new THREE.Mesh(
                new THREE.SphereGeometry(1, 128, 64),
                new THREE.MeshPhongMaterial( {
                    map: loader.load('/8k_mercury.jpg'),
                    bumpMap: loader.load('/8k_mercury.jpg'),
                    bumpScale:   0.01,
                    shininess: 0.5,
                })
            )
            this.sceneObjects.mercury.add(ground);
            this.sceneObjects.mercury.visible = false
        },


        constructSun(loader){

            let body = new THREE.Mesh(
                new THREE.SphereGeometry(1.01, 128, 64),
                new THREE.MeshBasicMaterial( {
                    map: loader.load('/8k_sun.jpg'),
                })
            )
            this.sceneObjects.sun.add(body);

            let crone = new THREE.Mesh(
                new THREE.SphereGeometry(1.02, 64, 32),
                new THREE.MeshBasicMaterial( {
                    map: loader.load('/8k_sun.jpg'),
                    blending:THREE.CustomBlending,
                    blendEquation: THREE.MaxEquation,
                    transparent: true,
                    opacity: 0.5
                }),
            )
            this.sceneObjects.sun.add(crone);

            this.sceneObjects.sun.visible = false
        },


        constructMoon(loader){

            let ground = new THREE.Mesh(
                new THREE.BoxGeometry(1, 128, 64),
                new THREE.MeshPhongMaterial( {
                    map: loader.load('/8k_moon.jpg'),
                    bumpMap: loader.load('/8k_moon.jpg'),
                    bumpScale:   0.01,
                    shininess: 0.5,
                })
            )
            this.sceneObjects.moon.add(ground);
            this.sceneObjects.moon.visible = false
        },

        constructVenus(loader){

            let ground = new THREE.Mesh(
                new THREE.SphereGeometry(1, 128, 64),
                new THREE.MeshPhongMaterial( {
                    map: loader.load('/8k_venus_surface.jpg'),
                    bumpMap: loader.load('/8k_venus_surface.jpg'),
                    bumpScale:   0.01,
                    shininess: 0.5,
                })
            )
            this.sceneObjects.venus.add(ground);

            let cloud = new THREE.Mesh(
                new THREE.SphereGeometry(1.02, 64, 32),
                new THREE.MeshPhongMaterial( {
                    map: loader.load('/8k_venus_atmosphere.jpg'),
                    shininess: 0.8,
                    transparent: true,
                    opacity: 0.9
                }),
            )
            this.sceneObjects.venus.add(cloud);
            this.sceneObjects.venus.visible = false
        },

        constructEarth(loader){

            let day = new THREE.Mesh(
                new THREE.SphereGeometry(1, 128, 64),
                new THREE.MeshPhongMaterial( {
                    map: loader.load('/8k_earth_daymap.jpg'),
                    bumpMap: loader.load('/8k_earth_daymap.jpg'),
                    bumpScale:   0.005,
                    shininess: 0.5,
                    // specularMap: loader.load('/8k_mars.jpg.jpg'),
                    // specular: new THREE.Color('gray')
                })
            )
            this.sceneObjects.earth.add(day);

            let night = new THREE.Mesh(
                new THREE.SphereGeometry(1.005, 128, 64),
                new THREE.MeshBasicMaterial( {
                    map: loader.load('/8k_earth_nightmap.jpg'),
                    blending: THREE.CustomBlending,
                    blendEquation: THREE.MaxEquation,
                }),
            )
            this.sceneObjects.earth.add(night);

            let cloud = new THREE.Mesh(
                new THREE.SphereGeometry(1.01, 64, 32),
                new THREE.MeshPhongMaterial( {
                    map: loader.load('/8k_earth_clouds.jpg'),
                    blending:THREE.AdditiveBlending,
                    shininess: 0.5,
                }),
            )
            this.sceneObjects.earth.add(cloud);

            let galo = new THREE.Mesh(
                new THREE.SphereGeometry(1.02, 64, 32),
                new THREE.MeshPhongMaterial( {
                    map: loader.load('/8k_earth_daymap.jpg'),
                    side:THREE.BackSide,
                    blending:THREE.AdditiveBlending,
                    shininess: 0.5,
                    transparent: true,
                    opacity: 0.5
                }),
            )
            this.sceneObjects.earth.add(galo);

            this.sceneObjects.earth.rotation.x += 0.3;
            this.sceneObjects.earth.visible = false
        }

    }
}
</script>
