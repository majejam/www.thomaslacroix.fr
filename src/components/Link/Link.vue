<template>
    <div class="Link-container" ref="link_container">
        <router-link  :to="{ name: this.path}" :class="this.type" >{{ this.content }}</router-link>
    </div>
</template>

<script>
    import './Link.scss';

    export default {
        name: 'Link',
        props: {
            content: {
                required: true,
                type: String,
            },
            type: {
                required: true,
                type: String,
            },
            path: {
                required: true,
                type: String,
            }
        },
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
            this.$refs.link_container.addEventListener('mouseover', () => {
                this.hover = true 
            })

            this.$refs.link_container.addEventListener('mouseleave', () => {
                this.hover = false 
            })
        }
    };
</script>