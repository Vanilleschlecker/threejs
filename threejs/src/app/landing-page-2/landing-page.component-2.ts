import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import * as THREE from 'three'
import {GLTFLoader, GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";


@Component({
  selector: 'app-landing-page-2',
  templateUrl: './landing-page.component-2.html',
  styleUrls: ['./landing-page.component-2.scss']
})
export class LandingPageComponent2 implements AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef

  @Input() fieldOfView = 1
  @Input('nearClipping') nearClippingPlane = 1
  @Input('farClipping') farClippingPlane = 1000

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement
  }

  private loader = new GLTFLoader()
  private scene!: THREE.Scene
  private model = new  THREE.Object3D
  private camera!: THREE.PerspectiveCamera

  private ambientLight!: THREE.AmbientLight
  private directionalLight!: THREE.DirectionalLight
  private light1!: THREE.PointLight
  private light2!: THREE.PointLight
  private light3!: THREE.PointLight
  private light4!: THREE.PointLight
  private controls!: OrbitControls
  private renderer!: THREE.WebGLRenderer

  ngAfterViewInit() {
    this.createScene()
    this.startRenderingLoop()
    this.createControls()
  }

  private createScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('lightblue')
    this.loader.load('../../assets/scene.gltf', ((gltf) => {
      this.model = gltf.scene.children[0]
      console.log(this.model)
      let box = new THREE.Box3().setFromObject(this.model)
      box.getCenter(this.model.position)
      this.model.position.x = 10;
      this.model.position.y = 10;
      this.model.position.z = 10;
      this.model.scale.set(0.01,0.01,0.01)
      this.scene.add(this.model)
    }))

    let aspectRation = this.getAspectRation()
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRation,
      this.nearClippingPlane,
      this.farClippingPlane
    )

    this.camera.position.x = 1000
    this.camera.position.y = 100
    this.camera.position.z = 100
    this.ambientLight = new THREE.AmbientLight(0x000000, 100)
    this.scene.add(this.ambientLight)
    this.directionalLight = new THREE.DirectionalLight(0xffdf04, 0.4)
    this.directionalLight.position.set(0,1,0)
    this.directionalLight.castShadow = true
    this.scene.add(this.directionalLight)
    this.light1 = new THREE.PointLight(0x4b371c, 10)
    this.light1.position.set(0,200,400)
    this.scene.add(this.light1)
    this.light2 = new THREE.PointLight(0x4b371c, 10)
    this.light2.position.set(500,100,0)
    this.scene.add(this.light2)
    this.light3 = new THREE.PointLight(0x4b371c, 10)
    this.light3.position.set(0,100,-500)
    this.scene.add(this.light3)
    this.light4 = new THREE.PointLight(0x4b371c, 10)
    this.light4.position.set(-500,300,500)
    this.scene.add(this.light4)
  }

  private getAspectRation() {
    return this.canvas.clientWidth / this.canvas.clientHeight
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas})
    this.renderer.setPixelRatio(devicePixelRatio)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)

    let component = this;
    (function renderer() {
      requestAnimationFrame(renderer)
      component.renderer.render(component.scene, component.camera)
    }())
  }

  private createControls = () => {
    const renderer = new CSS2DRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    document.body.appendChild(renderer.domElement)
    this.controls = new OrbitControls(this.camera, renderer.domElement)
    this.controls.autoRotate = true
    this.controls.enableZoom = true
    this.controls.enablePan = false
    this.controls.update()
  }

}
