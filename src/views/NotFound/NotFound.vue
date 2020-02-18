<template>
    <div class="NotFound-container" ref="NotFound_container" >
        <Canvas fov="10" />
        <span class="NotFound-text">Uh, seems like you got lost in outer space, <Link content="wanna go home ?" path="Home" type="NotFound-link"/></span>
    </div>
</template>

<script>
    import './NotFound.scss';
    import Canvas from '@Component/Canvas/Canvas.vue';
    import Link from '@Component/Link/Link.vue';

    export default {
        name: 'NotFound',
        components: {
            Canvas,
            Link
        },
        data() {
            return {
            }
        },
        computed: {},
        methods: {

        },
        mounted() {
        }
    };
</script>