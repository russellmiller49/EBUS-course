/// <reference types="vite/client" />

declare module '*.nrrd?url' {
  const url: string;
  export default url;
}

declare module '*.glb?url' {
  const url: string;
  export default url;
}
