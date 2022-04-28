<template>
    <div id="renderer" class="position-relative m-auto">
        <Scene class="w-100 h-100 rounded-circle"/>
        <div class="frame position-absolute w-100 h-100 top-0"/>
    </div>
</template>


<script>
import Scene from '@/components/Scene.vue'

export default {
    components: {
        Scene
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
