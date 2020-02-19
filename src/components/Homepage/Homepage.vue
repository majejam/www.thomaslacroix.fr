<template>
    <div class="Homepage-container" ref="homepage_container">
        <h1 class="Homepage-header">{{ this.header }}</h1>
        <h2 class="Homepage-subheader">{{ this.subheader }}</h2>
        <span class="Homepage-description">{{ this.description }} <Link :content="link.name" :external="link.url" type="Homepage-link"/> </span>
    </div>
</template>

<script>
    import './Homepage.scss';
    import Link from '@Component/Link/Link.vue';

    export default {
        name: 'Homepage',
        components: {
            Link
        },
        data() {
            return {
                homepage: [],
                header: '',
                subheader: '',
                description: '',
                link: {
                    name: '',
                    url: '',
                }
            }
        },
        computed: {},
        methods: {
            setHomepage() {
                this.homepage = this.$store.getters.homepage
                
                console.log(this.$store.getters.homepage);
                
                this.header = this.homepage[0].name[0].text
                this.subheader = this.homepage[0].title[0].text
                this.description = this.homepage[0].description[0].text

                this.link.name = this.homepage[0].link_title
                this.link.url = this.homepage[0].home_link.url
                
            }
        },
        created() {
            if(this.$store.state.loaded) this.setHomepage()
            
            this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'setLoaded') this.setHomepage()
            });
        },
    };
</script>