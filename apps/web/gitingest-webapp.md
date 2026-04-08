# SoCal EBUS Prep — web app gitingest

Generated for external NLP / code review. Includes `apps/web` source and config, plus repo-root JSON consumed by the Vite app.

- Monorepo layout: repository root contains `apps/web/` (Vite app) and `content/` (shared JSON).
- Max bytes per file: 600000 (large files are summarized, not inlined)

## How this app relates to the monorepo

- Vite `server.fs.allow` includes the repo root so imports like `../../../../content/...` work at dev time.
- Binary media under `apps/web/public/media` is not included here.

## Directory tree (included files only)

```text
├── apps
│   └── web
│       ├── public
│       │   └── pipelines
│       │       └── nrrd-read-image.js
│       ├── src
│       │   ├── app
│       │   │   ├── routes
│       │   │   │   ├── Case001Page.tsx
│       │   │   │   ├── HomePage.tsx
│       │   │   │   ├── KnobologyPage.tsx
│       │   │   │   ├── LecturesPage.tsx
│       │   │   │   ├── NotFoundPage.tsx
│       │   │   │   ├── QuizPage.tsx
│       │   │   │   └── StationsPage.tsx
│       │   │   └── App.tsx
│       │   ├── components
│       │   │   ├── education
│       │   │   │   ├── education.css
│       │   │   │   └── EducationModuleRenderer.tsx
│       │   │   ├── AppShell.tsx
│       │   │   ├── BottomNav.tsx
│       │   │   ├── EmptyState.tsx
│       │   │   ├── ModuleCard.tsx
│       │   │   └── TopHeader.tsx
│       │   ├── content
│       │   │   ├── cases.ts
│       │   │   ├── course.ts
│       │   │   ├── ebus-annotations.json
│       │   │   ├── education.ts
│       │   │   ├── knobology-media.json
│       │   │   ├── knobology.ts
│       │   │   ├── lectures.json
│       │   │   ├── lectures.ts
│       │   │   ├── media.test.ts
│       │   │   ├── media.ts
│       │   │   ├── modules.ts
│       │   │   ├── quiz.ts
│       │   │   ├── station-map-layout.web.json
│       │   │   ├── station-media.json
│       │   │   ├── stations.ts
│       │   │   └── types.ts
│       │   ├── features
│       │   │   ├── case3d
│       │   │   │   ├── vtk
│       │   │   │   │   ├── buildCrosshair.ts
│       │   │   │   │   ├── buildCutPlane.ts
│       │   │   │   │   ├── buildGlbOverlay.ts
│       │   │   │   │   ├── buildOrthogonalPlanes.ts
│       │   │   │   │   ├── buildSegmentationSurface.ts
│       │   │   │   │   ├── configureImageIo.ts
│       │   │   │   │   ├── coordinateTransforms.ts
│       │   │   │   │   ├── ctWindowing.ts
│       │   │   │   │   ├── loadCaseVolume.ts
│       │   │   │   │   ├── loadSegmentation.ts
│       │   │   │   │   └── vtk-extensions.d.ts
│       │   │   │   ├── case001.ts
│       │   │   │   ├── Case3DRoute.tsx
│       │   │   │   ├── Case3DViewer.tsx
│       │   │   │   ├── useCaseOverlay.ts
│       │   │   │   ├── useCasePlanes.ts
│       │   │   │   ├── useCaseTargets.ts
│       │   │   │   ├── useCaseVolume.ts
│       │   │   │   ├── useCutPlane.ts
│       │   │   │   ├── viewerState.test.ts
│       │   │   │   ├── viewerState.ts
│       │   │   │   └── VtkViewport.tsx
│       │   │   ├── knobology
│       │   │   │   ├── processor
│       │   │   │   │   ├── eu-me2-layout.json
│       │   │   │   │   └── EuMe2Keyboard.tsx
│       │   │   │   ├── depthField.test.ts
│       │   │   │   ├── depthField.ts
│       │   │   │   ├── KnobologyPanel.tsx
│       │   │   │   ├── logic.test.ts
│       │   │   │   └── logic.ts
│       │   │   ├── lectures
│       │   │   │   └── LectureCard.tsx
│       │   │   ├── quiz
│       │   │   │   └── QuizCard.tsx
│       │   │   └── stations
│       │   │       ├── StationDetail.tsx
│       │   │       ├── StationMap.tsx
│       │   │       └── StationNode.tsx
│       │   ├── lib
│       │   │   ├── progress.test.ts
│       │   │   ├── progress.tsx
│       │   │   ├── quiz.test.ts
│       │   │   └── quiz.ts
│       │   ├── styles
│       │   │   └── index.css
│       │   ├── main.tsx
│       │   └── vite-env.d.ts
│       ├── gitingest-webapp.md
│       ├── index.html
│       ├── package.json
│       ├── README.md
│       ├── tsconfig.json
│       └── vite.config.ts
└── content
    ├── cases
    │   ├── generated
    │   │   └── case_001.enriched.json
    │   └── case_001.runtime.json
    ├── course
    │   └── course-info.json
    ├── modules
    │   ├── knobology-advanced.json
    │   ├── knobology.json
    │   ├── mediastinal-anatomy.json
    │   ├── modules.json
    │   ├── procedural-technique.json
    │   ├── sonographic-interpretation.json
    │   ├── staging-strategy.json
    │   ├── station-explorer.json
    │   └── station-map.json
    ├── quizzes
    │   ├── knobology-advanced.json
    │   ├── mediastinal-anatomy.json
    │   ├── procedural-technique.json
    │   ├── sonographic-interpretation.json
    │   └── staging-strategy.json
    └── stations
        ├── core-stations.json
        └── station-correlations.json
```

---

## File: `apps/web/gitingest-webapp.md`

> Omitted: apps/web/gitingest-webapp.md is 883205 bytes (max 600000). Open this path locally or raise --max-bytes.

## File: `apps/web/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SoCal EBUS Prep</title>
    <meta
      name="description"
      content="Web learning app for SoCal EBUS Prep with station mapping, knobology labs, lectures, and quizzes."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap"
      rel="stylesheet"
    />
    <script type="module" src="/src/main.tsx"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
  </html>

```

## File: `apps/web/package.json`

```json
{
  "name": "socal-ebus-prep-web",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "gitingest": "node scripts/generate-gitingest.mjs"
  },
  "dependencies": {
    "@itk-wasm/image-io": "^1.6.1",
    "@kitware/vtk.js": "^35.5.1",
    "itk-wasm": "^1.0.0-b.196",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^6.30.1"
  },
  "devDependencies": {
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^4.7.0",
    "typescript": "^5.9.2",
    "vite": "^5.4.19",
    "vitest": "^1.6.1"
  }
}

```

## File: `apps/web/public/pipelines/nrrd-read-image.js`

```

var nrrdReadImage = (() => {
  var _scriptName = import.meta.url;
  
  return (
async function(moduleArg = {}) {
  var moduleRtn;

var Module=moduleArg;var readyPromiseResolve,readyPromiseReject;var readyPromise=new Promise((resolve,reject)=>{readyPromiseResolve=resolve;readyPromiseReject=reject});var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof WorkerGlobalScope!="undefined";var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string"&&process.type!="renderer";if(ENVIRONMENT_IS_NODE){const{createRequire}=await import("module");let dirname=import.meta.url;if(dirname.startsWith("data:")){dirname="/"}var require=createRequire(dirname)}var mStdout=null;var mStderr=null;Module["resetModuleStdout"]=function(){mStdout=""};Module["resetModuleStderr"]=function(){mStderr=""};Module["print"]=function(text){console.log(text);mStdout+=text+"\n"};Module["printErr"]=function(text){console.error(text);mStderr+=text+"\n"};Module["getModuleStdout"]=function(){return mStdout};Module["getModuleStderr"]=function(){return mStderr};var mStdout=null;var mStderr=null;Module["resetModuleStdout"]=function(){mStdout=""};Module["resetModuleStderr"]=function(){mStderr=""};Module["print"]=function(text){console.log(text);mStdout+=text+"\n"};Module["printErr"]=function(text){console.error(text);mStderr+=text+"\n"};Module["getModuleStdout"]=function(){return mStdout};Module["getModuleStderr"]=function(){return mStderr};var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var readAsync,readBinary;if(ENVIRONMENT_IS_NODE){var fs=require("fs");var nodePath=require("path");if(!import.meta.url.startsWith("data:")){scriptDirectory=nodePath.dirname(require("url").fileURLToPath(import.meta.url))+"/"}readBinary=filename=>{filename=isFileURI(filename)?new URL(filename):filename;var ret=fs.readFileSync(filename);return ret};readAsync=async(filename,binary=true)=>{filename=isFileURI(filename)?new URL(filename):filename;var ret=fs.readFileSync(filename,binary?undefined:"utf8");return ret};if(!Module["thisProgram"]&&process.argv.length>1){thisProgram=process.argv[1].replace(/\\/g,"/")}arguments_=process.argv.slice(2);quit_=(status,toThrow)=>{process.exitCode=status;throw toThrow}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptName){scriptDirectory=_scriptName}if(scriptDirectory.startsWith("blob:")){scriptDirectory=""}else{scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}{if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=async url=>{if(isFileURI(url)){return new Promise((resolve,reject)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){resolve(xhr.response);return}reject(xhr.status)};xhr.onerror=reject;xhr.send(null)})}var response=await fetch(url,{credentials:"same-origin"});if(response.ok){return response.arrayBuffer()}throw new Error(response.status+" : "+response.url)}}}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.error.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];var wasmBinary=Module["wasmBinary"];var wasmMemory;var ABORT=false;var EXITSTATUS;var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateMemoryViews(){var b=wasmMemory.buffer;Module["HEAP8"]=HEAP8=new Int8Array(b);Module["HEAP16"]=HEAP16=new Int16Array(b);Module["HEAPU8"]=HEAPU8=new Uint8Array(b);Module["HEAPU16"]=HEAPU16=new Uint16Array(b);Module["HEAP32"]=HEAP32=new Int32Array(b);Module["HEAPU32"]=HEAPU32=new Uint32Array(b);Module["HEAPF32"]=HEAPF32=new Float32Array(b);Module["HEAPF64"]=HEAPF64=new Float64Array(b)}var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;if(!Module["noFSInit"]&&!FS.initialized)FS.init();FS.ignorePermissions=false;TTY.init();callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var dependenciesFulfilled=null;function getUniqueRunDependency(id){return id}function addRunDependency(id){runDependencies++;Module["monitorRunDependencies"]?.(runDependencies)}function removeRunDependency(id){runDependencies--;Module["monitorRunDependencies"]?.(runDependencies);if(runDependencies==0){if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){Module["onAbort"]?.(what);what="Aborted("+what+")";err(what);ABORT=true;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";var isDataURI=filename=>filename.startsWith(dataURIPrefix);var isFileURI=filename=>filename.startsWith("file://");function findWasmBinary(){if(Module["locateFile"]){var f="nrrd-read-image.wasm";if(!isDataURI(f)){return locateFile(f)}return f}return new URL("nrrd-read-image.wasm",import.meta.url).href}var wasmBinaryFile;function getBinarySync(file){if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}async function getWasmBinary(binaryFile){if(!wasmBinary){try{var response=await readAsync(binaryFile);return new Uint8Array(response)}catch{}}return getBinarySync(binaryFile)}async function instantiateArrayBuffer(binaryFile,imports){try{var binary=await getWasmBinary(binaryFile);var instance=await WebAssembly.instantiate(binary,imports);return instance}catch(reason){err(`failed to asynchronously prepare wasm: ${reason}`);abort(reason)}}async function instantiateAsync(binary,binaryFile,imports){if(!binary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(binaryFile)&&!isFileURI(binaryFile)&&!ENVIRONMENT_IS_NODE&&typeof fetch=="function"){try{var response=fetch(binaryFile,{credentials:"same-origin"});var instantiationResult=await WebAssembly.instantiateStreaming(response,imports);return instantiationResult}catch(reason){err(`wasm streaming compile failed: ${reason}`);err("falling back to ArrayBuffer instantiation")}}return instantiateArrayBuffer(binaryFile,imports)}function getWasmImports(){return{a:wasmImports}}async function createWasm(){function receiveInstance(instance,module){wasmExports=instance.exports;wasmExports=applySignatureConversions(wasmExports);wasmMemory=wasmExports["B"];updateMemoryViews();addOnInit(wasmExports["C"]);removeRunDependency("wasm-instantiate");return wasmExports}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}var info=getWasmImports();if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err(`Module.instantiateWasm callback failed with error: ${e}`);readyPromiseReject(e)}}wasmBinaryFile??=findWasmBinary();try{var result=await instantiateAsync(wasmBinary,wasmBinaryFile,info);receiveInstantiationResult(result);return result}catch(e){readyPromiseReject(e);return}}var tempDouble;var tempI64;class ExitStatus{name="ExitStatus";constructor(status){this.message=`Program terminated with exit(${status})`;this.status=status}}var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){callbacks.shift()(Module)}};var noExitRuntime=Module["noExitRuntime"]||true;var stackRestore=val=>__emscripten_stack_restore(val);var stackSave=()=>_emscripten_stack_get_current();class ExceptionInfo{constructor(excPtr){this.excPtr=excPtr;this.ptr=excPtr-24}set_type(type){HEAPU32[this.ptr+4>>>2>>>0]=type}get_type(){return HEAPU32[this.ptr+4>>>2>>>0]}set_destructor(destructor){HEAPU32[this.ptr+8>>>2>>>0]=destructor}get_destructor(){return HEAPU32[this.ptr+8>>>2>>>0]}set_caught(caught){caught=caught?1:0;HEAP8[this.ptr+12>>>0]=caught}get_caught(){return HEAP8[this.ptr+12>>>0]!=0}set_rethrown(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+13>>>0]=rethrown}get_rethrown(){return HEAP8[this.ptr+13>>>0]!=0}init(type,destructor){this.set_adjusted_ptr(0);this.set_type(type);this.set_destructor(destructor)}set_adjusted_ptr(adjustedPtr){HEAPU32[this.ptr+16>>>2>>>0]=adjustedPtr}get_adjusted_ptr(){return HEAPU32[this.ptr+16>>>2>>>0]}}var exceptionLast=0;var uncaughtExceptionCount=0;var convertI32PairToI53Checked=(lo,hi)=>hi+2097152>>>0<4194305-!!lo?(lo>>>0)+hi*4294967296:NaN;function ___cxa_throw(ptr,type,destructor){ptr>>>=0;type>>>=0;destructor>>>=0;var info=new ExceptionInfo(ptr);info.init(type,destructor);exceptionLast=ptr;uncaughtExceptionCount++;throw exceptionLast}var PATH={isAbs:path=>path.charAt(0)==="/",splitPath:filename=>{var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return splitPathRe.exec(filename).slice(1)},normalizeArray:(parts,allowAboveRoot)=>{var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift("..")}}return parts},normalize:path=>{var isAbsolute=PATH.isAbs(path),trailingSlash=path.substr(-1)==="/";path=PATH.normalizeArray(path.split("/").filter(p=>!!p),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path},dirname:path=>{var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.substr(0,dir.length-1)}return root+dir},basename:path=>{if(path==="/")return"/";path=PATH.normalize(path);path=path.replace(/\/$/,"");var lastSlash=path.lastIndexOf("/");if(lastSlash===-1)return path;return path.substr(lastSlash+1)},join:(...paths)=>PATH.normalize(paths.join("/")),join2:(l,r)=>PATH.normalize(l+"/"+r)};var initRandomFill=()=>{if(typeof crypto=="object"&&typeof crypto["getRandomValues"]=="function"){return view=>crypto.getRandomValues(view)}else if(ENVIRONMENT_IS_NODE){try{var crypto_module=require("crypto");var randomFillSync=crypto_module["randomFillSync"];if(randomFillSync){return view=>crypto_module["randomFillSync"](view)}var randomBytes=crypto_module["randomBytes"];return view=>(view.set(randomBytes(view.byteLength)),view)}catch(e){}}abort("initRandomDevice")};var randomFill=view=>(randomFill=initRandomFill())(view);var PATH_FS={resolve:(...args)=>{var resolvedPath="",resolvedAbsolute=false;for(var i=args.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?args[i]:FS.cwd();if(typeof path!="string"){throw new TypeError("Arguments to path.resolve must be strings")}else if(!path){return""}resolvedPath=path+"/"+resolvedPath;resolvedAbsolute=PATH.isAbs(path)}resolvedPath=PATH.normalizeArray(resolvedPath.split("/").filter(p=>!!p),!resolvedAbsolute).join("/");return(resolvedAbsolute?"/":"")+resolvedPath||"."},relative:(from,to)=>{from=PATH_FS.resolve(from).substr(1);to=PATH_FS.resolve(to).substr(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=="")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=="")break}if(start>end)return[];return arr.slice(start,end-start+1)}var fromParts=trim(from.split("/"));var toParts=trim(to.split("/"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push("..")}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join("/")}};var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder:undefined;var UTF8ArrayToString=(heapOrArray,idx=0,maxBytesToRead=NaN)=>{idx>>>=0;var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str};var FS_stdin_getChar_buffer=[];var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len};var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{outIdx>>>=0;if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++>>>0]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++>>>0]=192|u>>6;heap[outIdx++>>>0]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++>>>0]=224|u>>12;heap[outIdx++>>>0]=128|u>>6&63;heap[outIdx++>>>0]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++>>>0]=240|u>>18;heap[outIdx++>>>0]=128|u>>12&63;heap[outIdx++>>>0]=128|u>>6&63;heap[outIdx++>>>0]=128|u&63}}heap[outIdx>>>0]=0;return outIdx-startIdx};function intArrayFromString(stringy,dontAddNull,length){var len=length>0?length:lengthBytesUTF8(stringy)+1;var u8array=new Array(len);var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);if(dontAddNull)u8array.length=numBytesWritten;return u8array}var FS_stdin_getChar=()=>{if(!FS_stdin_getChar_buffer.length){var result=null;if(ENVIRONMENT_IS_NODE){var BUFSIZE=256;var buf=Buffer.alloc(BUFSIZE);var bytesRead=0;var fd=process.stdin.fd;try{bytesRead=fs.readSync(fd,buf,0,BUFSIZE)}catch(e){if(e.toString().includes("EOF"))bytesRead=0;else throw e}if(bytesRead>0){result=buf.slice(0,bytesRead).toString("utf-8")}}else if(typeof window!="undefined"&&typeof window.prompt=="function"){result=window.prompt("Input: ");if(result!==null){result+="\n"}}else{}if(!result){return null}FS_stdin_getChar_buffer=intArrayFromString(result,true)}return FS_stdin_getChar_buffer.shift()};var TTY={ttys:[],init(){},shutdown(){},register(dev,ops){TTY.ttys[dev]={input:[],output:[],ops};FS.registerDevice(dev,TTY.stream_ops)},stream_ops:{open(stream){var tty=TTY.ttys[stream.node.rdev];if(!tty){throw new FS.ErrnoError(43)}stream.tty=tty;stream.seekable=false},close(stream){stream.tty.ops.fsync(stream.tty)},fsync(stream){stream.tty.ops.fsync(stream.tty)},read(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.get_char){throw new FS.ErrnoError(60)}var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=stream.tty.ops.get_char(stream.tty)}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.atime=Date.now()}return bytesRead},write(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.put_char){throw new FS.ErrnoError(60)}try{for(var i=0;i<length;i++){stream.tty.ops.put_char(stream.tty,buffer[offset+i])}}catch(e){throw new FS.ErrnoError(29)}if(length){stream.node.mtime=stream.node.ctime=Date.now()}return i}},default_tty_ops:{get_char(tty){return FS_stdin_getChar()},put_char(tty,val){if(val===null||val===10){out(UTF8ArrayToString(tty.output));tty.output=[]}else{if(val!=0)tty.output.push(val)}},fsync(tty){if(tty.output&&tty.output.length>0){out(UTF8ArrayToString(tty.output));tty.output=[]}},ioctl_tcgets(tty){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(tty,optional_actions,data){return 0},ioctl_tiocgwinsz(tty){return[24,80]}},default_tty1_ops:{put_char(tty,val){if(val===null||val===10){err(UTF8ArrayToString(tty.output));tty.output=[]}else{if(val!=0)tty.output.push(val)}},fsync(tty){if(tty.output&&tty.output.length>0){err(UTF8ArrayToString(tty.output));tty.output=[]}}}};var alignMemory=(size,alignment)=>Math.ceil(size/alignment)*alignment;var mmapAlloc=size=>{abort()};var MEMFS={ops_table:null,mount(mount){return MEMFS.createNode(null,"/",16895,0)},createNode(parent,name,mode,dev){if(FS.isBlkdev(mode)||FS.isFIFO(mode)){throw new FS.ErrnoError(63)}MEMFS.ops_table||={dir:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,lookup:MEMFS.node_ops.lookup,mknod:MEMFS.node_ops.mknod,rename:MEMFS.node_ops.rename,unlink:MEMFS.node_ops.unlink,rmdir:MEMFS.node_ops.rmdir,readdir:MEMFS.node_ops.readdir,symlink:MEMFS.node_ops.symlink},stream:{llseek:MEMFS.stream_ops.llseek}},file:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:{llseek:MEMFS.stream_ops.llseek,read:MEMFS.stream_ops.read,write:MEMFS.stream_ops.write,allocate:MEMFS.stream_ops.allocate,mmap:MEMFS.stream_ops.mmap,msync:MEMFS.stream_ops.msync}},link:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,readlink:MEMFS.node_ops.readlink},stream:{}},chrdev:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:FS.chrdev_stream_ops}};var node=FS.createNode(parent,name,mode,dev);if(FS.isDir(node.mode)){node.node_ops=MEMFS.ops_table.dir.node;node.stream_ops=MEMFS.ops_table.dir.stream;node.contents={}}else if(FS.isFile(node.mode)){node.node_ops=MEMFS.ops_table.file.node;node.stream_ops=MEMFS.ops_table.file.stream;node.usedBytes=0;node.contents=null}else if(FS.isLink(node.mode)){node.node_ops=MEMFS.ops_table.link.node;node.stream_ops=MEMFS.ops_table.link.stream}else if(FS.isChrdev(node.mode)){node.node_ops=MEMFS.ops_table.chrdev.node;node.stream_ops=MEMFS.ops_table.chrdev.stream}node.atime=node.mtime=node.ctime=Date.now();if(parent){parent.contents[name]=node;parent.atime=parent.mtime=parent.ctime=node.atime}return node},getFileDataAsTypedArray(node){if(!node.contents)return new Uint8Array(0);if(node.contents.subarray)return node.contents.subarray(0,node.usedBytes);return new Uint8Array(node.contents)},expandFileStorage(node,newCapacity){var prevCapacity=node.contents?node.contents.length:0;if(prevCapacity>=newCapacity)return;var CAPACITY_DOUBLING_MAX=1024*1024;newCapacity=Math.max(newCapacity,prevCapacity*(prevCapacity<CAPACITY_DOUBLING_MAX?2:1.125)>>>0);if(prevCapacity!=0)newCapacity=Math.max(newCapacity,256);var oldContents=node.contents;node.contents=new Uint8Array(newCapacity);if(node.usedBytes>0)node.contents.set(oldContents.subarray(0,node.usedBytes),0)},resizeFileStorage(node,newSize){if(node.usedBytes==newSize)return;if(newSize==0){node.contents=null;node.usedBytes=0}else{var oldContents=node.contents;node.contents=new Uint8Array(newSize);if(oldContents){node.contents.set(oldContents.subarray(0,Math.min(newSize,node.usedBytes)))}node.usedBytes=newSize}},node_ops:{getattr(node){var attr={};attr.dev=FS.isChrdev(node.mode)?node.id:1;attr.ino=node.id;attr.mode=node.mode;attr.nlink=1;attr.uid=0;attr.gid=0;attr.rdev=node.rdev;if(FS.isDir(node.mode)){attr.size=4096}else if(FS.isFile(node.mode)){attr.size=node.usedBytes}else if(FS.isLink(node.mode)){attr.size=node.link.length}else{attr.size=0}attr.atime=new Date(node.atime);attr.mtime=new Date(node.mtime);attr.ctime=new Date(node.ctime);attr.blksize=4096;attr.blocks=Math.ceil(attr.size/attr.blksize);return attr},setattr(node,attr){for(const key of["mode","atime","mtime","ctime"]){if(attr[key]){node[key]=attr[key]}}if(attr.size!==undefined){MEMFS.resizeFileStorage(node,attr.size)}},lookup(parent,name){throw MEMFS.doesNotExistError},mknod(parent,name,mode,dev){return MEMFS.createNode(parent,name,mode,dev)},rename(old_node,new_dir,new_name){var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(new_node){if(FS.isDir(old_node.mode)){for(var i in new_node.contents){throw new FS.ErrnoError(55)}}FS.hashRemoveNode(new_node)}delete old_node.parent.contents[old_node.name];new_dir.contents[new_name]=old_node;old_node.name=new_name;new_dir.ctime=new_dir.mtime=old_node.parent.ctime=old_node.parent.mtime=Date.now()},unlink(parent,name){delete parent.contents[name];parent.ctime=parent.mtime=Date.now()},rmdir(parent,name){var node=FS.lookupNode(parent,name);for(var i in node.contents){throw new FS.ErrnoError(55)}delete parent.contents[name];parent.ctime=parent.mtime=Date.now()},readdir(node){return[".","..",...Object.keys(node.contents)]},symlink(parent,newname,oldpath){var node=MEMFS.createNode(parent,newname,511|40960,0);node.link=oldpath;return node},readlink(node){if(!FS.isLink(node.mode)){throw new FS.ErrnoError(28)}return node.link}},stream_ops:{read(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=stream.node.usedBytes)return 0;var size=Math.min(stream.node.usedBytes-position,length);if(size>8&&contents.subarray){buffer.set(contents.subarray(position,position+size),offset)}else{for(var i=0;i<size;i++)buffer[offset+i]=contents[position+i]}return size},write(stream,buffer,offset,length,position,canOwn){if(buffer.buffer===HEAP8.buffer){canOwn=false}if(!length)return 0;var node=stream.node;node.mtime=node.ctime=Date.now();if(buffer.subarray&&(!node.contents||node.contents.subarray)){if(canOwn){node.contents=buffer.subarray(offset,offset+length);node.usedBytes=length;return length}else if(node.usedBytes===0&&position===0){node.contents=buffer.slice(offset,offset+length);node.usedBytes=length;return length}else if(position+length<=node.usedBytes){node.contents.set(buffer.subarray(offset,offset+length),position);return length}}MEMFS.expandFileStorage(node,position+length);if(node.contents.subarray&&buffer.subarray){node.contents.set(buffer.subarray(offset,offset+length),position)}else{for(var i=0;i<length;i++){node.contents[position+i]=buffer[offset+i]}}node.usedBytes=Math.max(node.usedBytes,position+length);return length},llseek(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.usedBytes}}if(position<0){throw new FS.ErrnoError(28)}return position},allocate(stream,offset,length){MEMFS.expandFileStorage(stream.node,offset+length);stream.node.usedBytes=Math.max(stream.node.usedBytes,offset+length)},mmap(stream,length,position,prot,flags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}var ptr;var allocated;var contents=stream.node.contents;if(!(flags&2)&&contents&&contents.buffer===HEAP8.buffer){allocated=false;ptr=contents.byteOffset}else{allocated=true;ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}if(contents){if(position>0||position+length<contents.length){if(contents.subarray){contents=contents.subarray(position,position+length)}else{contents=Array.prototype.slice.call(contents,position,position+length)}}HEAP8.set(contents,ptr>>>0)}}return{ptr,allocated}},msync(stream,buffer,offset,length,mmapFlags){MEMFS.stream_ops.write(stream,buffer,0,length,offset,false);return 0}}};var asyncLoad=async url=>{var arrayBuffer=await readAsync(url);return new Uint8Array(arrayBuffer)};var FS_createDataFile=(parent,name,fileData,canRead,canWrite,canOwn)=>{FS.createDataFile(parent,name,fileData,canRead,canWrite,canOwn)};var preloadPlugins=Module["preloadPlugins"]||[];var FS_handledByPreloadPlugin=(byteArray,fullname,finish,onerror)=>{if(typeof Browser!="undefined")Browser.init();var handled=false;preloadPlugins.forEach(plugin=>{if(handled)return;if(plugin["canHandle"](fullname)){plugin["handle"](byteArray,fullname,finish,onerror);handled=true}});return handled};var FS_createPreloadedFile=(parent,name,url,canRead,canWrite,onload,onerror,dontCreateFile,canOwn,preFinish)=>{var fullname=name?PATH_FS.resolve(PATH.join2(parent,name)):parent;var dep=getUniqueRunDependency(`cp ${fullname}`);function processData(byteArray){function finish(byteArray){preFinish?.();if(!dontCreateFile){FS_createDataFile(parent,name,byteArray,canRead,canWrite,canOwn)}onload?.();removeRunDependency(dep)}if(FS_handledByPreloadPlugin(byteArray,fullname,finish,()=>{onerror?.();removeRunDependency(dep)})){return}finish(byteArray)}addRunDependency(dep);if(typeof url=="string"){asyncLoad(url).then(processData,onerror)}else{processData(url)}};var FS_modeStringToFlags=str=>{var flagModes={r:0,"r+":2,w:512|64|1,"w+":512|64|2,a:1024|64|1,"a+":1024|64|2};var flags=flagModes[str];if(typeof flags=="undefined"){throw new Error(`Unknown file open mode: ${str}`)}return flags};var FS_getMode=(canRead,canWrite)=>{var mode=0;if(canRead)mode|=292|73;if(canWrite)mode|=146;return mode};var ERRNO_CODES={EPERM:63,ENOENT:44,ESRCH:71,EINTR:27,EIO:29,ENXIO:60,E2BIG:1,ENOEXEC:45,EBADF:8,ECHILD:12,EAGAIN:6,EWOULDBLOCK:6,ENOMEM:48,EACCES:2,EFAULT:21,ENOTBLK:105,EBUSY:10,EEXIST:20,EXDEV:75,ENODEV:43,ENOTDIR:54,EISDIR:31,EINVAL:28,ENFILE:41,EMFILE:33,ENOTTY:59,ETXTBSY:74,EFBIG:22,ENOSPC:51,ESPIPE:70,EROFS:69,EMLINK:34,EPIPE:64,EDOM:18,ERANGE:68,ENOMSG:49,EIDRM:24,ECHRNG:106,EL2NSYNC:156,EL3HLT:107,EL3RST:108,ELNRNG:109,EUNATCH:110,ENOCSI:111,EL2HLT:112,EDEADLK:16,ENOLCK:46,EBADE:113,EBADR:114,EXFULL:115,ENOANO:104,EBADRQC:103,EBADSLT:102,EDEADLOCK:16,EBFONT:101,ENOSTR:100,ENODATA:116,ETIME:117,ENOSR:118,ENONET:119,ENOPKG:120,EREMOTE:121,ENOLINK:47,EADV:122,ESRMNT:123,ECOMM:124,EPROTO:65,EMULTIHOP:36,EDOTDOT:125,EBADMSG:9,ENOTUNIQ:126,EBADFD:127,EREMCHG:128,ELIBACC:129,ELIBBAD:130,ELIBSCN:131,ELIBMAX:132,ELIBEXEC:133,ENOSYS:52,ENOTEMPTY:55,ENAMETOOLONG:37,ELOOP:32,EOPNOTSUPP:138,EPFNOSUPPORT:139,ECONNRESET:15,ENOBUFS:42,EAFNOSUPPORT:5,EPROTOTYPE:67,ENOTSOCK:57,ENOPROTOOPT:50,ESHUTDOWN:140,ECONNREFUSED:14,EADDRINUSE:3,ECONNABORTED:13,ENETUNREACH:40,ENETDOWN:38,ETIMEDOUT:73,EHOSTDOWN:142,EHOSTUNREACH:23,EINPROGRESS:26,EALREADY:7,EDESTADDRREQ:17,EMSGSIZE:35,EPROTONOSUPPORT:66,ESOCKTNOSUPPORT:137,EADDRNOTAVAIL:4,ENETRESET:39,EISCONN:30,ENOTCONN:53,ETOOMANYREFS:141,EUSERS:136,EDQUOT:19,ESTALE:72,ENOTSUP:138,ENOMEDIUM:148,EILSEQ:25,EOVERFLOW:61,ECANCELED:11,ENOTRECOVERABLE:56,EOWNERDEAD:62,ESTRPIPE:135};var NODEFS={isWindows:false,staticInit(){NODEFS.isWindows=!!process.platform.match(/^win/);var flags=process.binding("constants");if(flags["fs"]){flags=flags["fs"]}NODEFS.flagsForNodeMap={1024:flags["O_APPEND"],64:flags["O_CREAT"],128:flags["O_EXCL"],256:flags["O_NOCTTY"],0:flags["O_RDONLY"],2:flags["O_RDWR"],4096:flags["O_SYNC"],512:flags["O_TRUNC"],1:flags["O_WRONLY"],131072:flags["O_NOFOLLOW"]}},convertNodeCode(e){var code=e.code;return ERRNO_CODES[code]},tryFSOperation(f){try{return f()}catch(e){if(!e.code)throw e;if(e.code==="UNKNOWN")throw new FS.ErrnoError(28);throw new FS.ErrnoError(NODEFS.convertNodeCode(e))}},mount(mount){return NODEFS.createNode(null,"/",NODEFS.getMode(mount.opts.root),0)},createNode(parent,name,mode,dev){if(!FS.isDir(mode)&&!FS.isFile(mode)&&!FS.isLink(mode)){throw new FS.ErrnoError(28)}var node=FS.createNode(parent,name,mode);node.node_ops=NODEFS.node_ops;node.stream_ops=NODEFS.stream_ops;return node},getMode(path){return NODEFS.tryFSOperation(()=>{var mode=fs.lstatSync(path).mode;if(NODEFS.isWindows){mode|=(mode&292)>>2}return mode})},realPath(node){var parts=[];while(node.parent!==node){parts.push(node.name);node=node.parent}parts.push(node.mount.opts.root);parts.reverse();return PATH.join(...parts)},flagsForNode(flags){flags&=~2097152;flags&=~2048;flags&=~32768;flags&=~524288;flags&=~65536;var newFlags=0;for(var k in NODEFS.flagsForNodeMap){if(flags&k){newFlags|=NODEFS.flagsForNodeMap[k];flags^=k}}if(flags){throw new FS.ErrnoError(28)}return newFlags},node_ops:{getattr(node){var path=NODEFS.realPath(node);var stat;NODEFS.tryFSOperation(()=>stat=fs.lstatSync(path));if(NODEFS.isWindows){if(!stat.blksize){stat.blksize=4096}if(!stat.blocks){stat.blocks=(stat.size+stat.blksize-1)/stat.blksize|0}stat.mode|=(stat.mode&292)>>2}return{dev:stat.dev,ino:stat.ino,mode:stat.mode,nlink:stat.nlink,uid:stat.uid,gid:stat.gid,rdev:stat.rdev,size:stat.size,atime:stat.atime,mtime:stat.mtime,ctime:stat.ctime,blksize:stat.blksize,blocks:stat.blocks}},setattr(node,attr){var path=NODEFS.realPath(node);NODEFS.tryFSOperation(()=>{if(attr.mode!==undefined){var mode=attr.mode;if(NODEFS.isWindows){mode&=384}fs.chmodSync(path,mode);node.mode=attr.mode}if(attr.atime||attr.mtime){var atime=attr.atime&&new Date(attr.atime);var mtime=attr.mtime&&new Date(attr.mtime);fs.utimesSync(path,atime,mtime)}if(attr.size!==undefined){fs.truncateSync(path,attr.size)}})},lookup(parent,name){var path=PATH.join2(NODEFS.realPath(parent),name);var mode=NODEFS.getMode(path);return NODEFS.createNode(parent,name,mode)},mknod(parent,name,mode,dev){var node=NODEFS.createNode(parent,name,mode,dev);var path=NODEFS.realPath(node);NODEFS.tryFSOperation(()=>{if(FS.isDir(node.mode)){fs.mkdirSync(path,node.mode)}else{fs.writeFileSync(path,"",{mode:node.mode})}});return node},rename(oldNode,newDir,newName){var oldPath=NODEFS.realPath(oldNode);var newPath=PATH.join2(NODEFS.realPath(newDir),newName);try{FS.unlink(newPath)}catch(e){}NODEFS.tryFSOperation(()=>fs.renameSync(oldPath,newPath));oldNode.name=newName},unlink(parent,name){var path=PATH.join2(NODEFS.realPath(parent),name);NODEFS.tryFSOperation(()=>fs.unlinkSync(path))},rmdir(parent,name){var path=PATH.join2(NODEFS.realPath(parent),name);NODEFS.tryFSOperation(()=>fs.rmdirSync(path))},readdir(node){var path=NODEFS.realPath(node);return NODEFS.tryFSOperation(()=>fs.readdirSync(path))},symlink(parent,newName,oldPath){var newPath=PATH.join2(NODEFS.realPath(parent),newName);NODEFS.tryFSOperation(()=>fs.symlinkSync(oldPath,newPath))},readlink(node){var path=NODEFS.realPath(node);return NODEFS.tryFSOperation(()=>fs.readlinkSync(path))},statfs(path){var stats=NODEFS.tryFSOperation(()=>fs.statfsSync(path));stats.frsize=stats.bsize;return stats}},stream_ops:{open(stream){var path=NODEFS.realPath(stream.node);NODEFS.tryFSOperation(()=>{if(FS.isFile(stream.node.mode)){stream.shared.refcount=1;stream.nfd=fs.openSync(path,NODEFS.flagsForNode(stream.flags))}})},close(stream){NODEFS.tryFSOperation(()=>{if(FS.isFile(stream.node.mode)&&stream.nfd&&--stream.shared.refcount===0){fs.closeSync(stream.nfd)}})},dup(stream){stream.shared.refcount++},read(stream,buffer,offset,length,position){if(length===0)return 0;return NODEFS.tryFSOperation(()=>fs.readSync(stream.nfd,new Int8Array(buffer.buffer,offset,length),0,length,position))},write(stream,buffer,offset,length,position){return NODEFS.tryFSOperation(()=>fs.writeSync(stream.nfd,new Int8Array(buffer.buffer,offset,length),0,length,position))},llseek(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){NODEFS.tryFSOperation(()=>{var stat=fs.fstatSync(stream.nfd);position+=stat.size})}}if(position<0){throw new FS.ErrnoError(28)}return position},mmap(stream,length,position,prot,flags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}var ptr=mmapAlloc(length);NODEFS.stream_ops.read(stream,HEAP8,ptr,length,position);return{ptr,allocated:true}},msync(stream,buffer,offset,length,mmapFlags){NODEFS.stream_ops.write(stream,buffer,0,length,offset,false);return 0}}};var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:class{name="ErrnoError";constructor(errno){this.errno=errno}},filesystems:null,syncFSRequests:0,readFiles:{},FSStream:class{shared={};get object(){return this.node}set object(val){this.node=val}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(val){this.shared.flags=val}get position(){return this.shared.position}set position(val){this.shared.position=val}},FSNode:class{node_ops={};stream_ops={};readMode=292|73;writeMode=146;mounted=null;constructor(parent,name,mode,rdev){if(!parent){parent=this}this.parent=parent;this.mount=parent.mount;this.id=FS.nextInode++;this.name=name;this.mode=mode;this.rdev=rdev;this.atime=this.mtime=this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(val){val?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(val){val?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return FS.isDir(this.mode)}get isDevice(){return FS.isChrdev(this.mode)}},lookupPath(path,opts={}){if(!path)return{path:"",node:null};opts.follow_mount??=true;if(!PATH.isAbs(path)){path=FS.cwd()+"/"+path}linkloop:for(var nlinks=0;nlinks<40;nlinks++){var parts=path.split("/").filter(p=>!!p&&p!==".");var current=FS.root;var current_path="/";for(var i=0;i<parts.length;i++){var islast=i===parts.length-1;if(islast&&opts.parent){break}if(parts[i]===".."){current_path=PATH.dirname(current_path);current=current.parent;continue}current_path=PATH.join2(current_path,parts[i]);try{current=FS.lookupNode(current,parts[i])}catch(e){if(e?.errno===44&&islast&&opts.noent_okay){return{path:current_path}}throw e}if(FS.isMountpoint(current)&&(!islast||opts.follow_mount)){current=current.mounted.root}if(FS.isLink(current.mode)&&(!islast||opts.follow)){if(!current.node_ops.readlink){throw new FS.ErrnoError(52)}var link=current.node_ops.readlink(current);if(!PATH.isAbs(link)){link=PATH.dirname(current_path)+"/"+link}path=link+"/"+parts.slice(i+1).join("/");continue linkloop}}return{path:current_path,node:current}}throw new FS.ErrnoError(32)},getPath(node){var path;while(true){if(FS.isRoot(node)){var mount=node.mount.mountpoint;if(!path)return mount;return mount[mount.length-1]!=="/"?`${mount}/${path}`:mount+path}path=path?`${node.name}/${path}`:node.name;node=node.parent}},hashName(parentid,name){var hash=0;for(var i=0;i<name.length;i++){hash=(hash<<5)-hash+name.charCodeAt(i)|0}return(parentid+hash>>>0)%FS.nameTable.length},hashAddNode(node){var hash=FS.hashName(node.parent.id,node.name);node.name_next=FS.nameTable[hash];FS.nameTable[hash]=node},hashRemoveNode(node){var hash=FS.hashName(node.parent.id,node.name);if(FS.nameTable[hash]===node){FS.nameTable[hash]=node.name_next}else{var current=FS.nameTable[hash];while(current){if(current.name_next===node){current.name_next=node.name_next;break}current=current.name_next}}},lookupNode(parent,name){var errCode=FS.mayLookup(parent);if(errCode){throw new FS.ErrnoError(errCode)}var hash=FS.hashName(parent.id,name);for(var node=FS.nameTable[hash];node;node=node.name_next){var nodeName=node.name;if(node.parent.id===parent.id&&nodeName===name){return node}}return FS.lookup(parent,name)},createNode(parent,name,mode,rdev){var node=new FS.FSNode(parent,name,mode,rdev);FS.hashAddNode(node);return node},destroyNode(node){FS.hashRemoveNode(node)},isRoot(node){return node===node.parent},isMountpoint(node){return!!node.mounted},isFile(mode){return(mode&61440)===32768},isDir(mode){return(mode&61440)===16384},isLink(mode){return(mode&61440)===40960},isChrdev(mode){return(mode&61440)===8192},isBlkdev(mode){return(mode&61440)===24576},isFIFO(mode){return(mode&61440)===4096},isSocket(mode){return(mode&49152)===49152},flagsToPermissionString(flag){var perms=["r","w","rw"][flag&3];if(flag&512){perms+="w"}return perms},nodePermissions(node,perms){if(FS.ignorePermissions){return 0}if(perms.includes("r")&&!(node.mode&292)){return 2}else if(perms.includes("w")&&!(node.mode&146)){return 2}else if(perms.includes("x")&&!(node.mode&73)){return 2}return 0},mayLookup(dir){if(!FS.isDir(dir.mode))return 54;var errCode=FS.nodePermissions(dir,"x");if(errCode)return errCode;if(!dir.node_ops.lookup)return 2;return 0},mayCreate(dir,name){if(!FS.isDir(dir.mode)){return 54}try{var node=FS.lookupNode(dir,name);return 20}catch(e){}return FS.nodePermissions(dir,"wx")},mayDelete(dir,name,isdir){var node;try{node=FS.lookupNode(dir,name)}catch(e){return e.errno}var errCode=FS.nodePermissions(dir,"wx");if(errCode){return errCode}if(isdir){if(!FS.isDir(node.mode)){return 54}if(FS.isRoot(node)||FS.getPath(node)===FS.cwd()){return 10}}else{if(FS.isDir(node.mode)){return 31}}return 0},mayOpen(node,flags){if(!node){return 44}if(FS.isLink(node.mode)){return 32}else if(FS.isDir(node.mode)){if(FS.flagsToPermissionString(flags)!=="r"||flags&512){return 31}}return FS.nodePermissions(node,FS.flagsToPermissionString(flags))},MAX_OPEN_FDS:4096,nextfd(){for(var fd=0;fd<=FS.MAX_OPEN_FDS;fd++){if(!FS.streams[fd]){return fd}}throw new FS.ErrnoError(33)},getStreamChecked(fd){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}return stream},getStream:fd=>FS.streams[fd],createStream(stream,fd=-1){stream=Object.assign(new FS.FSStream,stream);if(fd==-1){fd=FS.nextfd()}stream.fd=fd;FS.streams[fd]=stream;return stream},closeStream(fd){FS.streams[fd]=null},dupStream(origStream,fd=-1){var stream=FS.createStream(origStream,fd);stream.stream_ops?.dup?.(stream);return stream},chrdev_stream_ops:{open(stream){var device=FS.getDevice(stream.node.rdev);stream.stream_ops=device.stream_ops;stream.stream_ops.open?.(stream)},llseek(){throw new FS.ErrnoError(70)}},major:dev=>dev>>8,minor:dev=>dev&255,makedev:(ma,mi)=>ma<<8|mi,registerDevice(dev,ops){FS.devices[dev]={stream_ops:ops}},getDevice:dev=>FS.devices[dev],getMounts(mount){var mounts=[];var check=[mount];while(check.length){var m=check.pop();mounts.push(m);check.push(...m.mounts)}return mounts},syncfs(populate,callback){if(typeof populate=="function"){callback=populate;populate=false}FS.syncFSRequests++;if(FS.syncFSRequests>1){err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`)}var mounts=FS.getMounts(FS.root.mount);var completed=0;function doCallback(errCode){FS.syncFSRequests--;return callback(errCode)}function done(errCode){if(errCode){if(!done.errored){done.errored=true;return doCallback(errCode)}return}if(++completed>=mounts.length){doCallback(null)}}mounts.forEach(mount=>{if(!mount.type.syncfs){return done(null)}mount.type.syncfs(mount,populate,done)})},mount(type,opts,mountpoint){var root=mountpoint==="/";var pseudo=!mountpoint;var node;if(root&&FS.root){throw new FS.ErrnoError(10)}else if(!root&&!pseudo){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});mountpoint=lookup.path;node=lookup.node;if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}if(!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}}var mount={type,opts,mountpoint,mounts:[]};var mountRoot=type.mount(mount);mountRoot.mount=mount;mount.root=mountRoot;if(root){FS.root=mountRoot}else if(node){node.mounted=mount;if(node.mount){node.mount.mounts.push(mount)}}return mountRoot},unmount(mountpoint){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});if(!FS.isMountpoint(lookup.node)){throw new FS.ErrnoError(28)}var node=lookup.node;var mount=node.mounted;var mounts=FS.getMounts(mount);Object.keys(FS.nameTable).forEach(hash=>{var current=FS.nameTable[hash];while(current){var next=current.name_next;if(mounts.includes(current.mount)){FS.destroyNode(current)}current=next}});node.mounted=null;var idx=node.mount.mounts.indexOf(mount);node.mount.mounts.splice(idx,1)},lookup(parent,name){return parent.node_ops.lookup(parent,name)},mknod(path,mode,dev){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);if(!name||name==="."||name===".."){throw new FS.ErrnoError(28)}var errCode=FS.mayCreate(parent,name);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.mknod){throw new FS.ErrnoError(63)}return parent.node_ops.mknod(parent,name,mode,dev)},statfs(path){var rtn={bsize:4096,frsize:4096,blocks:1e6,bfree:5e5,bavail:5e5,files:FS.nextInode,ffree:FS.nextInode-1,fsid:42,flags:2,namelen:255};var parent=FS.lookupPath(path,{follow:true}).node;if(parent?.node_ops.statfs){Object.assign(rtn,parent.node_ops.statfs(parent.mount.opts.root))}return rtn},create(path,mode=438){mode&=4095;mode|=32768;return FS.mknod(path,mode,0)},mkdir(path,mode=511){mode&=511|512;mode|=16384;return FS.mknod(path,mode,0)},mkdirTree(path,mode){var dirs=path.split("/");var d="";for(var i=0;i<dirs.length;++i){if(!dirs[i])continue;d+="/"+dirs[i];try{FS.mkdir(d,mode)}catch(e){if(e.errno!=20)throw e}}},mkdev(path,mode,dev){if(typeof dev=="undefined"){dev=mode;mode=438}mode|=8192;return FS.mknod(path,mode,dev)},symlink(oldpath,newpath){if(!PATH_FS.resolve(oldpath)){throw new FS.ErrnoError(44)}var lookup=FS.lookupPath(newpath,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var newname=PATH.basename(newpath);var errCode=FS.mayCreate(parent,newname);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.symlink){throw new FS.ErrnoError(63)}return parent.node_ops.symlink(parent,newname,oldpath)},rename(old_path,new_path){var old_dirname=PATH.dirname(old_path);var new_dirname=PATH.dirname(new_path);var old_name=PATH.basename(old_path);var new_name=PATH.basename(new_path);var lookup,old_dir,new_dir;lookup=FS.lookupPath(old_path,{parent:true});old_dir=lookup.node;lookup=FS.lookupPath(new_path,{parent:true});new_dir=lookup.node;if(!old_dir||!new_dir)throw new FS.ErrnoError(44);if(old_dir.mount!==new_dir.mount){throw new FS.ErrnoError(75)}var old_node=FS.lookupNode(old_dir,old_name);var relative=PATH_FS.relative(old_path,new_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(28)}relative=PATH_FS.relative(new_path,old_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(55)}var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(old_node===new_node){return}var isdir=FS.isDir(old_node.mode);var errCode=FS.mayDelete(old_dir,old_name,isdir);if(errCode){throw new FS.ErrnoError(errCode)}errCode=new_node?FS.mayDelete(new_dir,new_name,isdir):FS.mayCreate(new_dir,new_name);if(errCode){throw new FS.ErrnoError(errCode)}if(!old_dir.node_ops.rename){throw new FS.ErrnoError(63)}if(FS.isMountpoint(old_node)||new_node&&FS.isMountpoint(new_node)){throw new FS.ErrnoError(10)}if(new_dir!==old_dir){errCode=FS.nodePermissions(old_dir,"w");if(errCode){throw new FS.ErrnoError(errCode)}}FS.hashRemoveNode(old_node);try{old_dir.node_ops.rename(old_node,new_dir,new_name);old_node.parent=new_dir}catch(e){throw e}finally{FS.hashAddNode(old_node)}},rmdir(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,true);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.rmdir){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.rmdir(parent,name);FS.destroyNode(node)},readdir(path){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;if(!node.node_ops.readdir){throw new FS.ErrnoError(54)}return node.node_ops.readdir(node)},unlink(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,false);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.unlink){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.unlink(parent,name);FS.destroyNode(node)},readlink(path){var lookup=FS.lookupPath(path);var link=lookup.node;if(!link){throw new FS.ErrnoError(44)}if(!link.node_ops.readlink){throw new FS.ErrnoError(28)}return link.node_ops.readlink(link)},stat(path,dontFollow){var lookup=FS.lookupPath(path,{follow:!dontFollow});var node=lookup.node;if(!node){throw new FS.ErrnoError(44)}if(!node.node_ops.getattr){throw new FS.ErrnoError(63)}return node.node_ops.getattr(node)},lstat(path){return FS.stat(path,true)},chmod(path,mode,dontFollow){var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}node.node_ops.setattr(node,{mode:mode&4095|node.mode&~4095,ctime:Date.now()})},lchmod(path,mode){FS.chmod(path,mode,true)},fchmod(fd,mode){var stream=FS.getStreamChecked(fd);FS.chmod(stream.node,mode)},chown(path,uid,gid,dontFollow){var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}node.node_ops.setattr(node,{timestamp:Date.now()})},lchown(path,uid,gid){FS.chown(path,uid,gid,true)},fchown(fd,uid,gid){var stream=FS.getStreamChecked(fd);FS.chown(stream.node,uid,gid)},truncate(path,len){if(len<0){throw new FS.ErrnoError(28)}var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:true});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}if(FS.isDir(node.mode)){throw new FS.ErrnoError(31)}if(!FS.isFile(node.mode)){throw new FS.ErrnoError(28)}var errCode=FS.nodePermissions(node,"w");if(errCode){throw new FS.ErrnoError(errCode)}node.node_ops.setattr(node,{size:len,timestamp:Date.now()})},ftruncate(fd,len){var stream=FS.getStreamChecked(fd);if((stream.flags&2097155)===0){throw new FS.ErrnoError(28)}FS.truncate(stream.node,len)},utime(path,atime,mtime){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;node.node_ops.setattr(node,{atime,mtime})},open(path,flags,mode=438){if(path===""){throw new FS.ErrnoError(44)}flags=typeof flags=="string"?FS_modeStringToFlags(flags):flags;if(flags&64){mode=mode&4095|32768}else{mode=0}var node;if(typeof path=="object"){node=path}else{var lookup=FS.lookupPath(path,{follow:!(flags&131072),noent_okay:true});node=lookup.node;path=lookup.path}var created=false;if(flags&64){if(node){if(flags&128){throw new FS.ErrnoError(20)}}else{node=FS.mknod(path,mode,0);created=true}}if(!node){throw new FS.ErrnoError(44)}if(FS.isChrdev(node.mode)){flags&=~512}if(flags&65536&&!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}if(!created){var errCode=FS.mayOpen(node,flags);if(errCode){throw new FS.ErrnoError(errCode)}}if(flags&512&&!created){FS.truncate(node,0)}flags&=~(128|512|131072);var stream=FS.createStream({node,path:FS.getPath(node),flags,seekable:true,position:0,stream_ops:node.stream_ops,ungotten:[],error:false});if(stream.stream_ops.open){stream.stream_ops.open(stream)}if(Module["logReadFiles"]&&!(flags&1)){if(!(path in FS.readFiles)){FS.readFiles[path]=1}}return stream},close(stream){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(stream.getdents)stream.getdents=null;try{if(stream.stream_ops.close){stream.stream_ops.close(stream)}}catch(e){throw e}finally{FS.closeStream(stream.fd)}stream.fd=null},isClosed(stream){return stream.fd===null},llseek(stream,offset,whence){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(!stream.seekable||!stream.stream_ops.llseek){throw new FS.ErrnoError(70)}if(whence!=0&&whence!=1&&whence!=2){throw new FS.ErrnoError(28)}stream.position=stream.stream_ops.llseek(stream,offset,whence);stream.ungotten=[];return stream.position},read(stream,buffer,offset,length,position){if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.read){throw new FS.ErrnoError(28)}var seeking=typeof position!="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesRead=stream.stream_ops.read(stream,buffer,offset,length,position);if(!seeking)stream.position+=bytesRead;return bytesRead},write(stream,buffer,offset,length,position,canOwn){if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.write){throw new FS.ErrnoError(28)}if(stream.seekable&&stream.flags&1024){FS.llseek(stream,0,2)}var seeking=typeof position!="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesWritten=stream.stream_ops.write(stream,buffer,offset,length,position,canOwn);if(!seeking)stream.position+=bytesWritten;return bytesWritten},allocate(stream,offset,length){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(offset<0||length<=0){throw new FS.ErrnoError(28)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(!FS.isFile(stream.node.mode)&&!FS.isDir(stream.node.mode)){throw new FS.ErrnoError(43)}if(!stream.stream_ops.allocate){throw new FS.ErrnoError(138)}stream.stream_ops.allocate(stream,offset,length)},mmap(stream,length,position,prot,flags){if((prot&2)!==0&&(flags&2)===0&&(stream.flags&2097155)!==2){throw new FS.ErrnoError(2)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(2)}if(!stream.stream_ops.mmap){throw new FS.ErrnoError(43)}if(!length){throw new FS.ErrnoError(28)}return stream.stream_ops.mmap(stream,length,position,prot,flags)},msync(stream,buffer,offset,length,mmapFlags){if(!stream.stream_ops.msync){return 0}return stream.stream_ops.msync(stream,buffer,offset,length,mmapFlags)},ioctl(stream,cmd,arg){if(!stream.stream_ops.ioctl){throw new FS.ErrnoError(59)}return stream.stream_ops.ioctl(stream,cmd,arg)},readFile(path,opts={}){opts.flags=opts.flags||0;opts.encoding=opts.encoding||"binary";if(opts.encoding!=="utf8"&&opts.encoding!=="binary"){throw new Error(`Invalid encoding type "${opts.encoding}"`)}var ret;var stream=FS.open(path,opts.flags);var stat=FS.stat(path);var length=stat.size;var buf=new Uint8Array(length);FS.read(stream,buf,0,length,0);if(opts.encoding==="utf8"){ret=UTF8ArrayToString(buf)}else if(opts.encoding==="binary"){ret=buf}FS.close(stream);return ret},writeFile(path,data,opts={}){opts.flags=opts.flags||577;var stream=FS.open(path,opts.flags,opts.mode);if(typeof data=="string"){var buf=new Uint8Array(lengthBytesUTF8(data)+1);var actualNumBytes=stringToUTF8Array(data,buf,0,buf.length);FS.write(stream,buf,0,actualNumBytes,undefined,opts.canOwn)}else if(ArrayBuffer.isView(data)){FS.write(stream,data,0,data.byteLength,undefined,opts.canOwn)}else{throw new Error("Unsupported data type")}FS.close(stream)},cwd:()=>FS.currentPath,chdir(path){var lookup=FS.lookupPath(path,{follow:true});if(lookup.node===null){throw new FS.ErrnoError(44)}if(!FS.isDir(lookup.node.mode)){throw new FS.ErrnoError(54)}var errCode=FS.nodePermissions(lookup.node,"x");if(errCode){throw new FS.ErrnoError(errCode)}FS.currentPath=lookup.path},createDefaultDirectories(){FS.mkdir("/tmp");FS.mkdir("/home");FS.mkdir("/home/web_user")},createDefaultDevices(){FS.mkdir("/dev");FS.registerDevice(FS.makedev(1,3),{read:()=>0,write:(stream,buffer,offset,length,pos)=>length,llseek:()=>0});FS.mkdev("/dev/null",FS.makedev(1,3));TTY.register(FS.makedev(5,0),TTY.default_tty_ops);TTY.register(FS.makedev(6,0),TTY.default_tty1_ops);FS.mkdev("/dev/tty",FS.makedev(5,0));FS.mkdev("/dev/tty1",FS.makedev(6,0));var randomBuffer=new Uint8Array(1024),randomLeft=0;var randomByte=()=>{if(randomLeft===0){randomLeft=randomFill(randomBuffer).byteLength}return randomBuffer[--randomLeft]};FS.createDevice("/dev","random",randomByte);FS.createDevice("/dev","urandom",randomByte);FS.mkdir("/dev/shm");FS.mkdir("/dev/shm/tmp")},createSpecialDirectories(){FS.mkdir("/proc");var proc_self=FS.mkdir("/proc/self");FS.mkdir("/proc/self/fd");FS.mount({mount(){var node=FS.createNode(proc_self,"fd",16895,73);node.stream_ops={llseek:MEMFS.stream_ops.llseek};node.node_ops={lookup(parent,name){var fd=+name;var stream=FS.getStreamChecked(fd);var ret={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>stream.path},id:fd+1};ret.parent=ret;return ret},readdir(){return Array.from(FS.streams.entries()).filter(([k,v])=>v).map(([k,v])=>k.toString())}};return node}},{},"/proc/self/fd")},createStandardStreams(input,output,error){if(input){FS.createDevice("/dev","stdin",input)}else{FS.symlink("/dev/tty","/dev/stdin")}if(output){FS.createDevice("/dev","stdout",null,output)}else{FS.symlink("/dev/tty","/dev/stdout")}if(error){FS.createDevice("/dev","stderr",null,error)}else{FS.symlink("/dev/tty1","/dev/stderr")}var stdin=FS.open("/dev/stdin",0);var stdout=FS.open("/dev/stdout",1);var stderr=FS.open("/dev/stderr",1)},staticInit(){FS.nameTable=new Array(4096);FS.mount(MEMFS,{},"/");FS.createDefaultDirectories();FS.createDefaultDevices();FS.createSpecialDirectories();FS.filesystems={MEMFS,NODEFS}},init(input,output,error){FS.initialized=true;input??=Module["stdin"];output??=Module["stdout"];error??=Module["stderr"];FS.createStandardStreams(input,output,error)},quit(){FS.initialized=false;for(var i=0;i<FS.streams.length;i++){var stream=FS.streams[i];if(!stream){continue}FS.close(stream)}},findObject(path,dontResolveLastLink){var ret=FS.analyzePath(path,dontResolveLastLink);if(!ret.exists){return null}return ret.object},analyzePath(path,dontResolveLastLink){try{var lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});path=lookup.path}catch(e){}var ret={isRoot:false,exists:false,error:0,name:null,path:null,object:null,parentExists:false,parentPath:null,parentObject:null};try{var lookup=FS.lookupPath(path,{parent:true});ret.parentExists=true;ret.parentPath=lookup.path;ret.parentObject=lookup.node;ret.name=PATH.basename(path);lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});ret.exists=true;ret.path=lookup.path;ret.object=lookup.node;ret.name=lookup.node.name;ret.isRoot=lookup.path==="/"}catch(e){ret.error=e.errno}return ret},createPath(parent,path,canRead,canWrite){parent=typeof parent=="string"?parent:FS.getPath(parent);var parts=path.split("/").reverse();while(parts.length){var part=parts.pop();if(!part)continue;var current=PATH.join2(parent,part);try{FS.mkdir(current)}catch(e){}parent=current}return current},createFile(parent,name,properties,canRead,canWrite){var path=PATH.join2(typeof parent=="string"?parent:FS.getPath(parent),name);var mode=FS_getMode(canRead,canWrite);return FS.create(path,mode)},createDataFile(parent,name,data,canRead,canWrite,canOwn){var path=name;if(parent){parent=typeof parent=="string"?parent:FS.getPath(parent);path=name?PATH.join2(parent,name):parent}var mode=FS_getMode(canRead,canWrite);var node=FS.create(path,mode);if(data){if(typeof data=="string"){var arr=new Array(data.length);for(var i=0,len=data.length;i<len;++i)arr[i]=data.charCodeAt(i);data=arr}FS.chmod(node,mode|146);var stream=FS.open(node,577);FS.write(stream,data,0,data.length,0,canOwn);FS.close(stream);FS.chmod(node,mode)}},createDevice(parent,name,input,output){var path=PATH.join2(typeof parent=="string"?parent:FS.getPath(parent),name);var mode=FS_getMode(!!input,!!output);FS.createDevice.major??=64;var dev=FS.makedev(FS.createDevice.major++,0);FS.registerDevice(dev,{open(stream){stream.seekable=false},close(stream){if(output?.buffer?.length){output(10)}},read(stream,buffer,offset,length,pos){var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=input()}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.atime=Date.now()}return bytesRead},write(stream,buffer,offset,length,pos){for(var i=0;i<length;i++){try{output(buffer[offset+i])}catch(e){throw new FS.ErrnoError(29)}}if(length){stream.node.mtime=stream.node.ctime=Date.now()}return i}});return FS.mkdev(path,mode,dev)},forceLoadFile(obj){if(obj.isDevice||obj.isFolder||obj.link||obj.contents)return true;if(typeof XMLHttpRequest!="undefined"){throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")}else{try{obj.contents=readBinary(obj.url);obj.usedBytes=obj.contents.length}catch(e){throw new FS.ErrnoError(29)}}},createLazyFile(parent,name,url,canRead,canWrite){class LazyUint8Array{lengthKnown=false;chunks=[];get(idx){if(idx>this.length-1||idx<0){return undefined}var chunkOffset=idx%this.chunkSize;var chunkNum=idx/this.chunkSize|0;return this.getter(chunkNum)[chunkOffset]}setDataGetter(getter){this.getter=getter}cacheLength(){var xhr=new XMLHttpRequest;xhr.open("HEAD",url,false);xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);var datalength=Number(xhr.getResponseHeader("Content-length"));var header;var hasByteServing=(header=xhr.getResponseHeader("Accept-Ranges"))&&header==="bytes";var usesGzip=(header=xhr.getResponseHeader("Content-Encoding"))&&header==="gzip";var chunkSize=1024*1024;if(!hasByteServing)chunkSize=datalength;var doXHR=(from,to)=>{if(from>to)throw new Error("invalid range ("+from+", "+to+") or no bytes requested!");if(to>datalength-1)throw new Error("only "+datalength+" bytes available! programmer error!");var xhr=new XMLHttpRequest;xhr.open("GET",url,false);if(datalength!==chunkSize)xhr.setRequestHeader("Range","bytes="+from+"-"+to);xhr.responseType="arraybuffer";if(xhr.overrideMimeType){xhr.overrideMimeType("text/plain; charset=x-user-defined")}xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);if(xhr.response!==undefined){return new Uint8Array(xhr.response||[])}return intArrayFromString(xhr.responseText||"",true)};var lazyArray=this;lazyArray.setDataGetter(chunkNum=>{var start=chunkNum*chunkSize;var end=(chunkNum+1)*chunkSize-1;end=Math.min(end,datalength-1);if(typeof lazyArray.chunks[chunkNum]=="undefined"){lazyArray.chunks[chunkNum]=doXHR(start,end)}if(typeof lazyArray.chunks[chunkNum]=="undefined")throw new Error("doXHR failed!");return lazyArray.chunks[chunkNum]});if(usesGzip||!datalength){chunkSize=datalength=1;datalength=this.getter(0).length;chunkSize=datalength;out("LazyFiles on gzip forces download of the whole file when length is accessed")}this._length=datalength;this._chunkSize=chunkSize;this.lengthKnown=true}get length(){if(!this.lengthKnown){this.cacheLength()}return this._length}get chunkSize(){if(!this.lengthKnown){this.cacheLength()}return this._chunkSize}}if(typeof XMLHttpRequest!="undefined"){if(!ENVIRONMENT_IS_WORKER)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var lazyArray=new LazyUint8Array;var properties={isDevice:false,contents:lazyArray}}else{var properties={isDevice:false,url}}var node=FS.createFile(parent,name,properties,canRead,canWrite);if(properties.contents){node.contents=properties.contents}else if(properties.url){node.contents=null;node.url=properties.url}Object.defineProperties(node,{usedBytes:{get:function(){return this.contents.length}}});var stream_ops={};var keys=Object.keys(node.stream_ops);keys.forEach(key=>{var fn=node.stream_ops[key];stream_ops[key]=(...args)=>{FS.forceLoadFile(node);return fn(...args)}});function writeChunks(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=contents.length)return 0;var size=Math.min(contents.length-position,length);if(contents.slice){for(var i=0;i<size;i++){buffer[offset+i]=contents[position+i]}}else{for(var i=0;i<size;i++){buffer[offset+i]=contents.get(position+i)}}return size}stream_ops.read=(stream,buffer,offset,length,position)=>{FS.forceLoadFile(node);return writeChunks(stream,buffer,offset,length,position)};stream_ops.mmap=(stream,length,position,prot,flags)=>{FS.forceLoadFile(node);var ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}writeChunks(stream,HEAP8,ptr,length,position);return{ptr,allocated:true}};node.stream_ops=stream_ops;return node}};var UTF8ToString=(ptr,maxBytesToRead)=>{ptr>>>=0;return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""};var SYSCALLS={DEFAULT_POLLMASK:5,calculateAt(dirfd,path,allowEmpty){if(PATH.isAbs(path)){return path}var dir;if(dirfd===-100){dir=FS.cwd()}else{var dirstream=SYSCALLS.getStreamFromFD(dirfd);dir=dirstream.path}if(path.length==0){if(!allowEmpty){throw new FS.ErrnoError(44)}return dir}return dir+"/"+path},doStat(func,path,buf){var stat=func(path);HEAP32[buf>>>2>>>0]=stat.dev;HEAP32[buf+4>>>2>>>0]=stat.mode;HEAPU32[buf+8>>>2>>>0]=stat.nlink;HEAP32[buf+12>>>2>>>0]=stat.uid;HEAP32[buf+16>>>2>>>0]=stat.gid;HEAP32[buf+20>>>2>>>0]=stat.rdev;tempI64=[stat.size>>>0,(tempDouble=stat.size,+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+24>>>2>>>0]=tempI64[0],HEAP32[buf+28>>>2>>>0]=tempI64[1];HEAP32[buf+32>>>2>>>0]=4096;HEAP32[buf+36>>>2>>>0]=stat.blocks;var atime=stat.atime.getTime();var mtime=stat.mtime.getTime();var ctime=stat.ctime.getTime();tempI64=[Math.floor(atime/1e3)>>>0,(tempDouble=Math.floor(atime/1e3),+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+40>>>2>>>0]=tempI64[0],HEAP32[buf+44>>>2>>>0]=tempI64[1];HEAPU32[buf+48>>>2>>>0]=atime%1e3*1e3*1e3;tempI64=[Math.floor(mtime/1e3)>>>0,(tempDouble=Math.floor(mtime/1e3),+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+56>>>2>>>0]=tempI64[0],HEAP32[buf+60>>>2>>>0]=tempI64[1];HEAPU32[buf+64>>>2>>>0]=mtime%1e3*1e3*1e3;tempI64=[Math.floor(ctime/1e3)>>>0,(tempDouble=Math.floor(ctime/1e3),+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+72>>>2>>>0]=tempI64[0],HEAP32[buf+76>>>2>>>0]=tempI64[1];HEAPU32[buf+80>>>2>>>0]=ctime%1e3*1e3*1e3;tempI64=[stat.ino>>>0,(tempDouble=stat.ino,+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+88>>>2>>>0]=tempI64[0],HEAP32[buf+92>>>2>>>0]=tempI64[1];return 0},doMsync(addr,stream,len,flags,offset){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}if(flags&2){return 0}var buffer=HEAPU8.slice(addr,addr+len);FS.msync(stream,buffer,offset,len,flags)},getStreamFromFD(fd){var stream=FS.getStreamChecked(fd);return stream},varargs:undefined,getStr(ptr){var ret=UTF8ToString(ptr);return ret}};function ___syscall_faccessat(dirfd,path,amode,flags){path>>>=0;try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);if(amode&~7){return-28}var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;if(!node){return-44}var perms="";if(amode&4)perms+="r";if(amode&2)perms+="w";if(amode&1)perms+="x";if(perms&&FS.nodePermissions(node,perms)){return-2}return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}var syscallGetVarargI=()=>{var ret=HEAP32[+SYSCALLS.varargs>>>2>>>0];SYSCALLS.varargs+=4;return ret};var syscallGetVarargP=syscallGetVarargI;function ___syscall_fcntl64(fd,cmd,varargs){varargs>>>=0;SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(cmd){case 0:{var arg=syscallGetVarargI();if(arg<0){return-28}while(FS.streams[arg]){arg++}var newStream;newStream=FS.dupStream(stream,arg);return newStream.fd}case 1:case 2:return 0;case 3:return stream.flags;case 4:{var arg=syscallGetVarargI();stream.flags|=arg;return 0}case 12:{var arg=syscallGetVarargP();var offset=0;HEAP16[arg+offset>>>1>>>0]=2;return 0}case 13:case 14:return 0}return-28}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}var stringToUTF8=(str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite);function ___syscall_getcwd(buf,size){buf>>>=0;size>>>=0;try{if(size===0)return-28;var cwd=FS.cwd();var cwdLengthInBytes=lengthBytesUTF8(cwd)+1;if(size<cwdLengthInBytes)return-68;stringToUTF8(cwd,buf,size);return cwdLengthInBytes}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_ioctl(fd,op,varargs){varargs>>>=0;SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(op){case 21509:{if(!stream.tty)return-59;return 0}case 21505:{if(!stream.tty)return-59;if(stream.tty.ops.ioctl_tcgets){var termios=stream.tty.ops.ioctl_tcgets(stream);var argp=syscallGetVarargP();HEAP32[argp>>>2>>>0]=termios.c_iflag||0;HEAP32[argp+4>>>2>>>0]=termios.c_oflag||0;HEAP32[argp+8>>>2>>>0]=termios.c_cflag||0;HEAP32[argp+12>>>2>>>0]=termios.c_lflag||0;for(var i=0;i<32;i++){HEAP8[argp+i+17>>>0]=termios.c_cc[i]||0}return 0}return 0}case 21510:case 21511:case 21512:{if(!stream.tty)return-59;return 0}case 21506:case 21507:case 21508:{if(!stream.tty)return-59;if(stream.tty.ops.ioctl_tcsets){var argp=syscallGetVarargP();var c_iflag=HEAP32[argp>>>2>>>0];var c_oflag=HEAP32[argp+4>>>2>>>0];var c_cflag=HEAP32[argp+8>>>2>>>0];var c_lflag=HEAP32[argp+12>>>2>>>0];var c_cc=[];for(var i=0;i<32;i++){c_cc.push(HEAP8[argp+i+17>>>0])}return stream.tty.ops.ioctl_tcsets(stream.tty,op,{c_iflag,c_oflag,c_cflag,c_lflag,c_cc})}return 0}case 21519:{if(!stream.tty)return-59;var argp=syscallGetVarargP();HEAP32[argp>>>2>>>0]=0;return 0}case 21520:{if(!stream.tty)return-59;return-28}case 21531:{var argp=syscallGetVarargP();return FS.ioctl(stream,op,argp)}case 21523:{if(!stream.tty)return-59;if(stream.tty.ops.ioctl_tiocgwinsz){var winsize=stream.tty.ops.ioctl_tiocgwinsz(stream.tty);var argp=syscallGetVarargP();HEAP16[argp>>>1>>>0]=winsize[0];HEAP16[argp+2>>>1>>>0]=winsize[1]}return 0}case 21524:{if(!stream.tty)return-59;return 0}case 21515:{if(!stream.tty)return-59;return 0}default:return-28}}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_lstat64(path,buf){path>>>=0;buf>>>=0;try{path=SYSCALLS.getStr(path);return SYSCALLS.doStat(FS.lstat,path,buf)}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_mkdirat(dirfd,path,mode){path>>>=0;try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);FS.mkdir(path,mode,0);return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_newfstatat(dirfd,path,buf,flags){path>>>=0;buf>>>=0;try{path=SYSCALLS.getStr(path);var nofollow=flags&256;var allowEmpty=flags&4096;flags=flags&~6400;path=SYSCALLS.calculateAt(dirfd,path,allowEmpty);return SYSCALLS.doStat(nofollow?FS.lstat:FS.stat,path,buf)}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_openat(dirfd,path,flags,varargs){path>>>=0;varargs>>>=0;SYSCALLS.varargs=varargs;try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);var mode=varargs?syscallGetVarargI():0;return FS.open(path,flags,mode).fd}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_readlinkat(dirfd,path,buf,bufsize){path>>>=0;buf>>>=0;bufsize>>>=0;try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);if(bufsize<=0)return-28;var ret=FS.readlink(path);var len=Math.min(bufsize,lengthBytesUTF8(ret));var endChar=HEAP8[buf+len>>>0];stringToUTF8(ret,buf,bufsize+1);HEAP8[buf+len>>>0]=endChar;return len}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_stat64(path,buf){path>>>=0;buf>>>=0;try{path=SYSCALLS.getStr(path);return SYSCALLS.doStat(FS.stat,path,buf)}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_unlinkat(dirfd,path,flags){path>>>=0;try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);if(flags===0){FS.unlink(path)}else if(flags===512){FS.rmdir(path)}else{abort("Invalid flags passed to unlinkat")}return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}var readI53FromI64=ptr=>HEAPU32[ptr>>>2>>>0]+HEAP32[ptr+4>>>2>>>0]*4294967296;function ___syscall_utimensat(dirfd,path,times,flags){path>>>=0;times>>>=0;try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path,true);var now=Date.now(),atime,mtime;if(!times){atime=now;mtime=now}else{var seconds=readI53FromI64(times);var nanoseconds=HEAP32[times+8>>>2>>>0];if(nanoseconds==1073741823){atime=now}else if(nanoseconds==1073741822){atime=null}else{atime=seconds*1e3+nanoseconds/(1e3*1e3)}times+=16;seconds=readI53FromI64(times);nanoseconds=HEAP32[times+8>>>2>>>0];if(nanoseconds==1073741823){mtime=now}else if(nanoseconds==1073741822){mtime=null}else{mtime=seconds*1e3+nanoseconds/(1e3*1e3)}}if((mtime??atime)!==null){FS.utime(path,atime,mtime)}return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}var __abort_js=()=>abort("");function __emscripten_memcpy_js(dest,src,num){dest>>>=0;src>>>=0;num>>>=0;return HEAPU8.copyWithin(dest>>>0,src>>>0,src+num>>>0)}var runtimeKeepaliveCounter=0;var __emscripten_runtime_keepalive_clear=()=>{noExitRuntime=false;runtimeKeepaliveCounter=0};var timers={};var handleException=e=>{if(e instanceof ExitStatus||e=="unwind"){return EXITSTATUS}quit_(1,e)};var keepRuntimeAlive=()=>noExitRuntime||runtimeKeepaliveCounter>0;var _proc_exit=code=>{EXITSTATUS=code;if(!keepRuntimeAlive()){Module["onExit"]?.(code);ABORT=true}quit_(code,new ExitStatus(code))};var exitJS=(status,implicit)=>{EXITSTATUS=status;_proc_exit(status)};var _exit=exitJS;var maybeExit=()=>{if(!keepRuntimeAlive()){try{_exit(EXITSTATUS)}catch(e){handleException(e)}}};var callUserCallback=func=>{if(ABORT){return}try{func();maybeExit()}catch(e){handleException(e)}};var _emscripten_get_now=()=>performance.now();var __setitimer_js=(which,timeout_ms)=>{if(timers[which]){clearTimeout(timers[which].id);delete timers[which]}if(!timeout_ms)return 0;var id=setTimeout(()=>{delete timers[which];callUserCallback(()=>__emscripten_timeout(which,_emscripten_get_now()))},timeout_ms);timers[which]={id,timeout_ms};return 0};var __tzset_js=function(timezone,daylight,std_name,dst_name){timezone>>>=0;daylight>>>=0;std_name>>>=0;dst_name>>>=0;var currentYear=(new Date).getFullYear();var winter=new Date(currentYear,0,1);var summer=new Date(currentYear,6,1);var winterOffset=winter.getTimezoneOffset();var summerOffset=summer.getTimezoneOffset();var stdTimezoneOffset=Math.max(winterOffset,summerOffset);HEAPU32[timezone>>>2>>>0]=stdTimezoneOffset*60;HEAP32[daylight>>>2>>>0]=Number(winterOffset!=summerOffset);var extractZone=timezoneOffset=>{var sign=timezoneOffset>=0?"-":"+";var absOffset=Math.abs(timezoneOffset);var hours=String(Math.floor(absOffset/60)).padStart(2,"0");var minutes=String(absOffset%60).padStart(2,"0");return`UTC${sign}${hours}${minutes}`};var winterName=extractZone(winterOffset);var summerName=extractZone(summerOffset);if(summerOffset<winterOffset){stringToUTF8(winterName,std_name,17);stringToUTF8(summerName,dst_name,17)}else{stringToUTF8(winterName,dst_name,17);stringToUTF8(summerName,std_name,17)}};var getHeapMax=()=>4294901760;var growMemory=size=>{var b=wasmMemory.buffer;var pages=(size-b.byteLength+65535)/65536|0;try{wasmMemory.grow(pages);updateMemoryViews();return 1}catch(e){}};function _emscripten_resize_heap(requestedSize){requestedSize>>>=0;var oldSize=HEAPU8.length;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignMemory(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=growMemory(newSize);if(replacement){return true}}return false}var ENV={};var getExecutableName=()=>thisProgram||"./this.program";var getEnvStrings=()=>{if(!getEnvStrings.strings){var lang=(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8";var env={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:lang,_:getExecutableName()};for(var x in ENV){if(ENV[x]===undefined)delete env[x];else env[x]=ENV[x]}var strings=[];for(var x in env){strings.push(`${x}=${env[x]}`)}getEnvStrings.strings=strings}return getEnvStrings.strings};var stringToAscii=(str,buffer)=>{for(var i=0;i<str.length;++i){HEAP8[buffer++>>>0]=str.charCodeAt(i)}HEAP8[buffer>>>0]=0};var _environ_get=function(__environ,environ_buf){__environ>>>=0;environ_buf>>>=0;var bufSize=0;getEnvStrings().forEach((string,i)=>{var ptr=environ_buf+bufSize;HEAPU32[__environ+i*4>>>2>>>0]=ptr;stringToAscii(string,ptr);bufSize+=string.length+1});return 0};var _environ_sizes_get=function(penviron_count,penviron_buf_size){penviron_count>>>=0;penviron_buf_size>>>=0;var strings=getEnvStrings();HEAPU32[penviron_count>>>2>>>0]=strings.length;var bufSize=0;strings.forEach(string=>bufSize+=string.length+1);HEAPU32[penviron_buf_size>>>2>>>0]=bufSize;return 0};function _fd_close(fd){try{var stream=SYSCALLS.getStreamFromFD(fd);FS.close(stream);return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var doReadv=(stream,iov,iovcnt,offset)=>{var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>>2>>>0];var len=HEAPU32[iov+4>>>2>>>0];iov+=8;var curr=FS.read(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len)break;if(typeof offset!="undefined"){offset+=curr}}return ret};function _fd_read(fd,iov,iovcnt,pnum){iov>>>=0;iovcnt>>>=0;pnum>>>=0;try{var stream=SYSCALLS.getStreamFromFD(fd);var num=doReadv(stream,iov,iovcnt);HEAPU32[pnum>>>2>>>0]=num;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}function _fd_seek(fd,offset_low,offset_high,whence,newOffset){var offset=convertI32PairToI53Checked(offset_low,offset_high);newOffset>>>=0;try{if(isNaN(offset))return 61;var stream=SYSCALLS.getStreamFromFD(fd);FS.llseek(stream,offset,whence);tempI64=[stream.position>>>0,(tempDouble=stream.position,+Math.abs(tempDouble)>=1?tempDouble>0?+Math.floor(tempDouble/4294967296)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[newOffset>>>2>>>0]=tempI64[0],HEAP32[newOffset+4>>>2>>>0]=tempI64[1];if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var doWritev=(stream,iov,iovcnt,offset)=>{var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>>2>>>0];var len=HEAPU32[iov+4>>>2>>>0];iov+=8;var curr=FS.write(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len){break}if(typeof offset!="undefined"){offset+=curr}}return ret};function _fd_write(fd,iov,iovcnt,pnum){iov>>>=0;iovcnt>>>=0;pnum>>>=0;try{var stream=SYSCALLS.getStreamFromFD(fd);var num=doWritev(stream,iov,iovcnt);HEAPU32[pnum>>>2>>>0]=num;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var stackAlloc=sz=>__emscripten_stack_alloc(sz);var stringToUTF8OnStack=str=>{var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8(str,ret,size);return ret};var getCFunc=ident=>{var func=Module["_"+ident];return func};var writeArrayToMemory=(array,buffer)=>{HEAP8.set(array,buffer>>>0)};var ccall=(ident,returnType,argTypes,args,opts)=>{var toC={string:str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){ret=stringToUTF8OnStack(str)}return ret},array:arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func(...cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret};var cwrap=(ident,returnType,argTypes,opts)=>{var numericArgs=!argTypes||argTypes.every(type=>type==="number"||type==="boolean");var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return(...args)=>ccall(ident,returnType,argTypes,args,opts)};var FS_createPath=FS.createPath;var FS_unlink=path=>FS.unlink(path);var FS_createLazyFile=FS.createLazyFile;var FS_createDevice=FS.createDevice;FS.createPreloadedFile=FS_createPreloadedFile;FS.staticInit();Module["FS_createPath"]=FS.createPath;Module["FS_createDataFile"]=FS.createDataFile;Module["FS_createPreloadedFile"]=FS.createPreloadedFile;Module["FS_unlink"]=FS.unlink;Module["FS_createLazyFile"]=FS.createLazyFile;Module["FS_createDevice"]=FS.createDevice;MEMFS.doesNotExistError=new FS.ErrnoError(44);MEMFS.doesNotExistError.stack="<generic error, no stack>";if(ENVIRONMENT_IS_NODE){NODEFS.staticInit()}var wasmImports={a:___cxa_throw,i:___syscall_faccessat,c:___syscall_fcntl64,z:___syscall_getcwd,g:___syscall_ioctl,v:___syscall_lstat64,t:___syscall_mkdirat,u:___syscall_newfstatat,h:___syscall_openat,r:___syscall_readlinkat,w:___syscall_stat64,p:___syscall_unlinkat,o:___syscall_utimensat,q:__abort_js,A:__emscripten_memcpy_js,l:__emscripten_runtime_keepalive_clear,m:__setitimer_js,s:__tzset_js,n:_emscripten_resize_heap,x:_environ_get,y:_environ_sizes_get,b:_exit,d:_fd_close,f:_fd_read,j:_fd_seek,e:_fd_write,k:_proc_exit};var wasmExports;createWasm();var ___wasm_call_ctors=()=>(___wasm_call_ctors=wasmExports["C"])();var _main=Module["_main"]=(a0,a1)=>(_main=Module["_main"]=wasmExports["D"])(a0,a1);var _itk_wasm_input_array_alloc=Module["_itk_wasm_input_array_alloc"]=(a0,a1,a2,a3)=>(_itk_wasm_input_array_alloc=Module["_itk_wasm_input_array_alloc"]=wasmExports["E"])(a0,a1,a2,a3);var _itk_wasm_input_json_alloc=Module["_itk_wasm_input_json_alloc"]=(a0,a1,a2)=>(_itk_wasm_input_json_alloc=Module["_itk_wasm_input_json_alloc"]=wasmExports["F"])(a0,a1,a2);var _itk_wasm_output_json_address=Module["_itk_wasm_output_json_address"]=(a0,a1)=>(_itk_wasm_output_json_address=Module["_itk_wasm_output_json_address"]=wasmExports["G"])(a0,a1);var _itk_wasm_output_json_size=Module["_itk_wasm_output_json_size"]=(a0,a1)=>(_itk_wasm_output_json_size=Module["_itk_wasm_output_json_size"]=wasmExports["H"])(a0,a1);var _itk_wasm_output_array_address=Module["_itk_wasm_output_array_address"]=(a0,a1,a2)=>(_itk_wasm_output_array_address=Module["_itk_wasm_output_array_address"]=wasmExports["I"])(a0,a1,a2);var _itk_wasm_output_array_size=Module["_itk_wasm_output_array_size"]=(a0,a1,a2)=>(_itk_wasm_output_array_size=Module["_itk_wasm_output_array_size"]=wasmExports["J"])(a0,a1,a2);var _itk_wasm_free_all=Module["_itk_wasm_free_all"]=()=>(_itk_wasm_free_all=Module["_itk_wasm_free_all"]=wasmExports["K"])();var __emscripten_timeout=(a0,a1)=>(__emscripten_timeout=wasmExports["M"])(a0,a1);var __emscripten_stack_restore=a0=>(__emscripten_stack_restore=wasmExports["N"])(a0);var __emscripten_stack_alloc=a0=>(__emscripten_stack_alloc=wasmExports["O"])(a0);var _emscripten_stack_get_current=()=>(_emscripten_stack_get_current=wasmExports["P"])();function applySignatureConversions(wasmExports){wasmExports=Object.assign({},wasmExports);var makeWrapper_pp=f=>a0=>f(a0)>>>0;var makeWrapper_p=f=>()=>f()>>>0;wasmExports["O"]=makeWrapper_pp(wasmExports["O"]);wasmExports["P"]=makeWrapper_p(wasmExports["P"]);return wasmExports}Module["addRunDependency"]=addRunDependency;Module["removeRunDependency"]=removeRunDependency;Module["callMain"]=callMain;Module["stackSave"]=stackSave;Module["stackRestore"]=stackRestore;Module["ccall"]=ccall;Module["cwrap"]=cwrap;Module["UTF8ToString"]=UTF8ToString;Module["stringToUTF8"]=stringToUTF8;Module["lengthBytesUTF8"]=lengthBytesUTF8;Module["writeArrayToMemory"]=writeArrayToMemory;Module["FS_createPreloadedFile"]=FS_createPreloadedFile;Module["FS_unlink"]=FS_unlink;Module["FS_createPath"]=FS_createPath;Module["FS_createDevice"]=FS_createDevice;Module["FS_createDataFile"]=FS_createDataFile;Module["FS_createLazyFile"]=FS_createLazyFile;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function callMain(args=[]){var entryFunction=_main;args.unshift(thisProgram);var argc=args.length;var argv=stackAlloc((argc+1)*4);var argv_ptr=argv;args.forEach(arg=>{HEAPU32[argv_ptr>>>2>>>0]=stringToUTF8OnStack(arg);argv_ptr+=4});HEAPU32[argv_ptr>>>2>>>0]=0;try{var ret=entryFunction(argc,argv);exitJS(ret,true);return ret}catch(e){return handleException(e)}}function run(args=arguments_){if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();preMain();readyPromiseResolve(Module);Module["onRuntimeInitialized"]?.();if(shouldRunNow)callMain(args);postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(()=>{setTimeout(()=>Module["setStatus"](""),1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}var shouldRunNow=false;if(Module["noInitialRun"])shouldRunNow=false;run();Module.mountContainingDir=function(filePath){if(!ENVIRONMENT_IS_NODE){return}var path=require("path");var containingDir=path.dirname(filePath);if(containingDir==="/"){throw new Error("Cannot mount root directory")}var currentDir="/";var splitContainingDir=containingDir.split(path.sep);for(var ii=1;ii<splitContainingDir.length;ii++){currentDir+=splitContainingDir[ii];if(!FS.analyzePath(currentDir).exists){FS.mkdir(currentDir)}currentDir+="/"}FS.mount(NODEFS,{root:containingDir},currentDir);return currentDir+path.basename(filePath)};Module.unmountContainingDir=function(filePath){if(!ENVIRONMENT_IS_NODE){return}var path=require("path");var containingDir=path.dirname(filePath);FS.unmount(containingDir)};Module.mountDir=function(dir){if(!ENVIRONMENT_IS_NODE){return}if(dir==="/"){throw new Error("Cannot mount root directory")}var currentDir="/";var path=require("path");var splitDir=dir.split(path.sep);for(var ii=1;ii<splitDir.length;ii++){currentDir+=splitDir[ii];if(!FS.analyzePath(currentDir).exists){FS.mkdir(currentDir)}currentDir+="/"}FS.mount(NODEFS,{root:dir},currentDir);return currentDir};Module.unmountDir=function(dir){if(!ENVIRONMENT_IS_NODE){return}FS.unmount(dir)};Module.fs_mkdirs=function(dirs){var currentDir="/";var splitDirs=dirs.split("/");for(var ii=1;ii<splitDirs.length;++ii){currentDir+=splitDirs[ii];if(!FS.analyzePath(currentDir).exists){FS.mkdir(currentDir)}currentDir+="/"}};Module.fs_readFile=function(path,opts){return FS.readFile(path,opts)};Module.fs_writeFile=function(path,data,opts){return FS.writeFile(path,data,opts)};Module.fs_unlink=function(path){return FS.unlink(path)};Module.fs_open=function(path,flags,mode){return FS.open(path,flags,mode)};Module.fs_stat=function(path){return FS.stat(path)};Module.fs_read=function(stream,buffer,offset,length,position){return FS.read(stream,buffer,offset,length,position)};Module.fs_close=function(stream){return FS.close(stream)};Module.mountContainingDir=function(filePath){if(!ENVIRONMENT_IS_NODE){return}var path=require("path");var containingDir=path.dirname(filePath);if(containingDir==="/"){throw new Error("Cannot mount root directory")}var currentDir="/";var splitContainingDir=containingDir.split(path.sep);for(var ii=1;ii<splitContainingDir.length;ii++){currentDir+=splitContainingDir[ii];if(!FS.analyzePath(currentDir).exists){FS.mkdir(currentDir)}currentDir+="/"}FS.mount(NODEFS,{root:containingDir},currentDir);return currentDir+path.basename(filePath)};Module.unmountContainingDir=function(filePath){if(!ENVIRONMENT_IS_NODE){return}var path=require("path");var containingDir=path.dirname(filePath);FS.unmount(containingDir)};Module.mountDir=function(dir){if(!ENVIRONMENT_IS_NODE){return}if(dir==="/"){throw new Error("Cannot mount root directory")}var currentDir="/";var path=require("path");var splitDir=dir.split(path.sep);for(var ii=1;ii<splitDir.length;ii++){currentDir+=splitDir[ii];if(!FS.analyzePath(currentDir).exists){FS.mkdir(currentDir)}currentDir+="/"}FS.mount(NODEFS,{root:dir},currentDir);return currentDir};Module.unmountDir=function(dir){if(!ENVIRONMENT_IS_NODE){return}FS.unmount(dir)};Module.fs_mkdirs=function(dirs){var currentDir="/";var splitDirs=dirs.split("/");for(var ii=1;ii<splitDirs.length;++ii){currentDir+=splitDirs[ii];if(!FS.analyzePath(currentDir).exists){FS.mkdir(currentDir)}currentDir+="/"}};Module.fs_readFile=function(path,opts){return FS.readFile(path,opts)};Module.fs_writeFile=function(path,data,opts){return FS.writeFile(path,data,opts)};Module.fs_unlink=function(path){return FS.unlink(path)};Module.fs_open=function(path,flags,mode){return FS.open(path,flags,mode)};Module.fs_stat=function(path){return FS.stat(path)};Module.fs_read=function(stream,buffer,offset,length,position){return FS.read(stream,buffer,offset,length,position)};Module.fs_close=function(stream){return FS.close(stream)};moduleRtn=readyPromise;


  return moduleRtn;
}
);
})();
export default nrrdReadImage;

```

## File: `apps/web/README.md`

```markdown
# SoCal EBUS Prep Web

This folder contains the standalone web scaffold requested in `webapp_codex_instructions.md`.

## Source of truth

- UI shell and interaction style are adapted from the prototype.
- Structured content still comes from the repo root where available:
  - `content/stations/*`
  - `content/modules/*`
  - `content/course/course-info.json`
  - `content/cases/generated/case_001.enriched.json`
- Web-only lecture and media manifests live under `apps/web/src/content/`.

## Commands

Run from [`apps/web`](/home/rjm/projects/EBUS_course/apps/web):

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run test
```

### LLM / code-review digest (gitingest-style markdown)

From repo root:

```bash
npm run gitingest:web
```

Or from `apps/web`:

```bash
npm run gitingest
```

Writes `gitingest-webapp.md` (gitignored) with a directory tree plus inlined source and the repo-root JSON the app imports. Large files are omitted with a note unless you raise the limit, for example:

```bash
node scripts/generate-gitingest.mjs --max-bytes 2000000 --out ./my-digest.md
```

Use `--no-shared-content` to only bundle `apps/web`.

## Media folders

Static web media should be added under:

- `public/media/stations/<stationId>/`
- `public/media/knobology/`
- `public/media/lectures/<lectureId>/`
- `public/media/cases/case_001/`

The corresponding manifests are:

- [`src/content/station-media.json`](/home/rjm/projects/EBUS_course/apps/web/src/content/station-media.json)
- [`src/content/knobology-media.json`](/home/rjm/projects/EBUS_course/apps/web/src/content/knobology-media.json)
- [`src/content/lectures.json`](/home/rjm/projects/EBUS_course/apps/web/src/content/lectures.json)

Processor hotspot tuning note:

- The EU-ME2 hotspot coordinates are approximate starter values.
- Retune hotspot positions in `src/features/knobology/processor/eu-me2-layout.json` only, not in JSX.

## Notes

- Vite is configured to read repo-root JSON outside `apps/web`, so the web app does not duplicate station, quiz, or case content.
- The `/cases/case-001` route now uses the repo-native vtk.js viewer.

Case 001 source-of-truth note:

- Runtime hierarchy is `case_001_ct.nrrd` for image geometry, `case_001_segmentation.nrrd` for anatomy overlay alignment, then `model/markups/*.mrk.json` for targets. The GLB is optional display polish only.
- Segmentation is trusted before GLB because the labelmap shares explicit medical-image world geometry, while the GLB is a presentation export that needs an explicit transform to re-enter patient space.
- `scripts/cases/build-case-assets.ts` reads the CT, segmentation header metadata, and markups, validates target bounds, derives voxel and slice coordinates, and emits `content/cases/case_001.runtime.json` for the web viewer.

```

## File: `apps/web/src/app/App.tsx`

```typescript
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { AppShell } from '@/components/AppShell';
import type { AppRouteId, NavigationItem } from '@/content/types';
import { HomePage } from '@/app/routes/HomePage';
import { StationsPage } from '@/app/routes/StationsPage';
import { KnobologyPage } from '@/app/routes/KnobologyPage';
import { LecturesPage } from '@/app/routes/LecturesPage';
import { QuizPage } from '@/app/routes/QuizPage';
import { Case001Page } from '@/app/routes/Case001Page';
import { NotFoundPage } from '@/app/routes/NotFoundPage';
import { useLearnerProgress } from '@/lib/progress';

const navItems: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: '⌂', path: '/' },
  { id: 'stations', label: 'Stations', icon: '◎', path: '/stations' },
  { id: 'case-001', label: 'Case 3D', icon: '◫', path: '/cases/case-001' },
  { id: 'knobology', label: 'Knobology', icon: '◐', path: '/knobology' },
  { id: 'lectures', label: 'Lectures', icon: '▶', path: '/lectures' },
  { id: 'quiz', label: 'Quiz', icon: '✎', path: '/quiz' },
];

function resolveRouteId(pathname: string): AppRouteId | null {
  if (pathname === '/') {
    return 'home';
  }

  if (pathname.startsWith('/stations')) {
    return 'stations';
  }

  if (pathname.startsWith('/knobology')) {
    return 'knobology';
  }

  if (pathname.startsWith('/lectures')) {
    return 'lectures';
  }

  if (pathname.startsWith('/quiz')) {
    return 'quiz';
  }

  if (pathname.startsWith('/cases/case-001')) {
    return 'case-001';
  }

  return null;
}

export function App() {
  const location = useLocation();
  const { visitRoute } = useLearnerProgress();

  useEffect(() => {
    const routeId = resolveRouteId(location.pathname);

    if (routeId) {
      visitRoute(routeId);
    }
  }, [location.pathname, visitRoute]);

  return (
    <AppShell navItems={navItems}>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<StationsPage />} path="/stations" />
        <Route element={<KnobologyPage />} path="/knobology" />
        <Route element={<LecturesPage />} path="/lectures" />
        <Route element={<QuizPage />} path="/quiz" />
        <Route element={<Case001Page />} path="/cases/case-001" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </AppShell>
  );
}

```

## File: `apps/web/src/app/routes/Case001Page.tsx`

```typescript
import { Case3DRoute } from '@/features/case3d/Case3DRoute';

export function Case001Page() {
  return <Case3DRoute />;
}

```

## File: `apps/web/src/app/routes/HomePage.tsx`

```typescript
import { ModuleCard } from '@/components/ModuleCard';
import { courseInfo } from '@/content/course';
import { homeModuleCards } from '@/content/modules';
import { useLearnerProgress } from '@/lib/progress';

export function HomePage() {
  const { state } = useLearnerProgress();
  const completedModules = Object.values(state.moduleProgress).filter((module) => module.completedAt).length;
  const reviewedLectures = Object.values(state.lectureWatchStatus).filter((lecture) => lecture.completed).length;
  const lastQuiz = state.quizScoreHistory[0];

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="eyebrow">Web beta</div>
        <h2>{courseInfo.courseTitle}</h2>
        <p>{courseInfo.overview}</p>
        <div className="stats-grid">
          {courseInfo.quickFacts.map((fact) => (
            <div key={fact.label} className="stat-card">
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Progress</div>
            <h2>Resume points across the web app</h2>
          </div>
        </div>
        <div className="mini-card-grid">
          <article className="mini-card">
            <strong>{completedModules}</strong>
            <p>Completed modules</p>
          </article>
          <article className="mini-card">
            <strong>{state.bookmarkedStations.length}</strong>
            <p>Bookmarked stations</p>
          </article>
          <article className="mini-card">
            <strong>{reviewedLectures}</strong>
            <p>Reviewed lectures</p>
          </article>
          <article className="mini-card">
            <strong>{lastQuiz ? `${lastQuiz.percent}%` : 'No score yet'}</strong>
            <p>Latest quiz result</p>
          </article>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Modules</div>
            <h2>Prototype shell, real repo content</h2>
          </div>
        </div>
        <div className="module-grid">
          {homeModuleCards.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Live day</div>
            <h2>Agenda snapshot</h2>
          </div>
        </div>
        <div className="schedule-list">
          {courseInfo.liveDayAgenda.map((item) => (
            <article key={`${item.time}-${item.title}`} className="schedule-item">
              <span>{item.time}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

```

## File: `apps/web/src/app/routes/KnobologyPage.tsx`

```typescript
import { EducationModuleRenderer } from '@/components/education/EducationModuleRenderer';
import { knobologyAdvancedContent } from '@/content/education';
import { KnobologyPanel } from '@/features/knobology/KnobologyPanel';
import { QuizCard } from '@/features/quiz/QuizCard';
import { getKnobologyQuizQuestions } from '@/content/knobology';
import { useLearnerProgress } from '@/lib/progress';

export function KnobologyPage() {
  const { recordQuizResult, setModuleProgress, state } = useLearnerProgress();
  const questions = getKnobologyQuizQuestions();
  const lastControl = state.lastUsedKnobologyControl ?? 'depth';

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Module</div>
            <h2>Ultrasound foundations and EBUS knobology</h2>
          </div>
        </div>
        <div className="tag-row">
          <span className="tag">Last used control: {lastControl}</span>
          <span className="tag">Progress: {state.moduleProgress.knobology.percentComplete}%</span>
          <span className="tag">Educational approximation only</span>
        </div>
      </section>

      <EducationModuleRenderer module={knobologyAdvancedContent} />

      <KnobologyPanel />

      <QuizCard
        label="Knobology quiz"
        onComplete={(result) => {
          recordQuizResult({
            id: `knobology-${Date.now()}`,
            label: 'Knobology quiz',
            moduleId: 'knobology',
            correctCount: result.correctCount,
            totalCount: result.totalCount,
            percent: result.percent,
          });
          setModuleProgress('knobology', result.percent >= 80 ? 100 : 95, result.percent >= 80);
        }}
        questions={questions}
      />
    </div>
  );
}

```

## File: `apps/web/src/app/routes/LecturesPage.tsx`

```typescript
import { courseInfo } from '@/content/course';
import { lectureManifest } from '@/content/lectures';
import { LectureCard } from '@/features/lectures/LectureCard';
import { useLearnerProgress } from '@/lib/progress';

export function LecturesPage() {
  const { state, setLectureState, setModuleProgress } = useLearnerProgress();
  const reviewedCount = Object.values(state.lectureWatchStatus).filter((lecture) => lecture.completed).length;

  function handleMarkReviewed(lectureId: string) {
    const nextReviewedCount =
      reviewedCount + (state.lectureWatchStatus[lectureId]?.completed ? 0 : 1);

    setLectureState(lectureId, { completed: true, watchedSeconds: 60 });
    setModuleProgress(
      'lectures',
      Math.round((nextReviewedCount / lectureManifest.length) * 100),
      nextReviewedCount >= lectureManifest.length,
    );
  }

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Lecture manifest</div>
            <h2>Prep window: {courseInfo.prepWindow}</h2>
          </div>
        </div>
        <div className="mini-card-grid">
          {courseInfo.prepTopics.map((topic) => (
            <article key={topic} className="mini-card">
              <p>{topic}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Progress</div>
            <h2>{reviewedCount} lectures marked reviewed</h2>
          </div>
        </div>
        <div className="stack-list">
          {lectureManifest.map((lecture) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              onMarkReviewed={handleMarkReviewed}
              watchState={state.lectureWatchStatus[lecture.id]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

```

## File: `apps/web/src/app/routes/NotFoundPage.tsx`

```typescript
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Not found</div>
            <h2>This route is not wired in the web scaffold.</h2>
          </div>
        </div>
        <p>Use the primary navigation to return to the main learning routes.</p>
        <Link className="button" to="/">
          Return home
        </Link>
      </section>
    </div>
  );
}

```

## File: `apps/web/src/app/routes/QuizPage.tsx`

```typescript
import { useState } from 'react';

import { getQuizQuestions } from '@/content/quiz';
import { QuizCard } from '@/features/quiz/QuizCard';
import { useLearnerProgress } from '@/lib/progress';

type QuizFilter = 'all' | 'knobology' | 'station-map' | 'station-explorer';

export function QuizPage() {
  const { recordQuizResult, setModuleProgress, state } = useLearnerProgress();
  const [filter, setFilter] = useState<QuizFilter>('all');
  const questions = filter === 'all' ? getQuizQuestions() : getQuizQuestions(filter);
  const filterLabels: Record<QuizFilter, string> = {
    all: 'All',
    knobology: 'Knobology',
    'station-map': 'Station map',
    'station-explorer': 'Explorer',
  };

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Question bank</div>
            <h2>Mixed review across modules</h2>
          </div>
        </div>
        <div className="button-row button-row--wrap">
          {(['all', 'knobology', 'station-map', 'station-explorer'] as const).map((candidate) => (
            <button
              key={candidate}
              className={`control-pill${filter === candidate ? ' control-pill--active' : ''}`}
              onClick={() => setFilter(candidate)}
              type="button"
            >
              {filterLabels[candidate]}
            </button>
          ))}
        </div>
      </section>

      <QuizCard
        key={filter}
        label={filter === 'all' ? 'Mixed quiz' : `${filter} quiz`}
        onComplete={(result) => {
          recordQuizResult({
            id: `${filter}-${Date.now()}`,
            label: filter === 'all' ? 'Mixed quiz' : `${filter} quiz`,
            moduleId: filter === 'all' ? 'mixed' : filter === 'station-map' ? 'station-map' : filter === 'station-explorer' ? 'station-explorer' : 'knobology',
            correctCount: result.correctCount,
            totalCount: result.totalCount,
            percent: result.percent,
          });
          setModuleProgress('quiz', result.percent >= 80 ? 100 : 75, result.percent >= 80);
        }}
        questions={questions}
      />

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">History</div>
            <h2>Recent saved attempts</h2>
          </div>
        </div>
        <div className="stack-list">
          {state.quizScoreHistory.length === 0 ? (
            <div className="mini-card">
              <p>Saved attempts will appear here after you complete a quiz.</p>
            </div>
          ) : (
            state.quizScoreHistory.map((entry) => (
              <article key={entry.id} className="mini-card">
                <strong>{entry.label}</strong>
                <p>
                  {entry.correctCount}/{entry.totalCount} correct · {entry.percent}%
                </p>
                <span>{new Date(entry.completedAt).toLocaleString()}</span>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

```

## File: `apps/web/src/app/routes/StationsPage.tsx`

```typescript
import { useEffect, useState } from 'react';

import { EducationModuleRenderer } from '@/components/education/EducationModuleRenderer';
import {
  mediastinalAnatomyContent,
  proceduralTechniqueContent,
  sonographicInterpretationContent,
  stagingStrategyContent,
} from '@/content/education';
import { EmptyState } from '@/components/EmptyState';
import { getStationExplorerContent, getStationMapContent, getStationMapLayout, getStations } from '@/content/stations';
import { StationDetail } from '@/features/stations/StationDetail';
import { StationMap } from '@/features/stations/StationMap';
import { useLearnerProgress } from '@/lib/progress';

function shuffle<T>(items: T[]): T[] {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = next[index];
    next[index] = next[swapIndex];
    next[swapIndex] = current;
  }

  return next;
}

export function StationsPage() {
  const mapContent = getStationMapContent();
  const explorerContent = getStationExplorerContent();
  const layout = getStationMapLayout();
  const stations = getStations();
  const { state, setLastViewedStation, toggleStationBookmark, setModuleProgress, recordRecognitionAttempt } =
    useLearnerProgress();
  const [selectedStationId, setSelectedStationId] = useState<string>(state.lastViewedStationId ?? stations[0]?.id ?? '');
  const [flashcardOrder, setFlashcardOrder] = useState(() => stations.map((station) => station.id));
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardRevealed, setFlashcardRevealed] = useState(false);
  const [mapQuizIndex, setMapQuizIndex] = useState(0);
  const [mapQuizAnswer, setMapQuizAnswer] = useState<string | null>(null);
  const [challengeAnswer, setChallengeAnswer] = useState<string | null>(null);
  const selectedStation = stations.find((station) => station.id === selectedStationId);
  const currentFlashcard = stations.find((station) => station.id === flashcardOrder[flashcardIndex]) ?? stations[0];
  const currentQuizRound = mapContent.quizRounds[mapQuizIndex] ?? mapContent.quizRounds[0];
  const challengePrompt = selectedStation?.quizItems[0];
  const challengeStat = selectedStation ? state.stationRecognitionStats[selectedStation.id] : undefined;

  useEffect(() => {
    if (selectedStationId) {
      setLastViewedStation(selectedStationId);
      setModuleProgress('station-map', 35);
      setModuleProgress('station-explorer', 25);
    }
  }, [selectedStationId, setLastViewedStation, setModuleProgress]);

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Overview</div>
            <h2>Read the mediastinum as map plus correlate</h2>
          </div>
        </div>
        <div className="mini-card-grid">
          {mapContent.introSections.map((section) => (
            <article key={section.id} className="mini-card">
              <strong>{section.title}</strong>
              <p>{section.summary}</p>
              <span>{section.takeaway}</span>
            </article>
          ))}
          {explorerContent.introSections.map((section) => (
            <article key={section.id} className="mini-card">
              <strong>{section.title}</strong>
              <p>{section.summary}</p>
              <span>{section.takeaway}</span>
            </article>
          ))}
        </div>
      </section>

      <EducationModuleRenderer compact module={mediastinalAnatomyContent} />

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Map</div>
            <h2>Core IASLC stations</h2>
          </div>
        </div>
        <div className="split-grid split-grid--map">
          <div className="stack-card">
            <StationMap
              layout={layout}
              onSelect={(stationId) => {
                setSelectedStationId(stationId);
                setMapQuizAnswer(null);
                setChallengeAnswer(null);
              }}
              selectedStationId={selectedStationId}
              stations={stations}
            />
            <div className="tag-row">
              {mapContent.mapTips.map((tip) => (
                <span key={tip} className="tag">
                  {tip}
                </span>
              ))}
            </div>
          </div>

          <div>
            {selectedStation ? (
              <StationDetail
                isBookmarked={state.bookmarkedStations.includes(selectedStation.id)}
                onToggleBookmark={toggleStationBookmark}
                station={selectedStation}
              />
            ) : (
              <EmptyState
                detail="Select a station from the map to open the detail card, media slots, and recognition challenge."
                icon="◎"
                title="No station selected"
              />
            )}
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Flashcards</div>
            <h2>{mapContent.flashcardPrompt}</h2>
          </div>
          <button
            className="button button--ghost"
            onClick={() => {
              setFlashcardOrder(shuffle(stations.map((station) => station.id)));
              setFlashcardIndex(0);
              setFlashcardRevealed(false);
              setModuleProgress('station-map', 50);
            }}
            type="button"
          >
            Shuffle
          </button>
        </div>

        {currentFlashcard ? (
          <div
            className="flashcard"
            onClick={() => setFlashcardRevealed((current) => !current)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setFlashcardRevealed((current) => !current);
              }
            }}
            role="button"
            tabIndex={0}
          >
            {!flashcardRevealed ? (
              <>
                <div className="flashcard__station">{currentFlashcard.id}</div>
                <span>Tap to reveal</span>
              </>
            ) : (
              <>
                <h3>{currentFlashcard.displayName}</h3>
                <p>{currentFlashcard.description}</p>
                <span>{currentFlashcard.iaslcName}</span>
                <span>{currentFlashcard.memoryCues[0]}</span>
              </>
            )}
          </div>
        ) : null}

        <div className="button-row">
          <button
            className="button button--ghost"
            onClick={() => {
              setFlashcardIndex((index) => (index - 1 + flashcardOrder.length) % flashcardOrder.length);
              setFlashcardRevealed(false);
            }}
            type="button"
          >
            Previous
          </button>
          <button
            className="button"
            onClick={() => {
              setFlashcardIndex((index) => (index + 1) % flashcardOrder.length);
              setFlashcardRevealed(false);
            }}
            type="button"
          >
            Next
          </button>
        </div>
      </section>

      <div className="split-grid">
        <section className="section-card">
          <div className="section-card__heading">
            <div>
              <div className="eyebrow">Pin-the-station quiz</div>
              <h2>{currentQuizRound.prompt}</h2>
            </div>
          </div>
          <StationMap
            layout={layout}
            onSelect={(stationId) => {
              setMapQuizAnswer(stationId);
              if (stationId === currentQuizRound.stationId) {
                setModuleProgress('station-map', mapQuizIndex === mapContent.quizRounds.length - 1 ? 100 : 70, mapQuizIndex === mapContent.quizRounds.length - 1);
              }
            }}
            quizMode
            selectedStationId={mapQuizAnswer}
            stations={stations}
          />
          <div className={`feedback-banner${mapQuizAnswer === currentQuizRound.stationId ? ' feedback-banner--success' : ''}`}>
            <strong>{mapQuizAnswer ? (mapQuizAnswer === currentQuizRound.stationId ? 'Correct station' : 'Not quite') : 'Hint'}</strong>
            <p>{mapQuizAnswer ? currentQuizRound.explanation : currentQuizRound.hint}</p>
          </div>
          <div className="button-row">
            <button
              className="button button--ghost"
              disabled={mapQuizIndex === 0}
              onClick={() => {
                setMapQuizIndex((index) => index - 1);
                setMapQuizAnswer(null);
              }}
              type="button"
            >
              Previous
            </button>
            <button
              className="button"
              disabled={mapQuizIndex === mapContent.quizRounds.length - 1}
              onClick={() => {
                setMapQuizIndex((index) => index + 1);
                setMapQuizAnswer(null);
              }}
              type="button"
            >
              Next
            </button>
          </div>
        </section>

        <section className="section-card">
          <div className="section-card__heading">
            <div>
              <div className="eyebrow">Recognition challenge</div>
              <h2>{challengePrompt?.prompt ?? 'Select a station to load a challenge.'}</h2>
            </div>
          </div>
          {selectedStation && challengePrompt ? (
            <>
              <div className="stack-list">
                {challengePrompt.optionIds.map((optionId) => (
                  (() => {
                    const optionStation = stations.find((station) => station.id === optionId);

                    return (
                      <button
                        key={optionId}
                        className={`choice-card${challengeAnswer === optionId ? ' choice-card--selected' : ''}${
                          challengeAnswer
                            ? optionId === selectedStation.id
                              ? ' choice-card--correct'
                              : challengeAnswer === optionId
                                ? ' choice-card--incorrect'
                                : ''
                            : ''
                        }`}
                        onClick={() => {
                          setChallengeAnswer(optionId);
                          recordRecognitionAttempt(selectedStation.id, optionId === selectedStation.id);
                          setModuleProgress('station-explorer', optionId === selectedStation.id ? 80 : 55);
                        }}
                        type="button"
                      >
                        <strong>{optionStation?.displayName ?? optionId}</strong>
                        <span>{optionStation?.iaslcName ?? optionId}</span>
                      </button>
                    );
                  })()
                ))}
              </div>
              <div className={`feedback-banner${challengeAnswer === selectedStation.id ? ' feedback-banner--success' : ''}`}>
                <strong>{challengeAnswer ? (challengeAnswer === selectedStation.id ? 'Correct' : 'Review the correlate') : 'Use the selected station detail card'}</strong>
                <p>
                  {challengeAnswer
                    ? challengePrompt.explanation
                    : 'The selected station detail card stays synchronized with this challenge so you can compare cues before answering.'}
                </p>
                {challengeStat ? (
                  <p>
                    {challengeStat.correct}/{challengeStat.attempts} correct for {selectedStation.id}
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <EmptyState
              detail="Pick a station on the map to open a synchronized correlate challenge."
              icon="◌"
              title="Challenge waits for a station"
            />
          )}
        </section>
      </div>

      <EducationModuleRenderer compact module={sonographicInterpretationContent} />
      <EducationModuleRenderer compact module={proceduralTechniqueContent} />
      <EducationModuleRenderer compact module={stagingStrategyContent} />
    </div>
  );
}

```

## File: `apps/web/src/components/AppShell.tsx`

```typescript
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import { BottomNav } from '@/components/BottomNav';
import { TopHeader } from '@/components/TopHeader';
import type { NavigationItem } from '@/content/types';

export function AppShell({
  children,
  navItems,
}: {
  children: ReactNode;
  navItems: NavigationItem[];
}) {
  return (
    <div className="app-shell">
      <div className="app-shell__frame">
        <TopHeader />
        <nav className="top-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              className={({ isActive }) => `top-nav__link${isActive ? ' top-nav__link--active' : ''}`}
              to={item.path}
              end={item.path === '/'}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <main className="app-shell__content">{children}</main>
      </div>
      <BottomNav items={navItems} />
    </div>
  );
}

```

## File: `apps/web/src/components/BottomNav.tsx`

```typescript
import { NavLink } from 'react-router-dom';

import type { NavigationItem } from '@/content/types';

export function BottomNav({ items }: { items: NavigationItem[] }) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.id}
          className={({ isActive }) => `bottom-nav__link${isActive ? ' bottom-nav__link--active' : ''}`}
          to={item.path}
        >
          <span className="bottom-nav__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

```

## File: `apps/web/src/components/education/education.css`

```css
.education-module {
  display: grid;
  gap: 1rem;
}

.education-module--compact {
  gap: 0.85rem;
}

.education-card,
.quiz-explanation-panel {
  border: 1px solid rgba(163, 186, 215, 0.18);
  border-radius: 1rem;
  background: rgba(10, 18, 32, 0.58);
  padding: 1rem;
}

.education-card h3,
.quiz-explanation-panel strong {
  margin: 0;
}

.education-objectives,
.education-list {
  display: grid;
  gap: 0.65rem;
}

.education-objectives li,
.education-list li {
  padding-left: 1.4rem;
  position: relative;
}

.education-objectives li::before,
.education-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: rgba(97, 182, 255, 0.95);
}

.education-callout {
  margin-top: 0.9rem;
  border-radius: 0.9rem;
  padding: 0.85rem 0.95rem;
}

.education-callout strong {
  display: block;
  margin-bottom: 0.35rem;
}

.education-callout--pearl {
  background: rgba(19, 80, 63, 0.42);
  border: 1px solid rgba(82, 214, 162, 0.24);
}

.education-callout--pitfall {
  background: rgba(92, 41, 26, 0.38);
  border: 1px solid rgba(237, 132, 92, 0.22);
}

.boundary-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  margin-bottom: 0.8rem;
}

.boundary-grid__item {
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.8rem;
}

.boundary-grid__item strong,
.related-images-strip__item strong {
  display: block;
  margin-bottom: 0.35rem;
}

.staging-summary {
  display: grid;
  gap: 0.75rem;
}

.staging-badge {
  display: inline-flex;
  flex-direction: column;
  gap: 0.2rem;
  border-radius: 999px;
  padding: 0.65rem 0.9rem;
  width: fit-content;
}

.staging-badge strong {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.staging-badge--neutral {
  background: rgba(56, 124, 208, 0.18);
  border: 1px solid rgba(96, 165, 250, 0.3);
}

.staging-badge--warning {
  background: rgba(153, 51, 65, 0.18);
  border: 1px solid rgba(244, 114, 182, 0.24);
}

.staging-badge--accent {
  background: rgba(46, 114, 86, 0.2);
  border: 1px solid rgba(74, 222, 128, 0.22);
}

.related-images-strip {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  margin-top: 0.9rem;
}

.related-images-strip__item {
  border-radius: 0.9rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(163, 186, 215, 0.16);
}

.related-images-strip__item img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.related-images-strip__item figcaption {
  display: grid;
  gap: 0.25rem;
  padding: 0.75rem;
}

.education-case {
  margin-top: 0.8rem;
  border-left: 3px solid rgba(97, 182, 255, 0.62);
  padding-left: 0.85rem;
}

.education-case--takeaway {
  border-left-color: rgba(74, 222, 128, 0.65);
}

.quiz-explanation-panel {
  margin-top: 1rem;
  display: grid;
  gap: 0.9rem;
}

.quiz-explanation-panel--success {
  border-color: rgba(74, 222, 128, 0.3);
  background: rgba(17, 44, 37, 0.55);
}

.quiz-explanation-panel__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quiz-explanation-panel__answer {
  border-radius: 0.85rem;
  padding: 0.85rem;
  background: rgba(255, 255, 255, 0.04);
}

.education-option-rationale {
  border-radius: 0.85rem;
  border: 1px solid rgba(163, 186, 215, 0.14);
  background: rgba(255, 255, 255, 0.025);
  padding: 0.8rem 0.9rem;
}

.education-option-rationale--correct {
  border-color: rgba(74, 222, 128, 0.28);
}

.education-option-rationale--selected {
  border-color: rgba(244, 114, 182, 0.22);
}

@media (min-width: 900px) {
  .education-module {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .education-card--objectives {
    grid-column: span 2;
  }
}

```

## File: `apps/web/src/components/education/EducationModuleRenderer.tsx`

```typescript
import { resolveEducationImages, type RelatedImageAsset } from '@/content/education';
import type {
  EducationalModuleContent,
  LessonCaseVignette,
  LessonSection,
  QuizQuestionContent,
  StationBoundaryDefinition,
  StationStagingImplication,
} from '@/content/types';
import { isQuizAnswerCorrect } from '@/lib/quiz';

import './education.css';

function formatSectionKind(kind: LessonSection['kind']): string {
  return kind.replace(/-/g, ' ');
}

function formatCorrectAnswer(question: QuizQuestionContent): string {
  if (question.type === 'ordering') {
    return question.correctOptionIds
      .map((optionId, index) => {
        const option = question.options.find((entry) => entry.id === optionId);
        return `${index + 1}. ${option?.label ?? optionId}`;
      })
      .join('  ');
  }

  return question.correctOptionIds
    .map((optionId) => question.options.find((entry) => entry.id === optionId)?.label ?? optionId)
    .join(', ');
}

export function LearningObjectivesCard({
  objectives,
  title = 'Learning objectives',
}: {
  objectives: string[];
  title?: string;
}) {
  return (
    <article className="education-card education-card--objectives">
      <div className="eyebrow">{title}</div>
      <ul className="plain-list education-objectives">
        {objectives.map((objective) => (
          <li key={objective}>{objective}</li>
        ))}
      </ul>
    </article>
  );
}

export function ClinicalPearlCallout({ children }: { children: string }) {
  return (
    <aside className="education-callout education-callout--pearl">
      <strong>Clinical pearl</strong>
      <p>{children}</p>
    </aside>
  );
}

export function PitfallCallout({ children }: { children: string }) {
  return (
    <aside className="education-callout education-callout--pitfall">
      <strong>Pitfall</strong>
      <p>{children}</p>
    </aside>
  );
}

export function StagingImplicationBadge({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'warning' | 'accent';
}) {
  return (
    <span className={`staging-badge staging-badge--${tone}`}>
      <strong>{label}</strong>
      <span>{value}</span>
    </span>
  );
}

export function StationBoundaryCard({
  boundary,
  notes,
}: {
  boundary: StationBoundaryDefinition;
  notes: string[];
}) {
  const entries = [
    { label: 'Superior', value: boundary.superior },
    { label: 'Inferior', value: boundary.inferior },
    { label: 'Medial', value: boundary.medial },
    { label: 'Lateral', value: boundary.lateral },
    { label: 'Anterior', value: boundary.anterior },
    { label: 'Posterior', value: boundary.posterior },
  ].filter((entry) => Boolean(entry.value));

  return (
    <article className="education-card">
      <div className="eyebrow">Station boundary</div>
      <div className="boundary-grid">
        {entries.map((entry) => (
          <div key={entry.label} className="boundary-grid__item">
            <strong>{entry.label}</strong>
            <p>{entry.value}</p>
          </div>
        ))}
      </div>
      {notes.length ? (
        <ul className="plain-list education-list">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function LandmarkChecklist({
  items,
  title = 'Landmark checklist',
}: {
  items: string[];
  title?: string;
}) {
  return (
    <article className="education-card education-card--checklist">
      <div className="eyebrow">{title}</div>
      <ul className="plain-list education-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export function RelatedImagesStrip({ items }: { items: RelatedImageAsset[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="related-images-strip">
      {items.map((item) => (
        <figure key={item.id} className="related-images-strip__item">
          <img alt={item.label} src={item.src} />
          <figcaption>
            <strong>{item.label}</strong>
            {item.note ? <span>{item.note}</span> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function CaseVignetteCard({ vignette }: { vignette: LessonCaseVignette }) {
  return (
    <article className="education-card education-card--case">
      <div className="eyebrow">Case vignette</div>
      <h3>{vignette.title}</h3>
      <p>{vignette.scenario}</p>
      <div className="education-case">
        <strong>Question</strong>
        <p>{vignette.prompt}</p>
      </div>
      <div className="education-case education-case--takeaway">
        <strong>Takeaway</strong>
        <p>{vignette.takeaway}</p>
      </div>
    </article>
  );
}

export function ArtifactCard({
  section,
  images,
}: {
  section: LessonSection;
  images: RelatedImageAsset[];
}) {
  return (
    <article className="education-card education-card--artifact">
      <div className="eyebrow">{formatSectionKind(section.kind)}</div>
      <h3>{section.title}</h3>
      <p>{section.body}</p>
      {section.bullets?.length ? (
        <ul className="plain-list education-list">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
      <RelatedImagesStrip items={images} />
      {section.pearl ? <ClinicalPearlCallout>{section.pearl}</ClinicalPearlCallout> : null}
      {section.pitfall ? <PitfallCallout>{section.pitfall}</PitfallCallout> : null}
    </article>
  );
}

export function QuizExplanationPanel({
  question,
  selectedOptionIds,
}: {
  question: QuizQuestionContent;
  selectedOptionIds: string[];
}) {
  const correct = isQuizAnswerCorrect(question, selectedOptionIds);

  return (
    <div className={`quiz-explanation-panel${correct ? ' quiz-explanation-panel--success' : ''}`}>
      <div className="quiz-explanation-panel__meta">
        <span className="tag">Difficulty: {question.difficulty}</span>
        {question.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="quiz-explanation-panel__answer">
        <strong>Correct answer</strong>
        <p>{formatCorrectAnswer(question)}</p>
      </div>
      <p>{question.explanation}</p>
      <div className="stack-list">
        {question.options.map((option) => {
          const isCorrect = question.correctOptionIds.includes(option.id);
          const wasSelected = selectedOptionIds.includes(option.id);

          return (
            <article
              key={option.id}
              className={`education-option-rationale${
                isCorrect ? ' education-option-rationale--correct' : wasSelected ? ' education-option-rationale--selected' : ''
              }`}
            >
              <strong>{option.label}</strong>
              <p>{option.rationale}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function EducationSectionCard({ section }: { section: LessonSection }) {
  const images = resolveEducationImages(section.imageIds);

  if (section.kind === 'artifact') {
    return <ArtifactCard images={images} section={section} />;
  }

  return (
    <article className={`education-card education-card--${section.kind}`}>
      <div className="eyebrow">{formatSectionKind(section.kind)}</div>
      <h3>{section.title}</h3>
      <p>{section.body}</p>
      {section.bullets?.length ? (
        <ul className="plain-list education-list">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
      {section.checklist?.length ? <LandmarkChecklist items={section.checklist} title="Checklist" /> : null}
      <RelatedImagesStrip items={images} />
      {section.caseVignette ? <CaseVignetteCard vignette={section.caseVignette} /> : null}
      {section.pearl ? <ClinicalPearlCallout>{section.pearl}</ClinicalPearlCallout> : null}
      {section.pitfall ? <PitfallCallout>{section.pitfall}</PitfallCallout> : null}
    </article>
  );
}

export function EducationModuleRenderer({
  module,
  compact = false,
}: {
  module: EducationalModuleContent;
  compact?: boolean;
}) {
  return (
    <section className="section-card">
      <div className="section-card__heading">
        <div>
          <div className="eyebrow">Handbook layer</div>
          <h2>{module.title}</h2>
          <p>{module.summary}</p>
        </div>
      </div>
      <div className={`education-module${compact ? ' education-module--compact' : ''}`}>
        <LearningObjectivesCard objectives={module.learningObjectives} />
        {module.sections.map((section) => (
          <EducationSectionCard key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}

export function StationStagingSummary({
  staging,
  accessProfile,
}: {
  staging: StationStagingImplication;
  accessProfile: string;
}) {
  return (
    <div className="staging-summary">
      <StagingImplicationBadge label="Access" tone="accent" value={accessProfile} />
      <StagingImplicationBadge label="Ipsilateral" tone="neutral" value={staging.ipsilateral} />
      <StagingImplicationBadge label="Contralateral" tone="warning" value={staging.contralateral} />
      <p>{staging.note}</p>
    </div>
  );
}

```

## File: `apps/web/src/components/EmptyState.tsx`

```typescript
export function EmptyState({
  title,
  detail,
  icon,
}: {
  title: string;
  detail: string;
  icon?: string;
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        {icon ?? '◌'}
      </div>
      <h3>{title}</h3>
      <p>{detail}</p>
    </div>
  );
}

```

## File: `apps/web/src/components/ModuleCard.tsx`

```typescript
import { Link } from 'react-router-dom';

import type { AppModuleCard } from '@/content/types';

export function ModuleCard({ module }: { module: AppModuleCard }) {
  return (
    <Link className="module-card" to={module.path}>
      <div className="module-card__icon" style={{ color: module.accent }}>
        {module.icon}
      </div>
      <div className="module-card__body">
        <h3>{module.title}</h3>
        <p>{module.description}</p>
      </div>
      <span className="module-card__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

```

## File: `apps/web/src/components/TopHeader.tsx`

```typescript
import { courseInfo } from '@/content/course';

export function TopHeader() {
  return (
    <header className="top-header">
      <div className="top-header__identity">
        <div className="top-header__mark" aria-hidden="true">
          📡
        </div>
        <div>
          <div className="eyebrow">SoCal EBUS 2026</div>
          <h1 className="top-header__title">Fellow Prep</h1>
          <p className="top-header__subtitle">{courseInfo.hostLine}</p>
        </div>
      </div>
      <div className="top-header__meta">
        <span>{courseInfo.dateLabel}</span>
        <span>{courseInfo.venueName}</span>
      </div>
    </header>
  );
}

```

## File: `apps/web/src/content/cases.ts`

```typescript
import caseManifestData from '../../../../content/cases/generated/case_001.enriched.json';

import type { CombinedCaseManifest } from '@/content/types';

export const case001Manifest = caseManifestData as CombinedCaseManifest;

```

## File: `apps/web/src/content/course.ts`

```typescript
import courseInfoData from '../../../../content/course/course-info.json';

import type { CourseInfoContent } from '@/content/types';

export const courseInfo = courseInfoData as CourseInfoContent;

```

## File: `apps/web/src/content/ebus-annotations.json`

```json
{
  "EBUS_5.png": {
    "width": 900,
    "height": 540,
    "regions": [
      {
        "label": "Pulmonary Artery",
        "points": [
          [
            333.4,
            84.75
          ],
          [
            398.44,
            80.15
          ],
          [
            496.98,
            94.61
          ],
          [
            562.67,
            120.88
          ],
          [
            579.75,
            174.09
          ],
          [
            583.04,
            222.05
          ],
          [
            560.7,
            281.83
          ],
          [
            488.44,
            310.74
          ],
          [
            428.66,
            321.9
          ],
          [
            362.31,
            315.34
          ],
          [
            316.98,
            291.69
          ],
          [
            286.1,
            258.84
          ],
          [
            267.71,
            221.39
          ],
          [
            257.2,
            188.55
          ],
          [
            274.93,
            141.25
          ],
          [
            307.78,
            102.49
          ],
          [
            332.74,
            84.75
          ]
        ]
      },
      {
        "label": "Station 5",
        "points": [
          [
            225.66,
            439.5
          ],
          [
            317.63,
            420.44
          ],
          [
            401.07,
            407.31
          ],
          [
            461.5,
            420.44
          ],
          [
            462.82,
            446.72
          ],
          [
            435.23,
            463.15
          ],
          [
            376.76,
            476.94
          ],
          [
            327.49,
            495.99
          ],
          [
            252.6,
            509.13
          ],
          [
            182.31,
            510.44
          ],
          [
            126.47,
            508.47
          ],
          [
            102.16,
            503.22
          ],
          [
            120.55,
            461.17
          ],
          [
            153.4,
            444.75
          ],
          [
            205.3,
            442.78
          ],
          [
            223.69,
            437.52
          ]
        ]
      }
    ]
  },
  "EBUS_10L.png": {
    "width": 900,
    "height": 540,
    "regions": [
      {
        "label": "Station 10L",
        "points": [
          [
            365.59,
            139.93
          ],
          [
            403.04,
            128.11
          ],
          [
            444.42,
            124.82
          ],
          [
            487.78,
            125.48
          ],
          [
            521.94,
            73.58
          ],
          [
            492.38,
            76.87
          ],
          [
            469.39,
            77.52
          ],
          [
            439.82,
            74.24
          ],
          [
            413.55,
            67.01
          ],
          [
            392.52,
            60.44
          ],
          [
            372.82,
            61.1
          ],
          [
            351.14,
            67.67
          ],
          [
            339.31,
            73.58
          ],
          [
            322.89,
            80.15
          ],
          [
            314.35,
            86.07
          ],
          [
            311.07,
            97.89
          ],
          [
            314.35,
            109.06
          ],
          [
            319.61,
            115.63
          ],
          [
            337.34,
            128.77
          ],
          [
            347.2,
            132.05
          ],
          [
            367.56,
            139.93
          ]
        ]
      },
      {
        "label": "Pulmonary Artery",
        "points": [
          [
            548.88,
            120.88
          ],
          [
            507.49,
            137.96
          ],
          [
            457.56,
            154.39
          ],
          [
            406.98,
            178.04
          ],
          [
            390.55,
            211.54
          ],
          [
            382.01,
            245.7
          ],
          [
            370.19,
            275.92
          ],
          [
            373.47,
            335.04
          ],
          [
            378.73,
            362.63
          ],
          [
            382.67,
            392.85
          ],
          [
            389.24,
            417.82
          ],
          [
            398.44,
            443.44
          ],
          [
            412.23,
            463.15
          ],
          [
            444.42,
            477.6
          ],
          [
            475.3,
            488.11
          ],
          [
            527.2,
            492.71
          ],
          [
            573.84,
            494.02
          ],
          [
            615.23,
            491.39
          ],
          [
            645.44,
            488.77
          ],
          [
            662.52,
            487.45
          ],
          [
            688.15,
            480.88
          ],
          [
            719.68,
            467.09
          ],
          [
            751.21,
            457.89
          ],
          [
            771.58,
            449.35
          ],
          [
            790.63,
            438.84
          ],
          [
            807.05,
            427.01
          ],
          [
            820.19,
            407.31
          ],
          [
            820.85,
            402.05
          ],
          [
            573.18,
            106.43
          ],
          [
            548.22,
            119.57
          ]
        ]
      }
    ]
  },
  "EBUS_10R.png": {
    "width": 900,
    "height": 540,
    "regions": [
      {
        "label": "Station 10R",
        "points": [
          [
            434.57,
            54.53
          ],
          [
            452.96,
            50.59
          ],
          [
            468.73,
            55.19
          ],
          [
            481.87,
            59.13
          ],
          [
            487.12,
            66.36
          ],
          [
            487.12,
            76.21
          ],
          [
            481.87,
            85.41
          ],
          [
            472.01,
            91.32
          ],
          [
            462.16,
            93.29
          ],
          [
            457.56,
            91.32
          ],
          [
            441.14,
            88.04
          ],
          [
            426.69,
            88.04
          ],
          [
            418.8,
            86.07
          ],
          [
            414.2,
            80.15
          ],
          [
            414.2,
            71.61
          ],
          [
            416.17,
            63.73
          ],
          [
            422.74,
            57.16
          ],
          [
            432.6,
            53.88
          ]
        ]
      },
      {
        "label": "Station 10R",
        "points": [
          [
            426.03,
            91.98
          ],
          [
            413.55,
            91.98
          ],
          [
            408.29,
            95.92
          ],
          [
            403.04,
            101.17
          ],
          [
            402.38,
            108.4
          ],
          [
            401.07,
            114.97
          ],
          [
            405.66,
            125.48
          ],
          [
            409.61,
            129.42
          ],
          [
            425.37,
            134.68
          ],
          [
            443.77,
            136.65
          ],
          [
            454.28,
            134.68
          ],
          [
            462.82,
            124.17
          ],
          [
            464.79,
            117.6
          ],
          [
            464.13,
            110.37
          ],
          [
            463.47,
            105.77
          ],
          [
            460.85,
            100.52
          ],
          [
            457.56,
            96.58
          ],
          [
            450.34,
            94.61
          ],
          [
            443.11,
            93.95
          ],
          [
            435.23,
            92.63
          ],
          [
            427.34,
            91.98
          ],
          [
            419.46,
            91.32
          ]
        ]
      },
      {
        "label": "Azygous Vein",
        "points": [
          [
            499.61,
            105.77
          ],
          [
            487.12,
            107.74
          ],
          [
            476.61,
            114.97
          ],
          [
            470.7,
            123.51
          ],
          [
            465.44,
            134.68
          ],
          [
            469.39,
            147.82
          ],
          [
            471.36,
            155.7
          ],
          [
            473.33,
            162.27
          ],
          [
            482.52,
            168.84
          ],
          [
            482.52,
            178.04
          ],
          [
            479.9,
            186.58
          ],
          [
            475.96,
            192.49
          ],
          [
            474.64,
            199.71
          ],
          [
            492.38,
            209.57
          ],
          [
            514.06,
            210.88
          ],
          [
            538.36,
            206.94
          ],
          [
            556.1,
            200.37
          ],
          [
            569.9,
            197.09
          ],
          [
            596.17,
            185.92
          ],
          [
            600.77,
            176.72
          ],
          [
            604.71,
            169.5
          ],
          [
            547.56,
            84.75
          ],
          [
            539.02,
            87.38
          ],
          [
            530.48,
            88.04
          ],
          [
            519.31,
            92.63
          ],
          [
            511.43,
            95.92
          ],
          [
            501.58,
            101.17
          ],
          [
            497.63,
            103.15
          ]
        ]
      }
    ]
  },
  "EBUS_11Ri.png": {
    "width": 900,
    "height": 540,
    "regions": [
      {
        "label": "Station 11Ri",
        "points": [
          [
            320.92,
            145.85
          ],
          [
            343.91,
            141.25
          ],
          [
            350.48,
            137.96
          ],
          [
            370.85,
            129.42
          ],
          [
            382.67,
            122.85
          ],
          [
            405.01,
            112.34
          ],
          [
            422.74,
            108.4
          ],
          [
            443.77,
            99.86
          ],
          [
            458.88,
            93.29
          ],
          [
            463.47,
            86.72
          ],
          [
            466.1,
            78.18
          ],
          [
            464.13,
            70.96
          ],
          [
            449.02,
            65.7
          ],
          [
            435.88,
            62.42
          ],
          [
            428.66,
            62.42
          ],
          [
            420.12,
            60.44
          ],
          [
            409.61,
            57.82
          ],
          [
            396.47,
            55.85
          ],
          [
            383.98,
            54.53
          ],
          [
            372.82,
            55.19
          ],
          [
            360.99,
            55.85
          ],
          [
            358.36,
            55.85
          ],
          [
            352.45,
            55.85
          ],
          [
            346.54,
            54.53
          ],
          [
            294.64,
            130.08
          ],
          [
            292.01,
            140.59
          ],
          [
            295.96,
            143.22
          ],
          [
            301.87,
            145.85
          ],
          [
            313.69,
            147.16
          ],
          [
            320.92,
            145.19
          ]
        ]
      },
      {
        "label": "Station 11Ri",
        "points": [
          [
            334.06,
            159.64
          ],
          [
            327.49,
            166.21
          ],
          [
            322.89,
            174.09
          ],
          [
            316.32,
            182.63
          ],
          [
            313.69,
            187.23
          ],
          [
            311.72,
            195.77
          ],
          [
            313.04,
            205.63
          ],
          [
            313.69,
            212.85
          ],
          [
            318.29,
            224.68
          ],
          [
            324.86,
            229.93
          ],
          [
            337.34,
            234.53
          ],
          [
            350.48,
            240.44
          ],
          [
            359.68,
            243.07
          ],
          [
            370.19,
            245.04
          ],
          [
            385.96,
            247.67
          ],
          [
            392.52,
            248.33
          ],
          [
            405.01,
            247.67
          ],
          [
            424.06,
            237.82
          ],
          [
            431.94,
            231.9
          ],
          [
            439.82,
            227.96
          ],
          [
            452.31,
            225.34
          ],
          [
            471.36,
            223.36
          ],
          [
            486.47,
            218.11
          ],
          [
            504.2,
            214.17
          ],
          [
            512.09,
            211.54
          ],
          [
            528.51,
            206.28
          ],
          [
            537.71,
            199.71
          ],
          [
            548.22,
            195.12
          ],
          [
            563.98,
            189.2
          ],
          [
            573.18,
            186.58
          ],
          [
            581.07,
            180.66
          ],
          [
            586.98,
            176.72
          ],
          [
            522.6,
            74.24
          ],
          [
            500.26,
            82.12
          ],
          [
            494.35,
            87.38
          ],
          [
            481.21,
            92.63
          ],
          [
            468.07,
            96.58
          ],
          [
            446.39,
            107.09
          ],
          [
            429.31,
            115.63
          ],
          [
            418.15,
            121.54
          ],
          [
            397.78,
            134.68
          ],
          [
            389.9,
            137.31
          ],
          [
            374.13,
            142.56
          ],
          [
            357.05,
            149.13
          ],
          [
            351.14,
            151.76
          ],
          [
            332.74,
            158.33
          ]
        ]
      }
    ]
  },
  "EBUS_11Rs.png": {
    "width": 900,
    "height": 540,
    "regions": [
      {
        "label": "Pulmonary Artery",
        "points": [
          [
            457.56,
            224.68
          ],
          [
            447.71,
            228.62
          ],
          [
            433.25,
            231.25
          ],
          [
            428,
            235.19
          ],
          [
            422.74,
            239.13
          ],
          [
            420.77,
            247.01
          ],
          [
            423.4,
            255.55
          ],
          [
            427.34,
            264.75
          ],
          [
            432.6,
            282.49
          ],
          [
            435.23,
            285.77
          ],
          [
            436.54,
            287.74
          ],
          [
            449.02,
            289.71
          ],
          [
            462.82,
            287.09
          ],
          [
            487.78,
            280.52
          ],
          [
            494.35,
            277.89
          ],
          [
            502.89,
            270.01
          ],
          [
            504.86,
            253.58
          ],
          [
            500.26,
            245.7
          ],
          [
            495.01,
            239.13
          ],
          [
            493.04,
            234.53
          ],
          [
            485.15,
            229.93
          ],
          [
            481.87,
            226.65
          ],
          [
            476.61,
            224.02
          ],
          [
            466.1,
            223.36
          ],
          [
            460.19,
            223.36
          ]
        ]
      },
      {
        "label": "Station 11Rs",
        "points": [
          [
            294.64,
            116.94
          ],
          [
            303.18,
            119.57
          ],
          [
            306.47,
            123.51
          ],
          [
            316.98,
            132.05
          ],
          [
            327.49,
            135.34
          ],
          [
            332.74,
            139.93
          ],
          [
            344.57,
            147.82
          ],
          [
            350.48,
            154.39
          ],
          [
            364.28,
            157.01
          ],
          [
            378.73,
            159.64
          ],
          [
            391.87,
            164.9
          ],
          [
            398.44,
            169.5
          ],
          [
            401.72,
            178.04
          ],
          [
            406.32,
            187.89
          ],
          [
            410.26,
            200.37
          ],
          [
            415.52,
            209.57
          ],
          [
            418.15,
            216.14
          ],
          [
            424.06,
            218.77
          ],
          [
            449.68,
            205.63
          ],
          [
            460.19,
            201.69
          ],
          [
            479.9,
            191.83
          ],
          [
            495.01,
            183.95
          ],
          [
            513.4,
            173.44
          ],
          [
            521.28,
            167.52
          ],
          [
            536.39,
            156.36
          ],
          [
            550.19,
            153.07
          ],
          [
            558.07,
            147.16
          ],
          [
            558.07,
            139.28
          ],
          [
            552.16,
            134.68
          ],
          [
            542.96,
            126.14
          ],
          [
            539.68,
            117.6
          ],
          [
            535.08,
            107.09
          ],
          [
            533.11,
            99.2
          ],
          [
            520.63,
            82.78
          ],
          [
            516.03,
            78.84
          ],
          [
            514.06,
            75.55
          ],
          [
            503.55,
            68.33
          ],
          [
            498.29,
            65.04
          ],
          [
            482.52,
            64.39
          ],
          [
            473.98,
            65.7
          ],
          [
            468.07,
            67.01
          ],
          [
            450.99,
            67.67
          ],
          [
            441.14,
            67.01
          ],
          [
            424.71,
            64.39
          ],
          [
            408.29,
            61.1
          ],
          [
            403.04,
            57.82
          ],
          [
            391.21,
            53.88
          ],
          [
            377.42,
            48.62
          ],
          [
            363.62,
            43.36
          ],
          [
            355.08,
            40.74
          ],
          [
            351.14,
            42.05
          ],
          [
            295.3,
            114.97
          ]
        ]
      },
      {
        "label": "Pulmonary Artery",
        "points": [
          [
            363.62,
            175.41
          ],
          [
            347.85,
            174.09
          ],
          [
            338.66,
            176.07
          ],
          [
            330.77,
            178.04
          ],
          [
            322.23,
            181.98
          ],
          [
            317.63,
            185.92
          ],
          [
            312.38,
            193.8
          ],
          [
            309.75,
            199.71
          ],
          [
            308.44,
            205.63
          ],
          [
            311.07,
            216.14
          ],
          [
            310.41,
            224.02
          ],
          [
            309.75,
            231.9
          ],
          [
            312.38,
            243.73
          ],
          [
            322.23,
            252.93
          ],
          [
            328.15,
            257.52
          ],
          [
            343.25,
            258.18
          ],
          [
            353.11,
            258.84
          ],
          [
            383.33,
            256.21
          ],
          [
            391.21,
            252.27
          ],
          [
            399.75,
            246.36
          ],
          [
            405.66,
            239.13
          ],
          [
            408.95,
            232.56
          ],
          [
            410.26,
            226.65
          ],
          [
            408.29,
            205.63
          ],
          [
            405.01,
            200.37
          ],
          [
            400.41,
            192.49
          ],
          [
            396.47,
            189.86
          ],
          [
            387.27,
            182.63
          ],
          [
            381.36,
            180.01
          ],
          [
            369.53,
            174.75
          ],
          [
            364.28,
            174.75
          ]
        ]
      }
    ]
  },
  "EBUS_2L.png": {
    "width": 900,
    "height": 540,
    "regions": [
      {
        "label": "Brachiocephalic Trunk",
        "points": [
          [
            351.79,
            218.77
          ],
          [
            355.08,
            218.77
          ],
          [
            368.88,
            216.14
          ],
          [
            380.7,
            212.85
          ],
          [
            391.87,
            210.23
          ],
          [
            412.23,
            200.37
          ],
          [
            422.09,
            199.06
          ],
          [
            429.31,
            195.77
          ],
          [
            439.82,
            190.52
          ],
          [
            450.99,
            187.23
          ],
          [
            464.13,
            183.29
          ],
          [
            468.73,
            180.66
          ],
          [
            475.3,
            178.69
          ],
          [
            491.72,
            176.72
          ],
          [
            500.92,
            176.72
          ],
          [
            508.15,
            176.72
          ],
          [
            514.06,
            176.72
          ],
          [
            526.54,
            176.72
          ],
          [
            533.77,
            175.41
          ],
          [
            544.28,
            174.09
          ],
          [
            554.13,
            172.78
          ],
          [
            560.04,
            172.78
          ],
          [
            594.86,
            225.34
          ],
          [
            585.01,
            232.56
          ],
          [
            581.72,
            235.19
          ],
          [
            577.12,
            239.13
          ],
          [
            568.58,
            245.7
          ],
          [
            563.98,
            247.67
          ],
          [
            552.82,
            251.61
          ],
          [
            545.59,
            252.93
          ],
          [
            528.51,
            256.21
          ],
          [
            524.57,
            257.52
          ],
          [
            509.46,
            264.09
          ],
          [
            508.15,
            264.75
          ],
          [
            490.41,
            273.29
          ],
          [
            490.41,
            273.29
          ],
          [
            478.58,
            280.52
          ],
          [
            477.93,
            280.52
          ],
          [
            472.01,
            283.15
          ],
          [
            469.39,
            284.46
          ],
          [
            458.88,
            287.74
          ],
          [
            452.96,
            290.37
          ],
          [
            443.77,
            292.34
          ],
          [
            437.85,
            293.66
          ],
          [
            426.03,
            296.94
          ],
          [
            417.49,
            297.6
          ],
          [
            413.55,
            298.91
          ],
          [
            396.47,
            299.57
          ],
          [
            396.47,
            299.57
          ],
          [
            384.64,
            300.88
          ],
          [
            375.44,
            299.57
          ],
          [
            365.59,
            299.57
          ],
          [
            355.74,
            298.25
          ],
          [
            341.94,
            296.28
          ],
          [
            321.58,
            293
          ],
          [
            310.41,
            291.03
          ],
          [
            294.64,
            285.77
          ],
          [
            294.64,
            285.77
          ],
          [
            292.01,
            279.86
          ],
          [
            290.7,
            274.61
          ],
          [
            297.93,
            262.78
          ],
          [
            299.24,
            257.52
          ],
          [
            304.5,
            250.96
          ],
          [
            307.78,
            243.07
          ],
          [
            312.38,
            237.82
          ],
          [
            313.04,
            227.96
          ],
          [
            317.63,
            219.42
          ],
          [
            322.23,
            218.11
          ],
          [
            329.46,
            217.45
          ],
          [
            346.54,
            218.11
          ],
          [
            352.45,
            218.11
          ]
        ]
      },
      {
        "label": "Station 2L",
        "points": [
          [
            417.49,
            83.44
          ],
          [
            416.17,
            88.69
          ],
          [
            416.17,
            92.63
          ],
          [
            414.86,
            100.52
          ],
          [
            414.2,
            103.15
          ],
          [
            416.17,
            109.06
          ],
          [
            416.83,
            112.34
          ],
          [
            420.12,
            114.97
          ],
          [
            422.74,
            116.28
          ],
          [
            424.71,
            118.91
          ],
          [
            429.97,
            120.23
          ],
          [
            437.85,
            121.54
          ],
          [
            445.74,
            121.54
          ],
          [
            452.31,
            121.54
          ],
          [
            464.79,
            116.94
          ],
          [
            468.07,
            114.31
          ],
          [
            470.04,
            111.69
          ],
          [
            474.64,
            105.77
          ],
          [
            475.96,
            99.2
          ],
          [
            468.73,
            90.01
          ],
          [
            464.13,
            86.07
          ],
          [
            461.5,
            82.78
          ],
          [
            452.31,
            79.5
          ],
          [
            448.36,
            78.84
          ],
          [
            441.79,
            77.52
          ],
          [
            437.85,
            77.52
          ],
          [
            431.28,
            78.18
          ],
          [
            427.34,
            79.5
          ],
          [
            422.74,
            80.81
          ],
          [
            419.46,
            82.12
          ]
        ]
      },
      {
        "label": "Station 2L",
        "points": [
          [
            397.78,
            86.72
          ],
          [
            396.47,
            85.41
          ],
          [
            389.9,
            84.09
          ],
          [
            381.36,
            84.09
          ],
          [
            376.1,
            88.04
          ],
          [
            372.16,
            89.35
          ],
          [
            370.19,
            95.92
          ],
          [
            370.19,
            100.52
          ],
          [
            372.16,
            104.46
          ],
          [
            374.13,
            107.09
          ],
          [
            374.79,
            108.4
          ],
          [
            376.76,
            109.71
          ],
          [
            379.39,
            113
          ],
          [
            383.98,
            114.31
          ],
          [
            386.61,
            114.31
          ],
          [
            391.21,
            114.31
          ],
          [
            399.09,
            113.66
          ],
          [
            401.72,
            113
          ],
          [
            405.66,
            109.71
          ],
          [
            406.32,
            108.4
          ],
          [
            408.95,
            104.46
          ],
          [
            409.61,
            100.52
          ],
          [
            409.61,
            97.23
          ],
          [
            408.29,
            91.98
          ],
          [
            405.01,
            88.04
          ],
          [
            396.47,
            84.09
          ]
        ]
      },
      {
        "label": "Aorta",
        "points": [
          [
            301.87,
            114.97
          ],
          [
            301.87,
            114.97
          ],
          [
            304.5,
            122.2
          ],
          [
            307.78,
            126.14
          ],
          [
            314.35,
            130.08
          ],
          [
            315.66,
            137.31
          ],
          [
            316.32,
            145.19
          ],
          [
            316.98,
            150.44
          ],
          [
            317.63,
            158.98
          ],
          [
            317.63,
            163.58
          ],
          [
            316.98,
            170.15
          ],
          [
            318.29,
            185.26
          ],
          [
            318.29,
            193.15
          ],
          [
            318.29,
            197.09
          ],
          [
            318.29,
            201.69
          ],
          [
            318.29,
            206.94
          ],
          [
            318.29,
            211.54
          ],
          [
            316.98,
            217.45
          ],
          [
            311.07,
            228.62
          ],
          [
            311.07,
            231.9
          ],
          [
            307.78,
            239.13
          ],
          [
            303.18,
            246.36
          ],
          [
            301.21,
            250.96
          ],
          [
            294.64,
            258.84
          ],
          [
            291.36,
            264.75
          ],
          [
            290.7,
            266.72
          ],
          [
            288.73,
            268.69
          ],
          [
            280.85,
            271.98
          ],
          [
            271.65,
            275.92
          ],
          [
            266.39,
            277.89
          ],
          [
            255.23,
            279.2
          ],
          [
            236.17,
            283.8
          ],
          [
            231.58,
            283.8
          ],
          [
            231.58,
            283.8
          ],
          [
            217.12,
            279.2
          ],
          [
            208.58,
            281.83
          ],
          [
            205.96,
            282.49
          ],
          [
            197.42,
            281.83
          ],
          [
            192.82,
            279.86
          ],
          [
            296.61,
            111.69
          ]
        ]
      }
    ]
  },
  "EBUS_2R.jpg": {
    "width": 1440,
    "height": 864,
    "regions": [
      {
        "label": "Station 2R",
        "points": [
          [
            667.99,
            120.9
          ],
          [
            672.2,
            119.85
          ],
          [
            690.06,
            117.74
          ],
          [
            696.37,
            118.79
          ],
          [
            704.78,
            119.85
          ],
          [
            712.14,
            124.05
          ],
          [
            726.85,
            127.2
          ],
          [
            743.67,
            130.36
          ],
          [
            747.87,
            137.71
          ],
          [
            749.98,
            145.07
          ],
          [
            759.44,
            157.68
          ],
          [
            760.49,
            162.94
          ],
          [
            762.59,
            170.3
          ],
          [
            762.59,
            177.66
          ],
          [
            761.54,
            185.01
          ],
          [
            754.18,
            194.47
          ],
          [
            741.57,
            204.98
          ],
          [
            722.65,
            213.39
          ],
          [
            712.14,
            216.55
          ],
          [
            697.42,
            219.7
          ],
          [
            680.6,
            221.8
          ],
          [
            658.53,
            219.7
          ],
          [
            646.97,
            215.49
          ],
          [
            639.61,
            201.83
          ],
          [
            632.25,
            188.17
          ],
          [
            627,
            179.76
          ],
          [
            625.95,
            173.45
          ],
          [
            625.95,
            160.84
          ],
          [
            632.25,
            148.22
          ],
          [
            639.61,
            133.51
          ],
          [
            641.71,
            130.36
          ],
          [
            649.07,
            127.2
          ],
          [
            670.09,
            121.95
          ]
        ]
      },
      {
        "label": "Brachiocephalic Vein",
        "points": [
          [
            432.55,
            259.64
          ],
          [
            440.95,
            258.59
          ],
          [
            455.67,
            257.54
          ],
          [
            468.28,
            257.54
          ],
          [
            487.2,
            257.54
          ],
          [
            508.22,
            257.54
          ],
          [
            518.74,
            257.54
          ],
          [
            537.66,
            257.54
          ],
          [
            557.63,
            257.54
          ],
          [
            586.01,
            257.54
          ],
          [
            588.11,
            257.54
          ],
          [
            601.77,
            254.39
          ],
          [
            621.74,
            252.28
          ],
          [
            648.02,
            252.28
          ],
          [
            675.35,
            257.54
          ],
          [
            683.76,
            257.54
          ],
          [
            718.44,
            262.79
          ],
          [
            726.85,
            264.9
          ],
          [
            761.54,
            267
          ],
          [
            771,
            270.15
          ],
          [
            788.87,
            278.56
          ],
          [
            792.02,
            283.82
          ],
          [
            795.17,
            291.17
          ],
          [
            800.43,
            305.89
          ],
          [
            809.89,
            312.2
          ],
          [
            817.25,
            326.91
          ],
          [
            828.81,
            335.32
          ],
          [
            843.52,
            343.73
          ],
          [
            850.88,
            350.03
          ],
          [
            864.55,
            365.8
          ],
          [
            868.75,
            380.52
          ],
          [
            870.85,
            393.13
          ],
          [
            854.03,
            409.95
          ],
          [
            818.3,
            415.2
          ],
          [
            809.89,
            419.41
          ],
          [
            790.97,
            424.66
          ],
          [
            764.69,
            434.12
          ],
          [
            725.8,
            451.99
          ],
          [
            722.65,
            460.4
          ],
          [
            711.09,
            466.71
          ],
          [
            666.94,
            479.32
          ],
          [
            642.76,
            486.68
          ],
          [
            624.9,
            488.78
          ],
          [
            598.62,
            488.78
          ],
          [
            577.6,
            487.73
          ],
          [
            547.12,
            483.52
          ],
          [
            534.5,
            475.12
          ],
          [
            508.22,
            459.35
          ],
          [
            496.66,
            442.53
          ],
          [
            453.57,
            426.76
          ],
          [
            436.75,
            418.36
          ],
          [
            407.32,
            407.85
          ],
          [
            392.6,
            402.59
          ],
          [
            368.43,
            386.82
          ],
          [
            356.87,
            379.47
          ],
          [
            433.6,
            253.33
          ]
        ]
      }
    ]
  },
  "EBUS_4L.png": {
    "width": 900,
    "height": 540,
    "regions": [
      {
        "label": "Station 4L",
        "points": [
          [
            405.01,
            128.11
          ],
          [
            408.29,
            130.74
          ],
          [
            414.86,
            135.99
          ],
          [
            419.46,
            137.31
          ],
          [
            424.71,
            141.25
          ],
          [
            431.28,
            141.25
          ],
          [
            442.45,
            137.96
          ],
          [
            447.05,
            134.68
          ],
          [
            454.93,
            128.77
          ],
          [
            463.47,
            118.91
          ],
          [
            468.73,
            112.34
          ],
          [
            472.01,
            106.43
          ],
          [
            479.24,
            98.55
          ],
          [
            485.15,
            91.32
          ],
          [
            489.09,
            85.41
          ],
          [
            488.44,
            76.87
          ],
          [
            481.87,
            68.98
          ],
          [
            469.39,
            67.01
          ],
          [
            464.13,
            66.36
          ],
          [
            449.02,
            66.36
          ],
          [
            439.17,
            66.36
          ],
          [
            433.91,
            65.04
          ],
          [
            426.69,
            61.76
          ],
          [
            417.49,
            61.76
          ],
          [
            414.86,
            63.07
          ],
          [
            408.29,
            67.67
          ],
          [
            405.01,
            71.61
          ],
          [
            403.69,
            72.93
          ],
          [
            403.69,
            75.55
          ],
          [
            399.09,
            82.78
          ],
          [
            399.75,
            91.98
          ],
          [
            397.12,
            99.2
          ],
          [
            395.15,
            107.09
          ],
          [
            395.15,
            111.69
          ],
          [
            396.47,
            119.57
          ],
          [
            401.07,
            124.82
          ]
        ]
      },
      {
        "label": "Station 4L",
        "points": [
          [
            372.16,
            58.47
          ],
          [
            376.76,
            59.13
          ],
          [
            382.01,
            61.76
          ],
          [
            387.93,
            63.73
          ],
          [
            397.12,
            70.3
          ],
          [
            398.44,
            74.24
          ],
          [
            397.12,
            79.5
          ],
          [
            396.47,
            84.75
          ],
          [
            395.15,
            91.32
          ],
          [
            393.84,
            95.92
          ],
          [
            387.27,
            100.52
          ],
          [
            380.04,
            101.17
          ],
          [
            372.16,
            101.83
          ],
          [
            353.77,
            105.77
          ],
          [
            351.79,
            105.12
          ],
          [
            346.54,
            105.12
          ],
          [
            341.94,
            105.12
          ],
          [
            340.63,
            104.46
          ],
          [
            369.53,
            55.85
          ]
        ]
      },
      {
        "label": "Aorta",
        "points": [
          [
            558.07,
            64.39
          ],
          [
            549.53,
            68.33
          ],
          [
            542.31,
            73.58
          ],
          [
            530.48,
            80.81
          ],
          [
            512.09,
            98.55
          ],
          [
            504.86,
            104.46
          ],
          [
            489.75,
            119.57
          ],
          [
            484.5,
            128.77
          ],
          [
            480.55,
            141.25
          ],
          [
            476.61,
            157.67
          ],
          [
            473.98,
            174.09
          ],
          [
            472.67,
            182.63
          ],
          [
            471.36,
            200.37
          ],
          [
            473.98,
            225.99
          ],
          [
            473.98,
            229.28
          ],
          [
            476.61,
            243.73
          ],
          [
            480.55,
            252.27
          ],
          [
            482.52,
            260.81
          ],
          [
            487.78,
            276.58
          ],
          [
            490.41,
            285.77
          ],
          [
            495.01,
            291.03
          ],
          [
            508.8,
            300.88
          ],
          [
            518,
            310.08
          ],
          [
            525.23,
            314.68
          ],
          [
            541.65,
            326.5
          ],
          [
            554.13,
            334.39
          ],
          [
            560.7,
            340.3
          ],
          [
            573.84,
            346.87
          ],
          [
            582.38,
            351.47
          ],
          [
            596.17,
            355.41
          ],
          [
            605.37,
            358.69
          ],
          [
            626.39,
            367.23
          ],
          [
            634.93,
            372.49
          ],
          [
            668.44,
            381.69
          ],
          [
            678.95,
            384.31
          ],
          [
            692.09,
            383.66
          ],
          [
            703.91,
            383
          ],
          [
            713.77,
            378.4
          ],
          [
            722.31,
            375.12
          ],
          [
            730.85,
            371.17
          ],
          [
            738.07,
            367.89
          ],
          [
            743.33,
            364.61
          ],
          [
            744.64,
            363.95
          ],
          [
            745.3,
            362.63
          ],
          [
            558.73,
            65.04
          ]
        ]
      },
      {
        "label": "Pulmonary Artery",
        "points": [
          [
            334.71,
            109.71
          ],
          [
            339.97,
            111.03
          ],
          [
            346.54,
            114.31
          ],
          [
            359.68,
            118.91
          ],
          [
            370.19,
            122.2
          ],
          [
            378.07,
            128.77
          ],
          [
            382.67,
            134.02
          ],
          [
            387.27,
            143.22
          ],
          [
            393.84,
            153.07
          ],
          [
            397.12,
            156.36
          ],
          [
            406.98,
            170.81
          ],
          [
            414.2,
            179.35
          ],
          [
            416.17,
            181.98
          ],
          [
            423.4,
            189.86
          ],
          [
            428,
            199.71
          ],
          [
            432.6,
            206.94
          ],
          [
            435.88,
            221.39
          ],
          [
            443.11,
            229.28
          ],
          [
            445.74,
            239.79
          ],
          [
            449.02,
            250.96
          ],
          [
            453.62,
            258.84
          ],
          [
            454.28,
            267.38
          ],
          [
            454.28,
            283.15
          ],
          [
            452.96,
            291.03
          ],
          [
            449.68,
            306.14
          ],
          [
            448.36,
            322.56
          ],
          [
            448.36,
            329.79
          ],
          [
            442.45,
            344.9
          ],
          [
            437.2,
            356.07
          ],
          [
            431.28,
            373.8
          ],
          [
            418.15,
            386.94
          ],
          [
            414.2,
            388.91
          ],
          [
            404.35,
            396.79
          ],
          [
            381.36,
            410.59
          ],
          [
            368.22,
            415.19
          ],
          [
            352.45,
            420.44
          ],
          [
            349.17,
            420.44
          ],
          [
            312.38,
            427.01
          ],
          [
            303.18,
            427.01
          ],
          [
            282.16,
            425.7
          ],
          [
            273.62,
            423.73
          ],
          [
            263.11,
            421.76
          ],
          [
            242.74,
            417.16
          ],
          [
            217.12,
            409.93
          ],
          [
            214.5,
            407.96
          ],
          [
            199.39,
            399.42
          ],
          [
            188.22,
            392.2
          ],
          [
            183.62,
            388.25
          ],
          [
            179.02,
            383.66
          ],
          [
            175.08,
            380.37
          ],
          [
            171.79,
            377.74
          ],
          [
            167.2,
            374.46
          ],
          [
            159.31,
            367.89
          ],
          [
            334.06,
            109.06
          ]
        ]
      }
    ]
  },
  "EBUS_4R.png": {
    "width": 1440,
    "height": 864,
    "regions": [
      {
        "label": "Station 4R",
        "points": [
          [
            572.34,
            174.5
          ],
          [
            580.75,
            169.25
          ],
          [
            596.52,
            163.99
          ],
          [
            602.82,
            161.89
          ],
          [
            632.25,
            152.43
          ],
          [
            660.63,
            142.97
          ],
          [
            670.09,
            140.87
          ],
          [
            700.58,
            125.1
          ],
          [
            723.7,
            123
          ],
          [
            740.52,
            114.59
          ],
          [
            751.03,
            112.49
          ],
          [
            764.69,
            108.28
          ],
          [
            806.74,
            104.08
          ],
          [
            819.35,
            101.98
          ],
          [
            833.01,
            101.98
          ],
          [
            846.68,
            99.87
          ],
          [
            858.24,
            98.82
          ],
          [
            871.9,
            98.82
          ],
          [
            981.22,
            265.95
          ],
          [
            965.45,
            271.2
          ],
          [
            958.09,
            278.56
          ],
          [
            938.12,
            294.33
          ],
          [
            936.02,
            299.58
          ],
          [
            927.61,
            334.27
          ],
          [
            921.3,
            346.88
          ],
          [
            919.2,
            353.19
          ],
          [
            906.59,
            370.01
          ],
          [
            890.82,
            375.26
          ],
          [
            846.68,
            379.47
          ],
          [
            826.71,
            382.62
          ],
          [
            798.33,
            384.72
          ],
          [
            782.56,
            386.82
          ],
          [
            769.95,
            387.87
          ],
          [
            736.31,
            385.77
          ],
          [
            730.01,
            382.62
          ],
          [
            715.29,
            375.26
          ],
          [
            707.93,
            371.06
          ],
          [
            693.22,
            362.65
          ],
          [
            685.86,
            354.24
          ],
          [
            677.45,
            348.98
          ],
          [
            661.68,
            344.78
          ],
          [
            654.33,
            341.63
          ],
          [
            631.2,
            339.52
          ],
          [
            614.39,
            335.32
          ],
          [
            596.52,
            326.91
          ],
          [
            581.8,
            320.6
          ],
          [
            564.98,
            313.25
          ],
          [
            559.73,
            302.74
          ],
          [
            555.52,
            293.28
          ],
          [
            550.27,
            263.85
          ],
          [
            543.96,
            249.13
          ],
          [
            545.01,
            234.41
          ],
          [
            545.01,
            223.9
          ],
          [
            551.32,
            201.83
          ],
          [
            558.68,
            185.01
          ],
          [
            567.09,
            173.45
          ]
        ]
      },
      {
        "label": "Superior Vena Cava",
        "points": [
          [
            407.32,
            295.38
          ],
          [
            427.29,
            304.84
          ],
          [
            473.54,
            311.14
          ],
          [
            506.12,
            321.66
          ],
          [
            520.84,
            330.06
          ],
          [
            551.32,
            337.42
          ],
          [
            563.93,
            342.68
          ],
          [
            599.67,
            361.6
          ],
          [
            638.56,
            375.26
          ],
          [
            659.58,
            382.62
          ],
          [
            676.4,
            388.93
          ],
          [
            697.42,
            397.33
          ],
          [
            737.36,
            404.69
          ],
          [
            748.93,
            404.69
          ],
          [
            800.43,
            413.1
          ],
          [
            866.65,
            414.15
          ],
          [
            933.92,
            393.13
          ],
          [
            958.09,
            380.52
          ],
          [
            972.81,
            372.11
          ],
          [
            985.42,
            353.19
          ],
          [
            998.03,
            331.12
          ],
          [
            1013.8,
            313.25
          ],
          [
            1170.41,
            540.28
          ],
          [
            1131.52,
            562.36
          ],
          [
            1106.3,
            568.66
          ],
          [
            1077.92,
            574.97
          ],
          [
            1034.82,
            581.28
          ],
          [
            1006.44,
            576.02
          ],
          [
            961.25,
            572.87
          ],
          [
            907.64,
            563.41
          ],
          [
            885.57,
            563.41
          ],
          [
            836.17,
            565.51
          ],
          [
            792.02,
            581.28
          ],
          [
            773.1,
            587.58
          ],
          [
            742.62,
            595.99
          ],
          [
            690.06,
            608.6
          ],
          [
            669.04,
            610.71
          ],
          [
            651.17,
            610.71
          ],
          [
            599.67,
            604.4
          ],
          [
            586.01,
            604.4
          ],
          [
            547.12,
            584.43
          ],
          [
            511.38,
            572.87
          ],
          [
            485.1,
            567.61
          ],
          [
            469.33,
            561.3
          ],
          [
            413.63,
            540.28
          ],
          [
            372.63,
            529.77
          ],
          [
            356.87,
            525.57
          ],
          [
            331.64,
            516.11
          ],
          [
            322.18,
            507.7
          ],
          [
            294.85,
            497.19
          ],
          [
            280.14,
            486.68
          ],
          [
            406.27,
            295.38
          ]
        ]
      }
    ]
  },
  "EBUS_7.jpg": {
    "width": 1440,
    "height": 864,
    "regions": [
      {
        "label": "Station 7",
        "points": [
          [
            402.06,
            232.31
          ],
          [
            415.73,
            248.08
          ],
          [
            417.83,
            252.28
          ],
          [
            432.55,
            260.69
          ],
          [
            466.18,
            251.23
          ],
          [
            473.54,
            250.18
          ],
          [
            488.25,
            252.28
          ],
          [
            500.87,
            255.44
          ],
          [
            511.38,
            259.64
          ],
          [
            529.25,
            265.95
          ],
          [
            535.55,
            272.25
          ],
          [
            550.27,
            278.56
          ],
          [
            570.24,
            290.12
          ],
          [
            578.65,
            300.63
          ],
          [
            588.11,
            311.14
          ],
          [
            598.62,
            322.71
          ],
          [
            608.08,
            335.32
          ],
          [
            622.79,
            345.83
          ],
          [
            637.51,
            358.44
          ],
          [
            645.92,
            367.9
          ],
          [
            664.84,
            372.11
          ],
          [
            679.55,
            376.31
          ],
          [
            705.83,
            383.67
          ],
          [
            724.75,
            386.82
          ],
          [
            752.08,
            389.98
          ],
          [
            793.07,
            392.08
          ],
          [
            803.58,
            387.87
          ],
          [
            831.96,
            373.16
          ],
          [
            844.58,
            361.6
          ],
          [
            866.65,
            343.73
          ],
          [
            892.93,
            327.96
          ],
          [
            906.59,
            315.35
          ],
          [
            928.66,
            301.68
          ],
          [
            943.38,
            289.07
          ],
          [
            955.99,
            278.56
          ],
          [
            827.76,
            110.39
          ],
          [
            802.53,
            130.36
          ],
          [
            788.87,
            132.46
          ],
          [
            763.64,
            141.92
          ],
          [
            745.77,
            150.33
          ],
          [
            705.83,
            162.94
          ],
          [
            690.06,
            165.04
          ],
          [
            674.3,
            148.22
          ],
          [
            631.2,
            134.56
          ],
          [
            627,
            131.41
          ],
          [
            611.23,
            127.2
          ],
          [
            595.47,
            127.2
          ],
          [
            570.24,
            133.51
          ],
          [
            555.52,
            134.56
          ],
          [
            535.55,
            137.71
          ],
          [
            514.53,
            133.51
          ],
          [
            484.05,
            125.1
          ],
          [
            476.69,
            121.95
          ],
          [
            473.54,
            119.85
          ],
          [
            392.6,
            230.21
          ]
        ]
      },
      {
        "label": "Left Atrium",
        "points": [
          [
            384.73,
            250.01
          ],
          [
            401,
            259.05
          ],
          [
            416.67,
            266.28
          ],
          [
            429.32,
            274.72
          ],
          [
            453.42,
            278.93
          ],
          [
            471.5,
            281.95
          ],
          [
            480.53,
            285.56
          ],
          [
            523.91,
            296.41
          ],
          [
            527.53,
            301.83
          ],
          [
            546.81,
            313.28
          ],
          [
            566.69,
            327.13
          ],
          [
            602.84,
            356.06
          ],
          [
            610.07,
            368.71
          ],
          [
            619.11,
            387.39
          ],
          [
            633.57,
            412.69
          ],
          [
            652.25,
            437.39
          ],
          [
            662.49,
            448.84
          ],
          [
            684.12,
            469.93
          ],
          [
            695.63,
            497.65
          ],
          [
            699.25,
            509.7
          ],
          [
            720.33,
            528.37
          ],
          [
            737.2,
            549.46
          ],
          [
            746.24,
            567.54
          ],
          [
            760.1,
            601.88
          ],
          [
            765.52,
            611.52
          ],
          [
            775.16,
            638.03
          ],
          [
            787.15,
            672.98
          ],
          [
            798.06,
            708.52
          ],
          [
            809.5,
            757.33
          ],
          [
            814.93,
            797.09
          ],
          [
            814.93,
            806.13
          ],
          [
            817.94,
            823
          ],
          [
            818.54,
            833.85
          ],
          [
            821.55,
            851.32
          ],
          [
            814.93,
            862.16
          ],
          [
            3.35,
            860.36
          ],
          [
            0.94,
            831.44
          ],
          [
            382.93,
            248.21
          ]
        ]
      }
    ]
  }
}

```

## File: `apps/web/src/content/education.ts`

```typescript
import knobologyAdvancedData from '../../../../content/modules/knobology-advanced.json';
import mediastinalAnatomyData from '../../../../content/modules/mediastinal-anatomy.json';
import proceduralTechniqueData from '../../../../content/modules/procedural-technique.json';
import sonographicInterpretationData from '../../../../content/modules/sonographic-interpretation.json';
import stagingStrategyData from '../../../../content/modules/staging-strategy.json';

import { getKnobologyMedia, getStationMedia, getStationPrimaryMedia } from '@/content/media';
import type { EducationalModuleContent, ExplorerViewId, KnobologyControlId } from '@/content/types';

export interface RelatedImageAsset {
  id: string;
  label: string;
  note?: string;
  src: string;
}

export const knobologyAdvancedContent = knobologyAdvancedData as EducationalModuleContent;
export const mediastinalAnatomyContent = mediastinalAnatomyData as EducationalModuleContent;
export const sonographicInterpretationContent = sonographicInterpretationData as EducationalModuleContent;
export const proceduralTechniqueContent = proceduralTechniqueData as EducationalModuleContent;
export const stagingStrategyContent = stagingStrategyData as EducationalModuleContent;

export const stationEducationModules = [
  mediastinalAnatomyContent,
  sonographicInterpretationContent,
  proceduralTechniqueContent,
  stagingStrategyContent,
];

function resolveKnobologyImage(controlId: KnobologyControlId): RelatedImageAsset | null {
  const media = getKnobologyMedia(controlId);
  const src = media.comparisonImages?.[0];

  if (!src) {
    return null;
  }

  return {
    id: `knobology:${controlId}`,
    label: controlId.replace(/-/g, ' '),
    note: media.caption,
    src,
  };
}

function resolveStationImage(stationId: string, viewId: ExplorerViewId): RelatedImageAsset | null {
  const media = getStationMedia(stationId);
  const resolved = getStationPrimaryMedia(media, viewId);

  if (!resolved || resolved.kind !== 'image') {
    return null;
  }

  return {
    id: `station:${stationId}:${viewId}`,
    label: `${stationId} ${viewId === 'ct' ? 'CT' : viewId === 'bronchoscopy' ? 'bronchoscopy' : 'EBUS'}`,
    src: resolved.src,
  };
}

export function resolveEducationImages(imageIds: string[] | undefined): RelatedImageAsset[] {
  if (!imageIds?.length) {
    return [];
  }

  return imageIds.flatMap((imageId) => {
    const [kind, resourceId, variant] = imageId.split(':');

    if (kind === 'knobology' && resourceId) {
      const asset = resolveKnobologyImage(resourceId as KnobologyControlId);
      return asset ? [asset] : [];
    }

    if (kind === 'station' && resourceId && variant) {
      const asset = resolveStationImage(resourceId, variant as ExplorerViewId);
      return asset ? [asset] : [];
    }

    return [];
  });
}

```

## File: `apps/web/src/content/knobology-media.json`

```json
{
  "depth": {
    "comparisonImages": [
      "/media/knobology/ebus_depth_1.png",
      "/media/knobology/ebus_depth_2.png",
      "/media/knobology/ebus_depth_3.png",
      "/media/knobology/ebus_depth_4.png",
      "/media/knobology/ebus_depth_5.png"
    ],
    "caption": "Matched EBUS depth captures. Use the depth slider to step through real depth changes while the field angle stays consistent."
  },
  "gain": {
    "caption": "Add undergained, optimized, and overgained examples to replace the simulated frame."
  },
  "contrast": {
    "caption": "Add comparison frames showing how contrast changes edge separation."
  },
  "color-doppler": {
    "clips": [
      "/media/knobology/doppler_off.mp4",
      "/media/knobology/doppler_on.mp4"
    ],
    "caption": "Toggle between the Doppler-off and Doppler-on teaching clips to compare the grayscale view against visible flow."
  },
  "calipers": {
    "caption": "Add a measured still frame to demonstrate correct caliper placement."
  },
  "freeze": {
    "caption": "Add a frozen teaching frame that highlights the inspection step before measurement."
  },
  "save": {
    "caption": "Add a final saved-frame example once a canonical teaching capture is available."
  }
}

```

## File: `apps/web/src/content/knobology.ts`

```typescript
import knobologyData from '../../../../content/modules/knobology.json';

import { getKnobologyMedia } from '@/content/media';
import { getQuizQuestions } from '@/content/quiz';
import type { KnobologyControlId, KnobologyModuleContent } from '@/content/types';

export const knobologyContent = knobologyData as KnobologyModuleContent;

export const knobologyControlMeta: Record<
  KnobologyControlId,
  {
    icon: string;
    shortLabel: string;
  }
> = {
  depth: { icon: '↕', shortLabel: 'Depth' },
  gain: { icon: '☼', shortLabel: 'Gain' },
  contrast: { icon: '◐', shortLabel: 'Contrast' },
  'color-doppler': { icon: '◉', shortLabel: 'Doppler' },
  calipers: { icon: '⌟⌞', shortLabel: 'Calipers' },
  freeze: { icon: '⏸', shortLabel: 'Freeze' },
  save: { icon: '⬒', shortLabel: 'Save' },
};

export const knobologyReferenceCards = knobologyContent.quickReferenceCards.map((card) => ({
  ...card,
  media: getKnobologyMedia(card.id),
}));

export function getKnobologyQuizQuestions() {
  const questionIds = new Set(knobologyContent.quizQuestionIds);
  return getQuizQuestions('knobology').filter((question) => questionIds.has(question.id));
}

```

## File: `apps/web/src/content/lectures.json`

```json
[
  {
    "id": "lecture-01",
    "title": "Introduction to EBUS",
    "subtitle": "Procedure nuts and bolts",
    "week": "Week 1",
    "duration": "2h 15m",
    "poster": "/media/lectures/lecture-01/poster.jpg",
    "video": "/media/lectures/lecture-01/video.mp4",
    "topics": ["Equipment overview", "Scope anatomy", "Patient positioning", "Sedation considerations"],
    "status": "available"
  },
  {
    "id": "lecture-02",
    "title": "Mediastinal Anatomy",
    "subtitle": "IASLC station map and TNM-9 staging",
    "week": "Week 1",
    "duration": "2h 30m",
    "poster": "/media/lectures/lecture-02/poster.jpg",
    "video": "/media/lectures/lecture-02/video.mp4",
    "topics": ["IASLC lymph node map", "Station boundaries", "TNM-9 updates", "N-staging patterns"],
    "status": "available"
  },
  {
    "id": "lecture-03",
    "title": "Systematic EBUS Staging",
    "subtitle": "Approach to the mediastinum",
    "week": "Week 2",
    "duration": "1h 45m",
    "poster": "/media/lectures/lecture-03/poster.jpg",
    "video": "/media/lectures/lecture-03/video.mp4",
    "topics": ["Systematic survey technique", "Station identification by ultrasound", "Sampling order", "Adequate sampling criteria"],
    "status": "available"
  },
  {
    "id": "lecture-04",
    "title": "Histology and Tissue Adequacy",
    "subtitle": "Molecular testing essentials",
    "week": "Week 2",
    "duration": "1h 30m",
    "poster": "/media/lectures/lecture-04/poster.jpg",
    "video": "/media/lectures/lecture-04/video.mp4",
    "topics": ["ROSE basics", "Specimen handling", "Molecular markers", "Tissue triage"],
    "status": "available"
  },
  {
    "id": "lecture-05",
    "title": "Lymphoma and Non-Malignant Disease",
    "subtitle": "Beyond lung cancer staging",
    "week": "Week 3",
    "duration": "1h 15m",
    "poster": "/media/lectures/lecture-05/poster.jpg",
    "video": "/media/lectures/lecture-05/video.mp4",
    "topics": ["Lymphoma diagnosis by EBUS", "Sarcoidosis", "Infectious etiologies", "Flow cytometry considerations"],
    "status": "available"
  },
  {
    "id": "lecture-06",
    "title": "Advanced EBUS Techniques",
    "subtitle": "Elastography, miniforceps, cryobiopsy",
    "week": "Week 3",
    "duration": "2h 00m",
    "poster": "/media/lectures/lecture-06/poster.jpg",
    "video": "/media/lectures/lecture-06/video.mp4",
    "topics": ["Strain elastography", "EBUS miniforceps biopsy", "Cryo-EBUS", "EUS-B technique"],
    "status": "locked"
  },
  {
    "id": "lecture-07",
    "title": "Evidence Update 2026",
    "subtitle": "Guideline-based planning and case synthesis",
    "week": "Week 4",
    "duration": "1h 45m",
    "poster": "/media/lectures/lecture-07/poster.jpg",
    "video": "/media/lectures/lecture-07/video.mp4",
    "topics": ["AABIP guideline updates", "Case-based planning", "Pre-course knowledge check", "Liquid biopsy overview"],
    "status": "locked"
  }
]

```

## File: `apps/web/src/content/lectures.ts`

```typescript
import lecturesData from '@/content/lectures.json';
import type { LectureManifestItem } from '@/content/types';

export const lectureManifest = lecturesData as LectureManifestItem[];

export function getLectureById(lectureId: string): LectureManifestItem | undefined {
  return lectureManifest.find((lecture) => lecture.id === lectureId);
}

```

## File: `apps/web/src/content/media.test.ts`

```typescript
import { describe, expect, it } from 'vitest';

import { getStationMedia, getStationMediaVariants, getStationPrimaryMedia } from '@/content/media';

describe('getStationMediaVariants', () => {
  it('attaches EBUS annotation sets for configured variants', () => {
    const variants = getStationMediaVariants(getStationMedia('10R'), 'ultrasound');

    expect(variants).toHaveLength(1);
    expect(variants[0]?.annotations?.regions.length).toBeGreaterThan(0);
    expect(variants[0]?.annotationKey).toBe('EBUS_10R.png');
  });

  it('preserves multi-orientation CT variants for station explorer cards', () => {
    const variants = getStationMediaVariants(getStationMedia('7'), 'ct');

    expect(variants.map((variant) => variant.id)).toEqual(['axial', 'coronal', 'sagittal']);
    expect(variants.every((variant) => Boolean(variant.image))).toBe(true);
  });

  it('supports the split right interlobar media entries', () => {
    const superior = getStationMediaVariants(getStationMedia('11Rs'), 'ultrasound');
    const inferior = getStationMediaVariants(getStationMedia('11Ri'), 'ultrasound');

    expect(superior[0]?.annotationKey).toBe('EBUS_11Rs.png');
    expect(inferior[0]?.annotationKey).toBe('EBUS_11Ri.png');
  });

  it('falls back to legacy media fields when explicit variants are absent', () => {
    const media = {
      ctImage: '/legacy/ct.jpg',
      ctAnnotatedImage: '/legacy/ct-marked.jpg',
    };

    expect(getStationMediaVariants(media, 'ct')).toEqual([
      {
        id: 'primary',
        label: 'Primary',
        image: '/legacy/ct.jpg',
        revealImage: '/legacy/ct-marked.jpg',
      },
    ]);
    expect(getStationPrimaryMedia(media, 'ct')).toEqual({ kind: 'image', src: '/legacy/ct.jpg' });
  });
});

```

## File: `apps/web/src/content/media.ts`

```typescript
import ebusAnnotationsData from '@/content/ebus-annotations.json';
import knobologyMediaData from '@/content/knobology-media.json';
import stationMediaData from '@/content/station-media.json';
import type {
  ExplorerViewId,
  KnobologyControlId,
  KnobologyMediaEntry,
  StationAnnotationSet,
  StationMediaEntry,
  StationMediaVariant,
} from '@/content/types';

export const stationMedia = stationMediaData as Record<string, StationMediaEntry>;
export const knobologyMedia = knobologyMediaData as Record<KnobologyControlId, KnobologyMediaEntry>;
const ebusAnnotations = ebusAnnotationsData as unknown as Record<string, StationAnnotationSet>;

export function getStationMedia(stationId: string): StationMediaEntry {
  return stationMedia[stationId] ?? {};
}

export function getKnobologyMedia(controlId: KnobologyControlId): KnobologyMediaEntry {
  return knobologyMedia[controlId] ?? {};
}

function withAnnotations(variants: StationMediaVariant[] | undefined): StationMediaVariant[] {
  return (variants ?? []).map((variant) => {
    if (!variant.annotationKey) {
      return variant;
    }

    return {
      ...variant,
      annotations: ebusAnnotations[variant.annotationKey],
    };
  });
}

export function getStationMediaVariants(media: StationMediaEntry, viewId: ExplorerViewId): StationMediaVariant[] {
  if (viewId === 'ct') {
    if (media.ctVariants?.length) {
      return withAnnotations(media.ctVariants);
    }

    if (media.ctImage || media.ctAnnotatedImage) {
      return [
        {
          id: 'primary',
          label: 'Primary',
          image: media.ctImage ?? media.ctAnnotatedImage,
          revealImage: media.ctImage && media.ctAnnotatedImage ? media.ctAnnotatedImage : undefined,
        },
      ];
    }
  }

  if (viewId === 'bronchoscopy') {
    if (media.bronchoscopyVariants?.length) {
      return withAnnotations(media.bronchoscopyVariants);
    }

    if (media.bronchoscopyImage || media.bronchoscopyVideo) {
      return [
        {
          id: 'primary',
          label: 'Primary',
          image: media.bronchoscopyImage,
        },
      ];
    }
  }

  if (viewId === 'ultrasound') {
    if (media.ebusVariants?.length) {
      return withAnnotations(media.ebusVariants);
    }

    if (media.ebusImage || media.ebusVideo) {
      return [
        {
          id: 'primary',
          label: 'Primary',
          image: media.ebusImage,
        },
      ];
    }
  }

  return [];
}

export function getStationPrimaryMedia(
  media: StationMediaEntry,
  viewId: 'ct' | 'bronchoscopy' | 'ultrasound',
): { kind: 'image' | 'video'; src: string } | null {
  const variants = getStationMediaVariants(media, viewId);

  if (variants[0]?.image || variants[0]?.revealImage) {
    return { kind: 'image', src: variants[0].image ?? variants[0].revealImage ?? '' };
  }

  if (viewId === 'ct') {
    if (media.ctAnnotatedImage) {
      return { kind: 'image', src: media.ctAnnotatedImage };
    }

    if (media.ctImage) {
      return { kind: 'image', src: media.ctImage };
    }
  }

  if (viewId === 'bronchoscopy') {
    if (media.bronchoscopyVideo) {
      return { kind: 'video', src: media.bronchoscopyVideo };
    }

    if (media.bronchoscopyImage) {
      return { kind: 'image', src: media.bronchoscopyImage };
    }
  }

  if (viewId === 'ultrasound') {
    if (media.ebusVideo) {
      return { kind: 'video', src: media.ebusVideo };
    }

    if (media.ebusImage) {
      return { kind: 'image', src: media.ebusImage };
    }
  }

  return null;
}

```

## File: `apps/web/src/content/modules.ts`

```typescript
import modulesData from '../../../../content/modules/modules.json';

import type { AppModuleCard, ModuleContent } from '@/content/types';

export const moduleContent = modulesData as ModuleContent[];

export const homeModuleCards: AppModuleCard[] = [
  {
    id: 'stations',
    title: 'Mediastinal Stations',
    description: 'IASLC map, detail cards, flashcards, and correlated CT/bronchoscopy/EBUS views.',
    accent: 'var(--accent-cyan)',
    icon: '◎',
    path: '/stations',
  },
  {
    id: 'knobology',
    title: 'EBUS Knobology',
    description: 'Primer, fix-the-image labs, Doppler safety check, and a focused quiz.',
    accent: 'var(--accent-green)',
    icon: '◐',
    path: '/knobology',
  },
  {
    id: 'case-001',
    title: 'Case 001 3D Viewer',
    description:
      'Repo-native tri-planar CT, segmentation, markups, and shared patient-space targeting for case exploration.',
    accent: 'var(--accent-cyan)',
    icon: '◫',
    path: '/cases/case-001',
  },
  {
    id: 'lectures',
    title: 'Pre-Course Lectures',
    description: 'Manifest-driven lecture cards with poster and video slots ready for local media.',
    accent: 'var(--accent-gold)',
    icon: '▶',
    path: '/lectures',
  },
  {
    id: 'quiz',
    title: 'Knowledge Check',
    description: 'Mixed question bank across knobology, station recognition, and explorer logic.',
    accent: 'var(--accent-rose)',
    icon: '✎',
    path: '/quiz',
  },
];

export function getModuleById(moduleId: ModuleContent['id']): ModuleContent | undefined {
  return moduleContent.find((entry) => entry.id === moduleId);
}

```

## File: `apps/web/src/content/quiz.ts`

```typescript
import knobologyQuizData from '../../../../content/quizzes/knobology-advanced.json';
import mediastinalQuizData from '../../../../content/quizzes/mediastinal-anatomy.json';
import proceduralQuizData from '../../../../content/quizzes/procedural-technique.json';
import sonographicQuizData from '../../../../content/quizzes/sonographic-interpretation.json';
import stagingQuizData from '../../../../content/quizzes/staging-strategy.json';

import type { QuizQuestionContent, RootModuleId } from '@/content/types';

export const quizQuestions = [
  ...(knobologyQuizData as QuizQuestionContent[]),
  ...(mediastinalQuizData as QuizQuestionContent[]),
  ...(sonographicQuizData as QuizQuestionContent[]),
  ...(proceduralQuizData as QuizQuestionContent[]),
  ...(stagingQuizData as QuizQuestionContent[]),
];

export function getQuizQuestions(moduleId?: RootModuleId): QuizQuestionContent[] {
  if (!moduleId) {
    return quizQuestions;
  }

  return quizQuestions.filter((question) => question.moduleId === moduleId);
}

```

## File: `apps/web/src/content/station-map-layout.web.json`

```json
{
  "designWidth": 649,
  "designHeight": 791,
  "landmarks": [],
  "nodes": [
    {
      "stationId": "2R",
      "x": 201,
      "y": 112,
      "width": 48,
      "height": 48
    },
    {
      "stationId": "2L",
      "x": 343,
      "y": 94,
      "width": 48,
      "height": 48
    },
    {
      "stationId": "4R",
      "x": 223,
      "y": 295,
      "width": 48,
      "height": 48
    },
    {
      "stationId": "4L",
      "x": 315,
      "y": 310,
      "width": 48,
      "height": 48
    },
    {
      "stationId": "7",
      "x": 271,
      "y": 461,
      "width": 48,
      "height": 48
    },
    {
      "stationId": "10R",
      "x": 153,
      "y": 402,
      "width": 48,
      "height": 48
    },
    {
      "stationId": "10L",
      "x": 409,
      "y": 492,
      "width": 48,
      "height": 48
    },
    {
      "stationId": "11Rs",
      "x": 73,
      "y": 474,
      "width": 48,
      "height": 48
    },
    {
      "stationId": "11Ri",
      "x": 83,
      "y": 571,
      "width": 48,
      "height": 48
    },
    {
      "stationId": "11L",
      "x": 517,
      "y": 578,
      "width": 48,
      "height": 48
    }
  ]
}

```

## File: `apps/web/src/content/station-media.json`

```json
{
  "2R": {
    "ctVariants": [
      {
        "id": "axial",
        "label": "Axial",
        "image": "/media/stations/2R/ct/axial-marked.jpg",
        "note": "Only a marked axial CT source was provided for 2R."
      },
      {
        "id": "coronal",
        "label": "Coronal",
        "image": "/media/stations/2R/ct/coronal-marked.jpg",
        "note": "Only a marked coronal CT source was provided for 2R."
      },
      {
        "id": "sagittal",
        "label": "Sagittal",
        "image": "/media/stations/2R/ct/sagittal-marked.jpg",
        "note": "Only a marked sagittal CT source was provided for 2R."
      }
    ],
    "bronchoscopyVariants": [
      {
        "id": "shared",
        "label": "Airway",
        "image": "/media/stations/2R/bronchoscopy/view.png",
        "revealImage": "/media/stations/2R/bronchoscopy/view-marked.png"
      }
    ],
    "ebusVariants": [
      {
        "id": "primary",
        "label": "EBUS",
        "image": "/media/stations/2R/ultrasound/view.jpg",
        "annotationKey": "EBUS_2R.jpg"
      }
    ]
  },
  "2L": {
    "ctVariants": [
      {
        "id": "axial",
        "label": "Axial",
        "image": "/media/stations/2L/ct/axial.jpg",
        "revealImage": "/media/stations/2L/ct/axial-marked.jpg"
      },
      {
        "id": "coronal",
        "label": "Coronal",
        "image": "/media/stations/2L/ct/coronal.jpg",
        "revealImage": "/media/stations/2L/ct/coronal-marked.jpg"
      },
      {
        "id": "sagittal",
        "label": "Sagittal",
        "image": "/media/stations/2L/ct/sagittal.jpg",
        "revealImage": "/media/stations/2L/ct/sagittal-marked.jpg"
      }
    ],
    "bronchoscopyVariants": [
      {
        "id": "shared",
        "label": "Airway",
        "image": "/media/stations/2L/bronchoscopy/view.png",
        "revealImage": "/media/stations/2L/bronchoscopy/view-marked.png"
      }
    ],
    "ebusVariants": [
      {
        "id": "primary",
        "label": "EBUS",
        "image": "/media/stations/2L/ultrasound/view.png",
        "annotationKey": "EBUS_2L.png"
      }
    ]
  },
  "4R": {
    "ctVariants": [
      {
        "id": "axial",
        "label": "Axial",
        "image": "/media/stations/4R/ct/axial-marked.jpg",
        "note": "Only a marked axial CT source was provided for 4R."
      },
      {
        "id": "coronal",
        "label": "Coronal",
        "image": "/media/stations/4R/ct/coronal-marked.jpg",
        "note": "Only a marked coronal CT source was provided for 4R."
      },
      {
        "id": "sagittal",
        "label": "Sagittal",
        "image": "/media/stations/4R/ct/sagittal-marked.jpg",
        "note": "Only a marked sagittal CT source was provided for 4R."
      }
    ],
    "bronchoscopyVariants": [
      {
        "id": "primary",
        "label": "Airway",
        "image": "/media/stations/4R/bronchoscopy/view.png",
        "revealImage": "/media/stations/4R/bronchoscopy/view-marked.png"
      }
    ],
    "ebusVariants": [
      {
        "id": "primary",
        "label": "EBUS",
        "image": "/media/stations/4R/ultrasound/view.png",
        "annotationKey": "EBUS_4R.png"
      }
    ]
  },
  "4L": {
    "ctVariants": [
      {
        "id": "axial",
        "label": "Axial",
        "image": "/media/stations/4L/ct/axial.jpg",
        "revealImage": "/media/stations/4L/ct/axial-marked.jpg"
      },
      {
        "id": "coronal",
        "label": "Coronal",
        "image": "/media/stations/4L/ct/coronal.jpg",
        "revealImage": "/media/stations/4L/ct/coronal-marked.jpg"
      },
      {
        "id": "sagittal",
        "label": "Sagittal",
        "image": "/media/stations/4L/ct/sagittal.jpg",
        "revealImage": "/media/stations/4L/ct/sagittal-marked.jpg"
      }
    ],
    "bronchoscopyVariants": [
      {
        "id": "primary",
        "label": "Airway",
        "image": "/media/stations/4L/bronchoscopy/view.png",
        "revealImage": "/media/stations/4L/bronchoscopy/view-marked.png"
      }
    ],
    "ebusVariants": [
      {
        "id": "primary",
        "label": "EBUS",
        "image": "/media/stations/4L/ultrasound/view.png",
        "annotationKey": "EBUS_4L.png"
      }
    ]
  },
  "7": {
    "ctVariants": [
      {
        "id": "axial",
        "label": "Axial",
        "image": "/media/stations/7/ct/axial.jpg",
        "revealImage": "/media/stations/7/ct/axial-marked.jpg"
      },
      {
        "id": "coronal",
        "label": "Coronal",
        "image": "/media/stations/7/ct/coronal.jpg",
        "revealImage": "/media/stations/7/ct/coronal-marked.jpg"
      },
      {
        "id": "sagittal",
        "label": "Sagittal",
        "image": "/media/stations/7/ct/sagittal.jpg",
        "revealImage": "/media/stations/7/ct/sagittal-marked.jpg"
      }
    ],
    "bronchoscopyVariants": [
      {
        "id": "primary",
        "label": "Airway",
        "image": "/media/stations/7/bronchoscopy/view.png",
        "revealImage": "/media/stations/7/bronchoscopy/view-marked.png"
      }
    ],
    "ebusVariants": [
      {
        "id": "primary",
        "label": "EBUS",
        "image": "/media/stations/7/ultrasound/view.jpg",
        "annotationKey": "EBUS_7.jpg"
      }
    ]
  },
  "10R": {
    "ctVariants": [
      {
        "id": "axial",
        "label": "Axial",
        "image": "/media/stations/10R/ct/axial.jpg",
        "revealImage": "/media/stations/10R/ct/axial-marked.jpg"
      },
      {
        "id": "coronal",
        "label": "Coronal",
        "image": "/media/stations/10R/ct/coronal.jpg",
        "revealImage": "/media/stations/10R/ct/coronal-marked.jpg"
      },
      {
        "id": "sagittal",
        "label": "Sagittal",
        "image": "/media/stations/10R/ct/sagittal.jpg",
        "revealImage": "/media/stations/10R/ct/sagittal-marked.jpg"
      }
    ],
    "bronchoscopyVariants": [
      {
        "id": "primary",
        "label": "Airway",
        "image": "/media/stations/10R/bronchoscopy/view.png",
        "revealImage": "/media/stations/10R/bronchoscopy/view-marked.png"
      }
    ],
    "ebusVariants": [
      {
        "id": "primary",
        "label": "EBUS",
        "image": "/media/stations/10R/ultrasound/view.png",
        "annotationKey": "EBUS_10R.png"
      }
    ]
  },
  "10L": {
    "ctVariants": [
      {
        "id": "axial",
        "label": "Axial",
        "image": "/media/stations/10L/ct/axial.jpg",
        "revealImage": "/media/stations/10L/ct/axial-marked.jpg"
      },
      {
        "id": "coronal",
        "label": "Coronal",
        "image": "/media/stations/10L/ct/coronal.jpg",
        "revealImage": "/media/stations/10L/ct/coronal-marked.jpg"
      },
      {
        "id": "sagittal",
        "label": "Sagittal",
        "image": "/media/stations/10L/ct/sagittal.jpg",
        "revealImage": "/media/stations/10L/ct/sagittal-marked.jpg"
      }
    ],
    "bronchoscopyVariants": [
      {
        "id": "primary",
        "label": "Airway",
        "image": "/media/stations/10L/bronchoscopy/view.png",
        "revealImage": "/media/stations/10L/bronchoscopy/view-marked.png"
      }
    ],
    "ebusVariants": [
      {
        "id": "primary",
        "label": "EBUS",
        "image": "/media/stations/10L/ultrasound/view.png",
        "annotationKey": "EBUS_10L.png"
      }
    ]
  },
  "11Rs": {
    "ctVariants": [
      {
        "id": "axial",
        "label": "Axial",
        "image": "/media/stations/11R/ct/axial-marked.jpg",
        "note": "Only a marked axial CT source was provided for the 11Rs set."
      },
      {
        "id": "coronal",
        "label": "Coronal",
        "image": "/media/stations/11R/ct/coronal-marked.jpg",
        "note": "Only a marked coronal CT source was provided for the 11Rs set."
      },
      {
        "id": "sagittal",
        "label": "Sagittal",
        "image": "/media/stations/11R/ct/sagittal-marked.jpg",
        "note": "Only a marked sagittal CT source was provided for the 11Rs set."
      }
    ],
    "bronchoscopyVariants": [
      {
        "id": "11rs",
        "label": "Airway",
        "image": "/media/stations/11R/bronchoscopy/11rs.png",
        "revealImage": "/media/stations/11R/bronchoscopy/11rs-marked.png"
      }
    ],
    "ebusVariants": [
      {
        "id": "11rs",
        "label": "EBUS",
        "image": "/media/stations/11R/ultrasound/11rs.png",
        "annotationKey": "EBUS_11Rs.png"
      }
    ],
    "notes": [
      "The supplied right interlobar asset set includes a specific 11Rs example."
    ]
  },
  "11Ri": {
    "ctVariants": [
      {
        "id": "axial",
        "label": "Axial",
        "image": "/media/stations/11R/ct/axial-marked.jpg",
        "note": "Only a marked axial CT source was provided for the 11Ri set."
      },
      {
        "id": "coronal",
        "label": "Coronal",
        "image": "/media/stations/11R/ct/coronal-marked.jpg",
        "note": "Only a marked coronal CT source was provided for the 11Ri set."
      },
      {
        "id": "sagittal",
        "label": "Sagittal",
        "image": "/media/stations/11R/ct/sagittal-marked.jpg",
        "note": "Only a marked sagittal CT source was provided for the 11Ri set."
      }
    ],
    "bronchoscopyVariants": [
      {
        "id": "11ri",
        "label": "Airway",
        "image": "/media/stations/11R/bronchoscopy/11ri.png",
        "revealImage": "/media/stations/11R/bronchoscopy/11ri-marked.png"
      }
    ],
    "ebusVariants": [
      {
        "id": "11ri",
        "label": "EBUS",
        "image": "/media/stations/11R/ultrasound/11ri.png",
        "annotationKey": "EBUS_11Ri.png"
      }
    ],
    "notes": [
      "The supplied right interlobar asset set includes a specific 11Ri example."
    ]
  },
  "11L": {
    "ctVariants": [
      {
        "id": "axial",
        "label": "Axial",
        "image": "/media/stations/11L/ct/axial.jpg",
        "revealImage": "/media/stations/11L/ct/axial-marked.jpg"
      },
      {
        "id": "coronal",
        "label": "Coronal",
        "image": "/media/stations/11L/ct/coronal.jpg",
        "revealImage": "/media/stations/11L/ct/coronal-marked.jpg"
      },
      {
        "id": "sagittal",
        "label": "Sagittal",
        "image": "/media/stations/11L/ct/sagittal.jpg",
        "revealImage": "/media/stations/11L/ct/sagittal-marked.jpg"
      }
    ],
    "bronchoscopyVariants": [
      {
        "id": "primary",
        "label": "Airway",
        "image": "/media/stations/11L/bronchoscopy/view.png",
        "revealImage": "/media/stations/11L/bronchoscopy/view-marked.png"
      }
    ],
    "notes": [
      "No EBUS image for 11L was present in the supplied ultrasound folder."
    ]
  }
}

```

## File: `apps/web/src/content/stations.ts`

```typescript
import stationMapContentData from '../../../../content/modules/station-map.json';
import stationExplorerContentData from '../../../../content/modules/station-explorer.json';
import stationCorrelationsData from '../../../../content/stations/station-correlations.json';
import stationsData from '../../../../content/stations/core-stations.json';

import { getStationMedia } from '@/content/media';
import stationMapLayoutData from '@/content/station-map-layout.web.json';
import type {
  CombinedStation,
  ExplorerViewId,
  StationContent,
  StationCorrelationContent,
  StationMapConnection,
  StationMapLayout,
  StationMapModuleContent,
  StationExplorerModuleContent,
  StationZoneKey,
  ZoneTheme,
} from '@/content/types';

const stationMapLayout = stationMapLayoutData as StationMapLayout;
const stationMapContent = stationMapContentData as StationMapModuleContent;
const stationExplorerContent = stationExplorerContentData as StationExplorerModuleContent;
const stations = stationsData as StationContent[];
const stationCorrelations = stationCorrelationsData as StationCorrelationContent[];

export const zoneThemes: Record<StationZoneKey, ZoneTheme> = {
  upper: {
    bg: '#122a40',
    border: '#2d6ca3',
    text: '#90ccff',
    label: 'Upper Mediastinal',
  },
  subcarinal: {
    bg: '#123429',
    border: '#2d8a6a',
    text: '#88e0bd',
    label: 'Subcarinal',
  },
  hilar: {
    bg: '#36213b',
    border: '#8861a7',
    text: '#d6afe8',
    label: 'Hilar / Interlobar',
  },
};

export const stationConnections: StationMapConnection[] = [
  { from: '2R', to: '4R' },
  { from: '2L', to: '4L' },
  { from: '4R', to: '7' },
  { from: '4L', to: '7' },
  { from: '4R', to: '10R' },
  { from: '4L', to: '10L' },
  { from: '7', to: '10R' },
  { from: '7', to: '10L' },
  { from: '10R', to: '11Rs' },
  { from: '10R', to: '11Ri' },
  { from: '10L', to: '11L' },
];

function normalizeZone(zone: string): StationZoneKey {
  const lower = zone.toLowerCase();

  if (lower.includes('subcarinal')) {
    return 'subcarinal';
  }

  if (lower.includes('hilar')) {
    return 'hilar';
  }

  return 'upper';
}

function getNodeByStationId(stationId: string) {
  return stationMapLayout.nodes.find((node) => node.stationId === stationId);
}

function getCorrelationByStationId(stationId: string) {
  return stationCorrelations.find((entry) => entry.stationId === stationId);
}

export const combinedStations: CombinedStation[] = stations.flatMap((station) => {
  const mapNode = getNodeByStationId(station.id);
  const correlation = getCorrelationByStationId(station.id);

  if (!mapNode || !correlation) {
    return [];
  }

  return [
    {
      ...station,
      zoneKey: normalizeZone(station.zone),
      aliases: correlation.aliases,
      landmarkChecklist: correlation.landmarkChecklist,
      mapNode,
      views: correlation.views,
      quizItems: correlation.quizItems,
      media: getStationMedia(station.id),
    },
  ];
});

export function getStationMapContent(): StationMapModuleContent {
  return stationMapContent;
}

export function getStationExplorerContent(): StationExplorerModuleContent {
  return stationExplorerContent;
}

export function getStationMapLayout(): StationMapLayout {
  return stationMapLayout;
}

export function getStations(): CombinedStation[] {
  return combinedStations;
}

export function getStationById(stationId: string): CombinedStation | undefined {
  return combinedStations.find((station) => station.id === stationId);
}

export function getStationLabel(stationId: string): string {
  return getStationById(stationId)?.displayName ?? stationId;
}

export function getViewLabel(viewId: ExplorerViewId): string {
  if (viewId === 'ct') {
    return 'CT';
  }

  if (viewId === 'bronchoscopy') {
    return 'Bronchoscopy';
  }

  return 'EBUS';
}

```

## File: `apps/web/src/content/types.ts`

```typescript
export type RootModuleId = 'knobology' | 'station-map' | 'station-explorer' | 'case-3d-explorer';
export type AppRouteId = 'home' | 'stations' | 'knobology' | 'lectures' | 'quiz' | 'case-001';
export type StationZoneKey = 'upper' | 'subcarinal' | 'hilar';
export type ExplorerViewId = 'ct' | 'bronchoscopy' | 'ultrasound';
export type LessonSectionKind =
  | 'overview'
  | 'learning-objectives'
  | 'core-concept'
  | 'landmarks'
  | 'pitfall'
  | 'clinical-pearl'
  | 'technique'
  | 'staging'
  | 'artifact'
  | 'sonographic-pattern'
  | 'case';
export type QuizQuestionType =
  | 'single-best-answer'
  | 'multi-select'
  | 'ordering'
  | 'image-interpretation'
  | 'case-vignette';
export type QuizDifficulty = 'basic' | 'intermediate' | 'advanced';
export type StationAccessProfile = 'EBUS' | 'EUS-B' | 'Both' | 'Visualized only';
export type KnobologyControlId =
  | 'depth'
  | 'gain'
  | 'contrast'
  | 'color-doppler'
  | 'calipers'
  | 'freeze'
  | 'save';

export interface ModuleContent {
  id: RootModuleId;
  slug: string;
  shortTitle: string;
  title: string;
  summary: string;
  overview: string;
  estimatedMinutes: number;
  route: string;
  goals: string[];
  plannedExperiences: string[];
  relatedStationIds: string[];
}

export interface QuizQuestionOption {
  id: string;
  label: string;
  rationale: string;
}

export interface QuizQuestionContent {
  id: string;
  moduleId: RootModuleId;
  prompt: string;
  type: QuizQuestionType;
  options: QuizQuestionOption[];
  correctOptionIds: string[];
  explanation: string;
  difficulty: QuizDifficulty;
  tags: string[];
  caseTitle?: string;
  caseSummary?: string;
}

export interface CourseInfoQuickFact {
  value: string;
  label: string;
}

export interface CourseInfoAgendaItem {
  time: string;
  title: string;
  detail: string;
}

export interface CourseInfoContent {
  courseTitle: string;
  hostLine: string;
  hostDepartment: string;
  dateLabel: string;
  timeLabel: string;
  venueName: string;
  venueDetail: string;
  audience: string;
  overview: string;
  quickFacts: CourseInfoQuickFact[];
  courseDirectors: string[];
  facultySummary: string;
  formatHighlights: string[];
  prepWindow: string;
  prepTopics: string[];
  liveDayAgenda: CourseInfoAgendaItem[];
  addressLines: string[];
  parkingNote: string;
  travelNote: string;
}

export interface StationAssetKeys {
  map: string;
  ct: string;
  bronchoscopy: string;
  ultrasound: string;
}

export interface LessonCaseVignette {
  title: string;
  scenario: string;
  prompt: string;
  takeaway: string;
}

export interface LessonSection {
  id: string;
  title: string;
  kind: LessonSectionKind;
  body: string;
  bullets?: string[];
  imageIds?: string[];
  relatedStationIds?: string[];
  pearl?: string;
  pitfall?: string;
  checklist?: string[];
  caseVignette?: LessonCaseVignette;
}

export interface EducationalModuleContent {
  id: string;
  title: string;
  summary: string;
  learningObjectives: string[];
  sections: LessonSection[];
}

export interface StationBoundaryDefinition {
  superior: string;
  inferior: string;
  medial?: string;
  lateral?: string;
  anterior?: string;
  posterior?: string;
}

export interface StationStagingImplication {
  ipsilateral: string;
  contralateral: string;
  note: string;
}

export interface StationPerspectiveChecklist {
  ct: string[];
  bronchoscopy: string[];
  ultrasound: string[];
}

export interface StationContent {
  id: string;
  displayName: string;
  shortLabel: string;
  iaslcName: string;
  zone: string;
  laterality: string;
  description: string;
  accessNotes: string;
  accessProfile: StationAccessProfile;
  bestEbusWindow: string;
  landmarkVessels: string[];
  boundaryDefinition: StationBoundaryDefinition;
  boundaryNotes: string[];
  nStageImplication: StationStagingImplication;
  clinicalImportance: string;
  memoryCues: string[];
  confusionPairs: string[];
  commonConfusionPair: string;
  relatedStationIds: string[];
  whatYouSee: StationPerspectiveChecklist;
  safePunctureConsiderations: string[];
  stagingChangeFinding: string;
  assetKeys: StationAssetKeys;
}

export interface StationMapLandmark {
  id: string;
  kind: 'tube' | 'branch' | 'hub';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label: string;
}

export interface StationMapNode {
  stationId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StationMapLayout {
  designWidth: number;
  designHeight: number;
  landmarks: StationMapLandmark[];
  nodes: StationMapNode[];
}

export interface StationMapQuizRound {
  id: string;
  stationId: string;
  prompt: string;
  hint: string;
  explanation: string;
}

export interface StationMapModuleContent {
  introSections: Array<{
    id: string;
    title: string;
    summary: string;
    takeaway: string;
  }>;
  mapTips: string[];
  flashcardPrompt: string;
  quizRounds: StationMapQuizRound[];
  reviewChecklist: string[];
  extensionNote: string;
}

export interface ExplorerViewContent {
  title: string;
  orientation: string;
  focusLabel: string;
  caption: string;
  visualAnchor:
    | 'upper-left'
    | 'upper-right'
    | 'middle-left'
    | 'middle-right'
    | 'center'
    | 'lower-left'
    | 'lower-right';
}

export interface StationRecognitionQuizItem {
  id: string;
  viewId: ExplorerViewId;
  prompt: string;
  optionIds: string[];
  explanation: string;
}

export interface StationCorrelationContent {
  stationId: string;
  aliases: string[];
  landmarkChecklist: string[];
  views: Record<ExplorerViewId, ExplorerViewContent>;
  quizItems: StationRecognitionQuizItem[];
}

export interface StationExplorerModuleContent {
  introSections: Array<{
    id: string;
    title: string;
    summary: string;
    takeaway: string;
  }>;
  reviewPrompts: string[];
  extensionNote: string;
}

export interface KnobologyLessonSection {
  id: string;
  title: string;
  summary: string;
  bestMove: string;
  pitfall: string;
}

export interface KnobologyCorrectionExercise {
  id: string;
  title: string;
  symptom: string;
  instructions: string;
  focusControl: 'depth' | 'gain' | 'contrast';
  start: {
    depth: number;
    gain: number;
    contrast: number;
  };
  target: {
    depth: number;
    gain: number;
    contrast: number;
  };
  successMessage: string;
}

export interface KnobologyReferenceCard {
  id: KnobologyControlId;
  title: string;
  whenToUse: string;
  whatChanges: string;
  noviceTrap: string;
}

export interface KnobologyDopplerLab {
  title: string;
  brief: string;
  prompt: string;
  safePathId: string;
  paths: Array<{
    id: string;
    label: string;
    description: string;
  }>;
}

export interface KnobologyModuleContent {
  primerSections: KnobologyLessonSection[];
  controlLabExercises: KnobologyCorrectionExercise[];
  dopplerLab: KnobologyDopplerLab;
  quickReferenceCards: KnobologyReferenceCard[];
  quizQuestionIds: string[];
}

export interface StationAnnotationRegion {
  label: string;
  points: Array<[number, number]>;
}

export interface StationAnnotationSet {
  width: number;
  height: number;
  regions: StationAnnotationRegion[];
}

export interface StationMediaVariant {
  id: string;
  label: string;
  image?: string;
  revealImage?: string;
  note?: string;
  annotationKey?: string;
  annotations?: StationAnnotationSet;
}

export interface StationMediaEntry {
  ctVariants?: StationMediaVariant[];
  bronchoscopyVariants?: StationMediaVariant[];
  ebusVariants?: StationMediaVariant[];
  ctImage?: string;
  ctAnnotatedImage?: string;
  bronchoscopyImage?: string;
  bronchoscopyVideo?: string;
  ebusImage?: string;
  ebusVideo?: string;
  notes?: string[];
}

export interface KnobologyMediaEntry {
  comparisonImages?: string[];
  clips?: string[];
  caption?: string;
}

export interface LectureManifestItem {
  id: string;
  title: string;
  subtitle: string;
  week: string;
  duration: string;
  poster?: string;
  video?: string;
  embedUrl?: string;
  topics: string[];
  status: 'available' | 'locked';
}

export interface NavigationItem {
  id: AppRouteId;
  label: string;
  icon: string;
  path: string;
}

export interface AppModuleCard {
  id: AppRouteId;
  title: string;
  description: string;
  accent: string;
  icon: string;
  path: string;
}

export interface ZoneTheme {
  bg: string;
  border: string;
  text: string;
  label: string;
}

export interface CombinedStation extends StationContent {
  zoneKey: StationZoneKey;
  aliases: string[];
  landmarkChecklist: string[];
  mapNode: StationMapNode;
  views: Record<ExplorerViewId, ExplorerViewContent>;
  quizItems: StationRecognitionQuizItem[];
  media: StationMediaEntry;
}

export interface StationMapConnection {
  from: string;
  to: string;
}

export interface CombinedCaseManifest {
  caseId: string;
  title: string;
  description: string;
  assets: {
    glbFile: string;
    ctVolumeFile: string;
    segmentationFile: string;
  };
  sliceSeries: Record<
    'axial' | 'coronal' | 'sagittal',
    {
      folder: string;
      count: number;
      displayOrientation: string;
    }
  >;
  stations: Array<{
    id: string;
    label: string;
    groupLabel: string;
    targetIds: string[];
    primaryTargetId: string;
  }>;
}

```

## File: `apps/web/src/features/case3d/case001.ts`

```typescript
import case001RuntimeData from '../../../../../content/cases/case_001.runtime.json';
import case001CtUrl from '../../../../../model/case_001_ct.nrrd?url';
import case001SegmentationUrl from '../../../../../model/case_001_segmentation.nrrd?url';
import case001GlbUrl from '../../../../../model/case_001.glb?url';

import type { RuntimeCaseManifest } from '../../../../../features/case3d/types';

export const case001Runtime = case001RuntimeData as unknown as RuntimeCaseManifest;

export const case001AssetUrls = {
  ct: case001CtUrl,
  segmentation: case001SegmentationUrl,
  glb: case001GlbUrl,
} as const;

```

## File: `apps/web/src/features/case3d/Case3DRoute.tsx`

```typescript
import { case001Runtime } from './case001';
import { Case3DViewer } from './Case3DViewer';

export function Case3DRoute() {
  return <Case3DViewer manifest={case001Runtime} />;
}

```

## File: `apps/web/src/features/case3d/Case3DViewer.tsx`

```typescript
import { useMemo, useReducer, useState } from 'react';

import { axisNameToIndex } from '../../../../../features/case3d/patient-space';
import type { CasePlane, RuntimeCaseManifest } from '../../../../../features/case3d/types';
import { useCaseOverlay } from './useCaseOverlay';
import { useCasePlanes } from './useCasePlanes';
import { useCaseTargets, getTargetLabel } from './useCaseTargets';
import { useCaseVolume } from './useCaseVolume';
import { VtkViewport } from './VtkViewport';
import { caseViewerReducer, createInitialViewerState } from './viewerState';
import { getCrosshairWorld } from './vtk/coordinateTransforms';

interface Case3DViewerProps {
  manifest: RuntimeCaseManifest;
}

const PLANE_LABELS: Record<CasePlane, string> = {
  axial: 'Axial',
  coronal: 'Coronal',
  sagittal: 'Sagittal',
};

function getPlaneAxisSize(manifest: RuntimeCaseManifest, plane: CasePlane) {
  return manifest.volumeGeometry.sizes[axisNameToIndex(manifest.volumeGeometry.axisMap[plane])];
}

function SliceCard({
  manifest,
  plane,
  planeIndex,
  visible,
  crosshair,
  volumeLoaded,
  onPlaneIndexChange,
  onToggleVisibility,
}: {
  manifest: RuntimeCaseManifest;
  plane: CasePlane;
  planeIndex: number;
  visible: boolean;
  crosshair: { u: number; v: number };
  volumeLoaded: ReturnType<typeof useCaseVolume>['ct'];
  onPlaneIndexChange: (value: number) => void;
  onToggleVisibility: (value: boolean) => void;
}) {
  const axisSize = getPlaneAxisSize(manifest, plane);

  return (
    <article className="case3d-panel">
      <div className="case3d-panel__header">
        <div>
          <div className="eyebrow">Orthogonal CT</div>
          <h3>{PLANE_LABELS[plane]}</h3>
        </div>
        <label className="case3d-toggle">
          <input checked={visible} onChange={(event) => onToggleVisibility(event.target.checked)} type="checkbox" />
          <span>{visible ? 'Visible' : 'Hidden'}</span>
        </label>
      </div>
      <div className="case3d-panel__viewport">
        {volumeLoaded ? (
          <>
            <VtkViewport
              className="case-vtk-viewport"
              manifest={manifest}
              mode="slice"
              plane={plane}
              planeIndex={planeIndex}
              visible={visible}
              volume={volumeLoaded}
            />
            <div aria-hidden className="case3d-crosshair-overlay">
              <span className="case3d-crosshair-overlay__vertical" style={{ left: `${crosshair.u * 100}%` }} />
              <span className="case3d-crosshair-overlay__horizontal" style={{ top: `${crosshair.v * 100}%` }} />
            </div>
          </>
        ) : (
          <div className="case3d-panel__placeholder">Loading CT volume…</div>
        )}
      </div>
      <label className="case3d-slider">
        <span>
          Slice {planeIndex + 1} / {axisSize}
        </span>
        <input
          max={axisSize - 1}
          min={0}
          onChange={(event) => onPlaneIndexChange(Number(event.target.value))}
          type="range"
          value={planeIndex}
        />
      </label>
    </article>
  );
}

export function Case3DViewer({ manifest }: Case3DViewerProps) {
  const [state, dispatch] = useReducer(caseViewerReducer, manifest, createInitialViewerState);
  const [resetCameraToken, setResetCameraToken] = useState(0);
  const volumeState = useCaseVolume();
  const { selectedStation, selectedTarget, stationTargets, landmarkTargets } = useCaseTargets(
    manifest,
    state.selectedStationId,
    state.selectedTargetId,
  );
  const crosshairWorld = useMemo(() => getCrosshairWorld(manifest, state.crosshairVoxel), [manifest, state.crosshairVoxel]);
  const { planeIndices, crosshairUv } = useCasePlanes(manifest, state.crosshairVoxel, crosshairWorld);
  const { selectedSegmentIds, visibleSegments } = useCaseOverlay(manifest, state.overlayGroups, state.selectedTargetId);
  const selectedSegments = useMemo(
    () => manifest.segmentation.segments.filter((segment) => selectedSegmentIds.has(segment.id)),
    [manifest.segmentation.segments, selectedSegmentIds],
  );

  const stationTargetOptions = stationTargets.length > 0 ? stationTargets : [selectedTarget];

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Case 001</div>
            <h2>Patient-space tri-planar viewer</h2>
          </div>
        </div>
        <p>
          CT geometry is the runtime truth, segmentation is the anatomy alignment truth, and markups drive the target
          list and crosshair. The GLB remains optional polish on top of that shared patient-space scene.
        </p>
        <div className="mini-card-grid">
          <article className="mini-card">
            <strong>{manifest.stations.length}</strong>
            <p>Stations</p>
          </article>
          <article className="mini-card">
            <strong>{manifest.targets.length}</strong>
            <p>Targets from markups</p>
          </article>
          <article className="mini-card">
            <strong>{manifest.segmentation.segments.length}</strong>
            <p>Segmentation segments</p>
          </article>
          <article className="mini-card">
            <strong>{selectedTarget.displayLabel}</strong>
            <p>Current target</p>
          </article>
        </div>
      </section>

      <section className="section-card case3d-layout">
        <div className="case3d-sidebar">
          <article className="case3d-panel case3d-panel--controls">
            <div className="case3d-panel__header">
              <div>
                <div className="eyebrow">Targeting</div>
                <h3>Selectors</h3>
              </div>
            </div>
            <label className="case3d-select">
              <span>Station</span>
              <select
                onChange={(event) => {
                  const station = manifest.stations.find((entry) => entry.id === event.target.value) ?? manifest.stations[0];
                  const target =
                    manifest.targets.find((entry) => entry.id === station.primaryTargetId) ??
                    manifest.targets.find((entry) => entry.stationId === station.id) ??
                    manifest.targets[0];

                  dispatch({
                    type: 'select-station',
                    manifest,
                    stationId: station.id,
                    targetId: target.id,
                    world: target.world.position,
                  });
                }}
                value={selectedStation.id}>
                {manifest.stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="case3d-select">
              <span>Target</span>
              <select
                onChange={(event) => {
                  const target = manifest.targets.find((entry) => entry.id === event.target.value) ?? manifest.targets[0];

                  dispatch({
                    type: 'select-target',
                    manifest,
                    stationId: target.stationId ?? selectedStation.id,
                    targetId: target.id,
                    world: target.world.position,
                  });
                }}
                value={selectedTarget.id}>
                {stationTargetOptions.map((target) => (
                  <option key={target.id} value={target.id}>
                    {getTargetLabel(target)}
                  </option>
                ))}
                {landmarkTargets.length > 0 ? <option disabled>──────────</option> : null}
                {landmarkTargets.map((target) => (
                  <option key={target.id} value={target.id}>
                    Landmark · {target.displayLabel}
                  </option>
                ))}
              </select>
            </label>
            <div className="stack-list">
              <article className="mini-card">
                <strong>Crosshair</strong>
                <p>
                  {crosshairWorld[0].toFixed(1)}, {crosshairWorld[1].toFixed(1)}, {crosshairWorld[2].toFixed(1)} mm
                </p>
              </article>
              <article className="mini-card">
                <strong>Matched segments</strong>
                <p>{selectedSegments.length > 0 ? selectedSegments.map((segment) => segment.name).join(', ') : 'None'}</p>
              </article>
            </div>
          </article>

          <article className="case3d-panel case3d-panel--controls">
            <div className="case3d-panel__header">
              <div>
                <div className="eyebrow">Overlay</div>
                <h3>Segmentation and GLB</h3>
              </div>
            </div>
            <label className="case3d-toggle">
              <input
                checked={state.overlayGroups.allAnatomy}
                onChange={(event) => dispatch({ type: 'set-overlay-group', key: 'allAnatomy', value: event.target.checked })}
                type="checkbox"
              />
              <span>All anatomy</span>
            </label>
            <label className="case3d-toggle">
              <input
                checked={state.overlayGroups.airway}
                onChange={(event) => dispatch({ type: 'set-overlay-group', key: 'airway', value: event.target.checked })}
                type="checkbox"
              />
              <span>Airway</span>
            </label>
            <label className="case3d-toggle">
              <input
                checked={state.overlayGroups.vessels}
                onChange={(event) => dispatch({ type: 'set-overlay-group', key: 'vessels', value: event.target.checked })}
                type="checkbox"
              />
              <span>Vessels and adjacent anatomy</span>
            </label>
            <label className="case3d-toggle">
              <input
                checked={state.overlayGroups.nodes}
                onChange={(event) => dispatch({ type: 'set-overlay-group', key: 'nodes', value: event.target.checked })}
                type="checkbox"
              />
              <span>Nodes</span>
            </label>
            <label className="case3d-toggle">
              <input
                checked={state.overlayGroups.glb}
                onChange={(event) => dispatch({ type: 'set-overlay-group', key: 'glb', value: event.target.checked })}
                type="checkbox"
              />
              <span>Optional GLB polish</span>
            </label>
            <label className="case3d-slider">
              <span>Overlay opacity</span>
              <input
                max={1}
                min={0.05}
                onChange={(event) => dispatch({ type: 'set-overlay-opacity', value: Number(event.target.value) })}
                step={0.01}
                type="range"
                value={state.overlayOpacity}
              />
            </label>
          </article>

          <article className="case3d-panel case3d-panel--controls">
            <div className="case3d-panel__header">
              <div>
                <div className="eyebrow">Cut Plane</div>
                <h3>Arbitrary reslice</h3>
              </div>
            </div>
            <label className="case3d-toggle">
              <input
                checked={state.cutPlane.visible}
                onChange={(event) => dispatch({ type: 'set-cut-plane-visibility', visible: event.target.checked })}
                type="checkbox"
              />
              <span>Show cut plane</span>
            </label>
            <label className="case3d-slider">
              <span>Cut-plane opacity</span>
              <input
                max={1}
                min={0.05}
                onChange={(event) => dispatch({ type: 'set-cut-plane-opacity', value: Number(event.target.value) })}
                step={0.01}
                type="range"
                value={state.cutPlane.opacity}
              />
            </label>
            <button className="case3d-button" onClick={() => dispatch({ type: 'reset-cut-plane' })} type="button">
              Reset cut plane
            </button>
            <p className="case3d-note">
              Drag or rotate the plane directly in the 3D view. The cut viewport and segmentation clipping stay tied to
              that same world-space plane.
            </p>
          </article>
        </div>

        <div className="case3d-main">
          <article className="case3d-panel case3d-panel--hero">
            <div className="case3d-panel__header">
              <div>
                <div className="eyebrow">Shared Scene</div>
                <h3>3D patient-space view</h3>
              </div>
              <button className="case3d-button" onClick={() => setResetCameraToken((value) => value + 1)} type="button">
                Reset camera
              </button>
            </div>
            <div className="case3d-panel__viewport case3d-panel__viewport--hero">
              {volumeState.loading ? (
                <div className="case3d-panel__placeholder">Loading CT and segmentation…</div>
              ) : volumeState.error ? (
                <div className="case3d-panel__placeholder">{volumeState.error}</div>
              ) : (
                <VtkViewport
                  className="case-vtk-viewport"
                  cutPlaneNormal={state.cutPlane.normal}
                  cutPlaneOpacity={state.cutPlane.opacity}
                  cutPlaneOrigin={state.cutPlane.origin}
                  cutPlaneVisible={state.cutPlane.visible}
                  crosshairWorld={crosshairWorld}
                  manifest={manifest}
                  mode="three-d"
                  onCutPlaneChange={(origin, normal) => dispatch({ type: 'set-cut-plane', origin, normal })}
                  overlayOpacity={state.overlayOpacity}
                  planeIndices={planeIndices}
                  planeVisibility={state.planeVisibility}
                  resetCameraToken={resetCameraToken}
                  selectedSegments={selectedSegments}
                  segmentation={volumeState.segmentation}
                  showGlb={state.overlayGroups.glb}
                  visibleSegments={visibleSegments}
                  volume={volumeState.ct}
                />
              )}
            </div>
          </article>

          <div className="case3d-grid">
            <SliceCard
              crosshair={crosshairUv.axial}
              manifest={manifest}
              onPlaneIndexChange={(value) => dispatch({ type: 'set-plane-axis-index', plane: 'axial', axisIndex: value, manifest })}
              onToggleVisibility={(visible) => dispatch({ type: 'set-plane-visibility', plane: 'axial', visible })}
              plane="axial"
              planeIndex={planeIndices.axial}
              visible={state.planeVisibility.axial}
              volumeLoaded={volumeState.ct}
            />
            <SliceCard
              crosshair={crosshairUv.coronal}
              manifest={manifest}
              onPlaneIndexChange={(value) =>
                dispatch({ type: 'set-plane-axis-index', plane: 'coronal', axisIndex: value, manifest })
              }
              onToggleVisibility={(visible) => dispatch({ type: 'set-plane-visibility', plane: 'coronal', visible })}
              plane="coronal"
              planeIndex={planeIndices.coronal}
              visible={state.planeVisibility.coronal}
              volumeLoaded={volumeState.ct}
            />
            <SliceCard
              crosshair={crosshairUv.sagittal}
              manifest={manifest}
              onPlaneIndexChange={(value) =>
                dispatch({ type: 'set-plane-axis-index', plane: 'sagittal', axisIndex: value, manifest })
              }
              onToggleVisibility={(visible) => dispatch({ type: 'set-plane-visibility', plane: 'sagittal', visible })}
              plane="sagittal"
              planeIndex={planeIndices.sagittal}
              visible={state.planeVisibility.sagittal}
              volumeLoaded={volumeState.ct}
            />
            <article className="case3d-panel">
              <div className="case3d-panel__header">
                <div>
                  <div className="eyebrow">Arbitrary Cut</div>
                  <h3>Resliced CT</h3>
                </div>
              </div>
              <div className="case3d-panel__viewport">
                {volumeState.ct ? (
                  <VtkViewport
                    className="case-vtk-viewport"
                    manifest={manifest}
                    mode="cut"
                    normal={state.cutPlane.normal}
                    opacity={state.cutPlane.opacity}
                    origin={state.cutPlane.origin}
                    visible={state.cutPlane.visible}
                    volume={volumeState.ct}
                  />
                ) : (
                  <div className="case3d-panel__placeholder">Waiting for volume…</div>
                )}
              </div>
              <p className="case3d-note">
                This panel uses `ImageResliceMapper` against the CT volume and stays aligned to the draggable plane in
                the 3D scene.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

```

## File: `apps/web/src/features/case3d/useCaseOverlay.ts`

```typescript
import { useMemo } from 'react';

import type { RuntimeCaseManifest } from '../../../../../features/case3d/types';

interface OverlayGroupsState {
  allAnatomy: boolean;
  airway: boolean;
  vessels: boolean;
  nodes: boolean;
  glb: boolean;
}

export function useCaseOverlay(
  manifest: RuntimeCaseManifest,
  overlayGroups: OverlayGroupsState,
  selectedTargetId: string,
) {
  return useMemo(() => {
    const selectedTarget = manifest.targets.find((target) => target.id === selectedTargetId) ?? null;
    const selectedSegmentIds = new Set(selectedTarget?.matchedSegmentIds ?? []);
    const visibleSegments = manifest.segmentation.segments.filter((segment) => {
      if (overlayGroups.allAnatomy) {
        return true;
      }

      if (segment.groupId === 'airway') {
        return overlayGroups.airway;
      }

      if (segment.groupId === 'vessels' || segment.groupId === 'cardiac' || segment.groupId === 'gi') {
        return overlayGroups.vessels;
      }

      if (segment.groupId === 'nodes') {
        return overlayGroups.nodes;
      }

      return false;
    });

    return {
      selectedTarget,
      selectedSegmentIds,
      visibleSegments,
    };
  }, [manifest, overlayGroups, selectedTargetId]);
}

```

## File: `apps/web/src/features/case3d/useCasePlanes.ts`

```typescript
import { useMemo } from 'react';

import {
  axisNameToIndex,
  getPlanePoseAtAxisIndex,
  projectWorldPointToPlaneUv,
} from '../../../../../features/case3d/patient-space';

import type { CasePlane, RuntimeCaseManifest, SliceIndex, Vector3Tuple } from '../../../../../features/case3d/types';

export function useCasePlanes(
  manifest: RuntimeCaseManifest,
  crosshairVoxel: Vector3Tuple,
  crosshairWorld: Vector3Tuple,
) {
  return useMemo(() => {
    const planeIndices: SliceIndex = {
      axial: Math.round(crosshairVoxel[axisNameToIndex(manifest.volumeGeometry.axisMap.axial)]),
      coronal: Math.round(crosshairVoxel[axisNameToIndex(manifest.volumeGeometry.axisMap.coronal)]),
      sagittal: Math.round(crosshairVoxel[axisNameToIndex(manifest.volumeGeometry.axisMap.sagittal)]),
    };

    const crosshairUv = (['axial', 'coronal', 'sagittal'] as CasePlane[]).reduce(
      (entries, plane) => {
        const pose = getPlanePoseAtAxisIndex(manifest.volumeGeometry, plane, planeIndices[plane]);
        entries[plane] = projectWorldPointToPlaneUv(crosshairWorld, pose);
        return entries;
      },
      {} as Record<CasePlane, { u: number; v: number }>,
    );

    return {
      planeIndices,
      crosshairUv,
    };
  }, [crosshairVoxel, crosshairWorld, manifest]);
}

```

## File: `apps/web/src/features/case3d/useCaseTargets.ts`

```typescript
import { useMemo } from 'react';

import type { RuntimeCaseManifest, RuntimeCaseTarget } from '../../../../../features/case3d/types';

export function useCaseTargets(manifest: RuntimeCaseManifest, selectedStationId: string, selectedTargetId: string) {
  return useMemo(() => {
    const stationMap = new Map(manifest.stations.map((station) => [station.id, station]));
    const selectedStation = stationMap.get(selectedStationId) ?? manifest.stations[0];
    const stationTargets = manifest.targets.filter((target) => target.stationId === selectedStation.id);
    const landmarkTargets = manifest.targets.filter((target) => target.kind === 'landmark');
    const selectedTarget =
      manifest.targets.find((target) => target.id === selectedTargetId) ??
      stationTargets[0] ??
      manifest.targets[0];

    return {
      selectedStation,
      selectedTarget,
      stationTargets,
      landmarkTargets,
      stationMap,
    };
  }, [manifest, selectedStationId, selectedTargetId]);
}

export function getTargetLabel(target: Pick<RuntimeCaseTarget, 'displayLabel' | 'stationGroupId' | 'kind'>) {
  if (target.kind === 'lymph_node') {
    return target.stationGroupId ? `${target.displayLabel} · node` : target.displayLabel;
  }

  return target.displayLabel;
}

```

## File: `apps/web/src/features/case3d/useCaseVolume.ts`

```typescript
import { useEffect, useRef, useState } from 'react';

import { case001AssetUrls } from './case001';
import { loadCaseVolume, type LoadedCaseVolume } from './vtk/loadCaseVolume';
import { loadSegmentation, type LoadedSegmentation } from './vtk/loadSegmentation';

interface CaseVolumeStatus {
  error: string | null;
  loading: boolean;
}

// VTK image objects are stored in a ref so React's dev-mode effect logger
// never attempts to deeply serialize millions of voxels (which triggers
// "RangeError: Invalid array length" and kills the entire render tree).
interface CaseVolumeData {
  ct: LoadedCaseVolume | null;
  segmentation: LoadedSegmentation | null;
}

export function useCaseVolume() {
  const dataRef = useRef<CaseVolumeData>({ ct: null, segmentation: null });
  const [status, setStatus] = useState<CaseVolumeStatus>({
    error: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [ct, segmentation] = await Promise.all([
          loadCaseVolume(case001AssetUrls.ct),
          loadSegmentation(case001AssetUrls.segmentation),
        ]);

        if (cancelled) {
          return;
        }

        dataRef.current = { ct, segmentation };
        setStatus({ error: null, loading: false });
      } catch (error) {
        if (cancelled) {
          return;
        }

        dataRef.current = { ct: null, segmentation: null };
        setStatus({
          error: error instanceof Error ? error.message : 'Case volume could not be loaded.',
          loading: false,
        });
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    ...status,
    ct: dataRef.current.ct,
    segmentation: dataRef.current.segmentation,
  };
}

```

## File: `apps/web/src/features/case3d/useCutPlane.ts`

```typescript
import { useMemo } from 'react';

import type { Vector3Tuple } from '../../../../../features/case3d/types';

export function useCutPlane(origin: Vector3Tuple, normal: Vector3Tuple) {
  return useMemo(
    () => ({
      origin,
      normal,
    }),
    [normal, origin],
  );
}

```

## File: `apps/web/src/features/case3d/viewerState.test.ts`

```typescript
import { describe, expect, it } from 'vitest';

import runtimeData from '../../../../../content/cases/case_001.runtime.json';

import { caseViewerReducer, createInitialViewerState } from './viewerState';

import type { RuntimeCaseManifest } from '../../../../../features/case3d/types';

const manifest = runtimeData as unknown as RuntimeCaseManifest;

describe('caseViewerReducer', () => {
  it('moves the crosshair and cut plane when selecting a target', () => {
    const initialState = createInitialViewerState(manifest);
    const target = manifest.targets.find((entry) => entry.id === 'landmark_carina') ?? manifest.targets[0];

    const nextState = caseViewerReducer(initialState, {
      type: 'select-target',
      manifest,
      stationId: target.stationId ?? initialState.selectedStationId,
      targetId: target.id,
      world: target.world.position,
    });

    expect(nextState.selectedTargetId).toBe(target.id);
    expect(nextState.cutPlane.origin).toEqual(target.world.position);
    expect(nextState.crosshairVoxel[2]).toBeCloseTo(target.derived.continuousVoxel[2], 3);
  });

  it('updates the requested orthogonal axis index without disturbing the others', () => {
    const initialState = createInitialViewerState(manifest);

    const nextState = caseViewerReducer(initialState, {
      type: 'set-plane-axis-index',
      plane: 'axial',
      axisIndex: 80,
      manifest,
    });

    expect(nextState.crosshairVoxel[2]).toBe(80);
    expect(nextState.crosshairVoxel[0]).toBe(initialState.crosshairVoxel[0]);
    expect(nextState.crosshairVoxel[1]).toBe(initialState.crosshairVoxel[1]);
  });
});

```

## File: `apps/web/src/features/case3d/viewerState.ts`

```typescript
import { axisNameToIndex, worldToContinuousVoxel } from '../../../../../features/case3d/patient-space';

import type { CasePlane, RuntimeCaseManifest, Vector3Tuple } from '../../../../../features/case3d/types';

export interface CaseViewerState {
  selectedStationId: string;
  selectedTargetId: string;
  crosshairVoxel: Vector3Tuple;
  planeVisibility: Record<CasePlane, boolean>;
  overlayOpacity: number;
  overlayGroups: {
    allAnatomy: boolean;
    airway: boolean;
    vessels: boolean;
    nodes: boolean;
    glb: boolean;
  };
  cutPlane: {
    opacity: number;
    visible: boolean;
    origin: Vector3Tuple;
    normal: Vector3Tuple;
    initialOrigin: Vector3Tuple;
    initialNormal: Vector3Tuple;
  };
}

export type CaseViewerAction =
  | { type: 'select-station'; stationId: string; targetId: string; world: Vector3Tuple; manifest: RuntimeCaseManifest }
  | { type: 'select-target'; stationId: string; targetId: string; world: Vector3Tuple; manifest: RuntimeCaseManifest }
  | { type: 'set-plane-axis-index'; plane: CasePlane; axisIndex: number; manifest: RuntimeCaseManifest }
  | { type: 'set-plane-visibility'; plane: CasePlane; visible: boolean }
  | { type: 'set-overlay-opacity'; value: number }
  | { type: 'set-overlay-group'; key: keyof CaseViewerState['overlayGroups']; value: boolean }
  | { type: 'set-cut-plane-visibility'; visible: boolean }
  | { type: 'set-cut-plane-opacity'; value: number }
  | { type: 'set-cut-plane'; origin: Vector3Tuple; normal: Vector3Tuple }
  | { type: 'reset-cut-plane' };

const DEFAULT_CUT_NORMAL: Vector3Tuple = [0.82, -0.18, 0.54];

function clampOverlay(value: number) {
  return Math.max(0.05, Math.min(1, value));
}

function worldToCaseVoxel(manifest: RuntimeCaseManifest, world: Vector3Tuple): Vector3Tuple {
  return worldToContinuousVoxel(world, manifest.volumeGeometry);
}

function selectWorld(manifest: RuntimeCaseManifest, world: Vector3Tuple) {
  const voxel = worldToCaseVoxel(manifest, world);

  return [
    Math.max(0, Math.min(manifest.volumeGeometry.sizes[0] - 1, voxel[0])),
    Math.max(0, Math.min(manifest.volumeGeometry.sizes[1] - 1, voxel[1])),
    Math.max(0, Math.min(manifest.volumeGeometry.sizes[2] - 1, voxel[2])),
  ] as Vector3Tuple;
}

export function createInitialViewerState(manifest: RuntimeCaseManifest): CaseViewerState {
  const initialStation = manifest.stations[0];
  const initialTarget =
    manifest.targets.find((target) => target.id === initialStation.primaryTargetId) ?? manifest.targets[0];
  const cutOrigin = initialTarget.world.position;

  return {
    selectedStationId: initialStation.id,
    selectedTargetId: initialTarget.id,
    crosshairVoxel: selectWorld(manifest, initialTarget.world.position),
    planeVisibility: {
      axial: true,
      coronal: true,
      sagittal: true,
    },
    overlayOpacity: 0.36,
    overlayGroups: {
      allAnatomy: false,
      airway: true,
      vessels: true,
      nodes: true,
      glb: false,
    },
    cutPlane: {
      opacity: 0.92,
      visible: true,
      origin: cutOrigin,
      normal: DEFAULT_CUT_NORMAL,
      initialOrigin: cutOrigin,
      initialNormal: DEFAULT_CUT_NORMAL,
    },
  };
}

export function caseViewerReducer(state: CaseViewerState, action: CaseViewerAction): CaseViewerState {
  switch (action.type) {
    case 'select-station':
    case 'select-target':
      return {
        ...state,
        selectedStationId: action.stationId,
        selectedTargetId: action.targetId,
        crosshairVoxel: selectWorld(action.manifest, action.world),
        cutPlane: {
          ...state.cutPlane,
          origin: action.world,
          initialOrigin: action.world,
        },
      };
    case 'set-plane-axis-index': {
      const axisMap = action.manifest.volumeGeometry.axisMap;
      const nextVoxel = [...state.crosshairVoxel] as Vector3Tuple;
      const axisName = axisMap[action.plane];
      nextVoxel[axisNameToIndex(axisName)] = Math.max(
        0,
        Math.min(action.manifest.volumeGeometry.sizes[axisNameToIndex(axisName)] - 1, action.axisIndex),
      );

      return {
        ...state,
        crosshairVoxel: nextVoxel,
      };
    }
    case 'set-plane-visibility':
      return {
        ...state,
        planeVisibility: {
          ...state.planeVisibility,
          [action.plane]: action.visible,
        },
      };
    case 'set-overlay-opacity':
      return {
        ...state,
        overlayOpacity: clampOverlay(action.value),
      };
    case 'set-overlay-group':
      return {
        ...state,
        overlayGroups: {
          ...state.overlayGroups,
          [action.key]: action.value,
        },
      };
    case 'set-cut-plane-visibility':
      return {
        ...state,
        cutPlane: {
          ...state.cutPlane,
          visible: action.visible,
        },
      };
    case 'set-cut-plane-opacity':
      return {
        ...state,
        cutPlane: {
          ...state.cutPlane,
          opacity: clampOverlay(action.value),
        },
      };
    case 'set-cut-plane':
      return {
        ...state,
        cutPlane: {
          ...state.cutPlane,
          origin: action.origin,
          normal: action.normal,
        },
      };
    case 'reset-cut-plane':
      return {
        ...state,
        cutPlane: {
          ...state.cutPlane,
          origin: state.cutPlane.initialOrigin,
          normal: state.cutPlane.initialNormal,
        },
      };
    default:
      return state;
  }
}

```

## File: `apps/web/src/features/case3d/vtk/buildCrosshair.ts`

```typescript
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkLineSource from '@kitware/vtk.js/Filters/Sources/LineSource';

import type { Vector3Tuple } from '../../../../../../features/case3d/types';

function add(a: Vector3Tuple, b: Vector3Tuple): Vector3Tuple {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scale(v: Vector3Tuple, scalar: number): Vector3Tuple {
  return [v[0] * scalar, v[1] * scalar, v[2] * scalar];
}

export function createCrosshairActors(center: Vector3Tuple, length = 14) {
  const axes: Vector3Tuple[] = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  return axes.map((axis) => {
    const source = vtkLineSource.newInstance({
      point1: add(center, scale(axis, -length / 2)),
      point2: add(center, scale(axis, length / 2)),
      resolution: 1,
    });
    const mapper = vtkMapper.newInstance();
    mapper.setInputConnection(source.getOutputPort());

    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);
    actor.getProperty().setColor(0.98, 0.86, 0.36);
    actor.getProperty().setLineWidth(2.4);

    return { actor, source };
  });
}

export function updateCrosshairActors(
  crosshair: Array<{ source: ReturnType<typeof vtkLineSource.newInstance> }>,
  center: Vector3Tuple,
  length = 14,
) {
  const axes: Vector3Tuple[] = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  crosshair.forEach((entry, index) => {
    const axis = axes[index];
    entry.source.setPoint1(...add(center, scale(axis, -length / 2)));
    entry.source.setPoint2(...add(center, scale(axis, length / 2)));
    entry.source.modified();
  });
}

```

## File: `apps/web/src/features/case3d/vtk/buildCutPlane.ts`

```typescript
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane';
import vtkImageResliceMapper from '@kitware/vtk.js/Rendering/Core/ImageResliceMapper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import type vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';

import { resolveMediastinalWindowing } from './ctWindowing';

import type { Vector3Tuple } from '../../../../../../features/case3d/types';

export function createCutPlaneSlice(
  image: vtkImageData,
  scalarRange: readonly [number, number],
  origin: Vector3Tuple,
  normal: Vector3Tuple,
) {
  const plane = vtkPlane.newInstance({
    origin,
    normal,
  });
  const mapper = vtkImageResliceMapper.newInstance();
  mapper.setInputData(image);
  mapper.setSlicePlane(plane);

  const actor = vtkImageSlice.newInstance();
  actor.setMapper(mapper);

  const { colorWindow, colorLevel } = resolveMediastinalWindowing(scalarRange);
  actor.getProperty().setColorWindow(colorWindow);
  actor.getProperty().setColorLevel(colorLevel);
  actor.getProperty().setInterpolationTypeToLinear();

  return { actor, mapper, plane };
}

```

## File: `apps/web/src/features/case3d/vtk/buildGlbOverlay.ts`

```typescript
import vtkGLTFImporter from '@kitware/vtk.js/IO/Geometry/GLTFImporter';
import type vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';

import { rowMajorToColumnMajor } from './coordinateTransforms';

import type { RuntimeCaseManifest } from '../../../../../../features/case3d/types';

export async function loadGlbOverlay(
  renderer: vtkRenderer,
  manifest: RuntimeCaseManifest,
  url: string,
) {
  const importer = vtkGLTFImporter.newInstance();
  importer.setRenderer(renderer);
  await importer.setUrl(url, { binary: true });
  await importer.loadData({ binary: true });
  importer.importActors();
  const matrix = rowMajorToColumnMajor(manifest.patientToScene.inverseMatrix);

  importer.getActors().forEach((actor) => {
    actor.setUserMatrix(matrix);
  });

  return importer;
}

```

## File: `apps/web/src/features/case3d/vtk/buildOrthogonalPlanes.ts`

```typescript
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import type vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';

import { planeToSlicingMode } from './coordinateTransforms';
import { resolveMediastinalWindowing } from './ctWindowing';

import type { CasePlane, RuntimeCaseManifest } from '../../../../../../features/case3d/types';

export function createOrthogonalPlaneActor(
  image: vtkImageData,
  manifest: RuntimeCaseManifest,
  plane: CasePlane,
  scalarRange: readonly [number, number],
) {
  const slicingMode = planeToSlicingMode(manifest.volumeGeometry, plane);
  const mapper = vtkImageMapper.newInstance();
  mapper.setInputData(image);
  mapper.setSlicingMode(slicingMode);

  const actor = vtkImageSlice.newInstance();
  actor.setMapper(mapper);

  const { colorWindow, colorLevel } = resolveMediastinalWindowing(scalarRange);
  actor.getProperty().setColorWindow(colorWindow);
  actor.getProperty().setColorLevel(colorLevel);
  actor.getProperty().setInterpolationTypeToLinear();

  return { actor, mapper };
}

```

## File: `apps/web/src/features/case3d/vtk/buildSegmentationSurface.ts`

```typescript
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import vtkImageMarchingCubes from '@kitware/vtk.js/Filters/General/ImageMarchingCubes';
import vtkMatrixBuilder from '@kitware/vtk.js/Common/Core/MatrixBuilder';
import type vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane';

import { rowMajorToColumnMajor } from './coordinateTransforms';

import type { LoadedSegmentation } from './loadSegmentation';
import type {
  RuntimeCaseManifest,
  SegmentationSegment,
} from '../../../../../../features/case3d/types';

type SegmentSelection = Pick<SegmentationSegment, 'labelValue' | 'layer' | 'extent' | 'color'>;

function buildUnionExtent(segments: SegmentSelection[]) {
  return segments.reduce<[number, number, number, number, number, number]>(
    (extent, segment) => [
      Math.min(extent[0], segment.extent[0]),
      Math.max(extent[1], segment.extent[1]),
      Math.min(extent[2], segment.extent[2]),
      Math.max(extent[3], segment.extent[3]),
      Math.min(extent[4], segment.extent[4]),
      Math.max(extent[5], segment.extent[5]),
    ],
    [
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ],
  );
}

function createBinaryMask(
  segmentation: LoadedSegmentation,
  segments: SegmentSelection[],
) {
  const extent = buildUnionExtent(segments);
  const sizeI = extent[1] - extent[0] + 1;
  const sizeJ = extent[3] - extent[2] + 1;
  const sizeK = extent[5] - extent[4] + 1;
  const mask = new Uint8Array(sizeI * sizeJ * sizeK);
  const labelsByLayer = new Map<number, Set<number>>();

  segments.forEach((segment) => {
    const labels = labelsByLayer.get(segment.layer) ?? new Set<number>();
    labels.add(segment.labelValue);
    labelsByLayer.set(segment.layer, labels);
  });

  const [dimI, dimJ] = segmentation.dimensions;
  const componentCount = segmentation.componentCount;
  let outputIndex = 0;

  for (let k = extent[4]; k <= extent[5]; k += 1) {
    for (let j = extent[2]; j <= extent[3]; j += 1) {
      for (let i = extent[0]; i <= extent[1]; i += 1) {
        const pointIndex = (k * dimJ + j) * dimI + i;
        const scalarOffset = pointIndex * componentCount;
        let filled = false;

        labelsByLayer.forEach((labels, layer) => {
          if (filled) {
            return;
          }

          if (labels.has(segmentation.scalarData[scalarOffset + layer])) {
            filled = true;
          }
        });

        mask[outputIndex] = filled ? 255 : 0;
        outputIndex += 1;
      }
    }
  }

  return {
    extent,
    size: [sizeI, sizeJ, sizeK] as [number, number, number],
    mask,
  };
}

export function createSegmentationSurfaceActor(
  manifest: RuntimeCaseManifest,
  segmentation: LoadedSegmentation,
  segments: SegmentSelection[],
  color: [number, number, number],
  opacity: number,
  clippingPlane?: vtkPlane,
) {
  if (segments.length === 0) {
    return null;
  }

  const { extent, size, mask } = createBinaryMask(segmentation, segments);
  const image = vtkImageData.newInstance({
    origin: [extent[0], extent[2], extent[4]],
    spacing: [1, 1, 1],
  });
  image.setDimensions(size[0], size[1], size[2]);
  image.getPointData().setScalars(
    vtkDataArray.newInstance({
      name: 'Mask',
      values: mask,
      numberOfComponents: 1,
    }),
  );

  const marchingCubes = vtkImageMarchingCubes.newInstance({
    contourValue: 128,
    computeNormals: true,
    mergePoints: true,
  });
  marchingCubes.setInputData(image);
  marchingCubes.update();
  const polyData = marchingCubes.getOutputData();
  const points = polyData.getPoints()?.getData();

  if (!points) {
    return null;
  }

  vtkMatrixBuilder.buildFromRadian()
    .setMatrix(rowMajorToColumnMajor(manifest.segmentation.ijkToWorldMatrix))
    .apply(points);
  polyData.getPoints().modified();

  const mapper = vtkMapper.newInstance();
  mapper.setInputData(polyData);

  if (clippingPlane) {
    mapper.addClippingPlane(clippingPlane);
  }

  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);
  actor.getProperty().setColor(color[0], color[1], color[2]);
  actor.getProperty().setOpacity(opacity);

  return { actor, mapper, polyData };
}

```

## File: `apps/web/src/features/case3d/vtk/configureImageIo.ts`

```typescript
import { setPipelinesBaseUrl as setImageIoPipelinesBaseUrl } from '@itk-wasm/image-io';
import { setPipelinesBaseUrl as setItkWasmPipelinesBaseUrl } from 'itk-wasm';

let configured = false;

function getPipelinesBaseUrl() {
  return new URL(`${import.meta.env.BASE_URL}pipelines`, window.location.origin).href.replace(/\/$/, '');
}

export function configureImageIo() {
  if (configured || typeof window === 'undefined') {
    return;
  }

  const pipelinesBaseUrl = getPipelinesBaseUrl();
  setImageIoPipelinesBaseUrl(pipelinesBaseUrl);
  setItkWasmPipelinesBaseUrl(pipelinesBaseUrl);
  configured = true;
}

```

## File: `apps/web/src/features/case3d/vtk/coordinateTransforms.ts`

```typescript
import vtkImageMapper from '@kitware/vtk.js/Rendering/Core/ImageMapper';

import {
  addVectors,
  axisNameToIndex,
  crossVectors,
  getPlaneAxes,
  normalizeVector,
  scaleVector,
  voxelToWorld,
  worldToContinuousVoxel,
} from '../../../../../../features/case3d/patient-space';

import type {
  AxisName,
  CasePlane,
  RuntimeCaseManifest,
  Vector3Tuple,
  VolumeGeometry,
  WorldBounds,
} from '../../../../../../features/case3d/types';

export function clampAxisIndex(value: number, size: number) {
  return Math.max(0, Math.min(size - 1, value));
}

export function rowMajorToColumnMajor(matrix: readonly number[]) {
  return new Float32Array([
    matrix[0], matrix[4], matrix[8], matrix[12] ?? 0,
    matrix[1], matrix[5], matrix[9], matrix[13] ?? 0,
    matrix[2], matrix[6], matrix[10], matrix[14] ?? 0,
    matrix[3], matrix[7], matrix[11], matrix[15] ?? 1,
  ]);
}

export function axisNameToSlicingMode(axisName: AxisName) {
  switch (axisName) {
    case 'i':
      return vtkImageMapper.SlicingMode.I;
    case 'j':
      return vtkImageMapper.SlicingMode.J;
    case 'k':
      return vtkImageMapper.SlicingMode.K;
    default:
      return vtkImageMapper.SlicingMode.K;
  }
}

export function planeToSlicingMode(geometry: VolumeGeometry, plane: CasePlane) {
  return axisNameToSlicingMode(getPlaneAxes(geometry.axisMap, plane).normalAxis);
}

export function getPlaneCenterWorld(geometry: VolumeGeometry, plane: CasePlane, axisIndex: number): Vector3Tuple {
  const axes = getPlaneAxes(geometry.axisMap, plane);

  return voxelToWorld(
    [
      axes.normalAxis === 'i' ? axisIndex : (geometry.sizes[0] - 1) / 2,
      axes.normalAxis === 'j' ? axisIndex : (geometry.sizes[1] - 1) / 2,
      axes.normalAxis === 'k' ? axisIndex : (geometry.sizes[2] - 1) / 2,
    ],
    geometry,
  );
}

export function getPlaneNormalWorld(geometry: VolumeGeometry, plane: CasePlane): Vector3Tuple {
  const axes = getPlaneAxes(geometry.axisMap, plane);

  return normalizeVector(geometry.spaceDirections[axisNameToIndex(axes.normalAxis)]);
}

export function getPlaneBasisWorld(geometry: VolumeGeometry, plane: CasePlane) {
  const axes = getPlaneAxes(geometry.axisMap, plane);
  const u = normalizeVector(geometry.spaceDirections[axisNameToIndex(axes.uAxis)]);
  const v = normalizeVector(geometry.spaceDirections[axisNameToIndex(axes.vAxis)]);
  const normal = normalizeVector(crossVectors(u, v));

  return { u, v, normal };
}

export function getCrosshairWorld(manifest: RuntimeCaseManifest, continuousVoxel: Vector3Tuple) {
  return voxelToWorld(continuousVoxel, manifest.volumeGeometry);
}

export function getCrosshairContinuousVoxel(manifest: RuntimeCaseManifest, world: Vector3Tuple) {
  return worldToContinuousVoxel(world, manifest.volumeGeometry);
}

export function boundsToExtent(bounds: WorldBounds) {
  return [bounds.min[0], bounds.max[0], bounds.min[1], bounds.max[1], bounds.min[2], bounds.max[2]] as [
    number,
    number,
    number,
    number,
    number,
    number,
  ];
}

export function getBoundsCenter(bounds: WorldBounds): Vector3Tuple {
  return [
    (bounds.min[0] + bounds.max[0]) / 2,
    (bounds.min[1] + bounds.max[1]) / 2,
    (bounds.min[2] + bounds.max[2]) / 2,
  ];
}

export function getBoundsRadius(bounds: WorldBounds) {
  const center = getBoundsCenter(bounds);

  return Math.max(
    1,
    Math.hypot(bounds.max[0] - center[0], bounds.max[1] - center[1], bounds.max[2] - center[2]),
  );
}

export function getPlaneCameraPosition(center: Vector3Tuple, normal: Vector3Tuple, distance: number) {
  return addVectors(center, scaleVector(normal, distance));
}

export function getPlaneViewUp(geometry: VolumeGeometry, plane: CasePlane) {
  const { v } = getPlaneBasisWorld(geometry, plane);

  return v;
}

```

## File: `apps/web/src/features/case3d/vtk/ctWindowing.ts`

```typescript
const MEDIASTINAL_WINDOW = 360;
const MEDIASTINAL_LEVEL = 40;

export function resolveMediastinalWindowing(scalarRange: readonly [number, number]) {
  const [minimum, maximum] = scalarRange;
  const dynamicRange = Math.max(1, maximum - minimum);
  const colorWindow = Math.min(MEDIASTINAL_WINDOW, dynamicRange);
  const halfWindow = colorWindow / 2;
  const lowestLevel = minimum + halfWindow;
  const highestLevel = maximum - halfWindow;

  return {
    colorWindow,
    colorLevel:
      lowestLevel <= highestLevel
        ? Math.min(highestLevel, Math.max(lowestLevel, MEDIASTINAL_LEVEL))
        : (minimum + maximum) / 2,
  };
}

```

## File: `apps/web/src/features/case3d/vtk/loadCaseVolume.ts`

```typescript
import { convertItkToVtkImage } from '@kitware/vtk.js/Common/DataModel/ITKHelper';
import type vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import { readImage } from '@itk-wasm/image-io';

import { configureImageIo } from './configureImageIo';

async function fetchBinaryFile(url: string, fileName: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to fetch ${fileName}: ${response.status} ${response.statusText}`);
  }

  return {
    path: fileName,
    data: new Uint8Array(await response.arrayBuffer()),
  };
}

export interface LoadedCaseVolume {
  image: vtkImageData;
  scalarRange: [number, number];
}

export async function loadCaseVolume(url: string, fileName = 'case_001_ct.nrrd'): Promise<LoadedCaseVolume> {
  configureImageIo();
  const binaryFile = await fetchBinaryFile(url, fileName);
  const result = await readImage(binaryFile, { webWorker: false });
  const image = convertItkToVtkImage(result.image, {
    scalarArrayName: 'CT Scalars',
  });

  if (!image) {
    throw new Error(`Unable to convert ${fileName} into vtkImageData.`);
  }

  const range = image.getPointData().getScalars()?.getRange() ?? [0, 1];

  // CT data stored as int16 often includes padding voxels at -32768 or similar
  // extremes, which makes the raw range far too wide for useful display.
  // Clamp to the standard HU range so windowing produces visible contrast.
  const clampedMin = Math.max(range[0], -1024);
  const clampedMax = Math.min(range[1], 3071);

  return {
    image,
    scalarRange: [clampedMin, clampedMax],
  };
}

```

## File: `apps/web/src/features/case3d/vtk/loadSegmentation.ts`

```typescript
import { convertItkToVtkImage } from '@kitware/vtk.js/Common/DataModel/ITKHelper';
import type vtkImageData from '@kitware/vtk.js/Common/DataModel/ImageData';
import { readImage } from '@itk-wasm/image-io';

import type { Vector3Tuple } from '../../../../../../features/case3d/types';
import { configureImageIo } from './configureImageIo';

async function fetchBinaryFile(url: string, fileName: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to fetch ${fileName}: ${response.status} ${response.statusText}`);
  }

  return {
    path: fileName,
    data: new Uint8Array(await response.arrayBuffer()),
  };
}

export interface LoadedSegmentation {
  image: vtkImageData;
  scalarData: Uint8Array;
  dimensions: Vector3Tuple;
  componentCount: number;
}

export async function loadSegmentation(url: string, fileName = 'case_001_segmentation.nrrd'): Promise<LoadedSegmentation> {
  configureImageIo();
  const binaryFile = await fetchBinaryFile(url, fileName);
  const result = await readImage(binaryFile, { webWorker: false });
  const image = convertItkToVtkImage(result.image, {
    scalarArrayName: 'Segmentation Scalars',
  });

  if (!image) {
    throw new Error(`Unable to convert ${fileName} into vtkImageData.`);
  }

  const scalarData = image.getPointData().getScalars()?.getData();

  if (!(scalarData instanceof Uint8Array)) {
    throw new Error(`Expected ${fileName} to decode into a Uint8Array labelmap.`);
  }

  return {
    image,
    scalarData,
    dimensions: image.getDimensions() as Vector3Tuple,
    componentCount: image.getPointData().getScalars()?.getNumberOfComponents() ?? 1,
  };
}

```

## File: `apps/web/src/features/case3d/vtk/vtk-extensions.d.ts`

```typescript
declare module '@kitware/vtk.js/Rendering/Profiles/All' {
  const value: unknown;
  export default value;
}

declare module '@kitware/vtk.js/Filters/General/ImageMarchingCubes' {
  const vtkImageMarchingCubes: {
    newInstance(initialValues?: Record<string, unknown>): any;
  };
  export default vtkImageMarchingCubes;
}

declare module '@kitware/vtk.js/Widgets/Widgets3D/ImplicitPlaneWidget' {
  const vtkImplicitPlaneWidget: {
    newInstance(initialValues?: Record<string, unknown>): any;
  };
  export default vtkImplicitPlaneWidget;
}

```

## File: `apps/web/src/features/case3d/VtkViewport.tsx`

```typescript
import { useEffect, useMemo, useRef } from 'react';

// Side-effect import required for vtk.js rendering backends.
import '@kitware/vtk.js/Rendering/Profiles/All';
import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';
import vtkInteractorStyleImage from '@kitware/vtk.js/Interaction/Style/InteractorStyleImage';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';
import { ViewTypes } from '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants';
import vtkImplicitPlaneWidget from '@kitware/vtk.js/Widgets/Widgets3D/ImplicitPlaneWidget';

import { case001AssetUrls } from './case001';
import { createCrosshairActors, updateCrosshairActors } from './vtk/buildCrosshair';
import { loadGlbOverlay } from './vtk/buildGlbOverlay';
import { createCutPlaneSlice } from './vtk/buildCutPlane';
import { createOrthogonalPlaneActor } from './vtk/buildOrthogonalPlanes';
import { createSegmentationSurfaceActor } from './vtk/buildSegmentationSurface';
import {
  boundsToExtent,
  getBoundsCenter,
  getBoundsRadius,
  getPlaneCameraPosition,
  getPlaneCenterWorld,
  getPlaneNormalWorld,
  getPlaneViewUp,
} from './vtk/coordinateTransforms';

import { crossVectors, normalizeVector } from '../../../../../features/case3d/patient-space';
import type { LoadedCaseVolume } from './vtk/loadCaseVolume';
import type { LoadedSegmentation } from './vtk/loadSegmentation';
import type {
  CasePlane,
  RuntimeCaseManifest,
  SegmentationSegment,
  SliceIndex,
  Vector3Tuple,
} from '../../../../../features/case3d/types';

interface CommonViewportProps {
  className?: string;
}

interface SliceViewportProps extends CommonViewportProps {
  mode: 'slice';
  manifest: RuntimeCaseManifest;
  volume: LoadedCaseVolume | null;
  plane: CasePlane;
  planeIndex: number;
  visible: boolean;
}

interface CutViewportProps extends CommonViewportProps {
  mode: 'cut';
  manifest: RuntimeCaseManifest;
  volume: LoadedCaseVolume | null;
  origin: Vector3Tuple;
  normal: Vector3Tuple;
  opacity: number;
  visible: boolean;
}

interface ThreeDViewportProps extends CommonViewportProps {
  mode: 'three-d';
  manifest: RuntimeCaseManifest;
  volume: LoadedCaseVolume | null;
  segmentation: LoadedSegmentation | null;
  planeIndices: SliceIndex;
  planeVisibility: Record<CasePlane, boolean>;
  crosshairWorld: Vector3Tuple;
  overlayOpacity: number;
  visibleSegments: SegmentationSegment[];
  selectedSegments: SegmentationSegment[];
  cutPlaneOrigin: Vector3Tuple;
  cutPlaneNormal: Vector3Tuple;
  cutPlaneOpacity: number;
  cutPlaneVisible: boolean;
  showGlb: boolean;
  resetCameraToken: number;
  onCutPlaneChange: (origin: Vector3Tuple, normal: Vector3Tuple) => void;
}

type VtkViewportProps = SliceViewportProps | CutViewportProps | ThreeDViewportProps;

type SlicePipeline = {
  actor: ReturnType<typeof createOrthogonalPlaneActor>['actor'];
  mapper: ReturnType<typeof createOrthogonalPlaneActor>['mapper'];
};

type CutPipeline = ReturnType<typeof createCutPlaneSlice>;

type ThreeDPipeline = {
  planeActors: Record<CasePlane, ReturnType<typeof createOrthogonalPlaneActor>>;
  crosshair: ReturnType<typeof createCrosshairActors>;
  cutSlice: ReturnType<typeof createCutPlaneSlice>;
  widgetFactory: any;
  widgetManager: vtkWidgetManager;
  widgetSubscription: { unsubscribe: () => void } | null;
  segmentationActors: Map<string, Exclude<ReturnType<typeof createSegmentationSurfaceActor>, null>>;
  selectedActor: Exclude<ReturnType<typeof createSegmentationSurfaceActor>, null> | null;
  glbImporter: Awaited<ReturnType<typeof loadGlbOverlay>> | null;
};

const EMPTY_SEGMENTS: SegmentationSegment[] = [];

function vectorsClose(left: readonly number[], right: readonly number[], epsilon = 1e-3) {
  return left.every((value, index) => Math.abs(value - right[index]) <= epsilon);
}

function configureSliceCamera(
  genericRenderWindow: vtkGenericRenderWindow,
  manifest: RuntimeCaseManifest,
  plane: CasePlane,
  planeIndex: number,
) {
  const renderer = genericRenderWindow.getRenderer();
  const camera = renderer.getActiveCamera();
  const center = getPlaneCenterWorld(manifest.volumeGeometry, plane, planeIndex);
  const normal = getPlaneNormalWorld(manifest.volumeGeometry, plane);
  const viewUp = getPlaneViewUp(manifest.volumeGeometry, plane);
  const radius = getBoundsRadius(manifest.bounds.ct);
  const bounds = boundsToExtent(manifest.bounds.ct);

  camera.setParallelProjection(true);
  camera.setFocalPoint(center[0], center[1], center[2]);
  camera.setPosition(...getPlaneCameraPosition(center, normal, radius * 1.7));
  camera.setViewUp(viewUp[0], viewUp[1], viewUp[2]);
  camera.setParallelScale(radius * 0.78);
  renderer.resetCameraClippingRange(bounds);
}

function configureCutCamera(
  genericRenderWindow: vtkGenericRenderWindow,
  manifest: RuntimeCaseManifest,
  origin: Vector3Tuple,
  normal: Vector3Tuple,
) {
  const renderer = genericRenderWindow.getRenderer();
  const camera = renderer.getActiveCamera();
  const normalized = normalizeVector(normal);
  const fallbackUp: Vector3Tuple = Math.abs(normalized[2]) > 0.92 ? [0, 1, 0] : [0, 0, 1];
  const right = normalizeVector(crossVectors(normalized, fallbackUp));
  const viewUp = normalizeVector(crossVectors(right, normalized));
  const radius = getBoundsRadius(manifest.bounds.ct);

  camera.setParallelProjection(true);
  camera.setFocalPoint(origin[0], origin[1], origin[2]);
  camera.setPosition(...getPlaneCameraPosition(origin, normalized, radius * 1.35));
  camera.setViewUp(viewUp[0], viewUp[1], viewUp[2]);
  camera.setParallelScale(radius * 0.52);
  renderer.resetCameraClippingRange(boundsToExtent(manifest.bounds.ct));
}

function resetThreeDCamera(genericRenderWindow: vtkGenericRenderWindow, manifest: RuntimeCaseManifest) {
  const renderer = genericRenderWindow.getRenderer();
  const camera = renderer.getActiveCamera();
  const center = getBoundsCenter(manifest.bounds.ct);
  const radius = getBoundsRadius(manifest.bounds.ct);

  camera.setFocalPoint(center[0], center[1], center[2]);
  camera.setPosition(center[0] + radius * 1.08, center[1] - radius * 1.02, center[2] + radius * 0.78);
  camera.setViewUp(0, 0, 1);
  renderer.resetCameraClippingRange(boundsToExtent(manifest.bounds.union));
}

export function VtkViewport(props: VtkViewportProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const genericRenderWindowRef = useRef<vtkGenericRenderWindow | null>(null);
  const pipelineRef = useRef<SlicePipeline | CutPipeline | ThreeDPipeline | null>(null);
  const lastResetCameraTokenRef = useRef(0);
  const cutPlaneRef = useRef<{ normal: Vector3Tuple; origin: Vector3Tuple }>(
    props.mode === 'three-d'
      ? { origin: props.cutPlaneOrigin, normal: props.cutPlaneNormal }
      : { origin: [0, 0, 0], normal: [0, 0, 1] },
  );
  const threeDVisibleSegments = props.mode === 'three-d' ? props.visibleSegments : EMPTY_SEGMENTS;
  const visibleGroupMap = useMemo(() => {
    if (props.mode !== 'three-d') {
      return new Map<string, SegmentationSegment[]>();
    }

    const groups = new Map<string, SegmentationSegment[]>();

    props.visibleSegments.forEach((segment) => {
      const key = segment.groupId;
      const existing = groups.get(key) ?? [];
      existing.push(segment);
      groups.set(key, existing);
    });

    return groups;
  }, [props.mode, threeDVisibleSegments]);

  useEffect(() => {
    if (props.mode !== 'three-d') {
      return;
    }

    cutPlaneRef.current = {
      origin: props.cutPlaneOrigin,
      normal: props.cutPlaneNormal,
    };
  }, [props.mode, props.mode === 'three-d' ? props.cutPlaneOrigin : null, props.mode === 'three-d' ? props.cutPlaneNormal : null]);

  useEffect(() => {
    if (!containerRef.current || genericRenderWindowRef.current) {
      return;
    }

    const genericRenderWindow = vtkGenericRenderWindow.newInstance({
      background: [0.02, 0.04, 0.08],
      container: containerRef.current,
    });
    genericRenderWindow.setContainer(containerRef.current);
    genericRenderWindow.resize();
    genericRenderWindowRef.current = genericRenderWindow;

    return () => {
      if (pipelineRef.current && 'widgetSubscription' in pipelineRef.current) {
        pipelineRef.current.widgetSubscription?.unsubscribe();
      }

      pipelineRef.current = null;
      genericRenderWindow.delete();
      genericRenderWindowRef.current = null;
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      genericRenderWindowRef.current?.resize();
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const genericRenderWindow = genericRenderWindowRef.current;

    if (!genericRenderWindow) {
      return;
    }

    if (props.mode === 'slice' && props.volume && !pipelineRef.current) {
      const renderer = genericRenderWindow.getRenderer();
      const interactor = genericRenderWindow.getInteractor();
      interactor.setInteractorStyle(vtkInteractorStyleImage.newInstance());
      const planeActor = createOrthogonalPlaneActor(
        props.volume.image,
        props.manifest,
        props.plane,
        props.volume.scalarRange,
      );
      renderer.addActor(planeActor.actor);
      pipelineRef.current = planeActor;
      configureSliceCamera(genericRenderWindow, props.manifest, props.plane, props.planeIndex);
      genericRenderWindow.getRenderWindow().render();
    }

    if (props.mode === 'cut' && props.volume && !pipelineRef.current) {
      const renderer = genericRenderWindow.getRenderer();
      const interactor = genericRenderWindow.getInteractor();
      interactor.setInteractorStyle(vtkInteractorStyleImage.newInstance());
      const cutSlice = createCutPlaneSlice(
        props.volume.image,
        props.volume.scalarRange,
        props.origin,
        props.normal,
      );
      renderer.addActor(cutSlice.actor);
      pipelineRef.current = cutSlice;
      configureCutCamera(genericRenderWindow, props.manifest, props.origin, props.normal);
      genericRenderWindow.getRenderWindow().render();
    }

    if (props.mode === 'three-d' && props.volume && props.segmentation && !pipelineRef.current) {
      const renderer = genericRenderWindow.getRenderer();
      const planeActors = {
        axial: createOrthogonalPlaneActor(props.volume.image, props.manifest, 'axial', props.volume.scalarRange),
        coronal: createOrthogonalPlaneActor(props.volume.image, props.manifest, 'coronal', props.volume.scalarRange),
        sagittal: createOrthogonalPlaneActor(props.volume.image, props.manifest, 'sagittal', props.volume.scalarRange),
      } as const;
      const cutSlice = createCutPlaneSlice(
        props.volume.image,
        props.volume.scalarRange,
        props.cutPlaneOrigin,
        props.cutPlaneNormal,
      );
      const crosshair = createCrosshairActors(props.crosshairWorld, 18);
      const widgetManager = vtkWidgetManager.newInstance();
      widgetManager.setRenderer(renderer);
      const widgetFactory = vtkImplicitPlaneWidget.newInstance();
      widgetFactory.placeWidget(boundsToExtent(props.manifest.bounds.ct));
      widgetFactory.setVisibility(props.cutPlaneVisible);
      widgetFactory.setPickable(props.cutPlaneVisible);
      const widgetState = widgetFactory.getWidgetState();
      widgetState.setOrigin(props.cutPlaneOrigin);
      widgetState.setNormal(props.cutPlaneNormal);
      const widgetSubscription = widgetFactory.onWidgetChange(() => {
        const state = widgetFactory.getWidgetState();
        const nextOrigin = state.getOrigin();
        const nextNormal = state.getNormal();

        if (
          vectorsClose(nextOrigin, cutPlaneRef.current.origin) &&
          vectorsClose(nextNormal, cutPlaneRef.current.normal)
        ) {
          return;
        }

        props.onCutPlaneChange(nextOrigin, nextNormal);
      });
      widgetManager.addWidget(widgetFactory, ViewTypes.GEOMETRY);

      Object.values(planeActors).forEach(({ actor }) => renderer.addActor(actor));
      renderer.addActor(cutSlice.actor);
      crosshair.forEach(({ actor }) => renderer.addActor(actor));
      pipelineRef.current = {
        planeActors: {
          axial: planeActors.axial,
          coronal: planeActors.coronal,
          sagittal: planeActors.sagittal,
        },
        crosshair,
        cutSlice,
        widgetFactory,
        widgetManager,
        widgetSubscription,
        segmentationActors: new Map(),
        selectedActor: null,
        glbImporter: null,
      };
      resetThreeDCamera(genericRenderWindow, props.manifest);
      genericRenderWindow.getRenderWindow().render();
    }
    // The volume / segmentation objects are large and stable for the life of the viewer.
    // Keep them out of the dependency array so React dev logging does not recurse through
    // the entire vtk image graph if an imperative VTK call throws.
  }, [props.mode, Boolean(props.volume), props.mode === 'three-d' ? Boolean(props.segmentation) : false]);

  useEffect(() => {
    const genericRenderWindow = genericRenderWindowRef.current;
    const pipeline = pipelineRef.current;

    if (!genericRenderWindow || !pipeline) {
      return;
    }

    if (props.mode === 'slice' && 'mapper' in pipeline) {
      pipeline.mapper.setSlice(props.planeIndex);
      pipeline.actor.setVisibility(props.visible);
      configureSliceCamera(genericRenderWindow, props.manifest, props.plane, props.planeIndex);
      genericRenderWindow.getRenderWindow().render();
    }

    if (props.mode === 'cut' && 'plane' in pipeline && !('planeActors' in pipeline)) {
      pipeline.plane.setOrigin(props.origin);
      pipeline.plane.setNormal(props.normal);
      pipeline.actor.getProperty().setOpacity(props.opacity);
      pipeline.actor.setVisibility(props.visible);
      configureCutCamera(genericRenderWindow, props.manifest, props.origin, props.normal);
      genericRenderWindow.getRenderWindow().render();
    }

    if (props.mode !== 'three-d' || !('planeActors' in pipeline)) {
      return;
    }

    const renderer = genericRenderWindow.getRenderer();
    pipeline.planeActors.axial.mapper.setSlice(props.planeIndices.axial);
    pipeline.planeActors.coronal.mapper.setSlice(props.planeIndices.coronal);
    pipeline.planeActors.sagittal.mapper.setSlice(props.planeIndices.sagittal);
    pipeline.planeActors.axial.actor.setVisibility(props.planeVisibility.axial);
    pipeline.planeActors.coronal.actor.setVisibility(props.planeVisibility.coronal);
    pipeline.planeActors.sagittal.actor.setVisibility(props.planeVisibility.sagittal);
    updateCrosshairActors(pipeline.crosshair, props.crosshairWorld, 18);
    pipeline.cutSlice.plane.setOrigin(props.cutPlaneOrigin);
    pipeline.cutSlice.plane.setNormal(props.cutPlaneNormal);
    pipeline.cutSlice.actor.getProperty().setOpacity(props.cutPlaneOpacity);
    pipeline.cutSlice.actor.setVisibility(props.cutPlaneVisible);
    const widgetState = pipeline.widgetFactory.getWidgetState();

    if (!vectorsClose(widgetState.getOrigin(), props.cutPlaneOrigin)) {
      widgetState.setOrigin(props.cutPlaneOrigin);
    }

    if (!vectorsClose(widgetState.getNormal(), props.cutPlaneNormal)) {
      widgetState.setNormal(props.cutPlaneNormal);
    }

    pipeline.widgetFactory.setVisibility(props.cutPlaneVisible);
    pipeline.widgetFactory.setPickable(props.cutPlaneVisible);

    const buildGroupActor = (groupKey: string, segments: SegmentationSegment[], color: [number, number, number]) => {
      if (pipeline.segmentationActors.has(groupKey) || !props.segmentation) {
        return;
      }

      const actorBundle = createSegmentationSurfaceActor(
        props.manifest,
        props.segmentation,
        segments,
        color,
        props.overlayOpacity,
        pipeline.cutSlice.plane,
      );

      if (!actorBundle) {
        return;
      }

      renderer.addActor(actorBundle.actor);
      pipeline.segmentationActors.set(groupKey, actorBundle);
    };

    buildGroupActor('airway', visibleGroupMap.get('airway') ?? [], [0.55, 0.93, 0.95]);
    buildGroupActor('vessels', visibleGroupMap.get('vessels') ?? [], [0.91, 0.45, 0.43]);
    buildGroupActor('nodes', visibleGroupMap.get('nodes') ?? [], [0.43, 0.91, 0.62]);
    buildGroupActor('cardiac', visibleGroupMap.get('cardiac') ?? [], [0.92, 0.75, 0.45]);
    buildGroupActor('gi', visibleGroupMap.get('gi') ?? [], [0.86, 0.75, 0.59]);

    pipeline.segmentationActors.forEach((bundle, groupKey) => {
      const segments = visibleGroupMap.get(groupKey) ?? [];
      bundle.actor.setVisibility(segments.length > 0);
      bundle.actor.getProperty().setOpacity(props.overlayOpacity);
    });

    if (pipeline.selectedActor) {
      renderer.removeActor(pipeline.selectedActor.actor);
      pipeline.selectedActor = null;
    }

    if (props.selectedSegments.length > 0 && props.segmentation) {
      pipeline.selectedActor = createSegmentationSurfaceActor(
        props.manifest,
        props.segmentation,
        props.selectedSegments,
        [0.99, 0.92, 0.34],
        Math.min(1, props.overlayOpacity + 0.24),
        pipeline.cutSlice.plane,
      );

      if (pipeline.selectedActor) {
        renderer.addActor(pipeline.selectedActor.actor);
      }
    }

    if (props.showGlb && !pipeline.glbImporter) {
      loadGlbOverlay(renderer, props.manifest, case001AssetUrls.glb)
        .then((importer) => {
          pipeline.glbImporter = importer;
          genericRenderWindow.getRenderWindow().render();
        })
        .catch(() => {
          pipeline.glbImporter = null;
        });
    }

    if (pipeline.glbImporter) {
      pipeline.glbImporter.getActors().forEach((actor) => {
        actor.setVisibility(props.showGlb);
        actor.getProperty().setOpacity(0.28);
      });
    }

    if (props.resetCameraToken > lastResetCameraTokenRef.current) {
      lastResetCameraTokenRef.current = props.resetCameraToken;
      resetThreeDCamera(genericRenderWindow, props.manifest);
    }

    genericRenderWindow.getRenderWindow().render();
  }, [
    props.mode,
    visibleGroupMap,
    props.mode === 'slice' ? props.plane : null,
    props.mode === 'slice' ? props.planeIndex : null,
    props.mode === 'slice' ? props.visible : null,
    props.mode === 'cut' ? props.origin : null,
    props.mode === 'cut' ? props.normal : null,
    props.mode === 'cut' ? props.opacity : null,
    props.mode === 'cut' ? props.visible : null,
    props.mode === 'three-d' ? props.crosshairWorld : null,
    props.mode === 'three-d' ? props.overlayOpacity : null,
    props.mode === 'three-d' ? props.selectedSegments : null,
    props.mode === 'three-d' ? props.visibleSegments : null,
    props.mode === 'three-d' ? props.cutPlaneOrigin : null,
    props.mode === 'three-d' ? props.cutPlaneNormal : null,
    props.mode === 'three-d' ? props.cutPlaneOpacity : null,
    props.mode === 'three-d' ? props.cutPlaneVisible : null,
    props.mode === 'three-d' ? props.showGlb : null,
    props.mode === 'three-d' ? props.resetCameraToken : null,
    props.mode === 'three-d' ? props.planeIndices.axial : null,
    props.mode === 'three-d' ? props.planeIndices.coronal : null,
    props.mode === 'three-d' ? props.planeIndices.sagittal : null,
    props.mode === 'three-d' ? props.planeVisibility.axial : null,
    props.mode === 'three-d' ? props.planeVisibility.coronal : null,
    props.mode === 'three-d' ? props.planeVisibility.sagittal : null,
  ]);

  return <div className={props.className ?? 'case-vtk-viewport'} ref={containerRef} />;
}

```

## File: `apps/web/src/features/knobology/depthField.test.ts`

```typescript
import { describe, expect, it } from 'vitest';

import { getDepthFieldClipPath } from '@/features/knobology/depthField';

describe('getDepthFieldClipPath', () => {
  it('returns a polygon clip path for each supported depth frame', () => {
    expect(getDepthFieldClipPath(0)).toContain('polygon(');
    expect(getDepthFieldClipPath(4)).toContain('polygon(');
  });

  it('returns null when a depth frame has no hidden field metadata', () => {
    expect(getDepthFieldClipPath(-1)).toBeNull();
    expect(getDepthFieldClipPath(8)).toBeNull();
  });
});

```

## File: `apps/web/src/features/knobology/depthField.ts`

```typescript
const KNOBOLOGY_DEPTH_FIELD_CLIP_PATHS = [
  'polygon(25.615% 1.053%, 67.183% 1.443%, 94.352% 97.895%, 0.140% 98.024%, 0.000% 85.928%, 0.000% 85.766%, 25.192% 0.921%)',
  'polygon(33.943% 1.156%, 62.172% 1.158%, 97.034% 98.909%, 1.692% 98.390%, 33.873% 1.416%)',
  'polygon(39.731% 1.132%, 61.960% 0.478%, 93.593% 99.761%, 38.514% 99.761%, 7.126% 99.665%, 39.589% 1.000%)',
  'polygon(41.141% 0.739%, 58.149% 0.610%, 91.658% 99.761%, 83.885% 99.761%, 6.561% 99.407%, 41.141% 0.739%)',
  'polygon(45.907% 0.242%, 11.562% 99.227%, 94.285% 99.488%, 59.234% 0.371%, 45.624% 0.242%)',
] as const;

export function getDepthFieldClipPath(frameIndex: number): string | null {
  return KNOBOLOGY_DEPTH_FIELD_CLIP_PATHS[frameIndex] ?? null;
}

```

## File: `apps/web/src/features/knobology/KnobologyPanel.tsx`

```typescript
import { useEffect, useMemo, useReducer, useState } from 'react';

import { knobologyContent, knobologyControlMeta, knobologyReferenceCards } from '@/content/knobology';
import { getKnobologyMedia } from '@/content/media';
import type { KnobologyControlId } from '@/content/types';
import { getDepthFieldClipPath } from '@/features/knobology/depthField';
import euMe2LayoutData from '@/features/knobology/processor/eu-me2-layout.json';
import { EuMe2Keyboard, type EuMe2Layout } from '@/features/knobology/processor/EuMe2Keyboard';
import {
  buildFrameMetrics,
  createKnobologyFrameState,
  evaluateExercise,
  FREQUENCY_LABELS,
  getDepthFrameIndex,
  reduceKnobologyFrameState,
  type KnobologyProcessorActionId,
} from '@/features/knobology/logic';
import { useLearnerProgress } from '@/lib/progress';

const euMe2Layout = euMe2LayoutData as EuMe2Layout;

const ACCESSIBILITY_TOUCH_ACTIONS: KnobologyProcessorActionId[] = [
  'OPEN_MAIN_MENU',
  'OPEN_IMAGE_ADJUST',
  'TOGGLE_ENHANCE',
  'THE_OFF',
  'THE_P',
  'THE_R',
  'FREQUENCY_DOWN',
  'FREQUENCY_UP',
  'FOCUS_DOWN',
  'FOCUS_UP',
  'OBS_GI',
  'OBS_PB',
  'OBS_RSP',
];

function getControlForAction(actionId: KnobologyProcessorActionId): KnobologyControlId | null {
  switch (actionId) {
    case 'GAIN_DOWN':
    case 'GAIN_UP':
      return 'gain';
    case 'DEPTH_UP':
    case 'FOCUS_CYCLE':
    case 'FOCUS_DOWN':
    case 'FOCUS_UP':
      return 'depth';
    case 'FLOW_MODE':
    case 'B_MODE':
    case 'PW_MODE':
      return 'color-doppler';
    case 'TRACE_MODE':
    case 'MEASURE_MODE':
    case 'MEASURE_SET':
    case 'CLEAR':
      return 'calipers';
    case 'TOGGLE_FREEZE':
    case 'CINE_REVIEW_MODE':
    case 'CINE_STEP_BACK':
    case 'CINE_PLAY_PAUSE':
    case 'CINE_STEP_FORWARD':
      return 'freeze';
    case 'SAVE_REC':
      return 'save';
    default:
      return null;
  }
}

export function KnobologyPanel({ processorDebug = false }: { processorDebug?: boolean }) {
  const { setLastUsedKnobologyControl, setModuleProgress, state: progressState } = useLearnerProgress();
  const [activeExerciseId, setActiveExerciseId] = useState(knobologyContent.controlLabExercises[0]?.id ?? '');
  const [activeControl, setActiveControl] = useState<KnobologyControlId>(
    progressState.lastUsedKnobologyControl ?? 'depth',
  );
  const [referenceFilter, setReferenceFilter] = useState('');
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const activeExercise =
    knobologyContent.controlLabExercises.find((exercise) => exercise.id === activeExerciseId) ??
    knobologyContent.controlLabExercises[0];
  const [frameState, dispatchFrame] = useReducer(reduceKnobologyFrameState, activeExercise, createKnobologyFrameState);

  useEffect(() => {
    dispatchFrame({ type: 'RESET_FOR_EXERCISE', exercise: activeExercise });
  }, [activeExercise]);

  useEffect(() => {
    setLastUsedKnobologyControl(activeControl);
  }, [activeControl, setLastUsedKnobologyControl]);

  useEffect(() => {
    if (!frameState.cinePlaying) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      dispatchFrame({ type: 'PROCESSOR_ACTION', actionId: 'CINE_STEP_FORWARD' });
    }, 420);

    return () => window.clearInterval(timer);
  }, [frameState.cinePlaying]);

  const frameMetrics = buildFrameMetrics(frameState);
  const evaluation = evaluateExercise(activeExercise, frameState);
  const dopplerEnabled = frameState.colorDoppler;
  const safePathSelected = selectedPathId === knobologyContent.dopplerLab.safePathId;
  const depthMedia = getKnobologyMedia('depth');
  const depthFrames = depthMedia.comparisonImages ?? [];
  const depthFrameIndex = depthFrames.length > 0 ? getDepthFrameIndex(frameState.depth, depthFrames.length) : 0;
  const controlLabImage = depthFrames[depthFrameIndex];
  const depthFieldClipPath = getDepthFieldClipPath(depthFrameIndex);
  const dopplerMedia = getKnobologyMedia('color-doppler');
  const dopplerClip =
    dopplerEnabled
      ? dopplerMedia.clips?.[1] ?? dopplerMedia.clips?.[0]
      : dopplerMedia.clips?.[0];
  const filteredReferenceCards = knobologyReferenceCards.filter((card) => {
    const query = referenceFilter.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      card.title.toLowerCase().includes(query) ||
      card.whenToUse.toLowerCase().includes(query) ||
      card.whatChanges.toLowerCase().includes(query)
    );
  });
  const compactTouchButtons = useMemo(
    () =>
      ACCESSIBILITY_TOUCH_ACTIONS.map((actionId) => ({
        actionId,
        label: euMe2Layout.hotspots.find((hotspot) => hotspot.action === actionId)?.label ?? actionId,
      })),
    [],
  );

  function markExerciseSolved() {
    if (evaluation.solved) {
      setModuleProgress('knobology', 55);
    }
  }

  function handleProcessorAction(actionId: KnobologyProcessorActionId) {
    dispatchFrame({ type: 'PROCESSOR_ACTION', actionId });

    const mappedControl = getControlForAction(actionId);

    if (mappedControl) {
      setActiveControl(mappedControl);
    }

    if (actionId === 'SAVE_REC') {
      setModuleProgress('knobology', 70);
    }

    if (actionId === 'FLOW_MODE') {
      setModuleProgress('knobology', 80);
    }

    if (actionId === 'MEASURE_MODE' || actionId === 'MEASURE_SET' || actionId === 'TRACE_MODE') {
      setModuleProgress('knobology', 60);
    }
  }

  function handleControlSelect(controlId: KnobologyControlId) {
    setActiveControl(controlId);

    if (controlId === 'color-doppler') {
      handleProcessorAction(dopplerEnabled ? 'B_MODE' : 'FLOW_MODE');
    }

    if (controlId === 'calipers') {
      handleProcessorAction(frameState.measurementMode === 'measure' && frameState.calipers ? 'CLEAR' : 'MEASURE_MODE');
    }

    if (controlId === 'freeze') {
      handleProcessorAction('TOGGLE_FREEZE');
    }

    if (controlId === 'save') {
      handleProcessorAction('SAVE_REC');
    }
  }

  return (
    <div className="knobology-panel">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Primer</div>
            <h2>Control sequence before you touch the needle</h2>
          </div>
        </div>
        <div className="mini-card-grid">
          {knobologyContent.primerSections.map((section) => (
            <article key={section.id} className="mini-card">
              <div className="mini-card__title">
                <span>{knobologyControlMeta[section.id as KnobologyControlId]?.icon ?? '•'}</span>
                <strong>{section.title}</strong>
              </div>
              <p>{section.summary}</p>
              <div className="mini-card__footer">
                <span>Best move: {section.bestMove}</span>
                <span>Pitfall: {section.pitfall}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Fix The Image</div>
            <h2>Control lab</h2>
          </div>
          <select
            aria-label="Select image rescue exercise"
            className="select"
            onChange={(event) => setActiveExerciseId(event.target.value)}
            value={activeExercise.id}
          >
            {knobologyContent.controlLabExercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.title}
              </option>
            ))}
          </select>
        </div>

        <div className="knobology-lab">
          <div className="knobology-frame">
            <div className="knobology-frame__screen">
              {controlLabImage ? (
                <div className="knobology-frame__image-shell">
                  <img
                    alt="EBUS teaching frame used for the knobology control lab"
                    className="knobology-frame__image knobology-frame__image--base"
                    src={controlLabImage}
                    style={{
                      transform: `translateX(${frameMetrics.imageShiftX}%) scale(${frameMetrics.imageScale})`,
                    }}
                  />
                  {depthFieldClipPath ? (
                    <img
                      alt=""
                      aria-hidden="true"
                      className="knobology-frame__image knobology-frame__image--field"
                      src={controlLabImage}
                      style={{
                        clipPath: depthFieldClipPath,
                        WebkitClipPath: depthFieldClipPath,
                        filter: `brightness(${frameMetrics.realFrameBrightness}) contrast(${frameMetrics.realFrameContrast})`,
                        transform: `translateX(${frameMetrics.imageShiftX}%) scale(${frameMetrics.imageScale})`,
                      }}
                    />
                  ) : (
                    <img
                      alt=""
                      aria-hidden="true"
                      className="knobology-frame__image knobology-frame__image--field"
                      src={controlLabImage}
                      style={{
                        filter: `brightness(${frameMetrics.realFrameBrightness}) contrast(${frameMetrics.realFrameContrast})`,
                        transform: `translateX(${frameMetrics.imageShiftX}%) scale(${frameMetrics.imageScale})`,
                      }}
                    />
                  )}
                </div>
              ) : (
                <>
                  <div className="knobology-frame__sector" style={{ opacity: frameMetrics.brightness }} />
                  <div className="knobology-frame__haze" style={{ opacity: frameMetrics.hazeOpacity }} />
                  <div
                    className="knobology-frame__node"
                    style={{
                      top: `${frameMetrics.nodeY}%`,
                      width: `${frameMetrics.nodeSize}%`,
                      height: `${frameMetrics.nodeSize * 0.62}%`,
                      borderColor: `rgba(225, 241, 255, ${frameMetrics.borderOpacity})`,
                    }}
                  />
                  {Array.from({ length: 42 }).map((_, index) => (
                    <span
                      key={index}
                      className="knobology-frame__speck"
                      style={{
                        left: `${20 + ((index * 17) % 58)}%`,
                        top: `${12 + ((index * 13) % 68)}%`,
                        opacity: 0.08 + ((index % 4) + 1) * 0.04,
                      }}
                    />
                  ))}
                </>
              )}

              <div className="knobology-frame__focus-marker" style={{ top: `${frameMetrics.focusMarkerY}%` }} />
              {frameState.mode === 'pw' ? (
                <div className="knobology-frame__waveform" style={{ opacity: frameMetrics.waveformOpacity }}>
                  {Array.from({ length: 20 }).map((_, index) => (
                    <span
                      key={index}
                      className="knobology-frame__waveform-bar"
                      style={{ height: `${28 + ((index * 17) % 56)}%` }}
                    />
                  ))}
                </div>
              ) : null}
              {dopplerEnabled ? <div className="knobology-frame__doppler" style={{ opacity: frameMetrics.colorSignalOpacity }} /> : null}
              {frameState.calipers ? (
                <div className={`knobology-frame__calipers${frameState.measurementMode === 'trace' ? ' knobology-frame__calipers--trace' : ''}`}>
                  {frameState.measurementPoints > 1 ? <span className="knobology-frame__measure-readout">12.4 mm</span> : null}
                </div>
              ) : null}
              {frameState.pipEnabled && controlLabImage ? (
                <div className="knobology-frame__pip" style={{ opacity: frameMetrics.pipOpacity }}>
                  <img alt="" aria-hidden="true" src={controlLabImage} />
                  <span>PIP</span>
                </div>
              ) : null}
              {frameState.commentCount > 0 ? (
                <div className="knobology-frame__comments">
                  {Array.from({ length: frameState.commentCount }).map((_, index) => (
                    <span
                      key={index}
                      className="knobology-frame__comment"
                      style={{
                        left: `${18 + index * 14}%`,
                        top: `${22 + index * 12}%`,
                      }}
                    >
                      Note {index + 1}
                    </span>
                  ))}
                </div>
              ) : null}
              {frameState.menu !== 'none' ? (
                <div className="knobology-frame__menu">
                  <strong>{frameState.menu === 'main' ? 'Main Menu' : 'Image Adjust'}</strong>
                  <span>Freq {FREQUENCY_LABELS[frameState.frequencyIndex]}</span>
                  <span>T.H.E. {frameState.harmonicMode.toUpperCase()}</span>
                  <span>{frameState.enhanceEnabled ? 'Enhance on' : 'Enhance off'}</span>
                </div>
              ) : null}
              {frameState.frozen || frameState.cineReviewMode ? (
                <div className="knobology-frame__cine-strip">
                  <span>Cine {frameState.cineFrame + 1}/7</span>
                  <div className="knobology-frame__cine-track">
                    <span
                      className="knobology-frame__cine-thumb"
                      style={{ left: `${(frameState.cineFrame / 6) * 100}%` }}
                    />
                  </div>
                  <span>{frameState.cinePlaying ? 'Playing' : 'Paused'}</span>
                </div>
              ) : null}
              <div className="knobology-frame__status">
                <span>D {frameState.depth}</span>
                <span>G {frameState.gain}</span>
                <span>C {frameState.contrast}</span>
                <span>{frameState.mode.toUpperCase()}</span>
                <span>F {FREQUENCY_LABELS[frameState.frequencyIndex]}</span>
                {frameState.frozen ? <span>FRZ</span> : null}
                {frameState.saved ? <span>SAV</span> : null}
                {frameState.pipEnabled ? <span>PIP</span> : null}
              </div>
            </div>
            <div className="knobology-frame__caption">
              <strong>{activeExercise.title}</strong>
              <p>{activeExercise.symptom}</p>
              <p className="knobology-frame__status-line">{frameState.statusMessage}</p>
              {controlLabImage && depthMedia.caption ? <p className="knobology-frame__media-note">{depthMedia.caption}</p> : null}
            </div>
          </div>

          <div className="stack-card knobology-console">
            <div className="eyebrow">Processor</div>
            <EuMe2Keyboard
              activeActionId={frameState.lastActionId}
              debug={processorDebug}
              layout={euMe2Layout}
              onAction={handleProcessorAction}
            />

            <div className="knobology-console__touch-panel">
              <div className="eyebrow">Touch panel mirror</div>
              <div className="button-row button-row--wrap">
                {compactTouchButtons.map((button) => (
                  <button
                    key={button.actionId}
                    className={`control-pill${frameState.lastActionId === button.actionId ? ' control-pill--active' : ''}`}
                    onClick={() => handleProcessorAction(button.actionId)}
                    type="button"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="eyebrow">Instructions</div>
            <p>{activeExercise.instructions}</p>
            <div className="button-row button-row--wrap">
              {(Object.keys(knobologyControlMeta) as KnobologyControlId[]).map((controlId) => (
                <button
                  key={controlId}
                  className={`control-pill${activeControl === controlId ? ' control-pill--active' : ''}`}
                  onClick={() => handleControlSelect(controlId)}
                  type="button"
                >
                  <span>{knobologyControlMeta[controlId].icon}</span>
                  <span>{knobologyControlMeta[controlId].shortLabel}</span>
                </button>
              ))}
            </div>

            <div className="slider-stack">
              {(['depth', 'gain', 'contrast'] as const).map((field) => (
                <label key={field} className="slider-field">
                  <span>{field}</span>
                  <input
                    aria-label={`${field} slider`}
                    max={100}
                    min={0}
                    onChange={(event) => {
                      dispatchFrame({
                        type: 'SET_NUMERIC_FIELD',
                        field,
                        value: Number(event.target.value),
                      });
                      setActiveControl(field);
                    }}
                    type="range"
                    value={frameState[field]}
                  />
                  <strong>{frameState[field]}</strong>
                </label>
              ))}
            </div>

            <div className={`feedback-banner${evaluation.solved ? ' feedback-banner--success' : ''}`}>
              <strong>{evaluation.solved ? 'Solved' : `Score ${evaluation.score}`}</strong>
              <p>{evaluation.feedback}</p>
            </div>

            <div className="button-row">
              <button
                className="button button--ghost"
                onClick={() => dispatchFrame({ type: 'RESET_FOR_EXERCISE', exercise: activeExercise })}
                type="button"
              >
                Reset frame
              </button>
              <button className="button" onClick={markExerciseSolved} type="button">
                Save progress
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Doppler mini-lab</div>
            <h2>{knobologyContent.dopplerLab.title}</h2>
          </div>
        </div>
        <div className="split-grid">
          <div className="stack-card">
            <p>{knobologyContent.dopplerLab.brief}</p>
            <div className="doppler-lab">
              <div className="doppler-lab__frame">
                {dopplerClip ? (
                  <video
                    key={dopplerClip}
                    autoPlay
                    className="doppler-lab__video"
                    controls
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    src={dopplerClip}
                  />
                ) : (
                  <>
                    <div className="doppler-lab__target" />
                    {dopplerEnabled ? <div className="doppler-lab__vessel" /> : null}
                  </>
                )}
                <span className="doppler-lab__state">{dopplerEnabled ? 'Doppler on' : 'Doppler off'}</span>
                <span className="doppler-lab__label">
                  {dopplerMedia.caption ?? 'Toggle Doppler to reveal flow'}
                </span>
              </div>
              <button
                className={`button${dopplerEnabled ? ' button--ghost' : ''}`}
                onClick={() => handleProcessorAction(dopplerEnabled ? 'B_MODE' : 'FLOW_MODE')}
                type="button"
              >
                {dopplerEnabled ? 'Switch to Doppler Off' : 'Switch to Doppler On'}
              </button>
            </div>
          </div>
          <div className="stack-card">
            <div className="eyebrow">Path challenge</div>
            <p>{knobologyContent.dopplerLab.prompt}</p>
            <div className="stack-list">
              {knobologyContent.dopplerLab.paths.map((path) => (
                <button
                  key={path.id}
                  className={`choice-card${selectedPathId === path.id ? ' choice-card--selected' : ''}`}
                  onClick={() => {
                    setSelectedPathId(path.id);
                    if (path.id === knobologyContent.dopplerLab.safePathId) {
                      setModuleProgress('knobology', 90);
                    }
                  }}
                  type="button"
                >
                  <strong>{path.label}</strong>
                  <span>{path.description}</span>
                </button>
              ))}
            </div>
            {selectedPathId ? (
              <div className={`feedback-banner${safePathSelected ? ' feedback-banner--success' : ''}`}>
                <strong>{safePathSelected ? 'Safe path selected' : 'Try again'}</strong>
                <p>
                  {safePathSelected
                    ? 'The selected path routes around the color-filled vessel instead of crossing it.'
                    : 'That path still crosses Doppler signal. Pick the trajectory that avoids the color-filled vessel.'}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Quick reference</div>
            <h2>Searchable control cards</h2>
          </div>
          <input
            aria-label="Filter quick reference cards"
            className="input"
            onChange={(event) => setReferenceFilter(event.target.value)}
            placeholder="Filter by control or scenario"
            type="search"
            value={referenceFilter}
          />
        </div>
        <div className="mini-card-grid">
          {filteredReferenceCards.map((card) => (
            <article key={card.id} className="mini-card">
              <div className="mini-card__title">
                <span>{knobologyControlMeta[card.id].icon}</span>
                <strong>{card.title}</strong>
              </div>
              <p>{card.whenToUse}</p>
              <div className="mini-card__footer">
                <span>{card.whatChanges}</span>
                <span>{card.noviceTrap}</span>
                <span>{getKnobologyMedia(card.id).caption ?? ''}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

```

## File: `apps/web/src/features/knobology/logic.test.ts`

```typescript
import { describe, expect, it } from 'vitest';

import { createKnobologyFrameState, getDepthFrameIndex, reduceKnobologyFrameState } from '@/features/knobology/logic';

const exercise = {
  id: 'test',
  title: 'Test exercise',
  symptom: 'Too dark.',
  instructions: 'Raise gain.',
  focusControl: 'gain' as const,
  start: {
    depth: 40,
    gain: 20,
    contrast: 40,
  },
  target: {
    depth: 40,
    gain: 60,
    contrast: 40,
  },
  successMessage: 'Solved.',
};

describe('getDepthFrameIndex', () => {
  it('maps depth values to the nearest real EBUS depth frame', () => {
    expect(getDepthFrameIndex(0, 5)).toBe(0);
    expect(getDepthFrameIndex(28, 5)).toBe(0);
    expect(getDepthFrameIndex(40, 5)).toBe(1);
    expect(getDepthFrameIndex(68, 5)).toBe(2);
    expect(getDepthFrameIndex(82, 5)).toBe(3);
    expect(getDepthFrameIndex(100, 5)).toBe(4);
  });

  it('falls back safely when only one frame is available', () => {
    expect(getDepthFrameIndex(55, 1)).toBe(0);
  });
});

describe('reduceKnobologyFrameState', () => {
  it('updates the shared simulator state for processor actions', () => {
    let state = createKnobologyFrameState(exercise);

    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'GAIN_UP' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'TOGGLE_PIP' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'TOGGLE_FREEZE' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'CINE_REVIEW_MODE' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'CINE_STEP_FORWARD' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'MEASURE_MODE' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'MEASURE_SET' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'FLOW_MODE' });

    expect(state.gain).toBe(28);
    expect(state.pipEnabled).toBe(true);
    expect(state.frozen).toBe(true);
    expect(state.cineReviewMode).toBe(true);
    expect(state.cineFrame).toBe(1);
    expect(state.calipers).toBe(true);
    expect(state.measurementPoints).toBe(2);
    expect(state.mode).toBe('flow');
    expect(state.colorDoppler).toBe(true);
  });
});

```

## File: `apps/web/src/features/knobology/logic.ts`

```typescript
import type { KnobologyCorrectionExercise } from '@/content/types';

export type KnobologyImagingMode = 'b' | 'flow' | 'pw';
export type KnobologyMeasurementMode = 'off' | 'measure' | 'trace';
export type KnobologyMenuMode = 'none' | 'main' | 'image-adjust';
export type KnobologyHarmonicMode = 'off' | 'p' | 'r';
export type KnobologyObservationPreset = 'GI' | 'PB' | 'RSP' | null;

export type KnobologyProcessorActionId =
  | 'SAVE_REC'
  | 'RELEASE'
  | 'TOGGLE_PIP'
  | 'PW_MODE'
  | 'FLOW_MODE'
  | 'B_MODE'
  | 'CLEAR'
  | 'TRACE_MODE'
  | 'MEASURE_MODE'
  | 'CURSOR_MODE'
  | 'COMMENT_ADD'
  | 'COMMENT_CLEAR'
  | 'MEASURE_SET'
  | 'PAGE_UP'
  | 'HOME'
  | 'END'
  | 'PAGE_DOWN'
  | 'IR_MODE'
  | 'SCROLL_MODE'
  | 'CINE_REVIEW_MODE'
  | 'POWER_DOWN'
  | 'POWER_UP'
  | 'GAIN_DOWN'
  | 'GAIN_UP'
  | 'DEPTH_UP'
  | 'FOCUS_CYCLE'
  | 'CINE_STEP_BACK'
  | 'CINE_PLAY_PAUSE'
  | 'CINE_STEP_FORWARD'
  | 'TOGGLE_FREEZE'
  | 'OPEN_MAIN_MENU'
  | 'OPEN_IMAGE_ADJUST'
  | 'DISPLAY_LEFT'
  | 'DISPLAY_CENTER'
  | 'DISPLAY_RIGHT'
  | 'TOGGLE_ENHANCE'
  | 'THE_OFF'
  | 'THE_P'
  | 'THE_R'
  | 'ELST'
  | 'FREQUENCY_DOWN'
  | 'FREQUENCY_UP'
  | 'FOCUS_DOWN'
  | 'FOCUS_UP'
  | 'OBS_GI'
  | 'OBS_PB'
  | 'OBS_RSP';

export interface KnobologyFrameState {
  depth: number;
  gain: number;
  contrast: number;
  colorDoppler: boolean;
  calipers: boolean;
  frozen: boolean;
  saved: boolean;
  pipEnabled: boolean;
  mode: KnobologyImagingMode;
  measurementMode: KnobologyMeasurementMode;
  measurementPoints: number;
  commentCount: number;
  irMode: boolean;
  scrollMode: boolean;
  cineReviewMode: boolean;
  cineFrame: number;
  cinePlaying: boolean;
  menu: KnobologyMenuMode;
  enhanceEnabled: boolean;
  harmonicMode: KnobologyHarmonicMode;
  acousticPower: number;
  frequencyIndex: number;
  focusIndex: number;
  observationPreset: KnobologyObservationPreset;
  lastActionId: KnobologyProcessorActionId | null;
  statusMessage: string;
}

export interface KnobologyFrameMetrics {
  brightness: number;
  hazeOpacity: number;
  nodeSize: number;
  nodeY: number;
  borderOpacity: number;
  colorSignalOpacity: number;
  realFrameBrightness: number;
  realFrameContrast: number;
  pipOpacity: number;
  waveformOpacity: number;
  focusMarkerY: number;
  imageShiftX: number;
  imageScale: number;
}

export interface ExerciseEvaluation {
  score: number;
  solved: boolean;
  feedback: string;
}

export type KnobologySimulatorAction =
  | {
      type: 'RESET_FOR_EXERCISE';
      exercise: KnobologyCorrectionExercise;
    }
  | {
      type: 'SET_NUMERIC_FIELD';
      field: 'depth' | 'gain' | 'contrast';
      value: number;
    }
  | {
      type: 'SET_COLOR_DOPPLER';
      enabled: boolean;
    }
  | {
      type: 'PROCESSOR_ACTION';
      actionId: KnobologyProcessorActionId;
    };

const DEFAULT_DEPTH_FRAME_LEVELS = [20, 40, 60, 80, 100] as const;
const FOCUS_MARKER_LEVELS = [26, 42, 58, 74] as const;
export const FREQUENCY_LABELS = ['5.0 MHz', '6.5 MHz', '7.5 MHz'] as const;
const CINE_FRAME_COUNT = 7;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function cycleIndex(current: number, length: number, step: number = 1): number {
  return (current + step + length) % length;
}

function cycleDepth(depth: number): number {
  const currentIndex = DEFAULT_DEPTH_FRAME_LEVELS.findIndex((level) => level >= depth);
  const nextIndex = currentIndex >= 0 ? cycleIndex(currentIndex, DEFAULT_DEPTH_FRAME_LEVELS.length) : 0;

  return DEFAULT_DEPTH_FRAME_LEVELS[nextIndex];
}

function withAction(
  state: KnobologyFrameState,
  actionId: KnobologyProcessorActionId,
  patch: Partial<KnobologyFrameState>,
): KnobologyFrameState {
  return {
    ...state,
    ...patch,
    lastActionId: actionId,
  };
}

export function createKnobologyFrameState(exercise: KnobologyCorrectionExercise): KnobologyFrameState {
  return {
    ...exercise.start,
    colorDoppler: false,
    calipers: false,
    frozen: false,
    saved: false,
    pipEnabled: false,
    mode: 'b',
    measurementMode: 'off',
    measurementPoints: 0,
    commentCount: 0,
    irMode: false,
    scrollMode: false,
    cineReviewMode: false,
    cineFrame: 0,
    cinePlaying: false,
    menu: 'none',
    enhanceEnabled: false,
    harmonicMode: 'off',
    acousticPower: 50,
    frequencyIndex: 1,
    focusIndex: 1,
    observationPreset: null,
    lastActionId: null,
    statusMessage: 'Ready',
  };
}

function applyProcessorAction(
  state: KnobologyFrameState,
  actionId: KnobologyProcessorActionId,
): KnobologyFrameState {
  switch (actionId) {
    case 'SAVE_REC':
      return withAction(state, actionId, {
        saved: true,
        statusMessage: 'Saved still frame.',
      });
    case 'RELEASE':
      return withAction(state, actionId, {
        menu: 'none',
        statusMessage: 'Release acknowledged.',
      });
    case 'TOGGLE_PIP':
      return withAction(state, actionId, {
        pipEnabled: !state.pipEnabled,
        statusMessage: state.pipEnabled ? 'PIP closed.' : 'PIP opened.',
      });
    case 'PW_MODE':
      return withAction(state, actionId, {
        mode: 'pw',
        colorDoppler: false,
        cinePlaying: false,
        statusMessage: 'PW mode active.',
      });
    case 'FLOW_MODE':
      return withAction(state, actionId, {
        mode: 'flow',
        colorDoppler: true,
        statusMessage: 'Flow mode active.',
      });
    case 'B_MODE':
      return withAction(state, actionId, {
        mode: 'b',
        colorDoppler: false,
        statusMessage: 'B mode active.',
      });
    case 'CLEAR':
      return withAction(state, actionId, {
        calipers: false,
        measurementMode: 'off',
        measurementPoints: 0,
        commentCount: 0,
        statusMessage: 'Measurements and comments cleared.',
      });
    case 'TRACE_MODE':
      return withAction(state, actionId, {
        calipers: false,
        measurementMode: 'trace',
        measurementPoints: 0,
        statusMessage: 'Trace mode ready.',
      });
    case 'MEASURE_MODE':
      return withAction(state, actionId, {
        calipers: true,
        measurementMode: 'measure',
        measurementPoints: Math.max(1, state.measurementPoints),
        statusMessage: 'Measure mode active.',
      });
    case 'COMMENT_ADD':
      return withAction(state, actionId, {
        commentCount: Math.min(3, state.commentCount + 1),
        statusMessage: 'Comment marker added.',
      });
    case 'COMMENT_CLEAR':
      return withAction(state, actionId, {
        commentCount: 0,
        statusMessage: 'Comments cleared.',
      });
    case 'MEASURE_SET':
      return withAction(state, actionId, {
        calipers: true,
        measurementMode: state.measurementMode === 'trace' ? 'trace' : 'measure',
        measurementPoints: clamp(state.measurementPoints + 1, 1, 2),
        statusMessage: 'Measurement set.',
      });
    case 'IR_MODE':
      return withAction(state, actionId, {
        irMode: !state.irMode,
        statusMessage: state.irMode ? 'I.R. off.' : 'I.R. on.',
      });
    case 'SCROLL_MODE':
      return withAction(state, actionId, {
        scrollMode: !state.scrollMode,
        statusMessage: state.scrollMode ? 'Scroll off.' : 'Scroll on.',
      });
    case 'CINE_REVIEW_MODE':
      return withAction(state, actionId, {
        cineReviewMode: !state.cineReviewMode,
        cinePlaying: false,
        frozen: true,
        statusMessage: state.cineReviewMode ? 'Cine review off.' : 'Cine review on.',
      });
    case 'POWER_DOWN':
      return withAction(state, actionId, {
        acousticPower: clamp(state.acousticPower - 10, 0, 100),
        statusMessage: 'Acoustic output reduced.',
      });
    case 'POWER_UP':
      return withAction(state, actionId, {
        acousticPower: clamp(state.acousticPower + 10, 0, 100),
        statusMessage: 'Acoustic output increased.',
      });
    case 'GAIN_DOWN':
      return withAction(state, actionId, {
        gain: clamp(state.gain - 8, 0, 100),
        statusMessage: 'Gain decreased.',
      });
    case 'GAIN_UP':
      return withAction(state, actionId, {
        gain: clamp(state.gain + 8, 0, 100),
        statusMessage: 'Gain increased.',
      });
    case 'DEPTH_UP':
      return withAction(state, actionId, {
        depth: cycleDepth(state.depth),
        statusMessage: 'Depth advanced.',
      });
    case 'FOCUS_CYCLE':
      return withAction(state, actionId, {
        focusIndex: cycleIndex(state.focusIndex, FOCUS_MARKER_LEVELS.length),
        statusMessage: 'Focus target cycled.',
      });
    case 'CINE_STEP_BACK':
      return withAction(state, actionId, {
        cineReviewMode: true,
        cinePlaying: false,
        frozen: true,
        cineFrame: cycleIndex(state.cineFrame, CINE_FRAME_COUNT, -1),
        statusMessage: 'Cine stepped backward.',
      });
    case 'CINE_PLAY_PAUSE':
      return withAction(state, actionId, {
        cineReviewMode: true,
        frozen: true,
        cinePlaying: !state.cinePlaying,
        statusMessage: state.cinePlaying ? 'Cine paused.' : 'Cine playing.',
      });
    case 'CINE_STEP_FORWARD':
      return withAction(state, actionId, {
        cineReviewMode: true,
        cinePlaying: state.cinePlaying,
        frozen: true,
        cineFrame: cycleIndex(state.cineFrame, CINE_FRAME_COUNT, 1),
        statusMessage: 'Cine stepped forward.',
      });
    case 'TOGGLE_FREEZE':
      return withAction(state, actionId, {
        frozen: !state.frozen,
        cinePlaying: false,
        statusMessage: state.frozen ? 'Live imaging resumed.' : 'Image frozen.',
      });
    case 'OPEN_MAIN_MENU':
      return withAction(state, actionId, {
        menu: state.menu === 'main' ? 'none' : 'main',
        statusMessage: state.menu === 'main' ? 'Main menu closed.' : 'Main menu opened.',
      });
    case 'OPEN_IMAGE_ADJUST':
      return withAction(state, actionId, {
        menu: state.menu === 'image-adjust' ? 'none' : 'image-adjust',
        statusMessage: state.menu === 'image-adjust' ? 'Image adjust closed.' : 'Image adjust opened.',
      });
    case 'TOGGLE_ENHANCE':
      return withAction(state, actionId, {
        enhanceEnabled: !state.enhanceEnabled,
        statusMessage: state.enhanceEnabled ? 'Enhance off.' : 'Enhance on.',
      });
    case 'THE_OFF':
      return withAction(state, actionId, {
        harmonicMode: 'off',
        statusMessage: 'T.H.E. off.',
      });
    case 'THE_P':
      return withAction(state, actionId, {
        harmonicMode: 'p',
        statusMessage: 'T.H.E. P selected.',
      });
    case 'THE_R':
      return withAction(state, actionId, {
        harmonicMode: 'r',
        statusMessage: 'T.H.E. R selected.',
      });
    case 'FREQUENCY_DOWN':
      return withAction(state, actionId, {
        frequencyIndex: clamp(state.frequencyIndex - 1, 0, FREQUENCY_LABELS.length - 1),
        statusMessage: 'Frequency decreased.',
      });
    case 'FREQUENCY_UP':
      return withAction(state, actionId, {
        frequencyIndex: clamp(state.frequencyIndex + 1, 0, FREQUENCY_LABELS.length - 1),
        statusMessage: 'Frequency increased.',
      });
    case 'FOCUS_DOWN':
      return withAction(state, actionId, {
        focusIndex: clamp(state.focusIndex - 1, 0, FOCUS_MARKER_LEVELS.length - 1),
        statusMessage: 'Focus moved shallower.',
      });
    case 'FOCUS_UP':
      return withAction(state, actionId, {
        focusIndex: clamp(state.focusIndex + 1, 0, FOCUS_MARKER_LEVELS.length - 1),
        statusMessage: 'Focus moved deeper.',
      });
    case 'OBS_GI':
      return withAction(state, actionId, {
        observationPreset: 'GI',
        statusMessage: 'Observation preset GI.',
      });
    case 'OBS_PB':
      return withAction(state, actionId, {
        observationPreset: 'PB',
        statusMessage: 'Observation preset PB.',
      });
    case 'OBS_RSP':
      return withAction(state, actionId, {
        observationPreset: 'RSP',
        statusMessage: 'Observation preset RSP.',
      });
    default:
      return withAction(state, actionId, {
        statusMessage: `${actionId.replace(/_/g, ' ')} not linked yet.`,
      });
  }
}

export function reduceKnobologyFrameState(
  state: KnobologyFrameState,
  action: KnobologySimulatorAction,
): KnobologyFrameState {
  switch (action.type) {
    case 'RESET_FOR_EXERCISE':
      return createKnobologyFrameState(action.exercise);
    case 'SET_NUMERIC_FIELD':
      return {
        ...state,
        [action.field]: clamp(action.value, 0, 100),
        lastActionId: null,
      };
    case 'SET_COLOR_DOPPLER':
      return {
        ...state,
        colorDoppler: action.enabled,
        mode: action.enabled ? 'flow' : state.mode === 'flow' ? 'b' : state.mode,
        lastActionId: null,
      };
    case 'PROCESSOR_ACTION':
      return applyProcessorAction(state, action.actionId);
    default:
      return state;
  }
}

export function getDepthFrameIndex(
  depth: number,
  frameCount: number = DEFAULT_DEPTH_FRAME_LEVELS.length,
): number {
  if (frameCount <= 1) {
    return 0;
  }

  const clampedDepth = Math.max(0, Math.min(100, depth));
  const frameLevels =
    frameCount === DEFAULT_DEPTH_FRAME_LEVELS.length
      ? [...DEFAULT_DEPTH_FRAME_LEVELS]
      : Array.from({ length: frameCount }, (_, index) => Math.round(((index + 1) / frameCount) * 100));

  return frameLevels.reduce((closestIndex, level, index) => {
    const closestDelta = Math.abs(frameLevels[closestIndex] - clampedDepth);
    const currentDelta = Math.abs(level - clampedDepth);

    return currentDelta < closestDelta ? index : closestIndex;
  }, 0);
}

export function buildFrameMetrics(state: KnobologyFrameState): KnobologyFrameMetrics {
  const harmonicBoost = state.harmonicMode === 'off' ? 0 : state.harmonicMode === 'p' ? 0.08 : 0.12;

  return {
    brightness: 0.16 + state.gain / 135,
    hazeOpacity: 0.08 + (100 - state.contrast) / 200 - (state.enhanceEnabled ? 0.03 : 0),
    nodeSize: 26 + (100 - state.depth) * 0.52,
    nodeY: 16 + state.depth * 0.58,
    borderOpacity: Math.min(0.82, 0.18 + state.contrast / 140 + harmonicBoost / 2),
    colorSignalOpacity: state.colorDoppler ? 0.78 : 0,
    realFrameBrightness: 0.48 + state.gain / 82 + (state.acousticPower - 50) / 240,
    realFrameContrast: 0.64 + state.contrast / 92 + (state.enhanceEnabled ? 0.14 : 0) + harmonicBoost,
    pipOpacity: state.pipEnabled ? 1 : 0,
    waveformOpacity: state.mode === 'pw' ? 0.88 : 0,
    focusMarkerY: FOCUS_MARKER_LEVELS[state.focusIndex],
    imageShiftX: (state.cineFrame - Math.floor(CINE_FRAME_COUNT / 2)) * 2.4,
    imageScale: 1 + state.frequencyIndex * 0.018,
  };
}

export function evaluateExercise(
  exercise: KnobologyCorrectionExercise,
  state: KnobologyFrameState,
): ExerciseEvaluation {
  const deltas = {
    depth: Math.abs(state.depth - exercise.target.depth),
    gain: Math.abs(state.gain - exercise.target.gain),
    contrast: Math.abs(state.contrast - exercise.target.contrast),
  };
  const totalDelta = deltas.depth + deltas.gain + deltas.contrast;
  const solved = totalDelta <= 24 && deltas[exercise.focusControl] <= 8;
  const score = Math.max(0, Math.round(100 - totalDelta * 1.25));

  if (solved) {
    return {
      score,
      solved: true,
      feedback: exercise.successMessage,
    };
  }

  if (exercise.focusControl === 'depth') {
    return {
      score,
      solved: false,
      feedback:
        state.depth < exercise.target.depth
          ? 'Increase depth until the target settles closer to the middle of the frame.'
          : 'Trim depth slightly so the node is not buried in unused space.',
    };
  }

  if (exercise.focusControl === 'gain') {
    return {
      score,
      solved: false,
      feedback:
        state.gain < exercise.target.gain
          ? 'The frame is still too dark. Raise gain until the border becomes readable.'
          : 'Back gain down a little. The image is starting to look washed out.',
    };
  }

  return {
    score,
    solved: false,
    feedback:
      state.contrast < exercise.target.contrast
        ? 'Increase contrast to recover edge definition.'
        : 'The frame has enough contrast. Fine-tune gain so the border stays clean.',
  };
}

```

## File: `apps/web/src/features/knobology/processor/eu-me2-layout.json`

```json
{
  "image": {
    "src": "/media/knobology/eu-me2/EU-ME2.jpg",
    "width": 2048,
    "height": 1098,
    "notes": "Starter hotspot layout using normalized coordinates. Values are approximate and should be tuned visually in-browser."
  },
  "trackball": {
    "cx": 0.469,
    "cy": 0.783,
    "r": 0.06
  },
  "regions": {
    "touchPanel": {
      "x": 0.659,
      "y": 0.043,
      "w": 0.281,
      "h": 0.432
    },
    "imageControlCluster": {
      "x": 0.718,
      "y": 0.661,
      "w": 0.159,
      "h": 0.256
    },
    "cineReviewCluster": {
      "x": 0.876,
      "y": 0.713,
      "w": 0.103,
      "h": 0.123
    }
  },
  "hotspots": [
    {
      "id": "save_rec",
      "label": "SAVE/REC",
      "shape": "rect",
      "x": 0.03,
      "y": 0.682,
      "w": 0.093,
      "h": 0.114,
      "action": "SAVE_REC"
    },
    {
      "id": "release",
      "label": "RELEASE",
      "shape": "rect",
      "x": 0.03,
      "y": 0.845,
      "w": 0.093,
      "h": 0.11,
      "action": "RELEASE"
    },
    {
      "id": "pip",
      "label": "PIP",
      "shape": "circle",
      "cx": 0.183,
      "cy": 0.777,
      "r": 0.023,
      "action": "TOGGLE_PIP"
    },
    {
      "id": "pw",
      "label": "PW",
      "shape": "circle",
      "cx": 0.264,
      "cy": 0.777,
      "r": 0.023,
      "action": "PW_MODE"
    },
    {
      "id": "flow",
      "label": "FLOW",
      "shape": "circle",
      "cx": 0.264,
      "cy": 0.859,
      "r": 0.023,
      "action": "FLOW_MODE"
    },
    {
      "id": "b_mode",
      "label": "B",
      "shape": "circle",
      "cx": 0.264,
      "cy": 0.944,
      "r": 0.023,
      "action": "B_MODE"
    },
    {
      "id": "clear",
      "label": "CLEAR",
      "shape": "circle",
      "cx": 0.346,
      "cy": 0.777,
      "r": 0.023,
      "action": "CLEAR"
    },
    {
      "id": "trace",
      "label": "TRACE",
      "shape": "circle",
      "cx": 0.346,
      "cy": 0.859,
      "r": 0.023,
      "action": "TRACE_MODE"
    },
    {
      "id": "caliper",
      "label": "CALIPER",
      "shape": "circle",
      "cx": 0.346,
      "cy": 0.944,
      "r": 0.023,
      "action": "MEASURE_MODE"
    },
    {
      "id": "cursor",
      "label": "CURSOR",
      "shape": "circle",
      "cx": 0.424,
      "cy": 0.777,
      "r": 0.023,
      "action": "CURSOR_MODE"
    },
    {
      "id": "comment_add",
      "label": "COMMENT ADD",
      "shape": "circle",
      "cx": 0.47,
      "cy": 0.762,
      "r": 0.022,
      "action": "COMMENT_ADD"
    },
    {
      "id": "comment_clear",
      "label": "COMMENT CLEAR",
      "shape": "circle",
      "cx": 0.52,
      "cy": 0.762,
      "r": 0.022,
      "action": "COMMENT_CLEAR"
    },
    {
      "id": "set",
      "label": "SET",
      "shape": "circle",
      "cx": 0.426,
      "cy": 0.944,
      "r": 0.023,
      "action": "MEASURE_SET"
    },
    {
      "id": "pg_up",
      "label": "PgUp",
      "shape": "circle",
      "cx": 0.598,
      "cy": 0.692,
      "r": 0.024,
      "action": "PAGE_UP"
    },
    {
      "id": "home",
      "label": "Home",
      "shape": "circle",
      "cx": 0.566,
      "cy": 0.735,
      "r": 0.024,
      "action": "HOME"
    },
    {
      "id": "end",
      "label": "End",
      "shape": "circle",
      "cx": 0.629,
      "cy": 0.735,
      "r": 0.024,
      "action": "END"
    },
    {
      "id": "pg_dn",
      "label": "PgDn",
      "shape": "circle",
      "cx": 0.598,
      "cy": 0.78,
      "r": 0.024,
      "action": "PAGE_DOWN"
    },
    {
      "id": "lr",
      "label": "L.R.",
      "shape": "circle",
      "cx": 0.57,
      "cy": 0.901,
      "r": 0.025,
      "action": "IR_MODE"
    },
    {
      "id": "scroll",
      "label": "SCROLL",
      "shape": "circle",
      "cx": 0.62,
      "cy": 0.901,
      "r": 0.025,
      "action": "SCROLL_MODE"
    },
    {
      "id": "cine_review_mode",
      "label": "CINE REVIEW",
      "shape": "circle",
      "cx": 0.675,
      "cy": 0.901,
      "r": 0.025,
      "action": "CINE_REVIEW_MODE"
    },
    {
      "id": "acoustic_output_minus",
      "label": "ACOUSTIC OUTPUT -",
      "shape": "circle",
      "cx": 0.742,
      "cy": 0.719,
      "r": 0.027,
      "action": "POWER_DOWN"
    },
    {
      "id": "acoustic_output_plus",
      "label": "ACOUSTIC OUTPUT +",
      "shape": "circle",
      "cx": 0.822,
      "cy": 0.719,
      "r": 0.027,
      "action": "POWER_UP"
    },
    {
      "id": "gain_minus",
      "label": "GAIN -",
      "shape": "circle",
      "cx": 0.742,
      "cy": 0.808,
      "r": 0.027,
      "action": "GAIN_DOWN"
    },
    {
      "id": "gain_plus",
      "label": "GAIN +",
      "shape": "circle",
      "cx": 0.822,
      "cy": 0.808,
      "r": 0.027,
      "action": "GAIN_UP"
    },
    {
      "id": "depth_range_ir",
      "label": "DEPTH/RANGE I.R.",
      "shape": "circle",
      "cx": 0.737,
      "cy": 0.892,
      "r": 0.028,
      "action": "IR_MODE"
    },
    {
      "id": "depth_range_focus",
      "label": "DEPTH/RANGE FOCUS",
      "shape": "circle",
      "cx": 0.782,
      "cy": 0.892,
      "r": 0.028,
      "action": "FOCUS_CYCLE"
    },
    {
      "id": "depth_range_range",
      "label": "DEPTH/RANGE +/-",
      "shape": "circle",
      "cx": 0.828,
      "cy": 0.892,
      "r": 0.028,
      "action": "DEPTH_UP"
    },
    {
      "id": "cine_left",
      "label": "CINE LEFT",
      "shape": "circle",
      "cx": 0.888,
      "cy": 0.766,
      "r": 0.028,
      "action": "CINE_STEP_BACK"
    },
    {
      "id": "cine_center",
      "label": "CINE CENTER",
      "shape": "circle",
      "cx": 0.927,
      "cy": 0.766,
      "r": 0.028,
      "action": "CINE_PLAY_PAUSE"
    },
    {
      "id": "cine_right",
      "label": "CINE RIGHT",
      "shape": "circle",
      "cx": 0.966,
      "cy": 0.766,
      "r": 0.028,
      "action": "CINE_STEP_FORWARD"
    },
    {
      "id": "freeze",
      "label": "FREEZE",
      "shape": "rect",
      "x": 0.915,
      "y": 0.841,
      "w": 0.074,
      "h": 0.104,
      "action": "TOGGLE_FREEZE"
    },
    {
      "id": "touch_main_menu",
      "label": "MAIN MENU",
      "shape": "rect",
      "x": 0.68,
      "y": 0.045,
      "w": 0.06,
      "h": 0.065,
      "action": "OPEN_MAIN_MENU"
    },
    {
      "id": "touch_image_adjust",
      "label": "IMAGE ADJUST",
      "shape": "rect",
      "x": 0.742,
      "y": 0.045,
      "w": 0.062,
      "h": 0.065,
      "action": "OPEN_IMAGE_ADJUST"
    },
    {
      "id": "touch_dir",
      "label": "DIR",
      "shape": "circle",
      "cx": 0.705,
      "cy": 0.195,
      "r": 0.022,
      "action": "IR_MODE"
    },
    {
      "id": "touch_display_left",
      "label": "DISPLAY AREA LEFT",
      "shape": "rect",
      "x": 0.749,
      "y": 0.173,
      "w": 0.047,
      "h": 0.05,
      "action": "DISPLAY_LEFT"
    },
    {
      "id": "touch_display_center",
      "label": "DISPLAY AREA CENTER",
      "shape": "rect",
      "x": 0.798,
      "y": 0.173,
      "w": 0.047,
      "h": 0.05,
      "action": "DISPLAY_CENTER"
    },
    {
      "id": "touch_display_right",
      "label": "DISPLAY AREA RIGHT",
      "shape": "rect",
      "x": 0.847,
      "y": 0.173,
      "w": 0.047,
      "h": 0.05,
      "action": "DISPLAY_RIGHT"
    },
    {
      "id": "touch_enhance",
      "label": "ENHANCE",
      "shape": "circle",
      "cx": 0.705,
      "cy": 0.338,
      "r": 0.022,
      "action": "TOGGLE_ENHANCE"
    },
    {
      "id": "touch_the_off",
      "label": "THE OFF",
      "shape": "rect",
      "x": 0.752,
      "y": 0.316,
      "w": 0.047,
      "h": 0.055,
      "action": "THE_OFF"
    },
    {
      "id": "touch_the_p",
      "label": "THE P",
      "shape": "rect",
      "x": 0.8,
      "y": 0.316,
      "w": 0.047,
      "h": 0.055,
      "action": "THE_P"
    },
    {
      "id": "touch_the_r",
      "label": "THE R",
      "shape": "rect",
      "x": 0.849,
      "y": 0.316,
      "w": 0.047,
      "h": 0.055,
      "action": "THE_R"
    },
    {
      "id": "touch_elst",
      "label": "ELST",
      "shape": "circle",
      "cx": 0.904,
      "cy": 0.336,
      "r": 0.021,
      "action": "ELST"
    },
    {
      "id": "touch_freq_minus",
      "label": "FREQUENCY -",
      "shape": "circle",
      "cx": 0.704,
      "cy": 0.469,
      "r": 0.024,
      "action": "FREQUENCY_DOWN"
    },
    {
      "id": "touch_freq_plus",
      "label": "FREQUENCY +",
      "shape": "circle",
      "cx": 0.772,
      "cy": 0.469,
      "r": 0.024,
      "action": "FREQUENCY_UP"
    },
    {
      "id": "touch_focus_down",
      "label": "FOCUS DEPTH DOWN",
      "shape": "circle",
      "cx": 0.836,
      "cy": 0.469,
      "r": 0.024,
      "action": "FOCUS_DOWN"
    },
    {
      "id": "touch_focus_up",
      "label": "FOCUS DEPTH UP",
      "shape": "circle",
      "cx": 0.895,
      "cy": 0.469,
      "r": 0.024,
      "action": "FOCUS_UP"
    },
    {
      "id": "touch_observation_gi",
      "label": "GI",
      "shape": "rect",
      "x": 0.887,
      "y": 0.408,
      "w": 0.045,
      "h": 0.023,
      "action": "OBS_GI"
    },
    {
      "id": "touch_observation_pb",
      "label": "PB",
      "shape": "rect",
      "x": 0.887,
      "y": 0.433,
      "w": 0.045,
      "h": 0.023,
      "action": "OBS_PB"
    },
    {
      "id": "touch_observation_rsp",
      "label": "RSP",
      "shape": "rect",
      "x": 0.887,
      "y": 0.458,
      "w": 0.045,
      "h": 0.023,
      "action": "OBS_RSP"
    }
  ]
}
```

## File: `apps/web/src/features/knobology/processor/EuMe2Keyboard.tsx`

```typescript
import { useState } from 'react';

import type { KnobologyProcessorActionId } from '@/features/knobology/logic';

interface EuMe2ImageMeta {
  src: string;
  width: number;
  height: number;
  notes?: string;
}

interface EuMe2Trackball {
  cx: number;
  cy: number;
  r: number;
}

interface EuMe2Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface EuMe2RectHotspot {
  id: string;
  label: string;
  shape: 'rect';
  x: number;
  y: number;
  w: number;
  h: number;
  action: KnobologyProcessorActionId;
}

interface EuMe2CircleHotspot {
  id: string;
  label: string;
  shape: 'circle';
  cx: number;
  cy: number;
  r: number;
  action: KnobologyProcessorActionId;
}

export type EuMe2Hotspot = EuMe2RectHotspot | EuMe2CircleHotspot;

export interface EuMe2Layout {
  image: EuMe2ImageMeta;
  trackball: EuMe2Trackball;
  regions: Record<string, EuMe2Region>;
  hotspots: EuMe2Hotspot[];
}

function getHotspotStyle(hotspot: EuMe2Hotspot) {
  if (hotspot.shape === 'rect') {
    return {
      left: `${hotspot.x * 100}%`,
      top: `${hotspot.y * 100}%`,
      width: `${hotspot.w * 100}%`,
      height: `${hotspot.h * 100}%`,
    };
  }

  return {
    left: `${(hotspot.cx - hotspot.r) * 100}%`,
    top: `${(hotspot.cy - hotspot.r) * 100}%`,
    width: `${hotspot.r * 200}%`,
    height: `${hotspot.r * 200}%`,
    borderRadius: '999px',
  };
}

export function EuMe2Keyboard({
  activeActionId,
  debug = false,
  layout,
  onAction,
}: {
  activeActionId?: KnobologyProcessorActionId | null;
  debug?: boolean;
  layout: EuMe2Layout;
  onAction: (actionId: KnobologyProcessorActionId) => void;
}) {
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [pressedHotspotId, setPressedHotspotId] = useState<string | null>(null);

  return (
    <figure className={`eu-me2${debug ? ' eu-me2--debug' : ''}`}>
      <div className="eu-me2__frame" style={{ aspectRatio: `${layout.image.width} / ${layout.image.height}` }}>
        <img alt="Olympus EU-ME2 processor keyboard" className="eu-me2__image" src={layout.image.src} />
        <div className="eu-me2__overlay">
          {debug ? (
            <>
              <div
                className="eu-me2__trackball"
                style={{
                  left: `${(layout.trackball.cx - layout.trackball.r) * 100}%`,
                  top: `${(layout.trackball.cy - layout.trackball.r) * 100}%`,
                  width: `${layout.trackball.r * 200}%`,
                  height: `${layout.trackball.r * 200}%`,
                }}
              >
                <span>Trackball</span>
              </div>
              {Object.entries(layout.regions).map(([regionId, region]) => (
                <div
                  key={regionId}
                  className="eu-me2__region"
                  style={{
                    left: `${region.x * 100}%`,
                    top: `${region.y * 100}%`,
                    width: `${region.w * 100}%`,
                    height: `${region.h * 100}%`,
                  }}
                >
                  <span>{regionId}</span>
                </div>
              ))}
            </>
          ) : null}

          {layout.hotspots.map((hotspot) => {
            const isActive =
              hoveredHotspotId === hotspot.id ||
              pressedHotspotId === hotspot.id ||
              activeActionId === hotspot.action;

            return (
              <button
                key={hotspot.id}
                aria-label={`${hotspot.label} (${hotspot.action})`}
                aria-pressed={activeActionId === hotspot.action}
                className={`eu-me2__hotspot eu-me2__hotspot--${hotspot.shape}${isActive ? ' eu-me2__hotspot--active' : ''}`}
                onBlur={() => setHoveredHotspotId((current) => (current === hotspot.id ? null : current))}
                onClick={() => onAction(hotspot.action)}
                onFocus={() => setHoveredHotspotId(hotspot.id)}
                onMouseEnter={() => setHoveredHotspotId(hotspot.id)}
                onMouseLeave={() => {
                  setHoveredHotspotId((current) => (current === hotspot.id ? null : current));
                  setPressedHotspotId((current) => (current === hotspot.id ? null : current));
                }}
                onPointerDown={() => setPressedHotspotId(hotspot.id)}
                onPointerUp={() => setPressedHotspotId((current) => (current === hotspot.id ? null : current))}
                style={getHotspotStyle(hotspot)}
                type="button"
              >
                <span className="sr-only">{hotspot.label}</span>
                {debug ? (
                  <span className="eu-me2__hotspot-label">
                    {hotspot.label}
                    <small>{hotspot.action}</small>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
      <figcaption className="eu-me2__caption">{layout.image.notes}</figcaption>
    </figure>
  );
}

```

## File: `apps/web/src/features/lectures/LectureCard.tsx`

```typescript
import { useState } from 'react';

import type { LectureManifestItem } from '@/content/types';
import type { LectureWatchState } from '@/lib/progress';

export function LectureCard({
  lecture,
  watchState,
  onMarkReviewed,
}: {
  lecture: LectureManifestItem;
  watchState?: LectureWatchState;
  onMarkReviewed: (lectureId: string) => void;
}) {
  const [posterBroken, setPosterBroken] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const isLocked = lecture.status === 'locked';

  return (
    <article className={`lecture-card${isLocked ? ' lecture-card--locked' : ''}`}>
      <div className="lecture-card__header">
        <div>
          <div className="eyebrow">{lecture.week}</div>
          <h3>{lecture.title}</h3>
          <p>{lecture.subtitle}</p>
        </div>
        <div className="lecture-card__meta">
          <span>{lecture.duration}</span>
          <span>{watchState?.completed ? 'Reviewed' : isLocked ? 'Locked' : 'Ready'}</span>
        </div>
      </div>

      <div className="lecture-card__media">
        {lecture.poster && !posterBroken ? (
          <img
            alt={`${lecture.title} poster`}
            onError={() => setPosterBroken(true)}
            src={lecture.poster}
          />
        ) : (
          <div className="lecture-card__placeholder">
            <strong>Poster slot ready</strong>
            <span>{lecture.poster ?? 'Add poster path in lectures.json'}</span>
          </div>
        )}
      </div>

      <div className="tag-row">
        {lecture.topics.map((topic) => (
          <span key={topic} className="tag">
            {topic}
          </span>
        ))}
      </div>

      {!isLocked ? (
        <div className="lecture-card__actions">
          <button className="button button--ghost" onClick={() => setVideoExpanded((current) => !current)} type="button">
            {videoExpanded ? 'Hide player' : 'Open player'}
          </button>
          <button className="button" onClick={() => onMarkReviewed(lecture.id)} type="button">
            {watchState?.completed ? 'Reviewed' : 'Mark reviewed'}
          </button>
        </div>
      ) : null}

      {videoExpanded && !isLocked ? (
        <div className="lecture-card__player">
          {lecture.embedUrl ? (
            <iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" src={lecture.embedUrl} title={lecture.title} />
          ) : lecture.video ? (
            <video controls preload="metadata" src={lecture.video} />
          ) : (
            <div className="lecture-card__placeholder">
              <strong>Video slot ready</strong>
              <span>{lecture.video ?? 'Add local MP4 or embedUrl in lectures.json'}</span>
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
}

```

## File: `apps/web/src/features/quiz/QuizCard.tsx`

```typescript
import { useState } from 'react';

import { QuizExplanationPanel } from '@/components/education/EducationModuleRenderer';
import type { QuizQuestionContent } from '@/content/types';
import { calculateQuizResult, isQuizAnswerCorrect } from '@/lib/quiz';

function canSubmitQuestion(question: QuizQuestionContent, selectedOptionIds: string[]): boolean {
  if (question.type === 'ordering') {
    return selectedOptionIds.length === question.options.length;
  }

  return selectedOptionIds.length > 0;
}

function toggleMultiSelection(current: string[], optionId: string): string[] {
  return current.includes(optionId) ? current.filter((entry) => entry !== optionId) : [...current, optionId];
}

function toggleOrderingSelection(current: string[], optionId: string): string[] {
  return current.includes(optionId) ? current.filter((entry) => entry !== optionId) : [...current, optionId];
}

export function QuizCard({
  questions,
  label,
  onComplete,
}: {
  questions: QuizQuestionContent[];
  label: string;
  onComplete?: (result: ReturnType<typeof calculateQuizResult>) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[] | undefined>>({});
  const [draftSelections, setDraftSelections] = useState<Record<string, string[] | undefined>>({});
  const [completionRecorded, setCompletionRecorded] = useState(false);
  const currentQuestion = questions[currentIndex];
  const finalizedSelection = currentQuestion ? answers[currentQuestion.id] ?? [] : [];
  const draftSelection = currentQuestion ? draftSelections[currentQuestion.id] ?? [] : [];
  const currentSelection = finalizedSelection.length > 0 ? finalizedSelection : draftSelection;
  const answeredCurrent = Boolean(currentQuestion && finalizedSelection.length > 0);
  const result = calculateQuizResult(questions, answers);

  if (questions.length === 0 || !currentQuestion) {
    return null;
  }

  function updateDraft(nextSelection: string[]) {
    if (answeredCurrent) {
      return;
    }

    setDraftSelections((current) => ({
      ...current,
      [currentQuestion.id]: nextSelection,
    }));
  }

  function handleSelect(optionId: string) {
    if (answeredCurrent) {
      return;
    }

    if (currentQuestion.type === 'multi-select') {
      updateDraft(toggleMultiSelection(currentSelection, optionId));
      return;
    }

    if (currentQuestion.type === 'ordering') {
      updateDraft(toggleOrderingSelection(currentSelection, optionId));
      return;
    }

    updateDraft([optionId]);
  }

  function submitCurrentQuestion() {
    if (!canSubmitQuestion(currentQuestion, currentSelection) || answeredCurrent) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: currentSelection,
    }));
  }

  function recordCompletion() {
    if (completionRecorded) {
      return;
    }

    setCompletionRecorded(true);
    onComplete?.(result);
  }

  return (
    <section className="quiz-card">
      <div className="quiz-card__header">
        <div>
          <div className="eyebrow">{label}</div>
          <h2>{currentQuestion.prompt}</h2>
        </div>
        <span className="quiz-card__score">
          {result.correctCount}/{result.answeredCount || questions.length}
        </span>
      </div>

      <div className="quiz-card__progress">
        {questions.map((question, index) => {
          const selected = answers[question.id] ?? [];
          const isCorrect = isQuizAnswerCorrect(question, selected);

          return (
            <span
              key={question.id}
              className={`quiz-card__progress-pill${
                index === currentIndex
                  ? ' quiz-card__progress-pill--active'
                  : selected.length > 0
                    ? isCorrect
                      ? ' quiz-card__progress-pill--correct'
                      : ' quiz-card__progress-pill--incorrect'
                    : ''
              }`}
            />
          );
        })}
      </div>

      <div className="quiz-card__question-meta">
        <span>{currentQuestion.type.replace(/-/g, ' ')}</span>
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {currentQuestion.caseTitle ? (
        <div className="education-card education-card--case">
          <div className="eyebrow">Case stem</div>
          <strong>{currentQuestion.caseTitle}</strong>
          {currentQuestion.caseSummary ? <p>{currentQuestion.caseSummary}</p> : null}
        </div>
      ) : null}

      {currentQuestion.type === 'ordering' ? (
        <div className="education-card education-card--checklist">
          <div className="eyebrow">Current order</div>
          <p>
            {currentSelection.length > 0
              ? currentSelection
                  .map((optionId, index) => {
                    const option = currentQuestion.options.find((entry) => entry.id === optionId);
                    return `${index + 1}. ${option?.label ?? optionId}`;
                  })
                  .join('  ')
              : 'Tap the steps in order. Tap a selected step again to remove it.'}
          </p>
        </div>
      ) : null}

      <div className="stack-list">
        {currentQuestion.options.map((option) => {
          const isSelected = currentSelection.includes(option.id);
          const isCorrect = currentQuestion.correctOptionIds.includes(option.id);
          const orderIndex = currentSelection.indexOf(option.id);

          return (
            <button
              key={option.id}
              className={`choice-card${
                answeredCurrent
                  ? isCorrect
                    ? ' choice-card--correct'
                    : isSelected
                      ? ' choice-card--incorrect'
                      : ''
                  : isSelected
                    ? ' choice-card--selected'
                    : ''
              }`}
              onClick={() => handleSelect(option.id)}
              type="button"
            >
              <strong>
                {currentQuestion.type === 'ordering' && orderIndex >= 0 ? `${orderIndex + 1}. ` : ''}
                {option.label}
              </strong>
            </button>
          );
        })}
      </div>

      {answeredCurrent ? <QuizExplanationPanel question={currentQuestion} selectedOptionIds={finalizedSelection} /> : null}

      <div className="button-row button-row--wrap">
        <button
          className="button button--ghost"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((index) => index - 1)}
          type="button"
        >
          Previous
        </button>
        {!answeredCurrent ? (
          <>
            {currentQuestion.type === 'ordering' ? (
              <button
                className="button button--ghost"
                disabled={currentSelection.length === 0}
                onClick={() => updateDraft([])}
                type="button"
              >
                Reset order
              </button>
            ) : null}
            <button
              className="button"
              disabled={!canSubmitQuestion(currentQuestion, currentSelection)}
              onClick={submitCurrentQuestion}
              type="button"
            >
              Check answer
            </button>
          </>
        ) : currentIndex < questions.length - 1 ? (
          <button
            className="button"
            onClick={() => setCurrentIndex((index) => index + 1)}
            type="button"
          >
            Next
          </button>
        ) : (
          <button
            className="button"
            disabled={result.answeredCount !== questions.length}
            onClick={recordCompletion}
            type="button"
          >
            {completionRecorded ? 'Attempt saved' : `Save ${result.percent}% score`}
          </button>
        )}
      </div>
    </section>
  );
}

```

## File: `apps/web/src/features/stations/StationDetail.tsx`

```typescript
import { useEffect, useState } from 'react';

import {
  LandmarkChecklist,
  RelatedImagesStrip,
  StationBoundaryCard,
  StationStagingSummary,
} from '@/components/education/EducationModuleRenderer';
import { getStationMediaVariants, getStationPrimaryMedia } from '@/content/media';
import { getViewLabel, zoneThemes } from '@/content/stations';
import type { CombinedStation, ExplorerViewId, StationAnnotationSet } from '@/content/types';

function getAnnotationTone(label: string): 'station' | 'structure' {
  return label.toLowerCase().includes('station') ? 'station' : 'structure';
}

function getLabelAnchor(points: Array<[number, number]>): { x: number; y: number } {
  const total = points.reduce(
    (sum, [x, y]) => ({
      x: sum.x + x,
      y: sum.y + y,
    }),
    { x: 0, y: 0 },
  );

  return {
    x: total.x / points.length,
    y: total.y / points.length,
  };
}

function AnnotationOverlay({
  annotations,
  isVisible,
}: {
  annotations: StationAnnotationSet;
  isVisible: boolean;
}) {
  return (
    <svg
      aria-hidden={!isVisible}
      className={`media-slot__annotations${isVisible ? ' media-slot__annotations--visible' : ''}`}
      preserveAspectRatio="xMidYMid meet"
      viewBox={`0 0 ${annotations.width} ${annotations.height}`}
    >
      {annotations.regions.map((region, index) => {
        const anchor = getLabelAnchor(region.points);
        const tone = getAnnotationTone(region.label);

        return (
          <g key={`${region.label}-${index}`}>
            <polygon
              className={`media-slot__annotation media-slot__annotation--${tone}`}
              points={region.points.map(([x, y]) => `${x},${y}`).join(' ')}
            />
            <text
              className={`media-slot__annotation-label media-slot__annotation-label--${tone}`}
              textAnchor="middle"
              x={anchor.x}
              y={anchor.y}
            >
              {region.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MediaSlot({
  station,
  viewId,
}: {
  station: CombinedStation;
  viewId: ExplorerViewId;
}) {
  const variants = getStationMediaVariants(station.media, viewId);
  const view = station.views[viewId];
  const firstVariantId = variants[0]?.id ?? '';
  const [selectedVariantId, setSelectedVariantId] = useState(firstVariantId);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setSelectedVariantId(firstVariantId);
    setIsPinned(false);
    setIsHovered(false);
  }, [firstVariantId, station.id, viewId]);

  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];
  const hasRevealImage = Boolean(selectedVariant?.image && selectedVariant.revealImage);
  const hasAnnotations = Boolean(selectedVariant?.annotations);
  const revealAvailable = hasRevealImage || hasAnnotations;
  const revealVisible = revealAvailable && (isPinned || isHovered);
  const frameSource = selectedVariant?.image ?? selectedVariant?.revealImage;

  return (
    <article className="media-slot">
      <div className="media-slot__eyebrow">
        <span>{getViewLabel(viewId)}</span>
        <span>{view.focusLabel}</span>
      </div>

      {variants.length > 1 || revealAvailable ? (
        <div className="media-slot__controls">
          {variants.length > 1 ? (
            <div className="button-row button-row--wrap" role="tablist" aria-label={`${station.id} ${getViewLabel(viewId)} views`}>
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  aria-selected={selectedVariant?.id === variant.id}
                  className={`control-pill${selectedVariant?.id === variant.id ? ' control-pill--active' : ''}`}
                  onClick={() => {
                    setSelectedVariantId(variant.id);
                    setIsPinned(false);
                  }}
                  role="tab"
                  type="button"
                >
                  {variant.label}
                </button>
              ))}
            </div>
          ) : null}

          {revealAvailable ? (
            <button
              className={`control-pill${revealVisible ? ' control-pill--active' : ''}`}
              onClick={() => setIsPinned((current) => !current)}
              type="button"
            >
              {isPinned ? 'Hide labels' : 'Pin labels'}
            </button>
          ) : null}
        </div>
      ) : null}

      <div
        aria-label={revealAvailable ? `Click to ${isPinned ? 'hide' : 'show'} labels` : undefined}
        className={`media-slot__frame media-slot__frame--${view.visualAnchor}${revealAvailable ? ' media-slot__frame--interactive' : ''}`}
        onClick={() => {
          if (revealAvailable) {
            setIsPinned((current) => !current);
          }
        }}
        onKeyDown={(event) => {
          if (!revealAvailable) {
            return;
          }

          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsPinned((current) => !current);
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role={revealAvailable ? 'button' : undefined}
        tabIndex={revealAvailable ? 0 : undefined}
      >
        {frameSource ? (
          <>
            <img
              alt={`${station.id} ${getViewLabel(viewId)} correlate${selectedVariant?.label ? ` (${selectedVariant.label})` : ''}`}
              className="media-slot__image"
              src={frameSource}
            />
            {hasRevealImage ? (
              <img
                alt=""
                aria-hidden="true"
                className={`media-slot__overlay${revealVisible ? ' media-slot__overlay--visible' : ''}`}
                src={selectedVariant?.revealImage}
              />
            ) : null}
            {selectedVariant?.annotations ? (
              <AnnotationOverlay annotations={selectedVariant.annotations} isVisible={revealVisible} />
            ) : null}
            {revealAvailable ? (
              <div className={`media-slot__hint${revealVisible ? ' media-slot__hint--active' : ''}`}>
                {revealVisible ? 'Labels visible' : 'Hover or tap to reveal labels'}
              </div>
            ) : null}
          </>
        ) : (
          <div className="media-slot__placeholder">
            <span>{getViewLabel(viewId)}</span>
            <strong>{view.orientation}</strong>
            <p>{station.media.notes?.[0] ?? 'Media manifest is ready for this slot.'}</p>
          </div>
        )}
      </div>
      <p className="media-slot__caption">{view.caption}</p>
      {selectedVariant?.note ? <p className="media-slot__note">{selectedVariant.note}</p> : null}
    </article>
  );
}

export function StationDetail({
  station,
  isBookmarked,
  onToggleBookmark,
}: {
  station: CombinedStation;
  isBookmarked: boolean;
  onToggleBookmark: (stationId: string) => void;
}) {
  const theme = zoneThemes[station.zoneKey];
  const relatedImages = (['ct', 'bronchoscopy', 'ultrasound'] as const).flatMap((viewId) => {
    const primary = getStationPrimaryMedia(station.media, viewId);

    if (!primary || primary.kind !== 'image') {
      return [];
    }

    return [
      {
        id: `${station.id}-${viewId}`,
        label: `${station.id} ${getViewLabel(viewId)}`,
        src: primary.src,
      },
    ];
  });

  return (
    <section className="detail-card" style={{ ['--detail-accent' as string]: theme.border }}>
      <div className="detail-card__header">
        <div>
          <div className="detail-card__meta">
            <span className="chip chip--accent">{station.id}</span>
            <span className="chip">{theme.label}</span>
            <span className="chip">{station.laterality}</span>
            <span className="chip">{station.iaslcName}</span>
          </div>
          <h2>{station.displayName}</h2>
          <p>{station.description}</p>
        </div>
        <button
          aria-pressed={isBookmarked}
          className={`action-pill${isBookmarked ? ' action-pill--active' : ''}`}
          onClick={() => onToggleBookmark(station.id)}
          type="button"
        >
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>

      <div className="detail-card__grid">
        <div className="detail-card__column">
          <div className="stack-card">
            <div className="eyebrow">Access and window</div>
            <p>
              <strong>Access:</strong> {station.accessProfile}
            </p>
            <p>
              <strong>Best EBUS window:</strong> {station.bestEbusWindow}
            </p>
            <p>{station.accessNotes}</p>
          </div>
          <StationBoundaryCard boundary={station.boundaryDefinition} notes={station.boundaryNotes} />
          <StationStagingSummary accessProfile={station.accessProfile} staging={station.nStageImplication} />
          <LandmarkChecklist items={station.landmarkChecklist} />
          <div className="education-card">
            <div className="eyebrow">Why this station matters</div>
            <p>{station.clinicalImportance}</p>
            <p>
              <strong>Staging impact:</strong> {station.stagingChangeFinding}
            </p>
          </div>
          <div className="education-card">
            <div className="eyebrow">Landmark vessels</div>
            <div className="tag-row">
              {station.landmarkVessels.map((vessel) => (
                <span key={vessel} className="tag">
                  {vessel}
                </span>
              ))}
            </div>
          </div>
          <div className="education-card">
            <div className="eyebrow">Memory cues</div>
            <ul className="plain-list education-list">
              {station.memoryCues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          </div>
          <div className="education-card">
            <div className="eyebrow">Common confusion pairs</div>
            <p>
              <strong>Most common:</strong> {station.commonConfusionPair}
            </p>
            <div className="tag-row">
              {station.confusionPairs.map((pair) => (
                <span key={pair} className="tag">
                  {pair}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="detail-card__column detail-card__column--media">
          <div className="media-grid">
            <MediaSlot station={station} viewId="ct" />
            <MediaSlot station={station} viewId="bronchoscopy" />
            <MediaSlot station={station} viewId="ultrasound" />
          </div>
          <RelatedImagesStrip items={relatedImages} />
          <div className="education-card">
            <div className="eyebrow">What you should see on CT</div>
            <ul className="plain-list education-list">
              {station.whatYouSee.ct.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="education-card">
            <div className="eyebrow">What you should see bronchoscopically</div>
            <ul className="plain-list education-list">
              {station.whatYouSee.bronchoscopy.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="education-card">
            <div className="eyebrow">What you should see on EBUS</div>
            <ul className="plain-list education-list">
              {station.whatYouSee.ultrasound.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="education-card">
            <div className="eyebrow">Safe puncture considerations</div>
            <ul className="plain-list education-list">
              {station.safePunctureConsiderations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="stack-card">
            <div className="eyebrow">Aliases</div>
            <div className="tag-row">
              {station.aliases.map((alias) => (
                <span key={alias} className="tag">
                  {alias}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

```

## File: `apps/web/src/features/stations/StationMap.tsx`

```typescript
import { stationConnections, zoneThemes } from '@/content/stations';
import type { CombinedStation, StationMapLayout, StationMapLandmark } from '@/content/types';
import { StationNode } from '@/features/stations/StationNode';

function renderLandmark(landmark: StationMapLandmark) {
  const style = {
    left: `${(landmark.x / 320) * 100}%`,
    top: `${(landmark.y / 420) * 100}%`,
    width: `${(landmark.width / 320) * 100}%`,
    height: `${(landmark.height / 420) * 100}%`,
    transform: `rotate(${landmark.rotation}deg)`,
  };

  return <div key={landmark.id} className={`station-map__landmark station-map__landmark--${landmark.kind}`} style={style} />;
}

function getQuizMaskDimensions(stationId: string) {
  if (stationId === '10R' || stationId === '10L') {
    return { width: 86, height: 58 };
  }

  if (stationId === '11Rs' || stationId === '11Ri' || stationId === '11L') {
    return { width: 98, height: 58 };
  }

  if (stationId === '7') {
    return { width: 58, height: 58 };
  }

  return { width: 64, height: 64 };
}

export function StationMap({
  layout,
  stations,
  selectedStationId,
  onSelect,
  quizMode,
}: {
  layout: StationMapLayout;
  stations: CombinedStation[];
  selectedStationId: string | null;
  onSelect: (stationId: string) => void;
  quizMode?: boolean;
}) {
  const stationLookup = Object.fromEntries(stations.map((station) => [station.id, station]));

  return (
    <div className={`station-map${quizMode ? ' station-map--quiz' : ''}`}>
      <img
        alt={quizMode ? 'Mediastinal station quiz schematic with masked labels' : 'Mediastinal anatomy and lymph node station schematic'}
        className={`station-map__image${quizMode ? ' station-map__image--quiz' : ''}`}
        src="/media/stations/clean_mediastinum.png"
      />
      {quizMode ? (
        <>
          <div className="station-map__quiz-scrim" />
          <div className="station-map__quiz-masks" aria-hidden="true">
            {stations.map((station) => {
              const mask = getQuizMaskDimensions(station.id);

              return (
                <div
                  key={`mask-${station.id}`}
                  className="station-map__quiz-mask"
                  style={{
                    left: `${((station.mapNode.x + station.mapNode.width / 2) / layout.designWidth) * 100}%`,
                    top: `${((station.mapNode.y + station.mapNode.height / 2) / layout.designHeight) * 100}%`,
                    width: `${(mask.width / layout.designWidth) * 100}%`,
                    height: `${(mask.height / layout.designHeight) * 100}%`,
                  }}
                />
              );
            })}
          </div>
          <svg className="station-map__connections" viewBox={`0 0 ${layout.designWidth} ${layout.designHeight}`} aria-hidden="true">
            {stationConnections.map((connection) => {
              const from = stationLookup[connection.from];
              const to = stationLookup[connection.to];

              if (!from || !to) {
                return null;
              }

              return (
                <line
                  key={`${connection.from}-${connection.to}`}
                  x1={from.mapNode.x + from.mapNode.width / 2}
                  x2={to.mapNode.x + to.mapNode.width / 2}
                  y1={from.mapNode.y + from.mapNode.height / 2}
                  y2={to.mapNode.y + to.mapNode.height / 2}
                />
              );
            })}
          </svg>
        </>
      ) : null}
      {layout.landmarks.map(renderLandmark)}
      <div className="station-map__zone station-map__zone--upper">{zoneThemes.upper.label}</div>
      <div className="station-map__zone station-map__zone--subcarinal">{zoneThemes.subcarinal.label}</div>
      <div className="station-map__zone station-map__zone--hilar">{zoneThemes.hilar.label}</div>
      {stations.map((station) => (
        <StationNode
          key={station.id}
          isQuizMode={quizMode}
          isSelected={selectedStationId === station.id}
          onSelect={onSelect}
          station={station}
        />
      ))}
    </div>
  );
}

```

## File: `apps/web/src/features/stations/StationNode.tsx`

```typescript
import type { CombinedStation } from '@/content/types';

export function StationNode({
  station,
  isSelected,
  isQuizMode,
  onSelect,
}: {
  station: CombinedStation;
  isSelected: boolean;
  isQuizMode?: boolean;
  onSelect: (stationId: string) => void;
}) {
  const shouldShowLabel = isSelected || isQuizMode;

  return (
    <button
      aria-label={`Select station ${station.id}`}
      className={`station-node${isSelected ? ' station-node--selected' : ''}${isQuizMode ? ' station-node--quiz' : ''}${
        shouldShowLabel ? ' station-node--labeled' : ''
      }`}
      onClick={() => onSelect(station.id)}
      style={{
        left: `${((station.mapNode.x + station.mapNode.width / 2) / 649) * 100}%`,
        top: `${((station.mapNode.y + station.mapNode.height / 2) / 791) * 100}%`,
        ['--station-bg' as string]: `var(--zone-${station.zoneKey}-bg)`,
        ['--station-border' as string]: `var(--zone-${station.zoneKey}-border)`,
        ['--station-text' as string]: `var(--zone-${station.zoneKey}-text)`,
      }}
      type="button"
    >
      {shouldShowLabel ? (isQuizMode ? '?' : station.id) : ''}
    </button>
  );
}

```

## File: `apps/web/src/lib/progress.test.ts`

```typescript
import { describe, expect, it } from 'vitest';

import { createInitialLearnerProgress, learnerProgressReducer, normalizeLearnerProgress } from '@/lib/progress';

describe('learnerProgressReducer', () => {
  it('records lecture completion and preserves the larger watched duration', () => {
    const initial = createInitialLearnerProgress();
    const state = learnerProgressReducer(initial, {
      type: 'setLectureState',
      lectureId: 'lecture-01',
      watchedSeconds: 120,
      completed: false,
    });
    const next = learnerProgressReducer(state, {
      type: 'setLectureState',
      lectureId: 'lecture-01',
      watchedSeconds: 30,
      completed: true,
    });

    expect(next.lectureWatchStatus['lecture-01']).toMatchObject({
      watchedSeconds: 120,
      completed: true,
    });
  });

  it('normalizes malformed persisted state back to defaults', () => {
    const normalized = normalizeLearnerProgress({
      moduleProgress: {
        knobology: {
          visitedAt: 42,
          percentComplete: 500,
        },
      },
      bookmarkedStations: ['4R', null],
    });

    expect(normalized.moduleProgress.knobology.percentComplete).toBe(100);
    expect(normalized.moduleProgress.knobology.visitedAt).toBeNull();
    expect(normalized.bookmarkedStations).toEqual(['4R']);
  });
});

```

## File: `apps/web/src/lib/progress.tsx`

```typescript
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';

import type { AppRouteId, KnobologyControlId } from '@/content/types';

const STORAGE_KEY = 'socal-ebus-prep.web.learner-progress';

type ModuleProgressId = 'knobology' | 'station-map' | 'station-explorer' | 'lectures' | 'quiz' | 'case-001';

export interface ModuleProgress {
  visitedAt: string | null;
  completedAt: string | null;
  percentComplete: number;
}

export interface LectureWatchState {
  completed: boolean;
  watchedSeconds: number;
  lastOpenedAt: string | null;
}

export interface QuizHistoryEntry {
  id: string;
  label: string;
  moduleId: ModuleProgressId | 'mixed';
  correctCount: number;
  totalCount: number;
  percent: number;
  completedAt: string;
}

export interface LearnerProgressState {
  version: 1;
  moduleProgress: Record<ModuleProgressId, ModuleProgress>;
  bookmarkedStations: string[];
  stationRecognitionStats: Record<string, { attempts: number; correct: number }>;
  lectureWatchStatus: Record<string, LectureWatchState>;
  quizScoreHistory: QuizHistoryEntry[];
  lastViewedStationId: string | null;
  lastUsedKnobologyControl: KnobologyControlId | null;
}

type Action =
  | { type: 'hydrate'; payload: LearnerProgressState }
  | { type: 'visitModule'; moduleId: ModuleProgressId; percentFloor?: number }
  | { type: 'setModuleProgress'; moduleId: ModuleProgressId; percent: number; completed?: boolean }
  | { type: 'toggleStationBookmark'; stationId: string }
  | { type: 'setLectureState'; lectureId: string; watchedSeconds?: number; completed?: boolean }
  | { type: 'recordQuizResult'; entry: QuizHistoryEntry }
  | { type: 'recordRecognitionAttempt'; stationId: string; correct: boolean }
  | { type: 'setLastViewedStation'; stationId: string }
  | { type: 'setLastUsedKnobologyControl'; controlId: KnobologyControlId }
  | { type: 'reset' };

interface LearnerProgressContextValue {
  state: LearnerProgressState;
  hydrated: boolean;
  visitRoute: (routeId: AppRouteId) => void;
  setModuleProgress: (moduleId: ModuleProgressId, percent: number, completed?: boolean) => void;
  toggleStationBookmark: (stationId: string) => void;
  setLectureState: (lectureId: string, update: { watchedSeconds?: number; completed?: boolean }) => void;
  recordQuizResult: (entry: Omit<QuizHistoryEntry, 'completedAt'>) => void;
  recordRecognitionAttempt: (stationId: string, correct: boolean) => void;
  setLastViewedStation: (stationId: string) => void;
  setLastUsedKnobologyControl: (controlId: KnobologyControlId) => void;
  reset: () => void;
}

const LearnerProgressContext = createContext<LearnerProgressContextValue | undefined>(undefined);

function createModuleProgress(): ModuleProgress {
  return {
    visitedAt: null,
    completedAt: null,
    percentComplete: 0,
  };
}

export function createInitialLearnerProgress(): LearnerProgressState {
  return {
    version: 1,
    moduleProgress: {
      knobology: createModuleProgress(),
      'station-map': createModuleProgress(),
      'station-explorer': createModuleProgress(),
      lectures: createModuleProgress(),
      quiz: createModuleProgress(),
      'case-001': createModuleProgress(),
    },
    bookmarkedStations: [],
    stationRecognitionStats: {},
    lectureWatchStatus: {},
    quizScoreHistory: [],
    lastViewedStationId: null,
    lastUsedKnobologyControl: null,
  };
}

export function normalizeLearnerProgress(candidate: unknown): LearnerProgressState {
  const initial = createInitialLearnerProgress();

  if (!candidate || typeof candidate !== 'object') {
    return initial;
  }

  const raw = candidate as Partial<LearnerProgressState>;
  const nextModuleProgress = { ...initial.moduleProgress };

  for (const moduleId of Object.keys(nextModuleProgress) as ModuleProgressId[]) {
    const maybeProgress = raw.moduleProgress?.[moduleId];

    if (!maybeProgress || typeof maybeProgress !== 'object') {
      continue;
    }

    nextModuleProgress[moduleId] = {
      visitedAt: typeof maybeProgress.visitedAt === 'string' ? maybeProgress.visitedAt : null,
      completedAt: typeof maybeProgress.completedAt === 'string' ? maybeProgress.completedAt : null,
      percentComplete:
        typeof maybeProgress.percentComplete === 'number'
          ? Math.max(0, Math.min(100, maybeProgress.percentComplete))
          : 0,
    };
  }

  return {
    version: 1,
    moduleProgress: nextModuleProgress,
    bookmarkedStations: Array.isArray(raw.bookmarkedStations)
      ? raw.bookmarkedStations.filter((stationId): stationId is string => typeof stationId === 'string')
      : [],
    stationRecognitionStats:
      raw.stationRecognitionStats && typeof raw.stationRecognitionStats === 'object'
        ? Object.fromEntries(
            Object.entries(raw.stationRecognitionStats).flatMap(([stationId, value]) => {
              if (!value || typeof value !== 'object') {
                return [];
              }

              const attempts = typeof value.attempts === 'number' ? Math.max(0, value.attempts) : 0;
              const correct = typeof value.correct === 'number' ? Math.max(0, Math.min(value.correct, attempts)) : 0;

              return [[stationId, { attempts, correct }]];
            }),
          )
        : {},
    lectureWatchStatus:
      raw.lectureWatchStatus && typeof raw.lectureWatchStatus === 'object'
        ? Object.fromEntries(
            Object.entries(raw.lectureWatchStatus).flatMap(([lectureId, value]) => {
              if (!value || typeof value !== 'object') {
                return [];
              }

              return [
                [
                  lectureId,
                  {
                    completed: typeof value.completed === 'boolean' ? value.completed : false,
                    watchedSeconds: typeof value.watchedSeconds === 'number' ? Math.max(0, value.watchedSeconds) : 0,
                    lastOpenedAt: typeof value.lastOpenedAt === 'string' ? value.lastOpenedAt : null,
                  } satisfies LectureWatchState,
                ],
              ];
            }),
          )
        : {},
    quizScoreHistory: Array.isArray(raw.quizScoreHistory)
      ? raw.quizScoreHistory.filter((entry): entry is QuizHistoryEntry => {
          return (
            Boolean(entry) &&
            typeof entry.id === 'string' &&
            typeof entry.label === 'string' &&
            typeof entry.correctCount === 'number' &&
            typeof entry.totalCount === 'number' &&
            typeof entry.percent === 'number' &&
            typeof entry.completedAt === 'string'
          );
        })
      : [],
    lastViewedStationId: typeof raw.lastViewedStationId === 'string' ? raw.lastViewedStationId : null,
    lastUsedKnobologyControl:
      raw.lastUsedKnobologyControl &&
      [
        'depth',
        'gain',
        'contrast',
        'color-doppler',
        'calipers',
        'freeze',
        'save',
      ].includes(raw.lastUsedKnobologyControl)
        ? raw.lastUsedKnobologyControl
        : null,
  };
}

function getModuleForRoute(routeId: AppRouteId): ModuleProgressId | null {
  if (routeId === 'home') {
    return null;
  }

  if (routeId === 'stations') {
    return 'station-map';
  }

  if (routeId === 'case-001') {
    return 'case-001';
  }

  return routeId;
}

export function learnerProgressReducer(state: LearnerProgressState, action: Action): LearnerProgressState {
  switch (action.type) {
    case 'hydrate':
      return normalizeLearnerProgress(action.payload);
    case 'visitModule': {
      const current = state.moduleProgress[action.moduleId];
      const nextPercent = Math.max(current.percentComplete, action.percentFloor ?? 15);

      if (current.visitedAt && nextPercent === current.percentComplete) {
        return state;
      }

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: {
            ...current,
            visitedAt: current.visitedAt ?? new Date().toISOString(),
            percentComplete: nextPercent,
          },
        },
      };
    }
    case 'setModuleProgress': {
      const current = state.moduleProgress[action.moduleId];
      const nextPercent = Math.max(current.percentComplete, Math.max(0, Math.min(100, action.percent)));
      const completedAt =
        action.completed || nextPercent >= 100 ? current.completedAt ?? new Date().toISOString() : current.completedAt;

      if (current.visitedAt && current.percentComplete === nextPercent && current.completedAt === completedAt) {
        return state;
      }

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: {
            ...current,
            visitedAt: current.visitedAt ?? new Date().toISOString(),
            percentComplete: nextPercent,
            completedAt,
          },
        },
      };
    }
    case 'toggleStationBookmark': {
      const exists = state.bookmarkedStations.includes(action.stationId);

      return {
        ...state,
        bookmarkedStations: exists
          ? state.bookmarkedStations.filter((stationId) => stationId !== action.stationId)
          : [...state.bookmarkedStations, action.stationId],
      };
    }
    case 'setLectureState': {
      const current = state.lectureWatchStatus[action.lectureId] ?? {
        completed: false,
        watchedSeconds: 0,
        lastOpenedAt: null,
      };
      const nextCompleted = action.completed ?? current.completed;
      const nextWatchedSeconds = Math.max(current.watchedSeconds, action.watchedSeconds ?? current.watchedSeconds);

      if (current.completed === nextCompleted && current.watchedSeconds === nextWatchedSeconds) {
        return state;
      }

      return {
        ...state,
        lectureWatchStatus: {
          ...state.lectureWatchStatus,
          [action.lectureId]: {
            completed: nextCompleted,
            watchedSeconds: nextWatchedSeconds,
            lastOpenedAt: new Date().toISOString(),
          },
        },
      };
    }
    case 'recordQuizResult':
      return {
        ...state,
        quizScoreHistory: [action.entry, ...state.quizScoreHistory].slice(0, 12),
      };
    case 'recordRecognitionAttempt': {
      const current = state.stationRecognitionStats[action.stationId] ?? { attempts: 0, correct: 0 };

      return {
        ...state,
        stationRecognitionStats: {
          ...state.stationRecognitionStats,
          [action.stationId]: {
            attempts: current.attempts + 1,
            correct: current.correct + (action.correct ? 1 : 0),
          },
        },
      };
    }
    case 'setLastViewedStation':
      if (state.lastViewedStationId === action.stationId) {
        return state;
      }

      return {
        ...state,
        lastViewedStationId: action.stationId,
      };
    case 'setLastUsedKnobologyControl':
      if (state.lastUsedKnobologyControl === action.controlId) {
        return state;
      }

      return {
        ...state,
        lastUsedKnobologyControl: action.controlId,
      };
    case 'reset':
      return createInitialLearnerProgress();
    default:
      return state;
  }
}

export function LearnerProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(learnerProgressReducer, undefined, createInitialLearnerProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        dispatch({
          type: 'hydrate',
          payload: normalizeLearnerProgress(JSON.parse(raw)),
        });
      }
    } catch {
      // Ignore malformed storage and keep defaults.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const visitRoute = useCallback((routeId: AppRouteId) => {
    const moduleId = getModuleForRoute(routeId);

    if (moduleId) {
      dispatch({ type: 'visitModule', moduleId });
    }

    if (routeId === 'stations') {
      dispatch({ type: 'visitModule', moduleId: 'station-explorer', percentFloor: 10 });
    }
  }, []);

  const setModuleProgress = useCallback((moduleId: ModuleProgressId, percent: number, completed?: boolean) => {
    dispatch({ type: 'setModuleProgress', moduleId, percent, completed });
  }, []);

  const toggleStationBookmark = useCallback((stationId: string) => {
    dispatch({ type: 'toggleStationBookmark', stationId });
  }, []);

  const setLectureState = useCallback(
    (lectureId: string, update: { watchedSeconds?: number; completed?: boolean }) => {
      dispatch({
        type: 'setLectureState',
        lectureId,
        watchedSeconds: update.watchedSeconds,
        completed: update.completed,
      });
    },
    [],
  );

  const recordQuizResult = useCallback((entry: Omit<QuizHistoryEntry, 'completedAt'>) => {
    dispatch({
      type: 'recordQuizResult',
      entry: {
        ...entry,
        completedAt: new Date().toISOString(),
      },
    });
  }, []);

  const recordRecognitionAttempt = useCallback((stationId: string, correct: boolean) => {
    dispatch({ type: 'recordRecognitionAttempt', stationId, correct });
  }, []);

  const setLastViewedStation = useCallback((stationId: string) => {
    dispatch({ type: 'setLastViewedStation', stationId });
  }, []);

  const setLastUsedKnobologyControl = useCallback((controlId: KnobologyControlId) => {
    dispatch({ type: 'setLastUsedKnobologyControl', controlId });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const value: LearnerProgressContextValue = useMemo(
    () => ({
      state,
      hydrated,
      visitRoute,
      setModuleProgress,
      toggleStationBookmark,
      setLectureState,
      recordQuizResult,
      recordRecognitionAttempt,
      setLastViewedStation,
      setLastUsedKnobologyControl,
      reset,
    }),
    [
      hydrated,
      recordQuizResult,
      recordRecognitionAttempt,
      reset,
      setLastUsedKnobologyControl,
      setLastViewedStation,
      setLectureState,
      setModuleProgress,
      state,
      toggleStationBookmark,
      visitRoute,
    ],
  );

  return <LearnerProgressContext.Provider value={value}>{children}</LearnerProgressContext.Provider>;
}

export function useLearnerProgress() {
  const context = useContext(LearnerProgressContext);

  if (!context) {
    throw new Error('useLearnerProgress must be used within LearnerProgressProvider.');
  }

  return context;
}

```

## File: `apps/web/src/lib/quiz.test.ts`

```typescript
import { describe, expect, it } from 'vitest';

import type { QuizQuestionContent } from '@/content/types';
import { calculateQuizResult, isQuizAnswerCorrect } from '@/lib/quiz';

const questions: QuizQuestionContent[] = [
  {
    id: 'single',
    moduleId: 'knobology',
    prompt: 'Question 1',
    type: 'single-best-answer',
    options: [
      { id: 'a', label: 'A', rationale: 'Because A.' },
      { id: 'b', label: 'B', rationale: 'Because B.' },
    ],
    correctOptionIds: ['a'],
    explanation: 'Because A.',
    difficulty: 'basic',
    tags: ['test'],
  },
  {
    id: 'multi',
    moduleId: 'station-map',
    prompt: 'Question 2',
    type: 'multi-select',
    options: [
      { id: 'a', label: 'A', rationale: 'Because A.' },
      { id: 'b', label: 'B', rationale: 'Because B.' },
      { id: 'c', label: 'C', rationale: 'Because C.' },
    ],
    correctOptionIds: ['a', 'c'],
    explanation: 'Because A and C.',
    difficulty: 'intermediate',
    tags: ['test'],
  },
  {
    id: 'ordering',
    moduleId: 'station-explorer',
    prompt: 'Question 3',
    type: 'ordering',
    options: [
      { id: 'one', label: 'One', rationale: 'Because one.' },
      { id: 'two', label: 'Two', rationale: 'Because two.' },
    ],
    correctOptionIds: ['one', 'two'],
    explanation: 'Because one then two.',
    difficulty: 'advanced',
    tags: ['test'],
  },
];

describe('isQuizAnswerCorrect', () => {
  it('treats multi-select answers as set equality', () => {
    expect(isQuizAnswerCorrect(questions[1], ['c', 'a'])).toBe(true);
    expect(isQuizAnswerCorrect(questions[1], ['a'])).toBe(false);
  });

  it('requires exact order for ordering questions', () => {
    expect(isQuizAnswerCorrect(questions[2], ['one', 'two'])).toBe(true);
    expect(isQuizAnswerCorrect(questions[2], ['two', 'one'])).toBe(false);
  });
});

describe('calculateQuizResult', () => {
  it('counts answered and correct questions separately across question types', () => {
    const result = calculateQuizResult([...questions], {
      single: ['a'],
      multi: ['a', 'c'],
    });

    expect(result.correctCount).toBe(2);
    expect(result.answeredCount).toBe(2);
    expect(result.totalCount).toBe(3);
    expect(result.percent).toBe(67);
  });
});

```

## File: `apps/web/src/lib/quiz.ts`

```typescript
import type { QuizQuestionContent } from '@/content/types';

export interface QuizResultItem {
  question: QuizQuestionContent;
  selectedOptionIds: string[];
  isCorrect: boolean;
}

export interface QuizResult {
  correctCount: number;
  totalCount: number;
  answeredCount: number;
  percent: number;
  items: QuizResultItem[];
}

export function calculateQuizResult(
  questions: QuizQuestionContent[],
  answers: Record<string, string[] | undefined>,
): QuizResult {
  const items = questions.map((question) => {
    const selectedOptionIds = answers[question.id] ?? [];
    const isCorrect = isQuizAnswerCorrect(question, selectedOptionIds);

    return {
      question,
      selectedOptionIds,
      isCorrect,
    };
  });

  const correctCount = items.filter((item) => item.isCorrect).length;
  const answeredCount = items.filter((item) => item.selectedOptionIds.length > 0).length;
  const totalCount = items.length;
  const percent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);

  return {
    correctCount,
    totalCount,
    answeredCount,
    percent,
    items,
  };
}

function arraysEqual(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function isQuizAnswerCorrect(question: QuizQuestionContent, selectedOptionIds: string[]): boolean {
  if (selectedOptionIds.length === 0) {
    return false;
  }

  if (question.type === 'ordering') {
    return arraysEqual(selectedOptionIds, question.correctOptionIds);
  }

  const normalizedSelected = [...new Set(selectedOptionIds)].sort();
  const normalizedCorrect = [...new Set(question.correctOptionIds)].sort();

  return arraysEqual(normalizedSelected, normalizedCorrect);
}

```

## File: `apps/web/src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from '@/app/App';
import { LearnerProgressProvider } from '@/lib/progress';
import '@/styles/index.css';

const app = (
  <BrowserRouter>
    <LearnerProgressProvider>
      <App />
    </LearnerProgressProvider>
  </BrowserRouter>
);

// The vtk.js / itk-wasm case viewer uses imperative rendering and widget setup that does
// not currently tolerate StrictMode's development-only effect replay.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(app);

```

## File: `apps/web/src/styles/index.css`

```css
:root {
  color-scheme: dark;
  --bg: #07111d;
  --panel: #0d1a2a;
  --panel-soft: #122235;
  --panel-strong: #15263d;
  --line: #1c324d;
  --line-strong: #274564;
  --text: #ebf1f5;
  --text-soft: #9ab0c4;
  --text-muted: #6e87a0;
  --accent-cyan: #7fbdf2;
  --accent-green: #8fe0c0;
  --accent-gold: #e6bd79;
  --accent-rose: #e1a1a8;
  --zone-upper-bg: #122a40;
  --zone-upper-border: #2d6ca3;
  --zone-upper-text: #90ccff;
  --zone-subcarinal-bg: #123429;
  --zone-subcarinal-border: #2d8a6a;
  --zone-subcarinal-text: #88e0bd;
  --zone-hilar-bg: #36213b;
  --zone-hilar-border: #8861a7;
  --zone-hilar-text: #d6afe8;
  --radius-lg: 24px;
  --radius-md: 18px;
  --radius-sm: 12px;
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  background:
    radial-gradient(circle at top right, rgba(62, 108, 163, 0.22), transparent 30%),
    radial-gradient(circle at left center, rgba(46, 138, 106, 0.18), transparent 26%),
    linear-gradient(180deg, #07111d 0%, #060d17 100%);
  color: var(--text);
  font-family: 'Source Serif 4', Georgia, serif;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

img,
video,
iframe {
  display: block;
  width: 100%;
  height: auto;
}

#root {
  padding: 20px 14px 96px;
}

.app-shell {
  max-width: 1280px;
  margin: 0 auto;
}

.app-shell__frame {
  border: 1px solid rgba(123, 163, 200, 0.12);
  border-radius: 32px;
  background: rgba(5, 12, 22, 0.84);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.app-shell__content {
  padding: 22px;
}

.top-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 22px 18px;
  background:
    radial-gradient(circle at top right, rgba(127, 189, 242, 0.14), transparent 24%),
    linear-gradient(180deg, rgba(18, 34, 53, 0.96), rgba(7, 17, 29, 0.96));
  border-bottom: 1px solid rgba(123, 163, 200, 0.12);
}

.top-header__identity {
  display: flex;
  align-items: center;
  gap: 16px;
}

.top-header__mark {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(45, 108, 163, 0.72), rgba(127, 189, 242, 0.22));
  border: 1px solid rgba(127, 189, 242, 0.32);
  font-size: 24px;
}

.eyebrow {
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  color: var(--text-muted);
}

.top-header__title,
.hero-card h2,
.section-card h2,
.detail-card h2,
.quiz-card h2 {
  margin: 0;
  font-size: clamp(1.35rem, 1.1rem + 1vw, 2rem);
  line-height: 1.1;
}

.top-header__subtitle,
.hero-card p,
.mini-card p,
.section-card p,
.detail-card p,
.lecture-card p,
.quiz-card p,
.schedule-item p,
.flashcard p {
  color: var(--text-soft);
}

.top-header__meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  text-align: right;
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.top-nav {
  display: flex;
  gap: 10px;
  padding: 14px 22px 0;
  overflow-x: auto;
}

.top-nav__link,
.bottom-nav__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-family: 'Space Mono', monospace;
  font-size: 0.82rem;
  color: var(--text-muted);
  transition: 160ms ease;
}

.top-nav__link:hover,
.bottom-nav__link:hover {
  border-color: rgba(127, 189, 242, 0.18);
  color: var(--text);
}

.top-nav__link--active,
.bottom-nav__link--active {
  background: rgba(45, 108, 163, 0.22);
  border-color: rgba(127, 189, 242, 0.32);
  color: var(--accent-cyan);
}

.bottom-nav {
  position: fixed;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 8px;
  width: min(calc(100% - 20px), 680px);
  padding: 10px;
  border-radius: 999px;
  background: rgba(6, 13, 23, 0.9);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(123, 163, 200, 0.14);
}

.bottom-nav__link {
  flex: 1;
  flex-direction: column;
  min-height: 54px;
  padding: 6px 10px;
  font-size: 0.68rem;
}

.bottom-nav__icon {
  font-size: 1rem;
}

.page-stack {
  display: grid;
  gap: 18px;
}

.hero-card,
.section-card,
.detail-card,
.quiz-card,
.lecture-card,
.stack-card,
.mini-card,
.flashcard {
  border-radius: var(--radius-lg);
  border: 1px solid rgba(123, 163, 200, 0.14);
  background: linear-gradient(180deg, rgba(18, 34, 53, 0.72), rgba(8, 16, 28, 0.94));
}

.hero-card,
.section-card,
.detail-card,
.quiz-card {
  padding: 20px;
}

.hero-card {
  position: relative;
  overflow: hidden;
}

.hero-card::after {
  content: '';
  position: absolute;
  inset: auto -40px -40px auto;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(127, 189, 242, 0.16), transparent 68%);
}

.section-card__heading,
.quiz-card__header,
.detail-card__header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.stats-grid,
.mini-card-grid,
.module-grid,
.split-grid,
.media-grid {
  display: grid;
  gap: 14px;
}

.stats-grid,
.mini-card-grid {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.module-grid {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.split-grid {
  grid-template-columns: 1fr;
}

.split-grid--map {
  align-items: start;
}

.stat-card,
.mini-card {
  padding: 16px;
}

.stat-card strong,
.mini-card strong,
.quiz-card__score {
  display: block;
  font-family: 'Space Mono', monospace;
  font-size: 1.05rem;
  color: var(--text);
}

.module-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(15, 27, 42, 0.92), rgba(8, 16, 28, 0.98));
  border: 1px solid rgba(123, 163, 200, 0.14);
}

.module-card:hover {
  border-color: rgba(127, 189, 242, 0.34);
  transform: translateY(-1px);
}

.module-card__icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  font-size: 1.4rem;
  font-family: 'Space Mono', monospace;
}

.module-card__body h3,
.lecture-card h3,
.flashcard h3 {
  margin: 0 0 6px;
  font-size: 1.1rem;
}

.module-card__body p,
.lecture-card__placeholder span,
.media-slot__placeholder p,
.feedback-banner p,
.choice-card span,
.mini-card span {
  margin: 0;
  font-size: 0.96rem;
}

.module-card__arrow {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 1.2rem;
}

.schedule-list,
.stack-list {
  display: grid;
  gap: 10px;
}

.schedule-item {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 12px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(123, 163, 200, 0.08);
}

.schedule-item > span {
  font-family: 'Space Mono', monospace;
  color: var(--accent-cyan);
}

.station-map {
  position: relative;
  width: 100%;
  aspect-ratio: 649 / 791;
  border-radius: 28px;
  overflow: hidden;
  background: linear-gradient(180deg, #081321 0%, #0b1a2b 42%, #081321 100%);
  border: 1px solid rgba(123, 163, 200, 0.14);
}

.station-map__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.station-map__image--quiz {
  filter: saturate(0.82) brightness(0.8) contrast(0.92);
}

.station-map__connections {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.station-map__quiz-scrim,
.station-map__quiz-masks {
  position: absolute;
  inset: 0;
}

.station-map__quiz-scrim {
  z-index: 1;
  background:
    radial-gradient(circle at center, rgba(7, 17, 29, 0.08), rgba(7, 17, 29, 0.22)),
    linear-gradient(180deg, rgba(7, 17, 29, 0.08), rgba(7, 17, 29, 0.16));
}

.station-map__quiz-masks {
  z-index: 2;
}

.station-map__quiz-mask {
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: rgba(7, 17, 29, 0.18);
  backdrop-filter: blur(7px) brightness(0.66);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 8px 18px rgba(0, 0, 0, 0.18);
}

.station-map__connections line {
  stroke: rgba(235, 241, 245, 0.28);
  stroke-width: 2.4;
  stroke-dasharray: 10 10;
}

.station-map__landmark {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

.station-map__landmark--tube {
  border-radius: 22px;
}

.station-map__landmark--branch {
  border-radius: 18px;
}

.station-map__landmark--hub {
  border-radius: 999px;
}

.station-map__zone {
  position: absolute;
  left: 12px;
  font-family: 'Space Mono', monospace;
  font-size: 0.64rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(7, 17, 29, 0.72);
  backdrop-filter: blur(6px);
  z-index: 4;
}

.station-map__zone--upper {
  top: 10px;
  color: var(--zone-upper-text);
}

.station-map__zone--subcarinal {
  top: 44%;
  color: var(--zone-subcarinal-text);
}

.station-map__zone--hilar {
  top: auto;
  bottom: 14px;
  color: var(--zone-hilar-text);
}

.station-node {
  position: absolute;
  width: 38px;
  height: 38px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  border: 2px solid color-mix(in srgb, var(--station-border) 70%, white 8%);
  background: rgba(7, 17, 29, 0.18);
  color: transparent;
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  z-index: 5;
  backdrop-filter: blur(3px);
  box-shadow: 0 0 0 1px rgba(7, 17, 29, 0.24);
}

.station-node--selected {
  width: 52px;
  height: 52px;
  background: color-mix(in srgb, var(--station-bg) 76%, rgba(7, 17, 29, 0.92));
  color: var(--station-text);
  box-shadow: 0 0 24px color-mix(in srgb, var(--station-border) 42%, transparent);
}

.station-node--quiz {
  width: 48px;
  height: 48px;
  background: rgba(7, 17, 29, 0.76);
  color: var(--text);
}

.station-node--labeled {
  color: var(--station-text);
}

.detail-card {
  border-color: color-mix(in srgb, var(--detail-accent) 28%, rgba(123, 163, 200, 0.14));
}

.detail-card__meta,
.tag-row,
.button-row,
.button-row--wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip,
.tag,
.action-pill,
.control-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(123, 163, 200, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-soft);
  font-family: 'Space Mono', monospace;
  font-size: 0.74rem;
}

.chip--accent,
.action-pill--active,
.control-pill--active {
  color: var(--text);
  background: rgba(45, 108, 163, 0.22);
  border-color: rgba(127, 189, 242, 0.28);
}

.detail-card__grid,
.detail-card__column,
.knobology-panel,
.slider-stack {
  display: grid;
  gap: 14px;
}

.media-grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.media-slot {
  display: grid;
  gap: 8px;
}

.media-slot__controls {
  display: grid;
  gap: 10px;
}

.media-slot__eyebrow,
.quiz-card__question-meta,
.knobology-frame__status,
.lecture-card__meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  color: var(--text-muted);
}

.media-slot__frame,
.lecture-card__media,
.lecture-card__player,
.knobology-frame__screen,
.doppler-lab__frame {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(123, 163, 200, 0.14);
  min-height: 210px;
  background:
    radial-gradient(circle at var(--anchor-x, 50%) var(--anchor-y, 50%), rgba(127, 189, 242, 0.15), transparent 26%),
    linear-gradient(180deg, #08111d, #111b2b);
}

.media-slot__frame--interactive {
  cursor: pointer;
}

.media-slot__image,
.media-slot__overlay,
.media-slot__annotations {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.media-slot__image,
.media-slot__overlay {
  object-fit: contain;
  object-position: center;
}

.media-slot__overlay,
.media-slot__annotations {
  opacity: 0;
  transition: opacity 160ms ease;
}

.media-slot__overlay--visible,
.media-slot__annotations--visible {
  opacity: 1;
}

.media-slot__annotations {
  overflow: visible;
  pointer-events: none;
}

.media-slot__annotation {
  stroke-width: 2;
}

.media-slot__annotation--station {
  fill: rgba(87, 219, 168, 0.16);
  stroke: rgba(87, 219, 168, 0.92);
}

.media-slot__annotation--structure {
  fill: rgba(121, 191, 255, 0.1);
  stroke: rgba(121, 191, 255, 0.72);
}

.media-slot__annotation-label {
  font-family: 'Space Mono', monospace;
  font-size: 22px;
  paint-order: stroke;
  stroke-width: 6;
}

.media-slot__annotation-label--station {
  fill: rgba(230, 255, 244, 0.98);
  stroke: rgba(8, 17, 29, 0.92);
}

.media-slot__annotation-label--structure {
  fill: rgba(230, 244, 255, 0.94);
  stroke: rgba(8, 17, 29, 0.92);
}

.media-slot__hint {
  position: absolute;
  inset: auto 12px 12px;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(8, 17, 29, 0.78);
  border: 1px solid rgba(127, 189, 242, 0.2);
  color: var(--text-soft);
  font-family: 'Space Mono', monospace;
  font-size: 0.66rem;
  opacity: 0.86;
  transition:
    background 160ms ease,
    color 160ms ease;
}

.media-slot__hint--active {
  background: rgba(14, 42, 31, 0.88);
  color: #d6ffeb;
}

.media-slot__note {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.82rem;
}

.media-slot__frame--upper-left {
  --anchor-x: 24%;
  --anchor-y: 24%;
}

.media-slot__frame--upper-right {
  --anchor-x: 76%;
  --anchor-y: 24%;
}

.media-slot__frame--middle-left {
  --anchor-x: 28%;
  --anchor-y: 50%;
}

.media-slot__frame--middle-right {
  --anchor-x: 72%;
  --anchor-y: 50%;
}

.media-slot__frame--center {
  --anchor-x: 50%;
  --anchor-y: 50%;
}

.media-slot__frame--lower-left {
  --anchor-x: 24%;
  --anchor-y: 74%;
}

.media-slot__frame--lower-right {
  --anchor-x: 76%;
  --anchor-y: 74%;
}

.media-slot__placeholder,
.lecture-card__placeholder,
.empty-state,
.flashcard {
  display: grid;
  place-items: center;
  gap: 8px;
  text-align: center;
}

.media-slot__placeholder,
.lecture-card__placeholder {
  min-height: 100%;
  padding: 18px;
}

.plain-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
}

.knobology-lab {
  display: grid;
  gap: 14px;
}

.knobology-console,
.knobology-console__touch-panel {
  display: grid;
  gap: 14px;
}

.knobology-frame__screen {
  aspect-ratio: 772 / 418;
  background: #04090f;
}

.knobology-frame__sector {
  position: absolute;
  inset: 10% 14% 7%;
  background: radial-gradient(circle at 50% 0%, rgba(162, 192, 215, 0.38), rgba(12, 22, 33, 0.16) 70%, transparent 100%);
  clip-path: polygon(50% 0%, 4% 100%, 96% 100%);
}

.knobology-frame__haze,
.knobology-frame__doppler {
  position: absolute;
  inset: 0;
}

.knobology-frame__image-shell {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.knobology-frame__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center top;
  transition:
    filter 180ms ease,
    transform 180ms ease;
}

.knobology-frame__image--field {
  pointer-events: none;
}

.knobology-frame__haze {
  background: rgba(155, 170, 185, 0.18);
  mix-blend-mode: screen;
}

.knobology-frame__node {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid rgba(225, 241, 255, 0.4);
  border-radius: 999px;
  background: radial-gradient(circle, rgba(54, 74, 90, 0.88), rgba(24, 39, 50, 0.66) 72%);
}

.knobology-frame__speck {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 999px;
  background: rgba(210, 224, 237, 0.66);
}

.knobology-frame__doppler {
  left: 42%;
  top: 42%;
  width: 18%;
  height: 14%;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(233, 67, 51, 0.8), rgba(46, 104, 231, 0.6) 60%, transparent 100%);
  filter: blur(4px);
}

.knobology-frame__calipers {
  position: absolute;
  left: 42%;
  top: 46%;
  width: 18%;
  height: 13%;
  border-top: 2px solid rgba(233, 214, 160, 0.9);
  border-left: 2px solid rgba(233, 214, 160, 0.9);
  border-right: 2px solid rgba(233, 214, 160, 0.9);
}

.knobology-frame__calipers--trace {
  border-top-style: dashed;
  border-left-style: dashed;
  border-right-style: dashed;
}

.knobology-frame__measure-readout {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(7, 17, 29, 0.76);
  color: #f9e6b5;
  font-family: 'Space Mono', monospace;
  font-size: 0.68rem;
}

.knobology-frame__focus-marker {
  position: absolute;
  left: 12%;
  right: 12%;
  height: 2px;
  border-top: 2px dashed rgba(141, 212, 255, 0.72);
  opacity: 0.75;
}

.knobology-frame__waveform {
  position: absolute;
  inset: auto 10% 10% 10%;
  height: 16%;
  display: flex;
  align-items: end;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(7, 17, 29, 0.72);
  border: 1px solid rgba(123, 163, 200, 0.18);
}

.knobology-frame__waveform-bar {
  flex: 1;
  min-height: 16%;
  border-radius: 999px 999px 0 0;
  background: linear-gradient(180deg, rgba(135, 214, 255, 0.92), rgba(67, 133, 210, 0.3));
}

.knobology-frame__pip {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 24%;
  aspect-ratio: 4 / 3;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(127, 189, 242, 0.28);
  background: rgba(7, 17, 29, 0.82);
  box-shadow: 0 12px 28px rgba(4, 8, 12, 0.26);
}

.knobology-frame__pip img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.02) contrast(1.08);
}

.knobology-frame__pip span {
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 3px 6px;
  border-radius: 999px;
  background: rgba(7, 17, 29, 0.8);
  font-family: 'Space Mono', monospace;
  font-size: 0.64rem;
}

.knobology-frame__comments {
  position: absolute;
  inset: 0;
}

.knobology-frame__comment {
  position: absolute;
  padding: 5px 8px;
  border-radius: 999px;
  background: rgba(247, 235, 173, 0.92);
  color: #2f240e;
  font-family: 'Space Mono', monospace;
  font-size: 0.62rem;
  box-shadow: 0 8px 18px rgba(13, 18, 24, 0.18);
}

.knobology-frame__menu {
  position: absolute;
  left: 14px;
  bottom: 14px;
  display: grid;
  gap: 6px;
  min-width: 180px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(7, 17, 29, 0.82);
  border: 1px solid rgba(127, 189, 242, 0.22);
  backdrop-filter: blur(12px);
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
}

.knobology-frame__cine-strip {
  position: absolute;
  inset: auto 14px 14px auto;
  display: grid;
  gap: 6px;
  width: min(48%, 220px);
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(7, 17, 29, 0.74);
  border: 1px solid rgba(127, 189, 242, 0.18);
  font-family: 'Space Mono', monospace;
  font-size: 0.68rem;
}

.knobology-frame__cine-track {
  position: relative;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
}

.knobology-frame__cine-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #8fd7ff;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 4px rgba(143, 215, 255, 0.18);
}

.knobology-frame__status {
  position: absolute;
  inset: 10px 12px auto;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.knobology-frame__caption {
  padding: 14px 6px 0;
}

.knobology-frame__status-line {
  margin: 10px 0 0;
  font-family: 'Space Mono', monospace;
  font-size: 0.82rem;
  color: var(--text-soft);
}

.knobology-frame__media-note {
  margin-top: 10px;
  font-size: 0.86rem;
  color: var(--text-muted);
}

.eu-me2 {
  display: grid;
  gap: 10px;
  margin: 0;
}

.eu-me2__frame {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(123, 163, 200, 0.16);
  background: linear-gradient(180deg, rgba(10, 18, 31, 0.94), rgba(22, 28, 38, 0.94));
}

.eu-me2__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.eu-me2__overlay {
  position: absolute;
  inset: 0;
}

.eu-me2__hotspot,
.eu-me2__region,
.eu-me2__trackball {
  position: absolute;
}

.eu-me2__hotspot {
  border: 1px solid transparent;
  background: transparent;
  transition:
    border-color 140ms ease,
    box-shadow 140ms ease,
    background 140ms ease,
    transform 140ms ease;
}

.eu-me2__hotspot:hover,
.eu-me2__hotspot:focus-visible,
.eu-me2__hotspot--active,
.eu-me2--debug .eu-me2__hotspot {
  border-color: rgba(91, 239, 171, 0.9);
  background: rgba(91, 239, 171, 0.15);
  box-shadow: 0 0 0 3px rgba(91, 239, 171, 0.12);
}

.eu-me2__hotspot:focus-visible {
  outline: none;
}

.eu-me2__hotspot-label,
.eu-me2__region span,
.eu-me2__trackball span {
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translate(-50%, -100%);
  padding: 4px 6px;
  border-radius: 8px;
  background: rgba(7, 17, 29, 0.86);
  color: #eff8ff;
  font-family: 'Space Mono', monospace;
  font-size: 0.58rem;
  line-height: 1.3;
  white-space: nowrap;
  pointer-events: none;
}

.eu-me2__hotspot-label small {
  display: block;
  color: #92d4ff;
}

.eu-me2__region,
.eu-me2__trackball {
  border: 1px dashed rgba(127, 189, 242, 0.76);
  background: rgba(127, 189, 242, 0.08);
  pointer-events: none;
}

.eu-me2__trackball {
  border-radius: 999px;
}

.eu-me2__caption {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.slider-field {
  display: grid;
  grid-template-columns: 84px 1fr 48px;
  gap: 12px;
  align-items: center;
}

.slider-field span,
.slider-field strong {
  font-family: 'Space Mono', monospace;
}

.slider-field input {
  accent-color: var(--accent-cyan);
}

.feedback-banner {
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(225, 161, 168, 0.22);
  background: rgba(85, 22, 31, 0.34);
}

.feedback-banner--success {
  border-color: rgba(143, 224, 192, 0.22);
  background: rgba(20, 63, 48, 0.36);
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(127, 189, 242, 0.32);
  background: rgba(45, 108, 163, 0.2);
  color: var(--text);
  font-family: 'Space Mono', monospace;
}

.button:disabled {
  opacity: 0.4;
  cursor: default;
}

.button--ghost {
  background: transparent;
  border-color: rgba(123, 163, 200, 0.14);
  color: var(--text-soft);
}

.doppler-lab {
  display: grid;
  gap: 14px;
}

.doppler-lab__frame {
  min-height: 240px;
}

.doppler-lab__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.doppler-lab__target,
.doppler-lab__vessel {
  position: absolute;
  border-radius: 999px;
}

.doppler-lab__target {
  inset: 30% 36% 28% 34%;
  border: 2px solid rgba(224, 235, 247, 0.3);
  background: rgba(55, 70, 82, 0.6);
}

.doppler-lab__vessel {
  inset: 44% 26% 34% 20%;
  background: linear-gradient(90deg, rgba(222, 68, 50, 0.78), rgba(46, 104, 231, 0.72));
  filter: blur(8px);
}

.doppler-lab__label {
  position: absolute;
  left: 14px;
  bottom: 14px;
  right: 14px;
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  color: rgba(235, 241, 245, 0.82);
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(7, 17, 29, 0.68);
  backdrop-filter: blur(10px);
}

.doppler-lab__state {
  position: absolute;
  top: 14px;
  left: 14px;
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--accent-cyan);
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(7, 17, 29, 0.72);
  border: 1px solid rgba(127, 189, 242, 0.18);
  backdrop-filter: blur(10px);
}

.choice-card {
  display: grid;
  gap: 4px;
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(123, 163, 200, 0.14);
  background: rgba(255, 255, 255, 0.03);
  text-align: left;
  color: var(--text);
}

.choice-card--selected {
  border-color: rgba(127, 189, 242, 0.34);
  background: rgba(45, 108, 163, 0.14);
}

.choice-card--correct {
  border-color: rgba(143, 224, 192, 0.26);
  background: rgba(20, 63, 48, 0.3);
}

.choice-card--incorrect {
  border-color: rgba(225, 161, 168, 0.26);
  background: rgba(85, 22, 31, 0.28);
}

.lecture-card {
  padding: 18px;
}

.lecture-card--locked {
  opacity: 0.64;
}

.lecture-card__header,
.lecture-card__actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.lecture-card__actions {
  margin-top: 14px;
}

.lecture-card__player {
  margin-top: 14px;
}

.lecture-card__player iframe,
.lecture-card__player video {
  min-height: 280px;
  border: 0;
}

.quiz-card__progress {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(22px, 1fr));
  gap: 6px;
  margin-bottom: 14px;
}

.quiz-card__progress-pill {
  height: 5px;
  border-radius: 999px;
  background: rgba(123, 163, 200, 0.14);
}

.quiz-card__progress-pill--active {
  background: var(--accent-cyan);
}

.quiz-card__progress-pill--correct {
  background: var(--accent-green);
}

.quiz-card__progress-pill--incorrect {
  background: var(--accent-rose);
}

.flashcard {
  min-height: 220px;
  padding: 20px;
  cursor: pointer;
}

.flashcard__station {
  font-family: 'Space Mono', monospace;
  font-size: 3rem;
  color: var(--accent-cyan);
}

.empty-state {
  min-height: 220px;
  padding: 20px;
}

.empty-state__icon {
  font-size: 2rem;
  color: var(--text-muted);
}

.input,
.select {
  min-height: 44px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(123, 163, 200, 0.18);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.case3d-layout {
  display: grid;
  gap: 18px;
}

.case3d-sidebar,
.case3d-main,
.case3d-grid {
  display: grid;
  gap: 16px;
}

.case3d-panel {
  position: relative;
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(123, 163, 200, 0.16);
  background: linear-gradient(180deg, rgba(16, 30, 46, 0.82), rgba(7, 15, 26, 0.96));
}

.case3d-panel h3 {
  margin: 0;
  font-size: 1.1rem;
}

.case3d-panel__header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.case3d-panel__viewport {
  position: relative;
  min-height: 280px;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(123, 163, 200, 0.16);
  background:
    linear-gradient(180deg, rgba(8, 15, 25, 0.92), rgba(4, 8, 14, 0.98)),
    radial-gradient(circle at top left, rgba(127, 189, 242, 0.08), transparent 30%);
}

.case3d-panel__viewport--hero {
  min-height: 460px;
}

.case3d-panel__placeholder {
  min-height: 280px;
  display: grid;
  place-items: center;
  padding: 24px;
  text-align: center;
  color: var(--text-soft);
}

.case-vtk-viewport {
  width: 100%;
  height: 100%;
  min-height: inherit;
}

.case3d-crosshair-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.case3d-crosshair-overlay__vertical,
.case3d-crosshair-overlay__horizontal {
  position: absolute;
  background: rgba(255, 222, 120, 0.92);
  box-shadow: 0 0 18px rgba(255, 214, 98, 0.28);
}

.case3d-crosshair-overlay__vertical {
  top: 0;
  bottom: 0;
  width: 1px;
}

.case3d-crosshair-overlay__horizontal {
  left: 0;
  right: 0;
  height: 1px;
}

.case3d-select,
.case3d-slider {
  display: grid;
  gap: 8px;
}

.case3d-select span,
.case3d-slider span,
.case3d-toggle span,
.case3d-note {
  color: var(--text-soft);
}

.case3d-select select,
.case3d-slider input[type='range'],
.case3d-button {
  width: 100%;
}

.case3d-select select {
  min-height: 46px;
  padding: 0 14px;
  border-radius: 16px;
  border: 1px solid rgba(123, 163, 200, 0.18);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
}

.case3d-slider input[type='range'] {
  accent-color: var(--accent-cyan);
}

.case3d-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
}

.case3d-toggle input {
  width: 18px;
  height: 18px;
}

.case3d-button {
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid rgba(127, 189, 242, 0.28);
  border-radius: 999px;
  background: rgba(127, 189, 242, 0.12);
  color: var(--text);
}

.case3d-note {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (min-width: 760px) {
  #root {
    padding-bottom: 24px;
  }

  .app-shell__content {
    padding: 28px;
  }

  .split-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .detail-card__grid {
    grid-template-columns: 360px 1fr;
  }

  .knobology-lab {
    grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  }

  .case3d-layout {
    grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
    align-items: start;
  }

  .case3d-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .bottom-nav {
    display: none;
  }
}

@media (max-width: 759px) {
  .top-nav {
    display: none;
  }

  .top-header {
    padding-bottom: 20px;
  }

  .case3d-panel__viewport--hero {
    min-height: 360px;
  }
}

@media (max-width: 560px) {
  #root {
    padding: 10px 10px 92px;
  }

  .app-shell__content,
  .hero-card,
  .section-card,
  .detail-card,
  .quiz-card {
    padding: 16px;
  }

  .top-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .knobology-frame__cine-strip {
    width: calc(100% - 28px);
  }

  .eu-me2__caption {
    font-size: 0.74rem;
  }

  .top-header__meta,
  .lecture-card__header,
  .lecture-card__actions,
  .section-card__heading,
  .detail-card__header,
  .quiz-card__header {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .schedule-item {
    grid-template-columns: 1fr;
  }

  .slider-field {
    grid-template-columns: 1fr;
  }
}

```

## File: `apps/web/src/vite-env.d.ts`

```typescript
/// <reference types="vite/client" />

declare module '*.nrrd?url' {
  const url: string;
  export default url;
}

declare module '*.glb?url' {
  const url: string;
  export default url;
}

```

## File: `apps/web/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vitest/globals"]
  },
  "include": ["src"],
  "references": []
}

```

## File: `apps/web/vite.config.ts`

```typescript
import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const repoRoot = resolve(__dirname, '../..');

export default defineConfig({
  plugins: [react()],
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    exclude: ['itk-wasm', '@itk-wasm/image-io', '@thewtex/zstddec'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
  test: {
    environment: 'node',
  },
});

```

## File: `content/cases/case_001.runtime.json`

```json
{
  "schemaVersion": 1,
  "caseId": "case_001",
  "title": "Curated EBUS case 001",
  "description": "Segmented airway, vascular landmarks, and lymph nodes for a linked 3D + slice explorer.",
  "assets": {
    "glbFile": "Model/case_001.glb",
    "ctVolumeFile": "Model/case_001_ct.nrrd",
    "segmentationFile": "Model/case_001_segmentation.nrrd"
  },
  "coordinateAssumptions": {
    "worldCoordinateSystem": "respect per-markup coordinateSystem",
    "sliceIndicesMustBeDerivedFrom": [
      "markup control point position",
      "markup coordinateSystem",
      "CT volume geometry",
      "slice series counts"
    ],
    "note": "Do not assume RAS. Read each .mrk.json coordinateSystem and convert to the CT volume frame before deriving slice indices."
  },
  "sliceSeries": {
    "axial": {
      "folder": "Model/sliceSeries/axial",
      "count": 180,
      "framePattern": null,
      "displayOrientation": "axial",
      "indexDerivation": "derive from .mrk.json + CT volume geometry + series count",
      "coverageAssumption": [
        0,
        1
      ]
    },
    "coronal": {
      "folder": "Model/sliceSeries/coronal",
      "count": 220,
      "framePattern": null,
      "displayOrientation": "coronal",
      "indexDerivation": "derive from .mrk.json + CT volume geometry + series count",
      "coverageAssumption": [
        0,
        1
      ]
    },
    "sagittal": {
      "folder": "Model/sliceSeries/sagital",
      "count": 160,
      "framePattern": null,
      "displayOrientation": "sagittal",
      "sourceFolderSpelling": "sagital",
      "indexDerivation": "derive from .mrk.json + CT volume geometry + series count",
      "coverageAssumption": [
        1,
        0.02
      ]
    }
  },
  "stations": [
    {
      "id": "1R",
      "label": "1R",
      "groupLabel": "1R",
      "targetIds": [
        "node_1R"
      ],
      "primaryTargetId": "node_1R",
      "kind": "nodal_station"
    },
    {
      "id": "1L",
      "label": "1L",
      "groupLabel": "1L",
      "targetIds": [
        "node_1L"
      ],
      "primaryTargetId": "node_1L",
      "kind": "nodal_station"
    },
    {
      "id": "2R",
      "label": "2R",
      "groupLabel": "2R",
      "targetIds": [
        "node_2R"
      ],
      "primaryTargetId": "node_2R",
      "kind": "nodal_station"
    },
    {
      "id": "2L",
      "label": "2L",
      "groupLabel": "2L",
      "targetIds": [
        "node_2L"
      ],
      "primaryTargetId": "node_2L",
      "kind": "nodal_station"
    },
    {
      "id": "3A",
      "label": "3A",
      "groupLabel": "3A",
      "targetIds": [
        "node_3A_1",
        "node_3A_2",
        "node_3A_3",
        "node_3A_4",
        "node_3A_5",
        "node_3A_6",
        "node_3A_7"
      ],
      "primaryTargetId": "node_3A_1",
      "kind": "nodal_station"
    },
    {
      "id": "4R",
      "label": "4R",
      "groupLabel": "4R",
      "targetIds": [
        "node_4R_1",
        "node_4R_2",
        "node_4R_3"
      ],
      "primaryTargetId": "node_4R_1",
      "kind": "nodal_station"
    },
    {
      "id": "4L",
      "label": "4L",
      "groupLabel": "4L",
      "targetIds": [
        "node_4L_1",
        "node_4L_2",
        "node_4L_3"
      ],
      "primaryTargetId": "node_4L_1",
      "kind": "nodal_station"
    },
    {
      "id": "5",
      "label": "5",
      "groupLabel": "5",
      "targetIds": [
        "node_5_nod5"
      ],
      "primaryTargetId": "node_5_nod5",
      "kind": "nodal_station"
    },
    {
      "id": "6",
      "label": "6",
      "groupLabel": "6",
      "targetIds": [
        "node_6_nod5"
      ],
      "primaryTargetId": "node_6_nod5",
      "kind": "nodal_station"
    },
    {
      "id": "7",
      "label": "7",
      "groupLabel": "7",
      "targetIds": [
        "node_7_1"
      ],
      "primaryTargetId": "node_7_1",
      "kind": "nodal_station"
    },
    {
      "id": "10R",
      "label": "10R",
      "groupLabel": "10R",
      "targetIds": [
        "node_10R_1",
        "node_10R_2"
      ],
      "primaryTargetId": "node_10R_1",
      "kind": "nodal_station"
    },
    {
      "id": "10L",
      "label": "10L",
      "groupLabel": "10L",
      "targetIds": [
        "node_10L"
      ],
      "primaryTargetId": "node_10L",
      "kind": "nodal_station"
    },
    {
      "id": "11L",
      "label": "11L",
      "groupLabel": "11L",
      "targetIds": [
        "node_11L"
      ],
      "primaryTargetId": "node_11L",
      "kind": "nodal_station"
    },
    {
      "id": "11Ri",
      "label": "11Ri",
      "groupLabel": "11R",
      "targetIds": [
        "node_11Ri"
      ],
      "primaryTargetId": "node_11Ri",
      "kind": "nodal_station"
    },
    {
      "id": "11Rs",
      "label": "11Rs",
      "groupLabel": "11R",
      "targetIds": [
        "node_11Rs_1",
        "node_11Rs_2"
      ],
      "primaryTargetId": "node_11Rs_1",
      "kind": "nodal_station"
    }
  ],
  "targets": [
    {
      "id": "node_1R",
      "label": "1R",
      "displayLabel": "1R",
      "kind": "lymph_node",
      "stationId": "1R",
      "stationGroupId": "1R",
      "markupFile": "Model/markups/1R.mrk.json",
      "meshNameExpected": "Station 1R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 161,
        "coronal": 143,
        "sagittal": 86
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 1R",
      "voxelIndex": {
        "axial": 108,
        "coronal": 148,
        "sagittal": 143
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -9.572087152711095,
          -197.84134289115147,
          1287.5124715199843
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -9.572087152711095,
          -197.84134289115147,
          1287.5124715199843
        ]
      },
      "derived": {
        "continuousVoxel": [
          142.85059169523808,
          148.48142156618832,
          108.45624796702339
        ],
        "roundedVoxel": [
          143,
          148,
          108
        ],
        "normalized": {
          "sagittal": 0.4673202614379085,
          "coronal": 0.6519823788546255,
          "axial": 0.9
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.009572087152711095,
          1.2875124715199844,
          0.19784134289115146
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 1R",
      "recommendedSliceIndex": {
        "axial": 161,
        "coronal": 143,
        "sagittal": 86
      },
      "matchedSegmentIds": [
        "2.25.53993552652818166383402955961129171632"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_1L",
      "label": "1L",
      "displayLabel": "1L",
      "kind": "lymph_node",
      "stationId": "1L",
      "stationGroupId": "1L",
      "markupFile": "Model/markups/1L.mrk.json",
      "meshNameExpected": "Station 1L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 154,
        "coronal": 146,
        "sagittal": 93
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 1L",
      "voxelIndex": {
        "axial": 103,
        "coronal": 151,
        "sagittal": 131
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -0.16830999103041933,
          -200.07447710673816,
          1276.4128428859017
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -0.16830999103041933,
          -200.07447710673816,
          1276.4128428859017
        ]
      },
      "derived": {
        "continuousVoxel": [
          131.16434434868347,
          151.25657864963586,
          102.90643364998209
        ],
        "roundedVoxel": [
          131,
          151,
          103
        ],
        "normalized": {
          "sagittal": 0.42810457516339867,
          "coronal": 0.6651982378854625,
          "axial": 0.8583333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.00016830999103041933,
          1.2764128428859016,
          0.20007447710673817
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 1L",
      "recommendedSliceIndex": {
        "axial": 154,
        "coronal": 146,
        "sagittal": 93
      },
      "matchedSegmentIds": [
        "2.25.60762053273684785009037968769448832207"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_2R",
      "label": "2R",
      "displayLabel": "2R",
      "kind": "lymph_node",
      "stationId": "2R",
      "stationGroupId": "2R",
      "markupFile": "Model/markups/2R.mrk.json",
      "meshNameExpected": "Station 2R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 158,
        "coronal": 112,
        "sagittal": 84
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 2R",
      "voxelIndex": {
        "axial": 106,
        "coronal": 116,
        "sagittal": 148
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -13.647973590408863,
          -171.57171722444872,
          1282.8934773581566
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -13.647973590408863,
          -171.57171722444872,
          1282.8934773581566
        ]
      },
      "derived": {
        "continuousVoxel": [
          147.9157709576198,
          115.83567316484896,
          106.14675088610954
        ],
        "roundedVoxel": [
          148,
          116,
          106
        ],
        "normalized": {
          "sagittal": 0.48366013071895425,
          "coronal": 0.5110132158590308,
          "axial": 0.8833333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.013647973590408863,
          1.2828934773581566,
          0.17157171722444872
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 2R",
      "recommendedSliceIndex": {
        "axial": 158,
        "coronal": 112,
        "sagittal": 84
      },
      "matchedSegmentIds": [
        "2.25.20830374192229656165820331138320646873"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_2L",
      "label": "2L",
      "displayLabel": "2L",
      "kind": "lymph_node",
      "stationId": "2L",
      "stationGroupId": "2L",
      "markupFile": "Model/markups/2L.mrk.json",
      "meshNameExpected": "Station 2L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 131,
        "coronal": 109,
        "sagittal": 93
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 2L",
      "voxelIndex": {
        "axial": 88,
        "coronal": 113,
        "sagittal": 130
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          0.798289522383806,
          -169.22106966432835,
          1246.3818368829643
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          0.798289522383806,
          -169.22106966432835,
          1246.3818368829643
        ]
      },
      "derived": {
        "continuousVoxel": [
          129.96313330288714,
          112.91448008042754,
          87.8909306485134
        ],
        "roundedVoxel": [
          130,
          113,
          88
        ],
        "normalized": {
          "sagittal": 0.42483660130718953,
          "coronal": 0.4977973568281938,
          "axial": 0.7333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.000798289522383806,
          1.2463818368829644,
          0.16922106966432834
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 2L",
      "recommendedSliceIndex": {
        "axial": 131,
        "coronal": 109,
        "sagittal": 93
      },
      "matchedSegmentIds": [
        "2.25.48624296096474164041790855708405278758"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_3A_1",
      "label": "3A_1",
      "displayLabel": "3A 1",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_1.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 115,
        "coronal": 158,
        "sagittal": 74
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 77,
        "coronal": 164,
        "sagittal": 167
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -28.82176941588532,
          -210.17294269591582,
          1224.3502342573918
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -28.82176941588532,
          -210.17294269591582,
          1224.3502342573918
        ]
      },
      "derived": {
        "continuousVoxel": [
          166.77252693491093,
          163.8061281196819,
          76.87512933572714
        ],
        "roundedVoxel": [
          167,
          164,
          77
        ],
        "normalized": {
          "sagittal": 0.545751633986928,
          "coronal": 0.7224669603524229,
          "axial": 0.6416666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.02882176941588532,
          1.2243502342573918,
          0.21017294269591583
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A",
      "recommendedSliceIndex": {
        "axial": 115,
        "coronal": 158,
        "sagittal": 74
      },
      "matchedSegmentIds": [
        "2.25.312506753561539454691948452144159132025"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_3A_2",
      "label": "3A_2",
      "displayLabel": "3A 2",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_2.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 131,
        "coronal": 168,
        "sagittal": 85
      },
      "notes": "",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 88,
        "coronal": 174,
        "sagittal": 145
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -11.545040218685273,
          -218.57414179777012,
          1246.4004700979663
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -11.545040218685273,
          -218.57414179777012,
          1246.4004700979663
        ]
      },
      "derived": {
        "continuousVoxel": [
          145.30241686460406,
          174.2464532171319,
          87.90024725601438
        ],
        "roundedVoxel": [
          145,
          174,
          88
        ],
        "normalized": {
          "sagittal": 0.4738562091503268,
          "coronal": 0.7665198237885462,
          "axial": 0.7333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.011545040218685272,
          1.2464004700979663,
          0.21857414179777013
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A",
      "recommendedSliceIndex": {
        "axial": 131,
        "coronal": 168,
        "sagittal": 85
      },
      "matchedSegmentIds": [
        "2.25.312506753561539454691948452144159132025"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_3A_3",
      "label": "3A_3",
      "displayLabel": "3A 3",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_3.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 134,
        "coronal": 169,
        "sagittal": 79
      },
      "notes": "",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 90,
        "coronal": 175,
        "sagittal": 157
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -21.006854443442222,
          -219.35027690354323,
          1251.3070895938372
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -21.006854443442222,
          -219.35027690354323,
          1251.3070895938372
        ]
      },
      "derived": {
        "continuousVoxel": [
          157.0607879400302,
          175.21097063013147,
          90.35355700394985
        ],
        "roundedVoxel": [
          157,
          175,
          90
        ],
        "normalized": {
          "sagittal": 0.5130718954248366,
          "coronal": 0.7709251101321586,
          "axial": 0.75
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.021006854443442222,
          1.2513070895938372,
          0.21935027690354322
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A",
      "recommendedSliceIndex": {
        "axial": 134,
        "coronal": 169,
        "sagittal": 79
      },
      "matchedSegmentIds": [
        "2.25.312506753561539454691948452144159132025"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_3A_4",
      "label": "3A_4",
      "displayLabel": "3A 4",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_4.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 131,
        "coronal": 156,
        "sagittal": 77
      },
      "notes": "",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 88,
        "coronal": 162,
        "sagittal": 161
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -24.114476296234628,
          -208.51635525586195,
          1247.440185546875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -24.114476296234628,
          -208.51635525586195,
          1247.440185546875
        ]
      },
      "derived": {
        "continuousVoxel": [
          160.9226869415586,
          161.74745634951785,
          88.42010498046875
        ],
        "roundedVoxel": [
          161,
          162,
          88
        ],
        "normalized": {
          "sagittal": 0.5261437908496732,
          "coronal": 0.7136563876651982,
          "axial": 0.7333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.02411447629623463,
          1.247440185546875,
          0.20851635525586196
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A",
      "recommendedSliceIndex": {
        "axial": 131,
        "coronal": 156,
        "sagittal": 77
      },
      "matchedSegmentIds": [
        "2.25.312506753561539454691948452144159132025"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_3A_5",
      "label": "3A_5",
      "displayLabel": "3A 5",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_5.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 130,
        "coronal": 161,
        "sagittal": 84
      },
      "notes": "",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 87,
        "coronal": 167,
        "sagittal": 148
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -13.458456100911484,
          -212.8168487548828,
          1243.6670188376431
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -13.458456100911484,
          -212.8168487548828,
          1243.6670188376431
        ]
      },
      "derived": {
        "continuousVoxel": [
          147.6802540774677,
          167.0917589502428,
          86.53352162585281
        ],
        "roundedVoxel": [
          148,
          167,
          87
        ],
        "normalized": {
          "sagittal": 0.48366013071895425,
          "coronal": 0.73568281938326,
          "axial": 0.725
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.013458456100911485,
          1.243667018837643,
          0.21281684875488283
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A",
      "recommendedSliceIndex": {
        "axial": 130,
        "coronal": 161,
        "sagittal": 84
      },
      "matchedSegmentIds": [
        "2.25.312506753561539454691948452144159132025"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_3A_6",
      "label": "3A_6",
      "displayLabel": "3A 6",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_6.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 119,
        "coronal": 170,
        "sagittal": 96
      },
      "notes": "",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 80,
        "coronal": 176,
        "sagittal": 125
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          4.400092133199834,
          -219.6369567415788,
          1231.4450348491332
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          4.400092133199834,
          -219.6369567415788,
          1231.4450348491332
        ]
      },
      "derived": {
        "continuousVoxel": [
          125.48710675740703,
          175.56723295312716,
          80.42252963159785
        ],
        "roundedVoxel": [
          125,
          176,
          80
        ],
        "normalized": {
          "sagittal": 0.4084967320261438,
          "coronal": 0.775330396475771,
          "axial": 0.6666666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.004400092133199834,
          1.2314450348491333,
          0.21963695674157882
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A",
      "recommendedSliceIndex": {
        "axial": 119,
        "coronal": 170,
        "sagittal": 96
      },
      "matchedSegmentIds": [
        "2.25.312506753561539454691948452144159132025"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_3A_7",
      "label": "3A_7",
      "displayLabel": "3A 7",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_7.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 109,
        "coronal": 107,
        "sagittal": 74
      },
      "notes": "",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 73,
        "coronal": 111,
        "sagittal": 167
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -28.93680763244629,
          -167.94192650634722,
          1215.8315612501672
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -28.93680763244629,
          -167.94192650634722,
          1215.8315612501672
        ]
      },
      "derived": {
        "continuousVoxel": [
          166.91548704869544,
          111.3248652821597,
          72.61579283211483
        ],
        "roundedVoxel": [
          167,
          111,
          73
        ],
        "normalized": {
          "sagittal": 0.545751633986928,
          "coronal": 0.4889867841409692,
          "axial": 0.6083333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.028936807632446288,
          1.2158315612501671,
          0.1679419265063472
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A",
      "recommendedSliceIndex": {
        "axial": 109,
        "coronal": 107,
        "sagittal": 74
      },
      "matchedSegmentIds": [
        "2.25.312506753561539454691948452144159132025"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_4R_1",
      "label": "4R_1",
      "displayLabel": "4R 1",
      "kind": "lymph_node",
      "stationId": "4R",
      "stationGroupId": "4R",
      "markupFile": "Model/markups/4R_1.mrk.json",
      "meshNameExpected": "Station 4R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 112,
        "coronal": 120,
        "sagittal": 82
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 4R",
      "voxelIndex": {
        "axial": 75,
        "coronal": 124,
        "sagittal": 152
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -17.060216670665696,
          -177.95478321979417,
          1220.0412926391382
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -17.060216670665696,
          -177.95478321979417,
          1220.0412926391382
        ]
      },
      "derived": {
        "continuousVoxel": [
          152.15622837774478,
          123.76802702314234,
          74.72065852660035
        ],
        "roundedVoxel": [
          152,
          124,
          75
        ],
        "normalized": {
          "sagittal": 0.49673202614379086,
          "coronal": 0.5462555066079295,
          "axial": 0.625
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.017060216670665696,
          1.2200412926391382,
          0.17795478321979416
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 4R",
      "recommendedSliceIndex": {
        "axial": 112,
        "coronal": 120,
        "sagittal": 82
      },
      "matchedSegmentIds": [
        "2.25.121062370142623028444183689976439892722"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_4R_2",
      "label": "4R_2",
      "displayLabel": "4R 2",
      "kind": "lymph_node",
      "stationId": "4R",
      "stationGroupId": "4R",
      "markupFile": "Model/markups/4R_2.mrk.json",
      "meshNameExpected": "Station 4R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 130,
        "coronal": 130,
        "sagittal": 85
      },
      "notes": "",
      "meshName": "Station 4R",
      "voxelIndex": {
        "axial": 87,
        "coronal": 135,
        "sagittal": 145
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -10.990352215325188,
          -186.9976425104035,
          1244.0412926391382
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -10.990352215325188,
          -186.9976425104035,
          1244.0412926391382
        ]
      },
      "derived": {
        "continuousVoxel": [
          144.6130958507197,
          135.0057550736083,
          86.72065852660035
        ],
        "roundedVoxel": [
          145,
          135,
          87
        ],
        "normalized": {
          "sagittal": 0.4738562091503268,
          "coronal": 0.5947136563876652,
          "axial": 0.725
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.010990352215325188,
          1.2440412926391382,
          0.1869976425104035
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 4R",
      "recommendedSliceIndex": {
        "axial": 130,
        "coronal": 130,
        "sagittal": 85
      },
      "matchedSegmentIds": [
        "2.25.121062370142623028444183689976439892722"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_4R_3",
      "label": "4R_3",
      "displayLabel": "4R 3",
      "kind": "lymph_node",
      "stationId": "4R",
      "stationGroupId": "4R",
      "markupFile": "Model/markups/4R_3.mrk.json",
      "meshNameExpected": "Station 4R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 142,
        "coronal": 123,
        "sagittal": 81
      },
      "notes": "",
      "meshName": "Station 4R",
      "voxelIndex": {
        "axial": 95,
        "coronal": 128,
        "sagittal": 153
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -17.8034653794829,
          -181.17552762466872,
          1260.0412926391382
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -17.8034653794829,
          -181.17552762466872,
          1260.0412926391382
        ]
      },
      "derived": {
        "continuousVoxel": [
          153.079877258605,
          127.77050550686994,
          94.72065852660035
        ],
        "roundedVoxel": [
          153,
          128,
          95
        ],
        "normalized": {
          "sagittal": 0.5,
          "coronal": 0.5638766519823789,
          "axial": 0.7916666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.0178034653794829,
          1.2600412926391382,
          0.1811755276246687
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 4R",
      "recommendedSliceIndex": {
        "axial": 142,
        "coronal": 123,
        "sagittal": 81
      },
      "matchedSegmentIds": [
        "2.25.121062370142623028444183689976439892722"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_4L_1",
      "label": "4L_1",
      "displayLabel": "4L 1",
      "kind": "lymph_node",
      "stationId": "4L",
      "stationGroupId": "4L",
      "markupFile": "Model/markups/4L_1.mrk.json",
      "meshNameExpected": "Station 4L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 106,
        "coronal": 114,
        "sagittal": 92
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 4L",
      "voxelIndex": {
        "axial": 71,
        "coronal": 118,
        "sagittal": 133
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -1.5909734767025014,
          -173.6342078853047,
          1211.631921563806
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -1.5909734767025014,
          -173.6342078853047,
          1211.631921563806
        ]
      },
      "derived": {
        "continuousVoxel": [
          132.9323145056352,
          118.39876835503892,
          70.51597298893421
        ],
        "roundedVoxel": [
          133,
          118,
          71
        ],
        "normalized": {
          "sagittal": 0.434640522875817,
          "coronal": 0.5198237885462555,
          "axial": 0.5916666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.0015909734767025016,
          1.2116319215638058,
          0.1736342078853047
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 4L",
      "recommendedSliceIndex": {
        "axial": 106,
        "coronal": 114,
        "sagittal": 92
      },
      "matchedSegmentIds": [
        "2.25.276115978171104054815639826201025438059"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_4L_2",
      "label": "4L_2",
      "displayLabel": "4L 2",
      "kind": "lymph_node",
      "stationId": "4L",
      "stationGroupId": "4L",
      "markupFile": "Model/markups/4L_2.mrk.json",
      "meshNameExpected": "Station 4L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 107,
        "coronal": 114,
        "sagittal": 102
      },
      "notes": "",
      "meshName": "Station 4L",
      "voxelIndex": {
        "axial": 72,
        "coronal": 118,
        "sagittal": 114
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          13.68159584204524,
          -173.55347636539645,
          1214.204404970215
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          13.68159584204524,
          -173.55347636539645,
          1214.204404970215
        ]
      },
      "derived": {
        "continuousVoxel": [
          113.9528108862205,
          118.29844180602672,
          71.8022146921387
        ],
        "roundedVoxel": [
          114,
          118,
          72
        ],
        "normalized": {
          "sagittal": 0.37254901960784315,
          "coronal": 0.5198237885462555,
          "axial": 0.6
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.01368159584204524,
          1.214204404970215,
          0.17355347636539645
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 4L",
      "recommendedSliceIndex": {
        "axial": 107,
        "coronal": 114,
        "sagittal": 102
      },
      "matchedSegmentIds": [
        "2.25.276115978171104054815639826201025438059"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_4L_3",
      "label": "4L_3",
      "displayLabel": "4L 3",
      "kind": "lymph_node",
      "stationId": "4L",
      "stationGroupId": "4L",
      "markupFile": "Model/markups/4L_3.mrk.json",
      "meshNameExpected": "Station 4L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 107,
        "coronal": 94,
        "sagittal": 102
      },
      "notes": "",
      "meshName": "Station 4L",
      "voxelIndex": {
        "axial": 72,
        "coronal": 97,
        "sagittal": 114
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          13.418924520143378,
          -156.12623131510122,
          1214.649008377584
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          13.418924520143378,
          -156.12623131510122,
          1214.649008377584
        ]
      },
      "derived": {
        "continuousVoxel": [
          114.27923738334127,
          96.64128290857245,
          72.0245163958233
        ],
        "roundedVoxel": [
          114,
          97,
          72
        ],
        "normalized": {
          "sagittal": 0.37254901960784315,
          "coronal": 0.42731277533039647,
          "axial": 0.6
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.013418924520143378,
          1.214649008377584,
          0.15612623131510123
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 4L",
      "recommendedSliceIndex": {
        "axial": 107,
        "coronal": 94,
        "sagittal": 102
      },
      "matchedSegmentIds": [
        "2.25.276115978171104054815639826201025438059"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_5_nod5",
      "label": "5_nod5",
      "displayLabel": "5 nod5",
      "kind": "lymph_node",
      "stationId": "5",
      "stationGroupId": "5",
      "markupFile": "Model/markups/5_nod5.mrk.json",
      "meshNameExpected": "Station 5",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 104,
        "coronal": 122,
        "sagittal": 108
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 5",
      "voxelIndex": {
        "axial": 70,
        "coronal": 126,
        "sagittal": 102
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          22.970476633020297,
          -179.70470469207044,
          1210.3502342573918
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          22.970476633020297,
          -179.70470469207044,
          1210.3502342573918
        ]
      },
      "derived": {
        "continuousVoxel": [
          102.40934737898937,
          125.94268671684489,
          69.87512933572714
        ],
        "roundedVoxel": [
          102,
          126,
          70
        ],
        "normalized": {
          "sagittal": 0.3333333333333333,
          "coronal": 0.5550660792951542,
          "axial": 0.5833333333333334
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.022970476633020296,
          1.2103502342573917,
          0.17970470469207045
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 5",
      "recommendedSliceIndex": {
        "axial": 104,
        "coronal": 122,
        "sagittal": 108
      },
      "matchedSegmentIds": [
        "2.25.212414958810818875948453230124833991184"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_6_nod5",
      "label": "6_nod5",
      "displayLabel": "6 nod5",
      "kind": "lymph_node",
      "stationId": "6",
      "stationGroupId": "6",
      "markupFile": "Model/markups/6_nod5.mrk.json",
      "meshNameExpected": "Station 6",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 119,
        "coronal": 115,
        "sagittal": 110
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 6",
      "voxelIndex": {
        "axial": 80,
        "coronal": 119,
        "sagittal": 99
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          26.10255620214059,
          -173.84381508805475,
          1230.1392824441064
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          26.10255620214059,
          -173.84381508805475,
          1230.1392824441064
        ]
      },
      "derived": {
        "continuousVoxel": [
          98.51705432221851,
          118.65925109243705,
          79.76965342908443
        ],
        "roundedVoxel": [
          99,
          119,
          80
        ],
        "normalized": {
          "sagittal": 0.3235294117647059,
          "coronal": 0.5242290748898678,
          "axial": 0.6666666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.02610255620214059,
          1.2301392824441064,
          0.17384381508805477
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 6",
      "recommendedSliceIndex": {
        "axial": 119,
        "coronal": 115,
        "sagittal": 110
      },
      "matchedSegmentIds": [
        "2.25.239492796546459861507994252932045774720"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_7_1",
      "label": "7_1",
      "displayLabel": "7 1",
      "kind": "lymph_node",
      "stationId": "7",
      "stationGroupId": "7",
      "markupFile": "Model/markups/7_1.mrk.json",
      "meshNameExpected": "Station 7",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 94,
        "coronal": 93,
        "sagittal": 83
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 7",
      "voxelIndex": {
        "axial": 63,
        "coronal": 96,
        "sagittal": 149
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -14.706595759411217,
          -155.7811967400809,
          1196.0412926391382
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -14.706595759411217,
          -155.7811967400809,
          1196.0412926391382
        ]
      },
      "derived": {
        "continuousVoxel": [
          149.23134025502077,
          96.21250207747924,
          62.720658526600346
        ],
        "roundedVoxel": [
          149,
          96,
          63
        ],
        "normalized": {
          "sagittal": 0.4869281045751634,
          "coronal": 0.42290748898678415,
          "axial": 0.525
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.014706595759411217,
          1.1960412926391382,
          0.1557811967400809
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 7",
      "recommendedSliceIndex": {
        "axial": 94,
        "coronal": 93,
        "sagittal": 83
      },
      "matchedSegmentIds": [
        "2.25.268879151571743626125047618104203736194"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_10R_1",
      "label": "10R_1",
      "displayLabel": "10R 1",
      "kind": "lymph_node",
      "stationId": "10R",
      "stationGroupId": "10R",
      "markupFile": "Model/markups/10R_1.mrk.json",
      "meshNameExpected": "Station 10R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 100,
        "coronal": 120,
        "sagittal": 78
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 10R",
      "voxelIndex": {
        "axial": 67,
        "coronal": 124,
        "sagittal": 159
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -22.437059121548383,
          -177.81774049496937,
          1204.888449697744
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -22.437059121548383,
          -177.81774049496937,
          1204.888449697744
        ]
      },
      "derived": {
        "continuousVoxel": [
          158.8381296759291,
          123.59772150102997,
          67.1442370559032
        ],
        "roundedVoxel": [
          159,
          124,
          67
        ],
        "normalized": {
          "sagittal": 0.5196078431372549,
          "coronal": 0.5462555066079295,
          "axial": 0.5583333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.022437059121548385,
          1.204888449697744,
          0.17781774049496937
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 10R",
      "recommendedSliceIndex": {
        "axial": 100,
        "coronal": 120,
        "sagittal": 78
      },
      "matchedSegmentIds": [
        "2.25.108758159455925476842465611424706367338"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_10R_2",
      "label": "10R_2",
      "displayLabel": "10R 2",
      "kind": "lymph_node",
      "stationId": "10R",
      "stationGroupId": "10R",
      "markupFile": "Model/markups/10R_2.mrk.json",
      "meshNameExpected": "Station 10R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 109,
        "coronal": 108,
        "sagittal": 73
      },
      "notes": "",
      "meshName": "Station 10R",
      "voxelIndex": {
        "axial": 73,
        "coronal": 112,
        "sagittal": 168
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -29.671346554035843,
          -168.09168225995705,
          1215.6287981625358
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -29.671346554035843,
          -168.09168225995705,
          1215.6287981625358
        ]
      },
      "derived": {
        "continuousVoxel": [
          167.82831211630187,
          111.51096951965543,
          72.51441128829913
        ],
        "roundedVoxel": [
          168,
          112,
          73
        ],
        "normalized": {
          "sagittal": 0.5490196078431373,
          "coronal": 0.4933920704845815,
          "axial": 0.6083333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.029671346554035843,
          1.2156287981625358,
          0.16809168225995705
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 10R",
      "recommendedSliceIndex": {
        "axial": 109,
        "coronal": 108,
        "sagittal": 73
      },
      "matchedSegmentIds": [
        "2.25.108758159455925476842465611424706367338"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_10L",
      "label": "10L",
      "displayLabel": "10L",
      "kind": "lymph_node",
      "stationId": "10L",
      "stationGroupId": "10L",
      "markupFile": "Model/markups/10L.mrk.json",
      "meshNameExpected": "Station 10L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 88,
        "coronal": 97,
        "sagittal": 104
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 10L",
      "voxelIndex": {
        "axial": 59,
        "coronal": 101,
        "sagittal": 109
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          17.835157732022797,
          -159.7564549815841,
          1189.0246110717826
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          17.835157732022797,
          -159.7564549815841,
          1189.0246110717826
        ]
      },
      "derived": {
        "continuousVoxel": [
          108.79110290644257,
          101.15262882420168,
          59.21231774292255
        ],
        "roundedVoxel": [
          109,
          101,
          59
        ],
        "normalized": {
          "sagittal": 0.3562091503267974,
          "coronal": 0.44493392070484583,
          "axial": 0.49166666666666664
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.017835157732022797,
          1.1890246110717826,
          0.1597564549815841
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 10L",
      "recommendedSliceIndex": {
        "axial": 88,
        "coronal": 97,
        "sagittal": 104
      },
      "matchedSegmentIds": [
        "2.25.265963977509172877070359499184196808585"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_11L",
      "label": "11L",
      "displayLabel": "11L",
      "kind": "lymph_node",
      "stationId": "11L",
      "stationGroupId": "11L",
      "markupFile": "Model/markups/11L.mrk.json",
      "meshNameExpected": "Station 11L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 84,
        "coronal": 85,
        "sagittal": 116
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 11L",
      "voxelIndex": {
        "axial": 56,
        "coronal": 88,
        "sagittal": 88
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          34.898386391024445,
          -148.92565036362996,
          1181.6709307147491
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          34.898386391024445,
          -148.92565036362996,
          1181.6709307147491
        ]
      },
      "derived": {
        "continuousVoxel": [
          87.58631389331431,
          87.69298813392855,
          55.535477564405824
        ],
        "roundedVoxel": [
          88,
          88,
          56
        ],
        "normalized": {
          "sagittal": 0.2875816993464052,
          "coronal": 0.3876651982378855,
          "axial": 0.4666666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.034898386391024445,
          1.1816709307147493,
          0.14892565036362995
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 11L",
      "recommendedSliceIndex": {
        "axial": 84,
        "coronal": 85,
        "sagittal": 116
      },
      "matchedSegmentIds": [
        "2.25.26054851494271011036540584591024408830"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_11Ri",
      "label": "11Ri",
      "displayLabel": "11Ri",
      "kind": "lymph_node",
      "stationId": "11Ri",
      "stationGroupId": "11R",
      "markupFile": "Model/markups/11Ri.mrk.json",
      "meshNameExpected": "Station 11Ri",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 72,
        "coronal": 94,
        "sagittal": 54
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 11Ri",
      "voxelIndex": {
        "axial": 48,
        "coronal": 97,
        "sagittal": 204
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -58.571725422348635,
          -156.1657563181315,
          1166.3350107574483
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -58.571725422348635,
          -156.1657563181315,
          1166.3350107574483
        ]
      },
      "derived": {
        "continuousVoxel": [
          203.74334604973913,
          96.69040135894019,
          47.86751758575542
        ],
        "roundedVoxel": [
          204,
          97,
          48
        ],
        "normalized": {
          "sagittal": 0.6666666666666666,
          "coronal": 0.42731277533039647,
          "axial": 0.4
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.05857172542234863,
          1.1663350107574484,
          0.1561657563181315
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 11Ri",
      "recommendedSliceIndex": {
        "axial": 72,
        "coronal": 94,
        "sagittal": 54
      },
      "matchedSegmentIds": [
        "2.25.203565841377755533927323140586090706777"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_11Rs_1",
      "label": "11Rs_1",
      "displayLabel": "11Rs 1",
      "kind": "lymph_node",
      "stationId": "11Rs",
      "stationGroupId": "11R",
      "markupFile": "Model/markups/11Rs_1.mrk.json",
      "meshNameExpected": "Station 11Rs",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 95,
        "coronal": 96,
        "sagittal": 64
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 11Rs",
      "voxelIndex": {
        "axial": 64,
        "coronal": 100,
        "sagittal": 186
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -44.68960240920485,
          -158.5468347864842,
          1198.007359511826
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -44.68960240920485,
          -158.5468347864842,
          1198.007359511826
        ]
      },
      "derived": {
        "continuousVoxel": [
          186.491775703308,
          99.64941149436878,
          63.703691962944276
        ],
        "roundedVoxel": [
          186,
          100,
          64
        ],
        "normalized": {
          "sagittal": 0.6078431372549019,
          "coronal": 0.44052863436123346,
          "axial": 0.5333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.04468960240920485,
          1.1980073595118261,
          0.1585468347864842
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 11Rs",
      "recommendedSliceIndex": {
        "axial": 95,
        "coronal": 96,
        "sagittal": 64
      },
      "matchedSegmentIds": [
        "2.25.273934619515693923059552848848411656207"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "node_11Rs_2",
      "label": "11Rs_2",
      "displayLabel": "11Rs 2",
      "kind": "lymph_node",
      "stationId": "11Rs",
      "stationGroupId": "11R",
      "markupFile": "Model/markups/11Rs_2.mrk.json",
      "meshNameExpected": "Station 11Rs",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 91,
        "coronal": 109,
        "sagittal": 62
      },
      "notes": "",
      "meshName": "Station 11Rs",
      "voxelIndex": {
        "axial": 61,
        "coronal": 113,
        "sagittal": 190
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -47.8420757222722,
          -169.23750298841807,
          1193.2762707905492
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -47.8420757222722,
          -169.23750298841807,
          1193.2762707905492
        ]
      },
      "derived": {
        "continuousVoxel": [
          190.40941244187715,
          112.93490207541282,
          61.33814760230587
        ],
        "roundedVoxel": [
          190,
          113,
          61
        ],
        "normalized": {
          "sagittal": 0.6209150326797386,
          "coronal": 0.4977973568281938,
          "axial": 0.5083333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.0478420757222722,
          1.1932762707905493,
          0.16923750298841808
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 11Rs",
      "recommendedSliceIndex": {
        "axial": 91,
        "coronal": 109,
        "sagittal": 62
      },
      "matchedSegmentIds": [
        "2.25.273934619515693923059552848848411656207"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_aorta",
      "label": "aorta",
      "displayLabel": "aorta",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/aorta.mrk.json",
      "meshNameExpected": "aorta",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 121,
        "coronal": 114,
        "sagittal": 101
      },
      "notes": "",
      "meshName": "aorta",
      "voxelIndex": {
        "axial": 81,
        "coronal": 118,
        "sagittal": 115
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          13.22746691934276,
          -173.26671697547613,
          1232.8883918389774
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          13.22746691934276,
          -173.26671697547613,
          1232.8883918389774
        ]
      },
      "derived": {
        "continuousVoxel": [
          114.51716527559834,
          117.94208062243642,
          81.14420812651997
        ],
        "roundedVoxel": [
          115,
          118,
          81
        ],
        "normalized": {
          "sagittal": 0.3758169934640523,
          "coronal": 0.5198237885462555,
          "axial": 0.675
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.01322746691934276,
          1.2328883918389775,
          0.17326671697547613
        ]
      },
      "meshExists": true,
      "meshNameResolved": "aorta",
      "recommendedSliceIndex": {
        "axial": 121,
        "coronal": 114,
        "sagittal": 101
      },
      "matchedSegmentIds": [
        "aorta"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_azygous_vein",
      "label": "azygous vein",
      "displayLabel": "azygous vein",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/azygous vein.mrk.json",
      "meshNameExpected": "azygous vein",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 124,
        "coronal": 106,
        "sagittal": 76
      },
      "notes": "",
      "meshName": "azygous vein",
      "voxelIndex": {
        "axial": 83,
        "coronal": 110,
        "sagittal": 162
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -25.05715251037651,
          -166.79470398190327,
          1237.1281264072636
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -25.05715251037651,
          -166.79470398190327,
          1237.1281264072636
        ]
      },
      "derived": {
        "continuousVoxel": [
          162.0941680620456,
          109.89919068867597,
          83.26407541066305
        ],
        "roundedVoxel": [
          162,
          110,
          83
        ],
        "normalized": {
          "sagittal": 0.5294117647058824,
          "coronal": 0.4845814977973568,
          "axial": 0.6916666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.02505715251037651,
          1.2371281264072636,
          0.16679470398190327
        ]
      },
      "meshExists": true,
      "meshNameResolved": "azygous vein",
      "recommendedSliceIndex": {
        "axial": 124,
        "coronal": 106,
        "sagittal": 76
      },
      "matchedSegmentIds": [
        "2.25.111239317664077265941812615039469954434"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_brachiocephalic_trunk",
      "label": "brachiocephalic trunk",
      "displayLabel": "brachiocephalic trunk",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/brachiocephalic trunk.mrk.json",
      "meshNameExpected": "brachiocephalic trunk",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 143,
        "coronal": 138,
        "sagittal": 89
      },
      "notes": "",
      "meshName": "brachiocephalic trunk",
      "voxelIndex": {
        "axial": 96,
        "coronal": 143,
        "sagittal": 139
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -6.394236111576021,
          -193.66002442896,
          1263.2654123770576
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -6.394236111576021,
          -193.66002442896,
          1263.2654123770576
        ]
      },
      "derived": {
        "continuousVoxel": [
          138.90141758586634,
          143.28521998210573,
          96.33271839556005
        ],
        "roundedVoxel": [
          139,
          143,
          96
        ],
        "normalized": {
          "sagittal": 0.4542483660130719,
          "coronal": 0.6299559471365639,
          "axial": 0.8
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.006394236111576021,
          1.2632654123770577,
          0.19366002442896002
        ]
      },
      "meshExists": true,
      "meshNameResolved": "brachiocephalic trunk",
      "recommendedSliceIndex": {
        "axial": 143,
        "coronal": 138,
        "sagittal": 89
      },
      "matchedSegmentIds": [
        "brachiocephalic_trunk"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_right_brachiocephalic_vein",
      "label": "right brachiocephalic vein",
      "displayLabel": "right brachiocephalic vein",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/right brachiocephalic vein.mrk.json",
      "meshNameExpected": "right brachiocephalic vein",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 143,
        "coronal": 137,
        "sagittal": 73
      },
      "notes": "",
      "meshName": "right brachiocephalic vein",
      "voxelIndex": {
        "axial": 96,
        "coronal": 142,
        "sagittal": 169
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -30.44104435111175,
          -192.49091730698146,
          1262.6529242002327
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -30.44104435111175,
          -192.49091730698146,
          1262.6529242002327
        ]
      },
      "derived": {
        "continuousVoxel": [
          168.78482976703697,
          141.83234899556928,
          96.02647430714762
        ],
        "roundedVoxel": [
          169,
          142,
          96
        ],
        "normalized": {
          "sagittal": 0.5522875816993464,
          "coronal": 0.6255506607929515,
          "axial": 0.8
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.03044104435111175,
          1.2626529242002327,
          0.19249091730698145
        ]
      },
      "meshExists": true,
      "meshNameResolved": "right brachiocephalic vein",
      "recommendedSliceIndex": {
        "axial": 143,
        "coronal": 137,
        "sagittal": 73
      },
      "matchedSegmentIds": [
        "brachiocephalic_vein_right"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_left_brachiocephalic_vein",
      "label": "left brachiocephalic vein",
      "displayLabel": "left brachiocephalic vein",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/left brachiocephalic vein.mrk.json",
      "meshNameExpected": "left brachiocephalic vein",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 140,
        "coronal": 158,
        "sagittal": 90
      },
      "notes": "",
      "meshName": "left brachiocephalic vein",
      "voxelIndex": {
        "axial": 94,
        "coronal": 164,
        "sagittal": 136
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -4.2395104549813425,
          -210.71826921033454,
          1258.5978472776178
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -4.2395104549813425,
          -210.71826921033454,
          1258.5978472776178
        ]
      },
      "derived": {
        "continuousVoxel": [
          136.22370026504967,
          164.48381543857116,
          93.99893584584015
        ],
        "roundedVoxel": [
          136,
          164,
          94
        ],
        "normalized": {
          "sagittal": 0.4444444444444444,
          "coronal": 0.7224669603524229,
          "axial": 0.7833333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.004239510454981343,
          1.2585978472776178,
          0.21071826921033454
        ]
      },
      "meshExists": true,
      "meshNameResolved": "left brachiocephalic vein",
      "recommendedSliceIndex": {
        "axial": 140,
        "coronal": 158,
        "sagittal": 90
      },
      "matchedSegmentIds": [
        "brachiocephalic_vein_left"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_superior_vena_cava",
      "label": "superior vena cava",
      "displayLabel": "superior vena cava",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/superior vena cava.mrk.json",
      "meshNameExpected": "superior vena cava",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 122,
        "coronal": 132,
        "sagittal": 73
      },
      "notes": "",
      "meshName": "superior vena cava",
      "voxelIndex": {
        "axial": 82,
        "coronal": 137,
        "sagittal": 169
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -30.64965529626175,
          -188.2784838371971,
          1235.1281264072636
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -30.64965529626175,
          -188.2784838371971,
          1235.1281264072636
        ]
      },
      "derived": {
        "continuousVoxel": [
          169.04407443673796,
          136.5974802175848,
          82.26407541066305
        ],
        "roundedVoxel": [
          169,
          137,
          82
        ],
        "normalized": {
          "sagittal": 0.5522875816993464,
          "coronal": 0.6035242290748899,
          "axial": 0.6833333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.03064965529626175,
          1.2351281264072635,
          0.18827848383719709
        ]
      },
      "meshExists": true,
      "meshNameResolved": "superior vena cava",
      "recommendedSliceIndex": {
        "axial": 122,
        "coronal": 132,
        "sagittal": 73
      },
      "matchedSegmentIds": [
        "superior_vena_cava"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_inferior_vena_cava",
      "label": "inferior vena cava",
      "displayLabel": "inferior vena cava",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/inferior vena cava.mrk.json",
      "meshNameExpected": "inferior vena cava",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 27,
        "coronal": 119,
        "sagittal": 72
      },
      "notes": "",
      "meshName": "inferior vena cava",
      "voxelIndex": {
        "axial": 18,
        "coronal": 123,
        "sagittal": 171
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -31.995774268410457,
          -177.40705256683287,
          1106.0101318359375
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -31.995774268410457,
          -177.40705256683287,
          1106.0101318359375
        ]
      },
      "derived": {
        "continuousVoxel": [
          170.716921314748,
          123.08735203693801,
          17.705078125
        ],
        "roundedVoxel": [
          171,
          123,
          18
        ],
        "normalized": {
          "sagittal": 0.5588235294117647,
          "coronal": 0.5418502202643172,
          "axial": 0.15
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.03199577426841046,
          1.1060101318359374,
          0.17740705256683287
        ]
      },
      "meshExists": true,
      "meshNameResolved": "inferior vena cava",
      "recommendedSliceIndex": {
        "axial": 27,
        "coronal": 119,
        "sagittal": 72
      },
      "matchedSegmentIds": [
        "inferior_vena_cava"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_right_common_carotid_artery",
      "label": "right common carotid artery",
      "displayLabel": "right common carotid artery",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/right common carotid artery.mrk.json",
      "meshNameExpected": "right common carotid artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 167,
        "coronal": 129,
        "sagittal": 82
      },
      "notes": "",
      "meshName": "right common carotid artery",
      "voxelIndex": {
        "axial": 112,
        "coronal": 134,
        "sagittal": 152
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -17.13595377416726,
          -186.2766539982334,
          1295.2818245852272
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -17.13595377416726,
          -186.2766539982334,
          1295.2818245852272
        ]
      },
      "derived": {
        "continuousVoxel": [
          152.25034827335838,
          134.10976934974644,
          112.34092449964487
        ],
        "roundedVoxel": [
          152,
          134,
          112
        ],
        "normalized": {
          "sagittal": 0.49673202614379086,
          "coronal": 0.5903083700440529,
          "axial": 0.9333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.01713595377416726,
          1.2952818245852273,
          0.1862766539982334
        ]
      },
      "meshExists": true,
      "meshNameResolved": "right common carotid artery",
      "recommendedSliceIndex": {
        "axial": 167,
        "coronal": 129,
        "sagittal": 82
      },
      "matchedSegmentIds": [
        "common_carotid_artery_right"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_left_common_carotid_artery",
      "label": "left common carotid artery",
      "displayLabel": "left common carotid artery",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/left common carotid artery.mrk.json",
      "meshNameExpected": "left common carotid artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 167,
        "coronal": 127,
        "sagittal": 100
      },
      "notes": "",
      "meshName": "left common carotid artery",
      "voxelIndex": {
        "axial": 112,
        "coronal": 132,
        "sagittal": 118
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          10.501593089524182,
          -184.86336507166618,
          1294.2476806640625
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          10.501593089524182,
          -184.86336507166618,
          1294.2476806640625
        ]
      },
      "derived": {
        "continuousVoxel": [
          117.90465896702338,
          132.3534491303231,
          111.8238525390625
        ],
        "roundedVoxel": [
          118,
          132,
          112
        ],
        "normalized": {
          "sagittal": 0.38562091503267976,
          "coronal": 0.5814977973568282,
          "axial": 0.9333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.010501593089524182,
          1.2942476806640626,
          0.18486336507166617
        ]
      },
      "meshExists": true,
      "meshNameResolved": "left common carotid artery",
      "recommendedSliceIndex": {
        "axial": 167,
        "coronal": 127,
        "sagittal": 100
      },
      "matchedSegmentIds": [
        "common_carotid_artery_left"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_right_subclavian_artery",
      "label": "right subclavian artery",
      "displayLabel": "right subclavian artery",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/right subclavian artery.mrk.json",
      "meshNameExpected": "right subclavian artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 164,
        "coronal": 119,
        "sagittal": 76
      },
      "notes": "",
      "meshName": "right subclavian artery",
      "voxelIndex": {
        "axial": 110,
        "coronal": 123,
        "sagittal": 162
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -25.186295498394234,
          -177.09542505428277,
          1290.3516845703125
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -25.186295498394234,
          -177.09542505428277,
          1290.3516845703125
        ]
      },
      "derived": {
        "continuousVoxel": [
          162.25465643550453,
          122.70008677862332,
          109.8758544921875
        ],
        "roundedVoxel": [
          162,
          123,
          110
        ],
        "normalized": {
          "sagittal": 0.5294117647058824,
          "coronal": 0.5418502202643172,
          "axial": 0.9166666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.025186295498394233,
          1.2903516845703125,
          0.17709542505428277
        ]
      },
      "meshExists": true,
      "meshNameResolved": "right subclavian artery",
      "recommendedSliceIndex": {
        "axial": 164,
        "coronal": 119,
        "sagittal": 76
      },
      "matchedSegmentIds": [
        "subclavian_artery_right"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_left_subclavian_artery",
      "label": "left subclavian artery",
      "displayLabel": "left subclavian artery",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/left subclavian artery.mrk.json",
      "meshNameExpected": "left subclavian artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 151,
        "coronal": 117,
        "sagittal": 99
      },
      "notes": "",
      "meshName": "left subclavian artery",
      "voxelIndex": {
        "axial": 101,
        "coronal": 121,
        "sagittal": 120
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          8.687915423994824,
          -175.5670623779297,
          1272.8781166930617
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          8.687915423994824,
          -175.5670623779297,
          1272.8781166930617
        ]
      },
      "derived": {
        "continuousVoxel": [
          120.15854965816666,
          120.80076228762142,
          101.13907055356208
        ],
        "roundedVoxel": [
          120,
          121,
          101
        ],
        "normalized": {
          "sagittal": 0.39215686274509803,
          "coronal": 0.5330396475770925,
          "axial": 0.8416666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.008687915423994825,
          1.2728781166930616,
          0.17556706237792968
        ]
      },
      "meshExists": true,
      "meshNameResolved": "left subclavian artery",
      "recommendedSliceIndex": {
        "axial": 151,
        "coronal": 117,
        "sagittal": 99
      },
      "matchedSegmentIds": [
        "subclavian_artery_left"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_bronchus_intermedius",
      "label": "bronchus intermedius",
      "displayLabel": "bronchus intermedius",
      "kind": "landmark",
      "landmarkGroup": "airway",
      "markupFile": "Model/markups/bronchus intermedius.mrk.json",
      "meshNameExpected": "airway",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 87,
        "coronal": 86,
        "sagittal": 67
      },
      "notes": "",
      "meshName": "airway",
      "voxelIndex": {
        "axial": 58,
        "coronal": 89,
        "sagittal": 179
      },
      "structureGroupId": "airway",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -38.42111602055939,
          -150.22014935438048,
          1185.6719906360465
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -38.42111602055939,
          -150.22014935438048,
          1185.6719906360465
        ]
      },
      "derived": {
        "continuousVoxel": [
          178.70181203586512,
          89.30168590884182,
          57.536007525054515
        ],
        "roundedVoxel": [
          179,
          89,
          58
        ],
        "normalized": {
          "sagittal": 0.5849673202614379,
          "coronal": 0.3920704845814978,
          "axial": 0.48333333333333334
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.03842111602055939,
          1.1856719906360464,
          0.1502201493543805
        ]
      },
      "meshExists": true,
      "meshNameResolved": "airway",
      "recommendedSliceIndex": {
        "axial": 87,
        "coronal": 86,
        "sagittal": 67
      },
      "matchedSegmentIds": [
        "2.25.314609811388436314422080028160079540590"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_carina",
      "label": "carina",
      "displayLabel": "carina",
      "kind": "landmark",
      "landmarkGroup": "airway",
      "markupFile": "Model/markups/carina.mrk.json",
      "meshNameExpected": "airway",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 104,
        "coronal": 96,
        "sagittal": 84
      },
      "notes": "",
      "meshName": "airway",
      "voxelIndex": {
        "axial": 70,
        "coronal": 99,
        "sagittal": 147
      },
      "structureGroupId": "airway",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -12.767176630104522,
          -157.77453819821739,
          1210.7629090195594
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -12.767176630104522,
          -157.77453819821739,
          1210.7629090195594
        ]
      },
      "derived": {
        "continuousVoxel": [
          146.8211883273387,
          98.68966427788186,
          70.08146671681095
        ],
        "roundedVoxel": [
          147,
          99,
          70
        ],
        "normalized": {
          "sagittal": 0.4803921568627451,
          "coronal": 0.43612334801762115,
          "axial": 0.5833333333333334
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.012767176630104522,
          1.2107629090195595,
          0.15777453819821738
        ]
      },
      "meshExists": true,
      "meshNameResolved": "airway",
      "recommendedSliceIndex": {
        "axial": 104,
        "coronal": 96,
        "sagittal": 84
      },
      "matchedSegmentIds": [
        "2.25.314609811388436314422080028160079540590"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_trachea",
      "label": "trachea",
      "displayLabel": "trachea",
      "kind": "landmark",
      "landmarkGroup": "airway",
      "markupFile": "Model/markups/trachea.mrk.json",
      "meshNameExpected": "airway",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 133,
        "coronal": 111,
        "sagittal": 87
      },
      "notes": "",
      "meshName": "airway",
      "voxelIndex": {
        "axial": 89,
        "coronal": 115,
        "sagittal": 142
      },
      "structureGroupId": "airway",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -9.046358244334094,
          -170.5155223676737,
          1248.7629090195594
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -9.046358244334094,
          -170.5155223676737,
          1248.7629090195594
        ]
      },
      "derived": {
        "continuousVoxel": [
          142.19725868288612,
          114.52312033312855,
          89.08146671681095
        ],
        "roundedVoxel": [
          142,
          115,
          89
        ],
        "normalized": {
          "sagittal": 0.46405228758169936,
          "coronal": 0.5066079295154186,
          "axial": 0.7416666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.009046358244334094,
          1.2487629090195593,
          0.1705155223676737
        ]
      },
      "meshExists": true,
      "meshNameResolved": "airway",
      "recommendedSliceIndex": {
        "axial": 133,
        "coronal": 111,
        "sagittal": 87
      },
      "matchedSegmentIds": [
        "2.25.314609811388436314422080028160079540590"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_left_mainstem",
      "label": "left mainstem",
      "displayLabel": "left mainstem",
      "kind": "landmark",
      "landmarkGroup": "airway",
      "markupFile": "Model/markups/left mainstem.mrk.json",
      "meshNameExpected": "airway",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 98,
        "coronal": 92,
        "sagittal": 92
      },
      "notes": "",
      "meshName": "airway",
      "voxelIndex": {
        "axial": 66,
        "coronal": 95,
        "sagittal": 133
      },
      "structureGroupId": "airway",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -1.6210419837718888,
          -154.58663418607236,
          1202.518246750665
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -1.6210419837718888,
          -154.58663418607236,
          1202.518246750665
        ]
      },
      "derived": {
        "continuousVoxel": [
          132.9696811940321,
          94.7279971559929,
          65.95913558236373
        ],
        "roundedVoxel": [
          133,
          95,
          66
        ],
        "normalized": {
          "sagittal": 0.434640522875817,
          "coronal": 0.4185022026431718,
          "axial": 0.55
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.0016210419837718888,
          1.202518246750665,
          0.15458663418607235
        ]
      },
      "meshExists": true,
      "meshNameResolved": "airway",
      "recommendedSliceIndex": {
        "axial": 98,
        "coronal": 92,
        "sagittal": 92
      },
      "matchedSegmentIds": [
        "2.25.314609811388436314422080028160079540590"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_right_mainstem",
      "label": "right mainstem",
      "displayLabel": "right mainstem",
      "kind": "landmark",
      "landmarkGroup": "airway",
      "markupFile": "Model/markups/right mainstem.mrk.json",
      "meshNameExpected": "airway",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 101,
        "coronal": 94,
        "sagittal": 76
      },
      "notes": "",
      "meshName": "airway",
      "voxelIndex": {
        "axial": 68,
        "coronal": 97,
        "sagittal": 162
      },
      "structureGroupId": "airway",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -25.009533482707944,
          -156.19600918607236,
          1206.7706997504715
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -25.009533482707944,
          -156.19600918607236,
          1206.7706997504715
        ]
      },
      "derived": {
        "continuousVoxel": [
          162.03499101795265,
          96.7279971559929,
          68.08536208226701
        ],
        "roundedVoxel": [
          162,
          97,
          68
        ],
        "normalized": {
          "sagittal": 0.5294117647058824,
          "coronal": 0.42731277533039647,
          "axial": 0.5666666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.025009533482707944,
          1.2067706997504715,
          0.15619600918607238
        ]
      },
      "meshExists": true,
      "meshNameResolved": "airway",
      "recommendedSliceIndex": {
        "axial": 101,
        "coronal": 94,
        "sagittal": 76
      },
      "matchedSegmentIds": [
        "2.25.314609811388436314422080028160079540590"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_esophagus",
      "label": "esophagus",
      "displayLabel": "esophagus",
      "kind": "landmark",
      "landmarkGroup": "gi",
      "markupFile": "Model/markups/esophagus.mrk.json",
      "meshNameExpected": "esophagus",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 95,
        "coronal": 74,
        "sagittal": 88
      },
      "notes": "",
      "meshName": "esophagus",
      "voxelIndex": {
        "axial": 64,
        "coronal": 77,
        "sagittal": 140
      },
      "structureGroupId": "gi",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -6.904068870708699,
          -140.52347113691818,
          1198.7629090195594
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -6.904068870708699,
          -140.52347113691818,
          1198.7629090195594
        ]
      },
      "derived": {
        "continuousVoxel": [
          139.5349961603225,
          77.25144501723818,
          64.08146671681095
        ],
        "roundedVoxel": [
          140,
          77,
          64
        ],
        "normalized": {
          "sagittal": 0.45751633986928103,
          "coronal": 0.3392070484581498,
          "axial": 0.5333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.006904068870708699,
          1.1987629090195595,
          0.14052347113691818
        ]
      },
      "meshExists": true,
      "meshNameResolved": "esophagus",
      "recommendedSliceIndex": {
        "axial": 95,
        "coronal": 74,
        "sagittal": 88
      },
      "matchedSegmentIds": [
        "esophagus"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_main_pa",
      "label": "main PA",
      "displayLabel": "main PA",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/main PA.mrk.json",
      "meshNameExpected": "pulmonary artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 84,
        "coronal": 157,
        "sagittal": 98
      },
      "notes": "",
      "meshName": "pulmonary artery",
      "voxelIndex": {
        "axial": 56,
        "coronal": 163,
        "sagittal": 121
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          8.30116469131218,
          -209.6028340240154,
          1183.5243634673996
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          8.30116469131218,
          -209.6028340240154,
          1183.5243634673996
        ]
      },
      "derived": {
        "continuousVoxel": [
          120.6391719279082,
          163.0976435565435,
          56.46219394073103
        ],
        "roundedVoxel": [
          121,
          163,
          56
        ],
        "normalized": {
          "sagittal": 0.3954248366013072,
          "coronal": 0.7180616740088106,
          "axial": 0.4666666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.008301164691312181,
          1.1835243634673995,
          0.20960283402401542
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary artery",
      "recommendedSliceIndex": {
        "axial": 84,
        "coronal": 157,
        "sagittal": 98
      },
      "matchedSegmentIds": [
        "pulmonary_artery"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_left_pa",
      "label": "left PA",
      "displayLabel": "left PA",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/left PA.mrk.json",
      "meshNameExpected": "pulmonary artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 97,
        "coronal": 100,
        "sagittal": 106
      },
      "notes": "",
      "meshName": "pulmonary artery",
      "voxelIndex": {
        "axial": 65,
        "coronal": 104,
        "sagittal": 106
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          20.062582669992707,
          -161.98049880130864,
          1200.7629090195594
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          20.062582669992707,
          -161.98049880130864,
          1200.7629090195594
        ]
      },
      "derived": {
        "continuousVoxel": [
          106.02304084760618,
          103.9164891050244,
          65.08146671681095
        ],
        "roundedVoxel": [
          106,
          104,
          65
        ],
        "normalized": {
          "sagittal": 0.3464052287581699,
          "coronal": 0.4581497797356828,
          "axial": 0.5416666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.02006258266999271,
          1.2007629090195595,
          0.16198049880130863
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary artery",
      "recommendedSliceIndex": {
        "axial": 97,
        "coronal": 100,
        "sagittal": 106
      },
      "matchedSegmentIds": [
        "pulmonary_artery"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_right_pa",
      "label": "right PA",
      "displayLabel": "right PA",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/right PA.mrk.json",
      "meshNameExpected": "pulmonary artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 87,
        "coronal": 107,
        "sagittal": 74
      },
      "notes": "",
      "meshName": "pulmonary artery",
      "voxelIndex": {
        "axial": 58,
        "coronal": 111,
        "sagittal": 167
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -29.084557399152487,
          -167.93500883405022,
          1186.041963330251
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -29.084557399152487,
          -167.93500883405022,
          1186.041963330251
        ]
      },
      "derived": {
        "continuousVoxel": [
          167.09909840926235,
          111.31626856318869,
          57.72099387215678
        ],
        "roundedVoxel": [
          167,
          111,
          58
        ],
        "normalized": {
          "sagittal": 0.545751633986928,
          "coronal": 0.4889867841409692,
          "axial": 0.48333333333333334
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.02908455739915249,
          1.186041963330251,
          0.16793500883405021
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary artery",
      "recommendedSliceIndex": {
        "axial": 87,
        "coronal": 107,
        "sagittal": 74
      },
      "matchedSegmentIds": [
        "pulmonary_artery"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_left_inferior_pv",
      "label": "left inferior PV",
      "displayLabel": "left inferior PV",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/left inferior PV.mrk.json",
      "meshNameExpected": "pulmonary venous system",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 73,
        "coronal": 81,
        "sagittal": 104
      },
      "notes": "",
      "meshName": "pulmonary venous system",
      "voxelIndex": {
        "axial": 49,
        "coronal": 84,
        "sagittal": 110
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          16.948248234858113,
          -146.02948052569982,
          1168.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          16.948248234858113,
          -146.02948052569982,
          1168.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          109.89328169903558,
          84.09386445184062,
          49.189697265625
        ],
        "roundedVoxel": [
          110,
          84,
          49
        ],
        "normalized": {
          "sagittal": 0.35947712418300654,
          "coronal": 0.3700440528634361,
          "axial": 0.4083333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.016948248234858115,
          1.1689793701171876,
          0.14602948052569983
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary venous system",
      "recommendedSliceIndex": {
        "axial": 73,
        "coronal": 81,
        "sagittal": 104
      },
      "matchedSegmentIds": [
        "pulmonary_vein"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_left_superior_pv",
      "label": "left superior PV",
      "displayLabel": "left superior PV",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/left superior PV.mrk.json",
      "meshNameExpected": "pulmonary venous system",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 81,
        "coronal": 93,
        "sagittal": 108
      },
      "notes": "",
      "meshName": "pulmonary venous system",
      "voxelIndex": {
        "axial": 54,
        "coronal": 96,
        "sagittal": 102
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          23.429883653802136,
          -155.94256998996715,
          1178.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          23.429883653802136,
          -155.94256998996715,
          1178.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          101.83843379976534,
          96.41304359190099,
          54.189697265625
        ],
        "roundedVoxel": [
          102,
          96,
          54
        ],
        "normalized": {
          "sagittal": 0.3333333333333333,
          "coronal": 0.42290748898678415,
          "axial": 0.45
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.023429883653802136,
          1.1789793701171876,
          0.15594256998996717
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary venous system",
      "recommendedSliceIndex": {
        "axial": 81,
        "coronal": 93,
        "sagittal": 108
      },
      "matchedSegmentIds": [
        "pulmonary_vein"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_right_inferior_pv",
      "label": "right inferior PV",
      "displayLabel": "right inferior PV",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/right inferior PV.mrk.json",
      "meshNameExpected": "pulmonary venous system",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 64,
        "coronal": 79,
        "sagittal": 72
      },
      "notes": "",
      "meshName": "pulmonary venous system",
      "voxelIndex": {
        "axial": 43,
        "coronal": 82,
        "sagittal": 171
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -32.23592641477598,
          -144.31375350303816,
          1156.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -32.23592641477598,
          -144.31375350303816,
          1156.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          171.01536281702747,
          81.96169883144553,
          43.189697265625
        ],
        "roundedVoxel": [
          171,
          82,
          43
        ],
        "normalized": {
          "sagittal": 0.5588235294117647,
          "coronal": 0.36123348017621143,
          "axial": 0.35833333333333334
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.03223592641477598,
          1.1569793701171875,
          0.14431375350303816
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary venous system",
      "recommendedSliceIndex": {
        "axial": 64,
        "coronal": 79,
        "sagittal": 72
      },
      "matchedSegmentIds": [
        "pulmonary_vein"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_right_superior_pv",
      "label": "right superior PV",
      "displayLabel": "right superior PV",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/right superior PV.mrk.json",
      "meshNameExpected": "pulmonary venous system",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 70,
        "coronal": 108,
        "sagittal": 64
      },
      "notes": "",
      "meshName": "pulmonary venous system",
      "voxelIndex": {
        "axial": 47,
        "coronal": 112,
        "sagittal": 186
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -44.05537923755627,
          -168.3339318203013,
          1164.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -44.05537923755627,
          -168.3339318203013,
          1164.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          185.70361486863794,
          111.81201751697644,
          47.189697265625
        ],
        "roundedVoxel": [
          186,
          112,
          47
        ],
        "normalized": {
          "sagittal": 0.6078431372549019,
          "coronal": 0.4933920704845815,
          "axial": 0.39166666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.044055379237556265,
          1.1649793701171876,
          0.16833393182030132
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary venous system",
      "recommendedSliceIndex": {
        "axial": 70,
        "coronal": 108,
        "sagittal": 64
      },
      "matchedSegmentIds": [
        "pulmonary_vein"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_left_atrium",
      "label": "left atrium",
      "displayLabel": "left atrium",
      "kind": "landmark",
      "landmarkGroup": "cardiac",
      "markupFile": "Model/markups/left atrium.mrk.json",
      "meshNameExpected": "left atrium",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 58,
        "coronal": 107,
        "sagittal": 91
      },
      "notes": "",
      "meshName": "left atrium",
      "voxelIndex": {
        "axial": 39,
        "coronal": 111,
        "sagittal": 134
      },
      "structureGroupId": "cardiac",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -2.8354312015674736,
          -168.0365183093985,
          1149.047899207885
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -2.8354312015674736,
          -168.0365183093985,
          1149.047899207885
        ]
      },
      "derived": {
        "continuousVoxel": [
          134.47882507634117,
          111.44241626070888,
          39.22396181097372
        ],
        "roundedVoxel": [
          134,
          111,
          39
        ],
        "normalized": {
          "sagittal": 0.43790849673202614,
          "coronal": 0.4889867841409692,
          "axial": 0.325
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.002835431201567474,
          1.149047899207885,
          0.1680365183093985
        ]
      },
      "meshExists": true,
      "meshNameResolved": "left atrium",
      "recommendedSliceIndex": {
        "axial": 58,
        "coronal": 107,
        "sagittal": 91
      },
      "matchedSegmentIds": [
        "2.25.11162851537065423916236596478087091296"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_left_atrial_appendage",
      "label": "left atrial appendage",
      "displayLabel": "left atrial appendage",
      "kind": "landmark",
      "landmarkGroup": "cardiac",
      "markupFile": "Model/markups/left atrial appendage.mrk.json",
      "meshNameExpected": "left atrial appendage",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 78,
        "coronal": 130,
        "sagittal": 108
      },
      "notes": "",
      "meshName": "left atrial appendage",
      "voxelIndex": {
        "axial": 52,
        "coronal": 135,
        "sagittal": 102
      },
      "structureGroupId": "cardiac",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          23.24896544875024,
          -187.38375177214144,
          1174.6614698140588
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          23.24896544875024,
          -187.38375177214144,
          1174.6614698140588
        ]
      },
      "derived": {
        "continuousVoxel": [
          102.06326419050944,
          135.4855801755739,
          52.03074711406066
        ],
        "roundedVoxel": [
          102,
          135,
          52
        ],
        "normalized": {
          "sagittal": 0.3333333333333333,
          "coronal": 0.5947136563876652,
          "axial": 0.43333333333333335
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.023248965448750242,
          1.174661469814059,
          0.18738375177214145
        ]
      },
      "meshExists": true,
      "meshNameResolved": "left atrial appendage",
      "recommendedSliceIndex": {
        "axial": 78,
        "coronal": 130,
        "sagittal": 108
      },
      "matchedSegmentIds": [
        "atrial_appendage_left"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_left_ventricle",
      "label": "left ventricle",
      "displayLabel": "left ventricle",
      "kind": "landmark",
      "landmarkGroup": "cardiac",
      "markupFile": "Model/markups/left ventricle.mrk.json",
      "meshNameExpected": "left ventricle",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 33,
        "coronal": 140,
        "sagittal": 118
      },
      "notes": "",
      "meshName": "left ventricle",
      "voxelIndex": {
        "axial": 22,
        "coronal": 145,
        "sagittal": 83
      },
      "structureGroupId": "cardiac",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          38.49588173414643,
          -194.91694772864025,
          1114.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          38.49588173414643,
          -194.91694772864025,
          1114.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          83.11564006885204,
          144.84722175258213,
          22.189697265625
        ],
        "roundedVoxel": [
          83,
          145,
          22
        ],
        "normalized": {
          "sagittal": 0.27124183006535946,
          "coronal": 0.6387665198237885,
          "axial": 0.18333333333333332
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.038495881734146434,
          1.1149793701171875,
          0.19491694772864027
        ]
      },
      "meshExists": true,
      "meshNameResolved": "left ventricle",
      "recommendedSliceIndex": {
        "axial": 33,
        "coronal": 140,
        "sagittal": 118
      },
      "matchedSegmentIds": [
        "2.25.122868581635728138705614725803586075780"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_right_atrium",
      "label": "right atrium",
      "displayLabel": "right atrium",
      "kind": "landmark",
      "landmarkGroup": "cardiac",
      "markupFile": "Model/markups/right atrium.mrk.json",
      "meshNameExpected": "right atrium",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 48,
        "coronal": 145,
        "sagittal": 68
      },
      "notes": "",
      "meshName": "right atrium",
      "voxelIndex": {
        "axial": 32,
        "coronal": 150,
        "sagittal": 177
      },
      "structureGroupId": "cardiac",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -37.278637189433084,
          -198.68771762768097,
          1134.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -37.278637189433084,
          -198.68771762768097,
          1134.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          177.28203251757222,
          149.53322706401138,
          32.189697265625
        ],
        "roundedVoxel": [
          177,
          150,
          32
        ],
        "normalized": {
          "sagittal": 0.5784313725490197,
          "coronal": 0.6607929515418502,
          "axial": 0.26666666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.037278637189433084,
          1.1349793701171875,
          0.19868771762768098
        ]
      },
      "meshExists": true,
      "meshNameResolved": "right atrium",
      "recommendedSliceIndex": {
        "axial": 48,
        "coronal": 145,
        "sagittal": 68
      },
      "matchedSegmentIds": [
        "2.25.94981541103766622373479159084072708115"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    },
    {
      "id": "landmark_right_ventricle",
      "label": "right ventricle",
      "displayLabel": "right ventricle",
      "kind": "landmark",
      "landmarkGroup": "cardiac",
      "markupFile": "Model/markups/right ventricle.mrk.json",
      "meshNameExpected": "right ventricle",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 30,
        "coronal": 172,
        "sagittal": 95
      },
      "notes": "",
      "meshName": "right ventricle",
      "voxelIndex": {
        "axial": 20,
        "coronal": 178,
        "sagittal": 126
      },
      "structureGroupId": "cardiac",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          3.8407107572487007,
          -221.67145796469083,
          1110.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          3.8407107572487007,
          -221.67145796469083,
          1110.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          126.18226031198708,
          178.09554515272268,
          20.189697265625
        ],
        "roundedVoxel": [
          126,
          178,
          20
        ],
        "normalized": {
          "sagittal": 0.4117647058823529,
          "coronal": 0.7841409691629956,
          "axial": 0.16666666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.0038407107572487006,
          1.1109793701171875,
          0.22167145796469084
        ]
      },
      "meshExists": true,
      "meshNameResolved": "right ventricle",
      "recommendedSliceIndex": {
        "axial": 30,
        "coronal": 172,
        "sagittal": 95
      },
      "matchedSegmentIds": [
        "2.25.306757321920428423854529791107945832273"
      ],
      "insideCtBounds": true,
      "insideSegmentationBounds": true
    }
  ],
  "toggleSets": [
    {
      "id": "lymph_nodes",
      "label": "Lymph nodes",
      "targetIds": [
        "node_1R",
        "node_1L",
        "node_2R",
        "node_2L",
        "node_3A_1",
        "node_3A_2",
        "node_3A_3",
        "node_3A_4",
        "node_3A_5",
        "node_3A_6",
        "node_3A_7",
        "node_4R_1",
        "node_4R_2",
        "node_4R_3",
        "node_4L_1",
        "node_4L_2",
        "node_4L_3",
        "node_5_nod5",
        "node_6_nod5",
        "node_7_1",
        "node_10R_1",
        "node_10R_2",
        "node_10L",
        "node_11L",
        "node_11Ri",
        "node_11Rs_1",
        "node_11Rs_2"
      ]
    },
    {
      "id": "airway",
      "label": "Airway",
      "targetIds": [
        "landmark_bronchus_intermedius",
        "landmark_carina",
        "landmark_left_mainstem",
        "landmark_right_mainstem",
        "landmark_trachea"
      ]
    },
    {
      "id": "vessels",
      "label": "Vessels",
      "targetIds": [
        "landmark_aorta",
        "landmark_azygous_vein",
        "landmark_brachiocephalic_trunk",
        "landmark_left_brachiocephalic_vein",
        "landmark_left_inferior_pv",
        "landmark_left_pa",
        "landmark_left_superior_pv",
        "landmark_main_pa",
        "landmark_right_inferior_pv",
        "landmark_right_pa",
        "landmark_right_superior_pv",
        "landmark_superior_vena_cava",
        "landmark_right_brachiocephalic_vein",
        "landmark_inferior_vena_cava",
        "landmark_right_subclavian_artery",
        "landmark_left_subclavian_artery",
        "landmark_right_common_carotid_artery",
        "landmark_left_common_carotid_artery"
      ]
    },
    {
      "id": "cardiac",
      "label": "Cardiac",
      "targetIds": [
        "landmark_left_atrium",
        "landmark_left_atrial_appendage",
        "landmark_left_ventricle",
        "landmark_right_atrium",
        "landmark_right_ventricle"
      ]
    },
    {
      "id": "gi",
      "label": "GI",
      "targetIds": [
        "landmark_esophagus"
      ]
    }
  ],
  "preprocessingRequired": {
    "required": true,
    "tasks": [
      "Verify actual mesh names inside Model/case_001.glb and either rename meshes to match meshNameExpected or update this manifest.",
      "Read each .mrk.json file and extract the first control point position plus its coordinateSystem.",
      "Read the CT volume geometry from Model/case_001_ct.nrrd and derive the voxel-to-world and world-to-voxel transforms.",
      "Convert each markup point into continuous voxel coordinates automatically, honoring the markup coordinateSystem.",
      "Determine which voxel axis corresponds to sagittal, coronal, and axial using the CT orientation matrix rather than assuming i/j/k order.",
      "Map the continuous voxel position to exported slice-series frame indices using the series counts; if counts differ from the volume dimensions, scale by normalized position.",
      "Clamp derived slice indices to valid ranges and write them back into the enriched manifest.",
      "Enumerate actual slice filenames in each folder and write a generated asset index for Expo bundling.",
      "Optionally compute a station centroid or station-level bounds for grouped highlighting."
    ]
  },
  "moduleDefaults": {
    "defaultStationId": "4R",
    "defaultToggleSetIds": [
      "lymph_nodes",
      "airway",
      "vessels"
    ],
    "defaultSliceLayout": "single-plane",
    "defaultPlane": "axial"
  },
  "glbMeshes": [
    "airway",
    "esophagus",
    "right brachiocephalic vein",
    "left brachiocephalic vein",
    "superior vena cava",
    "azygous vein",
    "inferior vena cava",
    "right atrium",
    "right ventricle",
    "pulmonary artery",
    "pulmonary venous system",
    "left atrium",
    "left atrial appendage",
    "left ventricle",
    "aorta",
    "brachiocephalic trunk",
    "right subclavian artery",
    "left subclavian artery",
    "right common carotid artery",
    "left common carotid artery",
    "Station 1R",
    "Station 1L",
    "Station 2R",
    "Station 2L",
    "Station 3A",
    "Station 4R",
    "Station 4L",
    "Station 5",
    "Station 6",
    "Station 7",
    "Station 10R",
    "Station 10L",
    "Station 11Rs",
    "Station 11Ri",
    "Station 11L"
  ],
  "meshMappingNotes": {
    "lymphNodes": "The GLB stores one mesh per station, not one mesh per individual segmented node. Multiple markup targets within the same station therefore point to the same station mesh.",
    "airwayLandmarks": "trachea, carina, bronchus intermedius, left mainstem, and right mainstem all map to the single GLB mesh named 'airway'.",
    "pulmonaryArteryLandmarks": "main PA, left PA, and right PA all map to the single GLB mesh named 'pulmonary artery'.",
    "pulmonaryVenousLandmarks": "left/right superior and inferior PV landmarks all map to the single GLB mesh named 'pulmonary venous system'.",
    "stationMeshes": "Station 6 spelling has been normalized to match the corrected GLB mesh name. Each nodal target within a station points to the corresponding station mesh.",
    "uniqueLandmarks": "Aorta, brachiocephalic trunk, brachiocephalic veins, SVC, IVC, subclavian arteries, carotids, atria, ventricles, esophagus, and left atrial appendage each map to their own GLB mesh when present."
  },
  "generatedAt": "2026-03-28T20:00:10.851Z",
  "runtimeSchemaVersion": 1,
  "volumeGeometry": {
    "coordinateSystem": "LPS",
    "sizes": [
      307,
      228,
      121
    ],
    "spaceDirections": [
      [
        -0.8046874999999998,
        0,
        0
      ],
      [
        0,
        -0.8046874999999998,
        0
      ],
      [
        0,
        0,
        2
      ]
    ],
    "spaceOrigin": [
      105.37799835205078,
      -78.36019897460935,
      1070.5999755859375
    ],
    "axisMap": {
      "sagittal": "i",
      "coronal": "j",
      "axial": "k"
    },
    "ijkToWorldMatrix": [
      -0.8046874999999998,
      0,
      0,
      105.37799835205078,
      0,
      -0.8046874999999998,
      0,
      -78.36019897460935,
      0,
      0,
      2,
      1070.5999755859375,
      0,
      0,
      0,
      1
    ],
    "worldToIjkMatrix": [
      -1.242718446601942,
      0,
      0,
      130.95518241808256,
      0,
      -1.242718446601942,
      0,
      -97.37966474514562,
      0,
      0,
      0.5,
      -535.2999877929688,
      0,
      0,
      0,
      1
    ]
  },
  "patientToScene": {
    "name": "patientToScene",
    "from": "LPS-mm",
    "to": "three-scene-meters",
    "matrix": [
      0.001,
      0,
      0,
      0,
      0,
      0,
      0.001,
      0,
      0,
      -0.001,
      0,
      0,
      0,
      0,
      0,
      1
    ],
    "inverseMatrix": [
      1000,
      0,
      0,
      0,
      0,
      0,
      -1000,
      0,
      0,
      1000,
      0,
      0,
      0,
      0,
      0,
      1
    ],
    "note": "This explicit transform maps CT/markup patient-space coordinates into the shared Three scene basis. The GLB is already exported in that scene basis, so it should be wrapped in the inverse transform before joining the patient-space group."
  },
  "meshNames": [
    "airway",
    "aorta",
    "azygous vein",
    "brachiocephalic trunk",
    "esophagus",
    "inferior vena cava",
    "left atrial appendage",
    "left atrium",
    "left brachiocephalic vein",
    "left common carotid artery",
    "left subclavian artery",
    "left ventricle",
    "pulmonary artery",
    "pulmonary venous system",
    "right atrium",
    "right brachiocephalic vein",
    "right common carotid artery",
    "right subclavian artery",
    "right ventricle",
    "Station 1L",
    "Station 1R",
    "Station 2L",
    "Station 2R",
    "Station 3A",
    "Station 4L",
    "Station 4R",
    "Station 5",
    "Station 6",
    "Station 7",
    "Station 10L",
    "Station 10R",
    "Station 11L",
    "Station 11Ri",
    "Station 11Rs",
    "superior vena cava"
  ],
  "sliceAssetCounts": {
    "axial": 180,
    "coronal": 220,
    "sagittal": 160
  },
  "sliceTextureMetadata": {
    "axial": {
      "pixelWidth": 714,
      "pixelHeight": 556,
      "crop": {
        "x": 0,
        "y": 0,
        "width": 1,
        "height": 1
      },
      "sourceLooksCropped": false,
      "warning": null
    },
    "coronal": {
      "pixelWidth": 714,
      "pixelHeight": 556,
      "crop": {
        "x": 0,
        "y": 0,
        "width": 1,
        "height": 1
      },
      "sourceLooksCropped": true,
      "warning": "coronal slice textures look cropped or viewport-exported relative to CT geometry; use crop metadata for clean co-registration."
    },
    "sagittal": {
      "pixelWidth": 712,
      "pixelHeight": 556,
      "crop": {
        "x": 0,
        "y": 0,
        "width": 1,
        "height": 1
      },
      "sourceLooksCropped": true,
      "warning": "sagittal slice textures look cropped or viewport-exported relative to CT geometry; use crop metadata for clean co-registration."
    }
  },
  "warnings": [
    "coronal slice textures look cropped or viewport-exported relative to CT geometry; use crop metadata for clean co-registration.",
    "sagittal slice textures look cropped or viewport-exported relative to CT geometry; use crop metadata for clean co-registration."
  ],
  "bounds": {
    "ct": {
      "coordinateSystem": "LPS",
      "min": [
        -140.85637664794916,
        -261.02426147460926,
        1070.5999755859375
      ],
      "max": [
        105.37799835205078,
        -78.36019897460935,
        1310.5999755859375
      ]
    },
    "segmentation": {
      "coordinateSystem": "LPS",
      "min": [
        -219.59765625000009,
        -386.59765625000017,
        688
      ],
      "max": [
        191.59765625000003,
        24.597656249999943,
        1340
      ]
    },
    "union": {
      "coordinateSystem": "LPS",
      "min": [
        -219.59765625000009,
        -386.59765625000017,
        688
      ],
      "max": [
        191.59765625000003,
        24.597656249999943,
        1340
      ]
    }
  },
  "segmentation": {
    "coordinateSystem": "LPS",
    "sizes": [
      512,
      512,
      327
    ],
    "componentCount": 3,
    "spaceDirections": [
      [
        0.8046875000000002,
        0,
        0
      ],
      [
        0,
        0.8046875000000002,
        0
      ],
      [
        0,
        0,
        2
      ]
    ],
    "spaceOrigin": [
      -219.59765625000009,
      -386.59765625000017,
      688
    ],
    "ijkToWorldMatrix": [
      0.8046875000000002,
      0,
      0,
      -219.59765625000009,
      0,
      0.8046875000000002,
      0,
      -386.59765625000017,
      0,
      0,
      2,
      688,
      0,
      0,
      0,
      1
    ],
    "worldToIjkMatrix": [
      1.2427184466019414,
      0,
      0,
      272.89805825242723,
      0,
      1.2427184466019414,
      0,
      480.4320388349515,
      0,
      0,
      0.5,
      -344,
      0,
      0,
      0,
      1
    ],
    "worldBounds": {
      "coordinateSystem": "LPS",
      "min": [
        -219.59765625000009,
        -386.59765625000017,
        688
      ],
      "max": [
        191.59765625000003,
        24.597656249999943,
        1340
      ]
    },
    "referenceImageGeometry": "-0.8046875000000001;0;0;219.59765625000003;0;-0.8046875000000001;0;386.59765625000006;0;0;2;688;0;0;0;1;0;511;0;511;0;326;",
    "segments": [
      {
        "index": 0,
        "id": "2.25.314609811388436314422080028160079540590",
        "name": "airway",
        "labelValue": 2,
        "layer": 0,
        "color": [
          0.666667,
          1,
          1
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "airway",
        "targetIds": [
          "landmark_bronchus_intermedius",
          "landmark_carina",
          "landmark_trachea",
          "landmark_left_mainstem",
          "landmark_right_mainstem"
        ],
        "stationIds": [],
        "meshNameResolved": "airway"
      },
      {
        "index": 1,
        "id": "esophagus",
        "name": "esophagus",
        "labelValue": 3,
        "layer": 0,
        "color": [
          0.827451,
          0.670588,
          0.560784
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "gi",
        "targetIds": [
          "landmark_esophagus"
        ],
        "stationIds": [],
        "meshNameResolved": "esophagus"
      },
      {
        "index": 2,
        "id": "brachiocephalic_vein_right",
        "name": "right brachiocephalic vein",
        "labelValue": 4,
        "layer": 0,
        "color": [
          0,
          0.592157,
          0.807843
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_right_brachiocephalic_vein"
        ],
        "stationIds": [],
        "meshNameResolved": "right brachiocephalic vein"
      },
      {
        "index": 3,
        "id": "brachiocephalic_vein_left",
        "name": "left brachiocephalic vein",
        "labelValue": 5,
        "layer": 0,
        "color": [
          0,
          0.631373,
          0.768627
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_left_brachiocephalic_vein"
        ],
        "stationIds": [],
        "meshNameResolved": "left brachiocephalic vein"
      },
      {
        "index": 4,
        "id": "superior_vena_cava",
        "name": "superior vena cava",
        "labelValue": 6,
        "layer": 0,
        "color": [
          0.556863,
          0.698039,
          0.603922
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_superior_vena_cava"
        ],
        "stationIds": [],
        "meshNameResolved": "superior vena cava"
      },
      {
        "index": 5,
        "id": "2.25.111239317664077265941812615039469954434",
        "name": "azygous vein",
        "labelValue": 1,
        "layer": 1,
        "color": [
          0.52549,
          0.611765,
          1
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_azygous_vein"
        ],
        "stationIds": [],
        "meshNameResolved": "azygous vein"
      },
      {
        "index": 6,
        "id": "inferior_vena_cava",
        "name": "inferior vena cava",
        "labelValue": 7,
        "layer": 0,
        "color": [
          0,
          0.592157,
          0.807843
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_inferior_vena_cava"
        ],
        "stationIds": [],
        "meshNameResolved": "inferior vena cava"
      },
      {
        "index": 7,
        "id": "2.25.94981541103766622373479159084072708115",
        "name": "right atrium",
        "labelValue": 1,
        "layer": 2,
        "color": [
          0,
          0.333333,
          1
        ],
        "extent": [
          194,
          326,
          192,
          318,
          204,
          261
        ],
        "groupId": "cardiac",
        "targetIds": [
          "landmark_right_atrium"
        ],
        "stationIds": [],
        "meshNameResolved": "right atrium"
      },
      {
        "index": 8,
        "id": "2.25.306757321920428423854529791107945832273",
        "name": "right ventricle",
        "labelValue": 2,
        "layer": 1,
        "color": [
          0,
          0.333333,
          1
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "cardiac",
        "targetIds": [
          "landmark_right_ventricle"
        ],
        "stationIds": [],
        "meshNameResolved": "right ventricle"
      },
      {
        "index": 9,
        "id": "pulmonary_artery",
        "name": "pulmonary artery",
        "labelValue": 2,
        "layer": 2,
        "color": [
          0,
          0,
          1
        ],
        "extent": [
          194,
          326,
          192,
          318,
          204,
          261
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_main_pa",
          "landmark_left_pa",
          "landmark_right_pa"
        ],
        "stationIds": [],
        "meshNameResolved": "pulmonary artery"
      },
      {
        "index": 10,
        "id": "pulmonary_vein",
        "name": "pulmonary venous system",
        "labelValue": 3,
        "layer": 2,
        "color": [
          0.729412,
          0.301961,
          0.25098
        ],
        "extent": [
          194,
          326,
          192,
          318,
          204,
          261
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_left_inferior_pv",
          "landmark_left_superior_pv",
          "landmark_right_inferior_pv",
          "landmark_right_superior_pv"
        ],
        "stationIds": [],
        "meshNameResolved": "pulmonary venous system"
      },
      {
        "index": 11,
        "id": "2.25.11162851537065423916236596478087091296",
        "name": "left atrium",
        "labelValue": 3,
        "layer": 1,
        "color": [
          1,
          0,
          0
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "cardiac",
        "targetIds": [
          "landmark_left_atrium"
        ],
        "stationIds": [],
        "meshNameResolved": "left atrium"
      },
      {
        "index": 12,
        "id": "atrial_appendage_left",
        "name": "left atrial appendage",
        "labelValue": 8,
        "layer": 0,
        "color": [
          0.858824,
          0.298039,
          0.211765
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "cardiac",
        "targetIds": [
          "landmark_left_atrial_appendage"
        ],
        "stationIds": [],
        "meshNameResolved": "left atrial appendage"
      },
      {
        "index": 13,
        "id": "2.25.122868581635728138705614725803586075780",
        "name": "left ventricle",
        "labelValue": 1,
        "layer": 0,
        "color": [
          1,
          0,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "cardiac",
        "targetIds": [
          "landmark_left_ventricle"
        ],
        "stationIds": [],
        "meshNameResolved": "left ventricle"
      },
      {
        "index": 14,
        "id": "aorta",
        "name": "aorta",
        "labelValue": 4,
        "layer": 1,
        "color": [
          0.878431,
          0.380392,
          0.298039
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_aorta"
        ],
        "stationIds": [],
        "meshNameResolved": "aorta"
      },
      {
        "index": 15,
        "id": "brachiocephalic_trunk",
        "name": "brachiocephalic trunk",
        "labelValue": 9,
        "layer": 0,
        "color": [
          0.768627,
          0.47451,
          0.309804
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "other",
        "targetIds": [
          "landmark_brachiocephalic_trunk"
        ],
        "stationIds": [],
        "meshNameResolved": "brachiocephalic trunk"
      },
      {
        "index": 16,
        "id": "subclavian_artery_right",
        "name": "right subclavian artery",
        "labelValue": 10,
        "layer": 0,
        "color": [
          0.847059,
          0.396078,
          0.34902
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_right_subclavian_artery"
        ],
        "stationIds": [],
        "meshNameResolved": "right subclavian artery"
      },
      {
        "index": 17,
        "id": "subclavian_artery_left",
        "name": "left subclavian artery",
        "labelValue": 11,
        "layer": 0,
        "color": [
          0.847059,
          0.396078,
          0.270588
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_left_subclavian_artery"
        ],
        "stationIds": [],
        "meshNameResolved": "left subclavian artery"
      },
      {
        "index": 18,
        "id": "common_carotid_artery_right",
        "name": "right common carotid artery",
        "labelValue": 12,
        "layer": 0,
        "color": [
          0,
          0.439216,
          0.647059
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_right_common_carotid_artery"
        ],
        "stationIds": [],
        "meshNameResolved": "right common carotid artery"
      },
      {
        "index": 19,
        "id": "common_carotid_artery_left",
        "name": "left common carotid artery",
        "labelValue": 13,
        "layer": 0,
        "color": [
          0.0392157,
          0.411765,
          0.607843
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_left_common_carotid_artery"
        ],
        "stationIds": [],
        "meshNameResolved": "left common carotid artery"
      },
      {
        "index": 20,
        "id": "2.25.53993552652818166383402955961129171632",
        "name": "Station 1R",
        "labelValue": 14,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_1R"
        ],
        "stationIds": [
          "1R"
        ],
        "meshNameResolved": "Station 1R"
      },
      {
        "index": 21,
        "id": "2.25.60762053273684785009037968769448832207",
        "name": "Station 1L",
        "labelValue": 19,
        "layer": 0,
        "color": [
          0.564706,
          0.933333,
          0.564706
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_1L"
        ],
        "stationIds": [
          "1L"
        ],
        "meshNameResolved": "Station 1L"
      },
      {
        "index": 22,
        "id": "2.25.20830374192229656165820331138320646873",
        "name": "Station 2R",
        "labelValue": 5,
        "layer": 1,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_2R"
        ],
        "stationIds": [
          "2R"
        ],
        "meshNameResolved": "Station 2R"
      },
      {
        "index": 23,
        "id": "2.25.48624296096474164041790855708405278758",
        "name": "Station 2L",
        "labelValue": 6,
        "layer": 1,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_2L"
        ],
        "stationIds": [
          "2L"
        ],
        "meshNameResolved": "Station 2L"
      },
      {
        "index": 24,
        "id": "2.25.312506753561539454691948452144159132025",
        "name": "Station 3A",
        "labelValue": 15,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_3A_1",
          "node_3A_2",
          "node_3A_3",
          "node_3A_4",
          "node_3A_5",
          "node_3A_6",
          "node_3A_7"
        ],
        "stationIds": [
          "3A"
        ],
        "meshNameResolved": "Station 3A"
      },
      {
        "index": 25,
        "id": "2.25.121062370142623028444183689976439892722",
        "name": "Station 4R",
        "labelValue": 20,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_4R_1",
          "node_4R_2",
          "node_4R_3"
        ],
        "stationIds": [
          "4R"
        ],
        "meshNameResolved": "Station 4R"
      },
      {
        "index": 26,
        "id": "2.25.276115978171104054815639826201025438059",
        "name": "Station 4L",
        "labelValue": 21,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_4L_1",
          "node_4L_2",
          "node_4L_3"
        ],
        "stationIds": [
          "4L"
        ],
        "meshNameResolved": "Station 4L"
      },
      {
        "index": 27,
        "id": "2.25.212414958810818875948453230124833991184",
        "name": "Station 5",
        "labelValue": 22,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_5_nod5"
        ],
        "stationIds": [
          "5"
        ],
        "meshNameResolved": "Station 5"
      },
      {
        "index": 28,
        "id": "2.25.239492796546459861507994252932045774720",
        "name": "Station 6",
        "labelValue": 23,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_6_nod5"
        ],
        "stationIds": [
          "6"
        ],
        "meshNameResolved": "Station 6"
      },
      {
        "index": 29,
        "id": "2.25.268879151571743626125047618104203736194",
        "name": "Station 7",
        "labelValue": 7,
        "layer": 1,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_7_1"
        ],
        "stationIds": [
          "7"
        ],
        "meshNameResolved": "Station 7"
      },
      {
        "index": 30,
        "id": "2.25.108758159455925476842465611424706367338",
        "name": "Station 10R",
        "labelValue": 16,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_10R_1",
          "node_10R_2"
        ],
        "stationIds": [
          "10R"
        ],
        "meshNameResolved": "Station 10R"
      },
      {
        "index": 31,
        "id": "2.25.265963977509172877070359499184196808585",
        "name": "Station 10L",
        "labelValue": 17,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_10L"
        ],
        "stationIds": [
          "10L"
        ],
        "meshNameResolved": "Station 10L"
      },
      {
        "index": 32,
        "id": "2.25.273934619515693923059552848848411656207",
        "name": "Station 11Rs",
        "labelValue": 24,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_11Rs_1",
          "node_11Rs_2"
        ],
        "stationIds": [
          "11Rs"
        ],
        "meshNameResolved": "Station 11Rs"
      },
      {
        "index": 33,
        "id": "2.25.203565841377755533927323140586090706777",
        "name": "Station 11Ri",
        "labelValue": 25,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_11Ri"
        ],
        "stationIds": [
          "11Ri"
        ],
        "meshNameResolved": "Station 11Ri"
      },
      {
        "index": 34,
        "id": "2.25.26054851494271011036540584591024408830",
        "name": "Station 11L",
        "labelValue": 18,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_11L"
        ],
        "stationIds": [
          "11L"
        ],
        "meshNameResolved": "Station 11L"
      }
    ]
  }
}

```

## File: `content/cases/generated/case_001.enriched.json`

```json
{
  "schemaVersion": 1,
  "caseId": "case_001",
  "title": "Curated EBUS case 001",
  "description": "Segmented airway, vascular landmarks, and lymph nodes for a linked 3D + slice explorer.",
  "assets": {
    "glbFile": "Model/case_001.glb",
    "ctVolumeFile": "Model/case_001_ct.nrrd",
    "segmentationFile": "Model/case_001_segmentation.nrrd"
  },
  "coordinateAssumptions": {
    "worldCoordinateSystem": "respect per-markup coordinateSystem",
    "sliceIndicesMustBeDerivedFrom": [
      "markup control point position",
      "markup coordinateSystem",
      "CT volume geometry",
      "slice series counts"
    ],
    "note": "Do not assume RAS. Read each .mrk.json coordinateSystem and convert to the CT volume frame before deriving slice indices."
  },
  "sliceSeries": {
    "axial": {
      "folder": "Model/sliceSeries/axial",
      "count": 180,
      "framePattern": null,
      "displayOrientation": "axial",
      "indexDerivation": "derive from .mrk.json + CT volume geometry + series count",
      "coverageAssumption": [
        0,
        1
      ]
    },
    "coronal": {
      "folder": "Model/sliceSeries/coronal",
      "count": 220,
      "framePattern": null,
      "displayOrientation": "coronal",
      "indexDerivation": "derive from .mrk.json + CT volume geometry + series count",
      "coverageAssumption": [
        0,
        1
      ]
    },
    "sagittal": {
      "folder": "Model/sliceSeries/sagital",
      "count": 160,
      "framePattern": null,
      "displayOrientation": "sagittal",
      "sourceFolderSpelling": "sagital",
      "indexDerivation": "derive from .mrk.json + CT volume geometry + series count",
      "coverageAssumption": [
        1,
        0.02
      ]
    }
  },
  "stations": [
    {
      "id": "1R",
      "label": "1R",
      "groupLabel": "1R",
      "targetIds": [
        "node_1R"
      ],
      "primaryTargetId": "node_1R",
      "kind": "nodal_station"
    },
    {
      "id": "1L",
      "label": "1L",
      "groupLabel": "1L",
      "targetIds": [
        "node_1L"
      ],
      "primaryTargetId": "node_1L",
      "kind": "nodal_station"
    },
    {
      "id": "2R",
      "label": "2R",
      "groupLabel": "2R",
      "targetIds": [
        "node_2R"
      ],
      "primaryTargetId": "node_2R",
      "kind": "nodal_station"
    },
    {
      "id": "2L",
      "label": "2L",
      "groupLabel": "2L",
      "targetIds": [
        "node_2L"
      ],
      "primaryTargetId": "node_2L",
      "kind": "nodal_station"
    },
    {
      "id": "3A",
      "label": "3A",
      "groupLabel": "3A",
      "targetIds": [
        "node_3A_1",
        "node_3A_2",
        "node_3A_3",
        "node_3A_4",
        "node_3A_5",
        "node_3A_6",
        "node_3A_7"
      ],
      "primaryTargetId": "node_3A_1",
      "kind": "nodal_station"
    },
    {
      "id": "4R",
      "label": "4R",
      "groupLabel": "4R",
      "targetIds": [
        "node_4R_1",
        "node_4R_2",
        "node_4R_3"
      ],
      "primaryTargetId": "node_4R_1",
      "kind": "nodal_station"
    },
    {
      "id": "4L",
      "label": "4L",
      "groupLabel": "4L",
      "targetIds": [
        "node_4L_1",
        "node_4L_2",
        "node_4L_3"
      ],
      "primaryTargetId": "node_4L_1",
      "kind": "nodal_station"
    },
    {
      "id": "5",
      "label": "5",
      "groupLabel": "5",
      "targetIds": [
        "node_5_nod5"
      ],
      "primaryTargetId": "node_5_nod5",
      "kind": "nodal_station"
    },
    {
      "id": "6",
      "label": "6",
      "groupLabel": "6",
      "targetIds": [
        "node_6_nod5"
      ],
      "primaryTargetId": "node_6_nod5",
      "kind": "nodal_station"
    },
    {
      "id": "7",
      "label": "7",
      "groupLabel": "7",
      "targetIds": [
        "node_7_1"
      ],
      "primaryTargetId": "node_7_1",
      "kind": "nodal_station"
    },
    {
      "id": "10R",
      "label": "10R",
      "groupLabel": "10R",
      "targetIds": [
        "node_10R_1",
        "node_10R_2"
      ],
      "primaryTargetId": "node_10R_1",
      "kind": "nodal_station"
    },
    {
      "id": "10L",
      "label": "10L",
      "groupLabel": "10L",
      "targetIds": [
        "node_10L"
      ],
      "primaryTargetId": "node_10L",
      "kind": "nodal_station"
    },
    {
      "id": "11L",
      "label": "11L",
      "groupLabel": "11L",
      "targetIds": [
        "node_11L"
      ],
      "primaryTargetId": "node_11L",
      "kind": "nodal_station"
    },
    {
      "id": "11Ri",
      "label": "11Ri",
      "groupLabel": "11R",
      "targetIds": [
        "node_11Ri"
      ],
      "primaryTargetId": "node_11Ri",
      "kind": "nodal_station"
    },
    {
      "id": "11Rs",
      "label": "11Rs",
      "groupLabel": "11R",
      "targetIds": [
        "node_11Rs_1",
        "node_11Rs_2"
      ],
      "primaryTargetId": "node_11Rs_1",
      "kind": "nodal_station"
    }
  ],
  "targets": [
    {
      "id": "node_1R",
      "label": "1R",
      "displayLabel": "1R",
      "kind": "lymph_node",
      "stationId": "1R",
      "stationGroupId": "1R",
      "markupFile": "Model/markups/1R.mrk.json",
      "meshNameExpected": "Station 1R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 161,
        "coronal": 143,
        "sagittal": 86
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 1R",
      "voxelIndex": {
        "axial": 108,
        "coronal": 148,
        "sagittal": 143
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -9.572087152711095,
          -197.84134289115147,
          1287.5124715199843
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -9.572087152711095,
          -197.84134289115147,
          1287.5124715199843
        ]
      },
      "derived": {
        "continuousVoxel": [
          142.85059169523808,
          148.48142156618832,
          108.45624796702339
        ],
        "roundedVoxel": [
          143,
          148,
          108
        ],
        "normalized": {
          "sagittal": 0.4673202614379085,
          "coronal": 0.6519823788546255,
          "axial": 0.9
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.009572087152711095,
          1.2875124715199844,
          0.19784134289115146
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 1R"
    },
    {
      "id": "node_1L",
      "label": "1L",
      "displayLabel": "1L",
      "kind": "lymph_node",
      "stationId": "1L",
      "stationGroupId": "1L",
      "markupFile": "Model/markups/1L.mrk.json",
      "meshNameExpected": "Station 1L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 154,
        "coronal": 146,
        "sagittal": 93
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 1L",
      "voxelIndex": {
        "axial": 103,
        "coronal": 151,
        "sagittal": 131
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -0.16830999103041933,
          -200.07447710673816,
          1276.4128428859017
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -0.16830999103041933,
          -200.07447710673816,
          1276.4128428859017
        ]
      },
      "derived": {
        "continuousVoxel": [
          131.16434434868347,
          151.25657864963586,
          102.90643364998209
        ],
        "roundedVoxel": [
          131,
          151,
          103
        ],
        "normalized": {
          "sagittal": 0.42810457516339867,
          "coronal": 0.6651982378854625,
          "axial": 0.8583333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.00016830999103041933,
          1.2764128428859016,
          0.20007447710673817
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 1L"
    },
    {
      "id": "node_2R",
      "label": "2R",
      "displayLabel": "2R",
      "kind": "lymph_node",
      "stationId": "2R",
      "stationGroupId": "2R",
      "markupFile": "Model/markups/2R.mrk.json",
      "meshNameExpected": "Station 2R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 158,
        "coronal": 112,
        "sagittal": 84
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 2R",
      "voxelIndex": {
        "axial": 106,
        "coronal": 116,
        "sagittal": 148
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -13.647973590408863,
          -171.57171722444872,
          1282.8934773581566
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -13.647973590408863,
          -171.57171722444872,
          1282.8934773581566
        ]
      },
      "derived": {
        "continuousVoxel": [
          147.9157709576198,
          115.83567316484896,
          106.14675088610954
        ],
        "roundedVoxel": [
          148,
          116,
          106
        ],
        "normalized": {
          "sagittal": 0.48366013071895425,
          "coronal": 0.5110132158590308,
          "axial": 0.8833333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.013647973590408863,
          1.2828934773581566,
          0.17157171722444872
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 2R"
    },
    {
      "id": "node_2L",
      "label": "2L",
      "displayLabel": "2L",
      "kind": "lymph_node",
      "stationId": "2L",
      "stationGroupId": "2L",
      "markupFile": "Model/markups/2L.mrk.json",
      "meshNameExpected": "Station 2L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 131,
        "coronal": 109,
        "sagittal": 93
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 2L",
      "voxelIndex": {
        "axial": 88,
        "coronal": 113,
        "sagittal": 130
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          0.798289522383806,
          -169.22106966432835,
          1246.3818368829643
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          0.798289522383806,
          -169.22106966432835,
          1246.3818368829643
        ]
      },
      "derived": {
        "continuousVoxel": [
          129.96313330288714,
          112.91448008042754,
          87.8909306485134
        ],
        "roundedVoxel": [
          130,
          113,
          88
        ],
        "normalized": {
          "sagittal": 0.42483660130718953,
          "coronal": 0.4977973568281938,
          "axial": 0.7333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.000798289522383806,
          1.2463818368829644,
          0.16922106966432834
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 2L"
    },
    {
      "id": "node_3A_1",
      "label": "3A_1",
      "displayLabel": "3A 1",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_1.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 115,
        "coronal": 158,
        "sagittal": 74
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 77,
        "coronal": 164,
        "sagittal": 167
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -28.82176941588532,
          -210.17294269591582,
          1224.3502342573918
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -28.82176941588532,
          -210.17294269591582,
          1224.3502342573918
        ]
      },
      "derived": {
        "continuousVoxel": [
          166.77252693491093,
          163.8061281196819,
          76.87512933572714
        ],
        "roundedVoxel": [
          167,
          164,
          77
        ],
        "normalized": {
          "sagittal": 0.545751633986928,
          "coronal": 0.7224669603524229,
          "axial": 0.6416666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.02882176941588532,
          1.2243502342573918,
          0.21017294269591583
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A"
    },
    {
      "id": "node_3A_2",
      "label": "3A_2",
      "displayLabel": "3A 2",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_2.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 131,
        "coronal": 168,
        "sagittal": 85
      },
      "notes": "",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 88,
        "coronal": 174,
        "sagittal": 145
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -11.545040218685273,
          -218.57414179777012,
          1246.4004700979663
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -11.545040218685273,
          -218.57414179777012,
          1246.4004700979663
        ]
      },
      "derived": {
        "continuousVoxel": [
          145.30241686460406,
          174.2464532171319,
          87.90024725601438
        ],
        "roundedVoxel": [
          145,
          174,
          88
        ],
        "normalized": {
          "sagittal": 0.4738562091503268,
          "coronal": 0.7665198237885462,
          "axial": 0.7333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.011545040218685272,
          1.2464004700979663,
          0.21857414179777013
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A"
    },
    {
      "id": "node_3A_3",
      "label": "3A_3",
      "displayLabel": "3A 3",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_3.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 134,
        "coronal": 169,
        "sagittal": 79
      },
      "notes": "",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 90,
        "coronal": 175,
        "sagittal": 157
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -21.006854443442222,
          -219.35027690354323,
          1251.3070895938372
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -21.006854443442222,
          -219.35027690354323,
          1251.3070895938372
        ]
      },
      "derived": {
        "continuousVoxel": [
          157.0607879400302,
          175.21097063013147,
          90.35355700394985
        ],
        "roundedVoxel": [
          157,
          175,
          90
        ],
        "normalized": {
          "sagittal": 0.5130718954248366,
          "coronal": 0.7709251101321586,
          "axial": 0.75
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.021006854443442222,
          1.2513070895938372,
          0.21935027690354322
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A"
    },
    {
      "id": "node_3A_4",
      "label": "3A_4",
      "displayLabel": "3A 4",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_4.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 131,
        "coronal": 156,
        "sagittal": 77
      },
      "notes": "",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 88,
        "coronal": 162,
        "sagittal": 161
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -24.114476296234628,
          -208.51635525586195,
          1247.440185546875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -24.114476296234628,
          -208.51635525586195,
          1247.440185546875
        ]
      },
      "derived": {
        "continuousVoxel": [
          160.9226869415586,
          161.74745634951785,
          88.42010498046875
        ],
        "roundedVoxel": [
          161,
          162,
          88
        ],
        "normalized": {
          "sagittal": 0.5261437908496732,
          "coronal": 0.7136563876651982,
          "axial": 0.7333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.02411447629623463,
          1.247440185546875,
          0.20851635525586196
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A"
    },
    {
      "id": "node_3A_5",
      "label": "3A_5",
      "displayLabel": "3A 5",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_5.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 130,
        "coronal": 161,
        "sagittal": 84
      },
      "notes": "",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 87,
        "coronal": 167,
        "sagittal": 148
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -13.458456100911484,
          -212.8168487548828,
          1243.6670188376431
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -13.458456100911484,
          -212.8168487548828,
          1243.6670188376431
        ]
      },
      "derived": {
        "continuousVoxel": [
          147.6802540774677,
          167.0917589502428,
          86.53352162585281
        ],
        "roundedVoxel": [
          148,
          167,
          87
        ],
        "normalized": {
          "sagittal": 0.48366013071895425,
          "coronal": 0.73568281938326,
          "axial": 0.725
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.013458456100911485,
          1.243667018837643,
          0.21281684875488283
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A"
    },
    {
      "id": "node_3A_6",
      "label": "3A_6",
      "displayLabel": "3A 6",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_6.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 119,
        "coronal": 170,
        "sagittal": 96
      },
      "notes": "",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 80,
        "coronal": 176,
        "sagittal": 125
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          4.400092133199834,
          -219.6369567415788,
          1231.4450348491332
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          4.400092133199834,
          -219.6369567415788,
          1231.4450348491332
        ]
      },
      "derived": {
        "continuousVoxel": [
          125.48710675740703,
          175.56723295312716,
          80.42252963159785
        ],
        "roundedVoxel": [
          125,
          176,
          80
        ],
        "normalized": {
          "sagittal": 0.4084967320261438,
          "coronal": 0.775330396475771,
          "axial": 0.6666666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.004400092133199834,
          1.2314450348491333,
          0.21963695674157882
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A"
    },
    {
      "id": "node_3A_7",
      "label": "3A_7",
      "displayLabel": "3A 7",
      "kind": "lymph_node",
      "stationId": "3A",
      "stationGroupId": "3A",
      "markupFile": "Model/markups/3A_7.mrk.json",
      "meshNameExpected": "Station 3A",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 109,
        "coronal": 107,
        "sagittal": 74
      },
      "notes": "",
      "meshName": "Station 3A",
      "voxelIndex": {
        "axial": 73,
        "coronal": 111,
        "sagittal": 167
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -28.93680763244629,
          -167.94192650634722,
          1215.8315612501672
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -28.93680763244629,
          -167.94192650634722,
          1215.8315612501672
        ]
      },
      "derived": {
        "continuousVoxel": [
          166.91548704869544,
          111.3248652821597,
          72.61579283211483
        ],
        "roundedVoxel": [
          167,
          111,
          73
        ],
        "normalized": {
          "sagittal": 0.545751633986928,
          "coronal": 0.4889867841409692,
          "axial": 0.6083333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.028936807632446288,
          1.2158315612501671,
          0.1679419265063472
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 3A"
    },
    {
      "id": "node_4R_1",
      "label": "4R_1",
      "displayLabel": "4R 1",
      "kind": "lymph_node",
      "stationId": "4R",
      "stationGroupId": "4R",
      "markupFile": "Model/markups/4R_1.mrk.json",
      "meshNameExpected": "Station 4R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 112,
        "coronal": 120,
        "sagittal": 82
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 4R",
      "voxelIndex": {
        "axial": 75,
        "coronal": 124,
        "sagittal": 152
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -17.060216670665696,
          -177.95478321979417,
          1220.0412926391382
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -17.060216670665696,
          -177.95478321979417,
          1220.0412926391382
        ]
      },
      "derived": {
        "continuousVoxel": [
          152.15622837774478,
          123.76802702314234,
          74.72065852660035
        ],
        "roundedVoxel": [
          152,
          124,
          75
        ],
        "normalized": {
          "sagittal": 0.49673202614379086,
          "coronal": 0.5462555066079295,
          "axial": 0.625
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.017060216670665696,
          1.2200412926391382,
          0.17795478321979416
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 4R"
    },
    {
      "id": "node_4R_2",
      "label": "4R_2",
      "displayLabel": "4R 2",
      "kind": "lymph_node",
      "stationId": "4R",
      "stationGroupId": "4R",
      "markupFile": "Model/markups/4R_2.mrk.json",
      "meshNameExpected": "Station 4R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 130,
        "coronal": 130,
        "sagittal": 85
      },
      "notes": "",
      "meshName": "Station 4R",
      "voxelIndex": {
        "axial": 87,
        "coronal": 135,
        "sagittal": 145
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -10.990352215325188,
          -186.9976425104035,
          1244.0412926391382
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -10.990352215325188,
          -186.9976425104035,
          1244.0412926391382
        ]
      },
      "derived": {
        "continuousVoxel": [
          144.6130958507197,
          135.0057550736083,
          86.72065852660035
        ],
        "roundedVoxel": [
          145,
          135,
          87
        ],
        "normalized": {
          "sagittal": 0.4738562091503268,
          "coronal": 0.5947136563876652,
          "axial": 0.725
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.010990352215325188,
          1.2440412926391382,
          0.1869976425104035
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 4R"
    },
    {
      "id": "node_4R_3",
      "label": "4R_3",
      "displayLabel": "4R 3",
      "kind": "lymph_node",
      "stationId": "4R",
      "stationGroupId": "4R",
      "markupFile": "Model/markups/4R_3.mrk.json",
      "meshNameExpected": "Station 4R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 142,
        "coronal": 123,
        "sagittal": 81
      },
      "notes": "",
      "meshName": "Station 4R",
      "voxelIndex": {
        "axial": 95,
        "coronal": 128,
        "sagittal": 153
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -17.8034653794829,
          -181.17552762466872,
          1260.0412926391382
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -17.8034653794829,
          -181.17552762466872,
          1260.0412926391382
        ]
      },
      "derived": {
        "continuousVoxel": [
          153.079877258605,
          127.77050550686994,
          94.72065852660035
        ],
        "roundedVoxel": [
          153,
          128,
          95
        ],
        "normalized": {
          "sagittal": 0.5,
          "coronal": 0.5638766519823789,
          "axial": 0.7916666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.0178034653794829,
          1.2600412926391382,
          0.1811755276246687
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 4R"
    },
    {
      "id": "node_4L_1",
      "label": "4L_1",
      "displayLabel": "4L 1",
      "kind": "lymph_node",
      "stationId": "4L",
      "stationGroupId": "4L",
      "markupFile": "Model/markups/4L_1.mrk.json",
      "meshNameExpected": "Station 4L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 106,
        "coronal": 114,
        "sagittal": 92
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 4L",
      "voxelIndex": {
        "axial": 71,
        "coronal": 118,
        "sagittal": 133
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -1.5909734767025014,
          -173.6342078853047,
          1211.631921563806
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -1.5909734767025014,
          -173.6342078853047,
          1211.631921563806
        ]
      },
      "derived": {
        "continuousVoxel": [
          132.9323145056352,
          118.39876835503892,
          70.51597298893421
        ],
        "roundedVoxel": [
          133,
          118,
          71
        ],
        "normalized": {
          "sagittal": 0.434640522875817,
          "coronal": 0.5198237885462555,
          "axial": 0.5916666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.0015909734767025016,
          1.2116319215638058,
          0.1736342078853047
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 4L"
    },
    {
      "id": "node_4L_2",
      "label": "4L_2",
      "displayLabel": "4L 2",
      "kind": "lymph_node",
      "stationId": "4L",
      "stationGroupId": "4L",
      "markupFile": "Model/markups/4L_2.mrk.json",
      "meshNameExpected": "Station 4L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 107,
        "coronal": 114,
        "sagittal": 102
      },
      "notes": "",
      "meshName": "Station 4L",
      "voxelIndex": {
        "axial": 72,
        "coronal": 118,
        "sagittal": 114
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          13.68159584204524,
          -173.55347636539645,
          1214.204404970215
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          13.68159584204524,
          -173.55347636539645,
          1214.204404970215
        ]
      },
      "derived": {
        "continuousVoxel": [
          113.9528108862205,
          118.29844180602672,
          71.8022146921387
        ],
        "roundedVoxel": [
          114,
          118,
          72
        ],
        "normalized": {
          "sagittal": 0.37254901960784315,
          "coronal": 0.5198237885462555,
          "axial": 0.6
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.01368159584204524,
          1.214204404970215,
          0.17355347636539645
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 4L"
    },
    {
      "id": "node_4L_3",
      "label": "4L_3",
      "displayLabel": "4L 3",
      "kind": "lymph_node",
      "stationId": "4L",
      "stationGroupId": "4L",
      "markupFile": "Model/markups/4L_3.mrk.json",
      "meshNameExpected": "Station 4L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 107,
        "coronal": 94,
        "sagittal": 102
      },
      "notes": "",
      "meshName": "Station 4L",
      "voxelIndex": {
        "axial": 72,
        "coronal": 97,
        "sagittal": 114
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          13.418924520143378,
          -156.12623131510122,
          1214.649008377584
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          13.418924520143378,
          -156.12623131510122,
          1214.649008377584
        ]
      },
      "derived": {
        "continuousVoxel": [
          114.27923738334127,
          96.64128290857245,
          72.0245163958233
        ],
        "roundedVoxel": [
          114,
          97,
          72
        ],
        "normalized": {
          "sagittal": 0.37254901960784315,
          "coronal": 0.42731277533039647,
          "axial": 0.6
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.013418924520143378,
          1.214649008377584,
          0.15612623131510123
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 4L"
    },
    {
      "id": "node_5_nod5",
      "label": "5_nod5",
      "displayLabel": "5 nod5",
      "kind": "lymph_node",
      "stationId": "5",
      "stationGroupId": "5",
      "markupFile": "Model/markups/5_nod5.mrk.json",
      "meshNameExpected": "Station 5",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 104,
        "coronal": 122,
        "sagittal": 108
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 5",
      "voxelIndex": {
        "axial": 70,
        "coronal": 126,
        "sagittal": 102
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          22.970476633020297,
          -179.70470469207044,
          1210.3502342573918
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          22.970476633020297,
          -179.70470469207044,
          1210.3502342573918
        ]
      },
      "derived": {
        "continuousVoxel": [
          102.40934737898937,
          125.94268671684489,
          69.87512933572714
        ],
        "roundedVoxel": [
          102,
          126,
          70
        ],
        "normalized": {
          "sagittal": 0.3333333333333333,
          "coronal": 0.5550660792951542,
          "axial": 0.5833333333333334
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.022970476633020296,
          1.2103502342573917,
          0.17970470469207045
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 5"
    },
    {
      "id": "node_6_nod5",
      "label": "6_nod5",
      "displayLabel": "6 nod5",
      "kind": "lymph_node",
      "stationId": "6",
      "stationGroupId": "6",
      "markupFile": "Model/markups/6_nod5.mrk.json",
      "meshNameExpected": "Station 6",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 119,
        "coronal": 115,
        "sagittal": 110
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 6",
      "voxelIndex": {
        "axial": 80,
        "coronal": 119,
        "sagittal": 99
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          26.10255620214059,
          -173.84381508805475,
          1230.1392824441064
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          26.10255620214059,
          -173.84381508805475,
          1230.1392824441064
        ]
      },
      "derived": {
        "continuousVoxel": [
          98.51705432221851,
          118.65925109243705,
          79.76965342908443
        ],
        "roundedVoxel": [
          99,
          119,
          80
        ],
        "normalized": {
          "sagittal": 0.3235294117647059,
          "coronal": 0.5242290748898678,
          "axial": 0.6666666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.02610255620214059,
          1.2301392824441064,
          0.17384381508805477
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 6"
    },
    {
      "id": "node_7_1",
      "label": "7_1",
      "displayLabel": "7 1",
      "kind": "lymph_node",
      "stationId": "7",
      "stationGroupId": "7",
      "markupFile": "Model/markups/7_1.mrk.json",
      "meshNameExpected": "Station 7",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 94,
        "coronal": 93,
        "sagittal": 83
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 7",
      "voxelIndex": {
        "axial": 63,
        "coronal": 96,
        "sagittal": 149
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -14.706595759411217,
          -155.7811967400809,
          1196.0412926391382
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -14.706595759411217,
          -155.7811967400809,
          1196.0412926391382
        ]
      },
      "derived": {
        "continuousVoxel": [
          149.23134025502077,
          96.21250207747924,
          62.720658526600346
        ],
        "roundedVoxel": [
          149,
          96,
          63
        ],
        "normalized": {
          "sagittal": 0.4869281045751634,
          "coronal": 0.42290748898678415,
          "axial": 0.525
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.014706595759411217,
          1.1960412926391382,
          0.1557811967400809
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 7"
    },
    {
      "id": "node_10R_1",
      "label": "10R_1",
      "displayLabel": "10R 1",
      "kind": "lymph_node",
      "stationId": "10R",
      "stationGroupId": "10R",
      "markupFile": "Model/markups/10R_1.mrk.json",
      "meshNameExpected": "Station 10R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 100,
        "coronal": 120,
        "sagittal": 78
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 10R",
      "voxelIndex": {
        "axial": 67,
        "coronal": 124,
        "sagittal": 159
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -22.437059121548383,
          -177.81774049496937,
          1204.888449697744
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -22.437059121548383,
          -177.81774049496937,
          1204.888449697744
        ]
      },
      "derived": {
        "continuousVoxel": [
          158.8381296759291,
          123.59772150102997,
          67.1442370559032
        ],
        "roundedVoxel": [
          159,
          124,
          67
        ],
        "normalized": {
          "sagittal": 0.5196078431372549,
          "coronal": 0.5462555066079295,
          "axial": 0.5583333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.022437059121548385,
          1.204888449697744,
          0.17781774049496937
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 10R"
    },
    {
      "id": "node_10R_2",
      "label": "10R_2",
      "displayLabel": "10R 2",
      "kind": "lymph_node",
      "stationId": "10R",
      "stationGroupId": "10R",
      "markupFile": "Model/markups/10R_2.mrk.json",
      "meshNameExpected": "Station 10R",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 109,
        "coronal": 108,
        "sagittal": 73
      },
      "notes": "",
      "meshName": "Station 10R",
      "voxelIndex": {
        "axial": 73,
        "coronal": 112,
        "sagittal": 168
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -29.671346554035843,
          -168.09168225995705,
          1215.6287981625358
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -29.671346554035843,
          -168.09168225995705,
          1215.6287981625358
        ]
      },
      "derived": {
        "continuousVoxel": [
          167.82831211630187,
          111.51096951965543,
          72.51441128829913
        ],
        "roundedVoxel": [
          168,
          112,
          73
        ],
        "normalized": {
          "sagittal": 0.5490196078431373,
          "coronal": 0.4933920704845815,
          "axial": 0.6083333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.029671346554035843,
          1.2156287981625358,
          0.16809168225995705
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 10R"
    },
    {
      "id": "node_10L",
      "label": "10L",
      "displayLabel": "10L",
      "kind": "lymph_node",
      "stationId": "10L",
      "stationGroupId": "10L",
      "markupFile": "Model/markups/10L.mrk.json",
      "meshNameExpected": "Station 10L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 88,
        "coronal": 97,
        "sagittal": 104
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 10L",
      "voxelIndex": {
        "axial": 59,
        "coronal": 101,
        "sagittal": 109
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          17.835157732022797,
          -159.7564549815841,
          1189.0246110717826
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          17.835157732022797,
          -159.7564549815841,
          1189.0246110717826
        ]
      },
      "derived": {
        "continuousVoxel": [
          108.79110290644257,
          101.15262882420168,
          59.21231774292255
        ],
        "roundedVoxel": [
          109,
          101,
          59
        ],
        "normalized": {
          "sagittal": 0.3562091503267974,
          "coronal": 0.44493392070484583,
          "axial": 0.49166666666666664
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.017835157732022797,
          1.1890246110717826,
          0.1597564549815841
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 10L"
    },
    {
      "id": "node_11L",
      "label": "11L",
      "displayLabel": "11L",
      "kind": "lymph_node",
      "stationId": "11L",
      "stationGroupId": "11L",
      "markupFile": "Model/markups/11L.mrk.json",
      "meshNameExpected": "Station 11L",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 84,
        "coronal": 85,
        "sagittal": 116
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 11L",
      "voxelIndex": {
        "axial": 56,
        "coronal": 88,
        "sagittal": 88
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          34.898386391024445,
          -148.92565036362996,
          1181.6709307147491
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          34.898386391024445,
          -148.92565036362996,
          1181.6709307147491
        ]
      },
      "derived": {
        "continuousVoxel": [
          87.58631389331431,
          87.69298813392855,
          55.535477564405824
        ],
        "roundedVoxel": [
          88,
          88,
          56
        ],
        "normalized": {
          "sagittal": 0.2875816993464052,
          "coronal": 0.3876651982378855,
          "axial": 0.4666666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.034898386391024445,
          1.1816709307147493,
          0.14892565036362995
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 11L"
    },
    {
      "id": "node_11Ri",
      "label": "11Ri",
      "displayLabel": "11Ri",
      "kind": "lymph_node",
      "stationId": "11Ri",
      "stationGroupId": "11R",
      "markupFile": "Model/markups/11Ri.mrk.json",
      "meshNameExpected": "Station 11Ri",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 72,
        "coronal": 94,
        "sagittal": 54
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 11Ri",
      "voxelIndex": {
        "axial": 48,
        "coronal": 97,
        "sagittal": 204
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -58.571725422348635,
          -156.1657563181315,
          1166.3350107574483
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -58.571725422348635,
          -156.1657563181315,
          1166.3350107574483
        ]
      },
      "derived": {
        "continuousVoxel": [
          203.74334604973913,
          96.69040135894019,
          47.86751758575542
        ],
        "roundedVoxel": [
          204,
          97,
          48
        ],
        "normalized": {
          "sagittal": 0.6666666666666666,
          "coronal": 0.42731277533039647,
          "axial": 0.4
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.05857172542234863,
          1.1663350107574484,
          0.1561657563181315
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 11Ri"
    },
    {
      "id": "node_11Rs_1",
      "label": "11Rs_1",
      "displayLabel": "11Rs 1",
      "kind": "lymph_node",
      "stationId": "11Rs",
      "stationGroupId": "11R",
      "markupFile": "Model/markups/11Rs_1.mrk.json",
      "meshNameExpected": "Station 11Rs",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 95,
        "coronal": 96,
        "sagittal": 64
      },
      "notes": "Primary teaching target for this station.",
      "meshName": "Station 11Rs",
      "voxelIndex": {
        "axial": 64,
        "coronal": 100,
        "sagittal": 186
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -44.68960240920485,
          -158.5468347864842,
          1198.007359511826
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -44.68960240920485,
          -158.5468347864842,
          1198.007359511826
        ]
      },
      "derived": {
        "continuousVoxel": [
          186.491775703308,
          99.64941149436878,
          63.703691962944276
        ],
        "roundedVoxel": [
          186,
          100,
          64
        ],
        "normalized": {
          "sagittal": 0.6078431372549019,
          "coronal": 0.44052863436123346,
          "axial": 0.5333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.04468960240920485,
          1.1980073595118261,
          0.1585468347864842
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 11Rs"
    },
    {
      "id": "node_11Rs_2",
      "label": "11Rs_2",
      "displayLabel": "11Rs 2",
      "kind": "lymph_node",
      "stationId": "11Rs",
      "stationGroupId": "11R",
      "markupFile": "Model/markups/11Rs_2.mrk.json",
      "meshNameExpected": "Station 11Rs",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 91,
        "coronal": 109,
        "sagittal": 62
      },
      "notes": "",
      "meshName": "Station 11Rs",
      "voxelIndex": {
        "axial": 61,
        "coronal": 113,
        "sagittal": 190
      },
      "structureGroupId": "lymph_nodes",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -47.8420757222722,
          -169.23750298841807,
          1193.2762707905492
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -47.8420757222722,
          -169.23750298841807,
          1193.2762707905492
        ]
      },
      "derived": {
        "continuousVoxel": [
          190.40941244187715,
          112.93490207541282,
          61.33814760230587
        ],
        "roundedVoxel": [
          190,
          113,
          61
        ],
        "normalized": {
          "sagittal": 0.6209150326797386,
          "coronal": 0.4977973568281938,
          "axial": 0.5083333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.0478420757222722,
          1.1932762707905493,
          0.16923750298841808
        ]
      },
      "meshExists": true,
      "meshNameResolved": "Station 11Rs"
    },
    {
      "id": "landmark_aorta",
      "label": "aorta",
      "displayLabel": "aorta",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/aorta.mrk.json",
      "meshNameExpected": "aorta",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 121,
        "coronal": 114,
        "sagittal": 101
      },
      "notes": "",
      "meshName": "aorta",
      "voxelIndex": {
        "axial": 81,
        "coronal": 118,
        "sagittal": 115
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          13.22746691934276,
          -173.26671697547613,
          1232.8883918389774
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          13.22746691934276,
          -173.26671697547613,
          1232.8883918389774
        ]
      },
      "derived": {
        "continuousVoxel": [
          114.51716527559834,
          117.94208062243642,
          81.14420812651997
        ],
        "roundedVoxel": [
          115,
          118,
          81
        ],
        "normalized": {
          "sagittal": 0.3758169934640523,
          "coronal": 0.5198237885462555,
          "axial": 0.675
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.01322746691934276,
          1.2328883918389775,
          0.17326671697547613
        ]
      },
      "meshExists": true,
      "meshNameResolved": "aorta"
    },
    {
      "id": "landmark_azygous_vein",
      "label": "azygous vein",
      "displayLabel": "azygous vein",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/azygous vein.mrk.json",
      "meshNameExpected": "azygous vein",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 124,
        "coronal": 106,
        "sagittal": 76
      },
      "notes": "",
      "meshName": "azygous vein",
      "voxelIndex": {
        "axial": 83,
        "coronal": 110,
        "sagittal": 162
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -25.05715251037651,
          -166.79470398190327,
          1237.1281264072636
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -25.05715251037651,
          -166.79470398190327,
          1237.1281264072636
        ]
      },
      "derived": {
        "continuousVoxel": [
          162.0941680620456,
          109.89919068867597,
          83.26407541066305
        ],
        "roundedVoxel": [
          162,
          110,
          83
        ],
        "normalized": {
          "sagittal": 0.5294117647058824,
          "coronal": 0.4845814977973568,
          "axial": 0.6916666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.02505715251037651,
          1.2371281264072636,
          0.16679470398190327
        ]
      },
      "meshExists": true,
      "meshNameResolved": "azygous vein"
    },
    {
      "id": "landmark_brachiocephalic_trunk",
      "label": "brachiocephalic trunk",
      "displayLabel": "brachiocephalic trunk",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/brachiocephalic trunk.mrk.json",
      "meshNameExpected": "brachiocephalic trunk",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 143,
        "coronal": 138,
        "sagittal": 89
      },
      "notes": "",
      "meshName": "brachiocephalic trunk",
      "voxelIndex": {
        "axial": 96,
        "coronal": 143,
        "sagittal": 139
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -6.394236111576021,
          -193.66002442896,
          1263.2654123770576
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -6.394236111576021,
          -193.66002442896,
          1263.2654123770576
        ]
      },
      "derived": {
        "continuousVoxel": [
          138.90141758586634,
          143.28521998210573,
          96.33271839556005
        ],
        "roundedVoxel": [
          139,
          143,
          96
        ],
        "normalized": {
          "sagittal": 0.4542483660130719,
          "coronal": 0.6299559471365639,
          "axial": 0.8
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.006394236111576021,
          1.2632654123770577,
          0.19366002442896002
        ]
      },
      "meshExists": true,
      "meshNameResolved": "brachiocephalic trunk"
    },
    {
      "id": "landmark_right_brachiocephalic_vein",
      "label": "right brachiocephalic vein",
      "displayLabel": "right brachiocephalic vein",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/right brachiocephalic vein.mrk.json",
      "meshNameExpected": "right brachiocephalic vein",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 143,
        "coronal": 137,
        "sagittal": 73
      },
      "notes": "",
      "meshName": "right brachiocephalic vein",
      "voxelIndex": {
        "axial": 96,
        "coronal": 142,
        "sagittal": 169
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -30.44104435111175,
          -192.49091730698146,
          1262.6529242002327
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -30.44104435111175,
          -192.49091730698146,
          1262.6529242002327
        ]
      },
      "derived": {
        "continuousVoxel": [
          168.78482976703697,
          141.83234899556928,
          96.02647430714762
        ],
        "roundedVoxel": [
          169,
          142,
          96
        ],
        "normalized": {
          "sagittal": 0.5522875816993464,
          "coronal": 0.6255506607929515,
          "axial": 0.8
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.03044104435111175,
          1.2626529242002327,
          0.19249091730698145
        ]
      },
      "meshExists": true,
      "meshNameResolved": "right brachiocephalic vein"
    },
    {
      "id": "landmark_left_brachiocephalic_vein",
      "label": "left brachiocephalic vein",
      "displayLabel": "left brachiocephalic vein",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/left brachiocephalic vein.mrk.json",
      "meshNameExpected": "left brachiocephalic vein",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 140,
        "coronal": 158,
        "sagittal": 90
      },
      "notes": "",
      "meshName": "left brachiocephalic vein",
      "voxelIndex": {
        "axial": 94,
        "coronal": 164,
        "sagittal": 136
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -4.2395104549813425,
          -210.71826921033454,
          1258.5978472776178
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -4.2395104549813425,
          -210.71826921033454,
          1258.5978472776178
        ]
      },
      "derived": {
        "continuousVoxel": [
          136.22370026504967,
          164.48381543857116,
          93.99893584584015
        ],
        "roundedVoxel": [
          136,
          164,
          94
        ],
        "normalized": {
          "sagittal": 0.4444444444444444,
          "coronal": 0.7224669603524229,
          "axial": 0.7833333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.004239510454981343,
          1.2585978472776178,
          0.21071826921033454
        ]
      },
      "meshExists": true,
      "meshNameResolved": "left brachiocephalic vein"
    },
    {
      "id": "landmark_superior_vena_cava",
      "label": "superior vena cava",
      "displayLabel": "superior vena cava",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/superior vena cava.mrk.json",
      "meshNameExpected": "superior vena cava",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 122,
        "coronal": 132,
        "sagittal": 73
      },
      "notes": "",
      "meshName": "superior vena cava",
      "voxelIndex": {
        "axial": 82,
        "coronal": 137,
        "sagittal": 169
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -30.64965529626175,
          -188.2784838371971,
          1235.1281264072636
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -30.64965529626175,
          -188.2784838371971,
          1235.1281264072636
        ]
      },
      "derived": {
        "continuousVoxel": [
          169.04407443673796,
          136.5974802175848,
          82.26407541066305
        ],
        "roundedVoxel": [
          169,
          137,
          82
        ],
        "normalized": {
          "sagittal": 0.5522875816993464,
          "coronal": 0.6035242290748899,
          "axial": 0.6833333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.03064965529626175,
          1.2351281264072635,
          0.18827848383719709
        ]
      },
      "meshExists": true,
      "meshNameResolved": "superior vena cava"
    },
    {
      "id": "landmark_inferior_vena_cava",
      "label": "inferior vena cava",
      "displayLabel": "inferior vena cava",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/inferior vena cava.mrk.json",
      "meshNameExpected": "inferior vena cava",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 27,
        "coronal": 119,
        "sagittal": 72
      },
      "notes": "",
      "meshName": "inferior vena cava",
      "voxelIndex": {
        "axial": 18,
        "coronal": 123,
        "sagittal": 171
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -31.995774268410457,
          -177.40705256683287,
          1106.0101318359375
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -31.995774268410457,
          -177.40705256683287,
          1106.0101318359375
        ]
      },
      "derived": {
        "continuousVoxel": [
          170.716921314748,
          123.08735203693801,
          17.705078125
        ],
        "roundedVoxel": [
          171,
          123,
          18
        ],
        "normalized": {
          "sagittal": 0.5588235294117647,
          "coronal": 0.5418502202643172,
          "axial": 0.15
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.03199577426841046,
          1.1060101318359374,
          0.17740705256683287
        ]
      },
      "meshExists": true,
      "meshNameResolved": "inferior vena cava"
    },
    {
      "id": "landmark_right_common_carotid_artery",
      "label": "right common carotid artery",
      "displayLabel": "right common carotid artery",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/right common carotid artery.mrk.json",
      "meshNameExpected": "right common carotid artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 167,
        "coronal": 129,
        "sagittal": 82
      },
      "notes": "",
      "meshName": "right common carotid artery",
      "voxelIndex": {
        "axial": 112,
        "coronal": 134,
        "sagittal": 152
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -17.13595377416726,
          -186.2766539982334,
          1295.2818245852272
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -17.13595377416726,
          -186.2766539982334,
          1295.2818245852272
        ]
      },
      "derived": {
        "continuousVoxel": [
          152.25034827335838,
          134.10976934974644,
          112.34092449964487
        ],
        "roundedVoxel": [
          152,
          134,
          112
        ],
        "normalized": {
          "sagittal": 0.49673202614379086,
          "coronal": 0.5903083700440529,
          "axial": 0.9333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.01713595377416726,
          1.2952818245852273,
          0.1862766539982334
        ]
      },
      "meshExists": true,
      "meshNameResolved": "right common carotid artery"
    },
    {
      "id": "landmark_left_common_carotid_artery",
      "label": "left common carotid artery",
      "displayLabel": "left common carotid artery",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/left common carotid artery.mrk.json",
      "meshNameExpected": "left common carotid artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 167,
        "coronal": 127,
        "sagittal": 100
      },
      "notes": "",
      "meshName": "left common carotid artery",
      "voxelIndex": {
        "axial": 112,
        "coronal": 132,
        "sagittal": 118
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          10.501593089524182,
          -184.86336507166618,
          1294.2476806640625
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          10.501593089524182,
          -184.86336507166618,
          1294.2476806640625
        ]
      },
      "derived": {
        "continuousVoxel": [
          117.90465896702338,
          132.3534491303231,
          111.8238525390625
        ],
        "roundedVoxel": [
          118,
          132,
          112
        ],
        "normalized": {
          "sagittal": 0.38562091503267976,
          "coronal": 0.5814977973568282,
          "axial": 0.9333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.010501593089524182,
          1.2942476806640626,
          0.18486336507166617
        ]
      },
      "meshExists": true,
      "meshNameResolved": "left common carotid artery"
    },
    {
      "id": "landmark_right_subclavian_artery",
      "label": "right subclavian artery",
      "displayLabel": "right subclavian artery",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/right subclavian artery.mrk.json",
      "meshNameExpected": "right subclavian artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 164,
        "coronal": 119,
        "sagittal": 76
      },
      "notes": "",
      "meshName": "right subclavian artery",
      "voxelIndex": {
        "axial": 110,
        "coronal": 123,
        "sagittal": 162
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -25.186295498394234,
          -177.09542505428277,
          1290.3516845703125
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -25.186295498394234,
          -177.09542505428277,
          1290.3516845703125
        ]
      },
      "derived": {
        "continuousVoxel": [
          162.25465643550453,
          122.70008677862332,
          109.8758544921875
        ],
        "roundedVoxel": [
          162,
          123,
          110
        ],
        "normalized": {
          "sagittal": 0.5294117647058824,
          "coronal": 0.5418502202643172,
          "axial": 0.9166666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.025186295498394233,
          1.2903516845703125,
          0.17709542505428277
        ]
      },
      "meshExists": true,
      "meshNameResolved": "right subclavian artery"
    },
    {
      "id": "landmark_left_subclavian_artery",
      "label": "left subclavian artery",
      "displayLabel": "left subclavian artery",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/left subclavian artery.mrk.json",
      "meshNameExpected": "left subclavian artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 151,
        "coronal": 117,
        "sagittal": 99
      },
      "notes": "",
      "meshName": "left subclavian artery",
      "voxelIndex": {
        "axial": 101,
        "coronal": 121,
        "sagittal": 120
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          8.687915423994824,
          -175.5670623779297,
          1272.8781166930617
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          8.687915423994824,
          -175.5670623779297,
          1272.8781166930617
        ]
      },
      "derived": {
        "continuousVoxel": [
          120.15854965816666,
          120.80076228762142,
          101.13907055356208
        ],
        "roundedVoxel": [
          120,
          121,
          101
        ],
        "normalized": {
          "sagittal": 0.39215686274509803,
          "coronal": 0.5330396475770925,
          "axial": 0.8416666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.008687915423994825,
          1.2728781166930616,
          0.17556706237792968
        ]
      },
      "meshExists": true,
      "meshNameResolved": "left subclavian artery"
    },
    {
      "id": "landmark_bronchus_intermedius",
      "label": "bronchus intermedius",
      "displayLabel": "bronchus intermedius",
      "kind": "landmark",
      "landmarkGroup": "airway",
      "markupFile": "Model/markups/bronchus intermedius.mrk.json",
      "meshNameExpected": "airway",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 87,
        "coronal": 86,
        "sagittal": 67
      },
      "notes": "",
      "meshName": "airway",
      "voxelIndex": {
        "axial": 58,
        "coronal": 89,
        "sagittal": 179
      },
      "structureGroupId": "airway",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -38.42111602055939,
          -150.22014935438048,
          1185.6719906360465
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -38.42111602055939,
          -150.22014935438048,
          1185.6719906360465
        ]
      },
      "derived": {
        "continuousVoxel": [
          178.70181203586512,
          89.30168590884182,
          57.536007525054515
        ],
        "roundedVoxel": [
          179,
          89,
          58
        ],
        "normalized": {
          "sagittal": 0.5849673202614379,
          "coronal": 0.3920704845814978,
          "axial": 0.48333333333333334
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.03842111602055939,
          1.1856719906360464,
          0.1502201493543805
        ]
      },
      "meshExists": true,
      "meshNameResolved": "airway"
    },
    {
      "id": "landmark_carina",
      "label": "carina",
      "displayLabel": "carina",
      "kind": "landmark",
      "landmarkGroup": "airway",
      "markupFile": "Model/markups/carina.mrk.json",
      "meshNameExpected": "airway",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 104,
        "coronal": 96,
        "sagittal": 84
      },
      "notes": "",
      "meshName": "airway",
      "voxelIndex": {
        "axial": 70,
        "coronal": 99,
        "sagittal": 147
      },
      "structureGroupId": "airway",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -12.767176630104522,
          -157.77453819821739,
          1210.7629090195594
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -12.767176630104522,
          -157.77453819821739,
          1210.7629090195594
        ]
      },
      "derived": {
        "continuousVoxel": [
          146.8211883273387,
          98.68966427788186,
          70.08146671681095
        ],
        "roundedVoxel": [
          147,
          99,
          70
        ],
        "normalized": {
          "sagittal": 0.4803921568627451,
          "coronal": 0.43612334801762115,
          "axial": 0.5833333333333334
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.012767176630104522,
          1.2107629090195595,
          0.15777453819821738
        ]
      },
      "meshExists": true,
      "meshNameResolved": "airway"
    },
    {
      "id": "landmark_trachea",
      "label": "trachea",
      "displayLabel": "trachea",
      "kind": "landmark",
      "landmarkGroup": "airway",
      "markupFile": "Model/markups/trachea.mrk.json",
      "meshNameExpected": "airway",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 133,
        "coronal": 111,
        "sagittal": 87
      },
      "notes": "",
      "meshName": "airway",
      "voxelIndex": {
        "axial": 89,
        "coronal": 115,
        "sagittal": 142
      },
      "structureGroupId": "airway",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -9.046358244334094,
          -170.5155223676737,
          1248.7629090195594
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -9.046358244334094,
          -170.5155223676737,
          1248.7629090195594
        ]
      },
      "derived": {
        "continuousVoxel": [
          142.19725868288612,
          114.52312033312855,
          89.08146671681095
        ],
        "roundedVoxel": [
          142,
          115,
          89
        ],
        "normalized": {
          "sagittal": 0.46405228758169936,
          "coronal": 0.5066079295154186,
          "axial": 0.7416666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.009046358244334094,
          1.2487629090195593,
          0.1705155223676737
        ]
      },
      "meshExists": true,
      "meshNameResolved": "airway"
    },
    {
      "id": "landmark_left_mainstem",
      "label": "left mainstem",
      "displayLabel": "left mainstem",
      "kind": "landmark",
      "landmarkGroup": "airway",
      "markupFile": "Model/markups/left mainstem.mrk.json",
      "meshNameExpected": "airway",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 98,
        "coronal": 92,
        "sagittal": 92
      },
      "notes": "",
      "meshName": "airway",
      "voxelIndex": {
        "axial": 66,
        "coronal": 95,
        "sagittal": 133
      },
      "structureGroupId": "airway",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -1.6210419837718888,
          -154.58663418607236,
          1202.518246750665
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -1.6210419837718888,
          -154.58663418607236,
          1202.518246750665
        ]
      },
      "derived": {
        "continuousVoxel": [
          132.9696811940321,
          94.7279971559929,
          65.95913558236373
        ],
        "roundedVoxel": [
          133,
          95,
          66
        ],
        "normalized": {
          "sagittal": 0.434640522875817,
          "coronal": 0.4185022026431718,
          "axial": 0.55
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.0016210419837718888,
          1.202518246750665,
          0.15458663418607235
        ]
      },
      "meshExists": true,
      "meshNameResolved": "airway"
    },
    {
      "id": "landmark_right_mainstem",
      "label": "right mainstem",
      "displayLabel": "right mainstem",
      "kind": "landmark",
      "landmarkGroup": "airway",
      "markupFile": "Model/markups/right mainstem.mrk.json",
      "meshNameExpected": "airway",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 101,
        "coronal": 94,
        "sagittal": 76
      },
      "notes": "",
      "meshName": "airway",
      "voxelIndex": {
        "axial": 68,
        "coronal": 97,
        "sagittal": 162
      },
      "structureGroupId": "airway",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -25.009533482707944,
          -156.19600918607236,
          1206.7706997504715
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -25.009533482707944,
          -156.19600918607236,
          1206.7706997504715
        ]
      },
      "derived": {
        "continuousVoxel": [
          162.03499101795265,
          96.7279971559929,
          68.08536208226701
        ],
        "roundedVoxel": [
          162,
          97,
          68
        ],
        "normalized": {
          "sagittal": 0.5294117647058824,
          "coronal": 0.42731277533039647,
          "axial": 0.5666666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.025009533482707944,
          1.2067706997504715,
          0.15619600918607238
        ]
      },
      "meshExists": true,
      "meshNameResolved": "airway"
    },
    {
      "id": "landmark_esophagus",
      "label": "esophagus",
      "displayLabel": "esophagus",
      "kind": "landmark",
      "landmarkGroup": "gi",
      "markupFile": "Model/markups/esophagus.mrk.json",
      "meshNameExpected": "esophagus",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 95,
        "coronal": 74,
        "sagittal": 88
      },
      "notes": "",
      "meshName": "esophagus",
      "voxelIndex": {
        "axial": 64,
        "coronal": 77,
        "sagittal": 140
      },
      "structureGroupId": "gi",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -6.904068870708699,
          -140.52347113691818,
          1198.7629090195594
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -6.904068870708699,
          -140.52347113691818,
          1198.7629090195594
        ]
      },
      "derived": {
        "continuousVoxel": [
          139.5349961603225,
          77.25144501723818,
          64.08146671681095
        ],
        "roundedVoxel": [
          140,
          77,
          64
        ],
        "normalized": {
          "sagittal": 0.45751633986928103,
          "coronal": 0.3392070484581498,
          "axial": 0.5333333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.006904068870708699,
          1.1987629090195595,
          0.14052347113691818
        ]
      },
      "meshExists": true,
      "meshNameResolved": "esophagus"
    },
    {
      "id": "landmark_main_pa",
      "label": "main PA",
      "displayLabel": "main PA",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/main PA.mrk.json",
      "meshNameExpected": "pulmonary artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 84,
        "coronal": 157,
        "sagittal": 98
      },
      "notes": "",
      "meshName": "pulmonary artery",
      "voxelIndex": {
        "axial": 56,
        "coronal": 163,
        "sagittal": 121
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          8.30116469131218,
          -209.6028340240154,
          1183.5243634673996
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          8.30116469131218,
          -209.6028340240154,
          1183.5243634673996
        ]
      },
      "derived": {
        "continuousVoxel": [
          120.6391719279082,
          163.0976435565435,
          56.46219394073103
        ],
        "roundedVoxel": [
          121,
          163,
          56
        ],
        "normalized": {
          "sagittal": 0.3954248366013072,
          "coronal": 0.7180616740088106,
          "axial": 0.4666666666666667
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.008301164691312181,
          1.1835243634673995,
          0.20960283402401542
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary artery"
    },
    {
      "id": "landmark_left_pa",
      "label": "left PA",
      "displayLabel": "left PA",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/left PA.mrk.json",
      "meshNameExpected": "pulmonary artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 97,
        "coronal": 100,
        "sagittal": 106
      },
      "notes": "",
      "meshName": "pulmonary artery",
      "voxelIndex": {
        "axial": 65,
        "coronal": 104,
        "sagittal": 106
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          20.062582669992707,
          -161.98049880130864,
          1200.7629090195594
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          20.062582669992707,
          -161.98049880130864,
          1200.7629090195594
        ]
      },
      "derived": {
        "continuousVoxel": [
          106.02304084760618,
          103.9164891050244,
          65.08146671681095
        ],
        "roundedVoxel": [
          106,
          104,
          65
        ],
        "normalized": {
          "sagittal": 0.3464052287581699,
          "coronal": 0.4581497797356828,
          "axial": 0.5416666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.02006258266999271,
          1.2007629090195595,
          0.16198049880130863
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary artery"
    },
    {
      "id": "landmark_right_pa",
      "label": "right PA",
      "displayLabel": "right PA",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/right PA.mrk.json",
      "meshNameExpected": "pulmonary artery",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 87,
        "coronal": 107,
        "sagittal": 74
      },
      "notes": "",
      "meshName": "pulmonary artery",
      "voxelIndex": {
        "axial": 58,
        "coronal": 111,
        "sagittal": 167
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -29.084557399152487,
          -167.93500883405022,
          1186.041963330251
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -29.084557399152487,
          -167.93500883405022,
          1186.041963330251
        ]
      },
      "derived": {
        "continuousVoxel": [
          167.09909840926235,
          111.31626856318869,
          57.72099387215678
        ],
        "roundedVoxel": [
          167,
          111,
          58
        ],
        "normalized": {
          "sagittal": 0.545751633986928,
          "coronal": 0.4889867841409692,
          "axial": 0.48333333333333334
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.02908455739915249,
          1.186041963330251,
          0.16793500883405021
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary artery"
    },
    {
      "id": "landmark_left_inferior_pv",
      "label": "left inferior PV",
      "displayLabel": "left inferior PV",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/left inferior PV.mrk.json",
      "meshNameExpected": "pulmonary venous system",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 73,
        "coronal": 81,
        "sagittal": 104
      },
      "notes": "",
      "meshName": "pulmonary venous system",
      "voxelIndex": {
        "axial": 49,
        "coronal": 84,
        "sagittal": 110
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          16.948248234858113,
          -146.02948052569982,
          1168.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          16.948248234858113,
          -146.02948052569982,
          1168.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          109.89328169903558,
          84.09386445184062,
          49.189697265625
        ],
        "roundedVoxel": [
          110,
          84,
          49
        ],
        "normalized": {
          "sagittal": 0.35947712418300654,
          "coronal": 0.3700440528634361,
          "axial": 0.4083333333333333
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.016948248234858115,
          1.1689793701171876,
          0.14602948052569983
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary venous system"
    },
    {
      "id": "landmark_left_superior_pv",
      "label": "left superior PV",
      "displayLabel": "left superior PV",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/left superior PV.mrk.json",
      "meshNameExpected": "pulmonary venous system",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 81,
        "coronal": 93,
        "sagittal": 108
      },
      "notes": "",
      "meshName": "pulmonary venous system",
      "voxelIndex": {
        "axial": 54,
        "coronal": 96,
        "sagittal": 102
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          23.429883653802136,
          -155.94256998996715,
          1178.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          23.429883653802136,
          -155.94256998996715,
          1178.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          101.83843379976534,
          96.41304359190099,
          54.189697265625
        ],
        "roundedVoxel": [
          102,
          96,
          54
        ],
        "normalized": {
          "sagittal": 0.3333333333333333,
          "coronal": 0.42290748898678415,
          "axial": 0.45
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.023429883653802136,
          1.1789793701171876,
          0.15594256998996717
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary venous system"
    },
    {
      "id": "landmark_right_inferior_pv",
      "label": "right inferior PV",
      "displayLabel": "right inferior PV",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/right inferior PV.mrk.json",
      "meshNameExpected": "pulmonary venous system",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 64,
        "coronal": 79,
        "sagittal": 72
      },
      "notes": "",
      "meshName": "pulmonary venous system",
      "voxelIndex": {
        "axial": 43,
        "coronal": 82,
        "sagittal": 171
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -32.23592641477598,
          -144.31375350303816,
          1156.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -32.23592641477598,
          -144.31375350303816,
          1156.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          171.01536281702747,
          81.96169883144553,
          43.189697265625
        ],
        "roundedVoxel": [
          171,
          82,
          43
        ],
        "normalized": {
          "sagittal": 0.5588235294117647,
          "coronal": 0.36123348017621143,
          "axial": 0.35833333333333334
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.03223592641477598,
          1.1569793701171875,
          0.14431375350303816
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary venous system"
    },
    {
      "id": "landmark_right_superior_pv",
      "label": "right superior PV",
      "displayLabel": "right superior PV",
      "kind": "landmark",
      "landmarkGroup": "vessel",
      "markupFile": "Model/markups/right superior PV.mrk.json",
      "meshNameExpected": "pulmonary venous system",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 70,
        "coronal": 108,
        "sagittal": 64
      },
      "notes": "",
      "meshName": "pulmonary venous system",
      "voxelIndex": {
        "axial": 47,
        "coronal": 112,
        "sagittal": 186
      },
      "structureGroupId": "vessels",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -44.05537923755627,
          -168.3339318203013,
          1164.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -44.05537923755627,
          -168.3339318203013,
          1164.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          185.70361486863794,
          111.81201751697644,
          47.189697265625
        ],
        "roundedVoxel": [
          186,
          112,
          47
        ],
        "normalized": {
          "sagittal": 0.6078431372549019,
          "coronal": 0.4933920704845815,
          "axial": 0.39166666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.044055379237556265,
          1.1649793701171876,
          0.16833393182030132
        ]
      },
      "meshExists": true,
      "meshNameResolved": "pulmonary venous system"
    },
    {
      "id": "landmark_left_atrium",
      "label": "left atrium",
      "displayLabel": "left atrium",
      "kind": "landmark",
      "landmarkGroup": "cardiac",
      "markupFile": "Model/markups/left atrium.mrk.json",
      "meshNameExpected": "left atrium",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 58,
        "coronal": 107,
        "sagittal": 91
      },
      "notes": "",
      "meshName": "left atrium",
      "voxelIndex": {
        "axial": 39,
        "coronal": 111,
        "sagittal": 134
      },
      "structureGroupId": "cardiac",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -2.8354312015674736,
          -168.0365183093985,
          1149.047899207885
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -2.8354312015674736,
          -168.0365183093985,
          1149.047899207885
        ]
      },
      "derived": {
        "continuousVoxel": [
          134.47882507634117,
          111.44241626070888,
          39.22396181097372
        ],
        "roundedVoxel": [
          134,
          111,
          39
        ],
        "normalized": {
          "sagittal": 0.43790849673202614,
          "coronal": 0.4889867841409692,
          "axial": 0.325
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.002835431201567474,
          1.149047899207885,
          0.1680365183093985
        ]
      },
      "meshExists": true,
      "meshNameResolved": "left atrium"
    },
    {
      "id": "landmark_left_atrial_appendage",
      "label": "left atrial appendage",
      "displayLabel": "left atrial appendage",
      "kind": "landmark",
      "landmarkGroup": "cardiac",
      "markupFile": "Model/markups/left atrial appendage.mrk.json",
      "meshNameExpected": "left atrial appendage",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 78,
        "coronal": 130,
        "sagittal": 108
      },
      "notes": "",
      "meshName": "left atrial appendage",
      "voxelIndex": {
        "axial": 52,
        "coronal": 135,
        "sagittal": 102
      },
      "structureGroupId": "cardiac",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          23.24896544875024,
          -187.38375177214144,
          1174.6614698140588
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          23.24896544875024,
          -187.38375177214144,
          1174.6614698140588
        ]
      },
      "derived": {
        "continuousVoxel": [
          102.06326419050944,
          135.4855801755739,
          52.03074711406066
        ],
        "roundedVoxel": [
          102,
          135,
          52
        ],
        "normalized": {
          "sagittal": 0.3333333333333333,
          "coronal": 0.5947136563876652,
          "axial": 0.43333333333333335
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.023248965448750242,
          1.174661469814059,
          0.18738375177214145
        ]
      },
      "meshExists": true,
      "meshNameResolved": "left atrial appendage"
    },
    {
      "id": "landmark_left_ventricle",
      "label": "left ventricle",
      "displayLabel": "left ventricle",
      "kind": "landmark",
      "landmarkGroup": "cardiac",
      "markupFile": "Model/markups/left ventricle.mrk.json",
      "meshNameExpected": "left ventricle",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 33,
        "coronal": 140,
        "sagittal": 118
      },
      "notes": "",
      "meshName": "left ventricle",
      "voxelIndex": {
        "axial": 22,
        "coronal": 145,
        "sagittal": 83
      },
      "structureGroupId": "cardiac",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          38.49588173414643,
          -194.91694772864025,
          1114.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          38.49588173414643,
          -194.91694772864025,
          1114.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          83.11564006885204,
          144.84722175258213,
          22.189697265625
        ],
        "roundedVoxel": [
          83,
          145,
          22
        ],
        "normalized": {
          "sagittal": 0.27124183006535946,
          "coronal": 0.6387665198237885,
          "axial": 0.18333333333333332
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.038495881734146434,
          1.1149793701171875,
          0.19491694772864027
        ]
      },
      "meshExists": true,
      "meshNameResolved": "left ventricle"
    },
    {
      "id": "landmark_right_atrium",
      "label": "right atrium",
      "displayLabel": "right atrium",
      "kind": "landmark",
      "landmarkGroup": "cardiac",
      "markupFile": "Model/markups/right atrium.mrk.json",
      "meshNameExpected": "right atrium",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 48,
        "coronal": 145,
        "sagittal": 68
      },
      "notes": "",
      "meshName": "right atrium",
      "voxelIndex": {
        "axial": 32,
        "coronal": 150,
        "sagittal": 177
      },
      "structureGroupId": "cardiac",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          -37.278637189433084,
          -198.68771762768097,
          1134.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          -37.278637189433084,
          -198.68771762768097,
          1134.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          177.28203251757222,
          149.53322706401138,
          32.189697265625
        ],
        "roundedVoxel": [
          177,
          150,
          32
        ],
        "normalized": {
          "sagittal": 0.5784313725490197,
          "coronal": 0.6607929515418502,
          "axial": 0.26666666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          -0.037278637189433084,
          1.1349793701171875,
          0.19868771762768098
        ]
      },
      "meshExists": true,
      "meshNameResolved": "right atrium"
    },
    {
      "id": "landmark_right_ventricle",
      "label": "right ventricle",
      "displayLabel": "right ventricle",
      "kind": "landmark",
      "landmarkGroup": "cardiac",
      "markupFile": "Model/markups/right ventricle.mrk.json",
      "meshNameExpected": "right ventricle",
      "meshNameVerified": true,
      "deriveSliceIndexFromMarkup": true,
      "sliceIndex": {
        "axial": 30,
        "coronal": 172,
        "sagittal": 95
      },
      "notes": "",
      "meshName": "right ventricle",
      "voxelIndex": {
        "axial": 20,
        "coronal": 178,
        "sagittal": 126
      },
      "structureGroupId": "cardiac",
      "markup": {
        "coordinateSystem": "LPS",
        "sourceCoordinateSystem": "LPS",
        "position": [
          3.8407107572487007,
          -221.67145796469083,
          1110.9793701171875
        ]
      },
      "world": {
        "coordinateSystem": "LPS",
        "position": [
          3.8407107572487007,
          -221.67145796469083,
          1110.9793701171875
        ]
      },
      "derived": {
        "continuousVoxel": [
          126.18226031198708,
          178.09554515272268,
          20.189697265625
        ],
        "roundedVoxel": [
          126,
          178,
          20
        ],
        "normalized": {
          "sagittal": 0.4117647058823529,
          "coronal": 0.7841409691629956,
          "axial": 0.16666666666666666
        },
        "axisMap": {
          "sagittal": "i",
          "coronal": "j",
          "axial": "k"
        },
        "scenePosition": [
          0.0038407107572487006,
          1.1109793701171875,
          0.22167145796469084
        ]
      },
      "meshExists": true,
      "meshNameResolved": "right ventricle"
    }
  ],
  "toggleSets": [
    {
      "id": "lymph_nodes",
      "label": "Lymph nodes",
      "targetIds": [
        "node_1R",
        "node_1L",
        "node_2R",
        "node_2L",
        "node_3A_1",
        "node_3A_2",
        "node_3A_3",
        "node_3A_4",
        "node_3A_5",
        "node_3A_6",
        "node_3A_7",
        "node_4R_1",
        "node_4R_2",
        "node_4R_3",
        "node_4L_1",
        "node_4L_2",
        "node_4L_3",
        "node_5_nod5",
        "node_6_nod5",
        "node_7_1",
        "node_10R_1",
        "node_10R_2",
        "node_10L",
        "node_11L",
        "node_11Ri",
        "node_11Rs_1",
        "node_11Rs_2"
      ]
    },
    {
      "id": "airway",
      "label": "Airway",
      "targetIds": [
        "landmark_bronchus_intermedius",
        "landmark_carina",
        "landmark_left_mainstem",
        "landmark_right_mainstem",
        "landmark_trachea"
      ]
    },
    {
      "id": "vessels",
      "label": "Vessels",
      "targetIds": [
        "landmark_aorta",
        "landmark_azygous_vein",
        "landmark_brachiocephalic_trunk",
        "landmark_left_brachiocephalic_vein",
        "landmark_left_inferior_pv",
        "landmark_left_pa",
        "landmark_left_superior_pv",
        "landmark_main_pa",
        "landmark_right_inferior_pv",
        "landmark_right_pa",
        "landmark_right_superior_pv",
        "landmark_superior_vena_cava",
        "landmark_right_brachiocephalic_vein",
        "landmark_inferior_vena_cava",
        "landmark_right_subclavian_artery",
        "landmark_left_subclavian_artery",
        "landmark_right_common_carotid_artery",
        "landmark_left_common_carotid_artery"
      ]
    },
    {
      "id": "cardiac",
      "label": "Cardiac",
      "targetIds": [
        "landmark_left_atrium",
        "landmark_left_atrial_appendage",
        "landmark_left_ventricle",
        "landmark_right_atrium",
        "landmark_right_ventricle"
      ]
    },
    {
      "id": "gi",
      "label": "GI",
      "targetIds": [
        "landmark_esophagus"
      ]
    }
  ],
  "preprocessingRequired": {
    "required": true,
    "tasks": [
      "Verify actual mesh names inside Model/case_001.glb and either rename meshes to match meshNameExpected or update this manifest.",
      "Read each .mrk.json file and extract the first control point position plus its coordinateSystem.",
      "Read the CT volume geometry from Model/case_001_ct.nrrd and derive the voxel-to-world and world-to-voxel transforms.",
      "Convert each markup point into continuous voxel coordinates automatically, honoring the markup coordinateSystem.",
      "Determine which voxel axis corresponds to sagittal, coronal, and axial using the CT orientation matrix rather than assuming i/j/k order.",
      "Map the continuous voxel position to exported slice-series frame indices using the series counts; if counts differ from the volume dimensions, scale by normalized position.",
      "Clamp derived slice indices to valid ranges and write them back into the enriched manifest.",
      "Enumerate actual slice filenames in each folder and write a generated asset index for Expo bundling.",
      "Optionally compute a station centroid or station-level bounds for grouped highlighting."
    ]
  },
  "moduleDefaults": {
    "defaultStationId": "4R",
    "defaultToggleSetIds": [
      "lymph_nodes",
      "airway",
      "vessels"
    ],
    "defaultSliceLayout": "single-plane",
    "defaultPlane": "axial"
  },
  "glbMeshes": [
    "airway",
    "esophagus",
    "right brachiocephalic vein",
    "left brachiocephalic vein",
    "superior vena cava",
    "azygous vein",
    "inferior vena cava",
    "right atrium",
    "right ventricle",
    "pulmonary artery",
    "pulmonary venous system",
    "left atrium",
    "left atrial appendage",
    "left ventricle",
    "aorta",
    "brachiocephalic trunk",
    "right subclavian artery",
    "left subclavian artery",
    "right common carotid artery",
    "left common carotid artery",
    "Station 1R",
    "Station 1L",
    "Station 2R",
    "Station 2L",
    "Station 3A",
    "Station 4R",
    "Station 4L",
    "Station 5",
    "Station 6",
    "Station 7",
    "Station 10R",
    "Station 10L",
    "Station 11Rs",
    "Station 11Ri",
    "Station 11L"
  ],
  "meshMappingNotes": {
    "lymphNodes": "The GLB stores one mesh per station, not one mesh per individual segmented node. Multiple markup targets within the same station therefore point to the same station mesh.",
    "airwayLandmarks": "trachea, carina, bronchus intermedius, left mainstem, and right mainstem all map to the single GLB mesh named 'airway'.",
    "pulmonaryArteryLandmarks": "main PA, left PA, and right PA all map to the single GLB mesh named 'pulmonary artery'.",
    "pulmonaryVenousLandmarks": "left/right superior and inferior PV landmarks all map to the single GLB mesh named 'pulmonary venous system'.",
    "stationMeshes": "Station 6 spelling has been normalized to match the corrected GLB mesh name. Each nodal target within a station points to the corresponding station mesh.",
    "uniqueLandmarks": "Aorta, brachiocephalic trunk, brachiocephalic veins, SVC, IVC, subclavian arteries, carotids, atria, ventricles, esophagus, and left atrial appendage each map to their own GLB mesh when present."
  },
  "generatedAt": "2026-03-28T20:00:10.851Z",
  "runtimeSchemaVersion": 1,
  "volumeGeometry": {
    "coordinateSystem": "LPS",
    "sizes": [
      307,
      228,
      121
    ],
    "spaceDirections": [
      [
        -0.8046874999999998,
        0,
        0
      ],
      [
        0,
        -0.8046874999999998,
        0
      ],
      [
        0,
        0,
        2
      ]
    ],
    "spaceOrigin": [
      105.37799835205078,
      -78.36019897460935,
      1070.5999755859375
    ],
    "axisMap": {
      "sagittal": "i",
      "coronal": "j",
      "axial": "k"
    },
    "ijkToWorldMatrix": [
      -0.8046874999999998,
      0,
      0,
      105.37799835205078,
      0,
      -0.8046874999999998,
      0,
      -78.36019897460935,
      0,
      0,
      2,
      1070.5999755859375,
      0,
      0,
      0,
      1
    ],
    "worldToIjkMatrix": [
      -1.242718446601942,
      0,
      0,
      130.95518241808256,
      0,
      -1.242718446601942,
      0,
      -97.37966474514562,
      0,
      0,
      0.5,
      -535.2999877929688,
      0,
      0,
      0,
      1
    ]
  },
  "patientToScene": {
    "name": "patientToScene",
    "from": "LPS-mm",
    "to": "three-scene-meters",
    "matrix": [
      0.001,
      0,
      0,
      0,
      0,
      0,
      0.001,
      0,
      0,
      -0.001,
      0,
      0,
      0,
      0,
      0,
      1
    ],
    "inverseMatrix": [
      1000,
      0,
      0,
      0,
      0,
      0,
      -1000,
      0,
      0,
      1000,
      0,
      0,
      0,
      0,
      0,
      1
    ],
    "note": "This explicit transform maps CT/markup patient-space coordinates into the shared Three scene basis. The GLB is already exported in that scene basis, so it should be wrapped in the inverse transform before joining the patient-space group."
  },
  "meshNames": [
    "airway",
    "aorta",
    "azygous vein",
    "brachiocephalic trunk",
    "esophagus",
    "inferior vena cava",
    "left atrial appendage",
    "left atrium",
    "left brachiocephalic vein",
    "left common carotid artery",
    "left subclavian artery",
    "left ventricle",
    "pulmonary artery",
    "pulmonary venous system",
    "right atrium",
    "right brachiocephalic vein",
    "right common carotid artery",
    "right subclavian artery",
    "right ventricle",
    "Station 1L",
    "Station 1R",
    "Station 2L",
    "Station 2R",
    "Station 3A",
    "Station 4L",
    "Station 4R",
    "Station 5",
    "Station 6",
    "Station 7",
    "Station 10L",
    "Station 10R",
    "Station 11L",
    "Station 11Ri",
    "Station 11Rs",
    "superior vena cava"
  ],
  "sliceAssetCounts": {
    "axial": 180,
    "coronal": 220,
    "sagittal": 160
  },
  "sliceTextureMetadata": {
    "axial": {
      "pixelWidth": 714,
      "pixelHeight": 556,
      "crop": {
        "x": 0,
        "y": 0,
        "width": 1,
        "height": 1
      },
      "sourceLooksCropped": false,
      "warning": null
    },
    "coronal": {
      "pixelWidth": 714,
      "pixelHeight": 556,
      "crop": {
        "x": 0,
        "y": 0,
        "width": 1,
        "height": 1
      },
      "sourceLooksCropped": true,
      "warning": "coronal slice textures look cropped or viewport-exported relative to CT geometry; use crop metadata for clean co-registration."
    },
    "sagittal": {
      "pixelWidth": 712,
      "pixelHeight": 556,
      "crop": {
        "x": 0,
        "y": 0,
        "width": 1,
        "height": 1
      },
      "sourceLooksCropped": true,
      "warning": "sagittal slice textures look cropped or viewport-exported relative to CT geometry; use crop metadata for clean co-registration."
    }
  },
  "warnings": [
    "coronal slice textures look cropped or viewport-exported relative to CT geometry; use crop metadata for clean co-registration.",
    "sagittal slice textures look cropped or viewport-exported relative to CT geometry; use crop metadata for clean co-registration."
  ],
  "bounds": {
    "ct": {
      "coordinateSystem": "LPS",
      "min": [
        -140.85637664794916,
        -261.02426147460926,
        1070.5999755859375
      ],
      "max": [
        105.37799835205078,
        -78.36019897460935,
        1310.5999755859375
      ]
    },
    "segmentation": {
      "coordinateSystem": "LPS",
      "min": [
        -219.59765625000009,
        -386.59765625000017,
        688
      ],
      "max": [
        191.59765625000003,
        24.597656249999943,
        1340
      ]
    },
    "union": {
      "coordinateSystem": "LPS",
      "min": [
        -219.59765625000009,
        -386.59765625000017,
        688
      ],
      "max": [
        191.59765625000003,
        24.597656249999943,
        1340
      ]
    }
  },
  "segmentation": {
    "coordinateSystem": "LPS",
    "sizes": [
      512,
      512,
      327
    ],
    "componentCount": 3,
    "spaceDirections": [
      [
        0.8046875000000002,
        0,
        0
      ],
      [
        0,
        0.8046875000000002,
        0
      ],
      [
        0,
        0,
        2
      ]
    ],
    "spaceOrigin": [
      -219.59765625000009,
      -386.59765625000017,
      688
    ],
    "ijkToWorldMatrix": [
      0.8046875000000002,
      0,
      0,
      -219.59765625000009,
      0,
      0.8046875000000002,
      0,
      -386.59765625000017,
      0,
      0,
      2,
      688,
      0,
      0,
      0,
      1
    ],
    "worldToIjkMatrix": [
      1.2427184466019414,
      0,
      0,
      272.89805825242723,
      0,
      1.2427184466019414,
      0,
      480.4320388349515,
      0,
      0,
      0.5,
      -344,
      0,
      0,
      0,
      1
    ],
    "worldBounds": {
      "coordinateSystem": "LPS",
      "min": [
        -219.59765625000009,
        -386.59765625000017,
        688
      ],
      "max": [
        191.59765625000003,
        24.597656249999943,
        1340
      ]
    },
    "referenceImageGeometry": "-0.8046875000000001;0;0;219.59765625000003;0;-0.8046875000000001;0;386.59765625000006;0;0;2;688;0;0;0;1;0;511;0;511;0;326;",
    "segments": [
      {
        "index": 0,
        "id": "2.25.314609811388436314422080028160079540590",
        "name": "airway",
        "labelValue": 2,
        "layer": 0,
        "color": [
          0.666667,
          1,
          1
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "airway",
        "targetIds": [
          "landmark_bronchus_intermedius",
          "landmark_carina",
          "landmark_trachea",
          "landmark_left_mainstem",
          "landmark_right_mainstem"
        ],
        "stationIds": [],
        "meshNameResolved": "airway"
      },
      {
        "index": 1,
        "id": "esophagus",
        "name": "esophagus",
        "labelValue": 3,
        "layer": 0,
        "color": [
          0.827451,
          0.670588,
          0.560784
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "gi",
        "targetIds": [
          "landmark_esophagus"
        ],
        "stationIds": [],
        "meshNameResolved": "esophagus"
      },
      {
        "index": 2,
        "id": "brachiocephalic_vein_right",
        "name": "right brachiocephalic vein",
        "labelValue": 4,
        "layer": 0,
        "color": [
          0,
          0.592157,
          0.807843
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_right_brachiocephalic_vein"
        ],
        "stationIds": [],
        "meshNameResolved": "right brachiocephalic vein"
      },
      {
        "index": 3,
        "id": "brachiocephalic_vein_left",
        "name": "left brachiocephalic vein",
        "labelValue": 5,
        "layer": 0,
        "color": [
          0,
          0.631373,
          0.768627
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_left_brachiocephalic_vein"
        ],
        "stationIds": [],
        "meshNameResolved": "left brachiocephalic vein"
      },
      {
        "index": 4,
        "id": "superior_vena_cava",
        "name": "superior vena cava",
        "labelValue": 6,
        "layer": 0,
        "color": [
          0.556863,
          0.698039,
          0.603922
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_superior_vena_cava"
        ],
        "stationIds": [],
        "meshNameResolved": "superior vena cava"
      },
      {
        "index": 5,
        "id": "2.25.111239317664077265941812615039469954434",
        "name": "azygous vein",
        "labelValue": 1,
        "layer": 1,
        "color": [
          0.52549,
          0.611765,
          1
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_azygous_vein"
        ],
        "stationIds": [],
        "meshNameResolved": "azygous vein"
      },
      {
        "index": 6,
        "id": "inferior_vena_cava",
        "name": "inferior vena cava",
        "labelValue": 7,
        "layer": 0,
        "color": [
          0,
          0.592157,
          0.807843
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_inferior_vena_cava"
        ],
        "stationIds": [],
        "meshNameResolved": "inferior vena cava"
      },
      {
        "index": 7,
        "id": "2.25.94981541103766622373479159084072708115",
        "name": "right atrium",
        "labelValue": 1,
        "layer": 2,
        "color": [
          0,
          0.333333,
          1
        ],
        "extent": [
          194,
          326,
          192,
          318,
          204,
          261
        ],
        "groupId": "cardiac",
        "targetIds": [
          "landmark_right_atrium"
        ],
        "stationIds": [],
        "meshNameResolved": "right atrium"
      },
      {
        "index": 8,
        "id": "2.25.306757321920428423854529791107945832273",
        "name": "right ventricle",
        "labelValue": 2,
        "layer": 1,
        "color": [
          0,
          0.333333,
          1
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "cardiac",
        "targetIds": [
          "landmark_right_ventricle"
        ],
        "stationIds": [],
        "meshNameResolved": "right ventricle"
      },
      {
        "index": 9,
        "id": "pulmonary_artery",
        "name": "pulmonary artery",
        "labelValue": 2,
        "layer": 2,
        "color": [
          0,
          0,
          1
        ],
        "extent": [
          194,
          326,
          192,
          318,
          204,
          261
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_main_pa",
          "landmark_left_pa",
          "landmark_right_pa"
        ],
        "stationIds": [],
        "meshNameResolved": "pulmonary artery"
      },
      {
        "index": 10,
        "id": "pulmonary_vein",
        "name": "pulmonary venous system",
        "labelValue": 3,
        "layer": 2,
        "color": [
          0.729412,
          0.301961,
          0.25098
        ],
        "extent": [
          194,
          326,
          192,
          318,
          204,
          261
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_left_inferior_pv",
          "landmark_left_superior_pv",
          "landmark_right_inferior_pv",
          "landmark_right_superior_pv"
        ],
        "stationIds": [],
        "meshNameResolved": "pulmonary venous system"
      },
      {
        "index": 11,
        "id": "2.25.11162851537065423916236596478087091296",
        "name": "left atrium",
        "labelValue": 3,
        "layer": 1,
        "color": [
          1,
          0,
          0
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "cardiac",
        "targetIds": [
          "landmark_left_atrium"
        ],
        "stationIds": [],
        "meshNameResolved": "left atrium"
      },
      {
        "index": 12,
        "id": "atrial_appendage_left",
        "name": "left atrial appendage",
        "labelValue": 8,
        "layer": 0,
        "color": [
          0.858824,
          0.298039,
          0.211765
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "cardiac",
        "targetIds": [
          "landmark_left_atrial_appendage"
        ],
        "stationIds": [],
        "meshNameResolved": "left atrial appendage"
      },
      {
        "index": 13,
        "id": "2.25.122868581635728138705614725803586075780",
        "name": "left ventricle",
        "labelValue": 1,
        "layer": 0,
        "color": [
          1,
          0,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "cardiac",
        "targetIds": [
          "landmark_left_ventricle"
        ],
        "stationIds": [],
        "meshNameResolved": "left ventricle"
      },
      {
        "index": 14,
        "id": "aorta",
        "name": "aorta",
        "labelValue": 4,
        "layer": 1,
        "color": [
          0.878431,
          0.380392,
          0.298039
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_aorta"
        ],
        "stationIds": [],
        "meshNameResolved": "aorta"
      },
      {
        "index": 15,
        "id": "brachiocephalic_trunk",
        "name": "brachiocephalic trunk",
        "labelValue": 9,
        "layer": 0,
        "color": [
          0.768627,
          0.47451,
          0.309804
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "other",
        "targetIds": [
          "landmark_brachiocephalic_trunk"
        ],
        "stationIds": [],
        "meshNameResolved": "brachiocephalic trunk"
      },
      {
        "index": 16,
        "id": "subclavian_artery_right",
        "name": "right subclavian artery",
        "labelValue": 10,
        "layer": 0,
        "color": [
          0.847059,
          0.396078,
          0.34902
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_right_subclavian_artery"
        ],
        "stationIds": [],
        "meshNameResolved": "right subclavian artery"
      },
      {
        "index": 17,
        "id": "subclavian_artery_left",
        "name": "left subclavian artery",
        "labelValue": 11,
        "layer": 0,
        "color": [
          0.847059,
          0.396078,
          0.270588
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_left_subclavian_artery"
        ],
        "stationIds": [],
        "meshNameResolved": "left subclavian artery"
      },
      {
        "index": 18,
        "id": "common_carotid_artery_right",
        "name": "right common carotid artery",
        "labelValue": 12,
        "layer": 0,
        "color": [
          0,
          0.439216,
          0.647059
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_right_common_carotid_artery"
        ],
        "stationIds": [],
        "meshNameResolved": "right common carotid artery"
      },
      {
        "index": 19,
        "id": "common_carotid_artery_left",
        "name": "left common carotid artery",
        "labelValue": 13,
        "layer": 0,
        "color": [
          0.0392157,
          0.411765,
          0.607843
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "vessels",
        "targetIds": [
          "landmark_left_common_carotid_artery"
        ],
        "stationIds": [],
        "meshNameResolved": "left common carotid artery"
      },
      {
        "index": 20,
        "id": "2.25.53993552652818166383402955961129171632",
        "name": "Station 1R",
        "labelValue": 14,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_1R"
        ],
        "stationIds": [
          "1R"
        ],
        "meshNameResolved": "Station 1R"
      },
      {
        "index": 21,
        "id": "2.25.60762053273684785009037968769448832207",
        "name": "Station 1L",
        "labelValue": 19,
        "layer": 0,
        "color": [
          0.564706,
          0.933333,
          0.564706
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_1L"
        ],
        "stationIds": [
          "1L"
        ],
        "meshNameResolved": "Station 1L"
      },
      {
        "index": 22,
        "id": "2.25.20830374192229656165820331138320646873",
        "name": "Station 2R",
        "labelValue": 5,
        "layer": 1,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_2R"
        ],
        "stationIds": [
          "2R"
        ],
        "meshNameResolved": "Station 2R"
      },
      {
        "index": 23,
        "id": "2.25.48624296096474164041790855708405278758",
        "name": "Station 2L",
        "labelValue": 6,
        "layer": 1,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_2L"
        ],
        "stationIds": [
          "2L"
        ],
        "meshNameResolved": "Station 2L"
      },
      {
        "index": 24,
        "id": "2.25.312506753561539454691948452144159132025",
        "name": "Station 3A",
        "labelValue": 15,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_3A_1",
          "node_3A_2",
          "node_3A_3",
          "node_3A_4",
          "node_3A_5",
          "node_3A_6",
          "node_3A_7"
        ],
        "stationIds": [
          "3A"
        ],
        "meshNameResolved": "Station 3A"
      },
      {
        "index": 25,
        "id": "2.25.121062370142623028444183689976439892722",
        "name": "Station 4R",
        "labelValue": 20,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_4R_1",
          "node_4R_2",
          "node_4R_3"
        ],
        "stationIds": [
          "4R"
        ],
        "meshNameResolved": "Station 4R"
      },
      {
        "index": 26,
        "id": "2.25.276115978171104054815639826201025438059",
        "name": "Station 4L",
        "labelValue": 21,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_4L_1",
          "node_4L_2",
          "node_4L_3"
        ],
        "stationIds": [
          "4L"
        ],
        "meshNameResolved": "Station 4L"
      },
      {
        "index": 27,
        "id": "2.25.212414958810818875948453230124833991184",
        "name": "Station 5",
        "labelValue": 22,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_5_nod5"
        ],
        "stationIds": [
          "5"
        ],
        "meshNameResolved": "Station 5"
      },
      {
        "index": 28,
        "id": "2.25.239492796546459861507994252932045774720",
        "name": "Station 6",
        "labelValue": 23,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_6_nod5"
        ],
        "stationIds": [
          "6"
        ],
        "meshNameResolved": "Station 6"
      },
      {
        "index": 29,
        "id": "2.25.268879151571743626125047618104203736194",
        "name": "Station 7",
        "labelValue": 7,
        "layer": 1,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          222,
          317,
          187,
          341,
          136,
          301
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_7_1"
        ],
        "stationIds": [
          "7"
        ],
        "meshNameResolved": "Station 7"
      },
      {
        "index": 30,
        "id": "2.25.108758159455925476842465611424706367338",
        "name": "Station 10R",
        "labelValue": 16,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_10R_1",
          "node_10R_2"
        ],
        "stationIds": [
          "10R"
        ],
        "meshNameResolved": "Station 10R"
      },
      {
        "index": 31,
        "id": "2.25.265963977509172877070359499184196808585",
        "name": "Station 10L",
        "labelValue": 17,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_10L"
        ],
        "stationIds": [
          "10L"
        ],
        "meshNameResolved": "Station 10L"
      },
      {
        "index": 32,
        "id": "2.25.273934619515693923059552848848411656207",
        "name": "Station 11Rs",
        "labelValue": 24,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_11Rs_1",
          "node_11Rs_2"
        ],
        "stationIds": [
          "11Rs"
        ],
        "meshNameResolved": "Station 11Rs"
      },
      {
        "index": 33,
        "id": "2.25.203565841377755533927323140586090706777",
        "name": "Station 11Ri",
        "labelValue": 25,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_11Ri"
        ],
        "stationIds": [
          "11Ri"
        ],
        "meshNameResolved": "Station 11Ri"
      },
      {
        "index": 34,
        "id": "2.25.26054851494271011036540584591024408830",
        "name": "Station 11L",
        "labelValue": 18,
        "layer": 0,
        "color": [
          0,
          1,
          0
        ],
        "extent": [
          159,
          382,
          187,
          335,
          84,
          326
        ],
        "groupId": "nodes",
        "targetIds": [
          "node_11L"
        ],
        "stationIds": [
          "11L"
        ],
        "meshNameResolved": "Station 11L"
      }
    ]
  }
}

```

## File: `content/course/course-info.json`

```json
{
  "courseTitle": "10th Annual Southwest Regional Pulmonary/PCCM Fellow EBUS Course",
  "hostLine": "Hosted by Loma Linda University Health",
  "hostDepartment": "Division of Pulmonary, Critical Care, Hyperbaric and Sleep Medicine",
  "dateLabel": "Sunday, May 31, 2026",
  "timeLabel": "7:30 am to 5:00 pm",
  "venueName": "Loma Linda Centennial Complex",
  "venueDetail": "Loma Linda University School of Medicine",
  "audience": "Designed to set early expectations for first-year pulmonary and pulmonary-critical care fellows learning the cognitive and technical foundations of EBUS.",
  "overview": "The flyer positions this as a regional course that pairs expert-led pre-course didactics with a hands-on simulation day so fellows can build a more standardized approach to mediastinal evaluation, staging, and procedure execution.",
  "quickFacts": [
    {
      "value": "15+ hrs",
      "label": "faculty-built video prep"
    },
    {
      "value": "~2.5:1",
      "label": "fellow-to-faculty ratio"
    },
    {
      "value": "24+",
      "label": "regional faculty"
    }
  ],
  "courseDirectors": [
    "Ara A. Chrissian, MD",
    "Lamia Aljundi, MD"
  ],
  "facultySummary": "Faculty listed on the flyer span LLU, Stanford, Cedars-Sinai, USC, UCSD, City of Hope, UCLA, UCI, Harbor-UCLA, Scripps, Eisenhower, UNLV, UT Southwestern, Navy, and the University at Buffalo.",
  "formatHighlights": [
    "Flipped model with more than 15 hours of high-yield pre-course lectures prepared by faculty.",
    "Live day is almost entirely simulation-based instead of lecture-heavy.",
    "Small-group teaching model with a low fellow-to-faculty ratio.",
    "Dedicated time for technology exposure, networking, and direct faculty interaction.",
    "App-based pre- and post-testing with feedback is new for the 2026 course."
  ],
  "prepWindow": "Preparatory materials are distributed 3 to 4 weeks before the live event and should be completed between May 1 and May 30, 2026.",
  "prepTopics": [
    "Introduction to endobronchial ultrasound and the procedure nuts and bolts.",
    "Mediastinal anatomy plus systematic lung cancer staging using TNM 9.",
    "Approach to lymphoma and non-malignant thoracic disease.",
    "Histology, molecular testing, and tissue adequacy.",
    "Liquid biopsy, advanced EBUS techniques, and the 2026 evidence update.",
    "Guideline-based planning, case synthesis, and the pre-course test."
  ],
  "liveDayAgenda": [
    {
      "time": "7:30-7:50",
      "title": "Registration and breakfast",
      "detail": "First floor of the Centennial Complex before team rotations begin."
    },
    {
      "time": "8:00-8:20",
      "title": "Welcome and course overview",
      "detail": "All fellows meet in Damazo Auditorium."
    },
    {
      "time": "8:35-12:00",
      "title": "AM tools and techniques rotations",
      "detail": "Mediastinal anatomy game, scope anatomy and assembly, EBUS exam, standard needles and TBNA technique, plus advanced tools."
    },
    {
      "time": "10:20-10:50",
      "title": "Technology and networking break",
      "detail": "Protected time in the main conference area."
    },
    {
      "time": "12:10-12:55",
      "title": "Lunch and honorary lecture",
      "detail": "AABIP guidelines session with Dr. Russell Miller."
    },
    {
      "time": "13:10-16:00",
      "title": "PM synthesis and execution rotations",
      "detail": "Case-based planning, advanced cases and techniques, then technical execution."
    },
    {
      "time": "16:15-17:00",
      "title": "Final Jeopardy and farewell",
      "detail": "All fellows reconvene in Damazo Auditorium to close the day."
    }
  ],
  "addressLines": [
    "24760 Stewart Street",
    "Centennial Complex, 4th Floor",
    "Loma Linda, CA"
  ],
  "parkingNote": "Parking is directed to lot X off Campus Street.",
  "travelNote": "The flyer includes separate driving directions for attendees coming from Los Angeles, Palm Springs, San Diego, and Las Vegas."
}

```

## File: `content/modules/knobology-advanced.json`

```json
{
  "id": "knobology-advanced",
  "title": "Ultrasound Foundations and EBUS Knobology",
  "summary": "A concise fellowship-level review of how EBUS images are formed, how controls change what you see, and how those adjustments affect safe node targeting.",
  "learningObjectives": [
    "Explain why air, balloon contact, and tissue coupling change image quality before any processor control is touched.",
    "Differentiate frequency, wavelength, resolution, and penetration in the practical context of CP-EBUS versus RP-EBUS.",
    "Use the vocabulary of echogenicity, CHS, CNS, margins, and artifacts consistently while describing an EBUS image.",
    "Apply depth, gain, contrast, Doppler, freeze, and calipers in a deliberate sequence instead of random trial-and-error.",
    "Recognize common artifacts and sampling pitfalls that can make a target look more reassuring or more dangerous than it really is."
  ],
  "sections": [
    {
      "id": "image-formation",
      "title": "Why EBUS images look the way they do",
      "kind": "core-concept",
      "body": "EBUS depends on acoustic coupling. Air is a major reflector, so even a technically perfect processor setting cannot rescue an image if the balloon is not making stable contact or if the probe is partly facing air-filled airway. Start by improving contact, orientation, and target centering before assuming the machine settings are wrong.",
      "bullets": [
        "Acoustic impedance mismatch at an air-tissue interface causes major signal loss.",
        "Small changes in balloon contact can improve the image more than large gain changes.",
        "A readable image begins with probe position, not the control panel."
      ],
      "pearl": "If the frame suddenly improves with a tiny contact change, keep the machine steady and learn that acoustic window before adjusting the processor.",
      "pitfall": "Overgaining a poorly coupled image can create bright haze that hides the real border even more effectively."
    },
    {
      "id": "frequency-penetration",
      "title": "Frequency, wavelength, and the CP-EBUS versus RP-EBUS tradeoff",
      "kind": "core-concept",
      "body": "Higher-frequency ultrasound gives better spatial resolution but loses depth penetration more quickly. In practical teaching terms, RP-EBUS is a high-frequency, peripheral localization tool, whereas CP-EBUS trades some resolution for deeper penetration and real-time needle guidance around mediastinal and hilar structures.",
      "bullets": [
        "Shorter wavelength improves detail but attenuates sooner.",
        "RP-EBUS is typically high-frequency and optimized for peripheral lesion localization.",
        "CP-EBUS supports deeper imaging, Doppler, and real-time sampling."
      ],
      "pearl": "When a deep target looks soft or poorly defined, remember that the limitation may be depth and coupling, not learner skill alone.",
      "pitfall": "Do not promise learners that a better setting can fully overcome the physics tradeoff between penetration and resolution."
    },
    {
      "id": "echogenicity-language",
      "title": "Echogenicity language matters",
      "kind": "core-concept",
      "body": "Anechoic structures are nearly black, hypoechoic areas are darker than the background, isoechoic tissue blends with its surroundings, and hyperechoic structures are bright. This vocabulary becomes important when deciding whether a finding looks cystic, vascular, necrotic, calcified, or simply undergained.",
      "bullets": [
        "CHS is a central linear or flat hyperechoic structure that tends to favor benignity when preserved.",
        "CNS refers to a hypoechoic necrotic-appearing area without flow and can increase concern for malignancy.",
        "Describing echogenicity first keeps later interpretation more objective."
      ],
      "pearl": "Teach the learner to describe what is visible before inferring what it means.",
      "pitfall": "Calling a dark region necrosis before checking Doppler, contact, and artifact can lead to overconfidence."
    },
    {
      "id": "control-sequence",
      "title": "Control sequence before you sample",
      "kind": "technique",
      "body": "Use a predictable sequence: center the target, set depth, tune gain, refine contrast, check vessels with Doppler, freeze when the frame is trustworthy, measure only if it changes management, then save. A stable sequence reduces cognitive load and makes teaching reproducible across stations.",
      "bullets": [
        "Depth answers the framing question first.",
        "Gain fixes global brightness; contrast helps edge separation after framing is reasonable.",
        "Doppler is a safety step before puncture, not a substitute for grayscale interpretation.",
        "Freeze and calipers matter only after the image is worth preserving."
      ],
      "checklist": [
        "Target centered and fully visible",
        "Margins readable without excessive haze",
        "Vascular structures checked with Doppler",
        "Measurement done only if clinically useful",
        "Teaching frame saved after optimization"
      ],
      "pearl": "A consistent sequence lets the learner explain each adjustment instead of randomly hunting for a prettier image.",
      "pitfall": "Measuring or saving too early locks in a poor frame and teaches the wrong visual standard."
    },
    {
      "id": "artifacts",
      "title": "Artifact patterns that matter in EBUS",
      "kind": "artifact",
      "body": "Artifacts are not just exam trivia. Reverberation, comet-tail and tadpole-tail patterns often appear when strong reflectors or air interfaces create repeated echoes; acoustic shadowing can hide tissue behind calcified or highly reflective structures; mirror-image effects can create false symmetry. Learners need to recognize that an artifact may explain a pattern more convincingly than pathology does.",
      "bullets": [
        "Reverberation repeats a reflector and is common near air and cartilage interfaces.",
        "Comet-tail and tadpole-tail artifacts are tapering reverberation variants that can exaggerate bright interfaces.",
        "Acoustic shadowing hides information behind a strong reflector.",
        "Mirror-image artifact can make anatomy appear duplicated across a reflective boundary."
      ],
      "pearl": "If a surprising finding stays perfectly tied to a bright interface while the probe moves, think artifact before anatomy.",
      "pitfall": "A learner who mistakes shadow or reverberation for a true border may place calipers or plan a needle path against a false target."
    },
    {
      "id": "doppler-sampling",
      "title": "Doppler and node-targeting pearls",
      "kind": "clinical-pearl",
      "body": "Color or power Doppler helps separate vessels from avascular tissue, but grayscale interpretation still comes first. The safest puncture is rarely the shortest line on screen; it is the line that preserves scope stability, confirms a vessel-free path, and samples viable tissue rather than obvious necrosis.",
      "bullets": [
        "Identify vessels before puncture, especially when the path seems deceptively direct.",
        "Avoid obvious necrotic-appearing avascular areas when a better solid target is available.",
        "When needed, puncture between cartilage rings with deliberate scope control rather than force.",
        "Use fanning and capsule-to-capsule sampling to traverse more than one part of a node."
      ],
      "pearl": "A slightly less direct path with better control is often the safer educational choice than a dramatic straight-line puncture.",
      "pitfall": "A Doppler-negative region is not automatically safe if the grayscale target is mostly necrotic or poorly coupled."
    },
    {
      "id": "non-diagnostic-frames",
      "title": "When images are misleading",
      "kind": "pitfall",
      "body": "A crisp-looking image can still mislead if the target is only partially included, if the apparent border is artifact, or if the image was frozen during motion. Non-diagnostic specimens often begin with non-diagnostic images: poor contact, poor target selection, repeated sampling of the same tract, or sampling an avascular necrotic cavity instead of viable tissue.",
      "bullets": [
        "Do not confuse a still frame with a trustworthy frame.",
        "Repeated passes along the same track can create false confidence without broadening the sample.",
        "A technically neat puncture can still be biologically low-yield if the target selection is poor."
      ],
      "pearl": "When yield is low, revisit target choice and image quality before blaming the needle or pathology workflow.",
      "pitfall": "Learners often focus on needle choreography and miss that the underlying image never justified the pass."
    },
    {
      "id": "sampling-vignette",
      "title": "Case vignette: bright image, poor target",
      "kind": "case",
      "body": "A learner obtains a bright, centered frame of a large node but the middle is avascular and nearly anechoic while the capsule remains solid. Doppler excludes a nearby vessel, and the first instinct is to puncture the center because it is easiest to see.",
      "caseVignette": {
        "title": "Sample the viable rim, not the dramatic center",
        "scenario": "The safest-looking path crosses no Doppler signal, but the most conspicuous part of the node appears necrotic.",
        "prompt": "What should change first: the puncture path, the image settings, or the target inside the node?",
        "takeaway": "The target inside the node should change first. After vessel check and image optimization, aim for viable tissue and use fanning rather than repeatedly sampling an obvious necrotic cavity."
      }
    }
  ]
}

```

## File: `content/modules/knobology.json`

```json
{
  "primerSections": [
    {
      "id": "depth",
      "title": "Depth",
      "summary": "Depth changes how much tissue fits on the screen. Increase it when the target is cut off; decrease it when the target is tiny and buried in unused space.",
      "bestMove": "Frame the target so it sits comfortably in the middle third of the image.",
      "pitfall": "Leaving the target too shallow or too deep makes every other control harder to judge."
    },
    {
      "id": "gain",
      "title": "Gain",
      "summary": "Gain brightens or darkens the whole image. Raise it when borders disappear into darkness; lower it when everything turns milky and noisy.",
      "bestMove": "Adjust until the target is visible without filling the frame with haze.",
      "pitfall": "Beginners often overcorrect and wash out the margins."
    },
    {
      "id": "contrast",
      "title": "Contrast",
      "summary": "Contrast separates subtle shades. It helps the learner see where the border ends and background clutter begins.",
      "bestMove": "Use contrast after depth and gain are reasonable.",
      "pitfall": "High gain with low contrast produces a flat image with poor edge definition."
    },
    {
      "id": "color-doppler",
      "title": "Color Doppler",
      "summary": "Color Doppler adds flow information so the learner can flag a vessel before planning a path.",
      "bestMove": "Turn it on when you need to decide whether a structure might be vascular.",
      "pitfall": "Using it as the first adjustment instead of fixing framing and brightness."
    },
    {
      "id": "calipers",
      "title": "Calipers",
      "summary": "Calipers give a quick measurement reference once the target edges are visible.",
      "bestMove": "Place them only after the image is stable and the margins are clear.",
      "pitfall": "Measuring before the border is well defined."
    },
    {
      "id": "freeze",
      "title": "Freeze",
      "summary": "Freeze locks the current frame so the learner can inspect, measure, or save it.",
      "bestMove": "Freeze once the image is framed correctly and you are ready to inspect details.",
      "pitfall": "Trying to keep adjusting controls while the image is frozen."
    },
    {
      "id": "save",
      "title": "Save",
      "summary": "Save captures the teaching frame after it is framed, checked, and optionally measured.",
      "bestMove": "Use it after you confirm the image is worth keeping.",
      "pitfall": "Saving a poor frame before verifying it."
    }
  ],
  "controlLabExercises": [
    {
      "id": "depth-rescue",
      "title": "Rescue 1: Bring the node into view",
      "symptom": "The target node is crowded against the top of the frame and the learner cannot see the tissue below it.",
      "instructions": "Increase depth until the node sits closer to the middle of the frame.",
      "focusControl": "depth",
      "start": {
        "depth": 28,
        "gain": 48,
        "contrast": 52
      },
      "target": {
        "depth": 68,
        "gain": 48,
        "contrast": 52
      },
      "successMessage": "Depth is now framing the target more cleanly. This is a better starting point for the rest of the scan."
    },
    {
      "id": "gain-rescue",
      "title": "Rescue 2: Lift the image out of the dark",
      "symptom": "The frame is undergained and the target border blends into the dark background.",
      "instructions": "Raise gain enough to reveal the target without turning the image chalky.",
      "focusControl": "gain",
      "start": {
        "depth": 60,
        "gain": 22,
        "contrast": 58
      },
      "target": {
        "depth": 60,
        "gain": 66,
        "contrast": 58
      },
      "successMessage": "Gain now reveals the border without flooding the screen with brightness."
    },
    {
      "id": "contrast-rescue",
      "title": "Rescue 3: Separate the border from the haze",
      "symptom": "The image is bright but flat, so the target edge is difficult to distinguish from the surrounding tissue.",
      "instructions": "Increase contrast and trim gain enough to recover edge definition.",
      "focusControl": "contrast",
      "start": {
        "depth": 58,
        "gain": 74,
        "contrast": 24
      },
      "target": {
        "depth": 58,
        "gain": 50,
        "contrast": 72
      },
      "successMessage": "Contrast is separating the target from the background again. The frame looks more readable."
    }
  ],
  "dopplerLab": {
    "title": "Color Doppler vessel check",
    "brief": "This is an educational approximation only. Turn Doppler on, then decide which path avoids the color-filled vessel.",
    "prompt": "Which puncture path is safest after Doppler reveals the vessel?",
    "safePathId": "posterior-lateral",
    "paths": [
      {
        "id": "anterior",
        "label": "Anterior path",
        "description": "Cuts across the vessel once Doppler is on."
      },
      {
        "id": "central",
        "label": "Central path",
        "description": "Passes straight through the brightest flow signal."
      },
      {
        "id": "posterior-lateral",
        "label": "Posterior-lateral path",
        "description": "Angles around the vessel instead of crossing it."
      }
    ]
  },
  "quickReferenceCards": [
    {
      "id": "depth",
      "title": "Depth",
      "whenToUse": "When the target is cut off or floating in too much empty space.",
      "whatChanges": "How much anatomy fits in the vertical field.",
      "noviceTrap": "Trying to fix a framing problem with gain."
    },
    {
      "id": "gain",
      "title": "Gain",
      "whenToUse": "When the whole image is too dark or too bright.",
      "whatChanges": "Overall image brightness.",
      "noviceTrap": "Overgaining until the target border disappears in haze."
    },
    {
      "id": "contrast",
      "title": "Contrast",
      "whenToUse": "After framing and brightness are close but borders are still muddy.",
      "whatChanges": "Separation between subtle gray tones.",
      "noviceTrap": "Ignoring contrast when the image looks bright but flat."
    },
    {
      "id": "color-doppler",
      "title": "Color Doppler",
      "whenToUse": "When a structure could be vascular and the learner needs flow confirmation.",
      "whatChanges": "Adds color flow information on top of the grayscale image.",
      "noviceTrap": "Turning Doppler on before basic framing is fixed."
    },
    {
      "id": "calipers",
      "title": "Calipers",
      "whenToUse": "After the target edge is clear and the frame is stable.",
      "whatChanges": "Adds a measurement overlay.",
      "noviceTrap": "Measuring a border that has not been optimized yet."
    },
    {
      "id": "freeze",
      "title": "Freeze",
      "whenToUse": "When the learner wants to inspect or measure a good frame.",
      "whatChanges": "Locks the current image.",
      "noviceTrap": "Trying to keep adjusting controls on a frozen frame."
    },
    {
      "id": "save",
      "title": "Save",
      "whenToUse": "Once the frame is worth keeping for teaching review.",
      "whatChanges": "Captures the current teaching frame.",
      "noviceTrap": "Saving before checking framing, Doppler, or measurement."
    }
  ],
  "quizQuestionIds": [
    "knobology-sequence-01",
    "knobology-cp-vs-rp-02",
    "knobology-artifact-03",
    "knobology-order-04",
    "knobology-necrosis-05",
    "knobology-doppler-06"
  ],
  "assetPlaceholders": [
    {
      "key": "knobology-frame-placeholder",
      "label": "Mock grayscale teaching frame",
      "note": "Current module uses rendered placeholder shapes, not a real ultrasound still."
    },
    {
      "key": "knobology-doppler-placeholder",
      "label": "Mock Doppler overlay",
      "note": "Current vessel signal is illustrative only and should be swapped with approved teaching art later."
    }
  ]
}

```

## File: `content/modules/mediastinal-anatomy.json`

```json
{
  "id": "mediastinal-anatomy",
  "title": "Mediastinal Anatomy and IASLC Stations",
  "summary": "A boundary-focused review of the core EBUS stations, emphasizing the IASLC rules that most often change staging and most often confuse learners.",
  "learningObjectives": [
    "Use the IASLC boundary rules rather than rough intuition when separating adjacent paratracheal, hilar, and interlobar stations.",
    "Explain why the left lateral tracheal border matters for 2 and 4 stations on both sides.",
    "Differentiate the 4-to-10 transition using the inferior azygos margin on the right and the superior left main pulmonary artery margin on the left.",
    "Recognize when 4L is medial to the ligamentum arteriosum and why stations 5 and 6 sit lateral or anterolateral to that relationship.",
    "Connect station identity to staging significance, access route, and clinical relevance."
  ],
  "sections": [
    {
      "id": "tracheal-border-rule",
      "title": "The left lateral tracheal border is the divider for 2 and 4",
      "kind": "landmarks",
      "body": "One of the most important IASLC changes is that the border between 2R and 2L, and again between 4R and 4L, follows the left lateral tracheal border rather than the tracheal midline. If the learner keeps using the midline, both laterality and stage can be mislabeled.",
      "bullets": [
        "2R and 4R can extend farther left than many beginners expect.",
        "The same rule applies at both upper and lower paratracheal levels.",
        "This boundary matters because contralateral mediastinal disease becomes N3."
      ],
      "imageIds": [
        "station:2R:ct",
        "station:2L:ct"
      ],
      "pearl": "When a node looks almost midline, ask where it sits relative to the left lateral tracheal wall rather than guessing by symmetry alone.",
      "pitfall": "The old mental model of the tracheal midline is one of the fastest ways to misstage paratracheal disease."
    },
    {
      "id": "four-vs-ten",
      "title": "The 4-to-10 handoff is vessel-based but still needs airway context",
      "kind": "landmarks",
      "body": "On the right, 4R ends at the lower border of the azygos vein and 10R begins below it. On the left, 4L ends at the upper rim of the left main pulmonary artery and 10L begins below it. Those landmarks are high-yield, but the airway context still matters because a single vessel snapshot can be misleading when orientation is poor.",
      "bullets": [
        "4R above inferior azygos margin; 10R below it.",
        "4L above the superior left main pulmonary artery margin; 10L below it.",
        "Station 7 lies between the medial margins of the main bronchi; outside that space is station 10."
      ],
      "imageIds": [
        "station:4R:ct",
        "station:10R:ct",
        "station:4L:ct",
        "station:10L:ct"
      ],
      "pearl": "If the image gives you the vessel but not the bronchial context, regain orientation before you assign the station.",
      "pitfall": "A single vascular landmark without airway context can downstage or upstage the case incorrectly."
    },
    {
      "id": "ap-window-rule",
      "title": "4L stays medial to the ligamentum arteriosum",
      "kind": "landmarks",
      "body": "4L remains medial to the ligamentum arteriosum; stations 5 and 6 are lateral or anterolateral in the aortopulmonary region. This matters because 4L belongs with the mediastinal paratracheal group, whereas 5 and 6 are aortopulmonary window stations and are not sampled through the same mindset.",
      "bullets": [
        "4L is a paratracheal station even when it feels close to the AP window.",
        "Station 5 is lateral to the ligamentum arteriosum.",
        "Station 6 lies anterior and lateral to the ascending aorta and aortic arch."
      ],
      "pearl": "On the left, think medial-paratracheal before you think lateral-AP-window.",
      "pitfall": "Calling a lateral AP-window target 4L can make the station sound more EBUS-friendly and more routine than it really is."
    },
    {
      "id": "access-and-staging",
      "title": "Access route and stage are part of station identity",
      "kind": "staging",
      "body": "A station label should immediately imply how you expect to approach it and what the result means for nodal stage. Right and left hilar/interlobar stations behave as N1 when ipsilateral, while paratracheal and other mediastinal stations are N2 when ipsilateral and N3 when contralateral. Station 7 is the important exception: it is midline and treated as ipsilateral mediastinal disease regardless of primary side.",
      "bullets": [
        "2 and 4 stations are mediastinal, so laterality can convert N2 to N3.",
        "10 and 11 stations are hilar/interlobar, so ipsilateral disease is usually N1.",
        "Station 7 is a staging anchor because it is midline and still N2 irrespective of side."
      ],
      "pearl": "Do not memorize station names separately from their staging consequences.",
      "pitfall": "Learners often know the number but not whether the finding changes the patient from N1 to N2 or N3."
    },
    {
      "id": "boundary-vignette",
      "title": "Case vignette: 4L or 10L?",
      "kind": "case",
      "body": "A left-sided primary tumor has an enlarged node adjacent to the left main bronchus. The learner sees the left pulmonary artery and immediately calls the node 10L.",
      "caseVignette": {
        "title": "Do not stop at the vessel name",
        "scenario": "The node is still proximal, medial, and above the upper rim of the left main pulmonary artery when the airway anatomy is reconstructed.",
        "prompt": "What is the safer teaching move before assigning the stage?",
        "takeaway": "Rebuild the airway-and-vessel relationship first. If the node is still above the upper rim of the left main pulmonary artery and remains paratracheal, it is 4L rather than 10L."
      }
    }
  ]
}

```

## File: `content/modules/modules.json`

```json
[
  {
    "id": "knobology",
    "slug": "knobology",
    "shortTitle": "Knobology",
    "title": "Ultrasound Foundations + EBUS Knobology",
    "summary": "Teach the core ultrasound controls with a fast, touch-friendly module and placeholder simulator entry points.",
    "overview": "This scaffold establishes the routes, content contract, and persistence hooks for the primer, control lab, Doppler mini-lab, quick-reference cards, quiz, and summary.",
    "estimatedMinutes": 20,
    "featureFolder": "features/knobology",
    "route": "/modules/knobology",
    "goals": [
      "Explain depth, gain, contrast, color Doppler, calipers, freeze, and save.",
      "Prepare the control lab shell for future fix-the-image exercises.",
      "Persist learner completion and quiz score locally."
    ],
    "plannedExperiences": [
      "Primer",
      "Control lab",
      "Doppler mini-lab",
      "Quick-reference cards",
      "Five-question quiz",
      "Completion summary"
    ],
    "assetPlaceholders": [
      {
        "key": "us-primer-hero",
        "label": "Primer hero frame",
        "folder": "assets/ultrasound",
        "note": "Replace with an app-owned de-identified teaching frame or illustration."
      },
      {
        "key": "us-control-lab-bad-image-01",
        "label": "Bad image preset 01",
        "folder": "assets/ultrasound",
        "note": "Reserve for future fix-the-image exercises."
      }
    ],
    "relatedStationIds": []
  },
  {
    "id": "station-map",
    "slug": "station-map",
    "shortTitle": "Station Map",
    "title": "Mediastinal Station Map",
    "summary": "Provide a clean module entry point for IASLC station recognition, map exploration, and quiz work.",
    "overview": "The scaffold shares a typed station schema with the explorer module and leaves stable asset keys for a future vector map implementation.",
    "estimatedMinutes": 18,
    "featureFolder": "features/stations",
    "route": "/modules/station-map",
    "goals": [
      "Support the core v1 stations in a structured local schema.",
      "Keep map drawing data and text content separable.",
      "Wire bookmarks and completion state into persisted learner progress."
    ],
    "plannedExperiences": [
      "Overview",
      "Zoomable tappable map",
      "Station detail sheet",
      "Flashcards",
      "Pin-the-station quiz",
      "Review summary"
    ],
    "assetPlaceholders": [
      {
        "key": "station-map-core-illustration",
        "label": "Core station map illustration",
        "folder": "assets/illustrations",
        "note": "Replace with an app-owned vector map. Existing external screenshots are intentionally not bundled."
      }
    ],
    "relatedStationIds": [
      "2R",
      "2L",
      "4R",
      "4L",
      "7",
      "10R",
      "10L",
      "11Rs",
      "11Ri",
      "11L"
    ]
  },
  {
    "id": "station-explorer",
    "slug": "station-explorer",
    "shortTitle": "Explorer",
    "title": "CT ↔ Bronchoscopic ↔ Ultrasound Station Explorer",
    "summary": "Set up synchronized placeholder views so the correlated tri-view experience can ship without changing the data model.",
    "overview": "This scaffold focuses on local structured station data, synchronized route-level state, and a future-ready asset contract for CT, bronchoscopy, and ultrasound views.",
    "estimatedMinutes": 22,
    "featureFolder": "features/explorer",
    "route": "/modules/station-explorer",
    "goals": [
      "Use the same station content schema as the station map module.",
      "Prepare synchronized CT, bronchoscopic, and ultrasound placeholder panels.",
      "Track last-viewed station and recognition accuracy locally."
    ],
    "plannedExperiences": [
      "Station selector",
      "Correlated tri-view explorer",
      "Landmark checklist",
      "Recognition challenge",
      "Review summary"
    ],
    "assetPlaceholders": [
      {
        "key": "explorer-ct-placeholder",
        "label": "CT placeholder panel",
        "folder": "assets/ct",
        "note": "Swap in approved de-identified teaching art later without UI changes."
      },
      {
        "key": "explorer-bronchoscopy-placeholder",
        "label": "Bronchoscopy placeholder panel",
        "folder": "assets/bronchoscopy",
        "note": "Reserve for future airway landmark assets."
      },
      {
        "key": "explorer-ultrasound-placeholder",
        "label": "Ultrasound placeholder panel",
        "folder": "assets/ultrasound",
        "note": "Reserve for future EBUS view assets."
      }
    ],
    "relatedStationIds": [
      "2R",
      "2L",
      "4R",
      "4L",
      "7",
      "10R",
      "10L",
      "11Rs",
      "11Ri",
      "11L"
    ]
  },
  {
    "id": "case-3d-explorer",
    "slug": "case-3d-explorer",
    "shortTitle": "3D Explorer",
    "title": "3D Anatomy + Slice Explorer",
    "summary": "Explore one curated EBUS case with linked station selection, derived CT slice jumps, and structure filters.",
    "overview": "This module enriches a local case manifest at build time from markup control points, CT geometry, GLB mesh names, and exported slice stacks so the learner can move between stations and landmarks without hardcoded frame indices.",
    "estimatedMinutes": 16,
    "category": "anatomy",
    "status": "available",
    "featureFolder": "features/case3d",
    "route": "/modules/case-3d-explorer",
    "goals": [
      "Link station and target selection to derived axial, coronal, and sagittal slice indices.",
      "Let the learner filter the case by lymph nodes, airway, vessels, cardiac, and GI structures.",
      "Persist resume state, visited targets, and lightweight review scoring locally."
    ],
    "plannedExperiences": [
      "Intro panel",
      "Station and target selector",
      "Derived 3D target navigator",
      "Single-plane slice viewer",
      "Teaching card",
      "Five-prompt review",
      "Summary"
    ],
    "assetPlaceholders": [
      {
        "key": "case-001-glb",
        "label": "Case 001 segmented GLB",
        "folder": "model",
        "note": "Bundled locally and verified against expected mesh names at build time."
      },
      {
        "key": "case-001-slices",
        "label": "Case 001 CT slice series",
        "folder": "model/sliceSeries",
        "note": "Frame indices are derived from the CT volume geometry and markup control points."
      }
    ],
    "relatedStationIds": [
      "1R",
      "1L",
      "2R",
      "2L",
      "3A",
      "4R",
      "4L",
      "5",
      "6",
      "7",
      "10R",
      "10L",
      "11L",
      "11Ri",
      "11Rs"
    ]
  }
]

```

## File: `content/modules/procedural-technique.json`

```json
{
  "id": "procedural-technique",
  "title": "Linear EBUS Procedural Technique",
  "summary": "A stepwise technique review focused on orientation, contact, safe needle handling, and the common reasons specimens become non-diagnostic.",
  "learningObjectives": [
    "Describe a reproducible sequence from neutral scope orientation to image optimization and safe needle deployment.",
    "Explain how balloon contact, vessel check, and airway landmarks interact before puncture.",
    "Use fanning and capsule-to-capsule sampling language correctly when teaching aspiration technique.",
    "Recognize common causes of low-yield or misleading passes."
  ],
  "sections": [
    {
      "id": "neutral-orientation",
      "title": "Start from neutral scope orientation",
      "kind": "technique",
      "body": "A calm neutral starting position helps the learner understand where the airway wall, ultrasound plane, and needle path live relative to one another. Once the station is localized, small controlled adjustments are safer than repeated large torque movements.",
      "bullets": [
        "Re-establish the airway landmark before you refine the ultrasound image.",
        "Use deliberate small movements after the target appears.",
        "Scope stability usually matters more than speed."
      ],
      "pearl": "If the learner becomes disoriented, reset to a known airway landmark rather than improvising from a bad frame.",
      "pitfall": "Chasing the image with repeated large motions often worsens contact and confuses station identity."
    },
    {
      "id": "balloon-contact",
      "title": "Balloon inflation and contact create the acoustic window",
      "kind": "technique",
      "body": "The balloon exists to improve apposition between the ultrasound probe and the airway wall. Good contact makes the subsequent image adjustments meaningful; poor contact forces the learner to compensate with gain and still leaves the frame unreliable.",
      "bullets": [
        "Inflate enough to improve contact without destabilizing orientation.",
        "Use the best contact point you can hold, not the most dramatic contact you can briefly create.",
        "A stable acoustic window should precede needle deployment."
      ],
      "pearl": "Contact is part of image optimization, not a separate preliminary chore.",
      "pitfall": "A temporarily striking image that cannot be maintained is a poor sampling platform."
    },
    {
      "id": "vessel-check-and-puncture",
      "title": "Identify the target, check vessels, then puncture",
      "kind": "technique",
      "body": "Before needle advancement, identify the target, confirm the station, and inspect the intended path with Doppler. Needle deployment should protect the scope, preserve the chosen angle, and favor the path that best balances control, safety, and access to viable tissue.",
      "bullets": [
        "Confirm target identity before opening the needle, not after.",
        "Check the tract with Doppler before each pass if the angle or target has changed.",
        "A safe path around a vessel is more important than the shortest geometric path."
      ],
      "checklist": [
        "Station confirmed",
        "Balloon contact stable",
        "Doppler path checked",
        "Needle/sheath position controlled",
        "Target inside the node chosen"
      ],
      "pearl": "The safest pass is the one you can repeat accurately if more tissue is needed.",
      "pitfall": "Do not let a compelling grayscale target erase the vessel-check step."
    },
    {
      "id": "fanning-capsule",
      "title": "Fanning and capsule-to-capsule sampling",
      "kind": "technique",
      "body": "Fanning means changing the needle angle during a pass so multiple areas of a node are sampled instead of repeatedly traversing the same tract. Capsule-to-capsule language reminds the learner to use the full viable breadth of the node when appropriate, especially when architecture is heterogeneous.",
      "bullets": [
        "Change angle within the node to broaden tissue capture.",
        "Sample more than one viable region if the node looks heterogeneous.",
        "Repeated passes through a single tract can feel productive while adding little new tissue."
      ],
      "pearl": "Fanning is especially valuable when one region looks necrotic, calcified, or otherwise low-yield.",
      "pitfall": "A pass count alone does not guarantee adequate sampling if every pass follows the same route."
    },
    {
      "id": "non-diagnostic-specimens",
      "title": "Common causes of non-diagnostic specimens",
      "kind": "pitfall",
      "body": "Low-yield procedures usually reflect a chain of small errors: poor contact, uncertain station identity, vessel avoidance that leaves only necrotic tissue, inadequate angle change, or premature confidence after one visually satisfying pass. The solution is usually a better target strategy rather than more force.",
      "bullets": [
        "Poor acoustic coupling can create false confidence in the chosen tract.",
        "Sampling necrotic or acellular regions lowers yield even when the pass itself is smooth.",
        "Failure to fan can produce repeated low-information samples."
      ],
      "pearl": "When the sample is low-yield, review image quality and target selection before escalating equipment.",
      "pitfall": "More passes into the same poor target often multiply trauma without multiplying useful tissue."
    }
  ]
}

```

## File: `content/modules/sonographic-interpretation.json`

```json
{
  "id": "sonographic-interpretation",
  "title": "Sonographic Interpretation of Lymph Nodes",
  "summary": "An interpretation layer for reading nodal ultrasound features without pretending that imaging alone replaces tissue.",
  "learningObjectives": [
    "Describe suspicious and reassuring nodal features using CHS, CNS, margin, shape, vascular pattern, and echogenicity terminology.",
    "Recognize that no single ultrasound feature determines malignancy and that tissue remains definitive.",
    "Use Doppler and elastography as adjuncts that refine target choice, not as stand-alone arbiters of benignity or malignancy.",
    "Separate descriptive language from diagnostic certainty when teaching junior learners."
  ],
  "sections": [
    {
      "id": "chs-cns",
      "title": "CHS and CNS are high-yield descriptors",
      "kind": "sonographic-pattern",
      "body": "A preserved central hilar structure is generally reassuring, whereas its absence raises concern. A coagulation necrosis sign is a hypoechoic avascular area within the node and, when present, increases suspicion for malignancy. These are useful features because they force the learner to inspect the internal architecture of the node rather than only the outer contour.",
      "bullets": [
        "Preserved CHS tends to favor benignity.",
        "Absent CHS is concerning but not diagnostic by itself.",
        "CNS should be checked with Doppler because a dark area without flow is more persuasive than grayscale alone."
      ],
      "pearl": "Describe CHS and CNS explicitly before summarizing overall suspicion.",
      "pitfall": "Do not call every central dark focus necrosis; poor contact and artifact can mimic it."
    },
    {
      "id": "margins-echogenicity",
      "title": "Margins, heterogeneity, and nodal conglomeration",
      "kind": "sonographic-pattern",
      "body": "Distinct margins, heterogeneous echotexture, and nodal conglomeration can all increase concern, especially when they appear together. The learner should still remember that inflammatory nodes can violate these rules and that a bland-appearing malignant node still exists in practice.",
      "bullets": [
        "Heterogeneous echogenicity is more suspicious than a uniformly homogeneous node.",
        "Distinct margins may increase concern in some series, but context matters.",
        "Conglomerated or matted nodes should prompt careful staging thinking, not just pattern recognition."
      ],
      "pearl": "Teach combinations of features rather than overvaluing any single sign.",
      "pitfall": "An apparently tidy oval node with preserved architecture can still require sampling if it would change management."
    },
    {
      "id": "vascular-patterns",
      "title": "Doppler adds pattern information",
      "kind": "sonographic-pattern",
      "body": "Doppler helps in two ways: it identifies vessels along the intended puncture path, and it contributes to interpretation by showing whether a suspicious-appearing area is vascular or avascular. Peripheral or chaotic vascularity may be worrisome, whereas a preserved central hilar vascular pattern is more reassuring, but Doppler findings still sit inside the larger clinical picture.",
      "bullets": [
        "Use Doppler before puncture for safety, not only interpretation.",
        "Avascular central dark areas deserve a necrosis check.",
        "Vascular pattern can change the target inside the same node."
      ],
      "pearl": "The best Doppler use often changes where you sample within the node, not only whether you sample it.",
      "pitfall": "A Doppler-negative image is not automatically benign and a Doppler-positive image is not automatically malignant."
    },
    {
      "id": "elastography",
      "title": "Elastography is an adjunct, not a substitute for tissue",
      "kind": "sonographic-pattern",
      "body": "Elastography can help prioritize which node or which region of a node looks most abnormal by highlighting relative tissue stiffness. It improves pattern recognition when combined with conventional ultrasound features, but it does not replace histopathology and should not overrule the staging logic.",
      "bullets": [
        "Blue-dominant or stiff regions can increase suspicion.",
        "Elastography performs best when interpreted alongside conventional grayscale and Doppler features.",
        "Sampling strategy should still follow the clinical staging question."
      ],
      "pearl": "Use elastography to refine target selection, not to talk yourself out of sampling a clinically decisive node.",
      "pitfall": "Presenting elastography as a near-pathology test teaches the wrong threshold for confidence."
    },
    {
      "id": "interpretation-vignette",
      "title": "Case vignette: reassuring feature, wrong conclusion",
      "kind": "case",
      "body": "A hilar node keeps an oval shape and some central echogenicity, so the learner wants to skip sampling and move on.",
      "caseVignette": {
        "title": "A reassuring image can still be the wrong management choice",
        "scenario": "The node is in the exact station that would separate N1 from N2 or N3 disease if another suspicious node is negative.",
        "prompt": "What matters more here: the partially reassuring appearance or the staging consequence?",
        "takeaway": "The staging consequence matters more. Sonographic features help prioritize suspicion, but they do not replace tissue when the answer changes management."
      }
    }
  ]
}

```

## File: `content/modules/staging-strategy.json`

```json
{
  "id": "staging-strategy",
  "title": "Staging and Sampling Strategy",
  "summary": "A practical framework for deciding which node to sample first, how laterality changes N-stage, and why false negatives still happen.",
  "learningObjectives": [
    "Connect station laterality and zone to the difference between N1, N2, and N3 disease.",
    "Explain why station 7 behaves differently from lateralized paratracheal and hilar stations.",
    "Choose a sampling order that answers the staging question rather than simply the easiest puncture question.",
    "Recognize the main reasons EBUS can be falsely negative even when technically successful."
  ],
  "sections": [
    {
      "id": "sample-order",
      "title": "Sample to answer the staging question",
      "kind": "staging",
      "body": "The highest-yield node to sample is not always the largest node or the easiest node. Sampling strategy should be organized around what changes management: proving or excluding contralateral mediastinal disease, clarifying whether disease is hilar versus mediastinal, and prioritizing the node that would most alter stage if positive.",
      "bullets": [
        "Ask which node would change the stage the most before you ask which node is easiest.",
        "A smaller but strategically located node can matter more than a dramatic hilar node.",
        "Station identity is part of specimen value."
      ],
      "pearl": "Make the staging question explicit before the first puncture so the rest of the procedure stays coherent.",
      "pitfall": "Starting with the most visually obvious node can consume time while leaving the decisive station unanswered."
    },
    {
      "id": "laterality",
      "title": "Laterality is not a footnote",
      "kind": "staging",
      "body": "Ipsilateral hilar and interlobar stations are usually N1, ipsilateral mediastinal stations are N2, and contralateral mediastinal or hilar disease becomes N3. The exception that learners must internalize is station 7: it is a midline station and is considered ipsilateral mediastinal disease irrespective of the side of the primary tumor.",
      "bullets": [
        "2 and 4 stations: ipsilateral N2, contralateral N3.",
        "10 and 11 stations: ipsilateral N1, contralateral N3.",
        "7 remains N2 regardless of tumor side."
      ],
      "pearl": "A laterality mistake can be a staging mistake even when the image interpretation itself is correct.",
      "pitfall": "Do not import the laterality logic of 2, 4, 10, or 11 into station 7."
    },
    {
      "id": "false-negatives",
      "title": "Why false negatives happen",
      "kind": "pitfall",
      "body": "False negatives follow biology as much as technique. Small-volume disease, heterogeneous nodes, sampling of necrotic or nonrepresentative areas, and incorrect station assignment all contribute. A negative EBUS result is strongest when the right stations were targeted for the right staging question and sampled well.",
      "bullets": [
        "Wrong station equals wrong answer even if cytology is technically adequate.",
        "Necrotic or avascular centers may not represent viable tumor burden.",
        "Heterogeneous nodes demand thoughtful target selection inside the node."
      ],
      "pearl": "A negative result has value only in the context of the stations you intentionally excluded or included.",
      "pitfall": "Calling the procedure negative without revisiting whether the decisive station was actually sampled can create false reassurance."
    },
    {
      "id": "staging-vignette",
      "title": "Case vignette: big hilar node, small contralateral node",
      "kind": "case",
      "body": "A right lung primary has a large 10R node and a smaller left paratracheal node just across the left lateral tracheal border.",
      "caseVignette": {
        "title": "The small node may matter more",
        "scenario": "The 10R node is easier to reach and more visually impressive, but the left paratracheal node would change the disease to contralateral mediastinal involvement if malignant.",
        "prompt": "Which station deserves explicit staging attention first in teaching discussion?",
        "takeaway": "The contralateral paratracheal node deserves priority in the staging discussion because it can establish N3 disease, whereas 10R alone would still be ipsilateral hilar involvement."
      }
    }
  ]
}

```

## File: `content/modules/station-explorer.json`

```json
{
  "introSections": [
    {
      "id": "triangulate",
      "title": "Triangulate one station across three views",
      "summary": "Keep the same station selected while you compare how it presents on CT, in the airway, and on the ultrasound screen. The goal is to translate one station identity across three representations without losing the staging implications.",
      "takeaway": "One mental target, three representations, one staging consequence."
    },
    {
      "id": "selector",
      "title": "Use the selector as your anchor",
      "summary": "Switch stations quickly, then read the same laterality, boundary cue, and memory cue across the tri-view cards and checklist.",
      "takeaway": "If orientation slips, reset with the selected station chip, its confusion pair, and its boundary rule."
    },
    {
      "id": "challenge",
      "title": "Test recognition by representation",
      "summary": "The challenge rotates CT, bronchoscopy, and ultrasound prompts so recall is not tied to just one view. The feedback should teach why the answer is correct, not just whether the learner clicked correctly.",
      "takeaway": "Immediate explanation plus local accuracy tracking shows which stations still blur together."
    }
  ],
  "reviewPrompts": [
    "Can you move from CT to airway to ultrasound without changing the target station or its staging meaning?",
    "Which confusion pair still slows you down when the representation changes?",
    "Can you name one airway landmark and one ultrasound cue for each hilar or interlobar station?"
  ],
  "extensionNote": "Future approved CT, bronchoscopy, and ultrasound assets can replace the placeholders by swapping the asset keys referenced from the shared station schema while keeping the explorer copy, checklist content, and challenge items intact."
}

```

## File: `content/modules/station-map.json`

```json
{
  "introSections": [
    {
      "id": "stack-patterns",
      "title": "Read the map as boundary-driven stacks",
      "summary": "The right and left paratracheal stations are easiest to memorize as superior-to-inferior stacks: 2R over 4R and 2L over 4L. The key divider is the left lateral tracheal border, not the tracheal midline.",
      "takeaway": "Start with laterality, apply the tracheal-border rule, then move top to bottom before branching outward."
    },
    {
      "id": "carina-anchor",
      "title": "Use the carina as the center anchor",
      "summary": "Station 7 sits below the carina and between the medial margins of the main bronchi. It is the center anchor for distinguishing subcarinal disease from hilar disease.",
      "takeaway": "If you lose orientation, find station 7 and then ask whether the node is still between the medial main bronchial margins."
    },
    {
      "id": "hilar-handoff",
      "title": "Treat hilar stations as a vessel-and-branch handoff",
      "summary": "10R and 10L mark the hilar checkpoints, while 11Rs, 11Ri, and 11L extend farther into the branch-level interlobar pathway.",
      "takeaway": "Think main bronchus first, then branch-level interlobar landmarks."
    }
  ],
  "mapTips": [
    "Tap any station to open the detail sheet.",
    "Use the detail card to review the exact boundary rule before you memorize the number.",
    "Use the zoom buttons if labels feel crowded on a smaller phone.",
    "Selection uses border weight, iconography, and helper text so the state is not color-only."
  ],
  "flashcardPrompt": "Use the cards to rehearse name, grouping, and memory cues before moving into the quiz.",
  "quizRounds": [
    {
      "id": "q-2r",
      "stationId": "2R",
      "prompt": "Pin the upper right paratracheal station above the 4R stack.",
      "hint": "Stay high on the right side of the tracheal column.",
      "explanation": "2R is the superior right paratracheal station. It remains right of the left lateral tracheal border and above 4R."
    },
    {
      "id": "q-4l",
      "stationId": "4L",
      "prompt": "Tap the lower left paratracheal station that remains above the left hilar handoff.",
      "hint": "Look left of the trachea and stay above the superior rim of the left main pulmonary artery.",
      "explanation": "4L is the left lower paratracheal station. It stays above 10L and remains medial to the ligamentum arteriosum."
    },
    {
      "id": "q-7",
      "stationId": "7",
      "prompt": "Select the subcarinal station centered below the carina.",
      "hint": "Find the midline anchor between the right and left hilar pathways.",
      "explanation": "Station 7 lies beneath the carina and between the medial margins of the main bronchi. It is a midline mediastinal station."
    },
    {
      "id": "q-10r",
      "stationId": "10R",
      "prompt": "Pin the right hilar checkpoint near the right main bronchus entry zone.",
      "hint": "It sits distal to 4R and proximal to the 11R substations.",
      "explanation": "10R begins below the inferior azygos margin. It is hilar, not paratracheal, and still more proximal than 11Rs or 11Ri."
    },
    {
      "id": "q-11rs",
      "stationId": "11Rs",
      "prompt": "Tap the superior right interlobar station beyond the right hilar gate.",
      "hint": "Think branch-level anatomy between the right upper lobe bronchus and bronchus intermedius.",
      "explanation": "11Rs is the superior right interlobar branch-level target. It is farther distal than 10R and distinct from 11Ri."
    },
    {
      "id": "q-11L",
      "stationId": "11L",
      "prompt": "Tap the left interlobar station beyond the left hilar gate.",
      "hint": "Think branch-level left hilar pathway, not paratracheal.",
      "explanation": "11L is the left interlobar station beyond the 10L checkpoint. The cue is distal branch-level airway anatomy."
    }
  ],
  "reviewChecklist": [
    "Can you separate the right and left paratracheal stacks using the left lateral tracheal border rather than the tracheal midline?",
    "Can you use station 7 as the centerline reset point and keep it between the medial margins of the main bronchi?",
    "Can you distinguish 10R and 10L from the more distal interlobar stations 11Rs, 11Ri, and 11L?"
  ],
  "extensionNote": "Add more stations by extending the shared station content file and this layout file with new coordinates. The UI reads station definitions, quiz prompts, and drawing data separately, so the module does not need component rewrites when the station set grows."
}

```

## File: `content/quizzes/knobology-advanced.json`

```json
[
  {
    "id": "knobology-sequence-01",
    "moduleId": "knobology",
    "prompt": "A lymph node is partly cut off at the top of the image. Which control should be addressed first?",
    "type": "single-best-answer",
    "options": [
      {
        "id": "depth",
        "label": "Increase depth so the target is fully framed",
        "rationale": "Correct. Framing comes before fine brightness or measurement decisions."
      },
      {
        "id": "gain",
        "label": "Increase gain so the clipped node looks brighter",
        "rationale": "Incorrect. Brightness cannot fix anatomy that is not fully in the field."
      },
      {
        "id": "freeze",
        "label": "Freeze the frame to inspect the border",
        "rationale": "Incorrect. Freezing too early only preserves a poorly framed image."
      },
      {
        "id": "calipers",
        "label": "Place calipers before changing the view",
        "rationale": "Incorrect. Measurement is unreliable when the target is not even fully visualized."
      }
    ],
    "correctOptionIds": [
      "depth"
    ],
    "explanation": "EBUS image rescue begins with framing. Once the target is entirely visible, gain and contrast changes become much more meaningful.",
    "difficulty": "basic",
    "tags": [
      "knobology",
      "depth",
      "control-sequence"
    ]
  },
  {
    "id": "knobology-cp-vs-rp-02",
    "moduleId": "knobology",
    "prompt": "Which statement best captures the practical tradeoff between RP-EBUS and CP-EBUS?",
    "type": "single-best-answer",
    "options": [
      {
        "id": "a",
        "label": "RP-EBUS usually favors higher-resolution peripheral localization, while CP-EBUS provides deeper imaging and real-time needle guidance",
        "rationale": "Correct. That is the clinically useful way to remember the resolution-versus-penetration and guidance tradeoff."
      },
      {
        "id": "b",
        "label": "CP-EBUS always gives both better penetration and better resolution than RP-EBUS",
        "rationale": "Incorrect. The modalities make different tradeoffs rather than one being universally superior."
      },
      {
        "id": "c",
        "label": "RP-EBUS is mainly preferred because it has Doppler and can guide transbronchial needle aspiration in real time",
        "rationale": "Incorrect. Doppler and real-time TBNA are key strengths of CP-EBUS, not RP-EBUS."
      },
      {
        "id": "d",
        "label": "The two systems differ only in screen layout and not in ultrasound behavior",
        "rationale": "Incorrect. Their frequency, geometry, penetration, and procedural roles differ substantially."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "A useful teaching shorthand is that RP-EBUS is a higher-resolution localization tool for peripheral work, while CP-EBUS gives deeper imaging, Doppler, and real-time sampling for mediastinal and hilar targets.",
    "difficulty": "intermediate",
    "tags": [
      "knobology",
      "ultrasound-physics",
      "cp-ebus",
      "rp-ebus"
    ]
  },
  {
    "id": "knobology-artifact-03",
    "moduleId": "knobology",
    "prompt": "Select the findings that should push the learner toward artifact rather than true anatomy.",
    "type": "multi-select",
    "options": [
      {
        "id": "a",
        "label": "A bright interface produces repeated equally spaced echoes that move with the reflector",
        "rationale": "Correct. That pattern fits reverberation rather than a true layered structure."
      },
      {
        "id": "b",
        "label": "A dark region disappears after the probe contact improves and the angle changes",
        "rationale": "Correct. A finding that vanishes with coupling and angle change should raise artifact suspicion."
      },
      {
        "id": "c",
        "label": "A vascular structure lights up on Doppler exactly where grayscale suggested a vessel",
        "rationale": "Incorrect. That makes a real vessel more likely, not an artifact."
      },
      {
        "id": "d",
        "label": "A suspected border remains stable despite contact changes and is supported across multiple views",
        "rationale": "Incorrect. Stability across views argues more for true anatomy than for artifact."
      }
    ],
    "correctOptionIds": [
      "a",
      "b"
    ],
    "explanation": "Artifacts often behave like reflections: they track with an interface, change with angle, and disappear when coupling improves. True anatomy is usually more stable across small technique adjustments.",
    "difficulty": "intermediate",
    "tags": [
      "knobology",
      "artifact",
      "image-interpretation"
    ]
  },
  {
    "id": "knobology-order-04",
    "moduleId": "knobology",
    "prompt": "Put the workflow in the most defensible order for a target that may need sampling.",
    "type": "ordering",
    "options": [
      {
        "id": "frame",
        "label": "Set depth and framing",
        "rationale": "This belongs first because you need the target and surrounding anatomy in view."
      },
      {
        "id": "brightness",
        "label": "Tune gain and contrast",
        "rationale": "This comes after framing because edge quality is easier to judge once the image geometry makes sense."
      },
      {
        "id": "doppler",
        "label": "Check the intended tract with Doppler",
        "rationale": "This precedes puncture and measurement because it is a safety step."
      },
      {
        "id": "freeze",
        "label": "Freeze and measure only if useful",
        "rationale": "This should happen after the image is trustworthy and after the vessel check."
      }
    ],
    "correctOptionIds": [
      "frame",
      "brightness",
      "doppler",
      "freeze"
    ],
    "explanation": "A reproducible sequence reduces random button-pushing: frame first, optimize the grayscale image second, perform Doppler safety review third, and freeze or measure only when the image is truly worth preserving.",
    "difficulty": "basic",
    "tags": [
      "knobology",
      "ordering",
      "safe-sampling"
    ]
  },
  {
    "id": "knobology-necrosis-05",
    "moduleId": "knobology",
    "prompt": "A large node has a dark avascular center and a more solid peripheral rim. After Doppler confirms a vessel-free tract, what is the best next teaching move?",
    "type": "case-vignette",
    "caseTitle": "Bright image, low-yield center",
    "caseSummary": "The easiest line crosses no flow but points directly into the darkest part of the node.",
    "options": [
      {
        "id": "a",
        "label": "Aim for the viable solid rim and fan through more than one representative area",
        "rationale": "Correct. A conspicuous necrotic center may be low-yield; viable tissue is a better target."
      },
      {
        "id": "b",
        "label": "Sample the center repeatedly because it is easiest to visualize",
        "rationale": "Incorrect. Ease of visualization does not make an avascular necrotic center the best target."
      },
      {
        "id": "c",
        "label": "Ignore the grayscale target because Doppler is negative",
        "rationale": "Incorrect. Doppler helps with safety, but grayscale still guides what part of the node is worth sampling."
      },
      {
        "id": "d",
        "label": "Increase gain until the dark center looks more solid before puncturing",
        "rationale": "Incorrect. Artificially brightening the frame does not convert necrotic tissue into a higher-yield target."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "Doppler helps exclude vessels, but target selection inside the node still matters. When a node is heterogeneous, sample viable tissue and use fanning rather than repeatedly traversing an obvious necrotic cavity.",
    "difficulty": "advanced",
    "tags": [
      "knobology",
      "case",
      "doppler",
      "necrosis",
      "target-selection"
    ]
  },
  {
    "id": "knobology-doppler-06",
    "moduleId": "knobology",
    "prompt": "What is the best reason to turn Doppler on before an EBUS-TBNA pass?",
    "type": "single-best-answer",
    "options": [
      {
        "id": "a",
        "label": "To identify flow in adjacent vessels and refine a safe puncture path",
        "rationale": "Correct. That is the highest-yield practical use before sampling."
      },
      {
        "id": "b",
        "label": "To replace grayscale interpretation of the node architecture",
        "rationale": "Incorrect. Doppler complements grayscale; it does not replace it."
      },
      {
        "id": "c",
        "label": "To improve the node border the same way contrast does",
        "rationale": "Incorrect. Doppler provides flow information, not grayscale edge separation."
      },
      {
        "id": "d",
        "label": "To determine the final diagnosis without tissue",
        "rationale": "Incorrect. Doppler can refine suspicion and safety, but tissue remains definitive."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "Doppler is mainly a safety and target-selection tool in this context. It helps confirm whether the intended tract crosses vascular structures and whether a suspicious area is avascular or vascular.",
    "difficulty": "basic",
    "tags": [
      "knobology",
      "doppler",
      "safety"
    ]
  }
]

```

## File: `content/quizzes/mediastinal-anatomy.json`

```json
[
  {
    "id": "mediastinum-boundary-01",
    "moduleId": "station-map",
    "prompt": "Which landmark divides 2R from 2L and also 4R from 4L in the IASLC map?",
    "type": "single-best-answer",
    "options": [
      {
        "id": "a",
        "label": "The tracheal midline",
        "rationale": "Incorrect. Using the tracheal midline is the old shortcut that mislabels laterality."
      },
      {
        "id": "b",
        "label": "The left lateral border of the trachea",
        "rationale": "Correct. IASLC uses the left lateral tracheal border for both the 2 and 4 station pairs."
      },
      {
        "id": "c",
        "label": "The carina",
        "rationale": "Incorrect. The carina anchors station 7 but does not divide the right and left paratracheal pairs."
      },
      {
        "id": "d",
        "label": "The pleural reflection",
        "rationale": "Incorrect. Pleural reflection is not the key divider for these station pairs."
      }
    ],
    "correctOptionIds": [
      "b"
    ],
    "explanation": "The left lateral tracheal border is the critical divider for 2R versus 2L and 4R versus 4L. That rule matters because a laterality error can become a staging error.",
    "difficulty": "basic",
    "tags": [
      "station-map",
      "boundaries",
      "2R",
      "2L",
      "4R",
      "4L"
    ]
  },
  {
    "id": "mediastinum-4r-10r-02",
    "moduleId": "station-map",
    "prompt": "Which boundary best separates 4R from 10R?",
    "type": "single-best-answer",
    "options": [
      {
        "id": "a",
        "label": "The inferior margin of the azygos vein",
        "rationale": "Correct. 4R is above the lower rim of the azygos vein and 10R is below it."
      },
      {
        "id": "b",
        "label": "The superior border of the aortic arch",
        "rationale": "Incorrect. That landmark is more relevant to the superior left mediastinal stations."
      },
      {
        "id": "c",
        "label": "The left lateral tracheal border",
        "rationale": "Incorrect. That divides right from left paratracheal stations, not 4R from 10R."
      },
      {
        "id": "d",
        "label": "The lower border of bronchus intermedius",
        "rationale": "Incorrect. That is related to the inferior extent of station 7 rather than the 4R-to-10R handoff."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "On the right, the lower rim of the azygos vein is the key 4R versus 10R divider. The left side uses the upper rim of the left main pulmonary artery for the analogous 4L versus 10L distinction.",
    "difficulty": "intermediate",
    "tags": [
      "station-map",
      "4R",
      "10R",
      "boundaries"
    ]
  },
  {
    "id": "mediastinum-station7-03",
    "moduleId": "station-map",
    "prompt": "A left lung primary has malignant involvement of station 7. What is the most accurate staging teaching point?",
    "type": "case-vignette",
    "caseTitle": "Midline station, not a laterality trap",
    "caseSummary": "The learner worries that a midline subcarinal node might count as contralateral disease.",
    "options": [
      {
        "id": "a",
        "label": "Station 7 is considered ipsilateral mediastinal disease (N2) irrespective of primary side",
        "rationale": "Correct. Station 7 is a midline mediastinal station and remains N2 regardless of tumor laterality."
      },
      {
        "id": "b",
        "label": "Station 7 becomes N3 whenever the primary is on the opposite side of the mediastinum",
        "rationale": "Incorrect. That laterality logic applies to lateralized mediastinal stations, not station 7."
      },
      {
        "id": "c",
        "label": "Station 7 is hilar, so ipsilateral disease is N1",
        "rationale": "Incorrect. Station 7 is subcarinal mediastinal disease, not hilar disease."
      },
      {
        "id": "d",
        "label": "Station 7 has no staging significance because it is midline",
        "rationale": "Incorrect. It is one of the most important mediastinal staging stations."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "Station 7 is the important exception to laterality-based shortcuts. It is midline and is treated as ipsilateral mediastinal disease regardless of which lung contains the primary tumor.",
    "difficulty": "intermediate",
    "tags": [
      "station-map",
      "station-7",
      "staging"
    ]
  },
  {
    "id": "mediastinum-left-handoff-04",
    "moduleId": "station-map",
    "prompt": "Select the features that support calling a left-sided node 10L rather than 4L.",
    "type": "multi-select",
    "options": [
      {
        "id": "a",
        "label": "The node lies below the upper rim of the left main pulmonary artery",
        "rationale": "Correct. That supports 10L rather than 4L."
      },
      {
        "id": "b",
        "label": "The node behaves like a hilar target adjacent to the left main bronchus rather than a paratracheal one",
        "rationale": "Correct. Hilar relationship supports 10L."
      },
      {
        "id": "c",
        "label": "The node is clearly above the left main pulmonary artery margin and still paratracheal",
        "rationale": "Incorrect. That description supports 4L, not 10L."
      },
      {
        "id": "d",
        "label": "The node is medial to the ligamentum arteriosum in the paratracheal region",
        "rationale": "Incorrect. That again sounds more like 4L than 10L."
      }
    ],
    "correctOptionIds": [
      "a",
      "b"
    ],
    "explanation": "The left hilar handoff combines a vessel rule and a regional rule. 10L begins below the upper rim of the left main pulmonary artery and behaves like a hilar station rather than a paratracheal one.",
    "difficulty": "advanced",
    "tags": [
      "station-map",
      "4L",
      "10L",
      "boundaries"
    ]
  },
  {
    "id": "mediastinum-right-stack-05",
    "moduleId": "station-map",
    "prompt": "Order these right-sided stations from most superior to most distal along the central airway pathway.",
    "type": "ordering",
    "options": [
      {
        "id": "2R",
        "label": "2R",
        "rationale": "This is the superior right paratracheal station."
      },
      {
        "id": "4R",
        "label": "4R",
        "rationale": "This sits below 2R and above the right hilar handoff."
      },
      {
        "id": "10R",
        "label": "10R",
        "rationale": "This is the right hilar checkpoint below 4R."
      },
      {
        "id": "11Rs",
        "label": "11Rs",
        "rationale": "This is more distal in the interlobar/right upper lobe takeoff region."
      }
    ],
    "correctOptionIds": [
      "2R",
      "4R",
      "10R",
      "11Rs"
    ],
    "explanation": "The right-side learning stack is 2R above 4R, then 10R at the hilar handoff, then 11R substation targets farther along the branching pathway.",
    "difficulty": "basic",
    "tags": [
      "station-map",
      "ordering",
      "2R",
      "4R",
      "10R",
      "11Rs"
    ]
  }
]

```

## File: `content/quizzes/procedural-technique.json`

```json
[
  {
    "id": "technique-order-01",
    "moduleId": "station-explorer",
    "prompt": "Order the procedural steps in the most defensible teaching sequence.",
    "type": "ordering",
    "options": [
      {
        "id": "orientation",
        "label": "Re-establish airway landmark and neutral orientation",
        "rationale": "This is the safest starting point because it restores spatial context."
      },
      {
        "id": "contact",
        "label": "Optimize balloon contact and image coupling",
        "rationale": "This should occur before detailed image interpretation or needle deployment."
      },
      {
        "id": "optimize",
        "label": "Set depth, gain, and contrast to define the target",
        "rationale": "Image optimization matters after contact creates a real acoustic window."
      },
      {
        "id": "doppler",
        "label": "Check the intended puncture path with Doppler",
        "rationale": "This is the safety review immediately before the pass."
      },
      {
        "id": "puncture",
        "label": "Deploy the needle and sample with controlled fanning",
        "rationale": "This is the final step once the tract and target are confirmed."
      }
    ],
    "correctOptionIds": [
      "orientation",
      "contact",
      "optimize",
      "doppler",
      "puncture"
    ],
    "explanation": "A reliable sequence begins with spatial orientation, then coupling, then grayscale optimization, then Doppler safety review, and only then needle deployment with controlled sampling.",
    "difficulty": "basic",
    "tags": [
      "station-explorer",
      "procedural-technique",
      "ordering"
    ]
  },
  {
    "id": "technique-target-02",
    "moduleId": "station-explorer",
    "prompt": "A heterogeneous node has a necrotic-appearing avascular center and a solid viable-looking rim. Which target strategy is best?",
    "type": "single-best-answer",
    "options": [
      {
        "id": "a",
        "label": "Prioritize the solid viable rim and fan through representative areas",
        "rationale": "Correct. This strategy is more likely to capture viable diagnostic tissue."
      },
      {
        "id": "b",
        "label": "Aim repeatedly at the center because it is easiest to keep in view",
        "rationale": "Incorrect. The easiest visual target may be the lowest-yield biologic target."
      },
      {
        "id": "c",
        "label": "Ignore the grayscale architecture if the tract is Doppler-negative",
        "rationale": "Incorrect. Doppler helps with safety, but target selection within the node still matters."
      },
      {
        "id": "d",
        "label": "Sample only the capsule without traversing meaningful tissue",
        "rationale": "Incorrect. Capsule-only passes do not fulfill the point of capsule-to-capsule sampling."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "The highest-yield pass is not always the easiest path. In a heterogeneous node, viable tissue selection and angle variation matter as much as safe tract planning.",
    "difficulty": "intermediate",
    "tags": [
      "station-explorer",
      "procedural-technique",
      "target-selection"
    ]
  },
  {
    "id": "technique-low-yield-03",
    "moduleId": "station-explorer",
    "prompt": "Select the factors that commonly contribute to non-diagnostic EBUS-TBNA specimens.",
    "type": "multi-select",
    "options": [
      {
        "id": "a",
        "label": "Poor probe contact that creates a misleading image",
        "rationale": "Correct. Bad coupling can make both interpretation and targeting unreliable."
      },
      {
        "id": "b",
        "label": "Repeated passes through the same narrow tract without fanning",
        "rationale": "Correct. That limits tissue diversity and can repeat a low-yield path."
      },
      {
        "id": "c",
        "label": "Sampling a necrotic central cavity instead of viable tissue",
        "rationale": "Correct. Necrotic regions often reduce diagnostic yield."
      },
      {
        "id": "d",
        "label": "Performing a Doppler vessel check before puncture",
        "rationale": "Incorrect. Doppler review is part of safe technique, not a cause of low yield."
      }
    ],
    "correctOptionIds": [
      "a",
      "b",
      "c"
    ],
    "explanation": "Low yield often starts before the needle enters the node. Poor contact, poor target choice, and repetitive sampling of the same path are more common causes than inadequate force or speed.",
    "difficulty": "intermediate",
    "tags": [
      "station-explorer",
      "procedural-technique",
      "pitfalls"
    ]
  },
  {
    "id": "technique-fanning-04",
    "moduleId": "station-explorer",
    "prompt": "Which statement best describes fanning and capsule-to-capsule sampling?",
    "type": "case-vignette",
    "caseTitle": "One tract feels busy, but does not broaden the sample",
    "caseSummary": "A learner performs multiple vigorous strokes through the same line and assumes that this automatically equals adequate sampling.",
    "options": [
      {
        "id": "a",
        "label": "Fanning means changing angle to sample different viable regions, and capsule-to-capsule language emphasizes using the breadth of the node rather than a single tunnel",
        "rationale": "Correct. That is the key educational concept."
      },
      {
        "id": "b",
        "label": "Fanning means increasing gain during the pass so more of the node appears bright",
        "rationale": "Incorrect. Fanning is a needle path concept, not a processor control."
      },
      {
        "id": "c",
        "label": "Capsule-to-capsule sampling means puncturing only the outermost shell of the node",
        "rationale": "Incorrect. The phrase refers to traversing across the representative tissue breadth, not skimming only the edge."
      },
      {
        "id": "d",
        "label": "If the first pass is smooth, fanning adds no educational value",
        "rationale": "Incorrect. Smooth mechanics do not guarantee broad or representative tissue capture."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "Fanning broadens tissue capture. Capsule-to-capsule language reminds the learner to use the node's viable breadth rather than repeatedly drilling the same tunnel.",
    "difficulty": "advanced",
    "tags": [
      "station-explorer",
      "procedural-technique",
      "fanning",
      "capsule-to-capsule"
    ]
  }
]

```

## File: `content/quizzes/sonographic-interpretation.json`

```json
[
  {
    "id": "sono-chs-01",
    "moduleId": "station-explorer",
    "prompt": "Which statement about the central hilar structure (CHS) is most accurate?",
    "type": "single-best-answer",
    "options": [
      {
        "id": "a",
        "label": "A preserved CHS tends to be a reassuring feature, although it does not rule out malignancy by itself",
        "rationale": "Correct. CHS is a useful reassuring sign, but tissue still decides the diagnosis."
      },
      {
        "id": "b",
        "label": "A preserved CHS proves the node is benign and does not require sampling",
        "rationale": "Incorrect. No single sonographic sign replaces the staging question or the need for tissue."
      },
      {
        "id": "c",
        "label": "CHS is mainly a Doppler artifact and is not useful in interpretation",
        "rationale": "Incorrect. CHS is a meaningful grayscale descriptor."
      },
      {
        "id": "d",
        "label": "CHS should only be assessed after elastography",
        "rationale": "Incorrect. CHS is part of conventional grayscale assessment."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "Preserved CHS tends to favor benignity, but it should never be used as a stand-alone reason to ignore a node that would change management if positive.",
    "difficulty": "basic",
    "tags": [
      "station-explorer",
      "sonographic-interpretation",
      "CHS"
    ]
  },
  {
    "id": "sono-suspicion-02",
    "moduleId": "station-explorer",
    "prompt": "Select the sonographic features that generally increase concern for malignancy when they appear together.",
    "type": "multi-select",
    "options": [
      {
        "id": "a",
        "label": "Heterogeneous echogenicity",
        "rationale": "Correct. Heterogeneity often increases concern."
      },
      {
        "id": "b",
        "label": "Avascular central necrotic-appearing region (CNS)",
        "rationale": "Correct. CNS is a concerning feature, especially when Doppler supports avascularity."
      },
      {
        "id": "c",
        "label": "Preserved central hilar structure",
        "rationale": "Incorrect. Preserved CHS is relatively reassuring rather than suspicious."
      },
      {
        "id": "d",
        "label": "Peripheral or chaotic vascular pattern",
        "rationale": "Correct. Abnormal vascular pattern can add concern."
      }
    ],
    "correctOptionIds": [
      "a",
      "b",
      "d"
    ],
    "explanation": "Suspicion usually comes from the pattern combination rather than one sign alone. Heterogeneity, CNS, and abnormal vascularity together are more concerning than any single feature in isolation.",
    "difficulty": "intermediate",
    "tags": [
      "station-explorer",
      "sonographic-interpretation",
      "CNS",
      "vascular-pattern"
    ]
  },
  {
    "id": "sono-elastography-03",
    "moduleId": "station-explorer",
    "prompt": "How should elastography be taught in relation to EBUS nodal staging?",
    "type": "case-vignette",
    "caseTitle": "Helpful color map, wrong conclusion",
    "caseSummary": "A learner wants to skip biopsy because the elastography pattern appears reassuring.",
    "options": [
      {
        "id": "a",
        "label": "As an adjunct that may help prioritize targets, but not as a substitute for tissue",
        "rationale": "Correct. Elastography refines suspicion and target choice; it does not replace pathology."
      },
      {
        "id": "b",
        "label": "As the most reliable single test for deciding whether a node is malignant",
        "rationale": "Incorrect. Elastography performs best when combined with conventional EBUS features, not as a stand-alone verdict."
      },
      {
        "id": "c",
        "label": "As a reason to ignore the staging consequence of the node",
        "rationale": "Incorrect. The staging consequence still determines whether tissue is required."
      },
      {
        "id": "d",
        "label": "As a replacement for Doppler in planning the puncture path",
        "rationale": "Incorrect. Elastography does not replace Doppler safety review."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "Elastography is best taught as an adjunct. It may help decide which node or which part of a node looks most suspicious, but tissue remains definitive and Doppler remains necessary for safety.",
    "difficulty": "basic",
    "tags": [
      "station-explorer",
      "sonographic-interpretation",
      "elastography"
    ]
  },
  {
    "id": "sono-cns-04",
    "moduleId": "station-explorer",
    "prompt": "A node contains a dark central region with no Doppler flow and irregular surrounding echotexture. Which interpretation is most defensible?",
    "type": "image-interpretation",
    "options": [
      {
        "id": "a",
        "label": "The finding is compatible with a coagulation necrosis sign and raises suspicion, but still does not replace tissue",
        "rationale": "Correct. This combines descriptive accuracy with the right level of diagnostic humility."
      },
      {
        "id": "b",
        "label": "The node must be benign because flow is absent centrally",
        "rationale": "Incorrect. Avascular central dark areas can increase suspicion rather than reassure."
      },
      {
        "id": "c",
        "label": "The image proves the lesion is malignant, so biopsy is unnecessary",
        "rationale": "Incorrect. Even highly suspicious imaging does not eliminate the role of tissue."
      },
      {
        "id": "d",
        "label": "The finding is meaningless unless the node is larger than 2 cm",
        "rationale": "Incorrect. Internal architecture matters at multiple node sizes."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "The appropriate teaching move is to name the sonographic pattern accurately, incorporate it into the overall suspicion estimate, and then return to the clinical staging question and need for tissue.",
    "difficulty": "intermediate",
    "tags": [
      "station-explorer",
      "image-interpretation",
      "CNS"
    ]
  }
]

```

## File: `content/quizzes/staging-strategy.json`

```json
[
  {
    "id": "staging-priority-01",
    "moduleId": "station-explorer",
    "prompt": "A right lung primary has a large 10R node and a smaller 2L node across the left lateral tracheal border. Which station carries the greater immediate staging consequence if positive?",
    "type": "case-vignette",
    "caseTitle": "Big ipsilateral node, smaller contralateral node",
    "caseSummary": "The easier node to reach is not necessarily the one that changes the stage the most.",
    "options": [
      {
        "id": "a",
        "label": "The 2L node, because a contralateral mediastinal station can establish N3 disease",
        "rationale": "Correct. Contralateral mediastinal disease carries a larger staging consequence than ipsilateral hilar disease."
      },
      {
        "id": "b",
        "label": "The 10R node, because the largest node always determines the highest stage",
        "rationale": "Incorrect. Size alone does not determine the most consequential station."
      },
      {
        "id": "c",
        "label": "Neither matters because both are central thoracic nodes",
        "rationale": "Incorrect. Their laterality and zone create very different stage implications."
      },
      {
        "id": "d",
        "label": "Only station 7 would change staging in this scenario",
        "rationale": "Incorrect. Either node could matter, but the contralateral mediastinal node carries the bigger immediate staging consequence."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "A staging-first mindset asks which node most changes management. Here, a contralateral mediastinal node has greater immediate consequence than an ipsilateral hilar node, even if the hilar node is larger.",
    "difficulty": "advanced",
    "tags": [
      "station-explorer",
      "staging-strategy",
      "N3",
      "2L",
      "10R"
    ]
  },
  {
    "id": "staging-11ri-02",
    "moduleId": "station-explorer",
    "prompt": "For a right lung primary, malignant involvement of 11Ri is best taught as which nodal category?",
    "type": "single-best-answer",
    "options": [
      {
        "id": "a",
        "label": "Ipsilateral interlobar disease (N1)",
        "rationale": "Correct. Ipsilateral 11R substations are hilar/interlobar disease and count as N1."
      },
      {
        "id": "b",
        "label": "Ipsilateral mediastinal disease (N2)",
        "rationale": "Incorrect. 11Ri is interlobar rather than mediastinal."
      },
      {
        "id": "c",
        "label": "Contralateral mediastinal disease (N3)",
        "rationale": "Incorrect. That would require contralateral or supraclavicular involvement, not ipsilateral 11Ri."
      },
      {
        "id": "d",
        "label": "It has no formal effect on nodal stage",
        "rationale": "Incorrect. Station 11 disease is part of nodal staging."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "Station 11Ri is an ipsilateral interlobar station for a right-sided primary and is categorized as N1 when involved.",
    "difficulty": "basic",
    "tags": [
      "station-explorer",
      "staging-strategy",
      "11Ri",
      "N1"
    ]
  },
  {
    "id": "staging-contralateral-03",
    "moduleId": "station-explorer",
    "prompt": "A right-sided primary tumor has malignant involvement of 4L. What is the key teaching point?",
    "type": "single-best-answer",
    "options": [
      {
        "id": "a",
        "label": "4L is contralateral mediastinal disease and therefore N3",
        "rationale": "Correct. Contralateral mediastinal involvement upgrades staging to N3."
      },
      {
        "id": "b",
        "label": "4L is always N2 because all station 4 nodes are mediastinal",
        "rationale": "Incorrect. Laterality still matters for station 4."
      },
      {
        "id": "c",
        "label": "4L is hilar disease if the node is close to the left main bronchus",
        "rationale": "Incorrect. Station 4L remains mediastinal; the 10L handoff is below the left main pulmonary artery."
      },
      {
        "id": "d",
        "label": "The stage cannot be assigned until the node size is known",
        "rationale": "Incorrect. Size does not define the N category here."
      }
    ],
    "correctOptionIds": [
      "a"
    ],
    "explanation": "Station 4L is a left mediastinal station. For a right-sided primary, malignant involvement is contralateral mediastinal disease and is taught as N3.",
    "difficulty": "intermediate",
    "tags": [
      "station-explorer",
      "staging-strategy",
      "4L",
      "N3"
    ]
  }
]

```

## File: `content/stations/core-stations.json`

```json
[
  {
    "id": "2R",
    "displayName": "Station 2R",
    "shortLabel": "Upper Paratracheal",
    "iaslcName": "Right upper paratracheal",
    "zone": "Upper mediastinal",
    "laterality": "Right",
    "description": "Upper right paratracheal station in the superior mediastinum above the 4R level.",
    "accessNotes": "Best reviewed from the upper trachea with stable balloon contact and deliberate confirmation of the great-vessel relationships before needle planning.",
    "accessProfile": "EBUS",
    "bestEbusWindow": "Upper right lateral tracheal sweep above the 4R window and above the azygos transition.",
    "landmarkVessels": [
      "Superior vena cava",
      "Innominate vein",
      "Azygos transition"
    ],
    "boundaryDefinition": {
      "superior": "Lung apex / pleural cupula",
      "inferior": "Intersection of the caudal margin of the innominate vein with the trachea",
      "medial": "Left lateral border of the trachea",
      "lateral": "Right mediastinal pleura and great-vessel sidewall"
    },
    "boundaryNotes": [
      "Use the left lateral tracheal border, not the tracheal midline, to separate 2R from 2L.",
      "Think of 2R as the superior half of the right paratracheal stack, with 4R directly below it."
    ],
    "nStageImplication": {
      "ipsilateral": "Mediastinal disease (N2) for a right-sided primary.",
      "contralateral": "Contralateral mediastinal disease (N3) for a left-sided primary.",
      "note": "Laterality matters because 2R is a right mediastinal station defined relative to the left lateral tracheal border."
    },
    "clinicalImportance": "2R is not always the first positive station, but a malignant 2R node can upstage disease quickly and is easy to mislabel if the superior-inferior right paratracheal stack is lost.",
    "memoryCues": [
      "High right paratracheal corridor.",
      "2R sits above 4R in the same right-sided stack."
    ],
    "confusionPairs": [
      "2L",
      "4R"
    ],
    "commonConfusionPair": "4R",
    "relatedStationIds": [
      "2L",
      "4R"
    ],
    "whatYouSee": {
      "ct": [
        "A superior right paratracheal node above the 4R level.",
        "Relationship to the trachea matters more than rough symmetry.",
        "Check whether the node still lies to the right of the left lateral tracheal border."
      ],
      "bronchoscopy": [
        "Survey stays high on the right lateral tracheal wall.",
        "This is a tracheal rather than hilar window.",
        "You should not yet feel like you are descending into the carina or main bronchus."
      ],
      "ultrasound": [
        "Target sits in the superior right paratracheal field above 4R.",
        "Great-vessel orientation helps confirm laterality.",
        "Contact and depth matter because the window is relatively superior and narrow."
      ]
    },
    "safePunctureConsiderations": [
      "Confirm the tract relative to adjacent great vessels before committing to a pass.",
      "Do not let a seemingly midline target drift into a mislabeled 2L or 4R call."
    ],
    "stagingChangeFinding": "A malignant 2R node is N2 for a right lung primary and N3 for a left lung primary.",
    "assetKeys": {
      "map": "station-map-2r",
      "ct": "ct-2r",
      "bronchoscopy": "bronchoscopy-2r",
      "ultrasound": "ultrasound-2r"
    }
  },
  {
    "id": "2L",
    "displayName": "Station 2L",
    "shortLabel": "Upper Paratracheal",
    "iaslcName": "Left upper paratracheal",
    "zone": "Upper mediastinal",
    "laterality": "Left",
    "description": "Upper left paratracheal station above 4L in the superior mediastinum.",
    "accessNotes": "Keep the target clearly left-sided and superior before assuming you have reached 4L or a hilar structure.",
    "accessProfile": "EBUS",
    "bestEbusWindow": "Upper left tracheal survey before descending to the 4L window.",
    "landmarkVessels": [
      "Aortic arch",
      "Left common carotid and subclavian region",
      "Upper left mediastinal vascular contour"
    ],
    "boundaryDefinition": {
      "superior": "Lung apex / pleural cupula",
      "inferior": "Upper border of the aortic arch",
      "medial": "Left lateral border of the trachea",
      "lateral": "Left mediastinal pleura"
    },
    "boundaryNotes": [
      "2L begins left of the left lateral tracheal border and remains the superior half of the left paratracheal stack.",
      "If the node is already low and closely related to the aortic/pulmonary artery region, reconsider 4L."
    ],
    "nStageImplication": {
      "ipsilateral": "Mediastinal disease (N2) for a left-sided primary.",
      "contralateral": "Contralateral mediastinal disease (N3) for a right-sided primary.",
      "note": "Like 2R, this is a laterality-sensitive mediastinal station."
    },
    "clinicalImportance": "2L is a high-value station because a positive result can immediately define contralateral mediastinal disease for a right-sided primary.",
    "memoryCues": [
      "High left paratracheal corridor.",
      "Stay above the 4L window."
    ],
    "confusionPairs": [
      "2R",
      "4L"
    ],
    "commonConfusionPair": "4L",
    "relatedStationIds": [
      "2R",
      "4L"
    ],
    "whatYouSee": {
      "ct": [
        "Superior left paratracheal target above the 4L level.",
        "Node sits left of the left lateral tracheal border.",
        "The aortic arch helps confirm that you are still in the upper left mediastinum."
      ],
      "bronchoscopy": [
        "High left tracheal wall survey rather than a hilar or subcarinal view.",
        "Orientation should still feel proximal and tracheal.",
        "The learner should not yet feel the left main bronchus handoff."
      ],
      "ultrasound": [
        "Upper left paratracheal target above the 4L window.",
        "Great-vessel relationships confirm that the target remains left-sided.",
        "Depth and contact adjustments matter because the space is compact."
      ]
    },
    "safePunctureConsiderations": [
      "Reconfirm laterality before sampling because a mislabeled 2L node can create a major staging error.",
      "Use Doppler to clarify nearby vascular structures when the window is crowded."
    ],
    "stagingChangeFinding": "A malignant 2L node is N2 for a left lung primary and N3 for a right lung primary.",
    "assetKeys": {
      "map": "station-map-2l",
      "ct": "ct-2l",
      "bronchoscopy": "bronchoscopy-2l",
      "ultrasound": "ultrasound-2l"
    }
  },
  {
    "id": "4R",
    "displayName": "Station 4R",
    "shortLabel": "Lower Paratracheal",
    "iaslcName": "Right lower paratracheal",
    "zone": "Upper mediastinal",
    "laterality": "Right",
    "description": "Lower right paratracheal workhorse station beneath 2R and above the right hilar handoff.",
    "accessNotes": "This is a common staging target, so learners should be able to identify it reliably before comparing it with 10R.",
    "accessProfile": "EBUS",
    "bestEbusWindow": "Right lateral tracheal survey near the carinal descent, above the inferior azygos margin.",
    "landmarkVessels": [
      "Azygos vein",
      "Superior vena cava",
      "Right pulmonary artery region"
    ],
    "boundaryDefinition": {
      "superior": "Intersection of the caudal margin of the innominate vein with the trachea",
      "inferior": "Lower border of the azygos vein",
      "medial": "Left lateral border of the trachea",
      "lateral": "Right mediastinal pleura and vessel-bearing paratracheal soft tissue"
    },
    "boundaryNotes": [
      "4R remains right-sided relative to the left lateral tracheal border.",
      "Below the inferior azygos margin, the station becomes 10R rather than 4R."
    ],
    "nStageImplication": {
      "ipsilateral": "Mediastinal disease (N2) for a right-sided primary.",
      "contralateral": "Contralateral mediastinal disease (N3) for a left-sided primary.",
      "note": "4R often carries major staging weight because it is both accessible and clinically consequential."
    },
    "clinicalImportance": "4R is a classic EBUS staging station and a frequent decision-maker in mediastinal staging pathways.",
    "memoryCues": [
      "Right lower paratracheal workhorse.",
      "2R above, 10R below."
    ],
    "confusionPairs": [
      "2R",
      "10R"
    ],
    "commonConfusionPair": "10R",
    "relatedStationIds": [
      "2R",
      "10R"
    ],
    "whatYouSee": {
      "ct": [
        "Lower right paratracheal node above the hilar handoff.",
        "The azygos vein helps define the inferior border.",
        "Check whether the node is still paratracheal rather than hilar."
      ],
      "bronchoscopy": [
        "Right lateral tracheal wall near the carinal descent.",
        "Still proximal enough to feel paratracheal rather than right main bronchial.",
        "Orientation should remain central rather than branch-level."
      ],
      "ultrasound": [
        "Classic right paratracheal staging window.",
        "Target lies below 2R but above the 10R zone.",
        "Azygos anatomy helps avoid a 10R mislabel."
      ]
    },
    "safePunctureConsiderations": [
      "Use Doppler around the vessel-bearing right paratracheal field before passing the needle.",
      "Do not call a node 4R if it has already moved below the inferior azygos margin into the hilar zone."
    ],
    "stagingChangeFinding": "A malignant 4R node is N2 for a right lung primary and N3 for a left lung primary.",
    "assetKeys": {
      "map": "station-map-4r",
      "ct": "ct-4r",
      "bronchoscopy": "bronchoscopy-4r",
      "ultrasound": "ultrasound-4r"
    }
  },
  {
    "id": "4L",
    "displayName": "Station 4L",
    "shortLabel": "Lower Paratracheal",
    "iaslcName": "Left lower paratracheal",
    "zone": "Upper mediastinal",
    "laterality": "Left",
    "description": "Lower left paratracheal station beneath 2L and above the left hilar handoff.",
    "accessNotes": "Keep 4L conceptually separate from both 10L and the AP-window stations; it is still a paratracheal mediastinal target.",
    "accessProfile": "Both",
    "bestEbusWindow": "Left paratracheal window above the superior rim of the left main pulmonary artery and medial to the ligamentum arteriosum.",
    "landmarkVessels": [
      "Aortic arch",
      "Left main pulmonary artery",
      "Aortopulmonary window structures"
    ],
    "boundaryDefinition": {
      "superior": "Upper border of the aortic arch",
      "inferior": "Upper rim of the left main pulmonary artery",
      "medial": "Left lateral border of the trachea",
      "lateral": "Ligamentum arteriosum / AP-window side"
    },
    "boundaryNotes": [
      "4L is medial to the ligamentum arteriosum; stations 5 and 6 are lateral or anterolateral.",
      "Below the upper rim of the left main pulmonary artery, the station becomes 10L."
    ],
    "nStageImplication": {
      "ipsilateral": "Mediastinal disease (N2) for a left-sided primary.",
      "contralateral": "Contralateral mediastinal disease (N3) for a right-sided primary.",
      "note": "4L is frequently the left-sided station where laterality and boundary precision matter most."
    },
    "clinicalImportance": "4L is a pivotal left mediastinal station because it can separate ipsilateral mediastinal disease from contralateral mediastinal spread depending on tumor side.",
    "memoryCues": [
      "Left lower paratracheal before the hilar handoff.",
      "Medial to the ligamentum arteriosum."
    ],
    "confusionPairs": [
      "2L",
      "10L",
      "5"
    ],
    "commonConfusionPair": "10L",
    "relatedStationIds": [
      "2L",
      "10L"
    ],
    "whatYouSee": {
      "ct": [
        "Lower left paratracheal node above the left hilar boundary.",
        "Check the upper rim of the left main pulmonary artery for the 4L-to-10L transition.",
        "Stay medial to the ligamentum arteriosum when distinguishing 4L from station 5."
      ],
      "bronchoscopy": [
        "Left paratracheal view before the left main bronchus takes over the scene.",
        "Orientation should still feel mediastinal rather than branch-level.",
        "This is not yet the left hilar checkpoint."
      ],
      "ultrasound": [
        "Left paratracheal target below 2L and above 10L.",
        "Pulmonary artery position helps define the lower boundary.",
        "The AP-window relationship matters when distinguishing from lateral stations."
      ]
    },
    "safePunctureConsiderations": [
      "Reconfirm that the node is still above the superior left main pulmonary artery margin before calling it 4L.",
      "A crowded vascular field makes Doppler review essential before puncture."
    ],
    "stagingChangeFinding": "A malignant 4L node is N2 for a left lung primary and N3 for a right lung primary.",
    "assetKeys": {
      "map": "station-map-4l",
      "ct": "ct-4l",
      "bronchoscopy": "bronchoscopy-4l",
      "ultrasound": "ultrasound-4l"
    }
  },
  {
    "id": "7",
    "displayName": "Station 7",
    "shortLabel": "Subcarinal",
    "iaslcName": "Subcarinal",
    "zone": "Subcarinal",
    "laterality": "Midline",
    "description": "Midline subcarinal station beneath the carina, between the main bronchi.",
    "accessNotes": "Use station 7 as a reset point when the learner loses orientation because it bridges the right and left hilar pathways.",
    "accessProfile": "Both",
    "bestEbusWindow": "Subcarinal view below the carina and between the medial margins of the main bronchi.",
    "landmarkVessels": [
      "Main bronchi",
      "Left atrium region",
      "Subcarinal mediastinal vessels"
    ],
    "boundaryDefinition": {
      "superior": "Carina",
      "inferior": "Lower border of bronchus intermedius on the right and upper border of the left lower lobe bronchus on the left",
      "anterior": "Subcarinal space between the main bronchi",
      "posterior": "Extends posteriorly around the esophagus within the subcarinal zone"
    },
    "boundaryNotes": [
      "Station 7 lies between the medial margins of the main bronchi; nodes outside that space are station 10.",
      "Station 7 is not lateralized in the same way as stations 2, 4, 10, or 11."
    ],
    "nStageImplication": {
      "ipsilateral": "Mediastinal disease (N2) irrespective of primary side.",
      "contralateral": "Laterality distinction is not applied the same way because station 7 is midline.",
      "note": "Station 7 remains an ipsilateral mediastinal station regardless of whether the primary is right- or left-sided."
    },
    "clinicalImportance": "Station 7 is a central staging anchor and one of the highest-yield mediastinal targets in both teaching and practice.",
    "memoryCues": [
      "Midline below the carina.",
      "Bridge between right and left hilar pathways."
    ],
    "confusionPairs": [
      "10R",
      "10L"
    ],
    "commonConfusionPair": "10R/10L",
    "relatedStationIds": [
      "10R",
      "10L"
    ],
    "whatYouSee": {
      "ct": [
        "Node sits below the carina and between the main bronchi.",
        "Outside the medial bronchial margins is no longer station 7.",
        "Coronal orientation is especially helpful for its cranio-caudal boundaries."
      ],
      "bronchoscopy": [
        "The carinal bifurcation is the central anchor.",
        "This is a midline target rather than a lateralized hilar target.",
        "Orientation should feel centered below the main bifurcation."
      ],
      "ultrasound": [
        "Centerline subcarinal target beneath the bifurcation.",
        "A classic place to reset orientation when the map feels confusing.",
        "Do not drift outside the medial bronchial margins and still call it station 7."
      ]
    },
    "safePunctureConsiderations": [
      "Keep the target clearly subcarinal rather than hilar before sampling.",
      "Because station 7 is often broad, target the most representative viable tissue rather than the first visible edge."
    ],
    "stagingChangeFinding": "A malignant station 7 node is mediastinal disease (N2) irrespective of whether the primary is in the right or left lung.",
    "assetKeys": {
      "map": "station-map-7",
      "ct": "ct-7",
      "bronchoscopy": "bronchoscopy-7",
      "ultrasound": "ultrasound-7"
    }
  },
  {
    "id": "10R",
    "displayName": "Station 10R",
    "shortLabel": "Hilar",
    "iaslcName": "Right hilar",
    "zone": "Hilar",
    "laterality": "Right",
    "description": "Right hilar station adjacent to the main bronchus and hilar vessels, below the 4R boundary.",
    "accessNotes": "Teach 10R as the hilar checkpoint that follows 4R and precedes the 11R substations.",
    "accessProfile": "EBUS",
    "bestEbusWindow": "Right hilar view below the inferior azygos margin and adjacent to the right main bronchus.",
    "landmarkVessels": [
      "Right main pulmonary artery",
      "Proximal pulmonary veins",
      "Azygos vein boundary above"
    ],
    "boundaryDefinition": {
      "superior": "Lower border of the azygos vein",
      "inferior": "Proximal interlobar branching region leading into station 11",
      "medial": "Vertical line from the medial margin of the right main bronchus / tracheal bifurcation",
      "lateral": "Right hilar soft tissue and vessels"
    },
    "boundaryNotes": [
      "10R begins below the inferior azygos margin, where 4R ends.",
      "Nodes between the medial margins of the main bronchi belong to station 7; outside that space is station 10."
    ],
    "nStageImplication": {
      "ipsilateral": "Hilar disease (N1) for a right-sided primary.",
      "contralateral": "Contralateral hilar disease (N3) for a left-sided primary.",
      "note": "This is the key right-sided transition from mediastinal to hilar staging."
    },
    "clinicalImportance": "10R matters because the 4R-to-10R handoff can change a case from mediastinal disease to hilar disease or vice versa.",
    "memoryCues": [
      "Right hilar checkpoint.",
      "4R above, 11R beyond."
    ],
    "confusionPairs": [
      "4R",
      "11Rs",
      "11Ri",
      "7"
    ],
    "commonConfusionPair": "4R",
    "relatedStationIds": [
      "4R",
      "11Rs",
      "11Ri",
      "7"
    ],
    "whatYouSee": {
      "ct": [
        "Node sits at the right hilar handoff below the azygos boundary.",
        "Check whether the target remains adjacent to the main bronchus rather than an interlobar branch.",
        "If it is still between the medial main bronchial margins, reconsider station 7."
      ],
      "bronchoscopy": [
        "Right main bronchus checkpoint before more distal branching.",
        "This is beyond paratracheal territory but not yet deep interlobar.",
        "Orientation feels hilar rather than tracheal."
      ],
      "ultrasound": [
        "Right hilar target near the main bronchus entry zone.",
        "Too distal usually means you have drifted toward 11R.",
        "Too proximal or above the azygos margin means you may still be in 4R."
      ]
    },
    "safePunctureConsiderations": [
      "Use Doppler because hilar vessels can make the shortest path unsafe.",
      "Confirm that the target is hilar rather than subcarinal or lower paratracheal before sampling."
    ],
    "stagingChangeFinding": "A malignant 10R node is N1 for a right lung primary and N3 for a left lung primary.",
    "assetKeys": {
      "map": "station-map-10r",
      "ct": "ct-10r",
      "bronchoscopy": "bronchoscopy-10r",
      "ultrasound": "ultrasound-10r"
    }
  },
  {
    "id": "10L",
    "displayName": "Station 10L",
    "shortLabel": "Hilar",
    "iaslcName": "Left hilar",
    "zone": "Hilar",
    "laterality": "Left",
    "description": "Left hilar station below the 4L boundary and proximal to the left interlobar station.",
    "accessNotes": "Reinforce the idea that 10L is distal to 4L but not yet as distal as 11L.",
    "accessProfile": "EBUS",
    "bestEbusWindow": "Left hilar view below the upper rim of the left main pulmonary artery and adjacent to the left main bronchus.",
    "landmarkVessels": [
      "Left main pulmonary artery",
      "Left hilar vessels",
      "Left main bronchus"
    ],
    "boundaryDefinition": {
      "superior": "Upper rim of the left main pulmonary artery",
      "inferior": "Proximal interlobar transition toward station 11L",
      "medial": "Vertical line from the medial margin of the left main bronchus / tracheal bifurcation",
      "lateral": "Left hilar vessels and soft tissue"
    },
    "boundaryNotes": [
      "10L begins below the superior left main pulmonary artery margin, where 4L ends.",
      "A target that is still clearly paratracheal and above that vessel boundary should not be labeled 10L."
    ],
    "nStageImplication": {
      "ipsilateral": "Hilar disease (N1) for a left-sided primary.",
      "contralateral": "Contralateral hilar disease (N3) for a right-sided primary.",
      "note": "10L is the left hilar counterpart to 10R and often the main confusion pair for 4L."
    },
    "clinicalImportance": "10L is a frequent staging pivot because its distinction from 4L can change a finding from N1 to N2 or N3 depending on primary side.",
    "memoryCues": [
      "Left hilar checkpoint.",
      "Below 4L, before 11L."
    ],
    "confusionPairs": [
      "4L",
      "11L",
      "7"
    ],
    "commonConfusionPair": "4L",
    "relatedStationIds": [
      "4L",
      "11L",
      "7"
    ],
    "whatYouSee": {
      "ct": [
        "Node lies below the superior margin of the left main pulmonary artery.",
        "Target behaves like a hilar rather than paratracheal structure.",
        "If it is too distal, reconsider 11L."
      ],
      "bronchoscopy": [
        "Left main bronchus checkpoint before the interlobar split.",
        "This is more distal than 4L but not yet a branch-level station.",
        "The perspective should feel hilar rather than upper mediastinal."
      ],
      "ultrasound": [
        "Left hilar target near the left main bronchus entry zone.",
        "Keep the pulmonary artery boundary in mind when separating from 4L.",
        "Greater distal branching cues suggest 11L instead."
      ]
    },
    "safePunctureConsiderations": [
      "Do not call the station 10L unless you are truly below the superior left main pulmonary artery margin.",
      "Vascular crowding on the left makes Doppler review important before puncture."
    ],
    "stagingChangeFinding": "A malignant 10L node is N1 for a left lung primary and N3 for a right lung primary.",
    "assetKeys": {
      "map": "station-map-10l",
      "ct": "ct-10l",
      "bronchoscopy": "bronchoscopy-10l",
      "ultrasound": "ultrasound-10l"
    }
  },
  {
    "id": "11Rs",
    "displayName": "Station 11Rs",
    "shortLabel": "Interlobar",
    "iaslcName": "Right interlobar superior",
    "zone": "Hilar",
    "laterality": "Right",
    "description": "Right interlobar superior substation located between the right upper lobe bronchus and bronchus intermedius.",
    "accessNotes": "Treat 11Rs as a branch-level continuation beyond 10R, not as a second version of the hilar checkpoint.",
    "accessProfile": "EBUS",
    "bestEbusWindow": "Right interlobar view around the right upper lobe bronchus takeoff and bronchus intermedius.",
    "landmarkVessels": [
      "Right hilar vessels",
      "Right upper lobe bronchial takeoff",
      "Bronchus intermedius"
    ],
    "boundaryDefinition": {
      "superior": "Distal continuation beyond the 10R hilar level",
      "inferior": "Right upper lobe bronchus / bronchus intermedius interlobar region",
      "medial": "Peribronchial interlobar soft tissue",
      "lateral": "Branch-level hilar vessels"
    },
    "boundaryNotes": [
      "11Rs specifically refers to the superior right interlobar substation between the right upper lobe bronchus and bronchus intermedius.",
      "If the target still feels like a main bronchus checkpoint rather than a branch-level target, reconsider 10R."
    ],
    "nStageImplication": {
      "ipsilateral": "Interlobar disease (N1) for a right-sided primary.",
      "contralateral": "Contralateral hilar/interlobar disease (N3) for a left-sided primary.",
      "note": "The 11R substations remain N1 when ipsilateral because they are branch-level hilar/interlobar nodes."
    },
    "clinicalImportance": "Splitting 11R into 11Rs and 11Ri improves teaching precision and helps the learner link each branch point to a specific airway landmark.",
    "memoryCues": [
      "Superior right interlobar branch point.",
      "Between the right upper lobe bronchus and bronchus intermedius."
    ],
    "confusionPairs": [
      "10R",
      "11Ri"
    ],
    "commonConfusionPair": "10R",
    "relatedStationIds": [
      "10R",
      "11Ri"
    ],
    "whatYouSee": {
      "ct": [
        "Node sits beyond the right hilar checkpoint at the superior interlobar branch level.",
        "Lung window detail can help confirm the bronchial branching anatomy.",
        "This is more distal than 10R."
      ],
      "bronchoscopy": [
        "View is anchored by the right upper lobe bronchus and bronchus intermedius.",
        "This is a branch-level cue rather than a main bronchus cue.",
        "If the learner still feels at the main right bronchus, they are likely too proximal."
      ],
      "ultrasound": [
        "More distal right hilar target compared with 10R.",
        "Branch-level anatomy should be clear before assigning 11Rs.",
        "Keep the superior substation separate from 11Ri below."
      ]
    },
    "safePunctureConsiderations": [
      "Confirm the branch-level airway relationship because the distinction from 10R changes the teaching point and stage.",
      "Hilar vessels remain close by, so Doppler review still matters even in smaller branch-level targets."
    ],
    "stagingChangeFinding": "A malignant 11Rs node is N1 for a right lung primary and N3 for a left lung primary.",
    "assetKeys": {
      "map": "station-map-11rs",
      "ct": "ct-11rs",
      "bronchoscopy": "bronchoscopy-11rs",
      "ultrasound": "ultrasound-11rs"
    }
  },
  {
    "id": "11Ri",
    "displayName": "Station 11Ri",
    "shortLabel": "Interlobar",
    "iaslcName": "Right interlobar inferior",
    "zone": "Hilar",
    "laterality": "Right",
    "description": "Right interlobar inferior substation between the right middle and lower lobe bronchi.",
    "accessNotes": "Teach 11Ri as the more inferior branch-level right interlobar target, distinct from both 10R and 11Rs.",
    "accessProfile": "EBUS",
    "bestEbusWindow": "Right interlobar view around the middle and lower lobe bronchial branching region.",
    "landmarkVessels": [
      "Right hilar vessels",
      "Right middle lobe bronchus",
      "Right lower lobe bronchus"
    ],
    "boundaryDefinition": {
      "superior": "Distal continuation beyond the 10R hilar level",
      "inferior": "Interlobar space between the right middle and lower lobe bronchi",
      "medial": "Peribronchial interlobar soft tissue",
      "lateral": "Branch-level hilar vessels"
    },
    "boundaryNotes": [
      "11Ri is specifically the inferior right interlobar substation between the middle and lower lobe bronchi.",
      "Branch detail matters; this is not just a generic '11R' label."
    ],
    "nStageImplication": {
      "ipsilateral": "Interlobar disease (N1) for a right-sided primary.",
      "contralateral": "Contralateral hilar/interlobar disease (N3) for a left-sided primary.",
      "note": "Like 11Rs, this remains an N1 station when ipsilateral."
    },
    "clinicalImportance": "Separating 11Ri from 11Rs teaches the learner to use branch-level airway anatomy instead of treating all right interlobar nodes as one undifferentiated group.",
    "memoryCues": [
      "Inferior right interlobar branch point.",
      "Between the middle and lower lobe bronchi."
    ],
    "confusionPairs": [
      "10R",
      "11Rs"
    ],
    "commonConfusionPair": "11Rs",
    "relatedStationIds": [
      "10R",
      "11Rs"
    ],
    "whatYouSee": {
      "ct": [
        "Node sits at the inferior right interlobar branch level.",
        "The bronchial branch pattern is more important than a generic hilar silhouette.",
        "This is farther along the branching pathway than 10R."
      ],
      "bronchoscopy": [
        "Target is associated with the middle and lower lobe bronchial split.",
        "The view should feel clearly more distal than the 10R checkpoint.",
        "This is the inferior right interlobar branch point, not the superior one."
      ],
      "ultrasound": [
        "Inferior right interlobar EBUS view.",
        "The learner should name the branch-level landmark before naming the station.",
        "Confusion with 11Rs usually means the branch anatomy has not been reconstructed clearly."
      ]
    },
    "safePunctureConsiderations": [
      "Because the field is smaller and more distal, keep scope stability and Doppler review deliberate rather than rushed.",
      "Mislabeling 11Ri as 10R or 11Rs changes the teaching message even if the cytology result is the same N category."
    ],
    "stagingChangeFinding": "A malignant 11Ri node is N1 for a right lung primary and N3 for a left lung primary.",
    "assetKeys": {
      "map": "station-map-11ri",
      "ct": "ct-11ri",
      "bronchoscopy": "bronchoscopy-11ri",
      "ultrasound": "ultrasound-11ri"
    }
  },
  {
    "id": "11L",
    "displayName": "Station 11L",
    "shortLabel": "Interlobar",
    "iaslcName": "Left interlobar",
    "zone": "Hilar",
    "laterality": "Left",
    "description": "Left interlobar station beyond the left hilar checkpoint.",
    "accessNotes": "Use 11L as the left branch-level continuation beyond 10L and keep it separate from the left hilar checkpoint.",
    "accessProfile": "EBUS",
    "bestEbusWindow": "Left interlobar view distal to the left hilar checkpoint and along the branch-level airway landmark.",
    "landmarkVessels": [
      "Left hilar vessels",
      "Branch-level left bronchial anatomy",
      "Left pulmonary artery branches"
    ],
    "boundaryDefinition": {
      "superior": "Distal continuation beyond the 10L hilar level",
      "inferior": "Interlobar left bronchial branching region",
      "medial": "Peribronchial interlobar soft tissue",
      "lateral": "Left branch-level hilar vessels"
    },
    "boundaryNotes": [
      "11L is the branch-level continuation beyond 10L rather than a second hilar checkpoint.",
      "If the target still feels proximal and main-bronchial, reconsider 10L."
    ],
    "nStageImplication": {
      "ipsilateral": "Interlobar disease (N1) for a left-sided primary.",
      "contralateral": "Contralateral hilar/interlobar disease (N3) for a right-sided primary.",
      "note": "This is the left interlobar counterpart to the right 11R substations."
    },
    "clinicalImportance": "11L reinforces the learner's understanding that not every left-sided central node is paratracheal or hilar; some are distinctly interlobar branch-level targets.",
    "memoryCues": [
      "Left interlobar after the hilar checkpoint.",
      "Branch-level left airway cue, not paratracheal cue."
    ],
    "confusionPairs": [
      "10L"
    ],
    "commonConfusionPair": "10L",
    "relatedStationIds": [
      "10L"
    ],
    "whatYouSee": {
      "ct": [
        "Node sits beyond the left hilar checkpoint at the interlobar level.",
        "The branch-level bronchial relationship is more distal than 10L.",
        "Keep the branching anatomy in view when naming the station."
      ],
      "bronchoscopy": [
        "View is tied to the left branch-level airway beyond the main bronchus.",
        "This should feel more distal than 10L.",
        "The learner should be thinking branch-level left airway anatomy."
      ],
      "ultrasound": [
        "Left interlobar target beyond the left hilar checkpoint.",
        "Branch-level cue is the key discriminator from 10L.",
        "The EBUS image may be less familiar than 10L and benefits from deliberate orientation."
      ]
    },
    "safePunctureConsiderations": [
      "Do not force a 10L label onto a target that is clearly branch-level and more distal.",
      "If no approved EBUS still is available, teach the anatomy and staging logic anyway instead of inventing image certainty."
    ],
    "stagingChangeFinding": "A malignant 11L node is N1 for a left lung primary and N3 for a right lung primary.",
    "assetKeys": {
      "map": "station-map-11l",
      "ct": "ct-11l",
      "bronchoscopy": "bronchoscopy-11l",
      "ultrasound": "ultrasound-11l"
    }
  }
]

```

## File: `content/stations/station-correlations.json`

```json
[
  {
    "stationId": "2R",
    "aliases": [
      "Right upper paratracheal",
      "High right paratracheal"
    ],
    "landmarkChecklist": [
      "Stay high on the right side of the trachea.",
      "Keep the target above 4R and above the azygos handoff.",
      "Use the left lateral tracheal border rule for laterality rather than the tracheal midline.",
      "Think superior right paratracheal corridor, not hilar gateway."
    ],
    "views": {
      "ct": {
        "title": "Axial CT Correlate",
        "orientation": "High right paratracheal corridor above 4R.",
        "focusLabel": "Right of trachea, superior paratracheal stripe",
        "caption": "Start with the superior-right stack relationship, then confirm the node remains right of the left lateral tracheal border.",
        "visualAnchor": "upper-right"
      },
      "bronchoscopy": {
        "title": "Bronchoscopic Correlate",
        "orientation": "Upper right tracheal survey.",
        "focusLabel": "High right tracheal wall target",
        "caption": "This is still a tracheal view; if it feels hilar, you have likely drifted too far distal.",
        "visualAnchor": "upper-right"
      },
      "ultrasound": {
        "title": "EBUS Correlate",
        "orientation": "Superior right paratracheal EBUS window.",
        "focusLabel": "Upper right paratracheal node target",
        "caption": "Stack it above 4R and verify laterality with the tracheal border rule before assigning stage.",
        "visualAnchor": "upper-right"
      }
    },
    "quizItems": [
      {
        "id": "2r-ct",
        "viewId": "ct",
        "prompt": "Which station is highlighted in this high right paratracheal CT view?",
        "optionIds": [
          "2R",
          "4R",
          "2L",
          "10R"
        ],
        "explanation": "The correct answer is 2R because the target remains high, right-sided, and superior to the 4R level."
      }
    ]
  },
  {
    "stationId": "2L",
    "aliases": [
      "Left upper paratracheal",
      "High left paratracheal"
    ],
    "landmarkChecklist": [
      "Stay high on the left side of the trachea.",
      "Keep the target above the 4L boundary.",
      "Use the left lateral tracheal border rule before calling laterality.",
      "This is still a tracheal station, not a hilar one."
    ],
    "views": {
      "ct": {
        "title": "Axial CT Correlate",
        "orientation": "High left paratracheal corridor above 4L.",
        "focusLabel": "Left of trachea, superior paratracheal stripe",
        "caption": "Read 2L as the superior left paratracheal target before the 4L and 10L transitions.",
        "visualAnchor": "upper-left"
      },
      "bronchoscopy": {
        "title": "Bronchoscopic Correlate",
        "orientation": "Upper left tracheal survey.",
        "focusLabel": "High left tracheal wall target",
        "caption": "If the view feels distal or branch-level, you are likely no longer at 2L.",
        "visualAnchor": "upper-left"
      },
      "ultrasound": {
        "title": "EBUS Correlate",
        "orientation": "Superior left paratracheal EBUS window.",
        "focusLabel": "Upper left paratracheal node target",
        "caption": "Confirm left-sided position and keep the target above the 4L handoff.",
        "visualAnchor": "upper-left"
      }
    },
    "quizItems": [
      {
        "id": "2l-bronchoscopy",
        "viewId": "bronchoscopy",
        "prompt": "Which station is highlighted from the superior left tracheal wall perspective?",
        "optionIds": [
          "2L",
          "4L",
          "2R",
          "10L"
        ],
        "explanation": "The correct answer is 2L because the target remains superior and left paratracheal rather than lower or hilar."
      }
    ]
  },
  {
    "stationId": "4R",
    "aliases": [
      "Right lower paratracheal",
      "Workhorse 4R station"
    ],
    "landmarkChecklist": [
      "Place 4R below 2R and above 10R.",
      "Use the inferior azygos margin as the lower boundary.",
      "Keep the target paratracheal rather than hilar.",
      "Remember that the left lateral tracheal border still divides right from left."
    ],
    "views": {
      "ct": {
        "title": "Axial CT Correlate",
        "orientation": "Lower right paratracheal corridor above 10R.",
        "focusLabel": "Right lower paratracheal target",
        "caption": "Anchor 4R beneath 2R and above the azygos-defined hilar handoff.",
        "visualAnchor": "middle-right"
      },
      "bronchoscopy": {
        "title": "Bronchoscopic Correlate",
        "orientation": "Right lateral tracheal wall near the carinal descent.",
        "focusLabel": "Right paratracheal survey window",
        "caption": "This is still tracheal and paratracheal; a main-bronchus feel suggests 10R instead.",
        "visualAnchor": "middle-right"
      },
      "ultrasound": {
        "title": "EBUS Correlate",
        "orientation": "Right lower paratracheal EBUS window.",
        "focusLabel": "Classic 4R staging window",
        "caption": "Check the azygos boundary before calling the node hilar instead of paratracheal.",
        "visualAnchor": "middle-right"
      }
    },
    "quizItems": [
      {
        "id": "4r-ultrasound",
        "viewId": "ultrasound",
        "prompt": "Which station is highlighted in this right lower paratracheal EBUS view?",
        "optionIds": [
          "4R",
          "2R",
          "10R",
          "7"
        ],
        "explanation": "The correct answer is 4R because the target is still lower paratracheal and has not passed below the inferior azygos margin into 10R."
      }
    ]
  },
  {
    "stationId": "4L",
    "aliases": [
      "Left lower paratracheal",
      "Aortic-side 4L"
    ],
    "landmarkChecklist": [
      "Place 4L below 2L and above 10L.",
      "Use the upper rim of the left main pulmonary artery as the lower boundary.",
      "Keep 4L medial to the ligamentum arteriosum.",
      "Do not confuse a paratracheal target with an AP-window or hilar target."
    ],
    "views": {
      "ct": {
        "title": "Axial CT Correlate",
        "orientation": "Lower left paratracheal corridor above 10L.",
        "focusLabel": "Left lower paratracheal target",
        "caption": "Use the pulmonary artery boundary and the medial ligamentum relationship to separate 4L from neighboring stations.",
        "visualAnchor": "middle-left"
      },
      "bronchoscopy": {
        "title": "Bronchoscopic Correlate",
        "orientation": "Left paratracheal survey near the carina.",
        "focusLabel": "Left paratracheal survey window",
        "caption": "The view should still feel mediastinal rather than left hilar.",
        "visualAnchor": "middle-left"
      },
      "ultrasound": {
        "title": "EBUS Correlate",
        "orientation": "Left lower paratracheal EBUS window.",
        "focusLabel": "Left paratracheal target beneath 2L",
        "caption": "The biggest confusion pair is 10L, so confirm that the node remains above the superior left main pulmonary artery margin.",
        "visualAnchor": "middle-left"
      }
    },
    "quizItems": [
      {
        "id": "4l-ct",
        "viewId": "ct",
        "prompt": "Which station is highlighted in this lower left paratracheal CT panel?",
        "optionIds": [
          "4L",
          "2L",
          "10L",
          "7"
        ],
        "explanation": "The correct answer is 4L because the node remains left paratracheal and above the 10L boundary."
      }
    ]
  },
  {
    "stationId": "7",
    "aliases": [
      "Subcarinal",
      "Midline subcarinal anchor"
    ],
    "landmarkChecklist": [
      "Find the carina first.",
      "Keep the target between the medial margins of the main bronchi.",
      "Remember that station 7 is midline rather than right- or left-lateralized.",
      "Use this station as an orientation reset point."
    ],
    "views": {
      "ct": {
        "title": "Axial CT Correlate",
        "orientation": "Midline station beneath the carina.",
        "focusLabel": "Subcarinal bridge target",
        "caption": "If you lose orientation, station 7 is the quickest midline reset and staging anchor.",
        "visualAnchor": "center"
      },
      "bronchoscopy": {
        "title": "Bronchoscopic Correlate",
        "orientation": "Carinal bifurcation with a target just beneath it.",
        "focusLabel": "Subcarinal checkpoint",
        "caption": "Stay centered below the bifurcation; drifting laterally often means you are moving into station 10 territory.",
        "visualAnchor": "center"
      },
      "ultrasound": {
        "title": "EBUS Correlate",
        "orientation": "Midline subcarinal EBUS view.",
        "focusLabel": "Centerline node below the carina",
        "caption": "Think between the medial bronchial margins rather than simply 'somewhere central.'",
        "visualAnchor": "center"
      }
    },
    "quizItems": [
      {
        "id": "7-bronchoscopy",
        "viewId": "bronchoscopy",
        "prompt": "Which station is highlighted directly beneath the carinal bifurcation?",
        "optionIds": [
          "7",
          "10R",
          "10L",
          "4R"
        ],
        "explanation": "The correct answer is station 7 because the target is centered beneath the carina and between the medial main bronchial margins."
      }
    ]
  },
  {
    "stationId": "10R",
    "aliases": [
      "Right hilar",
      "Right hilar checkpoint"
    ],
    "landmarkChecklist": [
      "Place 10R below 4R and before 11R branch-level targets.",
      "Use the inferior azygos margin as the upper boundary.",
      "Check whether the node is outside the medial main bronchial margins rather than in station 7.",
      "This is a main-bronchus hilar cue, not yet a branch-level cue."
    ],
    "views": {
      "ct": {
        "title": "Axial CT Correlate",
        "orientation": "Right hilar entry zone beyond 4R.",
        "focusLabel": "Right hilar checkpoint",
        "caption": "The key distinction is hilar handoff rather than interlobar branching.",
        "visualAnchor": "lower-right"
      },
      "bronchoscopy": {
        "title": "Bronchoscopic Correlate",
        "orientation": "Right main bronchus before deeper branch points.",
        "focusLabel": "Right hilar airway landmark",
        "caption": "Stay at the main-bronchus hilar gateway before moving into 11Rs or 11Ri.",
        "visualAnchor": "lower-right"
      },
      "ultrasound": {
        "title": "EBUS Correlate",
        "orientation": "Right hilar EBUS window.",
        "focusLabel": "Right hilar target near the main bronchus entry",
        "caption": "If the cue feels too distal or too branch-specific, you may already be in 11R territory.",
        "visualAnchor": "lower-right"
      }
    },
    "quizItems": [
      {
        "id": "10r-ultrasound",
        "viewId": "ultrasound",
        "prompt": "Which station is highlighted at the right hilar checkpoint rather than the interlobar branch level?",
        "optionIds": [
          "10R",
          "4R",
          "11Rs",
          "7"
        ],
        "explanation": "The correct answer is 10R because the target sits at the right hilar main-bronchus checkpoint rather than the distal interlobar branch points."
      }
    ]
  },
  {
    "stationId": "10L",
    "aliases": [
      "Left hilar",
      "Left hilar checkpoint"
    ],
    "landmarkChecklist": [
      "Place 10L below 4L and before 11L.",
      "Use the superior left main pulmonary artery margin as the upper boundary.",
      "Make sure the target feels hilar rather than paratracheal.",
      "This is a main-bronchus left hilar cue, not yet the interlobar branch-level target."
    ],
    "views": {
      "ct": {
        "title": "Axial CT Correlate",
        "orientation": "Left hilar entry zone beyond 4L.",
        "focusLabel": "Left hilar checkpoint",
        "caption": "Keep the target distal to the paratracheal stack but proximal to the left interlobar branch point.",
        "visualAnchor": "lower-left"
      },
      "bronchoscopy": {
        "title": "Bronchoscopic Correlate",
        "orientation": "Left main bronchus before more distal branching.",
        "focusLabel": "Left hilar airway landmark",
        "caption": "This is the gateway between the 4L paratracheal logic and 11L branch-level logic.",
        "visualAnchor": "lower-left"
      },
      "ultrasound": {
        "title": "EBUS Correlate",
        "orientation": "Left hilar EBUS window.",
        "focusLabel": "Left hilar target near the main bronchus entry",
        "caption": "Use proximity to the main bronchus and the pulmonary artery boundary to separate 10L from 4L and 11L.",
        "visualAnchor": "lower-left"
      }
    },
    "quizItems": [
      {
        "id": "10l-ct",
        "viewId": "ct",
        "prompt": "Which station is highlighted at the left hilar checkpoint on CT?",
        "optionIds": [
          "10L",
          "4L",
          "11L",
          "7"
        ],
        "explanation": "The correct answer is 10L because the target sits below the 4L boundary but proximal to the interlobar left branch point."
      }
    ]
  },
  {
    "stationId": "11Rs",
    "aliases": [
      "Right interlobar superior",
      "Right upper-lobe takeoff interlobar station"
    ],
    "landmarkChecklist": [
      "Locate the right upper lobe bronchus and bronchus intermedius.",
      "Confirm you are beyond the 10R hilar checkpoint.",
      "Think branch-level anatomy, not main-bronchus anatomy.",
      "Keep 11Rs separate from 11Ri below."
    ],
    "views": {
      "ct": {
        "title": "CT Correlate",
        "orientation": "Right interlobar superior branch level.",
        "focusLabel": "11Rs between the RUL bronchus and bronchus intermedius",
        "caption": "Lung-window branch detail helps confirm this is the superior right interlobar substation.",
        "visualAnchor": "lower-right"
      },
      "bronchoscopy": {
        "title": "Bronchoscopic Correlate",
        "orientation": "Right upper lobe takeoff and bronchus intermedius.",
        "focusLabel": "Superior right interlobar airway cue",
        "caption": "This is a branch-level view beyond 10R and above 11Ri.",
        "visualAnchor": "lower-right"
      },
      "ultrasound": {
        "title": "EBUS Correlate",
        "orientation": "Superior right interlobar EBUS window.",
        "focusLabel": "11Rs branch-level target",
        "caption": "If the target still feels like a main bronchus checkpoint, reconsider 10R instead of 11Rs.",
        "visualAnchor": "lower-right"
      }
    },
    "quizItems": [
      {
        "id": "11rs-bronchoscopy",
        "viewId": "bronchoscopy",
        "prompt": "Which station is highlighted between the right upper lobe bronchus and bronchus intermedius?",
        "optionIds": [
          "11Rs",
          "10R",
          "11Ri",
          "4R"
        ],
        "explanation": "The correct answer is 11Rs because the airway landmark is the superior right interlobar branch point between the right upper lobe bronchus and bronchus intermedius."
      }
    ]
  },
  {
    "stationId": "11Ri",
    "aliases": [
      "Right interlobar inferior",
      "Right middle/lower lobe interlobar station"
    ],
    "landmarkChecklist": [
      "Find the middle and lower lobe bronchial split.",
      "Confirm you are more distal than 10R and more inferior than 11Rs.",
      "Use branch anatomy rather than general hilar intuition.",
      "This is the inferior right interlobar substation."
    ],
    "views": {
      "ct": {
        "title": "CT Correlate",
        "orientation": "Inferior right interlobar branch level.",
        "focusLabel": "11Ri between the middle and lower lobe bronchi",
        "caption": "This is the more inferior right interlobar target and should not be collapsed into a generic 11R label.",
        "visualAnchor": "lower-right"
      },
      "bronchoscopy": {
        "title": "Bronchoscopic Correlate",
        "orientation": "Right middle and lower lobe bronchial branching.",
        "focusLabel": "Inferior right interlobar airway cue",
        "caption": "The branch detail is what distinguishes 11Ri from both 10R and 11Rs.",
        "visualAnchor": "lower-right"
      },
      "ultrasound": {
        "title": "EBUS Correlate",
        "orientation": "Inferior right interlobar EBUS window.",
        "focusLabel": "11Ri branch-level target",
        "caption": "Name the branch relationship first; the station label follows from the airway anatomy.",
        "visualAnchor": "lower-right"
      }
    },
    "quizItems": [
      {
        "id": "11ri-ultrasound",
        "viewId": "ultrasound",
        "prompt": "Which station is highlighted at the inferior right interlobar branch level?",
        "optionIds": [
          "11Ri",
          "11Rs",
          "10R",
          "7"
        ],
        "explanation": "The correct answer is 11Ri because the target is at the inferior right interlobar branch point rather than the superior interlobar or hilar checkpoint."
      }
    ]
  },
  {
    "stationId": "11L",
    "aliases": [
      "Left interlobar",
      "Left branch-level hilar continuation"
    ],
    "landmarkChecklist": [
      "Confirm you are beyond the 10L hilar checkpoint.",
      "Look for left branch-level airway anatomy rather than a main-bronchus view.",
      "This is a left interlobar target, not a paratracheal one.",
      "Use 10L as the main confusion pair."
    ],
    "views": {
      "ct": {
        "title": "CT Correlate",
        "orientation": "Left interlobar branch level beyond 10L.",
        "focusLabel": "Left interlobar target",
        "caption": "The clue is branch-level left airway anatomy beyond the hilar checkpoint.",
        "visualAnchor": "lower-left"
      },
      "bronchoscopy": {
        "title": "Bronchoscopic Correlate",
        "orientation": "Left branch-level airway beyond the main bronchus.",
        "focusLabel": "Left interlobar airway cue",
        "caption": "This is more distal than 10L and should feel branch-level rather than hilar.",
        "visualAnchor": "lower-left"
      },
      "ultrasound": {
        "title": "EBUS Correlate",
        "orientation": "Left interlobar EBUS window.",
        "focusLabel": "11L branch-level target",
        "caption": "A more distal, branch-level left airway relationship supports 11L rather than 10L.",
        "visualAnchor": "lower-left"
      }
    },
    "quizItems": [
      {
        "id": "11l-bronchoscopy",
        "viewId": "bronchoscopy",
        "prompt": "Which station is highlighted beyond the left hilar checkpoint at the branch level?",
        "optionIds": [
          "11L",
          "10L",
          "4L",
          "7"
        ],
        "explanation": "The correct answer is 11L because the airway cue is branch-level and distal to the 10L hilar checkpoint."
      }
    ]
  }
]

```
