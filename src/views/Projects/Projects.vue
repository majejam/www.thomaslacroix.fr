<template>
    <div class="projects-container" ref="projects_container" >
        <Viewer />
        <Cursors />
    </div>
</template>

<script>
    import './Projects.scss';

    import Viewer from '@Component/Viewer/Viewer.vue';
    import Cursors from '@Component/Cursor/Cursor.vue';

    export default {
        name: 'Projects',
        components: {
            Viewer,
            Cursors,
        },
        data() {
            return {
            }
        },
        computed: {},
        methods: {

        },
        mounted() {
            console.log(this.$store.state.projects)
        }
    };
</script>