import React, { useMemo, useState } from 'react';
import { Activity, BarChart3, CircleDot, Database, Download, FileUp, Gauge, Layers3, Play, Pause, Search, Settings2, ShieldCheck, Waves } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import EventCanvas from './components/EventCanvas.jsx';

const demoEvents = Array.from({ length: 1600 }, (_, i) => {
  const angle = i * 0.071;
  const r = 35 + (i % 80) * 1.5;
  return { t: i * 1500, x: Math.max(0, Math.min(639, 320 + Math.cos(angle) * r + Math.sin(i * 0.17) * 65)), y: Math.max(0, Math.min(359, 180 + Math.sin(angle) * r * 0.65 + Math.cos(i * 0.11) * 44)), p: i % 3 === 0 ? -1 : 1 };
});
const bins = Array.from({ length: 28 }, (_, i) => ({ time: `${(i * 0.08).toFixed(2)}s`, positive: Math.round(40 + Math.abs(Math.sin(i * .47)) * 190 + (i % 4) * 15), negative: Math.round(22 + Math.abs(Math.cos(i * .31)) * 125) }));
const rate = Array.from({ length: 20 }, (_, i) => ({ time: `${(i * .1).toFixed(1)}s`, rate: Math.round(0.6 + Math.abs(Math.sin(i * .42)) * 1.1 + Math.cos(i * .18) * .18) }));

function Stat({ icon: Icon, label, value, note }) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><Icon size={17} /></div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>; }

export default function App() {
  const [playing, setPlaying] = useState(false);
  const [polarity, setPolarity] = useState('both');
  const [query, setQuery] = useState('');
  const [fileName, setFileName] = useState('demo-recording.parquet');
  const filteredEvents = useMemo(() => demoEvents.filter(e => (polarity === 'both' || (polarity === 'positive' && e.p > 0) || (polarity === 'negative' && e.p < 0)) && (query === '' || String(e.x).includes(query) || String(e.y).includes(query))).slice(0, 1600), [polarity, query]);
  const onUpload = (e) => { const file = e.target.files?.[0]; if (file) setFileName(file.name); };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Activity size={22}/></div><div><strong>EVAA</strong><span>EVENT ANALYSIS</span></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="project-switch"><Layers3 size={17}/><span><b>Mission Lab</b><small>Event recordings</small></span><span className="chevron">⌄</span></button>
      <div className="nav-label">ANALYSIS</div>
      <nav>
        <a className="nav-item active"><CircleDot size={17}/> Event viewer</a>
        <a className="nav-item"><Waves size={17}/> Temporal analysis</a>
        <a className="nav-item"><Layers3 size={17}/> Spatial analysis</a>
        <a className="nav-item"><Gauge size={17}/> Performance</a>
        <a className="nav-item"><BarChart3 size={17}/> Reports</a>
      </nav>
      <div className="sidebar-bottom"><div className="engine-status"><span className="status-dot"/><div><b>Engine ready</b><small>Local workspace</small></div></div><div className="user-row"><div className="avatar">EV</div><div><b>EVAA Workspace</b><small>Developer mode</small></div><Settings2 size={16}/></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="crumb">Workspace <span>/</span> Recordings <span>/</span> <b>Event viewer</b></div><div className="top-actions"><span className="environment"><i/> DEMO DATA</span><button className="icon-button" title="Search"><Search size={17}/></button><button className="export-button" onClick={() => window.alert('Connect the EVAA export API to enable downloads.')}><Download size={16}/> Export</button></div></header>
      <section className="page-heading"><div><div className="eyebrow">EVENT VISUALIZATION & ANALYSIS</div><h1>Event viewer <span className="live-pill"><i/> READY</span></h1><p>Explore event-camera activity across time, space, and polarity.</p></div><label className="upload-button"><FileUp size={17}/> Select recording<input type="file" accept=".parquet,.h5,.hdf5,.csv,.txt,.npy,.mat" onChange={onUpload}/></label></section>
      <section className="recording-bar"><div className="file-symbol"><Database size={19}/></div><div className="recording-info"><b>{fileName}</b><span>Event stream · 640 × 360 sensor · timestamps in µs</span></div><span className="file-status"><ShieldCheck size={15}/> Sample loaded</span><button className="more-button">•••</button></section>
      <section className="stats-grid"><Stat icon={CircleDot} label="TOTAL EVENTS" value="3.77 M" note="Events in recording"/><Stat icon={Waves} label="DURATION" value="2.40 s" note="Recorded time span"/><Stat icon={Layers3} label="RESOLUTION" value="640 × 360" note="Sensor dimensions"/><Stat icon={Gauge} label="AVG. EVENT RATE" value="1.57 Mev/s" note="Events per second"/></section>
      <section className="content-grid"><div className="panel viewer-panel"><div className="panel-heading"><div><h2>Event stream</h2><p>Spatial distribution of detected events</p></div><div className="panel-controls"><select value={polarity} onChange={e => setPolarity(e.target.value)} aria-label="Polarity filter"><option value="both">Both polarities</option><option value="positive">Positive (+1)</option><option value="negative">Negative (-1)</option></select><button className="icon-button" title="Visualization options"><Settings2 size={16}/></button></div></div><div className="canvas-wrap"><div className="axis-y">Y · pixels</div><EventCanvas events={filteredEvents}/><div className="axis-x">X · pixels</div><div className="canvas-badge">640 × 360 PX</div></div><div className="legend"><span><i className="cyan-dot"/> Positive events</span><span><i className="pink-dot"/> Negative events</span><span className="legend-right">Showing {filteredEvents.length.toLocaleString()} sample points</span></div><div className="playback"><button className="play-button" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={15}/> : <Play size={15}/>}</button><div className="timeline-area"><div className="timeline-labels"><span>0.00 s</span><b>{playing ? 'Playing preview' : 'Preview paused'}</b><span>2.40 s</span></div><input type="range" min="0" max="2400" defaultValue="780" aria-label="Playback time"/></div><span className="timestamp">t = 780,000 µs</span></div></div>
      <div className="right-column"><div className="panel inspector"><div className="panel-heading"><div><h2>Event inspector</h2><p>Inspect event coordinates</p></div><CircleDot size={17} className="muted-icon"/></div><label className="search-field"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter by x or y coordinate"/></label><div className="event-details"><div><span>Timestamp</span><b>124,508 <small>µs</small></b></div><div><span>X coordinate</span><b>318 <small>px</small></b></div><div><span>Y coordinate</span><b>207 <small>px</small></b></div><div><span>Polarity</span><b className="polarity-positive">+1 <small>positive</small></b></div></div></div><div className="panel polarity-panel"><div className="panel-heading"><div><h2>Polarity distribution</h2><p>Event type split</p></div></div><div className="polarity-chart"><div className="donut"><div><b>3.77M</b><span>Total events</span></div></div><div className="polarity-legend"><div><i className="cyan-dot"/><span>Positive<b>62.4%</b></span></div><div><i className="pink-dot"/><span>Negative<b>37.6%</b></span></div></div></div></div></div></section>
      <section className="bottom-grid"><div className="panel chart-panel"><div className="panel-heading"><div><h2>Temporal event activity</h2><p>Event counts per time bin</p></div><span className="chart-unit">EVENTS / BIN</span></div><div className="chart-body"><ResponsiveContainer width="100%" height="100%"><BarChart data={bins} barGap={1}><CartesianGrid strokeDasharray="3 3" stroke="#263044" vertical={false}/><XAxis dataKey="time" tick={{fill:'#8490a6',fontSize:10}} axisLine={false} tickLine={false} interval={5}/><YAxis tick={{fill:'#8490a6',fontSize:10}} axisLine={false} tickLine={false} width={32}/><Tooltip contentStyle={{background:'#111a2b',border:'1px solid #2a3549',borderRadius:8,color:'#edf3ff'}}/><Bar dataKey="positive" stackId="a" fill="#43e3d0" radius={[2,2,0,0]}/><Bar dataKey="negative" stackId="a" fill="#f071c8" radius={[2,2,0,0]}/></BarChart></ResponsiveContainer></div></div><div className="panel chart-panel"><div className="panel-heading"><div><h2>Event rate</h2><p>Activity over recording time</p></div><span className="chart-unit">MEV / S</span></div><div className="chart-body"><ResponsiveContainer width="100%" height="100%"><AreaChart data={rate}><defs><linearGradient id="rateFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c8cff" stopOpacity={0.28}/><stop offset="100%" stopColor="#7c8cff" stopOpacity={0.01}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#263044" vertical={false}/><XAxis dataKey="time" tick={{fill:'#8490a6',fontSize:10}} axisLine={false} tickLine={false} interval={4}/><YAxis tick={{fill:'#8490a6',fontSize:10}} axisLine={false} tickLine={false} width={32}/><Tooltip contentStyle={{background:'#111a2b',border:'1px solid #2a3549',borderRadius:8,color:'#edf3ff'}}/><Area type="monotone" dataKey="rate" stroke="#8a96ff" strokeWidth={2} fill="url(#rateFill)"/></AreaChart></ResponsiveContainer></div></div></section>
      <footer className="footer"><span>EVAA · Event Visualization & Analysis Application</span><span>UI prototype · Demo data only</span></footer>
    </main>
  </div>;
}
