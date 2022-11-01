<template>
    <div id="scene"/>
</template>

<script>

import * as THREE from "three";
import Plot from "@/lib/plot";
import AstroControls from "@/lib/three/AstroControls";
import {assign} from "lodash";
import {mapGetters, mapMutations} from "vuex";

export default {
    mounted() {

        const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
        camera.position.z = 2.5;

        const scene = new THREE.Scene();
        this.plot = new Plot(scene, camera);
        this.$el.appendChild(this.plot.canvas);

        window.addEventListener("resize", this.windowResize);
        this.windowResize()

        this.plot.controls = new AstroControls( camera, this.$parent.$el );
        assign(this.controls, {
            rotateSpeed: 1,
            zoomSpeed: 1,
            panSpeed: 1,
            noPan: true,
            dynamicDampingFactor: 0.1
        })


        this.addSpace()

        // this.addSun()
        // this.addMercury()
        // this.addVenus()
        this.addEarth()
        this.addMoon()
        // this.addMars()
        // this.switch(this.currentPlanet)

        this.animate();
    },
    watch:{
        currentPlanet(name){
            this.switch(name)
        }
    },
    computed:{
        ...mapGetters(['planets', 'currentPlanet'])
    },
    methods: {
        ...mapMutations(['addPlanet']),
        windowResize(){
            this.plot.setSize({
                width: this.$el.clientWidth,
                height: this.$el.clientHeight
            })
        },

        animate(){
            for (let name in this.plot.objects){
                if(this.plot.objects[name].animate)
                    this.plot.objects[name].animate();
            }
            this.plot.render();
            requestAnimationFrame( this.animate );
        },

        switch(name){
            this.planets.forEach(planet => {
                this.plot.switch(planet.name, true)
            })
        },

        addSpace(){

            const sunlight = new THREE.DirectionalLight(0xFFFFFF, 1.25);
            sunlight.position.set(5, 0, 0);

            this.plot.add('sunlight', sunlight)

            this.plot.add('stars', new THREE.Mesh(
                new THREE.SphereGeometry(100, 64, 32),
                new THREE.MeshBasicMaterial( {
                    side:THREE.BackSide,
                    map: this.plot.texture('/earthinwindow/img/textures/8k_stars_milky_way.jpg'),
                })
            ))
        },

        addSun(){

            this.plot.add('sun/body', new THREE.Mesh(
                new THREE.SphereGeometry(1.01, 128, 64),
                new THREE.MeshBasicMaterial( {
                    map: this.plot.texture('/earthinwindow/img/textures/8k_sun.jpg'),
                })
            ))

            this.plot.add('sun/crone', new THREE.Mesh(
                new THREE.SphereGeometry(1.02, 64, 32),
                new THREE.MeshBasicMaterial( {
                    map: this.plot.texture('/earthinwindow/img/textures/8k_sun.jpg'),
                    blending:THREE.CustomBlending,
                    blendEquation: THREE.MaxEquation,
                    transparent: true,
                    opacity: 0.5
                }),
            ))

            this.addPlanet({name:'sun', color:'#FDA824'}, )
        },

        addMercury(){

            this.plot.add('mercury/ground', new THREE.Mesh(
                new THREE.SphereGeometry(1, 128, 64),
                new THREE.MeshPhongMaterial( {
                    map: this.plot.texture('/earthinwindow/img/textures/8k_mercury.jpg'),
                    bumpMap: this.plot.texture('/earthinwindow/img/textures/8k_mercury.jpg'),
                    bumpScale: 0.01,
                    shininess: 0.5,
                })
            ))

            this.addPlanet({name:'mercury', color:'#999899'})
        },

        addVenus(){

            this.plot.add('venus/ground', new THREE.Mesh(
                new THREE.SphereGeometry(1, 128, 64),
                new THREE.MeshPhongMaterial( {
                    map: this.plot.texture('/earthinwindow/img/textures/8k_venus_surface.jpg'),
                    bumpMap: this.plot.texture('/earthinwindow/img/textures/8k_venus_surface.jpg'),
                    bumpScale:   0.01,
                    shininess: 0.5,
                })
            ))

            this.plot.add('venus/cloud', new THREE.Mesh(
                new THREE.SphereGeometry(1.02, 64, 32),
                new THREE.MeshPhongMaterial( {
                    map: this.plot.texture('/earthinwindow/img/textures/8k_venus_atmosphere.jpg'),
                    shininess: 0.8,
                    transparent: true,
                    opacity: 0.9
                }),
            ))
            const venus = this.plot.group('venus')
            venus.animate = () => venus.rotation.y += 0.001;

            this.addPlanet({name:'venus', color:'#ECBC76'})
        },

        addEarth(){
            this.plot.add('earth/day', new THREE.Mesh(
                new THREE.SphereGeometry(1, 128, 64),
                new THREE.MeshPhongMaterial( {
                    map: this.plot.texture('/earthinwindow/img/textures/8k_earth_daymap.jpg'),
                    bumpMap: this.plot.texture('/earthinwindow/img/textures/8k_earth_daymap.jpg'),
                    bumpScale:   0.005,
                    shininess: 0.5,
                })
            ))

            this.plot.add('earth/night', new THREE.Mesh(
                new THREE.SphereGeometry(1.005, 128, 64),
                new THREE.MeshBasicMaterial( {
                    map: this.plot.texture('/earthinwindow/img/textures/8k_earth_nightmap.jpg'),
                    blending: THREE.CustomBlending,
                    blendEquation: THREE.MaxEquation,
                }),
            ))

            this.plot.add('earth/cloud', new THREE.Mesh(
                new THREE.SphereGeometry(1.01, 64, 32),
                new THREE.MeshPhongMaterial( {
                    map: this.plot.texture('/earthinwindow/img/textures/2k_earth_clouds.jpg'),
                    blending:THREE.AdditiveBlending,
                    shininess: 0.5,
                }),
            ))

            this.plot.add('earth/galo', new THREE.Mesh(
                new THREE.SphereGeometry(1.02, 64, 32),
                new THREE.MeshPhongMaterial( {
                    map: this.plot.texture('/earthinwindow/img/textures/2k_earth_nightmap.jpg'),
                    side:THREE.BackSide,
                    blending:THREE.AdditiveBlending,
                    shininess: 0.5,
                    transparent: true,
                    opacity: 0.5
                }),
            ))
            const earth = this.plot.group('earth')
            earth.animate = () => earth.rotation.y += 0.001;
            earth.rotation.x += 0.3;

            this.addPlanet({name:'earth', color:'#4063FF'})
        },

        addMoon(){

            let geom = new THREE.SphereGeometry(0.28, 128, 64)

            let mesh = new THREE.Mesh(
                geom,
                new THREE.MeshPhongMaterial( {
                    map: this.plot.texture('/earthinwindow/img/textures/2k_moon.jpg'),
                    bumpMap: this.plot.texture('/earthinwindow/img/textures/2k_moon.jpg'),
                    bumpScale:   0.01,
                    shininess: 0.5,
                })
            )

            mesh.position.set(5,2,-20)
            this.plot.add('moon', mesh)

            this.addPlanet({name:'moon', color:'gray'})
        },

        addMars(){
            this.plot.add('mars/ground', new THREE.Mesh(
                new THREE.SphereGeometry(1, 128, 64),
                new THREE.MeshPhongMaterial( {
                    map: this.plot.texture('/earthinwindow/img/textures/8k_mars.jpg'),
                    bumpMap: this.plot.texture('/earthinwindow/img/textures/8k_mars.jpg'),
                    bumpScale:   0.01,
                    shininess: 0.5,
                })
            ))
            const mars = this.plot.group('mars')
            mars.animate = () => mars.rotation.y += 0.001;

            this.addPlanet({name:'mars', color:'red'})
        },

    }
}
</script>
