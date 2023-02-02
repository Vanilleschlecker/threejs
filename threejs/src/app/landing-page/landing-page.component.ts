import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import * as THREE from 'three'

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef

  @Input() rotationSpeedX = 0.01
  @Input() rotationSpeedY = 0.01
  @Input() size = 200
  @Input() texture = '../../assets/s.jpg'

  @Input() cameraZ = 400
  @Input() fieldOfView = 1
  @Input('nearClipping') nearClippingPlane = 1
  @Input('farClipping') farClippingPlane = 1000

  private camera!: THREE.PerspectiveCamera

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement
  }

  private loader = new THREE.TextureLoader()
  private geometry = new THREE.SphereGeometry(1)
  private material = new THREE.MeshBasicMaterial({map: this.loader.load(this.texture)})
  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material)
  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene

  ngAfterViewInit() {
    this.createScene()
    this.startRenderingLoop()
  }

  private createScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('black')
    this.scene.add(this.cube)

    let aspectRatio = this.getAspectRation()

    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = this.cameraZ
  }

  private getAspectRation() {
    return this.canvas.clientWidth / this.canvas.clientHeight
  }

  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX
    this.cube.rotation.y += this.rotationSpeedY
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas})
    this.renderer.setPixelRatio(devicePixelRatio)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)

    let component = this;
    (function renderer() {
      requestAnimationFrame(renderer)
      component.animateCube()
      component.renderer.render(component.scene, component.camera)
    }())
  }

}
