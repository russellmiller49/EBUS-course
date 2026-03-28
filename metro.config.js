const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const threeEntry = path.resolve(__dirname, 'node_modules/three/build/three.cjs');
const defaultResolveRequest = config.resolver.resolveRequest;

if (!config.resolver.assetExts.includes('glb')) {
  config.resolver.assetExts.push('glb');
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'three') {
    return {
      filePath: threeEntry,
      type: 'sourceFile',
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
