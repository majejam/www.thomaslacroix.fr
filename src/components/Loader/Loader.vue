<template>
    <div class="loader-container" ref="loader_container">
        <span class="loader-info">{{ data.value * 100 }} %</span>
    </div>
</template>

<script>
    import './Loader.scss';

    export default {
        name: 'Loader',
        props: {
            statistics: {
                required: false,
                type: Boolean,
            },
            data: Object,
        },
        watch: {
            'data.value': function () {
                if (this.data.value == 1) {
                    this.hasFinished()
                    this.removeLoader()
                }
            }
        },
        data() {
            return {
                ended: false,
                elapsedTime: 0,
                startTime: new Date(),
                endTime:0,
            }
        },
        computed: {},
        methods: {
            hasFinished() {
                this.ended = true
                this.endTime = new Date()
                this.elapsedTime = (this.endTime - this.startTime) / 1000
                if(this.statistics) this.getStatistics()
                this.$emit('ended', this.elapsedTime)
            },
            removeLoader() {
                this.$refs.loader_container.classList.add('loader-container--remove')
            },
            getStatistics() {
                console.group('Loader statistics')
                console.log('Loading took', this.elapsedTime, 'second(s)')
                console.log('Number of images loaded', this.data.elements)
                console.log('Loading started on', this.startTime)
                console.log('Loading ended on', this.endTime)
                console.groupEnd()
            }
        },
        mounted() {

        }
    };
</script>