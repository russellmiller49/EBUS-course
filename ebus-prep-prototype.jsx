import { useState, useEffect, useRef } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────

const STATIONS = [
  { id: "2R", label: "2R", name: "Right Upper Paratracheal", zone: "upper", x: 56, y: 8,
    desc: "Upper right paratracheal station above the azygos arch.",
    access: "Superior right paratracheal sweep with careful vessel orientation.",
    cues: ["High right paratracheal corridor", "Vertical stack with 4R below"],
    confuses: ["4R"], landmarks: ["Right lateral tracheal wall, superior", "Above azygos arch", "Paratracheal stripe visible on CT"] },
  { id: "2L", label: "2L", name: "Left Upper Paratracheal", zone: "upper", x: 34, y: 8,
    desc: "Upper left paratracheal station near the superior mediastinal contour.",
    access: "Left-sided vascular relationships separate it from 4L.",
    cues: ["High left paratracheal, above the 4L stack", "Use laterality first, then border detail"],
    confuses: ["4L"], landmarks: ["Left lateral tracheal wall, superior", "Left subclavian artery nearby", "Above aortic arch"] },
  { id: "4R", label: "4R", name: "Right Lower Paratracheal", zone: "upper", x: 60, y: 26,
    desc: "The workhorse EBUS staging station. Lower right paratracheal extending toward the right main bronchus.",
    access: "Core EBUS staging target — the most commonly sampled station.",
    cues: ["Right lower paratracheal workhorse", "Anchor beneath 2R, above 10R"],
    confuses: ["2R", "10R"], landmarks: ["Right lateral tracheal wall, lower", "Azygos vein arch", "SVC anterolateral"] },
  { id: "4L", label: "4L", name: "Left Lower Paratracheal", zone: "upper", x: 30, y: 26,
    desc: "Lower left paratracheal station that pairs with 2L in the superior-to-inferior stack.",
    access: "Clear contrast between 4L and adjacent left hilar stations.",
    cues: ["Left lower paratracheal, below 2L", "Aortic-side mental map"],
    confuses: ["2L", "10L"], landmarks: ["Left lateral tracheal wall, lower", "Aortic arch relationship", "Ligamentum arteriosum region"] },
  { id: "7", label: "7", name: "Subcarinal", zone: "subcarinal", x: 45, y: 46,
    desc: "The subcarinal station — most frequently reviewed core staging station, sitting beneath the carina.",
    access: "Central landmark for orienting the entire mediastinal map.",
    cues: ["Centerline below the carina", "Bridge between right and left hilar pathways"],
    confuses: ["10R", "10L"], landmarks: ["Directly beneath carina", "Between mainstem bronchi", "Esophagus posterior", "Pulmonary artery anterior"] },
  { id: "10R", label: "10R", name: "Right Hilar", zone: "hilar", x: 68, y: 50,
    desc: "Right hilar station adjacent to the right main bronchus entry zone.",
    access: "Taught relative to 4R and 11R — the handoff from mediastinal to hilar.",
    cues: ["Right hilar handoff zone", "Main bronchus before lobar branching"],
    confuses: ["4R", "11R"], landmarks: ["Right main bronchus", "Right pulmonary artery", "Transition from mediastinal to hilar"] },
  { id: "10L", label: "10L", name: "Left Hilar", zone: "hilar", x: 22, y: 50,
    desc: "Left hilar station paired with 4L and 11L in the left-sided pathway.",
    access: "Distinction between 4L and 10L needs repeated reinforcement.",
    cues: ["Left hilar checkpoint", "Bridge from paratracheal to lobar landmarks"],
    confuses: ["4L", "11L"], landmarks: ["Left main bronchus", "Left pulmonary artery", "Transition from mediastinal to hilar"] },
  { id: "11R", label: "11R", name: "Right Interlobar", zone: "hilar", x: 74, y: 66,
    desc: "Right interlobar station extending beyond the right hilar entry landmark.",
    access: "Downstream branch from 10R — use branching as the mental clue.",
    cues: ["Right interlobar after the hilar gate", "Branching is the clue"],
    confuses: ["10R"], landmarks: ["Bronchus intermedius", "Between RUL and middle/lower lobe", "Interlobar pulmonary artery"] },
  { id: "11L", label: "11L", name: "Left Interlobar", zone: "hilar", x: 16, y: 66,
    desc: "Left interlobar station paired with 10L in the left hilar pathway.",
    access: "Use the branching relationship from the left hilar station.",
    cues: ["Left interlobar after the hilar checkpoint", "Branch-level cue, not carinal cue"],
    confuses: ["10L"], landmarks: ["Between LUL and LLL bronchi", "Left interlobar pulmonary artery", "Distal to left main bronchus"] },
];

const ZONE_COLORS = {
  upper: { bg: "#1a3a5c", border: "#2d6ca3", text: "#7fb8e8" },
  subcarinal: { bg: "#1a4a3c", border: "#2d8a6a", text: "#7be8c4" },
  hilar: { bg: "#3a1a4a", border: "#7a3d9a", text: "#c88ae8" },
};

const ZONE_LABELS = { upper: "Upper Mediastinal", subcarinal: "Subcarinal", hilar: "Hilar / Interlobar" };

const KNOBOLOGY_CONTROLS = [
  { id: "depth", name: "Depth", icon: "↕", defaultVal: 35, desc: "Controls how deep the ultrasound beam penetrates. Shallower depth magnifies near-field structures; deeper shows more tissue but reduces resolution.",
    good: "Target lymph node fills ~60-70% of screen depth", bad: "Node is a tiny speck at bottom of screen or only partial view visible",
    tip: "Start deep, then reduce depth to zoom in on your target. The node should occupy most of the screen." },
  { id: "gain", name: "Gain", icon: "☀", defaultVal: 50, desc: "Overall brightness of the image. Too high = washed out white. Too low = dark and unreadable.",
    good: "Balanced gray-scale with visible tissue planes", bad: "Blown-out white image or nearly black screen",
    tip: "Adjust gain so you can clearly distinguish the node border from surrounding tissue." },
  { id: "contrast", name: "Contrast", icon: "◐", defaultVal: 55, desc: "Difference between light and dark areas. Higher contrast sharpens boundaries but can lose subtle detail.",
    good: "Clear node borders with visible internal echo pattern", bad: "Flat gray image where everything looks the same",
    tip: "Increase contrast to sharpen the node border, but don't lose the internal architecture." },
  { id: "doppler", name: "Color Doppler", icon: "🔴", defaultVal: 0, desc: "Overlays color flow information showing blood vessel location and direction. Essential for avoiding vessels before needle insertion.",
    good: "Clear vessel identification with appropriate color box size", bad: "Color box too large (slows frame rate) or Doppler not used before TBNA",
    tip: "ALWAYS activate Doppler before needle pass. Keep the color box small and focused on the needle path." },
];

const PREP_LECTURES = [
  { id: 1, week: "Week 1", title: "Introduction to EBUS", subtitle: "Procedure nuts & bolts", duration: "2h 15m", topics: ["Equipment overview", "Scope anatomy & assembly", "Patient positioning", "Sedation considerations"], status: "available" },
  { id: 2, week: "Week 1", title: "Mediastinal Anatomy", subtitle: "IASLC station map & TNM-9 staging", duration: "2h 30m", topics: ["IASLC lymph node map", "Station boundaries", "TNM-9 updates", "N-staging patterns"], status: "available" },
  { id: 3, week: "Week 2", title: "Systematic EBUS Staging", subtitle: "Approach to the mediastinum", duration: "1h 45m", topics: ["Systematic survey technique", "Station identification by ultrasound", "Sampling order", "Adequate sampling criteria"], status: "available" },
  { id: 4, week: "Week 2", title: "Histology & Tissue Adequacy", subtitle: "Molecular testing essentials", duration: "1h 30m", topics: ["ROSE basics", "Specimen handling", "Molecular markers", "Tissue triage"], status: "available" },
  { id: 5, week: "Week 3", title: "Lymphoma & Non-Malignant Disease", subtitle: "Beyond lung cancer staging", duration: "1h 15m", topics: ["Lymphoma diagnosis by EBUS", "Sarcoidosis", "Infectious etiologies", "Flow cytometry considerations"], status: "available" },
  { id: 6, week: "Week 3", title: "Advanced EBUS Techniques", subtitle: "Elastography, miniforceps, cryobiopsy", duration: "2h 00m", topics: ["Strain elastography", "EBUS miniforceps biopsy", "Cryo-EBUS", "EUS-B technique"], status: "locked" },
  { id: 7, week: "Week 4", title: "Evidence Update 2026", subtitle: "Guideline-based planning & case synthesis", duration: "1h 45m", topics: ["AABIP guidelines update", "Case-based planning", "Pre-course knowledge check", "Liquid biopsy overview"], status: "locked" },
];

const QUIZ_QUESTIONS = [
  { id: 1, type: "station-id", question: "A lymph node is sampled from directly beneath the carina, between the mainstem bronchi. Which station?", options: ["4R", "7", "10R", "10L"], correct: "7", explanation: "Station 7 (subcarinal) sits directly beneath the carina between the two mainstem bronchi — the most commonly sampled station." },
  { id: 2, type: "knobology", question: "You're about to perform TBNA. What must you do before advancing the needle?", options: ["Increase depth", "Activate color Doppler", "Turn off freeze", "Increase gain"], correct: "Activate color Doppler", explanation: "Always activate color Doppler before TBNA to identify vessels in the needle path and avoid vascular injury." },
  { id: 3, type: "station-id", question: "You're at the right lateral tracheal wall, just above the carina. The azygos arch is visible. Which station?", options: ["2R", "4R", "10R", "7"], correct: "4R", explanation: "Station 4R (right lower paratracheal) is the workhorse station, located at the right lateral tracheal wall near the azygos arch, above the carina." },
  { id: 4, type: "knobology", question: "The ultrasound image is very bright and washed out, losing detail. Which control should you adjust first?", options: ["Decrease depth", "Decrease gain", "Increase contrast", "Activate Doppler"], correct: "Decrease gain", explanation: "An overly bright/washed out image means gain is too high. Reduce gain first to restore tissue contrast before fine-tuning other parameters." },
  { id: 5, type: "anatomy", question: "Which structure forms the posterior boundary of station 7?", options: ["Pulmonary artery", "Aortic arch", "Esophagus", "SVC"], correct: "Esophagus", explanation: "The esophagus lies directly posterior to the subcarinal space (station 7). This relationship is why EUS can also access this station." },
];

// ─── Components ─────────────────────────────────────────────────────────────

function StationNode({ station, isSelected, isHighlighted, onClick, mode }) {
  const zc = ZONE_COLORS[station.zone];
  const isQuizMode = mode === "quiz";
  return (
    <button
      onClick={() => onClick(station.id)}
      style={{
        position: "absolute", left: `${station.x}%`, top: `${station.y}%`,
        transform: "translate(-50%, -50%)",
        width: isSelected ? 52 : 44, height: isSelected ? 52 : 44,
        borderRadius: "50%",
        background: isSelected ? zc.border : isHighlighted ? `${zc.border}88` : `${zc.bg}cc`,
        border: `2px solid ${isSelected ? zc.text : zc.border}`,
        color: isSelected ? "#fff" : zc.text,
        fontFamily: "'DM Mono', monospace", fontSize: isSelected ? 15 : 13, fontWeight: 700,
        cursor: "pointer", transition: "all 0.2s ease",
        boxShadow: isSelected ? `0 0 20px ${zc.border}66, 0 0 40px ${zc.border}22` : "none",
        zIndex: isSelected ? 10 : 1, display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {isQuizMode ? "?" : station.label}
    </button>
  );
}

function ConnectionLine({ from, to }) {
  return (
    <line
      x1={`${from.x}%`} y1={`${from.y}%`}
      x2={`${to.x}%`} y2={`${to.y}%`}
      stroke="#ffffff10" strokeWidth="1.5" strokeDasharray="4 4"
    />
  );
}

const CONNECTIONS = [
  ["2R", "4R"], ["2L", "4L"], ["4R", "7"], ["4L", "7"],
  ["4R", "10R"], ["4L", "10L"], ["7", "10R"], ["7", "10L"],
  ["10R", "11R"], ["10L", "11L"],
];

function StationMap({ selected, onSelect, mode = "browse", highlightZone = null }) {
  const stationMap = Object.fromEntries(STATIONS.map(s => [s.id, s]));
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1.2", background: "linear-gradient(180deg, #0a1628 0%, #0d1f35 50%, #0a1628 100%)", borderRadius: 16, overflow: "hidden", border: "1px solid #1a2d4a" }}>
      {/* Trachea/Bronchi illustration */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Trachea */}
        <rect x="42" y="0" width="7" height="40" rx="3" fill="#ffffff06" stroke="#ffffff0a" strokeWidth="0.3" />
        {/* Carina split */}
        <path d="M 45.5 40 Q 45.5 44 35 56" fill="none" stroke="#ffffff0a" strokeWidth="0.5" />
        <path d="M 45.5 40 Q 45.5 44 58 52" fill="none" stroke="#ffffff0a" strokeWidth="0.5" />
        {/* Right bronchial tree */}
        <path d="M 58 52 Q 65 56 72 64" fill="none" stroke="#ffffff08" strokeWidth="0.4" />
        {/* Left bronchial tree */}
        <path d="M 35 56 Q 26 60 18 66" fill="none" stroke="#ffffff08" strokeWidth="0.4" />
        {/* Connection lines */}
        {CONNECTIONS.map(([a, b]) => (
          <ConnectionLine key={`${a}-${b}`} from={stationMap[a]} to={stationMap[b]} />
        ))}
      </svg>
      {/* Zone labels */}
      <div style={{ position: "absolute", top: 8, left: 12, fontSize: 9, color: "#7fb8e855", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5 }}>Upper Mediastinal</div>
      <div style={{ position: "absolute", top: "42%", left: 12, fontSize: 9, color: "#7be8c455", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5 }}>Subcarinal</div>
      <div style={{ position: "absolute", top: "58%", left: 12, fontSize: 9, color: "#c88ae855", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5 }}>Hilar</div>
      {/* Zone dividers */}
      <div style={{ position: "absolute", top: "38%", left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #ffffff08, transparent)" }} />
      <div style={{ position: "absolute", top: "56%", left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #ffffff08, transparent)" }} />
      {/* Station nodes */}
      {STATIONS.map(s => (
        <StationNode
          key={s.id} station={s}
          isSelected={selected === s.id}
          isHighlighted={highlightZone === s.zone}
          onClick={onSelect} mode={mode}
        />
      ))}
    </div>
  );
}

function StationDetail({ station }) {
  const zc = ZONE_COLORS[station.zone];
  return (
    <div style={{ background: "#0d1a2a", borderRadius: 14, border: `1px solid ${zc.border}33`, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${zc.border}22` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ background: zc.bg, border: `1px solid ${zc.border}`, borderRadius: 8, padding: "4px 10px", fontFamily: "'DM Mono', monospace", fontSize: 14, color: zc.text, fontWeight: 700 }}>{station.label}</span>
          <span style={{ fontSize: 11, color: "#ffffff44", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1 }}>{ZONE_LABELS[station.zone]}</span>
        </div>
        <h3 style={{ margin: 0, fontSize: 18, color: "#e8edf2", fontFamily: "'Source Serif 4', Georgia, serif" }}>{station.name}</h3>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <p style={{ margin: "0 0 14px", fontSize: 14, color: "#8899aa", lineHeight: 1.6 }}>{station.desc}</p>
        {/* Tri-view placeholder */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {["CT Axial", "Bronchoscopy", "EBUS"].map(v => (
            <div key={v} style={{ background: "#060e18", borderRadius: 10, border: "1px solid #1a2d4a", aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span style={{ fontSize: 22, opacity: 0.3 }}>{v === "CT Axial" ? "🫁" : v === "Bronchoscopy" ? "🔬" : "📡"}</span>
              <span style={{ fontSize: 9, color: "#4a6a8a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1 }}>{v}</span>
              <span style={{ fontSize: 8, color: "#2a4a6a", fontFamily: "'DM Mono', monospace" }}>Your image here</span>
            </div>
          ))}
        </div>
        {/* Landmarks */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#4a6a8a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Key Landmarks</div>
          {station.landmarks.map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
              <span style={{ color: zc.text, fontSize: 10, marginTop: 2 }}>◆</span>
              <span style={{ fontSize: 13, color: "#aabbcc", lineHeight: 1.5 }}>{l}</span>
            </div>
          ))}
        </div>
        {/* Memory cues */}
        <div style={{ background: `${zc.bg}66`, borderRadius: 10, padding: "12px 14px", border: `1px solid ${zc.border}22` }}>
          <div style={{ fontSize: 10, color: zc.text, fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Memory Cues</div>
          {station.cues.map((c, i) => (
            <p key={i} style={{ margin: "0 0 4px", fontSize: 13, color: "#c8d8e8", lineHeight: 1.5, fontStyle: "italic" }}>"{c}"</p>
          ))}
        </div>
        {/* Commonly confused */}
        {station.confuses.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: "#665544", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1 }}>Often confused with</span>
            {station.confuses.map(c => (
              <span key={c} style={{ background: "#2a1a0a", border: "1px solid #554422", borderRadius: 6, padding: "2px 8px", fontSize: 12, color: "#cc9966", fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{c}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KnobologyView() {
  const [activeControl, setActiveControl] = useState("depth");
  const [values, setValues] = useState({ depth: 35, gain: 50, contrast: 55, doppler: 0 });
  const ctrl = KNOBOLOGY_CONTROLS.find(c => c.id === activeControl);

  const brightness = 0.15 + values.gain / 140;
  const haze = 0.06 + (100 - values.contrast) / 180;
  const nodeSize = 30 + (100 - values.depth) * 0.5;
  const nodeY = 20 + values.depth * 0.55;
  const dopplerOpacity = values.doppler / 100;

  return (
    <div>
      {/* Simulated US frame */}
      <div style={{ background: "#000", borderRadius: 14, overflow: "hidden", marginBottom: 16, border: "1px solid #1a2d4a", position: "relative" }}>
        <div style={{ aspectRatio: "1.4", position: "relative", overflow: "hidden" }}>
          {/* Sector shape */}
          <div style={{ position: "absolute", top: "8%", left: "15%", right: "15%", bottom: "5%", background: `radial-gradient(ellipse at 50% 0%, rgba(40,60,80,${brightness}) 0%, rgba(20,30,40,${brightness * 0.5}) 60%, rgba(5,10,15,0.3) 100%)`, clipPath: "polygon(50% 0%, 5% 100%, 95% 100%)", }} />
          {/* Speckle noise */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: `${20 + Math.sin(i * 7.3) * 30}%`, top: `${15 + (i * 2.1) % 70}%`, width: 2, height: 2, borderRadius: "50%", background: `rgba(180,200,210,${Math.min(brightness * 0.6, 0.35) * (0.3 + Math.sin(i * 3.7) * 0.3)})`, }} />
          ))}
          {/* Haze overlay */}
          <div style={{ position: "absolute", inset: 0, background: `rgba(100,120,130,${haze})`, mixBlendMode: "screen" }} />
          {/* Target node */}
          <div style={{ position: "absolute", left: "50%", top: `${nodeY}%`, transform: "translate(-50%, -50%)", width: `${nodeSize}%`, height: `${nodeSize * 0.6}%`, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(60,80,90,${Math.min(brightness + 0.2, 0.8)}) 0%, rgba(40,55,65,${Math.min(brightness, 0.6)}) 70%)`, border: `1.5px solid rgba(200,220,230,${Math.min(values.contrast / 200 + 0.1, 0.6)})`, boxShadow: `inset 0 0 ${nodeSize * 0.3}px rgba(30,45,55,0.5)` }} />
          {/* Doppler overlay */}
          {values.doppler > 5 && (
            <div style={{ position: "absolute", left: "42%", top: `${nodeY - 8}%`, width: "20%", height: "14%", borderRadius: "50%", background: `radial-gradient(ellipse, rgba(220,40,30,${dopplerOpacity * 0.6}) 0%, rgba(30,80,220,${dopplerOpacity * 0.4}) 60%, transparent 100%)`, mixBlendMode: "screen", filter: "blur(2px)" }} />
          )}
          {/* Depth scale */}
          <div style={{ position: "absolute", right: 8, top: "12%", bottom: "8%", width: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {[0, 1, 2, 3, 4].map(i => (
              <span key={i} style={{ fontSize: 8, color: "#446688", fontFamily: "'DM Mono', monospace" }}>{Math.round(values.depth * (i / 4) * 0.6)}mm</span>
            ))}
          </div>
          {/* Status indicators */}
          <div style={{ position: "absolute", top: 8, left: 10, display: "flex", gap: 6 }}>
            <span style={{ fontSize: 9, color: "#446688", fontFamily: "'DM Mono', monospace" }}>D:{values.depth}</span>
            <span style={{ fontSize: 9, color: "#446688", fontFamily: "'DM Mono', monospace" }}>G:{values.gain}</span>
            {values.doppler > 5 && <span style={{ fontSize: 9, color: "#cc4444", fontFamily: "'DM Mono', monospace" }}>CFM</span>}
          </div>
        </div>
      </div>

      {/* Control selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {KNOBOLOGY_CONTROLS.map(c => (
          <button key={c.id} onClick={() => setActiveControl(c.id)} style={{
            flex: 1, padding: "10px 6px", borderRadius: 10,
            background: activeControl === c.id ? "#1a3a5c" : "#0d1a2a",
            border: `1px solid ${activeControl === c.id ? "#2d6ca3" : "#1a2d4a"}`,
            color: activeControl === c.id ? "#7fb8e8" : "#4a6a8a",
            fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer", textAlign: "center",
          }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>{c.icon}</div>
            {c.name}
          </button>
        ))}
      </div>

      {/* Active control detail */}
      {ctrl && (
        <div style={{ background: "#0d1a2a", borderRadius: 14, border: "1px solid #1a2d4a", padding: 16 }}>
          <h4 style={{ margin: "0 0 6px", color: "#e8edf2", fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 16 }}>{ctrl.name}</h4>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "#6a8aaa", lineHeight: 1.5 }}>{ctrl.desc}</p>
          {/* Slider */}
          <div style={{ marginBottom: 16 }}>
            <input type="range" min={0} max={100} value={values[ctrl.id]}
              onChange={e => setValues(v => ({ ...v, [ctrl.id]: +e.target.value }))}
              style={{ width: "100%", accentColor: "#2d6ca3" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#4a6a8a", fontFamily: "'DM Mono', monospace" }}>
              <span>0</span><span style={{ color: "#7fb8e8", fontSize: 13 }}>{values[ctrl.id]}</span><span>100</span>
            </div>
          </div>
          {/* Good vs Bad */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ background: "#0a1a12", borderRadius: 10, padding: 12, border: "1px solid #1a4a2a" }}>
              <div style={{ fontSize: 9, color: "#4a8a5a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>✓ Good</div>
              <p style={{ margin: 0, fontSize: 12, color: "#8ac8a0", lineHeight: 1.4 }}>{ctrl.good}</p>
            </div>
            <div style={{ background: "#1a0a0a", borderRadius: 10, padding: 12, border: "1px solid #4a1a1a" }}>
              <div style={{ fontSize: 9, color: "#8a4a4a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>✗ Bad</div>
              <p style={{ margin: 0, fontSize: 12, color: "#c88a8a", lineHeight: 1.4 }}>{ctrl.bad}</p>
            </div>
          </div>
          {/* Pro tip */}
          <div style={{ background: "#1a1a0a", borderRadius: 10, padding: 12, border: "1px solid #4a4a1a" }}>
            <div style={{ fontSize: 9, color: "#8a8a4a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>💡 Pro Tip</div>
            <p style={{ margin: 0, fontSize: 12, color: "#c8c888", lineHeight: 1.4 }}>{ctrl.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function LectureCard({ lecture, index }) {
  const isLocked = lecture.status === "locked";
  return (
    <div style={{
      background: isLocked ? "#0a0e14" : "#0d1a2a", borderRadius: 14,
      border: `1px solid ${isLocked ? "#111820" : "#1a2d4a"}`,
      padding: 16, opacity: isLocked ? 0.5 : 1,
      transition: "all 0.2s ease",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: isLocked ? "#111820" : "#1a2d3c", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            {isLocked ? "🔒" : "▶"}
          </span>
          <div>
            <span style={{ fontSize: 10, color: "#4a6a8a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1 }}>{lecture.week}</span>
            <h4 style={{ margin: 0, fontSize: 15, color: "#e8edf2", fontFamily: "'Source Serif 4', Georgia, serif" }}>{lecture.title}</h4>
          </div>
        </div>
        <span style={{ fontSize: 11, color: "#4a6a8a", fontFamily: "'DM Mono', monospace" }}>{lecture.duration}</span>
      </div>
      <p style={{ margin: "0 0 10px", fontSize: 13, color: "#6a8aaa", lineHeight: 1.4 }}>{lecture.subtitle}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {lecture.topics.map(t => (
          <span key={t} style={{ background: "#0a1628", border: "1px solid #1a2d4a", borderRadius: 6, padding: "2px 8px", fontSize: 10, color: "#5a7a9a", fontFamily: "'DM Mono', monospace" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function QuizView() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const q = QUIZ_QUESTIONS[current];
  const answered = answers[q.id] !== undefined;
  const isCorrect = answers[q.id] === q.correct;
  const totalCorrect = QUIZ_QUESTIONS.filter(qq => answers[qq.id] === qq.correct).length;
  const totalAnswered = Object.keys(answers).length;

  return (
    <div>
      {/* Progress */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {QUIZ_QUESTIONS.map((qq, i) => (
          <div key={qq.id} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: answers[qq.id] === qq.correct ? "#2d8a6a" : answers[qq.id] !== undefined ? "#8a3d3d" : i === current ? "#2d6ca3" : "#1a2d4a",
          }} />
        ))}
      </div>
      <div style={{ fontSize: 10, color: "#4a6a8a", fontFamily: "'DM Mono', monospace", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5 }}>
        Question {current + 1} of {QUIZ_QUESTIONS.length} · {totalCorrect}/{totalAnswered} correct
      </div>

      {/* Question */}
      <div style={{ background: "#0d1a2a", borderRadius: 14, border: "1px solid #1a2d4a", padding: 20, marginBottom: 16 }}>
        <div style={{ display: "inline-block", background: "#1a2d3c", borderRadius: 6, padding: "2px 8px", fontSize: 10, color: "#5a7a9a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 10 }}>{q.type.replace("-", " ")}</div>
        <p style={{ margin: 0, fontSize: 16, color: "#e8edf2", lineHeight: 1.6, fontFamily: "'Source Serif 4', Georgia, serif" }}>{q.question}</p>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {q.options.map(opt => {
          const isThis = answers[q.id] === opt;
          const isRight = opt === q.correct;
          let bg = "#0d1a2a", border = "#1a2d4a", color = "#8899aa";
          if (answered && isRight) { bg = "#0a1a12"; border = "#2d8a6a"; color = "#8ac8a0"; }
          else if (answered && isThis && !isRight) { bg = "#1a0a0a"; border = "#8a3d3d"; color = "#c88a8a"; }
          else if (isThis) { bg = "#1a2a3c"; border = "#2d6ca3"; color = "#7fb8e8"; }
          return (
            <button key={opt} onClick={() => { if (!answered) setAnswers(a => ({ ...a, [q.id]: opt })); }}
              style={{ padding: "14px 16px", borderRadius: 12, background: bg, border: `1.5px solid ${border}`, color, fontSize: 14, cursor: answered ? "default" : "pointer", textAlign: "left", fontFamily: "'DM Mono', monospace", transition: "all 0.15s ease", display: "flex", alignItems: "center", gap: 10 }}
            >
              {answered && isRight && <span>✓</span>}
              {answered && isThis && !isRight && <span>✗</span>}
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div style={{ background: isCorrect ? "#0a1a12" : "#1a0a0a", borderRadius: 12, padding: 16, border: `1px solid ${isCorrect ? "#1a4a2a" : "#4a1a1a"}`, marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: isCorrect ? "#8ac8a0" : "#c88a8a", lineHeight: 1.6 }}>{q.explanation}</p>
        </div>
      )}

      {/* Nav */}
      <div style={{ display: "flex", gap: 8 }}>
        <button disabled={current === 0} onClick={() => setCurrent(c => c - 1)}
          style={{ flex: 1, padding: "12px", borderRadius: 10, background: "#0d1a2a", border: "1px solid #1a2d4a", color: current === 0 ? "#2a3a4a" : "#7fb8e8", fontFamily: "'DM Mono', monospace", fontSize: 13, cursor: current === 0 ? "default" : "pointer" }}>← Previous</button>
        <button disabled={current === QUIZ_QUESTIONS.length - 1} onClick={() => setCurrent(c => c + 1)}
          style={{ flex: 1, padding: "12px", borderRadius: 10, background: current < QUIZ_QUESTIONS.length - 1 ? "#1a3a5c" : "#0d1a2a", border: `1px solid ${current < QUIZ_QUESTIONS.length - 1 ? "#2d6ca3" : "#1a2d4a"}`, color: current >= QUIZ_QUESTIONS.length - 1 ? "#2a3a4a" : "#e8edf2", fontFamily: "'DM Mono', monospace", fontSize: 13, cursor: current >= QUIZ_QUESTIONS.length - 1 ? "default" : "pointer" }}>Next →</button>
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "stations", label: "Stations", icon: "◎" },
  { id: "knobology", label: "Knobology", icon: "◐" },
  { id: "lectures", label: "Lectures", icon: "▶" },
  { id: "quiz", label: "Quiz", icon: "✎" },
];

export default function EBUSPrepApp() {
  const [view, setView] = useState("home");
  const [selectedStation, setSelectedStation] = useState(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardRevealed, setFlashcardRevealed] = useState(false);
  const station = STATIONS.find(s => s.id === selectedStation);

  return (
    <div style={{
      minHeight: "100vh", background: "#060e18",
      fontFamily: "'Source Serif 4', Georgia, serif",
      color: "#e8edf2", maxWidth: 480, margin: "0 auto", position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        input[type=range] { height: 6px; border-radius: 3px; }
        button { border: none; outline: none; }
        button:hover:not(:disabled) { filter: brightness(1.1); }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "20px 20px 0", background: "linear-gradient(180deg, #0a1628 0%, #060e18 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #1a3a5c, #2d6ca3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📡</div>
            <div>
              <div style={{ fontSize: 10, color: "#4a6a8a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 2 }}>SoCal EBUS 2026</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#c8d8e8" }}>Fellow Prep</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: "#3a5a7a", fontFamily: "'DM Mono', monospace", textAlign: "right" }}>
            <div>May 31, 2026</div>
            <div>Loma Linda</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 4, padding: "12px 20px 16px", overflowX: "auto" }}>
        {NAV_ITEMS.map(n => (
          <button key={n.id} onClick={() => setView(n.id)} style={{
            padding: "8px 14px", borderRadius: 10, whiteSpace: "nowrap",
            background: view === n.id ? "#1a3a5c" : "transparent",
            border: `1px solid ${view === n.id ? "#2d6ca3" : "#1a2d4a33"}`,
            color: view === n.id ? "#7fb8e8" : "#4a6a8a",
            fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>{n.icon}</span> {n.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "0 20px 100px" }}>

        {/* ─── HOME ─── */}
        {view === "home" && (
          <div>
            <div style={{ background: "linear-gradient(135deg, #0d1f35 0%, #1a3a5c 100%)", borderRadius: 16, padding: 24, marginBottom: 16, border: "1px solid #2d6ca366", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, #2d6ca322 0%, transparent 70%)" }} />
              <div style={{ fontSize: 10, color: "#7fb8e8", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>10th Annual</div>
              <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>Southwest Regional Fellow EBUS Course</h1>
              <p style={{ margin: "0 0 16px", fontSize: 13, color: "#8899aa", lineHeight: 1.5 }}>Pre-course review, live-day logistics, and offline study support.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[{ v: "May 31", l: "Course Date" }, { v: "~2.5:1", l: "Fellow:Faculty" }, { v: "24+", l: "Faculty" }].map(f => (
                  <div key={f.l} style={{ background: "#ffffff0a", borderRadius: 8, padding: "6px 12px" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#e8edf2", fontFamily: "'DM Mono', monospace" }}>{f.v}</div>
                    <div style={{ fontSize: 9, color: "#5a7a9a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>{f.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Module Cards */}
            <div style={{ fontSize: 10, color: "#4a6a8a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, marginTop: 20 }}>Study Modules</div>
            {[
              { id: "stations", icon: "◎", title: "Mediastinal Station Map", desc: "Interactive IASLC station map with landmarks, flashcards, and quiz", accent: "#2d6ca3" },
              { id: "knobology", icon: "◐", title: "EBUS Knobology", desc: "Master depth, gain, contrast, and Doppler controls", accent: "#2d8a6a" },
              { id: "lectures", icon: "▶", title: "Pre-Course Lectures", desc: "15+ hours of faculty-built video content organized by week", accent: "#7a3d9a" },
              { id: "quiz", icon: "✎", title: "Knowledge Check", desc: "Practice questions across stations, knobology, and anatomy", accent: "#cc9944" },
            ].map(m => (
              <button key={m.id} onClick={() => setView(m.id)} style={{
                display: "flex", alignItems: "center", gap: 14, width: "100%", padding: 16,
                background: "#0d1a2a", borderRadius: 14, border: "1px solid #1a2d4a",
                cursor: "pointer", marginBottom: 8, textAlign: "left",
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${m.accent}22`, border: `1px solid ${m.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{m.icon}</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, color: "#e8edf2", fontFamily: "'Source Serif 4', Georgia, serif" }}>{m.title}</h3>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#5a7a9a", lineHeight: 1.4 }}>{m.desc}</p>
                </div>
                <span style={{ color: "#2a4a6a", fontSize: 18, marginLeft: "auto", flexShrink: 0 }}>→</span>
              </button>
            ))}

            {/* Live Day Preview */}
            <div style={{ fontSize: 10, color: "#4a6a8a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10, marginTop: 24 }}>Live Day · May 31</div>
            <div style={{ background: "#0d1a2a", borderRadius: 14, border: "1px solid #1a2d4a", overflow: "hidden" }}>
              {[
                { time: "7:30", title: "Registration & Breakfast" },
                { time: "8:00", title: "Welcome & Course Overview" },
                { time: "8:35", title: "AM Tools & Techniques Rotations" },
                { time: "12:10", title: "Lunch — AABIP Guidelines Session" },
                { time: "13:10", title: "PM Synthesis & Execution Rotations" },
                { time: "16:15", title: "Final Jeopardy & Farewell" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: i < 5 ? "1px solid #1a2d4a44" : "none" }}>
                  <span style={{ fontSize: 11, color: "#4a6a8a", fontFamily: "'DM Mono', monospace", width: 40, flexShrink: 0 }}>{item.time}</span>
                  <span style={{ fontSize: 13, color: "#8899aa" }}>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── STATIONS ─── */}
        {view === "stations" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Mediastinal Stations</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#6a8aaa", lineHeight: 1.5 }}>Tap any station to see landmarks, memory cues, and image placeholders for CT / bronchoscopy / EBUS views.</p>

            <StationMap selected={selectedStation} onSelect={id => setSelectedStation(id === selectedStation ? null : id)} />

            {/* Flashcard strip */}
            <div style={{ display: "flex", gap: 6, marginTop: 16, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
              {STATIONS.map(s => {
                const zc = ZONE_COLORS[s.zone];
                return (
                  <button key={s.id} onClick={() => setSelectedStation(s.id)} style={{
                    padding: "6px 12px", borderRadius: 8, whiteSpace: "nowrap",
                    background: selectedStation === s.id ? zc.bg : "#0d1a2a",
                    border: `1px solid ${selectedStation === s.id ? zc.border : "#1a2d4a"}`,
                    color: selectedStation === s.id ? zc.text : "#5a7a9a",
                    fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer",
                  }}>
                    {s.label}
                  </button>
                );
              })}
            </div>

            {station && <StationDetail station={station} />}

            {!station && (
              <div style={{ textAlign: "center", padding: 40, color: "#3a5a7a" }}>
                <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>◎</div>
                <p style={{ margin: 0, fontSize: 13, fontFamily: "'DM Mono', monospace" }}>Tap a station on the map to explore</p>
              </div>
            )}

            {/* Flashcard mode */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 10, color: "#4a6a8a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Flashcard Drill</div>
              <div style={{ background: "#0d1a2a", borderRadius: 14, border: "1px solid #1a2d4a", padding: 24, textAlign: "center", minHeight: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                onClick={() => setFlashcardRevealed(r => !r)}>
                {!flashcardRevealed ? (
                  <>
                    <div style={{ fontSize: 28, fontWeight: 700, color: ZONE_COLORS[STATIONS[flashcardIndex].zone].text, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>
                      {STATIONS[flashcardIndex].label}
                    </div>
                    <div style={{ fontSize: 12, color: "#4a6a8a", fontFamily: "'DM Mono', monospace" }}>Tap to reveal</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 17, color: "#e8edf2", marginBottom: 6 }}>{STATIONS[flashcardIndex].name}</div>
                    <div style={{ fontSize: 11, color: "#5a7a9a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 8 }}>{ZONE_LABELS[STATIONS[flashcardIndex].zone]}</div>
                    <p style={{ margin: 0, fontSize: 13, color: "#6a8aaa", lineHeight: 1.5, maxWidth: 320 }}>{STATIONS[flashcardIndex].desc}</p>
                  </>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={() => { setFlashcardIndex(i => (i - 1 + STATIONS.length) % STATIONS.length); setFlashcardRevealed(false); }}
                  style={{ flex: 1, padding: 10, borderRadius: 10, background: "#0d1a2a", border: "1px solid #1a2d4a", color: "#7fb8e8", fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer" }}>← Prev</button>
                <button onClick={() => { setFlashcardIndex(i => (i + 1) % STATIONS.length); setFlashcardRevealed(false); }}
                  style={{ flex: 1, padding: 10, borderRadius: 10, background: "#1a3a5c", border: "1px solid #2d6ca3", color: "#e8edf2", fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer" }}>Next →</button>
              </div>
            </div>
          </div>
        )}

        {/* ─── KNOBOLOGY ─── */}
        {view === "knobology" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>EBUS Knobology</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#6a8aaa", lineHeight: 1.5 }}>Learn what each ultrasound control does and how to optimize your EBUS image. Adjust the sliders below and watch the simulated frame respond.</p>
            <KnobologyView />
            <div style={{ marginTop: 20, background: "#0d1a2a", borderRadius: 14, border: "1px solid #1a2d4a", padding: 16 }}>
              <div style={{ fontSize: 10, color: "#4a6a8a", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Image Optimization Sequence</div>
              {["1. Set depth — frame the target so it fills the screen", "2. Adjust gain — balance brightness across the image", "3. Fine-tune contrast — sharpen boundaries", "4. Activate Doppler — identify vessels before sampling"].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  <span style={{ color: "#2d6ca3", fontFamily: "'DM Mono', monospace", fontSize: 13, flexShrink: 0 }}>{step.slice(0, 2)}</span>
                  <span style={{ fontSize: 13, color: "#8899aa", lineHeight: 1.5 }}>{step.slice(3)}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#1a1a0a", borderRadius: 10, border: "1px solid #4a4a1a" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#8a8a5a", lineHeight: 1.5, fontFamily: "'DM Mono', monospace" }}>
                This is an educational approximation. Replace with annotated screenshots from your actual EBUS cases for maximum teaching value.
              </p>
            </div>
          </div>
        )}

        {/* ─── LECTURES ─── */}
        {view === "lectures" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Pre-Course Lectures</h2>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#6a8aaa", lineHeight: 1.5 }}>15+ hours of faculty-built video content. Complete before May 30, 2026.</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <div style={{ background: "#0a1a12", borderRadius: 8, padding: "6px 12px", border: "1px solid #1a4a2a" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#8ac8a0", fontFamily: "'DM Mono', monospace" }}>5/7</span>
                <span style={{ fontSize: 10, color: "#5a8a6a", fontFamily: "'DM Mono', monospace", marginLeft: 6 }}>Available</span>
              </div>
              <div style={{ background: "#1a1a0a", borderRadius: 8, padding: "6px 12px", border: "1px solid #4a4a1a" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#c8c888", fontFamily: "'DM Mono', monospace" }}>~13h</span>
                <span style={{ fontSize: 10, color: "#8a8a5a", fontFamily: "'DM Mono', monospace", marginLeft: 6 }}>Total runtime</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PREP_LECTURES.map((l, i) => <LectureCard key={l.id} lecture={l} index={i} />)}
            </div>
          </div>
        )}

        {/* ─── QUIZ ─── */}
        {view === "quiz" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Knowledge Check</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#6a8aaa", lineHeight: 1.5 }}>Test yourself across stations, knobology, and anatomy. Immediate feedback on every question.</p>
            <QuizView />
          </div>
        )}
      </div>

      {/* Bottom Nav (fixed) */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, background: "#060e18ee",
        borderTop: "1px solid #1a2d4a44", backdropFilter: "blur(12px)",
        display: "flex", justifyContent: "space-around", padding: "8px 0 12px",
      }}>
        {NAV_ITEMS.map(n => (
          <button key={n.id} onClick={() => setView(n.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            color: view === n.id ? "#7fb8e8" : "#3a5a7a", padding: "4px 8px",
          }}>
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace" }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
