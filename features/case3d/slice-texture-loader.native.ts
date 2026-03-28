import { Asset } from 'expo-asset';
import { Image } from 'react-native';
import * as THREE from 'three';

type NativeTextureImage = {
  data: {
    height: number;
    localUri: string;
    uri: string;
    width: number;
  };
  height: number;
  width: number;
};

async function resolveAssetUri(uri: string) {
  const asset = Asset.fromURI(uri);

  if (!asset.localUri) {
    try {
      await asset.downloadAsync();
    } catch (error) {
      if (error instanceof Error && error.message.includes('unsupported URL')) {
        asset.localUri = asset.uri;
      } else {
        throw error;
      }
    }
  }

  return asset.localUri ?? asset.uri;
}

async function measureTexture(uri: string) {
  return new Promise<{ height: number; width: number }>((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ height, width }),
      reject,
    );
  });
}

class NativeSliceTextureLoader extends THREE.Loader<THREE.Texture> {
  load(
    uri: string,
    onLoad?: (texture: THREE.Texture) => void,
    onProgress?: (event: ProgressEvent<EventTarget>) => void,
    onError?: (event: unknown) => void,
  ) {
    const texture = new THREE.Texture();

    void (async () => {
      try {
        const localUri = await resolveAssetUri(uri);
        const { height, width } = await measureTexture(localUri);
        const image: NativeTextureImage = {
          data: {
            height,
            localUri,
            uri: localUri,
            width,
          },
          height,
          width,
        };

        (texture as THREE.Texture & { isDataTexture?: boolean }).isDataTexture = true;
        texture.image = image as unknown as THREE.Texture['image'];
        texture.needsUpdate = true;

        onProgress?.(new ProgressEvent('load'));
        onLoad?.(texture);
      } catch (error) {
        onError?.(error);
      }
    })();

    return texture;
  }
}

export const SliceTextureLoader = NativeSliceTextureLoader;
