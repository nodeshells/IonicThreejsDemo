import {Component, OnInit} from '@angular/core';

import * as THREE_TS from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Object3D} from 'three';

declare const THREE: any;

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
    // this.RollingBlockinit();
    this.MMDModelInit();
  }

  MMDModelInit() {
    // サイズを指定
    const width = window.innerWidth;
    const height = window.innerHeight;

    // vmdファイルを準備
    const vmdFiles = [
      {
        name: '遅歩き',
        file: 'assets/motion/walk/walkmotion_female_slow.vmd'
      },
      {
        name: '早歩き',
        file: 'assets/motion/walk/walkmotion_female_fast.vmd'
      }
    ];

    let vmdIndex = 0;

    // レンダラーを作成
    const renderer = new THREE_TS.WebGLRenderer({
      canvas: document.querySelector('.stage')
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    // シーンを作成
    const scene = new THREE_TS.Scene();
    // カメラを作成
    const camera = new THREE_TS.PerspectiveCamera(40, width / height);
    camera.position.set(0, 0, 50);
    // カメラコントローラーを作成
    const controls = new OrbitControls(camera);
    // 平行光源を作成
    const directionalLight = new THREE_TS.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    // 環境光を追加
    const ambientLight = new THREE_TS.AmbientLight(0xffffff);
    // scene.add(ambientLight);
    console.dir(THREE);
    // ヘルパーの作成
    const helper = new THREE.MMDAnimationHelper();
    // PMX形式のモデルデータを読み込む
    const loader = new THREE.MMDLoader();
    loader.load('assets/models/yukari/ゆかりver7.pmx', (object: Object3D) => {
      object.translateY(-10);
      // helper.add(object);
      scene.add(object);
      // vmdFileがあれば対応付けする
      if (vmdFiles && vmdFiles.length !== 0) {
        // @ts-ignore
        function readAnime() {
          const vmdFile = vmdFiles[vmdIndex].file;
          // vmdのローダー
          loader.loadVmd(
              vmdFile,
              (vmd) => {
                loader.createAnimation(object, vmd, vmdFiles[vmdIndex].name);
                vmdIndex++;
                if (vmdIndex < vmdFiles.length) {
                  // 配列分読み込むまで再帰呼び出し
                  readAnime();
                } else {
                  // 読み込み終わったらmesh(モデル)に対してアニメーションをセット
                  helper.setAnimation(object);
                  helper.setPhysics(object);
                  helper.unifyAnimationDuration({afterglow: 1.0});
                  // object.mixer.stopAllAction();
                  // 実行
                  selectAnimation(object, 0, true);
                }
              }
          );
        }

        readAnime();
      }
    });
    tick();

    // 通常の関連付けだとモーフファイル(表情のモーションファイル)と分離されてしまうのでくっつけて実行するためのヘルパー
    function selectAnimation(mesh, index, loop) {
      let clip, mclip, action, morph, i;
      i = 2 * index;
      // 一つのアニメーションを抜き出し(モーフじゃない方)
      clip = mesh.geometry.animations[i];
      // ミキサーにセット
      action = mesh.mixer.clipAction(clip);
      // 対応するモーフを抜き出し
      mclip = mesh.geometry.animations[i + 1];
      // ミキサーにセット
      morph = mesh.mixer.clipAction(mclip);
      // ループの設定、
      if (loop) {
        action.repetitions = 'Infinity';
        morph.repetitions = 'Infinity';
      } else {
        action.repetitions = 0;
        morph.repetitions = 0;
      }
      // 一旦全部止めて
      mesh.mixer.stopAllAction();
      // 同時に動かす
      action.play();
      morph.play();
    }

    // 毎フレーム時に実行されるループイベントです
    function tick() {
      // レンダリング
      renderer.render(scene, camera);
      renderer.shadowMap.enabled = true;
      requestAnimationFrame(tick);
    }
  }

  RollingBlockinit() {

    // サイズを指定
    const width = window.innerWidth;
    const height = window.innerHeight;

    // レンダラーを作成
    const renderer = new THREE_TS.WebGLRenderer({
      canvas: document.querySelector('.stage')
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE_TS.Scene();

    // カメラを作成
    const camera = new THREE_TS.PerspectiveCamera(45, width / height);
    camera.position.set(0, 0, +1000);

    // 箱を作成
    const geometry = new THREE_TS.BoxGeometry(400, 400, 400);
    const material = new THREE_TS.MeshNormalMaterial();
    const box = new THREE_TS.Mesh(geometry, material);
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
    const scene = new THREE_TS.Scene();
    // ジオメトリーを作成
    const geometry = new THREE_TS.IcosahedronGeometry(100, 1);
    // マテリアルを作成
    const material = new THREE_TS.MeshBasicMaterial({color: 0xa6b5d7, wireframe: true});
    // メッシュを作成
    const cube = new THREE_TS.Mesh(geometry, material);
    // 3D空間にメッシュを追加
    scene.add(cube);
    // カメラを作成
    const camera = new THREE_TS.PerspectiveCamera(45, 1.0);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.position.set(0, 0, +600);
    // レンダラーを作成
    const renderer = new THREE_TS.WebGLRenderer({
      canvas: document.querySelector('.stage'),
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.render(scene, camera);

    tick();

    // 毎フレーム時に実行されるループイベントです
    function tick() {
      cube.rotation.y += 0.01;
      renderer.render(scene, camera); // レンダリング

      requestAnimationFrame(tick);
    }
  }

}
