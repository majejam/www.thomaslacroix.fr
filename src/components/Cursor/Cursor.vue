<template>
    <canvas ref="canvas" id="canvas"></canvas>
</template>

<script>
    import './Cursor.scss';

    export default {
        name: 'Cursors',
        data() {
            return {
                mouse: true,
                hover: false,
                holding: false,
                countdown: 100,
                radius: {
                    value: 8,
                    target: 8,
                },
                context: '',
                sizes: {
                    width: 0,
                    height: 0
                },
                pos: {
                    x: 0,
                    y: 0,
                    endX: 100,
                    endY: 1000
                },
                cursor: {
                    x: 0,
                    y: 0,
                }
            }
        },
        computed: {},
        methods: {
            init() {
                setTimeout(() => {
                    this.context = this.$refs.canvas.getContext('2d')
                    this.resize()
                    this.pos.y = document.body.offsetHeight - 150
                    this.pos.endY = 150
                    this.update()
                }, 1000);
                window.addEventListener('resize', this.resize);
                window.addEventListener('mousemove', (_event) => {
                    this.cursor.x = _event.clientX
                    this.cursor.y = _event.clientY
                })
            },
            update() {
                this.pos.endX = this.cursor.x;
                this.pos.endY = this.cursor.y;
                this.contextUpdate()

                 this.isHolding()

                requestAnimationFrame(this.update);
            },
            lerp(min, max, fraction) {
                return (max - min) * fraction + min;
            },
            drawBall(x, y, radius) {
                this.context.beginPath();
                this.context.fillStyle = '#FFFFFF';
                this.context.arc(x, y, radius * this.countdown/100, 0, 2 * Math.PI, false);
                this.context.fill();
            },
            contextUpdate() {
                this.context.clearRect(0, 0, this.sizes.width, this.sizes.height);
                this.drawBall(this.pos.x, this.pos.y, this.radius.value);
                this.pos.x = this.lerp(this.pos.x, this.pos.endX, 0.5);
                this.pos.y = this.lerp(this.pos.y, this.pos.endY, 0.5);
                this.radius.value = this.lerp(this.radius.value, this.radius.target, 0.2);
            },
            resize() {
                this.sizes.width = this.$refs.canvas.width = window.innerWidth
                this.sizes.height = this.$refs.canvas.height = window.innerHeight
            },
            isHolding() {
                if(this.holding && this.$route.name == "Home") {
                    if(this.countdown > 0 ) {
                        this.countdown -= 2
                    }
                    else if (this.countdown == 0) {
                        this.routing()
                    }
                    
                }
                else {
                    if(this.countdown < 100 ) {
                        this.countdown += 2
                    }
                }
            },
            routing() {
                if(this.$route.name == "Home") {
                    this.$router.push({
                        name: 'Projects'
                    })
                }
            }
        },
        mounted() {
            this.init()

            window.addEventListener('mousedown', () => {
                this.holding = true
            })

            window.addEventListener('mouseup', () => {
                this.holding = false
            })

            window.addEventListener('touchstart', () => {
                this.holding = true
            })

            window.addEventListener('touchend', () => {
                this.holding = false
            })
        },
        created() {
 
            this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'setHover') {
                    if(!this.$store.state.hold) this.$store.state.hovering ? this.radius.target = 50 : this.radius.target = 8
                    
                }
            });

            this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'setHold') {
                    this.$store.state.hold ? this.radius.target = 4 : this.radius.target = 8
                }
            });
        }
    };
</script>