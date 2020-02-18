<template>
    <div class="viewer-wrapper" ref="viewer_wrapper"> </div>
</template>

<script>
    import './Viewer.scss';

    export default {
        name: 'Viewer',
        data() {
            return {
                hold: false,
                ratio: 0.08,
                hovering: false,
                speed: 1500,
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
                        width: 5000,
                        height: 5000,
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
            }
        },
        computed: {},
        methods: {
            init() {

                this.setSizes()

                this.initRenderer(this.$refs.viewer_wrapper)

                this.setPosition()

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
                this.renderer.el.style.transform = `matrix(1, 0, 0, 1, ${this.renderer.pos.x}, ${this.renderer.pos.y})`
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
            },
            setElement(project) {
                let div = this.createElementWrapper(project)

                div.appendChild(this.createDate(project.date[0].text))
                div.appendChild(this.createTitle(project.title[0].text))
                div.appendChild(this.createDescription(project.description[0].text))
                div.appendChild(this.createImage(project.image.url, project.image.alt))
                div.addEventListener('mouseover', () => {
                    this.hovering = true
                })
                div.addEventListener('mouseleave', () => {
                    this.hovering = false
                })
                this.renderer.el.appendChild(div)
            },
            createElementWrapper(project) {
                let el = document.createElement('div')
                el.classList.add('viewer-element')
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
            createImage(inner, alt) {
                let el = document.createElement('img')
                el.classList.add('viewer-element-image')
                el.setAttribute('src', inner)
                el.setAttribute('alt', alt)
                el.setAttribute('draggable', false)
                return el
            }
        },
        mounted() {

            window.addEventListener('resize', () => {
                this.setSizes()
            })

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
                this.speed = 500
            })

            this.$refs.viewer_wrapper.addEventListener('touchstart', (_event) => {
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