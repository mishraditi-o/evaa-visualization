import React, { useEffect, useRef } from 'react';

export default function EventCanvas({ events, width = 640, height = 360 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const box = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, box.width * dpr);
    canvas.height = Math.max(1, box.height * dpr);
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#070b15';
    ctx.fillRect(0, 0, box.width, box.height);
    ctx.strokeStyle = 'rgba(122,146,180,.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= box.width; x += box.width / 8) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, box.height); ctx.stroke(); }
    for (let y = 0; y <= box.height; y += box.height / 6) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(box.width, y); ctx.stroke(); }
    for (const event of events) {
      const px = Math.max(0, Math.min(box.width, (Number(event.x) / width) * box.width));
      const py = Math.max(0, Math.min(box.height, (Number(event.y) / height) * box.height));
      ctx.fillStyle = Number(event.p) > 0 ? '#43e3d0' : '#f071c8';
      ctx.globalAlpha = 0.82;
      ctx.fillRect(px, py, 2, 2);
    }
    ctx.globalAlpha = 1;
  }, [events, width, height]);
  return <canvas className="event-canvas" ref={canvasRef} aria-label="2D event camera visualization" />;
}
