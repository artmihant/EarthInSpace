<template>
    <div id="renderer" class="position-relative m-auto">
        <Scene class="w-100 h-100 rounded-circle m-auto"/>
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
    width: 100vw;
    height: 100vh;
}
</style>
