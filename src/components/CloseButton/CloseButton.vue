<template>
    <div class="CloseButton-container" ref="CloseButton_container">
        <router-link :to="{ name: 'Home'}">
        </router-link>
    </div>
</template>

<script>
    import './CloseButton.scss';

    export default {
        name: 'CloseButton',
        watch: {
            'hover': function () {
                this.$store.commit("setHover", this.hover);
            },
        },
        data() {
            return {
                hover: false,
            }
        },
        computed: {},
        methods: {
        },
        mounted() {
            this.$refs.CloseButton_container.addEventListener('mouseover', () => {
                this.hover = true 
            })

            this.$refs.CloseButton_container.addEventListener('mouseleave', () => {
                this.hover = false 
            })
        }
    };
</script>