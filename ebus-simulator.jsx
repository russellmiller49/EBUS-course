import { useState, useRef, useEffect, useCallback } from "react";

const DEFAULT_PARAMS = {
  gain: 50,
  contrast: 50,
  frequency: 10,
  dynamicRange: 60,
  tgcNear: 50,
  tgcMid: 50,
  tgcFar: 50,
  zoom: 1,
  depthCm: 4,
  colorMap: "gray",
};

const COLOR_MAPS = {
  gray: (v) => [v, v, v],
  sepia: (v) => [
    Math.min(255, v * 1.15),
    Math.min(255, v * 0.85),
    Math.min(255, v * 0.55),
  ],
  blue: (v) => [v * 0.3, v * 0.5, Math.min(255, v * 1.2)],
  amber: (v) => [
    Math.min(255, v * 1.2),
    Math.min(255, v * 0.9),
    v * 0.2,
  ],
};

function gaussianBlur(imageData, radius) {
  const { width, height, data } = imageData;
  const output = new Uint8ClampedArray(data.length);
  const size = radius * 2 + 1;
  const kernel = [];
  let sum = 0;
  for (let i = 0; i < size; i++) {
    const x = i - radius;
    const val = Math.exp(-(x * x) / (2 * (radius * 0.5) * (radius * 0.5)));
    kernel.push(val);
    sum += val;
  }
  for (let i = 0; i < size; i++) kernel[i] /= sum;

  // Horizontal
  const temp = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;
      for (let k = 0; k < size; k++) {
        const sx = Math.min(width - 1, Math.max(0, x + k - radius));
        const idx = (y * width + sx) * 4;
        r += data[idx] * kernel[k];
        g += data[idx + 1] * kernel[k];
        b += data[idx + 2] * kernel[k];
      }
      const idx = (y * width + x) * 4;
      temp[idx] = r;
      temp[idx + 1] = g;
      temp[idx + 2] = b;
      temp[idx + 3] = 255;
    }
  }
  // Vertical
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;
      for (let k = 0; k < size; k++) {
        const sy = Math.min(height - 1, Math.max(0, y + k - radius));
        const idx = (sy * width + x) * 4;
        r += temp[idx] * kernel[k];
        g += temp[idx + 1] * kernel[k];
        b += temp[idx + 2] * kernel[k];
      }
      const idx = (y * width + x) * 4;
      output[idx] = r;
      output[idx + 1] = g;
      output[idx + 2] = b;
      output[idx + 3] = 255;
    }
  }
  return new ImageData(output, width, height);
}

function addSpeckleNoise(imageData, amount) {
  const { data, width, height } = imageData;
  const output = new Uint8ClampedArray(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * amount;
    const multiplicative = 1 + (Math.random() - 0.5) * amount * 0.01;
    output[i] = Math.max(0, Math.min(255, data[i] * multiplicative + noise));
    output[i + 1] = Math.max(0, Math.min(255, data[i + 1] * multiplicative + noise));
    output[i + 2] = Math.max(0, Math.min(255, data[i + 2] * multiplicative + noise));
    output[i + 3] = 255;
  }
  return new ImageData(output, width, height);
}

function processImage(sourceCanvas, params) {
  const { width, height } = sourceCanvas;
  const ctx = sourceCanvas.getContext("2d");
  let imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Convert to grayscale luminance first
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = gray;
  }

  // Frequency simulation: lower freq = more blur (less resolution), higher = sharper
  const freqNorm = (params.frequency - 5) / 15; // -1 to 1 range (5-20 MHz)
  const blurRadius = Math.max(0, Math.round((1 - freqNorm) * 3));
  if (blurRadius > 0) {
    imageData = gaussianBlur(imageData, blurRadius);
  }

  // At higher frequencies, add subtle speckle (ultrasound artifact)
  if (params.frequency > 12) {
    const speckleAmount = (params.frequency - 12) * 3;
    imageData = addSpeckleNoise(imageData, speckleAmount);
  }

  const processedData = imageData.data;

  // Gain (overall brightness amplification)
  const gainFactor = Math.pow(2, (params.gain - 50) / 25);

  // Contrast (S-curve / sigmoid)
  const contrastFactor = Math.pow(2, (params.contrast - 50) / 20);

  // Dynamic range compression
  const drFactor = params.dynamicRange / 80;

  // TGC zones
  const tgcFactors = [
    Math.pow(2, (params.tgcNear - 50) / 30),
    Math.pow(2, (params.tgcMid - 50) / 30),
    Math.pow(2, (params.tgcFar - 50) / 30),
  ];

  // Depth-dependent attenuation (higher freq = more attenuation)
  const attenuationCoeff = 0.3 + (params.frequency - 5) * 0.06;

  const colorMapFn = COLOR_MAPS[params.colorMap] || COLOR_MAPS.gray;

  for (let y = 0; y < height; y++) {
    const yNorm = y / height;
    // TGC interpolation
    let tgc;
    if (yNorm < 0.33) {
      tgc = tgcFactors[0] + (tgcFactors[1] - tgcFactors[0]) * (yNorm / 0.33);
    } else if (yNorm < 0.66) {
      tgc = tgcFactors[1] + (tgcFactors[2] - tgcFactors[1]) * ((yNorm - 0.33) / 0.33);
    } else {
      tgc = tgcFactors[2];
    }

    // Depth attenuation
    const attenuation = Math.exp(-attenuationCoeff * yNorm * (params.depthCm / 4));

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let val = processedData[idx];

      // Apply depth attenuation
      val *= attenuation;

      // Apply TGC compensation
      val *= tgc;

      // Apply gain
      val *= gainFactor;

      // Apply dynamic range compression (log compression)
      val = Math.max(0, val);
      val = (Math.log(1 + val * drFactor) / Math.log(1 + 255 * drFactor)) * 255;

      // Apply contrast (sigmoid curve)
      val = val / 255;
      val = 1 / (1 + Math.exp(-contrastFactor * 6 * (val - 0.5)));
      val = val * 255;

      val = Math.max(0, Math.min(255, val));

      const [r, g, b] = colorMapFn(val);
      processedData[idx] = r;
      processedData[idx + 1] = g;
      processedData[idx + 2] = b;
      processedData[idx + 3] = 255;
    }
  }

  return imageData;
}

function Knob({ label, value, onChange, min = 0, max = 100, unit = "", size = 56 }) {
  const knobRef = useRef(null);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startVal = useRef(0);

  const angle = ((value - min) / (max - min)) * 270 - 135;

  const handlePointerDown = (e) => {
    dragging.current = true;
    startY.current = e.clientY;
    startVal.current = value;
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging.current) return;
    const dy = startY.current - e.clientY;
    const range = max - min;
    const delta = (dy / 150) * range;
    onChange(Math.max(min, Math.min(max, Math.round(startVal.current + delta))));
  };

  const handlePointerUp = () => {
    dragging.current = false;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, userSelect: "none" }}>
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #555, #1a1a1a)",
          border: "2px solid #444",
          boxShadow: "0 2px 8px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1)",
          cursor: "ns-resize",
          position: "relative",
          touchAction: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 2,
            height: size * 0.35,
            background: "#00ddff",
            boxShadow: "0 0 4px #00ddff",
            transformOrigin: "0 0",
            transform: `rotate(${angle}deg) translateY(-${size * 0.05}px)`,
            borderRadius: 1,
          }}
        />
        {/* Tick marks */}
        {[-135, -90, -45, 0, 45, 90, 135].map((a) => (
          <div
            key={a}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 1,
              height: 4,
              background: "#666",
              transformOrigin: `0 -${size * 0.52}px`,
              transform: `rotate(${a}deg)`,
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 10, color: "#00ddff", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: "#aaa", fontFamily: "'JetBrains Mono', monospace" }}>
        {value}{unit}
      </span>
    </div>
  );
}

function TGCSliders({ tgcNear, tgcMid, tgcFar, onChange }) {
  const sliderStyle = {
    writingMode: "vertical-lr",
    direction: "rtl",
    width: 18,
    height: 80,
    appearance: "none",
    background: "transparent",
    cursor: "pointer",
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      padding: "8px 4px",
      background: "rgba(0,0,0,0.3)",
      borderRadius: 6,
      border: "1px solid #333",
    }}>
      <span style={{ fontSize: 9, color: "#00ddff", letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace" }}>TGC</span>
      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
        {[
          { label: "N", value: tgcNear, key: "tgcNear" },
          { label: "M", value: tgcMid, key: "tgcMid" },
          { label: "F", value: tgcFar, key: "tgcFar" },
        ].map((s) => (
          <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <style>{`
              input[type="range"].tgc-slider {
                -webkit-appearance: none;
                appearance: none;
                background: transparent;
                cursor: pointer;
              }
              input[type="range"].tgc-slider::-webkit-slider-track {
                width: 3px;
                background: #333;
                border-radius: 2px;
              }
              input[type="range"].tgc-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 14px;
                height: 6px;
                background: #00ddff;
                border-radius: 2px;
                box-shadow: 0 0 4px rgba(0,221,255,0.5);
              }
            `}</style>
            <input
              type="range"
              className="tgc-slider"
              min={0}
              max={100}
              value={s.value}
              onChange={(e) => onChange(s.key, parseInt(e.target.value))}
              style={sliderStyle}
            />
            <span style={{ fontSize: 8, color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DepthScale({ depthCm, height }) {
  const marks = [];
  const step = depthCm <= 3 ? 0.5 : 1;
  for (let d = 0; d <= depthCm; d += step) {
    marks.push(d);
  }
  return (
    <div style={{ position: "absolute", right: -32, top: 0, height, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {marks.map((d, i) => (
        <span key={i} style={{ fontSize: 9, color: "#00ddff88", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
          {d.toFixed(d % 1 ? 1 : 0)}
        </span>
      ))}
    </div>
  );
}

export default function EBUSSimulator() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const sourceCanvasRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const animFrameRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 480, height: 400 });
  const [showOriginal, setShowOriginal] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [measurement, setMeasurement] = useState(null);
  const [measStart, setMeasStart] = useState(null);
  const [measMode, setMeasMode] = useState(false);

  const updateParam = useCallback((key, val) => {
    setParams((p) => ({ ...p, [key]: val }));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        const aspect = img.width / img.height;
        let w = 480, h = 400;
        if (aspect > w / h) {
          h = Math.round(w / aspect);
        } else {
          w = Math.round(h * aspect);
        }
        setCanvasSize({ width: w, height: h });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!image || !sourceCanvasRef.current) return;
    const sc = sourceCanvasRef.current;
    sc.width = canvasSize.width;
    sc.height = canvasSize.height;
    const ctx = sc.getContext("2d");
    ctx.drawImage(image, 0, 0, canvasSize.width, canvasSize.height);
  }, [image, canvasSize]);

  useEffect(() => {
    if (!image || !sourceCanvasRef.current || !displayCanvasRef.current) return;
    if (frozen) return;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(() => {
      const dc = displayCanvasRef.current;
      dc.width = canvasSize.width;
      dc.height = canvasSize.height;
      const ctx = dc.getContext("2d");
      const processed = processImage(sourceCanvasRef.current, params);
      ctx.putImageData(processed, 0, 0);

      // Scanline overlay
      ctx.strokeStyle = "rgba(0,221,255,0.03)";
      ctx.lineWidth = 1;
      for (let y = 0; y < canvasSize.height; y += 2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize.width, y);
        ctx.stroke();
      }
    });
  }, [image, params, canvasSize, frozen]);

  const handleCanvasClick = (e) => {
    if (!measMode) return;
    const rect = displayCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;
    const px = x * scaleX;
    const py = y * scaleY;

    if (!measStart) {
      setMeasStart({ x: px, y: py });
    } else {
      setMeasurement({ start: measStart, end: { x: px, y: py } });
      setMeasStart(null);
      setMeasMode(false);
    }
  };

  const getMeasurementDistance = () => {
    if (!measurement) return null;
    const dx = measurement.end.x - measurement.start.x;
    const dy = measurement.end.y - measurement.start.y;
    const pixelDist = Math.sqrt(dx * dx + dy * dy);
    const cmPerPixel = params.depthCm / canvasSize.height;
    return (pixelDist * cmPerPixel).toFixed(2);
  };

  const resetParams = () => setParams(DEFAULT_PARAMS);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#ccc",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "12px 8px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        width: "100%",
        maxWidth: 820,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        padding: "6px 12px",
        background: "linear-gradient(180deg, #1a1a1a, #111)",
        borderRadius: 6,
        border: "1px solid #2a2a2a",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: frozen ? "#ff4444" : "#00ff88",
            boxShadow: frozen ? "0 0 8px #ff4444" : "0 0 8px #00ff88",
          }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: "#00ddff", letterSpacing: 2 }}>EBUS SIMULATOR</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "#666", letterSpacing: 1 }}>CP-EBUS • CONVEX PROBE</span>
          <span style={{ fontSize: 9, color: "#444" }}>|</span>
          <span style={{ fontSize: 9, color: "#666", letterSpacing: 1 }}>{params.frequency} MHz</span>
        </div>
      </div>

      <canvas ref={sourceCanvasRef} style={{ display: "none" }} />

      <div style={{
        display: "flex",
        gap: 10,
        maxWidth: 820,
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        {/* TGC Panel */}
        {image && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
            <TGCSliders
              tgcNear={params.tgcNear}
              tgcMid={params.tgcMid}
              tgcFar={params.tgcFar}
              onChange={(key, val) => updateParam(key, val)}
            />
          </div>
        )}

        {/* Main Display */}
        <div style={{
          position: "relative",
          background: "#000",
          borderRadius: 8,
          border: "2px solid #222",
          boxShadow: "0 0 30px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,20,40,0.3)",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {!image ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: 480,
                height: 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                gap: 16,
                background: "radial-gradient(ellipse at center, #0a1520, #050a0f)",
              }}
            >
              <div style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: "2px dashed #00ddff44",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                color: "#00ddff44",
              }}>
                +
              </div>
              <span style={{ fontSize: 13, color: "#00ddff88", letterSpacing: 1 }}>
                LOAD EBUS IMAGE
              </span>
              <span style={{ fontSize: 10, color: "#445566" }}>
                Upload a bronchoscopy ultrasound image
              </span>
            </div>
          ) : (
            <>
              <canvas
                ref={displayCanvasRef}
                onClick={handleCanvasClick}
                style={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  cursor: measMode ? "crosshair" : "default",
                  display: showOriginal ? "none" : "block",
                }}
              />
              {showOriginal && (
                <canvas
                  ref={(el) => {
                    if (el && image) {
                      el.width = canvasSize.width;
                      el.height = canvasSize.height;
                      el.getContext("2d").drawImage(image, 0, 0, canvasSize.width, canvasSize.height);
                    }
                  }}
                  style={{ width: canvasSize.width, height: canvasSize.height }}
                />
              )}

              {/* Measurement overlay */}
              {measurement && !showOriginal && (
                <svg style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: canvasSize.width,
                  height: canvasSize.height,
                  pointerEvents: "none",
                }}>
                  <line
                    x1={measurement.start.x}
                    y1={measurement.start.y}
                    x2={measurement.end.x}
                    y2={measurement.end.y}
                    stroke="#ffff00"
                    strokeWidth={1.5}
                    strokeDasharray="4,3"
                  />
                  <circle cx={measurement.start.x} cy={measurement.start.y} r={3} fill="#ffff00" />
                  <circle cx={measurement.end.x} cy={measurement.end.y} r={3} fill="#ffff00" />
                  <text
                    x={(measurement.start.x + measurement.end.x) / 2 + 8}
                    y={(measurement.start.y + measurement.end.y) / 2 - 8}
                    fill="#ffff00"
                    fontSize={12}
                    fontFamily="JetBrains Mono"
                  >
                    {getMeasurementDistance()} cm
                  </text>
                </svg>
              )}

              {measStart && (
                <div style={{
                  position: "absolute",
                  top: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,0,0.15)",
                  border: "1px solid #ffff0066",
                  padding: "3px 10px",
                  borderRadius: 4,
                  fontSize: 10,
                  color: "#ffff00",
                }}>
                  Click second point to measure
                </div>
              )}

              {/* Depth scale */}
              <DepthScale depthCm={params.depthCm} height={canvasSize.height} />

              {/* Info overlay */}
              <div style={{
                position: "absolute",
                top: 6,
                left: 8,
                fontSize: 10,
                color: "#00ddff88",
                lineHeight: 1.6,
              }}>
                <div>G: {params.gain} &nbsp; C: {params.contrast}</div>
                <div>F: {params.frequency}MHz &nbsp; DR: {params.dynamicRange}dB</div>
                <div>D: {params.depthCm}cm</div>
              </div>

              {frozen && (
                <div style={{
                  position: "absolute",
                  top: 6,
                  right: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#ff4444",
                  textShadow: "0 0 8px #ff4444",
                  animation: "blink 1s step-end infinite",
                }}>
                  FROZEN
                </div>
              )}
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>

      {/* Controls */}
      {image && (
        <div style={{
          maxWidth: 820,
          width: "100%",
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
          {/* Action buttons */}
          <div style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            {[
              { label: frozen ? "UNFREEZE" : "FREEZE", action: () => setFrozen(!frozen), color: frozen ? "#ff4444" : "#00ddff" },
              { label: showOriginal ? "PROCESSED" : "ORIGINAL", action: () => setShowOriginal(!showOriginal), color: "#888" },
              { label: measMode ? "CANCEL MEAS" : "MEASURE", action: () => { setMeasMode(!measMode); setMeasStart(null); if (measMode) setMeasurement(null); }, color: "#ffff00" },
              { label: "NEW IMAGE", action: () => fileInputRef.current?.click(), color: "#888" },
              { label: "RESET", action: resetParams, color: "#ff8800" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${btn.color}44`,
                  color: btn.color,
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: 1,
                  padding: "6px 14px",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = `${btn.color}22`;
                  e.target.style.borderColor = btn.color;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.05)";
                  e.target.style.borderColor = `${btn.color}44`;
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Knob panel */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            flexWrap: "wrap",
            padding: "14px 16px",
            background: "linear-gradient(180deg, #161616, #111)",
            borderRadius: 8,
            border: "1px solid #222",
          }}>
            <Knob label="Gain" value={params.gain} onChange={(v) => updateParam("gain", v)} />
            <Knob label="Contrast" value={params.contrast} onChange={(v) => updateParam("contrast", v)} />
            <Knob label="Freq" value={params.frequency} min={5} max={20} unit="MHz" onChange={(v) => updateParam("frequency", v)} />
            <Knob label="Dyn Range" value={params.dynamicRange} min={20} max={100} unit="dB" onChange={(v) => updateParam("dynamicRange", v)} />
            <Knob label="Depth" value={params.depthCm} min={1} max={8} unit="cm" onChange={(v) => updateParam("depthCm", v)} />
            <Knob label="Zoom" value={params.zoom} min={1} max={4} unit="x" onChange={(v) => updateParam("zoom", v)} />
          </div>

          {/* Color map selector */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            padding: "8px 0",
          }}>
            <span style={{ fontSize: 10, color: "#666", letterSpacing: 1, alignSelf: "center" }}>MAP:</span>
            {Object.keys(COLOR_MAPS).map((cm) => (
              <button
                key={cm}
                onClick={() => updateParam("colorMap", cm)}
                style={{
                  background: params.colorMap === cm ? "#00ddff22" : "rgba(255,255,255,0.03)",
                  border: params.colorMap === cm ? "1px solid #00ddff" : "1px solid #333",
                  color: params.colorMap === cm ? "#00ddff" : "#666",
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: 1,
                  padding: "4px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                {cm}
              </button>
            ))}
          </div>

          {/* Info panel */}
          <div style={{
            background: "rgba(0,20,40,0.3)",
            border: "1px solid #1a2a3a",
            borderRadius: 6,
            padding: "10px 14px",
            fontSize: 10,
            color: "#557788",
            lineHeight: 1.8,
          }}>
            <div style={{ color: "#00ddff88", marginBottom: 4, fontWeight: 700, letterSpacing: 1 }}>PARAMETER GUIDE</div>
            <div><span style={{ color: "#aaa" }}>Gain</span> — Echo signal amplification (brightness). Drag knobs vertically.</div>
            <div><span style={{ color: "#aaa" }}>Contrast</span> — Dynamic separation between tissue echogenicity levels.</div>
            <div><span style={{ color: "#aaa" }}>Frequency</span> — 5–20 MHz. Higher = better resolution / more attenuation. Lower = deeper penetration / less detail.</div>
            <div><span style={{ color: "#aaa" }}>Dynamic Range</span> — Grayscale compression (dB). Lower = higher contrast, fewer gray shades.</div>
            <div><span style={{ color: "#aaa" }}>TGC</span> — Time Gain Compensation. Compensate for depth-dependent signal attenuation (Near/Mid/Far).</div>
            <div><span style={{ color: "#aaa" }}>Depth</span> — Field of view depth in cm. Affects attenuation simulation.</div>
            <div><span style={{ color: "#aaa" }}>Measure</span> — Click two points on image to calculate distance based on depth setting.</div>
          </div>
          <div style={{ textAlign: "center", fontSize: 9, color: "#334", padding: 4 }}>
            {imageName && `Source: ${imageName}`}
          </div>
        </div>
      )}
    </div>
  );
}
