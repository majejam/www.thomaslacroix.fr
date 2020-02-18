<template>
    <svg id="Calque_1" ref="svg" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><title>Plan de travail 1</title><polygon points="875.79 672.21 703.59 500 875.79 327.79 672.21 124.21 500 296.41 327.79 124.21 124.21 327.8 296.41 500 124.21 672.21 327.79 875.79 500 703.59 672.21 875.79 875.79 672.21"/></svg>
</template>

<script>
    import './LoaderIcon.scss';

    export default {
        name: 'LoaderIcon',
        props: ['scale'],
        watch: {
            'scale': function () {
                this.animatedIcon()
                console.log(this.scale);
            }
        },
        data() {
            return {

            }
        },
        computed: {},
        methods: {
            animatedIcon() {
                this.$refs.svg.style.strokeDashoffset = ((1 / (this.scale) - 1) * 3100) + 200
                if(this.scale == 1) {
                    setTimeout(() => {
                        this.$refs.svg.classList.add('faster')
                        setTimeout(() => {
                            this.$emit('ended', this.elapsedTime)
                        }, 1000);
                    }, 1500); 
                } 
            }
        },
        mounted() {

        }
    };
</script>