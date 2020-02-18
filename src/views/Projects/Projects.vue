<template>
    <div class="projects-container" ref="projects_container" >
        <Viewer />
        <CloseButton />
    </div>
</template>

<script>
    import './Projects.scss';

    import Viewer from '@Component/Viewer/Viewer.vue';
    import CloseButton from '@Component/CloseButton/CloseButton.vue';

    export default {
        name: 'Projects',
        components: {
            Viewer,
            CloseButton
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