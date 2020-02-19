<template>
    <div class="Links-container" ref="links_container">
         <Link v-for="link of linksFormatted" v-bind:key="link.id" :content="link.name" :external="link.url" type="Links-link"/> 
    </div>
</template>

<script>
    import './Links.scss';
    import Link from '@Component/Link/Link.vue';

    export default {
        name: 'Links',
        components: {
            Link
        },
        data() {
            return {
                links: [],
                linksFormatted:[]
            }
        },
        computed: {},
        methods: {
            setLinks() {
                this.links = this.$store.getters.homepage
                this.links[0].body[0].items.forEach(element => {
                    let link= {
                        name: element.link_name,
                        url: element.social_link.url
                    }
                    this.linksFormatted.push(link)
                });
                
            }
        },
        created() {
            if(this.$store.state.loaded) this.setLinks()
            
            this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'setLoaded') this.setLinks()
            });
        },
    };
</script>