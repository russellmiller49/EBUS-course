declare module 'expo-three/lib/polyfill';

declare module 'expo-three/lib/Three' {
  const THREE: typeof import('three');
  export default THREE;
}

declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  import { Group, Loader, LoadingManager } from 'three';

  export interface GLTF {
    scene: Group;
  }

  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager);
    parse(
      data: string | ArrayBuffer,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (error: unknown) => void,
    ): void;
  }
}
