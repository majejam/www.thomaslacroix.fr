<template>
    <div class="projects-container" ref="projects_container" >
        <Viewer />
    </div>
</template>

<script>
    import './Projects.scss';

    import Viewer from '@Component/Viewer/Viewer.vue';

    export default {
        name: 'Projects',
        components: {
            Viewer,
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