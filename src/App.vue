<template>
    <div id="app">
        <Renderer/>
    </div>
</template>

<script>
import Renderer from './components/Renderer.vue'
import "bootstrap/dist/css/bootstrap.min.css";

export default {
    name: 'Hyperspace',
    components: {
        Renderer
    }
}
</script>

<style lang="scss">
#app {
    background-color: black;
    width:100vw;
    height:100vh;
}
</style>
