<template>
    <div class="viewer-wrapper" ref="viewer_wrapper">
    </div>
</template>

<script>
    import './Viewer.scss';
    import Vue from 'vue';

    

    export default {
        name: 'Viewer',
        data() {
            return {
                hold: false,
                ratio: 0.08,
                hovering: false,
                speed: 1500,
                debug: window.location.hash === '#debug',
                tutorial: {
                    hide: false,
                    el: null,
                },
                cursor: {
                    x: 0,
                    y: 0,
                    startX: 0,
                    startY: 0,
                    deltaX: 0,
                    deltaY: 0,
                    normalizeX: 0,
                },
                sizes: {
                    width: 0,
                    height: 0,
                },
                renderer: {
                    el: document.createElement('div'),
                    class: ['viewer-container'],
                    sizes: {
                        width: 7000,
                        height: 3000,
                        scale: 1,
                    },
                    pos: {
                        x: 0,
                        y: 0,
                        endX: 0,
                        endY: 0,
                    }
                }
            }
        },
        watch: {
            'hovering': function () {
                this.$store.commit("setHover", this.hovering);
            },
            'hold': function () {
                this.$store.commit("setHold", this.hold);
                this.tutorial.hide = true
            },
            'tutorial.hide': function () {
                if(this.tutorial.hide) this.tutorialHide()
            }
        },
        computed: {},
        methods: {
            init() {
                
                this.setSizes()

                this.initRenderer(this.$refs.viewer_wrapper)

                this.setPosition()
                
                if(this.debug) this.debugShow()

                this.loop()

            },
            setCursor(_e) {
                this.cursor.x = (_e.clientX / this.sizes.width)
                this.cursor.y = (_e.clientY / this.sizes.height)
            },
            startCursor(_e) {
                this.cursor.startX = (_e.clientX / this.sizes.width)
                this.cursor.startY = (_e.clientY / this.sizes.height)

            },
            setDeltas() {
                this.cursor.deltaY = this.lerp(this.cursor.deltaY, this.cursor.startY - this.cursor.y, 0.1)
                this.cursor.deltaX = this.lerp(this.cursor.deltaX, this.cursor.startX - this.cursor.x, 0.1)
                this.cursor.startX = this.lerp(this.cursor.startX, this.cursor.x, 0.8)
                this.cursor.startY = this.lerp(this.cursor.startY, this.cursor.y, 0.8)
            },
            resetDeltas() {
                this.cursor.deltaY = this.cursor.deltaX = this.cursor.startX = this.cursor.startY = 0
            },
            setSizes() {
                this.sizes.width = window.innerWidth
                this.sizes.height = window.innerHeight
                this.sizes.width > 900 ? this.renderer.sizes.scale = 1 : this.renderer.sizes.scale = 0.6
            },
            setPosition() {
                this.renderer.pos.x = this.renderer.pos.endX = -(this.renderer.sizes.width - this.sizes.width) / 2
                this.renderer.pos.y = this.renderer.pos.endY = -(this.renderer.sizes.height - this.sizes.height) / 2
            },
            lerp(min, max, fraction) {
                return (max - min) * fraction + min;
            },
            initRenderer(parent) {
                this.renderer.el.classList.add(this.renderer.class)
                this.renderer.el.setAttribute('id', 'renderer')
                parent.appendChild(this.renderer.el)
                this.setRendererSize()
            },
            setRendererSize() {
                this.renderer.el.style.width = `${this.renderer.sizes.width}px`
                this.renderer.el.style.height = `${this.renderer.sizes.height}px`
            },
            updateRendererPosition() {
                this.renderer.pos.x = this.lerp(this.renderer.pos.x, this.renderer.pos.endX, this.ratio);
                this.renderer.pos.y = this.lerp(this.renderer.pos.y, this.renderer.pos.endY, this.ratio);
                this.renderer.el.style.transform = `matrix(${this.renderer.sizes.scale}, 0, 0, ${this.renderer.sizes.scale}, ${this.renderer.pos.x}, ${this.renderer.pos.y})`
            },
            updateEndPostion() {
                this.renderer.pos.endX -= this.cursor.deltaX * this.speed;
                this.renderer.pos.endY -= this.cursor.deltaY * this.speed;
            },
            collisionDetection() {

                if (this.renderer.pos.x > 0) {
                    this.renderer.pos.endX = this.renderer.pos.endX - 5
                }

                if (this.renderer.pos.x < (this.sizes.width - this.renderer.sizes.width)) {
                    this.renderer.pos.endX = this.renderer.pos.endX + 5
                }

                if (this.renderer.pos.y > 0) {
                    this.renderer.pos.endY = this.renderer.pos.endY - 5
                }

                if (this.renderer.pos.y < (this.sizes.height - this.renderer.sizes.height)) {
                    this.renderer.pos.endY = this.renderer.pos.endY + 5
                }

            },
            loop() {
                if (this.hold) {
                    this.setDeltas()
                    this.updateEndPostion()
                }

                this.collisionDetection()

                this.updateRendererPosition()

                requestAnimationFrame(this.loop)
            },
            setElements() {
                this.$store.state.projects.forEach(project => {
                    this.setElement(project)
                });
                this.createTutorial(this.$store.state.tutorial, 'YESS')
            },
            setElement(project) {
                let div = this.createElementWrapper(project)

                div.appendChild(this.createDate(project.date[0].text))
                div.appendChild(this.createTitle(project.title[0].text))
                div.appendChild(this.createDescription(project.description[0].text))
                div.appendChild(this.createImageCover(project.image.url, project.image.alt))
                div.appendChild(this.createLinks(project))
                if(this.debug) div.appendChild(this.createDebug(`${project.position_x}%,${project.position_y}%`))
                this.renderer.el.appendChild(div)
            },
            createElementWrapper(project) {
                let el = document.createElement('div')
                el.classList.add('viewer-element')
                if(this.debug) el.classList.add('viewer-element--debug')
                el.style.transform = `translate(${(project.position_x/100) * this.renderer.sizes.width}px, ${(project.position_y/100) * this.renderer.sizes.height}px)`;
                return el
            },
            createDate(inner) {
                let el = document.createElement('span')
                el.classList.add('viewer-element-date')
                el.innerText = inner
                return el
            },
            createTitle(inner) {
                let el = document.createElement('h2')
                el.classList.add('viewer-element-title')
                el.innerText = inner
                return el
            },
            createDescription(inner) {
                let el = document.createElement('p')
                el.classList.add('viewer-element-description')
                el.innerText = inner
                return el
            },
            createLinks(project) {
                let el = document.createElement('div')
                el.classList.add('viewer-element-links')
                if(project.nom_du_projet) el.appendChild(this.createLink(project.project_link.url, project.project_link.target, project.nom_du_projet))
                if(project.nom_github) el.appendChild(this.createLink(project.link_github.url, project.link_github.target, project.nom_github))
                return el
            },
            createLink(url, target, inner) {
                let el = document.createElement('a')
                el.setAttribute('href', url)
                el.setAttribute('target', target)
                el.classList.add('viewer-element-link')
                el.innerText = inner

                el.addEventListener('mouseover', () => {
                    this.hovering = true
                })
                el.addEventListener('mouseleave', () => {
                    this.hovering = false
                })
                return el
            },
            createImage(inner, alt, isChild = true) {
                let el = document.createElement('img')
                if(isChild) el.classList.add('viewer-element-image')
                el.setAttribute('src', inner)
                el.setAttribute('alt', alt)
                el.setAttribute('draggable', false)
                return el
            },
            createImageCover(inner, alt, isChild = true) {
                let container = document.createElement('div')
                let el = document.createElement('img')
                if(isChild) container.classList.add('viewer-element-image')
                el.setAttribute('src', inner)
                el.setAttribute('alt', alt)
                el.setAttribute('draggable', false)
                container.appendChild(el)
                return container
            },
            createTutorial(inner, alt) {
                this.tutorial.el = document.createElement('div')
                this.tutorial.el.appendChild(this.createImage(inner, 'Move & hold the mouse !', false))
                this.tutorial.el.appendChild(this.createDescription('Move & hold the mouse !'))
                this.tutorial.el.classList.add('viewer-element-tutorial')
                this.renderer.el.appendChild(this.tutorial.el)
                
            },
            createDebug(inner){
                let el = document.createElement('span')
                el.classList.add('viewer-element-span--debug')
                el.innerText = inner
                return el
            },
            tutorialHide() {
                this.tutorial.el.classList.add('viewer-element-tutorial--hide')
            },
            debugShow() {
                for (let x = 0; x < 100; x +=10) {
                    for (let y = 0; y < 100; y+=10) {
                        let el = document.createElement('div')
                        el.classList.add('viewer-element-debug')
                        let span = document.createElement('span')
                        span.innerText = `${x}%,${y}%`
                        el.style.transform = `translate(${x * 70}px,${y * 30}px)`
                        el.style.background = `rgba(255,0,0,${Math.random()/2})`
                        el.appendChild(span)
                        this.renderer.el.appendChild(el)
                    }
                    
                }
            }
        },
        mounted() {

            window.addEventListener('resize', () => {
                this.setSizes()
            })

            document.addEventListener('dragstart', function (e) {
                e.preventDefault();
            });

            window.addEventListener('mousemove', (_event) => {
                this.setCursor(_event)
                this.speed = 1500
                
            })

            this.$refs.viewer_wrapper.addEventListener('mousedown', (_event) => {
                 this.hold = true
                 this.startCursor(_event)
            })

            this.$refs.viewer_wrapper.addEventListener('mouseleave', (_event) => {
                this.hold = false
            })

            this.$refs.viewer_wrapper.addEventListener('mouseup', (_event) => {
                this.hold = false
                this.resetDeltas()
            })

            this.$refs.viewer_wrapper.addEventListener('touchmove', (_event) => {
                this.setCursor(_event.touches[0])
                this.speed = 1200
            })

            this.$refs.viewer_wrapper.addEventListener('touchstart', (_event) => {
                this.setCursor(_event.touches[0])
                this.hold = true
                this.startCursor(_event.touches[0])
            })

            this.$refs.viewer_wrapper.addEventListener('touchend', (_event) => {
                this.hold = false
                this.resetDeltas()
            })

            this.$refs.viewer_wrapper.addEventListener('touchcancel', (_event) => {
                this.hold = false
                this.resetDeltas()
            })

            this.init()
        },
        created() {
            if(this.$store.state.loaded) this.setElements()
            
            this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'setLoaded') this.setElements()
            });
        },
    };
</script>