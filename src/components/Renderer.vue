<template>
    <div id="renderer" class="position-relative m-auto">
        <Scene class="w-100 h-100 rounded-circle"/>
        <div class="frame position-absolute w-100 h-100 top-0">
            <button v-for="planet in planets" :value="planet" @click="clickButton">{{planet}}</button>
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
        background-image: url("/swborder.png");
        background-size: 100%;
        background-repeat: no-repeat;
    }
}
</style>
