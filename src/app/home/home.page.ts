import {Component, OnInit} from '@angular/core';

import * as THREE from 'three';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    // this.threejsinit();
    this.RollingBlockinit();
  }

  RollingBlockinit() {

    // サイズを指定
    const width = window.innerWidth;
    const height = window.innerHeight;

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('.stage')
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE.Scene();

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(0, 0, +1000);

    // 箱を作成
    const geometry = new THREE.BoxGeometry(400, 400, 400);
    const material = new THREE.MeshNormalMaterial();
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);

    tick();

    // 毎フレーム時に実行されるループイベントです
    function tick() {
      box.rotation.y += 0.01;
      renderer.render(scene, camera); // レンダリング

      requestAnimationFrame(tick);
    }
  }

  threejsinit() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // シーンを作成
    const scene = new THREE.Scene();
    // ジオメトリーを作成
    const geometry = new THREE.IcosahedronGeometry(100, 1);
    // マテリアルを作成
    const material = new THREE.MeshBasicMaterial({color: 0xa6b5d7, wireframe: true});
    // メッシュを作成
    const cube = new THREE.Mesh(geometry, material);
    // 3D空間にメッシュを追加
    scene.add(cube);
    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, 1.0);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.position.set(0, 0, +600);
    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('.stage'),
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.render(scene, camera);
  }

}
