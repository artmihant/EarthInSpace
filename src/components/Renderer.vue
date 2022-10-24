<template>
    <div id="renderer" class="position-relative m-auto">
        <Scene class="w-100 h-100 rounded-circle m-auto"/>
        <div class="frame position-absolute w-100 h-100 top-0">
            <button key="planet.name" v-for="planet in planets" :value="planet.name" :style="{'background-color': planet.color}" class="planet-button" @click="clickButton"> </button>
        </div>
    </div>
</template>


<script>
import Scene from '@/components/Scene.vue'
import {mapGetters, mapMutations} from "vuex";


export default {
    components: {
        Scene
    },
    computed: {
        ...mapGetters(['planets'])
    },
    methods: {
        ...mapMutations(['switchToPlanet']),
        clickButton(e){
            this.switchToPlanet(e.target.value)
        }
    }
}
</script>

<style lang="scss">
#renderer {
    width: min(100%, 100vh);
    height: min(100%, 100vw);
    .frame{
        background-image: url("/earthinwindow/img/swborder.png");
        background-size: 100%;
        background-repeat: no-repeat;
    }
    .planet-button{

        border:2px black solid;
        border-radius: 30px;
        margin:15px;
        padding: 15px;
    }

}
</style>
