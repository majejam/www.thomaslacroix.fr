<template>
    <div class="canvas-container" ref="canvas_container">

    </div>
</template>

<script>
    import './Canvas.scss';
    import * as THREE from 'three'
    import * as POST from "postprocessing"

    export default {
        name: 'Canvas',
        props: {},
        data() {
            return {
                cursor: {
                    x: 0,
                    y: 0,
                },
                scene: new THREE.Scene(),
                sizes: {
                    width: 0,
                    height: 0,
                },
                camera: '',
                light:  new THREE.DirectionalLight(0xffffff, 10),
                renderer: new THREE.WebGLRenderer(),
                clock: new THREE.Clock(),
                composer: '',
                effectPassGlitch: new POST.EffectPass(this.camera, new POST.GlitchEffect()),
                meteorites: [],
                hold: false,
                speed: 10,
                baseSpeed: 10
            }
        },
        computed: {},
        methods: {
            init() {

                this.setSizes()

                this.setCamera()

                this.setLight()

                this.setRenderer()

                this.setComposer()

                this.setMeteorite(200)
                
            },
            setCamera() {
                this.camera = new THREE.PerspectiveCamera(175, this.sizes.width / this.sizes.height)
                this.camera.position.z = 10
                this.scene.add(this.camera)
            },
            updateCamera() {
                this.camera.aspect = this.sizes.width / this.sizes.height
                this.camera.updateProjectionMatrix()
            },
            setSizes() {
                this.sizes.width = window.innerWidth
                this.sizes.height = window.innerHeight
            },
            setLight() {
                this.light.position.x = 0
                this.light.position.y = 0
                this.light.position.z = 1
                this.scene.add(this.light)
            },
            setRenderer() {
                this.renderer.shadowMap.enabled = true
                this.renderer.setSize(this.sizes.width, this.sizes.height)
                this.$refs.canvas_container.appendChild(this.renderer.domElement)
            },
            setCursor(_e) {
                this.cursor.x = _e.clientX / this.sizes.width
                this.cursor.y = _e.clientY / this.sizes.height
            },
            setPass() {
                this.effectPassGlitch = new POST.EffectPass(this.camera, new POST.GlitchEffect())
                this.effectPassGlitch.renderToScreen = true;
                this.effectPassGlitch.minTime = 0
                this.effectPassGlitch.maxTime = 0
                this.effectPassGlitch.enabled = true;
                this.effectPassGlitch.effects[0].delay.y = this.effectPassGlitch.effects[0].delay.x
            },
            setComposer() {
                this.setPass()
                this.composer = new POST.EffectComposer(this.renderer)
                this.composer.addPass(new POST.RenderPass(this.scene, this.camera));
                this.composer.addPass(this.effectPassGlitch);
            },
            lerp(min, max, fraction) {
                return (max - min) * fraction + min;
            },
            getMeteorite() {
                let globe = {}
                globe.geometry = new THREE.DodecahedronBufferGeometry(50, 1)
                globe.material = new THREE.MeshStandardMaterial({
                    color: parseInt("0x" + ((1 << 24) * Math.random() | 0).toString(16)),
                    flatShading: true,
                    metalness: 0.5,
                    roughness: 0,
                })
                globe.mesh = new THREE.Mesh(globe.geometry, globe.material)
                globe.mesh.position.x = (100 + Math.random() * 2000) * (Math.random() < 0.5 ? -1 : 1)
                globe.mesh.position.y = (100 + Math.random() * 2000) * (Math.random() < 0.5 ? -1 : 1)
                globe.mesh.position.z = (Math.random() * 10000) * -1
                
                return globe.mesh
            },
            setMeteorite(length) {
                for (let index = 0; index < length; index++) {
                    this.meteorites.push(this.getMeteorite())
                    this.scene.add(this.meteorites[index])
                }
            },
            updateMeteorite() {
                this.meteorites.forEach(meteorite => {
                    meteorite.rotation.y = meteorite.rotation.x = meteorite.rotation.z += 0.01
                    meteorite.position.z += this.speed //speed
                    if (meteorite.position.z > 200) {
                        meteorite.position.z = (10000 + (Math.random() * 100)) * -1
                    }
                })
            },
            speedUp() {
                this.speed = this.lerp(this.speed, 200, 0.01)
                this.camera.fov = this.lerp(this.camera.fov, 185, 0.02)
                this.camera.updateProjectionMatrix();
            },
            slowDown() {
                this.speed = this.lerp(this.speed, this.baseSpeed, 0.02)
                if(this.$route.name == "Home") this.camera.fov = this.lerp(this.camera.fov, 175, 0.02)
                if(this.camera.fov > 175.1) this.camera.updateProjectionMatrix();
            },
            updateCameraPosition() {
                this.camera.position.x = this.lerp(this.camera.position.x, (this.cursor.x * 2 - 1) * 700, 0.04)
                this.camera.position.y = this.lerp(this.camera.position.y, (-this.cursor.y * 2 + 1) * 700, 0.04)
                this.camera.lookAt(new THREE.Vector3(0,0,-5000));
            },
            loop() {
                this.composer.render(this.clock.getDelta())

                this.updateMeteorite()

                this.hold ? this.speedUp() : this.slowDown()
                
                this.updateCameraPosition()

                this.renderer.render(this.scene, this.camera)

                requestAnimationFrame(this.loop)
            }
        },
        mounted() {
                /**
                 * Resize
                 */
                window.addEventListener('resize', () => {
                    // Update sizes
                    this.setSizes()

                    // Update camera
                    this.updateCamera()

                    // Update renderer
                    this.renderer.setSize(this.sizes.width, this.sizes.height)
                })

                window.addEventListener('mousemove', (_event) => {
                    this.setCursor(_event)
                })

                this.init()

                this.loop()
        },
        created() {
            this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'setHolding') {
                    this.hold = this.$store.state.holding
                }
            });
        }
    };

</script>